"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Calendar, DollarSign, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function SellTicketsPage() {
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDate: "",
    venue: "",
    location: "",
    category: "",
    ticketType: "",
    originalPrice: "",
    sellingPrice: "",
    quantity: 1,
    description: "",
    transferMethod: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Listing tickets:", formData)
      setIsLoading(false)
      // Redirect to dashboard or success page
    }, 2000)
  }

  return (
    (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Sell Your Tickets</h1>
          <p className="text-slate-600">List your tickets safely and reach thousands of buyers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Event Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eventTitle">Event Title *</Label>
                        <Input
                          id="eventTitle"
                          name="eventTitle"
                          placeholder="e.g., Taylor Swift - Eras Tour"
                          value={formData.eventTitle}
                          onChange={handleInputChange}
                          required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Event Date *</Label>
                        <Input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue *</Label>
                        <Input
                          id="venue"
                          name="venue"
                          placeholder="e.g., Madison Square Garden"
                          value={formData.venue}
                          onChange={handleInputChange}
                          required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g., New York, NY"
                          value={formData.location}
                          onChange={handleInputChange}
                          required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concert">Concert</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="theater">Theater</SelectItem>
                            <SelectItem value="movie">Movie</SelectItem>
                            <SelectItem value="comedy">Comedy</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ticketType">Ticket Type</Label>
                        <Input
                          id="ticketType"
                          name="ticketType"
                          placeholder="e.g., General Admission, VIP"
                          value={formData.ticketType}
                          onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Pricing & Quantity
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price *</Label>
                        <Input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          placeholder="0.00"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sellingPrice">Your Price *</Label>
                        <Input
                          id="sellingPrice"
                          name="sellingPrice"
                          type="number"
                          placeholder="0.00"
                          value={formData.sellingPrice}
                          onChange={handleInputChange}
                          required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Select
                          value={formData.quantity.toString()}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, quantity: Number.parseInt(value) }))
                          }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Add any additional information about your tickets (seat numbers, special notes, etc.)"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4} />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload Ticket Images/PDFs</Label>
                    <div
                      className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 mb-2">Drag and drop your ticket files here, or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload" />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline">
                          Choose Files
                        </Button>
                      </Label>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-slate-600">Uploaded files:</p>
                        <ul className="text-sm text-slate-500">
                          {uploadedFiles.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Transfer Method */}
                  <div className="space-y-2">
                    <Label htmlFor="transferMethod">Transfer Method *</Label>
                    <Select
                      value={formData.transferMethod}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, transferMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="How will you transfer the tickets?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile Transfer</SelectItem>
                        <SelectItem value="email">Email Transfer</SelectItem>
                        <SelectItem value="physical">Physical Tickets</SelectItem>
                        <SelectItem value="pdf">PDF Download</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked }))} />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link
                        href="/seller-terms"
                        className="text-purple-600 hover:text-purple-700 underline">
                        Seller Terms & Conditions
                      </Link>{" "}
                      and confirm that these tickets are authentic and legally owned by me.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.agreeToTerms}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Listing Tickets...</span>
                      </div>
                    ) : (
                      "List My Tickets"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Your Price:</span>
                  <span className="font-semibold">${formData.sellingPrice || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Service Fee (5%):</span>
                  <span>-${((formData.sellingPrice || 0) * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Payment Processing (3%):</span>
                  <span>-${((formData.sellingPrice || 0) * 0.03).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-green-600">
                  <span>You'll Receive:</span>
                  <span>${((formData.sellingPrice || 0) * 0.92).toFixed(2)}</span>
                </div>
                {formData.quantity > 1 && (
                  <div className="text-sm text-slate-600">
                    Total for {formData.quantity} tickets: $
                    {((formData.sellingPrice || 0) * 0.92 * formData.quantity).toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Selling Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Price competitively to sell faster</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Upload clear photos of your tickets</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be honest about seat locations and restrictions</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Respond quickly to buyer inquiries</p>
                </div>
              </CardContent>
            </Card>

            {/* Safety */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-semibold text-green-800">Safe & Secure</span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment is protected until the buyer confirms receipt of tickets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>)
  );
}
