import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const body = await request.json()
        const { query, session_id } = body

        // Call the external API from the server side
        const response = await fetch(process.env.CHATBOT_API_URL || "https://ticketvault-api.onrender.com/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                session_id
            })
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || "Failed to process request" },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}