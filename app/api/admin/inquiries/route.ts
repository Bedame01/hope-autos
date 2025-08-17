import { NextResponse } from "next/server"
import { getAllInquiries } from "@/lib/db"

export async function GET() {
  try {
    const inquiries = await getAllInquiries()
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}
