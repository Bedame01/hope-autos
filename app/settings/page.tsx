"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Mail, Heart, TrendingUp, Package, Save, Check, AlertCircle, Loader2 } from "lucide-react"

interface NotificationPreferences {
  emailNotifications: boolean
  priceAlerts: boolean
  newArrivals: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    priceAlerts: true,
    newArrivals: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchPreferences()
    }
  }, [status])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/notifications/email")
      if (!response.ok) throw new Error("Failed to fetch preferences")

      const data = await response.json()
      setPreferences(data)
      setError("")
    } catch (error) {
      console.error("Error fetching preferences:", error)
      setError("Failed to load notification preferences")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
    setSaved(false)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")

    try {
      const response = await fetch("/api/notifications/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) throw new Error("Failed to save preferences")

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving preferences:", error)
      setError("Failed to save notification preferences")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your notification preferences and account settings</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {saved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Settings saved successfully</AlertDescription>
          </Alert>
        )}

        {/* Notification Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications Master Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                </div>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(value) => handlePreferenceChange("emailNotifications", value)}
                disabled={saving}
              />
            </div>

            {preferences.emailNotifications && (
              <div className="space-y-4 pl-8 border-l-2 border-blue-200">
                {/* Price Alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-foreground">Price Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about price drops on your favorites</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.priceAlerts}
                    onCheckedChange={(value) => handlePreferenceChange("priceAlerts", value)}
                    disabled={saving || !preferences.emailNotifications}
                  />
                </div>

                {/* New Arrivals */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium text-foreground">New Arrivals</p>
                      <p className="text-sm text-muted-foreground">Be the first to know about new vehicles</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.newArrivals}
                    onCheckedChange={(value) => handlePreferenceChange("newArrivals", value)}
                    disabled={saving || !preferences.emailNotifications}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground mt-1">{session.user?.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground mt-1">{session.user?.email || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites & Preferences Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <a href="/dashboard">
                <Heart className="h-4 w-4 mr-2" />
                View Favorites
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <a href="/auth/reset-password">Change Password</a>
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 bg-transparent" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => fetchPreferences()} disabled={saving}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}