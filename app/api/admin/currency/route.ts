import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return current currency setting (you can store this in database)
    const settings = {
      currency: "USD", // Default currency
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching currency settings:", error)
    return NextResponse.json({ error: "Failed to fetch currency settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency } = await request.json()

    if (!currency || !["USD", "NGN"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    // Here you would save to database
    // For now, we'll just return success
    const settings = {
      currency,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error saving currency settings:", error)
    return NextResponse.json({ error: "Failed to save currency settings" }, { status: 500 })
  }
}
