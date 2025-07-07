"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Star, TrendingUp, Music, Film, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [categories] = useState([
    { name: "Concerts", icon: Music, color: "bg-purple-500", count: "2.5k+" },
    { name: "Movies", icon: Film, color: "bg-red-500", count: "1.8k+" },
    { name: "Sports", icon: Trophy, color: "bg-green-500", count: "950+" },
    { name: "Theater", icon: Users, color: "bg-blue-500", count: "650+" },
  ])

  useEffect(() => {
    setFeaturedEvents([
      {
        id: 1,
        title: "Taylor Swift - Eras Tour",
        date: "2024-08-15",
        venue: "Madison Square Garden",
        location: "New York, NY",
        price: 150,
        originalPrice: 200,
        image: "/placeholder.svg?height=300&width=400",
        category: "Concert",
        rating: 4.9,
        soldCount: 1250,
        trending: true,
      },
      {
        id: 2,
        title: "Avengers: Secret Wars",
        date: "2024-07-20",
        venue: "AMC Empire 25",
        location: "New York, NY",
        price: 25,
        originalPrice: 30,
        image: "/placeholder.svg?height=300&width=400",
        category: "Movie",
        rating: 4.8,
        soldCount: 890,
        trending: false,
      },
      {
        id: 3,
        title: "Lakers vs Warriors",
        date: "2024-08-10",
        venue: "Crypto.com Arena",
        location: "Los Angeles, CA",
        price: 120,
        originalPrice: 150,
        image: "/placeholder.svg?height=300&width=400",
        category: "Sports",
        rating: 4.7,
        soldCount: 2100,
        trending: true,
      },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              >
                TicketVault
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/events" className="text-slate-600 hover:text-slate-900 transition-colors">
                Browse Events
              </Link>
              <Link href="/sell" className="text-slate-600 hover:text-slate-900 transition-colors">
                Sell Tickets
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
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
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-5xl font-bold text-slate-900 mb-6">
            Your Gateway to
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              <br></br> Unforgettable Events
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Buy and sell event tickets safely with our trusted marketplace. From concerts to sports, movies to theater -
            find your next amazing experience.
          </p>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.name}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-500">{category.count} events</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Events</h2>
              <p className="text-slate-600">Handpicked events you won't want to miss</p>
            </div>
            <Link href="/events">
              <Button variant="outline" className="group bg-transparent">
                View All Events
                <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.trending && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">🔥 Trending</Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{event.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    <span className="text-sm text-slate-500">{event.soldCount} sold</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-slate-900">${event.price}</span>
                      {event.originalPrice > event.price && (
                        <span className="text-sm text-slate-500 line-through">${event.originalPrice}</span>
                      )}
                    </div>
                    <Link href={`/checkout?eventId=${event.id}&quantity=1&price=${event.price}`}>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Buy Tickets
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose TicketVault?</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            We're committed to providing a safe, secure, and seamless ticket marketplace experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">100% Secure</h3>
              <p className="text-slate-600">All transactions are protected with bank-level security</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Verified Tickets</h3>
              <p className="text-slate-600">Every ticket is verified for authenticity</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Best Prices</h3>
              <p className="text-slate-600">Competitive pricing with no hidden fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                TicketVault
              </h3>
              <p className="text-slate-400">
                Your trusted marketplace for buying and selling event tickets safely and securely.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/events" className="hover:text-white transition-colors">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="hover:text-white transition-colors">
                    Sell Tickets
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety Tips</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TicketVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
