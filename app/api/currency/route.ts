import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const DEFAULT_NGN_PER_USD = 1650

export async function GET() {
  try {
    const setting = await prisma.adminSetting.findUnique({
      where: { key: "exchangeRate" },
      select: { value: true },
    })
    const exchangeRate = Number(setting?.value ?? DEFAULT_NGN_PER_USD)

    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      console.error("Stored currency exchange rate is invalid")
      return NextResponse.json({ error: "Currency exchange rate is invalid" }, { status: 500 })
    }

    return NextResponse.json({ exchangeRate })
  } catch (error) {
    console.error("Error fetching currency exchange rate:", error)
    return NextResponse.json({ error: "Failed to fetch currency exchange rate" }, { status: 500 })
  }
}
