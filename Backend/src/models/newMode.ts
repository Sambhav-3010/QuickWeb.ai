import dotenv from "dotenv";
import type { Response } from "express";
import { getSystemPrompt } from "../defaults/prompts.js";
import { OpenRouter } from "@openrouter/sdk";

dotenv.config();
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const openrouter = new OpenRouter({
  apiKey: process.env.API_KEY
});

async function callAI(messages: ChatMessage[], res: Response): Promise<void> {
  const input: ChatMessage[] = [
    ...messages,
    {
      role: "system",
      content: getSystemPrompt(),
    },
  ];
  const stream = await openrouter.chat.send({
  model: "qwen/qwen3-coder:free",
  messages: input,
  stream: true
});

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta as any;
    const content = (delta?.reasoning_content ||
      delta?.content ||
      "") as string;

    if (content) {
      res.write(content);
    }
  }

  res.end();
}

export default callAI;
