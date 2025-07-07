"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Ticket, DollarSign, TrendingUp, Calendar, MapPin, Plus, Eye, Edit, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2024-01-15",
    totalPurchases: 12,
    totalSales: 8,
    totalEarnings: 2450,
  })

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

  const [listedTickets] = useState([
    {
      id: 1,
      eventTitle: "Coldplay World Tour",
      date: "2024-08-25",
      venue: "MetLife Stadium",
      location: "East Rutherford, NJ",
      originalPrice: 120,
      listingPrice: 95,
      quantity: 2,
      status: "active",
      views: 45,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      eventTitle: "Hamilton Musical",
      date: "2024-09-05",
      venue: "Richard Rodgers Theatre",
      location: "New York, NY",
      originalPrice: 220,
      listingPrice: 180,
      quantity: 1,
      status: "sold",
      views: 78,
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

  return (
    (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      {/* <nav
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TicketVault
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/events"
                className="text-slate-600 hover:text-slate-900 transition-colors">
                Browse Events
              </Link>
              <Link
                href="/sell"
                className="text-slate-600 hover:text-slate-900 transition-colors">
                Sell Tickets
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-slate-700 font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav> */}
      <nav
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TicketVault
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/events"
                className="text-slate-600 hover:text-slate-900 transition-colors">
                Browse Events
              </Link>
              <Link
                href="/sell"
                className="text-slate-600 hover:text-slate-900 transition-colors">
                Sell Tickets
              </Link>
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/signin">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your tickets and track your activity</p>
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
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy More Tickets
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {purchasedTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <Image
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.eventTitle}
                      width={150}
                      height={100}
                      className="w-32 h-24 object-cover" />
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
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  List New Tickets
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listedTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <Image
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.eventTitle}
                      width={150}
                      height={100}
                      className="w-32 h-24 object-cover" />
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
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {ticket.views} views
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="font-semibold text-green-600">${ticket.listingPrice}</span>
                            <span className="text-slate-400 line-through ml-1">${ticket.originalPrice}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
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
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-slate-600">{user.email}</p>
                    <p className="text-sm text-slate-500">
                      Member since {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{user.totalPurchases}</div>
                    <div className="text-sm text-slate-600">Tickets Purchased</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{user.totalSales}</div>
                    <div className="text-sm text-slate-600">Tickets Sold</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">${user.totalEarnings}</div>
                    <div className="text-sm text-slate-600">Total Earnings</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Edit Profile
                  </Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>)
  );
}
