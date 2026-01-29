import dotenv from "dotenv";
import type { Response } from "express";
import { getSystemPrompt } from "../defaults/prompts.js";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

type ChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY as string,
});

async function callClaude(messages: ChatMessage[], res: Response): Promise<void> {
    const history = messages
        .filter(msg => msg.role !== "system")
        .map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        }));

    const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: getSystemPrompt(),
        messages: history,
    });

    for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            res.write(event.delta.text);
        }
    }

    res.end();
}

export default callClaude;
