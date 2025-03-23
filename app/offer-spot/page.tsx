"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function OfferSpotPage() {
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [leavingTime, setLeavingTime] = useState("")
  const [vehicleType, setVehicleType] = useState("sedan")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  const handleUseCurrentLocation = () => {
    setLocation("Current Location")
    // In a real app, we would use the browser's geolocation API
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logopark1.png"
              alt="Logo"
              className="h-20 w-20 object-cover"
            />
              <span className="text-xl font-bold">ParkMatch</span>
            </Link>
          </div>
        </header>

        <main className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Spot Listed Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Your parking spot has been listed. We'll notify you when someone wants to take your spot.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
          <img
              src="/images/logopark1.png"
              alt="Logo"
              className="h-20 w-20 object-cover"
            />
            <span className="text-xl font-bold">ParkMatch</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/profile" className="text-sm font-medium hover:text-blue-600">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Offer Your Parking Spot</h1>

          <Card>
            <CardHeader>
              <CardTitle>Spot Details</CardTitle>
              <CardDescription>Provide information about your parking spot to help others find it</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Current Location</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input
                        id="location"
                        placeholder="Enter your current location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
                      Use GPS
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leavingTime">When are you leaving?</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      id="leavingTime"
                      type="time"
                      value={leavingTime}
                      onChange={(e) => setLeavingTime(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="compact" />
                        <Label htmlFor="compact">Compact</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sedan" id="sedan" />
                        <Label htmlFor="sedan">Sedan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suv" id="suv" />
                        <Label htmlFor="suv">SUV</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="truck" id="truck" />
                        <Label htmlFor="truck">Truck</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Provide any helpful details about your parking spot (e.g., level, section, nearby landmarks)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "List My Spot"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

