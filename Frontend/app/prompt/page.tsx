"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function PromptPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      // Call backend API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      // Store the generated project data in sessionStorage
      sessionStorage.setItem("generatedProject", JSON.stringify(data))

      // Navigate to the generate page
      router.push("/generate")
    } catch (error) {
      console.error("Generation failed:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground" />
            <span className="font-mono text-sm font-medium">WEBGEN</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Describe your website</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Tell us what you want to build, and we'll generate it for you in seconds
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Example: Create a modern portfolio website with a hero section, about me section, project showcase with 3 cards, and contact form..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px] text-base resize-none"
              disabled={isGenerating}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{prompt.length} characters</p>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="border-t border-border pt-8 space-y-4">
            <p className="text-sm font-medium">Try these examples:</p>
            <div className="grid gap-3">
              {[
                "Create a landing page for a SaaS product with pricing table and testimonials",
                "Build a restaurant website with menu, location map, and reservation form",
                "Design a personal blog with article grid and sidebar navigation",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                  className="text-left p-4 border border-border hover:border-foreground transition-colors text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
