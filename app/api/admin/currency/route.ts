import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.adminSetting.findUnique({
      where: { key: "exchangeRate" },
      select: { value: true, updatedAt: true },
    })

    return NextResponse.json({
      exchangeRate: Number(settings?.value ?? 1650),
      updatedAt: settings?.updatedAt ?? null,
    })
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

    const { exchangeRate } = await request.json()

    if (
      typeof exchangeRate !== "number" ||
      !Number.isFinite(exchangeRate) ||
      exchangeRate <= 0 ||
      exchangeRate > 1_000_000_000
    ) {
      return NextResponse.json({ error: "Exchange rate must be a positive number" }, { status: 400 })
    }

    const setting = await prisma.adminSetting.upsert({
      where: { key: "exchangeRate" },
      create: { key: "exchangeRate", value: String(exchangeRate) },
      update: { value: String(exchangeRate) },
      select: { value: true, updatedAt: true },
    })

    return NextResponse.json({
      exchangeRate: Number(setting.value),
      updatedAt: setting.updatedAt,
    })
  } catch (error) {
    console.error("Error saving currency settings:", error)
    return NextResponse.json({ error: "Failed to save currency settings" }, { status: 500 })
  }
}
