import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { db } = await connectToDatabase()

    // Validate the ID format before querying
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const event = await db.collection("events").findOne({ _id: new ObjectId(params.id) })

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event, { status: 200 })
  } catch (err) {
    console.error("Error fetching event by ID:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
