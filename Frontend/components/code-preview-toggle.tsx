"use client"

import { useState } from "react"
import { Code, Eye } from "lucide-react"

interface CodePreviewToggleProps {
  content: string
  fileName: string
  previewUrl?: string
}

export function CodePreviewToggle({ content, fileName, previewUrl }: CodePreviewToggleProps) {
  const [view, setView] = useState<"code" | "preview">("preview")

  return (
    <div className="flex-1 border-l border-border/50 flex flex-col bg-card/30 backdrop-blur-sm">
      <div className="h-12 border-b border-border/50 px-4 flex items-center justify-between glass-strong">
        <span className="text-sm font-semibold text-foreground">
          {view === "code" ? fileName || "No file selected" : "Preview"}
        </span>
        <div className="flex items-center gap-2 glass rounded-lg p-1">
          <button
            onClick={() => setView("preview")}
            className={`p-2 rounded-md transition-all ${
              view === "preview"
                ? "bg-primary text-primary-foreground glow"
                : "hover:bg-accent/50 text-muted-foreground"
            }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("code")}
            className={`p-2 rounded-md transition-all ${
              view === "code" ? "bg-primary text-primary-foreground glow" : "hover:bg-accent/50 text-muted-foreground"
            }`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "code" ? (
          <div className="h-full overflow-auto bg-card/50">
            <pre className="p-6 text-sm font-mono leading-relaxed">
              <code className="text-foreground">{content || "Select a file to view its contents"}</code>
            </pre>
          </div>
        ) : (
          <div className="h-full bg-card/50 flex items-center justify-center">
            {previewUrl ? (
              <iframe src={previewUrl} className="w-full h-full border-0" title="Preview" />
            ) : (
              <div className="text-center space-y-3 glass-strong rounded-2xl p-8">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto glow">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">No preview available</p>
                  <p className="text-sm text-muted-foreground mt-1">Generate a website to see the preview</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
