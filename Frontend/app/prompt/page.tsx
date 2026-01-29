"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Sparkles, Loader2, ArrowRight, Leaf } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { parseXml } from "@/lib/steps";
import { Step } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function PromptPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<"gemini" | "Qwen" | "claude">("gemini");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(BACKEND_URL);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    checkBackend()
  }, [BACKEND_URL])

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const templateRes = await axios.post(
        `${BACKEND_URL}/template`,
        { prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      const { prompts, uiPrompts } = templateRes.data;

      const initialSteps: Step[] = parseXml(uiPrompts[0]).map((step: Step) => ({
        ...step,
        status: "completed" as const,
      }));


      localStorage.setItem("generationRequest", JSON.stringify({
        prompt,
        prompts: [...prompts, prompt],
        initialSteps,
        model
      }));

      localStorage.removeItem("generatedSteps");

      router.push("/generate");
    } catch (error) {
      console.error("Generation failed:", error);
      setIsGenerating(false);
    }
  };

  const examplePrompts = [
    "Create a modern SaaS landing page with hero section, features grid, pricing table, and testimonials",
    "Build a restaurant website with image gallery, menu sections, location map, and online reservation form",
    "Design a creative portfolio with animated hero, project showcase grid, about section, and contact form",
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Japandi Decorative Background Elements - High Visibility */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Concentric circles - top right */}
        <svg className="absolute -top-12 -right-12 w-[280px] h-[280px] opacity-50" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="85" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="100" cy="100" r="18" fill="none" stroke="#C67C4E" strokeWidth="3" />
        </svg>

        {/* Semicircle - bottom left */}
        <div className="absolute -bottom-16 -left-16 w-40 h-20 rounded-t-full bg-[#8B9D83]/50" />

        {/* Arch shape - left side */}
        <svg className="absolute top-[30%] left-8 w-14 h-20 opacity-45" viewBox="0 0 50 70">
          <path d="M 5 70 L 5 28 Q 5 5 25 5 Q 45 5 45 28 L 45 70" fill="none" stroke="#D4A574" strokeWidth="4" />
        </svg>

        {/* Organic blob - top left */}
        <div className="absolute top-28 left-[6%] w-14 h-16 bg-[#D4A574]/45 rounded-[60%_40%_50%_50%/50%_60%_40%_50%]" />

        {/* Circle cluster - right side */}
        <div className="absolute top-[50%] right-[4%] flex flex-col gap-3">
          <div className="w-5 h-5 rounded-full bg-[#C67C4E]/55" />
          <div className="w-5 h-5 rounded-full bg-[#C67C4E]/65" />
          <div className="w-5 h-5 rounded-full bg-[#C67C4E]/55" />
        </div>

        {/* Organic blob - bottom right */}
        <div className="absolute -bottom-4 right-[8%] w-20 h-28 bg-[#8B9D83]/40 rounded-[40%_60%_50%_50%/60%_40%_60%_40%]" />

        {/* Small concentric circles - bottom left */}
        <svg className="absolute bottom-28 left-[10%] w-14 h-14 opacity-45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#8B9D83" strokeWidth="3" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#8B9D83" strokeWidth="3" />
        </svg>

        {/* Floating dots */}
        <div className="absolute top-20 right-[18%] w-5 h-5 rounded-full bg-[#D4A574]/50" />
        <div className="absolute top-36 left-[22%] w-3 h-3 rounded-full bg-[#C67C4E]/55" />

        {/* Curved line */}
        <svg className="absolute bottom-[28%] right-[3%] w-10 h-20 opacity-40" viewBox="0 0 30 60">
          <path d="M 15 0 Q 30 15 15 30 Q 0 45 15 60" fill="none" stroke="#C67C4E" strokeWidth="3" />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg text-foreground">QuickWeb.ai</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-3xl space-y-8">
          {/* Hero */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              <span>AI Website Generator</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-light text-foreground">
              Describe your <span className="japandi-text-gradient font-medium">dream website</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Tell us what you want to build, and our AI will generate it in seconds.
            </p>
          </div>

          {/* Prompt Box */}
          <div className="japandi-card-elevated organic-shadow-lg rounded-2xl p-8 space-y-6">
            <Textarea
              placeholder="Example: Create a modern portfolio website with an animated hero section, project showcase, skills section, and contact form..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="min-h-48 resize-none text-base bg-background/50 border-border/40 focus:border-primary/50 transition-colors"
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {prompt.length} characters
              </p>

              <div className="flex items-center gap-3">
                <Select value={model} onValueChange={(value: "gemini" | "Qwen" | "claude") => setModel(value)}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/40">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini 2.5</SelectItem>
                    <SelectItem value="Qwen">Qwen 3</SelectItem>
                    <SelectItem value="claude">Claude Sonnet</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="min-w-40 japandi-gradient text-white organic-shadow japandi-hover"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-center text-muted-foreground">
              Or try these examples:
            </p>

            <div className="grid gap-3">
              {examplePrompts.map((example, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const styles = ["minimalist", "glassmorphism", "neobrutalism", "futuristic", "retro-modern", "clean", "flat design", "magazine layout"];
                    const colors = ["sunset orange", "ocean blue", "midnight violet", "forest green", "neon pink", "monochrome", "pastel", "vibrant gradient"];
                    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    const enhancedPrompt = `${example}. Make it ${randomStyle} with a ${randomColor} color scheme.`;
                    setPrompt(enhancedPrompt);
                  }}
                  disabled={isGenerating}
                  className="text-left p-5 japandi-card rounded-xl japandi-hover hover:border-primary/30 transition-all text-sm text-foreground/80"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
