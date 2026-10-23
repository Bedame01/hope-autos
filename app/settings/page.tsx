"use client"

import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Bell, Check, Heart, Loader2, LogOut, Mail, Package, Save, TrendingDown, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface NotificationPreferences {
  emailNotifications: boolean
  priceAlerts: boolean
  newArrivals: boolean
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  priceAlerts: true,
  newArrivals: true,
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/settings")
      return
    }
    if (status !== "authenticated") return

    const loadPreferences = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch("/api/notifications/email", { cache: "no-store" })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load notification settings.")
        setPreferences(data)
      } catch (loadError) {
        console.error("Error loading notification preferences:", loadError)
        setError(loadError instanceof Error ? loadError.message : "Unable to load notification settings.")
      } finally {
        setLoading(false)
      }
    }
    void loadPreferences()
  }, [status, router])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const response = await fetch("/api/notifications/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to save notification settings.")
      setPreferences(data)
      setSaved(true)
    } catch (saveError) {
      console.error("Error saving notification preferences:", saveError)
      setError(saveError instanceof Error ? saveError.message : "Unable to save notification settings.")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-muted/20 px-4">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground">Loading your settings...</p>
      </main>
    )
  }

  if (!session) return null

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Your account</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage your account details and email preferences.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {saved && (
          <Alert className="rounded-2xl border-green-600/20 bg-green-600/5">
            <Check className="h-4 w-4 text-green-700" />
            <AlertDescription className="text-green-800 dark:text-green-300">Your settings are up to date.</AlertDescription>
          </Alert>
        )}

        <Card className="rounded-3xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600"><User className="h-4 w-4" /></span>
              Account information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</p>
              <p className="mt-1 break-words font-medium text-foreground">{session.user?.name || "Not provided"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
              <p className="mt-1 break-all font-medium text-foreground">{session.user?.email || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600"><Bell className="h-4 w-4" /></span>
              Email notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 p-4">
              <div className="flex min-w-0 items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Email updates</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">Allow Hope Autos to send account and vehicle updates.</p>
                </div>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(value) => handlePreferenceChange("emailNotifications", value)}
                disabled={saving}
                aria-label="Email updates"
              />
            </div>
            <div className={`space-y-3 transition-opacity ${preferences.emailNotifications ? "" : "opacity-50"}`}>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Price drops</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">Get notified when a favorited car changes price.</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.priceAlerts}
                  onCheckedChange={(value) => handlePreferenceChange("priceAlerts", value)}
                  disabled={saving || !preferences.emailNotifications}
                  aria-label="Price drop alerts"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">New arrivals</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">Hear when newly listed vehicles arrive.</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.newArrivals}
                  onCheckedChange={(value) => handlePreferenceChange("newArrivals", value)}
                  disabled={saving || !preferences.emailNotifications}
                  aria-label="New vehicle arrivals"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/favorites"><Heart className="mr-2 h-4 w-4" />Favorite vehicles</Link>
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => void signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />Sign out
            </Button>
          </div>
          <Button onClick={handleSave} disabled={saving || loading} className="rounded-full px-6">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Saving..." : "Save preferences"}
          </Button>
        </div>
      </div>
    </main>
  )
}
