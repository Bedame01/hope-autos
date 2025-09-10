"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, Bell, Car, Shield, Palette, Save, X } from "lucide-react"
import Link from "next/link"

interface UserPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  priceAlerts: boolean
  newArrivals: boolean
  marketingNotifications: boolean
  maxPrice: number
  preferredMakes: string[]
  preferredFuelTypes: string[]
  preferredBodyTypes: string[]
  profileVisible: boolean
  showEmail: boolean
  showPhone: boolean
}

const carMakes = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Nissan", "Hyundai", "Kia", "Mazda"]
const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"]
const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Truck", "Van"]

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    bio: "",
  })

  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    priceAlerts: true,
    newArrivals: true,
    marketingNotifications: false,
    maxPrice: 50000,
    preferredMakes: [],
    preferredFuelTypes: [],
    preferredBodyTypes: [],
    profileVisible: true,
    showEmail: false,
    showPhone: false,
  })

  useEffect(() => {
    setMounted(true)
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        bio: "",
      })
      loadPreferences()
    }
  }, [session])

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences({ ...preferences, ...data })
      }
    } catch (error) {
      console.error("Failed to load preferences:", error)
    }
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        await update({ name: profile.name })
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been successfully saved.",
        })
      } else {
        throw new Error("Failed to update preferences")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information and profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="border border-[var(--border-line)] py-5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter your email"
                  className="border border-[var(--border-line)] py-5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="border border-[var(--border-line)] py-5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
                className="bg-[var(--background)]/20"
              />
            </div>
            <Button onClick={handleProfileUpdate} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the appearance of the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </Button>
                  <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Switch
                checked={preferences.smsNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, smsNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Price Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when car prices drop</p>
              </div>
              <Switch
                checked={preferences.priceAlerts}
                onCheckedChange={(checked) => setPreferences({ ...preferences, priceAlerts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>New Arrivals</Label>
                <p className="text-sm text-muted-foreground">Get notified about new car listings</p>
              </div>
              <Switch
                checked={preferences.newArrivals}
                onCheckedChange={(checked) => setPreferences({ ...preferences, newArrivals: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
              </div>
              <Switch
                checked={preferences.marketingNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, marketingNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Search Preferences
            </CardTitle>
            <CardDescription>Set your preferred car search criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Maximum Price Range: ${preferences.maxPrice.toLocaleString()}</Label>
              <input
                type="range"
                id="maxPrice"
                min="5000"
                max="100000"
                step="5000"
                value={preferences.maxPrice}
                onChange={(e) => setPreferences({ ...preferences, maxPrice: Number.parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$5,000</span>
                <span>$100,000</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferred Car Makes</Label>
              <div className="flex flex-wrap gap-2">
                {carMakes.map((make) => (
                  <Badge
                    key={make}
                    variant={preferences.preferredMakes.includes(make) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      toggleArrayItem(preferences.preferredMakes, make, (arr) =>
                        setPreferences({ ...preferences, preferredMakes: arr }),
                      )
                    }
                  >
                    {make}
                    {preferences.preferredMakes.includes(make) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferred Fuel Types</Label>
              <div className="flex flex-wrap gap-2">
                {fuelTypes.map((fuel) => (
                  <Badge
                    key={fuel}
                    variant={preferences.preferredFuelTypes.includes(fuel) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      toggleArrayItem(preferences.preferredFuelTypes, fuel, (arr) =>
                        setPreferences({ ...preferences, preferredFuelTypes: arr }),
                      )
                    }
                  >
                    {fuel}
                    {preferences.preferredFuelTypes.includes(fuel) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferred Body Types</Label>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((body) => (
                  <Badge
                    key={body}
                    variant={preferences.preferredBodyTypes.includes(body) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      toggleArrayItem(preferences.preferredBodyTypes, body, (arr) =>
                        setPreferences({ ...preferences, preferredBodyTypes: arr }),
                      )
                    }
                  >
                    {body}
                    {preferences.preferredBodyTypes.includes(body) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your privacy and data sharing preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <Switch
                checked={preferences.profileVisible}
                onCheckedChange={(checked) => setPreferences({ ...preferences, profileVisible: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email Address</Label>
                <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
              </div>
              <Switch
                checked={preferences.showEmail}
                onCheckedChange={(checked) => setPreferences({ ...preferences, showEmail: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Phone Number</Label>
                <p className="text-sm text-muted-foreground">Display your phone number on your public profile</p>
              </div>
              <Switch
                checked={preferences.showPhone}
                onCheckedChange={(checked) => setPreferences({ ...preferences, showPhone: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save All Settings */}
        <div className="flex justify-end">
          <Button onClick={handlePreferencesUpdate} disabled={loading} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>

      <div className="border-t border-[var(--border-line)] mt-8 pt-8 md:pt-10 text-center text-sm sm:text-[15px]">
        <p className="text-[var(--text-color)] mb-1.5">
          © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
        </p>
        <p className="text-[var(--text-color)]">No 1 Nigeria Best Vehicle Dealership</p>
      </div>
    </div>
  )
}
