"use client"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Calendar, MapPin, Star, SlidersHorizontal, Grid, List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Navbar } from "@/components/navbar"
import { useSession } from "next-auth/react"

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 5000],
    date: "all",
    location: "all",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events")
        const data = await res.json()
        setEvents(data.events || [])
        setFilteredEvents(data.events || [])
      } catch (err) {
        setError("Failed to load events")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter (only if not 'all')
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((event) =>
        event.category && event.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Date filter (only if not 'all')
    if (filters.date && filters.date !== "all") {
      // Implement your date filter logic here if needed
      // Example: filter by today's date or this week
      // For now, skip actual filtering since backend may not support it
    }

    // Location filter (only if not 'all')
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((event) =>
        event.location && event.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Price filter (always applied)
    filtered = filtered.filter(
      (event) => event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1]
    );

    setFilteredEvents(filtered);
  }, [events, searchQuery, filters])

  const refreshEvents = () => {
    setLoading(true)
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || [])
        setFilteredEvents(data.events || [])
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to refresh events")
        setLoading(false)
      })
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  }

  const EventCard = ({ event, isListView = false }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1)

    return (
      <Card
        className={`group transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${isListView ? "flex" : ""}`}
        style={{ cursor: "default" }}
      >
        <div className={`relative ${isListView ? "w-48 flex-shrink-0" : ""}`}>
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={300}
            className={`object-cover ${isListView ? "w-full h-full" : "w-full h-48"} group-hover:scale-105 transition-transform duration-300`}
          />
          {event.trending && <Badge className="absolute top-3 left-3 bg-red-500">🔥 Trending</Badge>}
          {event.isUserListing && <Badge className="absolute top-3 right-3 bg-green-500">🏷️ User Listing</Badge>}
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
            <span className="text-sm">{event.venue}, {event.location}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Quantity:</span>
              <Select value={selectedQuantity.toString()} onValueChange={(value) => setSelectedQuantity(parseInt(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(8, event.availableTickets) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right text-xs text-slate-500">Available: {event.availableTickets}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900">₹{event.price}</span>
              {event.originalPrice > event.price && (
                <span className="text-sm text-slate-500 line-through">₹{event.originalPrice}</span>
              )}
              {selectedQuantity > 1 && <span className="text-sm text-slate-600">× {selectedQuantity}</span>}
            </div>
            <div className="text-right">
              {selectedQuantity > 1 && (
                <div className="text-sm text-slate-600 mb-1">Total: ₹{(event.price * selectedQuantity).toFixed(2)}</div>
              )}
              {session ? (
                <Link href={`/checkout?eventId=${event._id}&quantity=${selectedQuantity}&price=${event.price}`}>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    style={{ cursor: "pointer" }}
                  >
                    Buy Now
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600" style={{ cursor: "pointer" }}>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Events</h1>
        <p className="text-slate-600 mb-6">Find and buy tickets for amazing events near you</p>

        {/* Search + Filters */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search events, artists, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg rounded-full border-2 border-slate-200 focus:border-purple-500"
          />
        </form>

        {/* Top Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <Button variant="outline" onClick={refreshEvents}>Refresh</Button>

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
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
                  max={5000}
                  step={10}
                />
              </div>

              {/* Dummy date/location filters */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <Select value={filters.date} onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <Select value={filters.location} onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {/* Status */}
        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => {
              setSearchQuery("")
              setFilters({
                category: "all",
                priceRange: [0, 5000],
                date: "all",
                location: "all",
              })
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredEvents.map((event, idx) => (
              <EventCard key={event._id || idx} event={event} isListView={viewMode === "list"} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
