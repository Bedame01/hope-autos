import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getFavoriteCarsByUserId } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const favoriteCars = await getFavoriteCarsByUserId(session.user.id)
    return NextResponse.json(favoriteCars)
  } catch (error) {
    console.error("Error fetching favorite cars:", error)
    return NextResponse.json({ error: "Failed to fetch favorite cars" }, { status: 500 })
  }
}
