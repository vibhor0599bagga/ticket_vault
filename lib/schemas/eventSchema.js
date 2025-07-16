import { z } from "zod"

export const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  date: z.string(),
  time: z.string().optional(),
  venue: z.string(),
  location: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  image: z.string().optional(),
  category: z.string(),
  rating: z.number().min(0).max(5).optional(),
  soldCount: z.number().optional(),
  trending: z.boolean().optional(),
  availableTickets: z.number().nonnegative(),
  description: z.string(),
  longDescription: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  venue_info: z
    .object({
      address: z.string(),
      capacity: z.string().optional(),
      parking: z.string().optional(),
      accessibility: z.string().optional(),
    })
    .optional(),
  section: z.string().optional(),
  row: z.string().optional(),
  seats: z.string().optional(),
  seller: z.string().optional(),
  isUserListing: z.boolean().optional(),
  transferMethod: z.string().optional(),
})
