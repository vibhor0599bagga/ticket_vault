// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
// import { eventSchema } from "@/lib/schemas/eventSchema"

// export async function GET() {
//   try {
//     const { db } = await connectToDatabase()
//     const events = await db.collection("events").find({}).toArray()
//     return NextResponse.json({ events })
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
//   }
// }

// export async function POST(req) {
//   try {
//     const body = await req.json()

//     // Validate incoming request
//     const validated = eventSchema.parse(body)

//     const { db } = await connectToDatabase()
//     const result = await db.collection("events").insertOne(validated)

//     return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/events error:", error)

//     if (error.name === "ZodError") {
//       return NextResponse.json(
//         { success: false, error: "Validation failed", issues: error.errors },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json({ success: false, error: "Failed to insert event" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // adjust this path as per your setup
import { connectToDatabase } from "@/lib/mongodb"
import { eventSchema } from "@/lib/schemas/eventSchema"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const events = await db.collection("events").find({}).toArray()
    return NextResponse.json({ events })
  } catch (error) {
    console.error("GET /api/events error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userEmail = session.user.email

    const body = await req.json()

    // Add sellerEmail before validating
    const fullData = {
      ...body,
      sellerEmail: userEmail,
    }

    const validated = eventSchema.parse(fullData)

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

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing event id" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id), sellerEmail: session.user.email })

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Event not found or not owned by user" }, { status: 404 })
    }
  } catch (error) {
    console.error("DELETE /api/events error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 })
  }
}
