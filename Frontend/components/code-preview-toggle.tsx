import { Code, Eye } from "lucide-react";
import { TerminalPanel } from "./terminal-panel";
import { useEffect, useState, useMemo } from "react";
import Editor from "@monaco-editor/react";

interface CodePreviewToggleProps {
  content: string;
  fileName: string;
  previewUrl?: string;
  view?: "code" | "preview";
  onViewChange?: (view: "code" | "preview") => void;
  onEditorChange?: (value: string | undefined) => void;
  logs: string[];
  isGenerating?: boolean;
}

export function CodePreviewToggle({
  content,
  fileName,
  previewUrl,
  view = "preview",
  onViewChange,
  onEditorChange,
  logs,
  isGenerating,
}: CodePreviewToggleProps) {
  const setView = onViewChange || (() => { });
  const [terminalOpen, setTerminalOpen] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (previewUrl) {
      setTerminalOpen(false);
    } else {
      setTerminalOpen(true);
    }
  }, [previewUrl]);

  useEffect(() => {
    if (isGenerating && editor && view === 'code') {
      const model = editor.getModel();
      if (model) {
        editor.revealLine(model.getLineCount());
      }
    }
  }, [content, isGenerating, editor, view]);

  const language = useMemo(() => {
    if (!fileName) return "plaintext";
    if (fileName.endsWith(".tsx") || fileName.endsWith(".ts")) return "typescript";
    if (fileName.endsWith(".jsx") || fileName.endsWith(".js")) return "javascript";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".json")) return "json";
    return "plaintext";
  }, [fileName]);

  return (
    <div className="flex-1 border-l border-border/50 flex flex-col bg-card/30 backdrop-blur-sm max-w-[62%]">
      <div className="h-12 border-b border-border/50 px-4 flex items-center justify-between glass-strong">
        <span className="text-sm font-semibold text-foreground">
          {view === "code" ? fileName || "No file selected" : "Preview"}
        </span>
        <div className="flex items-center gap-2 glass rounded-lg p-1">
          <button
            onClick={() => setView("preview")}
            className={`p-2 rounded-md transition-all ${view === "preview"
              ? "bg-primary text-primary-foreground glow"
              : "hover:bg-accent/50 text-muted-foreground"
              }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("code")}
            className={`p-2 rounded-md transition-all ${view === "code"
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
          <div className="h-full relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={content}
              onChange={onEditorChange}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>
        ) : (
          <div className="h-full bg-card/50 flex items-center justify-center">
            {logs.length > 0 && terminalOpen ? (
              <TerminalPanel logs={logs} />
            ) : previewUrl && !terminalOpen ? (
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
