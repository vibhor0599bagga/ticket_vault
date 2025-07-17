// import { z } from "zod"

// export const eventSchema = z.object({
//   id: z.number().optional(),
//   title: z.string(),
//   date: z.string(),
//   time: z.string().optional(),
//   venue: z.string(),
//   location: z.string(),
//   price: z.number(),
//   originalPrice: z.number(),
//   image: z.string().optional(),
//   category: z.string(),
//   rating: z.number().min(0).max(5).optional(),
//   soldCount: z.number().optional(),
//   trending: z.boolean().optional(),
//   availableTickets: z.number().nonnegative(),
//   description: z.string(),
//   longDescription: z.string().optional(),
//   highlights: z.array(z.string()).optional(),
//   venue_info: z
//     .object({
//       address: z.string(),
//       capacity: z.string().optional(),
//       parking: z.string().optional(),
//       accessibility: z.string().optional(),
//     })
//     .optional(),
//   section: z.string().optional(),
//   row: z.string().optional(),
//   seats: z.string().optional(),
//   seller: z.string().optional(),
//   isUserListing: z.boolean().optional(),
//   transferMethod: z.string().optional(),
// })
import { z } from "zod"

export const eventSchema = z.object({
  id: z.number().optional(),

  // Basic event details
  title: z.string(),
  date: z.string(),
  time: z.string().optional(),
  venue: z.string(),
  location: z.string(),

  // Pricing
  price: z.number(),
  originalPrice: z.number(),

  // Image and category
  image: z.string().optional(),
  category: z.string(),

  // Analytics & flags
  rating: z.number().min(0).max(5).optional().default(0),
  soldCount: z.number().optional().default(0),
  trending: z.boolean().optional().default(false),

  // Tickets
  availableTickets: z.number().nonnegative(),
  transferMethod: z.string().optional(),

  // Descriptions
  description: z.string(),
  longDescription: z.string().optional(),

  // UI highlights
  highlights: z.array(z.string()).optional(),

  // Venue info
  venue_info: z
    .object({
      address: z.string(),
      capacity: z.string().optional(),
      parking: z.string().optional(),
      accessibility: z.string().optional(),
    })
    .optional(),

  // Seat info
  section: z.string().optional(),
  row: z.string().optional(),
  seats: z.string().optional(),

  // Seller info
  seller: z.string().optional().default("Anonymous"),
  sellerEmail: z.string().email(), // ✅ REQUIRED for user filtering

  isUserListing: z.boolean().optional().default(true),
})
