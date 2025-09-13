"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, DollarSign, Save, Check } from "lucide-react"
import CurrencySettings from "../components/CurrencySettings"
import useLanguage from "../../../hooks/useLanguage" // Declare the useLanguage hook

export default function AdminSettingsPage() {
  const { t, language, currency, setLanguage, setCurrency, formatPrice } = useLanguage()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  const handleSave = async () => {
    setSaving(true)

    try {
      // Save to API (you can implement this endpoint)
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, currency }),
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">Manage site currency and display settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Settings */}
  <CurrencySettings />

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">More settings will be available here in future updates.</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600">Language:</span>
              </div>
              <Badge variant="secondary">
                {languages.find((l) => l.code === language)?.flag} {languages.find((l) => l.code === language)?.name}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600">Currency:</span>
              </div>
              <Badge variant="secondary">
                {[
                  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
                  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇳" }
                ].find((c) => c.code === currency)?.flag} {[
                  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
                  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇳" }
                ].find((c) => c.code === currency)?.symbol} {[
                  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
                  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇳" }
                ].find((c) => c.code === currency)?.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="min-w-32">
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t("common.save")}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
