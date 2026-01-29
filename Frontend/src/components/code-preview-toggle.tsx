import { Code, Eye, Download } from "lucide-react";
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
  onDownload?: () => void;
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
  onDownload,
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
    <div className="flex-1 border-l border-border/40 flex flex-col bg-muted/10 max-w-[62%]">
      <div className="h-12 border-b border-border/40 px-4 flex items-center justify-between bg-background/50">
        <span className="text-sm font-medium text-foreground">
          {view === "code" ? fileName || "No file selected" : "Preview"}
        </span>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 rounded-md transition-all hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Download Zip"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setView("preview")}
            className={`p-2 rounded-md transition-all ${view === "preview"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("code")}
            className={`p-2 rounded-md transition-all ${view === "code"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
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
              onMount={(editor: any) => setEditor(editor)}
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
          <div className="h-full bg-muted/20 flex items-center justify-center">
            {logs.length > 0 && terminalOpen ? (
              <TerminalPanel logs={logs} />
            ) : previewUrl && !terminalOpen ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Preview"
              />
            ) : (
              <div className="text-center space-y-3 japandi-card-elevated organic-shadow rounded-2xl p-8">
                <div className="w-16 h-16 rounded-2xl japandi-gradient flex items-center justify-center mx-auto">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">
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
