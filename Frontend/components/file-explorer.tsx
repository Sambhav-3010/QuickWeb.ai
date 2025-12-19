"use client"

import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
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
    <div className="w-[25%] border-r border-border/50 flex flex-col bg-card/30 backdrop-blur-sm">
      <div className="p-4 border-b border-border/50">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Files</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <p>No files yet.</p>
            <p className="text-xs mt-1">Generate a website to get started.</p>
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
    <div className="space-y-1">
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
          "w-full flex items-center gap-2 px-2 py-2 text-sm transition-all rounded-lg group",
          isSelected
            ? "glass glow text-foreground font-medium"
            : "hover:bg-accent/50 hover:text-foreground text-muted-foreground",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 shrink-0 text-primary" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 shrink-0 text-secondary" />
            ) : (
              <Folder className="w-4 h-4 shrink-0 text-secondary" />
            )}
          </>
        ) : (
          <File className="w-4 h-4 shrink-0 ml-6 text-accent" />
        )}
        <span className="truncate text-sm">{node.name}</span>
      </button>
      {isFolder && isOpen && node.children && (
        <FileTree nodes={node.children} selectedFile={selectedFile} onSelectFile={onSelectFile} depth={depth + 1} />
      )}
    </div>
  )
}
