"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, Check, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const result: { message?: string; error?: string } = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to subscribe right now.")

      setStatus("success")
      setMessage(result.message || "Thanks for subscribing.")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Unable to subscribe right now.")
    }
  }

  return (
    <section className="mx-auto mt-12 flex bg-muted/30 max-w-8xl flex-col justify-between gap-8 overflow-hidden rounded-3xl px-8 py-10 sm:px-12 sm:py-14 lg:flex-row lg:items-center" aria-labelledby="newsletter-title">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-600">
            <Mail className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Hope Autos newsletter</p>
          </div>
          <h2 id="newsletter-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Good cars. In your inbox.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 opacity-65 sm:text-base">
            Get occasional dealership news and handpicked vehicle updates. Unsubscribe any time.
          </p>
        </div>
        {status === "success" ? (
          <p className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400" role="status">
            <Check className="h-4 w-4" />{message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full md:w-[min(100%,26rem)]">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-label="Email address for newsletter"
                disabled={status === "loading"}
                className="h-12 rounded-full bg-background px-4"
              />
              <Button type="submit" disabled={status === "loading"} className="h-11 shrink-0 rounded-full px-5 bg-blue-500">
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
            {status === "error" && <p className="mt-2 text-sm text-destructive" role="alert">{message}</p>}
          </form>
        )}
      </div>
    </section>
  )
}
