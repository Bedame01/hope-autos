"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, LogOut, Menu, Settings, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeLogo } from "@/components/Theme-logo"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Inventory", href: "/cars" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  if (
    pathname.startsWith("/admin") ||
    pathname === "/auth/signin" ||
    pathname === "/auth/signup"
  ) {
    return null
  }

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" })
  }

  const initials =
    session?.user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"

  const renderAccountActions = (mobile = false) => {
    if (status === "loading") {
      return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" aria-label="Loading account" />
    }

    if (!session) {
      return (
        <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
          <Button variant="outline" className="rounded-full py-5.5 px-5" asChild>
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button className="rounded-full py-5.5 px-5 bg-blue-500" asChild>
            <Link href="/auth/signup">Create account</Link>
          </Button>
        </div>
      )
    }

    if (mobile) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{session.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
            <Link href="/dashboard"><User className="mr-2 h-4 w-4" />Dashboard</Link>
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
            <Link href="/favorites"><Heart className="mr-2 h-4 w-4" />Favorites</Link>
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
            <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
          </Button>
          {session.user.role === "admin" && (
            <Button variant="default" className="w-full bg-foreground justify-start rounded-xl" asChild>
              <Link href="/admin">Admin panel</Link>
            </Button>
          )}
          <Button variant="outline" className="w-full justify-start rounded-xl" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />Sign out
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3">
        {session.user.role === "admin" && (
          <Button variant="outline" size="sm" className="rounded-full px-4" asChild>
            <Link href="/admin">Admin panel</Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0" aria-label="Open account menu">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[70] w-56 rounded-2xl" align="end" forceMount>
            <div className="flex min-w-0 flex-col gap-1 p-3">
              <p className="truncate text-sm font-semibold">{session.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer"><User className="mr-2 h-4 w-4" />Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/favorites" className="cursor-pointer"><Heart className="mr-2 h-4 w-4" />Favorites</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl py-1.5">
      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <ThemeLogo className="w-13 h-auto"  />
            <span className="md:hidden lg:inline-block text-2xl font-bold text-gray-900 tracking-[-1px]">O'Hope <span className="text-blue-600">Autos.</span></span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {renderAccountActions()}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden min-h-[80vh]">
            <div className="space-y-1 flex flex-col items-center justify-center">
              {navigation.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-xl px-4 py-2.5 text-xl uppercase font-medium ${
                      isActive ? " text-blue-600" : "text-muted-foreground hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              {renderAccountActions(true)}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
