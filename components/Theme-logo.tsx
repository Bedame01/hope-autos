import { cn } from "@/lib/utils"
import logoBlack from '@/public/icons/logo-black.png'
import logoWhite from '@/public/icons/logo-white.png'

interface ThemeLogoProps {
  className?: string
}

export function ThemeLogo({ className }: ThemeLogoProps) {
  return (
    <>
      <img src={logoBlack.src} alt="H100 Lounge Logo" className={cn("h-auto dark:hidden", className)} />
      <img src={logoWhite.src} alt="" aria-hidden="true" className={cn("hidden h-auto dark:block", className)} />
    </>
  )
}