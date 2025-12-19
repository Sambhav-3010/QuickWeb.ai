"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";
import type { Step } from "@/types";

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  buildSteps: Step[];
  isGenerating: boolean;
}

export function PromptPanel({
  onGenerate,
  buildSteps,
  isGenerating,
}: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");

  const originalPrompt =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("generatedProject") || "{}")?.prompt ??
        "No prompt available"
      : "Loading...";

  return (
    <div className="w-[25%] border-r border-border/50 flex flex-col bg-card/30">
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold text-sm uppercase mb-4">Build Steps</h3>

        {buildSteps.map((step, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-lg">
            {step.status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : step.status === "in-progress" ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border/50">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={originalPrompt}
          className="min-h-32 mb-3"
        />
        <Button
          onClick={() => onGenerate(prompt)}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>
    </div>
  );
}