"use client";

import { Code, Eye } from "lucide-react";

interface CodePreviewToggleProps {
  content: string;
  fileName: string;
  previewUrl?: string;
  view?: "code" | "preview";
  onViewChange?: (view: "code" | "preview") => void;
}

export function CodePreviewToggle({
  content,
  fileName,
  previewUrl,
  view = "preview",
  onViewChange,
}: CodePreviewToggleProps) {
  const setView = onViewChange || (() => {});

  return (
    <div className="flex-1 border-l border-border/50 flex flex-col bg-card/30 backdrop-blur-sm max-w-[62%]">
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
              view === "code"
                ? "bg-primary text-primary-foreground glow"
                : "hover:bg-accent/50 text-muted-foreground"
            }`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "code" ? (
          <div className="h-full overflow-auto bg-white dark:bg-zinc-950 no-scrollbar">
            <div className="min-h-full font-mono text-sm">
              {(content || "Select a file to view its contents")
                .split("\n")
                .map((line, i) => (
                  <div
                    key={i}
                    className="flex border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="w-10 py-1 text-right pr-3 select-none text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-900/50 border-r border-gray-100 dark:border-white/10 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="py-1 px-4 whitespace-pre-wrap break-all min-w-0 flex-1 text-gray-800 dark:text-zinc-200 leading-relaxed">
                      {line}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="h-full bg-card/50 flex items-center justify-center">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Preview"
              />
            ) : (
              <div className="text-center space-y-3 glass-strong rounded-2xl p-8">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto glow">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    No preview available
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate a website to see the preview
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
