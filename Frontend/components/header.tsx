import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="h-14 border-b border-border/50 glass-strong flex items-center px-6 justify-between backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-6 h-6 rounded-lg gradient-primary glow" />
        <span className="font-bold text-base gradient-text">QuickWeb.ai</span>
      </Link>
      <ThemeToggle />
    </header>
  )
}
