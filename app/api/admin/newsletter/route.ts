import { createHash, randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isEmailServiceConfigured, sendEmail } from "@/lib/email"
import { isAdminRequest } from "@/lib/admin-auth"
import { NewsletterEmail } from "@/app/emails/newsletter-email"

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } })
    return NextResponse.json({ subscribers, emailConfigured: isEmailServiceConfigured() })
  } catch (error) {
    console.error("Error loading newsletter details:", error)
    return NextResponse.json({ error: "Failed to load newsletter details" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isEmailServiceConfigured()) {
    return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 })
  }

  try {
    const body: { subject?: unknown; message?: unknown } = await request.json()
    const subject = typeof body.subject === "string" ? body.subject.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!subject || subject.length > 160 || !message || message.length > 8000) {
      return NextResponse.json(
        { error: "Provide a subject (up to 160 characters) and message (up to 8,000 characters)." },
        { status: 400 },
      )
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { unsubscribedAt: null },
      select: { id: true, email: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "There are no active newsletter subscribers." }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    let sent = 0
    let failed = 0

    for (const subscriber of subscribers) {
      const token = randomBytes(32).toString("hex")
      const tokenHash = createHash("sha256").update(token).digest("hex")
      const unsubscribeUrl = new URL("/newsletter/unsubscribe", baseUrl)
      unsubscribeUrl.searchParams.set("token", token)
      try {
        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: { unsubscribeTokenHash: tokenHash },
        })

        await sendEmail({
          to: subscriber.email,
          subject,
          react: NewsletterEmail({ subject, message, unsubscribeUrl: unsubscribeUrl.toString() }),
          text: `${message}\n\nUnsubscribe: ${unsubscribeUrl.toString()}`,
          headers: { "List-Unsubscribe": `<${unsubscribeUrl.toString()}>` },
        })
        sent++
      } catch (error) {
        console.error(`Newsletter delivery failed for subscriber ${subscriber.id}:`, error)
        failed++
      }
    }

    return NextResponse.json({ sent, failed, total: subscribers.length })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
