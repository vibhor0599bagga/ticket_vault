"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Calendar, MapPin, Download, Mail, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ConfirmationPage() {
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    // Simulate getting confirmation data
    const mockConfirmationData = {
      orderNumber: "TKV-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      purchaseDate: new Date().toISOString(),
      event: {
        id: 1,
        title: "Taylor Swift - Eras Tour",
        date: "2024-08-15",
        time: "8:00 PM",
        venue: "Madison Square Garden",
        location: "New York, NY",
        image: "/placeholder.svg?height=200&width=300",
        category: "Concert",
        rating: 4.9,
        section: "Floor Section A",
        row: "12",
        seats: "15-16",
      },
      tickets: {
        quantity: 2,
        pricePerTicket: 150,
        total: 334.9,
      },
      customer: {
        name: "John Doe",
        email: "john@example.com",
      },
    }
    setOrderData(mockConfirmationData)
  }, [])

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              TicketVault
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">View My Tickets</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-slate-600 mb-2">Your tickets have been confirmed</p>
          <p className="text-slate-500">Order #{orderData.orderNumber}</p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Image
                  src={orderData.event.image || "/placeholder.svg"}
                  alt={orderData.event.title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{orderData.event.title}</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(orderData.event.date).toLocaleDateString()} at {orderData.event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {orderData.event.venue}, {orderData.event.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      {orderData.event.rating} rating
                    </div>
                  </div>
                  <Badge className="mt-2">{orderData.event.category}</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Section:</span>
                  <p className="font-medium">{orderData.event.section}</p>
                </div>
                <div>
                  <span className="text-slate-600">Row:</span>
                  <p className="font-medium">{orderData.event.row}</p>
                </div>
                <div>
                  <span className="text-slate-600">Seats:</span>
                  <p className="font-medium">{orderData.event.seats}</p>
                </div>
                <div>
                  <span className="text-slate-600">Quantity:</span>
                  <p className="font-medium">{orderData.tickets.quantity} tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Number:</span>
                  <span className="font-medium">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Purchase Date:</span>
                  <span className="font-medium">{new Date(orderData.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-medium">{orderData.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium">{orderData.customer.email}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Tickets ({orderData.tickets.quantity} × ${orderData.tickets.pricePerTicket})
                  </span>
                  <span className="font-medium">
                    ${(orderData.tickets.quantity * orderData.tickets.pricePerTicket).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fees & Tax</span>
                  <span className="font-medium">
                    $
                    {(orderData.tickets.total - orderData.tickets.quantity * orderData.tickets.pricePerTicket).toFixed(
                      2,
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span>${orderData.tickets.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download Tickets
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Tickets
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Event
          </Button>
        </div>

        {/* Important Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Your tickets have been sent to {orderData.customer.email}</li>
              <li>• Please arrive at the venue 30 minutes before the event starts</li>
              <li>• Bring a valid ID that matches the name on your order</li>
              <li>• Screenshots of tickets will not be accepted - use the official app or printed tickets</li>
              <li>• Contact customer support if you have any issues accessing your tickets</li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">What's Next?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="outline">View My Tickets</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline">Browse More Events</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
