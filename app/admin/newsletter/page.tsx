"use client"

import { FormEvent, useEffect, useState } from "react"
import { AlertCircle, Check, Loader2, Mail, Send, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface NewsletterDetails {
  subscribers: number
  emailConfigured: boolean
}

export default function AdminNewsletterPage() {
  const [details, setDetails] = useState<NewsletterDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState("")

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const response = await fetch("/api/admin/newsletter")
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load newsletter details.")
        setDetails(data)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load newsletter details.")
      } finally {
        setLoading(false)
      }
    }
    void loadDetails()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!details?.subscribers || !window.confirm(`Send this newsletter to ${details.subscribers} active subscribers?`)) {
      return
    }

    setSending(true)
    setError("")
    setResult("")

    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      })
      const data: { sent?: number; failed?: number; error?: string } = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to send newsletter.")

      setResult(`Newsletter sent to ${data.sent ?? 0} subscriber${data.sent === 1 ? "" : "s"}${data.failed ? `; ${data.failed} delivery${data.failed === 1 ? "" : "ies"} failed` : ""}.`)
      setSubject("")
      setMessage("")
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send newsletter.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Audience</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Newsletter</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Write and send an update to customers who opted in.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Alert className="rounded-2xl border-green-600/20 bg-green-600/5">
          <Check className="h-4 w-4 text-green-700" />
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <Card className="rounded-3xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Compose newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="newsletter-subject" className="mb-2 block text-sm font-medium text-foreground">Subject</label>
                <Input
                  id="newsletter-subject"
                  required
                  maxLength={160}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="What would you like to share?"
                  className="h-11 rounded-xl"
                  disabled={sending}
                />
              </div>
              <div>
                <label htmlFor="newsletter-message" className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <Textarea
                  id="newsletter-message"
                  required
                  maxLength={8000}
                  rows={10}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write your newsletter message. Separate paragraphs with a blank line."
                  className="min-h-56 resize-y rounded-xl"
                  disabled={sending}
                />
                <p className="mt-2 text-xs text-muted-foreground">{message.length}/8000 characters</p>
              </div>
              <Button type="submit" className="w-full rounded-full sm:w-auto" disabled={sending || loading || !details?.subscribers || !details.emailConfigured}>
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {sending ? "Sending newsletter..." : "Send to subscribers"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardContent className="p-5">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                <Users className="h-5 w-5" />
              </span>
              <p className="text-sm text-muted-foreground">Active subscribers</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /> : details?.subscribers ?? "—"}
              </p>
            </CardContent>
          </Card>
          <div className="rounded-3xl border border-border/80 bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold">Subscriber-first delivery</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Campaigns go only to people who subscribed. Each email includes an unsubscribe link.
            </p>
            {details && !details.emailConfigured && (
              <p className="mt-3 text-sm font-medium text-destructive">Configure SMTP settings to enable delivery.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
