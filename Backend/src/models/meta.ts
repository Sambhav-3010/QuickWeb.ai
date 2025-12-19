import dotenv from "dotenv";
import OpenAI from "openai";
import type { Response } from "express";
import { getSystemPrompt } from "../defaults/prompts";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY as string,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function callAI(message: string, res: Response): Promise<void> {
  const stream = await openai.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: [{role: "system", content: getSystemPrompt() },{ role: "user", content: message }],
    temperature: 0.4,
    top_p: 0.7,
    max_tokens: 8000,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta as any;
    const content = (delta?.reasoning_content || delta?.content || "") as string;

    if (content) {
      res.write(content);
      process.stdout.write(content);
    }
  }

  res.end();
}

export default callAI;