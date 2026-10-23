"use client"

import type React from "react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Car,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Cars", href: "/admin/cars", icon: Car },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    router.push("/auth/signin?callbackUrl=/admin")
    return null
  }

  if (session.user.role !== "admin") {
    router.push("/auth/unauthorized")
    return null
  }

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" })
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "A"

  const renderNavigation = (onNavigate?: () => void) => (
    <nav aria-label="Admin navigation" className="space-y-1.5">
      {navigation.map(({ name, href, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))

        return (
          <Link
            key={name}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {name}
          </Link>
        )
      })}
    </nav>
  )

  const renderProfile = () => (
    <div className="border-t border-border p-4">
      <div className="mb-4 flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
          <AvatarFallback className="bg-blue-600/10 font-semibold text-blue-700">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{session.user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full justify-start rounded-xl"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(19rem,85vw)] flex-col border-r border-border bg-background shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Link href="/admin" className="font-semibold tracking-tight text-foreground" onClick={() => setSidebarOpen(false)}>
                Hope Autos <span className="font-normal text-muted-foreground">/ Admin</span>
              </Link>
              <Button variant="ghost" size="icon" aria-label="Close admin menu" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{renderNavigation(() => setSidebarOpen(false))}</div>
            {renderProfile()}
          </aside>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-[4.5rem] items-center border-b border-border px-6">
          <Link href="/admin" className="font-semibold tracking-tight text-foreground">
            Hope Autos <span className="font-normal text-muted-foreground">/ Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </p>
          {renderNavigation()}
        </div>
        {renderProfile()}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-[4.5rem] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-xl lg:hidden"
              aria-label="Open admin menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm lg:text-base font-medium text-muted-foreground">Admin workspace</span>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to site</span>
              <span className="sm:hidden">Site</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
