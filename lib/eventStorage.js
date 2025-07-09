// Event storage utility functions for localStorage
export class EventStorage {
  static getEvents() {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("ticketVaultEvents")
      if (stored) {
        return JSON.parse(stored)
      }

      // Return default events if none stored
      const defaultEvents = [
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
          longDescription:
            "The Eras Tour is Taylor Swift's sixth headlining concert tour. The tour is in support of Swift's entire discography, following the re-recording of her first six studio albums.",
          highlights: [
            "3+ hour spectacular show",
            "Songs from all Taylor Swift eras",
            "Surprise acoustic performances",
            "Elaborate stage production",
            "Multiple costume changes",
          ],
          venue_info: {
            address: "4 Pennsylvania Plaza, New York, NY 10001",
            capacity: "20,789",
            parking: "Available at Penn Station and nearby lots",
            accessibility: "ADA compliant with wheelchair accessible seating",
          },
          section: "Floor Section A",
          row: "12",
          seats: "15-16",
          seller: "TicketMaster",
          isUserListing: false,
        },
        {
          id: 2,
          title: "Avengers: Secret Wars",
          date: "2024-07-20",
          time: "7:30 PM",
          venue: "AMC Empire 25",
          location: "New York, NY",
          price: 25,
          originalPrice: 30,
          image: "/placeholder.svg?height=300&width=400",
          category: "Movie",
          rating: 4.8,
          soldCount: 890,
          trending: false,
          availableTickets: 8,
          description: "The ultimate Marvel showdown comes to the big screen",
          longDescription:
            "Avengers: Secret Wars brings together heroes from across the multiverse in the most ambitious Marvel film yet.",
          highlights: [
            "Epic multiverse storyline",
            "All-star Marvel cast",
            "Cutting-edge visual effects",
            "IMAX and Dolby Atmos available",
            "Post-credits scenes",
          ],
          venue_info: {
            address: "234 W 42nd St, New York, NY 10036",
            capacity: "500 seats",
            parking: "Times Square parking garages nearby",
            accessibility: "Wheelchair accessible with assistive listening devices",
          },
          section: "Premium Seats",
          row: "F",
          seats: "12-13",
          seller: "AMC Theatres",
          isUserListing: false,
        },
        {
          id: 3,
          title: "Lakers vs Warriors",
          date: "2024-08-10",
          time: "8:00 PM",
          venue: "Crypto.com Arena",
          location: "Los Angeles, CA",
          price: 120,
          originalPrice: 150,
          image: "/placeholder.svg?height=300&width=400",
          category: "Sports",
          rating: 4.7,
          soldCount: 2100,
          trending: true,
          availableTickets: 12,
          description: "Epic NBA showdown between two legendary teams",
          longDescription:
            "Watch as the Los Angeles Lakers take on the Golden State Warriors in this highly anticipated matchup.",
          highlights: [
            "Star-studded lineups",
            "Playoff implications",
            "Premium arena experience",
            "Pre-game entertainment",
            "Concession specials",
          ],
          venue_info: {
            address: "1111 S Figueroa St, Los Angeles, CA 90015",
            capacity: "20,000",
            parking: "On-site parking available",
            accessibility: "ADA compliant with special seating areas",
          },
          section: "Lower Bowl",
          row: "15",
          seats: "8-9",
          seller: "StubHub",
          isUserListing: false,
        },
      ]

      this.saveEvents(defaultEvents)
      return defaultEvents
    } catch (error) {
      console.error("Error loading events:", error)
      return []
    }
  }

  static saveEvents(events) {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("ticketVaultEvents", JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events:", error)
    }
  }

  static addEvent(eventData) {
    try {
      const events = this.getEvents()
      const newId = Math.max(...events.map((e) => e.id), 0) + 1

      const newEvent = {
        id: newId,
        ...eventData,
        soldCount: 0,
        rating: 4.5,
        trending: false,
        isUserListing: true,
        createdAt: new Date().toISOString(),
      }

      events.push(newEvent)
      this.saveEvents(events)
      return newEvent
    } catch (error) {
      console.error("Error adding event:", error)
      throw error
    }
  }

  static getEventById(id) {
    try {
      const events = this.getEvents()
      return events.find((event) => event.id === Number.parseInt(id))
    } catch (error) {
      console.error("Error getting event by ID:", error)
      return null
    }
  }

  static updateEvent(id, updates) {
    try {
      const events = this.getEvents()
      const eventIndex = events.findIndex((e) => e.id === Number.parseInt(id))

      if (eventIndex === -1) {
        throw new Error("Event not found")
      }

      events[eventIndex] = { ...events[eventIndex], ...updates }
      this.saveEvents(events)
      return events[eventIndex]
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  }

  static deleteEvent(id) {
    try {
      const events = this.getEvents()
      const filteredEvents = events.filter((e) => e.id !== Number.parseInt(id))
      this.saveEvents(filteredEvents)
      return true
    } catch (error) {
      console.error("Error deleting event:", error)
      throw error
    }
  }
}
