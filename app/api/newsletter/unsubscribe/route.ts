import { createHash } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body: { token?: unknown } = await request.json()
    if (typeof body.token !== "string" || body.token.length < 32 || body.token.length > 128) {
      return NextResponse.json({ error: "This unsubscribe link is invalid or expired." }, { status: 400 })
    }

    const tokenHash = createHash("sha256").update(body.token).digest("hex")
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeTokenHash: tokenHash },
      select: { id: true, unsubscribedAt: true },
    })

    if (!subscriber) {
      return NextResponse.json({ error: "This unsubscribe link is invalid or expired." }, { status: 404 })
    }

    if (!subscriber.unsubscribedAt) {
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: { unsubscribedAt: new Date(), unsubscribeTokenHash: null },
      })
    }

    return NextResponse.json({ success: true, message: "You have been unsubscribed from the newsletter." })
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error)
    return NextResponse.json({ error: "Unable to unsubscribe right now. Please try again." }, { status: 500 })
  }
}
