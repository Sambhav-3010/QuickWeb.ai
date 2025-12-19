"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { PromptPanel } from "@/components/prompt-panel";
import { FileExplorer } from "@/components/file-explorer";
import { CodePreviewToggle } from "@/components/code-preview-toggle";
import type { Project, Step, FileItem } from "@/types";
import { buildFileTreeFromSteps, findFileByPath, findFirstFile } from "@/lib/utils";
import { parseXml } from "@/lib/steps";

export default function GeneratePage() {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<"code" | "preview">("code");
  const router = useRouter();
  const hasStartedRef = useRef(false);
  const lastActiveFileRef = useRef<string | null>(null);

  useEffect(() => {
    if (hasStartedRef.current) return;

    const rawSteps = localStorage.getItem("generatedSteps");
    const requestJson = localStorage.getItem("generationRequest");

    if (rawSteps) {
      const steps: Step[] = JSON.parse(rawSteps);
      const fileTree = buildFileTreeFromSteps(steps);
      const firstFile = findFirstFile(fileTree);

      setProject({
        prompt: "Generated Project",
        steps,
        fileTree,
        previewUrl: "",
      });
      if (firstFile) {
        setSelectedFile(firstFile);
        setView("code");
      }
      return;
    }

    if (requestJson) {
      hasStartedRef.current = true;
      const request = JSON.parse(requestJson);
      const { prompt, prompts, initialSteps } = request;

      setProject({
        prompt,
        steps: initialSteps,
        fileTree: [],
        previewUrl: "",
      });
      setIsGenerating(true);
      setView("code");

      const streamGeneration = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: prompts.map((content: string) => ({
                role: "user",
                content,
              })),
            }),
          });
          if (!response.body) throw new Error("No response body");

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedResponse = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedResponse += chunk;

            const newSteps = parseXml(accumulatedResponse);

            const allSteps = [...initialSteps, ...newSteps];
            const fileTree = buildFileTreeFromSteps(allSteps);

            const activeStep = newSteps.slice().reverse().find(step => step.path);
            const activeFilePath = activeStep?.path;

            setProject((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                steps: allSteps,
                fileTree
              };
            });

            if (activeFilePath) {
              if (activeFilePath !== lastActiveFileRef.current) {
                setView("code");
                lastActiveFileRef.current = activeFilePath;
              }

              const file = findFileByPath(fileTree, activeFilePath);
              if (file) setSelectedFile(file);
            } else {
              setSelectedFile((prev) => {
                if (prev) return prev;
                return findFirstFile(fileTree);
              });
            }
          }
          const finalSteps = parseXml(accumulatedResponse);
          const allSteps = [...initialSteps, ...finalSteps];
          localStorage.setItem("generatedSteps", JSON.stringify(allSteps));
          localStorage.removeItem("generationRequest");
        } catch (error) {
          console.error("Streaming error:", error);
        } finally {
          setIsGenerating(false);
        }
      };

      streamGeneration();
      return;
    }

    router.push("/prompt");
  }, [router]);

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse">Initializing project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <PromptPanel
          onGenerate={() => { }}
          buildSteps={project.steps}
          isGenerating={isGenerating}
        />

        <FileExplorer
          files={project.fileTree}
          selectedFile={selectedFile?.path ?? null}
          onSelectFile={(path) => {
            const file = findFileByPath(project.fileTree, path);
            if (file) {
              setSelectedFile(file);
              setView("code");
            }
          }}
        />

        <CodePreviewToggle
          content={selectedFile?.content ?? ""}
          fileName={selectedFile?.name ?? ""}
          previewUrl={project.previewUrl}
          view={view}
          onViewChange={setView}
        />
      </div>
    </div>
  );
}

