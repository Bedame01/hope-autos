import { type NextRequest, NextResponse } from "next/server"
import { createInquiry } from "@/lib/db"
import type { ContactForm } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: ContactForm = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Create new inquiry in database
    const inquiry = await createInquiry({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      carId: body.carId,
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry. We will contact you soon!",
      inquiryId: inquiry.id,
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 })
  }
}
