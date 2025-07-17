import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(req, context) {
  try {
    const { sellerEmail } = await context.params
    const decodedEmail = decodeURIComponent(sellerEmail)
    const { db } = await connectToDatabase()
    const events = await db.collection("events").find({ sellerEmail: decodedEmail }).toArray()
    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error("GET /api/events/by-seller/[sellerEmail] error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}