import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeProviderContext = createContext<ThemeProviderContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (newTheme: Theme) => {
      let resolved: 'light' | 'dark' = 'dark'

      if (newTheme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        resolved = newTheme
      }

      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
      setResolvedTheme(resolved)
    }

    applyTheme(theme)

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('system')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const value: ThemeProviderContextValue = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    resolvedTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  // Fallback for when used outside ThemeProvider (for standalone components)
  if (!context) {
    // Return a minimal implementation that reads from DOM
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    return {
      theme: isDark ? 'dark' : 'light',
      resolvedTheme: isDark ? 'dark' : 'light',
      setTheme: () => { },
    } as ThemeProviderContextValue
  }

  return context
}
