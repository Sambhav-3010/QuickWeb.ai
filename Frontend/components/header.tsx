import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="h-14 border-b border-border flex items-center px-6 justify-between">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-5 h-5 bg-foreground" />
        <span className="font-mono text-sm font-medium">WEBGEN</span>
      </Link>
      <ThemeToggle />
    </header>
  )
}
