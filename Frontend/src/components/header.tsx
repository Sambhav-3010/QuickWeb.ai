import { Link } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"
import { Leaf } from "lucide-react"

export function Header() {
  return (
    <header className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-sm flex items-center px-6 justify-between">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-base text-foreground">QuickWeb.ai</span>
      </Link>
      <ThemeToggle />
    </header>
  )
}
