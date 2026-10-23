"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UnsubscribeForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState("")

  const unsubscribe = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const result: { error?: string } = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to unsubscribe.")
      setComplete(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to unsubscribe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-muted/20 px-4 py-16">
      <Card className="w-full max-w-lg rounded-3xl border-border/80 shadow-sm">
        <CardContent className="p-7 text-center sm:p-10">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
            {complete ? <Check className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
          </span>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Hope Autos newsletter</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {complete ? "You’re unsubscribed" : "Manage your subscription"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {complete
              ? "You won’t receive future newsletter emails from us."
              : "Confirm below to stop receiving Hope Autos newsletter emails."}
          </p>
          {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
          {!complete && (
            <Button onClick={unsubscribe} disabled={loading || !token} className="mt-6 w-full rounded-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {token ? "Unsubscribe" : "Invalid unsubscribe link"}
            </Button>
          )}
          <Link href="/" className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline">
            Return to Hope Autos
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
