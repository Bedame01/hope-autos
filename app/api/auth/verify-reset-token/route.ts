import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 })
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!resetToken) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({ message: "Token is valid" }, { status: 200 })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}