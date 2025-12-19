import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import callAI from "./models/meta.js";
import OpenAI from "openai";
import { BASE_PROMPT, getSystemPrompt } from "./defaults/prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await openai.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: [
      {
        role: "system",
        content:
          "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
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
});

app.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const message = req.body.message;
  
  try {
    await callAI(message, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Error generating stream");
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
