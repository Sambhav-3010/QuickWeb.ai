"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import axios from "axios"
import { Sparkles, Loader2, ArrowRight } from "lucide-react"

export default function PromptPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL as string}/template`, { prompt }, {
        headers: { "Content-Type": "application/json" },
      })
      console.log("Generation response:", response.data)
      setIsGenerating(false)
    } catch (error) {
      console.error("Generation failed:", error)
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    "Create a modern SaaS landing page with hero section, features grid, pricing table, and testimonials",
    "Build a restaurant website with image gallery, menu sections, location map, and online reservation form",
    "Design a creative portfolio with animated hero, project showcase grid, about section, and contact form",
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <header className="sticky top-0 z-50 glass-strong">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary glow" />
            <span className="font-bold text-lg gradient-text">WebGen AI</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI Website Generator</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              Describe your <span className="gradient-text">dream website</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Tell us what you want to build, and our AI will generate it in seconds
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-8 space-y-6 glow">
            <Textarea
              placeholder="Example: Create a modern portfolio website with an animated hero section, project showcase with 6 cards in a grid, skills section with icons, and a contact form with validation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-50 text-base resize-none border-border/50 focus:border-primary transition-colors"
              disabled={isGenerating}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">{prompt.length} characters</p>
                {prompt.length > 50 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Great detail!
                  </span>
                )}
              </div>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="min-w-40 gradient-primary glow-strong hover:scale-105 transition-all"
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

          <div className="space-y-4">
            <p className="text-sm font-medium text-center text-muted-foreground">Or try these examples:</p>
            <div className="grid gap-3">
              {examplePrompts.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                  className="text-left p-5 glass rounded-xl hover:glass-strong hover:glow transition-all text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">{example}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
