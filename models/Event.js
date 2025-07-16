// models/Event.js
import mongoose from "mongoose"

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  longDescription: String,
  image: String,
  category: String,
  venue: String,
  location: String,
  date: String,
  time: String,
  price: Number,
  originalPrice: Number,
  availableTickets: Number,
  soldCount: Number,
  trending: Boolean,
  isUserListing: Boolean,
  transferMethod: String,
  rating: Number,
  highlights: [String],
  venue_info: {
    address: String,
    capacity: String,
    parking: String,
    accessibility: String,
  },
})

export default mongoose.models.Event || mongoose.model("Event", EventSchema)
