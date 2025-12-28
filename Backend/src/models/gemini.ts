import dotenv from "dotenv";
import type { Response } from "express";
import { getSystemPrompt } from "../defaults/prompts.js";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string
});


async function callAI(messages: ChatMessage[], res: Response): Promise<void> {
    const history = messages
    .filter(msg => msg.role !== "system")
    .map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
  const result = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: history,
    config: {
      systemInstruction: getSystemPrompt(),
    }
  });

  for await (const chunk of result) {
    const content = chunk.text;

    if (content) {
      res.write(content);
    }
  }

  res.end();
}

export default callAI;