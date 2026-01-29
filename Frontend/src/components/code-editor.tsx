"use client"

interface CodeEditorProps {
  content: string
  fileName: string
}

export function CodeEditor({ content, fileName }: CodeEditorProps) {
  return (
    <div className="h-1/2 border-b border-border flex flex-col">
      <div className="h-10 border-b border-border px-4 flex items-center">
        <span className="text-sm font-mono text-muted-foreground">{fileName || "No file selected"}</span>
      </div>
      <div className="flex-1 overflow-auto bg-card">
        <pre className="p-4 text-sm font-mono">
          <code>{content || "Select a file to view its contents"}</code>
        </pre>
      </div>
    </div>
  )
}
