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
    <div className="flex-1 border-l border-border flex flex-col">
      {/* Toggle Header */}
      <div className="h-10 border-b border-border px-4 flex items-center justify-between">
        <span className="text-sm font-mono text-muted-foreground">
          {view === "code" ? fileName || "No file selected" : "Preview"}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("preview")}
            className={`p-2 hover:bg-accent transition-colors ${view === "preview" ? "bg-accent" : ""}`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("code")}
            className={`p-2 hover:bg-accent transition-colors ${view === "code" ? "bg-accent" : ""}`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {view === "code" ? (
          <div className="h-full overflow-auto bg-card">
            <pre className="p-4 text-sm font-mono">
              <code>{content || "Select a file to view its contents"}</code>
            </pre>
          </div>
        ) : (
          <div className="h-full bg-card flex items-center justify-center">
            {previewUrl ? (
              <iframe src={previewUrl} className="w-full h-full" title="Preview" />
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-sm font-mono">No preview available</p>
                <p className="text-xs mt-1">Generate a website to see the preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
