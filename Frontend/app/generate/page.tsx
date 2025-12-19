"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { PromptPanel } from "@/components/prompt-panel";
import { FileExplorer } from "@/components/file-explorer";
import { CodePreviewToggle } from "@/components/code-preview-toggle";
import type { Project, Step, FileItem } from "@/types";
import { buildFileTreeFromSteps, findFileByPath, findFirstFile } from "@/lib/utils";

export default function GeneratePage() {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    const rawSteps = localStorage.getItem("generatedSteps");

    if (!rawSteps) {
      router.push("/prompt");
      return;
    }

    const steps: Step[] = JSON.parse(rawSteps);

    const fileTree = buildFileTreeFromSteps(steps);
    const firstFile = findFirstFile(fileTree);

    const projectData: Project = {
      prompt: "Generated Project",
      steps,
      fileTree,
      previewUrl: "",
    };

    setProject(projectData);
    if (firstFile) setSelectedFile(firstFile);
  }, [router]);

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading your project...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <PromptPanel
          onGenerate={() => {}}
          buildSteps={project.steps}
          isGenerating={false}
        />

        <FileExplorer
          files={project.fileTree}
          selectedFile={selectedFile?.path ?? null}
          onSelectFile={(path) => {
            const file = findFileByPath(project.fileTree, path);
            if (file) setSelectedFile(file);
          }}
        />

        <CodePreviewToggle
          content={selectedFile?.content ?? ""}
          fileName={selectedFile?.name ?? ""}
          previewUrl={project.previewUrl}
        />
      </div>
    </div>
  );
}
