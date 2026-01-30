import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { BASE_PROMPT } from "./defaults/prompts.js";
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/react.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Template endpoint - returns prompts/context for frontend to use with Puter.js
app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "system",
          content: `Analyze the user's project request. Classify the required tech stack into exactly one of these three categories: 'react', 'node', or 'neither'.
          Selection Criteria:
          Return 'react' if the request is for a frontend application, UI component, or browser-based interface.
          Return 'node' if the request is for a backend server, API, CLI tool, or filesystem-based script.
          Return 'neither' if the request involves other stacks (like Python, Java) or is ambiguous.
          Constraint: Output MUST be exactly one word. No punctuation, no explanation, no markdown.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 100,
      stream: false,
    });
    const answer = response.choices[0]?.message.content;
    if (answer == "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You cant access this" });
    return;
  } catch (error) {
    console.error("Template generation error:", error);
    res.status(500).json({ message: "Error processing template request" });
  }
});

// Import the AI models for fallback
import callGemini from "./models/gemini.js";
import callClaude from "./models/claude.js";

// Streaming chat endpoint - fallback when Puter.js times out
app.post("/chat", async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ message: "Messages array is required" });
    return;
  }

  // Set headers for streaming
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    if (model === "gemini") {
      await callGemini(messages, res);
    } else if (model === "anthropic") {
      await callClaude(messages, res);
    } else {
      // Default to Gemini if no model specified
      await callGemini(messages, res);
    }
  } catch (error) {
    console.error("Chat generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error during AI generation" });
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server Started - Using Puter.js for AI generation");
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
