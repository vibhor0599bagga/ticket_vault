"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Ticket, DollarSign, TrendingUp, Calendar, MapPin, Plus, Edit, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EventStorage } from "@/lib/eventStorage"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()

  const [purchasedTickets] = useState([
    {
      id: 1,
      eventTitle: "Taylor Swift - Eras Tour",
      date: "2024-08-15",
      venue: "Madison Square Garden",
      location: "New York, NY",
      price: 150,
      quantity: 2,
      status: "confirmed",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      eventTitle: "Lakers vs Warriors",
      date: "2024-08-10",
      venue: "Crypto.com Arena",
      location: "Los Angeles, CA",
      price: 120,
      quantity: 1,
      status: "confirmed",
      image: "/placeholder.svg?height=200&width=300",
    },
  ])

  const [stats] = useState({
    totalSpent: 540,
    totalEarned: 275,
    activeListings: 1,
    completedTransactions: 3,
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "sold":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const [userListings, setUserListings] = useState([])

  useEffect(() => {
    // Load user's event listings
    const allEvents = EventStorage.getEvents()
    const userEvents = allEvents.filter((event) => event.isUserListing)
    setUserListings(userEvents)
  }, [])

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">
              Welcome back, {session?.user?.name || "User"}! Manage your tickets and track your activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold">${stats.totalSpent}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Earned</p>
                    <p className="text-2xl font-bold">${stats.totalEarned}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Listings</p>
                    <p className="text-2xl font-bold">{stats.activeListings}</p>
                  </div>
                  <Ticket className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Transactions</p>
                    <p className="text-2xl font-bold">{stats.completedTransactions}</p>
                  </div>
                  <User className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="purchased" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="purchased">My Tickets</TabsTrigger>
              <TabsTrigger value="selling">My Listings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Purchased Tickets */}
            <TabsContent value="purchased" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">My Tickets</h2>
                <Link href="/events">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Buy More Tickets
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {purchasedTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <Image
                        src={ticket.image || "/placeholder.svg"}
                        alt={ticket.eventTitle}
                        width={150}
                        height={100}
                        className="w-32 h-24 object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 text-sm">{ticket.eventTitle}</h3>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(ticket.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {ticket.venue}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold">
                              ${ticket.price} × {ticket.quantity}
                            </span>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Selling Tickets */}
            <TabsContent value="selling" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">My Listings</h2>
                <Link href="/sell">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    List New Tickets
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userListings.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={150}
                        height={100}
                        className="w-32 h-24 object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 text-sm">{event.title}</h3>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.venue}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="font-semibold text-green-600">${event.price}</span>
                              {event.originalPrice > event.price && (
                                <span className="text-slate-400 line-through ml-1">${event.originalPrice}</span>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this listing?")) {
                                    EventStorage.deleteEvent(event.id)
                                    setUserListings((prev) => prev.filter((e) => e.id !== event.id))
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}

                {userListings.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <div className="text-4xl mb-4">🎫</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings yet</h3>
                    <p className="text-slate-600 mb-4">Start selling your tickets to see them here</p>
                    <Link href="/sell">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        List Your First Ticket
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="text-xl">
                        {session?.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{session?.user?.name || "User"}</h3>
                      <p className="text-slate-600">{session?.user?.email || "user@example.com"}</p>
                      <p className="text-sm text-slate-500">Member since {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">12</div>
                      <div className="text-sm text-slate-600">Tickets Purchased</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">8</div>
                      <div className="text-sm text-slate-600">Tickets Sold</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">$2,450</div>
                      <div className="text-sm text-slate-600">Total Earnings</div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Edit Profile
                    </Button>
                    <Button variant="outline">Account Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
