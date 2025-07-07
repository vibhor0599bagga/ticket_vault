"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  CreditCard,
  Lock,
  Shield,
  User,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CheckoutPage() {
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Billing Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",

    // Preferences
    savePaymentMethod: false,
    agreeToTerms: false,
    subscribeUpdates: true,
  })

  useEffect(() => {
    // Get order data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const eventId = urlParams.get("eventId") || "1"
    const quantity = Number.parseInt(urlParams.get("quantity") || "2")
    const price = Number.parseFloat(urlParams.get("price") || "150")

    // Mock events database - in real app, this would come from API
    const eventsDatabase = {
      1: {
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
        description: "Experience the magic of Taylor Swift's record-breaking Eras Tour",
      },
      2: {
        title: "Avengers: Secret Wars",
        date: "2024-07-20",
        time: "7:30 PM",
        venue: "AMC Empire 25",
        location: "New York, NY",
        image: "/placeholder.svg?height=200&width=300",
        category: "Movie",
        rating: 4.8,
        section: "Premium Seats",
        row: "F",
        description: "The ultimate Marvel showdown comes to the big screen",
      },
      3: {
        title: "Lakers vs Warriors",
        date: "2024-08-10",
        time: "8:00 PM",
        venue: "Crypto.com Arena",
        location: "Los Angeles, CA",
        image: "/placeholder.svg?height=200&width=300",
        category: "Sports",
        rating: 4.7,
        section: "Lower Bowl",
        row: "15",
        description: "Epic NBA showdown between two legendary teams",
      },
      4: {
        title: "Hamilton Musical",
        date: "2024-09-05",
        time: "8:00 PM",
        venue: "Richard Rodgers Theatre",
        location: "New York, NY",
        image: "/placeholder.svg?height=200&width=300",
        category: "Theater",
        rating: 4.9,
        section: "Orchestra",
        row: "H",
        description: "The revolutionary musical that changed Broadway forever",
      },
      5: {
        title: "Coldplay World Tour",
        date: "2024-08-25",
        time: "7:30 PM",
        venue: "MetLife Stadium",
        location: "East Rutherford, NJ",
        image: "/placeholder.svg?height=200&width=300",
        category: "Concert",
        rating: 4.8,
        section: "General Admission",
        row: "GA",
        description: "An unforgettable night with one of the world's biggest bands",
      },
      6: {
        title: "Top Gun: Maverick",
        date: "2024-07-18",
        time: "9:15 PM",
        venue: "AMC Lincoln Square",
        location: "New York, NY",
        image: "/placeholder.svg?height=200&width=300",
        category: "Movie",
        rating: 4.6,
        section: "IMAX",
        row: "J",
        description: "Tom Cruise returns in this high-octane sequel",
      },
    }

    const selectedEvent = eventsDatabase[eventId] || eventsDatabase[1]

    const mockOrderData = {
      event: {
        id: Number.parseInt(eventId),
        ...selectedEvent,
        seats: quantity === 1 ? "15" : `15-${14 + quantity}`,
      },
      tickets: {
        quantity: quantity,
        pricePerTicket: price,
        originalPrice: price + 50, // Simulate original higher price
      },
      fees: {
        serviceFee: quantity * 6.25,
        processingFee: quantity * 4.38,
        tax: quantity * 6.83,
      },
    }
    setOrderData(mockOrderData)
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Contact validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"

    // Payment validation
    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required"
      if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required"
    }

    // Address validation
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    // Terms validation
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      console.log("Processing payment:", formData)

      // Store order data for confirmation page
      const confirmationData = {
        ...orderData,
        orderNumber: "TKV-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        purchaseDate: new Date().toISOString(),
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        paymentMethod: paymentMethod,
        total: subtotal + totalFees,
      }

      localStorage.setItem("orderConfirmation", JSON.stringify(confirmationData))
      setIsLoading(false)

      // Redirect to confirmation page
      window.location.href = "/confirmation"
    }, 3000)
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData((prev) => ({ ...prev, cardNumber: formatted }))
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setFormData((prev) => ({ ...prev, expiryDate: formatted }))
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const subtotal = orderData.tickets.quantity * orderData.tickets.pricePerTicket
  const totalFees = orderData.fees.serviceFee + orderData.fees.processingFee + orderData.fees.tax
  const total = subtotal + totalFees
  const savings = (orderData.tickets.originalPrice - orderData.tickets.pricePerTicket) * orderData.tickets.quantity

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              TicketVault
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-slate-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
          <p className="text-slate-600">Complete your purchase safely and securely</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "border-red-500" : ""}
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "border-red-500" : ""}
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                        <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                        PayPal (Coming Soon)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                      <RadioGroupItem value="apple" id="apple" disabled />
                      <Label htmlFor="apple" className="flex items-center cursor-pointer">
                        <div className="w-4 h-4 bg-black rounded mr-2"></div>
                        Apple Pay (Coming Soon)
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          className={errors.cardNumber ? "border-red-500" : ""}
                          maxLength={19}
                          required
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleExpiryChange}
                            className={errors.expiryDate ? "border-red-500" : ""}
                            maxLength={5}
                            required
                          />
                          {errors.expiryDate && <p className="text-red-500 text-xs">{errors.expiryDate}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={errors.cvv ? "border-red-500" : ""}
                            maxLength={4}
                            required
                          />
                          {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={errors.cardName ? "border-red-500" : ""}
                          required
                        />
                        {errors.cardName && <p className="text-red-500 text-xs">{errors.cardName}</p>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-red-500" : ""}
                      required
                    />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? "border-red-500" : ""}
                        required
                      />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="OH">Ohio</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="MI">Michigan</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? "border-red-500" : ""}
                        required
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Preferences */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="savePaymentMethod"
                      name="savePaymentMethod"
                      checked={formData.savePaymentMethod}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, savePaymentMethod: checked }))}
                    />
                    <Label htmlFor="savePaymentMethod" className="text-sm leading-5">
                      Save payment method for future purchases
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="subscribeUpdates"
                      name="subscribeUpdates"
                      checked={formData.subscribeUpdates}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, subscribeUpdates: checked }))}
                    />
                    <Label htmlFor="subscribeUpdates" className="text-sm leading-5">
                      Subscribe to event updates and exclusive offers
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked }))}
                      className={errors.agreeToTerms ? "border-red-500" : ""}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Image
                      src={orderData.event.image || "/placeholder.svg"}
                      alt={orderData.event.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{orderData.event.title}</h3>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(orderData.event.date).toLocaleDateString()} at {orderData.event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {orderData.event.venue}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {orderData.event.rating} rating
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Ticket Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Section:</span>
                      <span className="text-sm font-medium">{orderData.event.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Row:</span>
                      <span className="text-sm font-medium">{orderData.event.row}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Seats:</span>
                      <span className="text-sm font-medium">{orderData.event.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Quantity:</span>
                      <span className="text-sm font-medium">{orderData.tickets.quantity} tickets</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">
                        Tickets ({orderData.tickets.quantity} × ${orderData.tickets.pricePerTicket})
                      </span>
                      <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Service Fee</span>
                      <span className="text-sm font-medium">${orderData.fees.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Processing Fee</span>
                      <span className="text-sm font-medium">${orderData.fees.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Tax</span>
                      <span className="text-sm font-medium">${orderData.fees.tax.toFixed(2)}</span>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">You Save</span>
                        <span className="text-sm font-medium">-${savings.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Secure Payment</h4>
                      <p className="text-sm text-green-700">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Alert */}
              {Object.keys(errors).length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    Please fix the errors above to continue with your purchase.
                  </AlertDescription>
                </Alert>
              )}

              {/* Complete Purchase Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Complete Purchase - ${total.toFixed(2)}</span>
                  </div>
                )}
              </Button>

              <div className="text-center text-xs text-slate-500">
                <Lock className="h-3 w-3 inline mr-1" />
                SSL encrypted • Your information is safe
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
