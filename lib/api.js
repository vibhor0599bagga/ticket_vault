// API functions for server communication
export class EventAPI {
  static async getAllEvents() {
    try {
      const response = await fetch("/api/events")
      return await response.json()
    } catch (error) {
      console.error("Error fetching events:", error)
      return []
    }
  }

  static async createEvent(eventData) {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })
      return await response.json()
    } catch (error) {
      console.error("Error creating event:", error)
      throw error
    }
  }

  static async updateEvent(id, updates) {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      return await response.json()
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  }

  static async deleteEvent(id) {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      console.error("Error deleting event:", error)
      throw error
    }
  }
}
