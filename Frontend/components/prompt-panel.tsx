"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react"
import type { BuildStep } from "@/types"

interface PromptPanelProps {
  onGenerate: (prompt: string) => void
  buildSteps: BuildStep[]
  isGenerating: boolean
}

export function PromptPanel({ onGenerate, buildSteps, isGenerating }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate(prompt)
    }
  }

  const originalPrompt =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("generatedProject") || "{}")?.prompt || "No prompt available"
      : "Loading..."

  return (
    <div className="w-[25%] border-r border-border/50 flex flex-col bg-card/30 backdrop-blur-sm">
       <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">Build Steps</h3>
        <div className="space-y-3">
          {buildSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                step.status === "completed" ? "glass" : step.status === "in-progress" ? "glass glow" : "bg-muted/20"
              }`}
            >
              {step.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary shrink-0" />
              ) : step.status === "in-progress" ? (
                <Loader2 className="w-5 h-5 mt-0.5 animate-spin text-primary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          ))}
        </div>
      </div>


      <div className="p-4 border-b border-border/50">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Prompt
        </h2>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website you want to build..."
          className="min-h-32 resize-none text-sm mb-3 glass border-border/50 focus:border-primary transition-colors"
        />
        <Button
          onClick={handleSubmit}
          disabled={isGenerating || !prompt.trim()}
          className="w-full gradient-primary glow hover:glow-strong transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
