import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get search params for pagination
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Mock email logs data - in production, this would come from database
    const emailLogs = [
      {
        id: "log_1",
        type: "welcome",
        recipient: session.user.email,
        subject: "Welcome to Hope Autos",
        status: "delivered",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "log_2",
        type: "price-alert",
        recipient: session.user.email,
        subject: "Price Drop Alert! 2020 Toyota Camry",
        status: "delivered",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "log_3",
        type: "new-arrivals",
        recipient: session.user.email,
        subject: "New Vehicles Arrived! - 3 New Cars",
        status: "delivered",
        sentAt: new Date(Date.now() - 1000 * 60).toISOString(),
      },
    ]

    return NextResponse.json({
      logs: emailLogs.slice(skip, skip + limit),
      total: emailLogs.length,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching email logs:", error)
    return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 })
  }
}