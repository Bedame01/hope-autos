import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllInquiries } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allInquiries = await getAllInquiries()
    const userInquiries = allInquiries.filter((inquiry) => inquiry.userId === session.user.id)

    return NextResponse.json(userInquiries)
  } catch (error) {
    console.error("Error fetching user inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}
