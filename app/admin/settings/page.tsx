"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, DollarSign } from "lucide-react"
import CurrencySettings from "../components/CurrencySettings"
import useLanguage from "../../../hooks/useLanguage" // Declare the useLanguage hook
import { useCurrency } from "@/app/contexts/CurrencyContext"

export default function AdminSettingsPage() {
  const { language, currency } = useLanguage()
  const { exchangeRate } = useCurrency()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10">
          <Settings className="h-6 w-6 text-blue-600" />
        </span>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Preferences</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Admin settings</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">Manage currency, language, and display settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Currency Settings */}
  <CurrencySettings />

      </div>

      {/* Current Settings Summary */}
      <Card className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600">Language:</span>
              </div>
              <Badge variant="secondary" className="max-w-[60%] rounded-full">
                {languages.find((l) => l.code === language)?.flag} {languages.find((l) => l.code === language)?.name}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600">Currency:</span>
              </div>
              <Badge variant="secondary" className="max-w-[60%] rounded-full">
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
          <div className="mt-4 rounded-2xl border border-blue-600/15 bg-blue-600/5 p-4">
            <p className="text-sm font-semibold text-foreground">Live USD price preview</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Vehicle editing recalculates the USD equivalent as the price changes, using the current reference rate of{" "}
              <span className="font-medium text-foreground">
                1 USD = ₦{exchangeRate.toLocaleString("en-NG")}
              </span>
              .
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
