import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { AlertTriangle, Zap, Loader2, Sparkles, Bot, Code2 } from "lucide-react";

type FallbackProvider = "gemini" | "anthropic" | null;

export default function GeneratePage() {
    const navigate = useNavigate();
    const { webcontainer, isLoading } = useWebContainer();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const [project, setProject] = useState<Project>();
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [view, setView] = useState<"code" | "preview">("code");
    const [previewUrl, setPreviewUrl] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [showFallbackModal, setShowFallbackModal] = useState(false);
    const [fallbackMessages, setFallbackMessages] = useState<any[]>([]);
    const [fallbackBaseSteps, setFallbackBaseSteps] = useState<Step[]>([]);
    const [timeoutSeconds, setTimeoutSeconds] = useState(60);
    const [generationStatus, setGenerationStatus] = useState<string>("Connecting to AI...");

    const hasStartedRef = useRef(false);
    const hasMountedFsRef = useRef(false);
    const hasDevStartedRef = useRef(false);
    const lastActiveFileRef = useRef<string | null>(null);
    const lastPackageJsonRef = useRef<string | null>(null);
    const fullGeneratedCodeRef = useRef<string>("");
    const generationRequestRef = useRef<any>(null);
    const devProcessRef = useRef<any>(null);
    const hasErrorTriggeredRef = useRef(false);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const hasReceivedDataRef = useRef(false);

    const waitForPuter = async (maxWait = 10000): Promise<any> => {
        const start = Date.now();
        while (Date.now() - start < maxWait) {
            const puter = (window as any).puter;
            if (puter && puter.ai) {
                return puter;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        throw new Error("Puter.js failed to load. Please check your internet connection and refresh the page.");
    };
    const performBackendGeneration = async (messages: any[], isRegeneration: boolean, baseSteps: Step[] = [], model: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages, model }),
            });

            if (!response.ok) throw new Error("Backend request failed");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                accumulated += text;

                const newSteps = parseXml(accumulated);
                const allSteps = [...baseSteps, ...newSteps];
                const fileTree = buildFileTreeFromSteps(allSteps);

                setProject((prev) => {
                    if (!prev) return undefined;
                    return { ...prev, steps: allSteps, fileTree };
                });

                const activeStep = [...newSteps].reverse().find(s => s.path);
                if (activeStep?.path && activeStep.path !== lastActiveFileRef.current) {
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
            console.error("Backend generation error:", e);
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle fallback provider selection
    const handleFallbackSelect = async (provider: FallbackProvider) => {
        if (!provider) return;
        setShowFallbackModal(false);
        setIsGenerating(true);
        await performBackendGeneration(fallbackMessages, false, fallbackBaseSteps, provider);
    };

    // Puter.js AI generation with timeout - calls AI directly from frontend
    const performGeneration = async (messages: any[], isRegeneration: boolean, baseSteps: Step[] = [], model?: string) => {
        // Reset refs
        hasReceivedDataRef.current = false;

        // Store messages for potential fallback
        setFallbackMessages(messages);
        setFallbackBaseSteps(baseSteps);

        // Set up timeout for fallback
        timeoutIdRef.current = setTimeout(() => {
            if (!hasReceivedDataRef.current) {
                console.log("Puter.js timeout - showing fallback options");
                setIsGenerating(false);
                setShowFallbackModal(true);
            }
        }, timeoutSeconds * 1000);

        try {
            setGenerationStatus("Connecting to AI service...");
            // Wait for puter to be available (with timeout)
            const puter = await waitForPuter();
            setGenerationStatus("Preparing your request...");

            // Convert messages to Puter.js format
            const puterMessages = messages.map((msg: any) => ({
                role: msg.role as "system" | "user" | "assistant",
                content: msg.content,
            }));

            setGenerationStatus("Sending request to AI...");
            // Use streaming with Puter.js
            const stream = await puter.ai.chat(puterMessages, {
                model: model || "claude-sonnet-4-20250514",
                stream: true,
            });
            setGenerationStatus("AI is thinking...");

            let accumulated = "";

            for await (const part of stream) {
                // Mark that we received data - cancel timeout
                if (!hasReceivedDataRef.current) {
                    hasReceivedDataRef.current = true;
                    setGenerationStatus("Receiving code from AI...");
                    if (timeoutIdRef.current) {
                        clearTimeout(timeoutIdRef.current);
                        timeoutIdRef.current = null;
                    }
                }

                const text = part?.text || "";
                accumulated += text;

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
            // On error, also show fallback if no data received
            if (!hasReceivedDataRef.current) {
                setShowFallbackModal(true);
            }
        } finally {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
            if (hasReceivedDataRef.current) {
                setIsGenerating(false);
            }
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
            navigate("/prompt");
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

    }, [navigate]);

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
        <div className="h-screen flex flex-col relative">
            <Header />

            {/* AI Generation Loading Overlay */}
            {isGenerating && project?.fileTree.length === 0 && (
                <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
                        {/* Animated AI Icon */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <Bot className="w-10 h-10 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                            </div>
                            {/* Pulse rings */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                            <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 justify-center">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                Generating Your Website
                            </h3>
                            <p className="text-muted-foreground">
                                {generationStatus}
                            </p>
                        </div>

                        {/* Progress animation */}
                        <div className="w-full max-w-xs">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary via-primary/50 to-primary rounded-full animate-pulse"
                                    style={{ width: '60%', animation: 'pulse 1.5s ease-in-out infinite, shimmer 2s ease-in-out infinite' }} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Code2 className="w-4 h-4" />
                            <span>This may take up to a minute...</span>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Fallback Modal */}
            {showFallbackModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-background border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">AI Not Responding</h2>
                                <p className="text-sm text-muted-foreground">Puter.js didn't respond in {timeoutSeconds}s</p>
                            </div>
                        </div>

                        <p className="text-muted-foreground mb-6">
                            The AI service is taking too long. Choose an alternative provider to continue:
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleFallbackSelect("gemini")}
                                className="w-full p-4 rounded-xl border border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-foreground">Google Gemini</p>
                                    <p className="text-sm text-muted-foreground">Fast & reliable</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleFallbackSelect("anthropic")}
                                className="w-full p-4 rounded-xl border border-border bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 transition-all flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-foreground">Anthropic Claude</p>
                                    <p className="text-sm text-muted-foreground">High quality output</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowFallbackModal(false)}
                            className="w-full mt-4 p-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
                        >
                            Cancel and try again later
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
