"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // When mounted on client, we can show the UI
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // To prevent hydration mismatch, we render a placeholder.
    // The size and variant should match the final button to avoid layout shift.
    return <Button variant="ghost" size="icon" disabled className="rounded-md" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-md relative overflow-hidden"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300 dark:translate-y-8 dark:opacity-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] -translate-y-8 opacity-0 transition-all duration-300 dark:translate-y-0 dark:opacity-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
