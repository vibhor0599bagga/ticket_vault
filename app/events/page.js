"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, MapPin, Star, SlidersHorizontal, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { EventStorage } from "@/lib/eventStorage"
import { Navbar } from "@/components/navbar"
import { useSession } from "next-auth/react"

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 500],
    date: "all",
    location: "all",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Load events from localStorage
    const loadedEvents = EventStorage.getEvents()
    setEvents(loadedEvents)
    setFilteredEvents(loadedEvents)
  }, [])

  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((event) => event.category.toLowerCase() === filters.category.toLowerCase())
    }

    // Price filter
    filtered = filtered.filter((event) => event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1])

    setFilteredEvents(filtered)
  }, [events, searchQuery, filters])

  const handleSearch = (e) => {
    e.preventDefault()
  }

  const refreshEvents = () => {
    const loadedEvents = EventStorage.getEvents()
    setEvents(loadedEvents)
    setFilteredEvents(loadedEvents)
  }

  const EventCard = ({ event, isListView = false }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1)

    return (
      <Card
        className={`group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isListView ? "flex" : ""}`}
      >
        <div className={`relative ${isListView ? "w-48 flex-shrink-0" : ""}`}>
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={300}
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isListView ? "w-full h-full" : "w-full h-48"}`}
          />
          {event.trending && <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">🔥 Trending</Badge>}
          {event.isUserListing && (
            <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">🏷️ User Listing</Badge>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium">{event.rating}</span>
          </div>
        </div>
        <CardContent className={`p-6 ${isListView ? "flex-1" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{event.category}</Badge>
            <span className="text-sm text-slate-500">{event.soldCount} sold</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
            {event.title}
          </h3>
          {isListView && <p className="text-slate-600 mb-3 text-sm">{event.description}</p>}
          <div className="flex items-center text-slate-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-slate-600 mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {event.venue}, {event.location}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Quantity:</span>
              <Select
                value={selectedQuantity.toString()}
                onValueChange={(value) => setSelectedQuantity(Number.parseInt(value))}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(8, event.availableTickets) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Available: {event.availableTickets}</div>
            </div>
          </div>

          <div className={`flex items-center ${isListView ? "justify-between" : "justify-between"}`}>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900">${event.price}</span>
              {event.originalPrice > event.price && (
                <span className="text-sm text-slate-500 line-through">${event.originalPrice}</span>
              )}
              {selectedQuantity > 1 && <span className="text-sm text-slate-600">× {selectedQuantity}</span>}
            </div>
            <div className="text-right">
              {selectedQuantity > 1 && (
                <div className="text-sm text-slate-600 mb-1">Total: ${(event.price * selectedQuantity).toFixed(2)}</div>
              )}
              {session ? (
                <Link href={`/checkout?eventId=${event.id}&quantity=${selectedQuantity}&price=${event.price}`}>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Buy Now
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Sign In to Buy
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Events</h1>
          <p className="text-slate-600">Find and buy tickets for amazing events near you</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search events, artists, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-full border-2 border-slate-200 focus:border-purple-500"
            />
          </form>

          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              <Button variant="outline" onClick={refreshEvents} className="flex items-center space-x-2 bg-transparent">
                <span>Refresh</span>
              </Button>

              <Select
                value={filters.category}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="concert">Concerts</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="theater">Theater</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <Select
                    value={filters.date}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="los-angeles">Los Angeles</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                      <SelectItem value="miami">Miami</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Events Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} isListView={viewMode === "list"} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setFilters({
                  category: "all",
                  priceRange: [0, 500],
                  date: "all",
                  location: "all",
                })
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
