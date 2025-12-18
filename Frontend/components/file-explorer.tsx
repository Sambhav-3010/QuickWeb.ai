"use client"

import { ChevronRight, ChevronDown, File, Folder } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { FileNode } from "@/types"

interface FileExplorerProps {
  files: FileNode[]
  selectedFile: string | null
  onSelectFile: (path: string) => void
}

export function FileExplorer({ files, selectedFile, onSelectFile }: FileExplorerProps) {
  return (
    <div className="w-[25%] border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Files</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No files yet. Generate a website to get started.
          </div>
        ) : (
          <FileTree nodes={files} selectedFile={selectedFile} onSelectFile={onSelectFile} />
        )}
      </div>
    </div>
  )
}

function FileTree({
  nodes,
  selectedFile,
  onSelectFile,
  depth = 0,
}: {
  nodes: FileNode[]
  selectedFile: string | null
  onSelectFile: (path: string) => void
  depth?: number
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
          depth={depth}
        />
      ))}
    </div>
  )
}

function FileTreeNode({
  node,
  selectedFile,
  onSelectFile,
  depth,
}: {
  node: FileNode
  selectedFile: string | null
  onSelectFile: (path: string) => void
  depth: number
}) {
  const [isOpen, setIsOpen] = useState(true)
  const isFolder = node.type === "folder"
  const isSelected = selectedFile === node.path

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen)
    } else {
      onSelectFile(node.path)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-accent transition-colors font-mono",
          isSelected && "bg-accent",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            )}
            <Folder className="w-3.5 h-3.5 shrink-0" />
          </>
        ) : (
          <File className="w-3.5 h-3.5 shrink-0 ml-5" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && isOpen && node.children && (
        <FileTree nodes={node.children} selectedFile={selectedFile} onSelectFile={onSelectFile} depth={depth + 1} />
      )}
    </div>
  )
}
