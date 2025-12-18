"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const root = document.documentElement
    const initialTheme = root.classList.contains("dark") ? "dark" : "light"
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const newTheme = theme === "light" ? "dark" : "light"

    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    setTheme(newTheme)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-9 h-9">
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
