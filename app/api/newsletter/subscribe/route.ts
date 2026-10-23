import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body: { email?: unknown } = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: { unsubscribedAt: null, unsubscribeTokenHash: null, subscribedAt: new Date() },
    })

    return NextResponse.json({ success: true, message: "You're on the list. Thanks for subscribing!" })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Unable to subscribe right now. Please try again." }, { status: 500 })
  }
}
