"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, MapPin, Star, Users, Clock, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { EventStorage } from "@/lib/eventStorage"
import { Navbar } from "@/components/navbar"
import { useSession } from "next-auth/react"

export default function EventDetailPage({ params }) {
  const { data: session } = useSession()
  const [event, setEvent] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load event from localStorage
    const eventData = EventStorage.getEventById(params.id)

    if (eventData) {
      setEvent(eventData)
    }

    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Event Not Found</h1>
            <Link href="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div className="relative">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
              {event.trending && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">🔥 Trending</Badge>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{event.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{event.rating}</span>
                  <span className="text-slate-500">({event.soldCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-4">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-slate-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="text-sm">{event.time}</div>
                  </div>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-sm">{event.location}</div>
                  </div>
                </div>
                <div className="flex items-center text-slate-600">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">{event.soldCount} attending</div>
                    <div className="text-sm">{event.availableTickets} tickets left</div>
                  </div>
                </div>
                <div className="flex items-center text-slate-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Doors open</div>
                    <div className="text-sm">30 minutes before show</div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-700 mb-6">{event.description}</p>

              <div className="prose max-w-none">
                <p className="text-slate-600">{event.longDescription}</p>
              </div>
            </div>

            {event.isUserListing && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">👤</span>
                    </div>
                    <span className="font-semibold text-blue-800">Individual Seller</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    This ticket is being sold by an individual seller through our secure marketplace.
                  </p>
                  {event.transferMethod && (
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>Transfer Method:</strong> {event.transferMethod}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Event Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Event Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-slate-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Venue Information */}
            <Card>
              <CardHeader>
                <CardTitle>Venue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Address</h4>
                  <p className="text-slate-600">{event.venue_info.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Capacity</h4>
                  <p className="text-slate-600">{event.venue_info.capacity}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Parking</h4>
                  <p className="text-slate-600">{event.venue_info.parking}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Accessibility</h4>
                  <p className="text-slate-600">{event.venue_info.accessibility}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-slate-900">${event.price}</span>
                    {event.originalPrice > event.price && (
                      <span className="text-lg text-slate-500 line-through">${event.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">per ticket</p>
                  {event.originalPrice > event.price && (
                    <p className="text-sm text-green-600 font-medium">
                      Save ${event.originalPrice - event.price} per ticket!
                    </p>
                  )}
                </div>

                <Separator />

                {/* Quantity Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Number of Tickets</label>
                  <Select
                    value={selectedQuantity.toString()}
                    onValueChange={(value) => setSelectedQuantity(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(8, event.availableTickets) }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "ticket" : "tickets"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">{event.availableTickets} tickets available</p>
                </div>

                {/* Total Price */}
                {selectedQuantity > 1 && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Subtotal ({selectedQuantity} tickets):</span>
                      <span className="font-semibold">${(event.price * selectedQuantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                      <span>+ fees & taxes</span>
                      <span>~${(selectedQuantity * 17.46).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                {session ? (
                  <Link href={`/checkout?eventId=${event.id}&quantity=${selectedQuantity}&price=${event.price}`}>
                    <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                      Buy Tickets - ${(event.price * selectedQuantity).toFixed(2)}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signin">
                    <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                      Sign In to Buy Tickets
                    </Button>
                  </Link>
                )}

                <div className="text-center text-xs text-slate-500">🔒 Secure checkout • Instant confirmation</div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-green-800 mb-3">Why Choose TicketVault?</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    100% authentic tickets
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Secure payment processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Instant ticket delivery
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    24/7 customer support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
