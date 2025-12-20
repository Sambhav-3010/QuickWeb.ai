import dotenv from "dotenv";
import OpenAI from "openai";
import type { Response } from "express";
import { getSystemPrompt } from "../defaults/prompts.js";

dotenv.config();
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY as string,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function callAI(messages: ChatMessage[], res: Response): Promise<void> {
  const input: ChatMessage[] = [
    ...messages,
    {
      role: "system",
      content: getSystemPrompt(),
    },
  ];
  const stream = await openai.chat.completions.create({
    model: "qwen/qwen2.5-coder-32b-instruct",
    messages: input,
    temperature: 0.4,
    top_p: 0.7,
    max_tokens: 80000,
    stream: true,
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
