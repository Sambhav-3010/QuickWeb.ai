import { type NextRequest, NextResponse } from "next/server"
import type { GeneratedProject } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock response - in production, this would call your actual backend
    const mockProject: GeneratedProject = {
      prompt,
      buildSteps: [
        { name: "Creating project structure", status: "completed" },
        { name: "Generating components", status: "completed" },
        { name: "Setting up configuration", status: "completed" },
        { name: "Building preview", status: "completed" },
      ],
      fileTree: [
        {
          name: "src",
          path: "src",
          type: "folder",
          children: [
            {
              name: "components",
              path: "src/components",
              type: "folder",
              children: [
                { name: "Header.tsx", path: "src/components/Header.tsx", type: "file" },
                { name: "Hero.tsx", path: "src/components/Hero.tsx", type: "file" },
                { name: "Footer.tsx", path: "src/components/Footer.tsx", type: "file" },
              ],
            },
            { name: "App.tsx", path: "src/App.tsx", type: "file" },
            { name: "index.tsx", path: "src/index.tsx", type: "file" },
          ],
        },
        { name: "package.json", path: "package.json", type: "file" },
        { name: "tsconfig.json", path: "tsconfig.json", type: "file" },
      ],
      files: [
        {
          path: "src/App.tsx",
          content: `import React from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Footer />
    </div>
  )
}

export default App`,
        },
        {
          path: "src/components/Header.tsx",
          content: `export function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-6 py-4">
        <h1 className="text-xl font-bold">My Website</h1>
      </nav>
    </header>
  )
}`,
        },
        {
          path: "src/components/Hero.tsx",
          content: `export function Hero() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Your Website
        </h1>
        <p className="text-xl text-gray-600">
          Built based on your prompt: "${prompt}"
        </p>
      </div>
    </section>
  )
}`,
        },
        {
          path: "src/components/Footer.tsx",
          content: `export function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-gray-600">© 2025 Generated with WebGen</p>
      </div>
    </footer>
  )
}`,
        },
        {
          path: "package.json",
          content: `{
  "name": "generated-website",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
        },
      ],
      previewUrl: "/modern-website-landing-page.jpg",
    }

    return NextResponse.json(mockProject)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to generate website" }, { status: 500 })
  }
}
