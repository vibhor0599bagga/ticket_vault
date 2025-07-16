import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { eventSchema } from "@/lib/schemas/eventSchema"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const events = await db.collection("events").find({}).toArray()
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()

    // ✅ Validate incoming request
    const validated = eventSchema.parse(body)

    const { db } = await connectToDatabase()
    const result = await db.collection("events").insertOne(validated)

    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("POST /api/events error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: false, error: "Failed to insert event" }, { status: 500 })
  }
}
