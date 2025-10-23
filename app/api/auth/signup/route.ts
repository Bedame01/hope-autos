import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { emailService } from "@/lib/email-service"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)


    // Create user with preferences
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        phone: phone || null,
        password: hashedPassword,
        role: "CUSTOMER",
        emailVerified: null,
        preferences: {
          create: {
            emailNotifications: true,
            smsNotifications: false,
            priceAlerts: true,
            newArrivals: true,
            preferredMakes: [],
            preferredFuelTypes: [],
            theme: "light",
            language: "en",
            timezone: "UTC",
            currency: "USD",
          },
        },
      },
      include: {
        preferences: true,
      },
    })

    // Send welcome email (non-blocking, but you can await if you want to handle errors)
    emailService.sendWelcomeEmail(user.email).catch((err) => {
      console.error("Failed to send welcome email:", err)
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. You can now sign in.",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 })
  }
}