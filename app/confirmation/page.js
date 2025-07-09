"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  Calendar,
  MapPin,
  Download,
  Mail,
  Share2,
  Star,
  Copy,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"

export default function ConfirmationPage() {
  const [orderData, setOrderData] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get confirmation data from localStorage or API
    const storedData = localStorage.getItem("orderConfirmation")

    if (storedData) {
      setOrderData(JSON.parse(storedData))
    } else {
      // Fallback mock data if no stored data
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
          description: "Experience the magic of Taylor Swift's record-breaking Eras Tour",
        },
        tickets: {
          quantity: 2,
          pricePerTicket: 150,
        },
        total: 334.9,
        customer: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
        },
        paymentMethod: "card",
      }
      setOrderData(mockConfirmationData)
    }
  }, [])

  const copyOrderNumber = () => {
    if (orderData?.orderNumber) {
      navigator.clipboard.writeText(orderData.orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadTickets = () => {
    // Simulate ticket download
    console.log("Downloading tickets for order:", orderData?.orderNumber)
    // In real app, this would trigger a PDF download or redirect to ticket app
  }

  const emailTickets = () => {
    // Simulate emailing tickets
    console.log("Emailing tickets to:", orderData?.customer.email)
    // In real app, this would trigger an email send
  }

  const shareEvent = () => {
    if (navigator.share && orderData) {
      navigator.share({
        title: orderData.event.title,
        text: `I'm going to ${orderData.event.title}!`,
        url: window.location.origin + `/events/${orderData.event.id}`,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `${window.location.origin}/events/${orderData?.event.id}`
      navigator.clipboard.writeText(shareUrl)
      alert("Event link copied to clipboard!")
    }
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Payment Successful! 🎉</h1>
          <p className="text-xl text-slate-600 mb-2">Your tickets have been confirmed and are ready</p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-slate-500">Order #</span>
            <code className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">{orderData.orderNumber}</code>
            <Button variant="ghost" size="sm" onClick={copyOrderNumber} className="h-6 w-6 p-0">
              <Copy className="h-3 w-3" />
            </Button>
            {copied && <span className="text-green-600 text-sm">Copied!</span>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={downloadTickets}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Tickets
          </Button>
          <Button variant="outline" onClick={emailTickets} className="h-12 bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Email Tickets
          </Button>
          <Button variant="outline" onClick={shareEvent} className="h-12 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share Event
          </Button>
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
                  <span className="font-medium font-mono text-sm">{orderData.orderNumber}</span>
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
                  <span className="font-medium text-sm">{orderData.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="font-medium capitalize">{orderData.paymentMethod} ending in ****</span>
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
                    ${(orderData.total - orderData.tickets.quantity * orderData.tickets.pricePerTicket).toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-green-600">${orderData.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 Important Information</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                • Your tickets have been sent to <strong>{orderData.customer.email}</strong>
              </li>
              <li>• Please arrive at the venue 30-45 minutes before the event starts</li>
              <li>• Bring a valid ID that matches the name on your order</li>
              <li>• Screenshots of tickets will not be accepted - use the official app or printed tickets</li>
              <li>• Contact customer support if you have any issues accessing your tickets</li>
              <li>• Check the venue's bag policy and prohibited items list before attending</li>
            </ul>
          </CardContent>
        </Card>

        {/* Ticket Access Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Tickets are now available!</strong> You can download them immediately or access them anytime from
            your dashboard.
          </AlertDescription>
        </Alert>

        {/* Next Steps */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">What's Next?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                My Dashboard
              </Button>
            </Link>
            <Link href={`/events/${orderData.event.id}`}>
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                Event Details
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                More Events
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <ArrowRight className="h-4 w-4 mr-2" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-12 p-6 bg-slate-100 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Need Help?</h4>
          <p className="text-slate-600 mb-4">
            Our customer support team is here to help with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              support@ticketvault.com
            </Button>
            <Button variant="outline" size="sm">
              📞 1-800-TICKETS
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
