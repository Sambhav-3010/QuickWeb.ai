"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { PromptPanel } from "@/components/prompt-panel";
import { FileExplorer } from "@/components/file-explorer";
import { CodePreviewToggle } from "@/components/code-preview-toggle";
import type { Project, Step, FileItem } from "@/types";
import {
  buildFileTreeFromSteps,
  convertToFileSystemTree,
  findFileByPath,
  findFirstFile,
} from "@/lib/utils";
import { parseXml } from "@/lib/steps";
import { useWebContainer } from "@/hooks/useWebContainers";
import type { WebContainer } from "@webcontainer/api";

export default function GeneratePage() {
  const router = useRouter();
  const { webcontainer, isLoading } = useWebContainer();

  const [project, setProject] = useState<Project>();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<"code" | "preview">("code");
  const [previewUrl, setPreviewUrl] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const hasStartedRef = useRef(false);
  const hasMountedFsRef = useRef(false);
  const hasDevStartedRef = useRef(false);
  const lastActiveFileRef = useRef<string | null>(null);
  const lastPackageJsonRef = useRef<string | null>(null);
  const fullGeneratedCodeRef = useRef<string>("");
  const generationRequestRef = useRef<any>(null);
  const devProcessRef = useRef<any>(null);
  const hasErrorTriggeredRef = useRef(false);

  const performGeneration = async (messages: any[], isRegeneration: boolean, baseSteps: Step[] = [], model?: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, model }),
        }
      );

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        const newSteps = parseXml(accumulated);
        const allSteps = [...baseSteps, ...newSteps];
        const fileTree = buildFileTreeFromSteps(allSteps);

        setProject((prev) => {
          if (!prev) return undefined;
          return { ...prev, steps: allSteps, fileTree };
        });

        const activeStep = [...newSteps].reverse().find(s => s.path);
        if (
          activeStep?.path &&
          activeStep.path !== lastActiveFileRef.current
        ) {
          const file = findFileByPath(fileTree, activeStep.path);
          if (file) {
            setSelectedFile(file);
            lastActiveFileRef.current = activeStep.path;
            setView("code");
          }
        }
      }

      fullGeneratedCodeRef.current = accumulated;

      if (!isRegeneration) {
        const currentSteps = generationRequestRef.current?.initialSteps || [];
        localStorage.setItem(
          "generatedSteps",
          JSON.stringify([...currentSteps, ...parseXml(accumulated)])
        );
        localStorage.removeItem("generationRequest");
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (newPrompt: string) => {
    const requestJson = localStorage.getItem("generationRequest");
    const parsedRequest = requestJson ? JSON.parse(requestJson) : (generationRequestRef.current || { prompts: [] });
    const { prompts, model } = parsedRequest;

    if (devProcessRef.current) {
      devProcessRef.current.kill();
    }
    hasMountedFsRef.current = false;
    hasDevStartedRef.current = false;
    hasErrorTriggeredRef.current = false;
    setLogs([]);
    setPreviewUrl("");

    const messages = [
      ...prompts.map((content: string) => ({ role: "user", content })),
      { role: "assistant", content: fullGeneratedCodeRef.current },
      { role: "user", content: `Here is the new request to update the project: ${newPrompt}. Please regenerate or update the code accordingly. IMPORTANT: Check for any missing imports (like 'Calendar', 'Lucide' icons, etc.) and ensure all used components are defined. Consider wrapping the application in an Error Boundary to prevent white screen crashes. Return the full updated code structure.` }
    ];

    const updatedPrompts = [...prompts, newPrompt];
    const updatedRequest = { ...parsedRequest, prompts: updatedPrompts };

    localStorage.setItem("generationRequest", JSON.stringify(updatedRequest));
    generationRequestRef.current = updatedRequest;

    setIsGenerating(true);
    setView("code");

    await performGeneration(messages, true, project?.steps || [], model);
  };

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const rawSteps = localStorage.getItem("generatedSteps");
    const requestJson = localStorage.getItem("generationRequest");

    if (rawSteps) {
      const steps: Step[] = JSON.parse(rawSteps);
      const fileTree = buildFileTreeFromSteps(steps);

      setProject({
        prompt: "Generated Project",
        steps,
        fileTree,
        previewUrl: "",
      });

      const firstFile = findFirstFile(fileTree);
      if (firstFile) setSelectedFile(firstFile);
      return;
    }

    if (!requestJson) {
      router.push("/prompt");
      return;
    }

    const parsed = JSON.parse(requestJson);
    generationRequestRef.current = parsed;
    const { prompt, prompts, initialSteps, model } = parsed;

    setProject({
      prompt,
      steps: initialSteps,
      fileTree: [],
      previewUrl: "",
    });

    setIsGenerating(true);

    const messages = prompts.map((content: string) => ({
      role: "user",
      content,
    }));
    performGeneration(messages, false, initialSteps, model);

  }, [router]);

  useEffect(() => {
    if (!isGenerating && hasStartedRef.current) {
      setView("preview");
    }
  }, [isGenerating]);


  useEffect(() => {
    if (!webcontainer || !project?.fileTree.length) return;
    if (isGenerating) return;
    if (hasMountedFsRef.current) return;
    const hasPackageJson = project.fileTree.some(f => f.name === "package.json");
    if (!hasPackageJson) return;

    const container: WebContainer = webcontainer;
    hasMountedFsRef.current = true;
    hasDevStartedRef.current = true;

    const boot = async () => {
      setLogs(l => [...l, "Mounting filesystem...\n"]);

      await container.mount(
        convertToFileSystemTree(project.fileTree)
      );

      const pkg = project.fileTree.find((f) => f.name === "package.json");
      if (pkg?.content) {
        lastPackageJsonRef.current = pkg.content;
      }

      setLogs(l => [...l, "Installing dependencies...\n"]);
      const install = await container.spawn("npm", ["install"]);
      install.output.pipeTo(
        new WritableStream({
          write(data) {
            setLogs(l => [...l, data]);
          },
        })
      );
      const exitCode = await install.exit;
      if (exitCode !== 0) {
        setLogs(l => [...l, "Installation failed. Triggering auto-regeneration...\n"]);
        handleRegenerate("The previous dependency installation failed. Please review the package.json and fix any conflicting or missing dependencies.");
        return;
      }

      setLogs(l => [...l, "Starting dev server...\n"]);
      const dev = await container.spawn("npm", ["run", "dev"]);
      devProcessRef.current = dev;

      dev.output.pipeTo(
        new WritableStream({
          write(data) {
            setLogs(l => [...l, data]);

            if (!hasErrorTriggeredRef.current) {
              const lowerData = data.toLowerCase();
              const errorKeywords = ["uncaught referenceerror", "syntaxerror", "cannot find module", "failed to resolve import", "internal server error"];
              if (errorKeywords.some(keyword => lowerData.includes(keyword))) {
                hasErrorTriggeredRef.current = true;
                // Defer the regeneration slightly to allow logs to flush
                setTimeout(() => {
                  handleRegenerate(`I encountered this error during execution: ${data}. Please fix it.`);
                }, 1000);
              }
            }
          },
        })
      );

      container.on("server-ready", (_, url) => {
        setPreviewUrl(url);
        setProject(p => (p ? { ...p, previewUrl: url } : p));
      });
    };

    boot().catch(console.error);
  }, [webcontainer, project?.fileTree, isGenerating]);


  useEffect(() => {
    if (!webcontainer || !project?.fileTree.length) return;
    if (!hasDevStartedRef.current) return;

    const container: WebContainer = webcontainer;

    const writeNode = async (node: FileItem, base = "/") => {
      const fullPath = `${base}${node.name}`;

      if (node.type === "folder") {
        await container.fs.mkdir(fullPath, { recursive: true });
        if (node.children) {
          for (const child of node.children) {
            await writeNode(child, `${fullPath}/`);
          }
        }
      } else {
        await container.fs.writeFile(fullPath, node.content || "");
      }
    };

    (async () => {
      for (const node of project.fileTree) {
        await writeNode(node);
      }

      const pkg = project.fileTree.find((f) => f.name === "package.json");
      if (pkg?.content && lastPackageJsonRef.current !== null && pkg.content !== lastPackageJsonRef.current) {
        lastPackageJsonRef.current = pkg.content;
        setLogs(l => [...l, "package.json changed. Re-installing dependencies...\n"]);

        try {
          const install = await container.spawn("npm", ["install"]);
          install.output.pipeTo(
            new WritableStream({
              write(data) {
                setLogs(l => [...l, data]);
              },
            })
          );
          await install.exit;
          setLogs(l => [...l, "Dependencies installed.\n"]);
        } catch (error) {
          console.error("Failed to install dependencies", error);
          setLogs(l => [...l, "Failed to install dependencies.\n"]);
        }
      }
    })().catch(console.error);
  }, [project?.fileTree]);


  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined || !selectedFile || !project) return;
    setSelectedFile(prev => prev ? { ...prev, content: value } : null);

    setProject(prev => {
      if (!prev) return prev;

      const updateTree = (nodes: FileItem[]): FileItem[] => {
        return nodes.map(node => {
          if (node.type === 'folder' && node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          if (node.path === selectedFile.path) {
            return { ...node, content: value };
          }
          return node;
        });
      };

      return {
        ...prev,
        fileTree: updateTree(prev.fileTree)
      };
    });
  };

  useEffect(() => {
    if (!project || !selectedFile) return;

    const updatedFile = findFileByPath(project.fileTree, selectedFile.path);
    if (updatedFile && updatedFile.content !== selectedFile.content) {
      setSelectedFile(updatedFile);
    }
  }, [project?.fileTree, selectedFile?.path]);

  if (!project || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse">
            Initializing project...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <PromptPanel
          onGenerate={handleRegenerate}
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
          previewUrl={previewUrl}
          view={view}
          logs={logs}
          isGenerating={isGenerating}
          onViewChange={setView}
          onEditorChange={handleEditorChange}
          onDownload={async () => {
            if (!project?.fileTree) return;
            const JSZip = (await import("jszip")).default;
            const { saveAs } = (await import("file-saver"));

            const zip = new JSZip();

            const processNode = (node: FileItem, currentZip: any) => {
              if (node.type === 'folder') {
                const folder = currentZip.folder(node.name);
                if (node.children) {
                  node.children.forEach(child => processNode(child, folder));
                }
              } else {
                currentZip.file(node.name, node.content || "");
              }
            };

            project.fileTree.forEach(node => processNode(node, zip));

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "project.zip");
          }}
        />
      </div>
    </div>
  );
}
