"use client"
import Footer from "@/components/footer"
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

  // Real user data states
  const [userListings, setUserListings] = useState([])
  const [purchasedTickets, setPurchasedTickets] = useState([])
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalEarned: 0,
    activeListings: 0,
    completedTransactions: 0,
    totalTicketsPurchased: 0,
    totalTicketsSold: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true)
      try {
        let listings = []
        let purchases = []
        if (session?.user?.email) {
          // Fetch user listings from API
          const res = await fetch(`/api/events/by-seller/${encodeURIComponent(session.user.email)}`)
          const data = await res.json()
          listings = data.events || []
          setUserListings(listings)

          // Load purchased tickets from localStorage
          const storedPurchases = localStorage.getItem(`purchases_${session.user.email}`)
          purchases = storedPurchases ? JSON.parse(storedPurchases) : []
          setPurchasedTickets(purchases)

          // Calculate stats
          const totalSpent = purchases.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0)
          const totalEarned = listings.reduce((sum, event) => sum + event.price * (event.soldTickets || 0), 0)
          const activeListings = listings.filter((event) => event.availableTickets > 0).length
          const completedTransactions = purchases.length + listings.filter((event) => (event.soldTickets || 0) > 0).length
          const totalTicketsPurchased = purchases.reduce((sum, ticket) => sum + ticket.quantity, 0)
          const totalTicketsSold = listings.reduce((sum, event) => sum + (event.soldTickets || 0), 0)

          setStats({
            totalSpent,
            totalEarned,
            activeListings,
            completedTransactions,
            totalTicketsPurchased,
            totalTicketsSold,
          })
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboardData()
  }, [session])

  const fetchUserListings = async () => {
    try {
      const res = await fetch(`/api/events/by-seller/${encodeURIComponent(session.user.email)}`)
      const data = await res.json()
      setUserListings(data.events || [])
    } catch (error) {
      console.error("Error fetching user listings from API:", error)
    }
  }

  const loadUserData = () => {
    try {
      // Load purchased tickets from localStorage
      const storedPurchases = localStorage.getItem(`purchases_${session.user.email}`)
      const purchases = storedPurchases ? JSON.parse(storedPurchases) : []
      setPurchasedTickets(purchases)

      // Calculate real stats
      const totalSpent = purchases.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0)
      const totalEarned = userListings.reduce((sum, event) => sum + event.price * (event.soldTickets || 0), 0)
      const activeListings = userListings.filter((event) => event.availableTickets > 0).length
      const completedTransactions = purchases.length + userListings.filter((event) => (event.soldTickets || 0) > 0).length
      const totalTicketsPurchased = purchases.reduce((sum, ticket) => sum + ticket.quantity, 0)
      const totalTicketsSold = userListings.reduce((sum, event) => sum + (event.soldTickets || 0), 0)

      setStats({
        totalSpent,
        totalEarned,
        activeListings,
        completedTransactions,
        totalTicketsPurchased,
        totalTicketsSold,
      })
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventStatus = (event) => {
    const eventDate = new Date(event.date)
    const now = new Date()

    if (eventDate < now) {
      return "expired"
    } else if (event.availableTickets > 0) {
      return "active"
    } else {
      return "sold"
    }
  }

  const handleDeleteListing = async (eventId) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        // Send DELETE request to API
        const res = await fetch(`/api/events?id=${eventId}`, {
          method: "DELETE",
        })
        const data = await res.json()
        if (data.success) {
          // Remove from local state
          setUserListings((prev) => prev.filter((e) => e.id !== eventId && e._id !== eventId))
          // Recalculate stats
          loadUserData()
        } else {
          alert(data.error || "Error deleting listing. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting listing:", error)
        alert("Error deleting listing. Please try again.")
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getMemberSince = () => {
    // Try to get actual join date from localStorage or use current date
    const joinDate = localStorage.getItem(`joinDate_${session?.user?.email}`) || new Date().toISOString()
    return new Date(joinDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  // Set join date if not exists
  useEffect(() => {
    if (session?.user?.email) {
      const joinDateKey = `joinDate_${session.user.email}`
      if (!localStorage.getItem(joinDateKey)) {
        localStorage.setItem(joinDateKey, new Date().toISOString())
      }
    }
  }, [session])

  if (isLoading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

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
                    <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
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
                    <p className="text-2xl font-bold">${stats.totalEarned.toFixed(2)}</p>
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
              <TabsTrigger value="purchased">My Tickets ({stats.totalTicketsPurchased})</TabsTrigger>
              <TabsTrigger value="selling">My Listings ({userListings.length})</TabsTrigger>
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

              {purchasedTickets.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🎫</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No tickets purchased yet</h3>
                    <p className="text-slate-600 mb-6">Start exploring events and buy your first tickets!</p>
                    <Link href="/events">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Browse Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {purchasedTickets.map((ticket) => {
                    const eventDate = new Date(ticket.date)
                    const isUpcoming = eventDate > new Date()

                    return (
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
                              <Badge className={getStatusColor(isUpcoming ? "confirmed" : "expired")}>
                                {isUpcoming ? "Confirmed" : "Past Event"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(ticket.date)} at {ticket.time || "8:00 PM"}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {ticket.venue}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold">
                                  ${ticket.price} × {ticket.quantity} = ${(ticket.price * ticket.quantity).toFixed(2)}
                                </span>
                                <Button size="sm" variant="outline" disabled={!isUpcoming}>
                                  <Download className="h-3 w-3 mr-1" />
                                  {isUpcoming ? "Download" : "Expired"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
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

              {userListings.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No listings yet</h3>
                    <p className="text-slate-600 mb-6">Start selling your tickets to earn money!</p>
                    <Link href="/sell">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        List Your First Ticket
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userListings.map((event) => {
                    const status = getEventStatus(event)
                    const eventDate = new Date(event.date)
                    const isExpired = eventDate < new Date()

                    return (
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
                              <Badge className={getStatusColor(status)}>
                                {status === "active" ? "Active" : status === "sold" ? "Sold Out" : "Expired"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(event.date)} at {event.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.venue}
                              </div>
                              <div className="flex items-center">
                                <Ticket className="h-3 w-3 mr-1" />
                                {event.availableTickets} tickets available
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div>
                                  <span className="font-semibold text-green-600">${event.price}</span>
                                  {event.originalPrice > event.price && (
                                    <span className="text-slate-400 line-through ml-1">${event.originalPrice}</span>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  {/* {!isExpired && (
                                    <Button size="sm" variant="outline" disabled>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  )} */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 bg-transparent"
                                    onClick={() => handleDeleteListing(event._id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
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
                      <p className="text-sm text-slate-500">Member since {getMemberSince()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">{stats.totalTicketsPurchased}</div>
                      <div className="text-sm text-slate-600">Tickets Purchased</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">{stats.totalTicketsSold}</div>
                      <div className="text-sm text-slate-600">Tickets Sold</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">${stats.totalEarned.toFixed(0)}</div>
                      <div className="text-sm text-slate-600">Total Earnings</div>
                    </div>
                  </div>

                  {/* Account Activity Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Account Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Active Listings:</span>
                        <span className="font-medium ml-2">{stats.activeListings}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Total Transactions:</span>
                        <span className="font-medium ml-2">{stats.completedTransactions}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Money Spent:</span>
                        <span className="font-medium ml-2">${stats.totalSpent.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Money Earned:</span>
                        <span className="font-medium ml-2">${stats.totalEarned.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex space-x-4">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled
                    >
                      Edit Profile (Coming Soon)
                    </Button>
                    <Button variant="outline" disabled>
                      Account Settings (Coming Soon)
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  )
}
