import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend, FROM_EMAIL } from "@/lib/email"
import { ForgotPasswordEmail } from "@/app/emails/forgot-password-email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, a password reset link has been sent.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save reset token to database
    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: {
        token: hashedToken,
        expiresAt,
      },
      create: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

    // Send email using Resend
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Reset Your Hope Autos Password",
        react: ForgotPasswordEmail({
          name: user.name || "User",
          resetUrl,
        } as any),
      })

      console.log(`Password reset email sent to ${user.email}`)
    } catch (emailError) {
      console.error("Error sending reset email:", emailError)
      // Continue even if email fails (for testing)
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}