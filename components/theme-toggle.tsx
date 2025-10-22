"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="size-[1.2rem] max-sm:size-4 opacity-50" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="size-[1.2rem] max-sm:size-4 transition-all" />
      case "light":
        return <Sun className="size-[1.2rem] max-sm:size-4 transition-all" />
      default:
        return <Monitor className="size-[1.2rem] max-sm:size-4 transition-all" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-border hover:bg-accent hover:text-accent-foreground bg-transparent rounded-lg"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover border-border" sideOffset={5}>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="mr-2 size-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          <Moon className="mr-2 size-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          <Monitor className="mr-2 size-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
