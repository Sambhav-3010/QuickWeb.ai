"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
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
    <div className="w-[25%] border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground mb-3">Prompt</h2>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website you want to build..."
          className="min-h-32 resize-none font-mono text-sm mb-3"
        />
        <Button onClick={handleSubmit} disabled={isGenerating || !prompt.trim()} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground mb-3">Original Prompt</h2>
        <div className="p-3 border border-border bg-muted/30 rounded text-sm font-mono min-h-32 max-h-48 overflow-y-auto">
          {originalPrompt}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-mono text-xs uppercase tracking-wide text-muted-foreground mb-3">Build Steps</h3>
        <div className="space-y-2">
          {buildSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              {step.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
              ) : step.status === "in-progress" ? (
                <Loader2 className="w-4 h-4 mt-0.5 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm font-mono">{step.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
