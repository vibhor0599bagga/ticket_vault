import { NextResponse } from "next/server"

// This would be imported from the main events route
// For demo purposes, using the same in-memory storage
const events = [] // This should be shared with the main route

// GET /api/events/[id] - Fetch single event
export async function GET(request, { params }) {
  try {
    const event = events.find((e) => e.id === Number.parseInt(params.id))

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(request, { params }) {
  try {
    const updates = await request.json()
    const eventIndex = events.findIndex((e) => e.id === Number.parseInt(params.id))

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    events[eventIndex] = { ...events[eventIndex], ...updates }

    return NextResponse.json({
      success: true,
      event: events[eventIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(request, { params }) {
  try {
    const eventIndex = events.findIndex((e) => e.id === Number.parseInt(params.id))

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    events.splice(eventIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
