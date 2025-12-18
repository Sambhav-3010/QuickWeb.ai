"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { PromptPanel } from "@/components/prompt-panel"
import { FileExplorer } from "@/components/file-explorer"
import { CodePreviewToggle } from "@/components/code-preview-toggle"
import type { GeneratedProject } from "@/types"

export default function GeneratePage() {
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedProject = sessionStorage.getItem("generatedProject")
    if (storedProject) {
      const data = JSON.parse(storedProject)
      setProject(data)
      // Auto-select first file
      if (data.files.length > 0) {
        setSelectedFile(data.files[0].path)
      }
    } else {
      // Redirect to prompt page if no project data
      router.push("/prompt")
    }
  }, [router])

  const getFileContent = (path: string): string => {
    const file = project?.files.find((f) => f.path === path)
    return file?.content || ""
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Loading project...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Prompt & Build Steps */}
        <PromptPanel onGenerate={() => {}} buildSteps={project.buildSteps} isGenerating={false} />

        {/* Middle Panel - File Explorer */}
        <FileExplorer files={project.fileTree} selectedFile={selectedFile} onSelectFile={setSelectedFile} />

        {/* Right Panel - Code/Preview Toggle */}
        <CodePreviewToggle
          content={selectedFile ? getFileContent(selectedFile) : ""}
          fileName={selectedFile || ""}
          previewUrl={project.previewUrl}
        />
      </div>
    </div>
  )
}
