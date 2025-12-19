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
      if (data.files.length > 0) {
        setSelectedFile(data.files[0].path)
      }
    } else {
      router.push("/prompt")
    }
  }, [router])

  const getFileContent = (path: string): string => {
    const file = project?.files.find((f) => f.path === path)
    return file?.content || ""
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="glass-strong rounded-2xl px-8 py-6">
          <p className="text-foreground font-medium">Loading your project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <PromptPanel onGenerate={() => {}} buildSteps={project.buildSteps} isGenerating={false} />
        <FileExplorer files={project.fileTree} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
        <CodePreviewToggle
          content={selectedFile ? getFileContent(selectedFile) : ""}
          fileName={selectedFile || ""}
          previewUrl={project.previewUrl}
        />
      </div>
    </div>
  )
}
