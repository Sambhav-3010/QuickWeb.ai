"use client"

import useWebContainers from "@/hooks/useWebContainers";

interface PreviewProps {
  previewUrl?: string
}
const webContainer = useWebContainers();
export function Preview({ previewUrl }: PreviewProps) {

  return (
    <div className="h-1/2 flex flex-col">
      <div className="h-10 border-b border-border px-4 flex items-center">
        <span className="text-sm font-mono text-muted-foreground">Preview</span>
      </div>
      <div className="flex-1 bg-card flex items-center justify-center">
        {previewUrl ? (
          <iframe src={previewUrl} className="w-full h-full" title="Preview" />
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-sm font-mono">No preview available</p>
            <p className="text-xs mt-1">Generate a website to see the preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
