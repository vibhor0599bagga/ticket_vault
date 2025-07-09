import { NextResponse } from "next/server"

// In-memory storage (replace with real database)
const events = [
  {
    id: 1,
    title: "Taylor Swift - Eras Tour",
    date: "2024-08-15",
    time: "8:00 PM",
    venue: "Madison Square Garden",
    location: "New York, NY",
    price: 150,
    originalPrice: 200,
    image: "/placeholder.svg?height=300&width=400",
    category: "Concert",
    rating: 4.9,
    soldCount: 1250,
    trending: true,
    availableTickets: 15,
    description: "Experience the magic of Taylor Swift's record-breaking Eras Tour",
    isUserListing: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  // ... other default events
]

// GET /api/events - Fetch all events
export async function GET() {
  try {
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - Create new event
export async function POST(request) {
  try {
    const eventData = await request.json()

    const newEvent = {
      id: Math.max(...events.map((e) => e.id), 0) + 1,
      ...eventData,
      soldCount: 0,
      rating: 4.5,
      trending: false,
      isUserListing: true,
      createdAt: new Date().toISOString(),
    }

    events.push(newEvent)

    return NextResponse.json({
      success: true,
      event: newEvent,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
