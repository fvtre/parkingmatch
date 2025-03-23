"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const MAPBOX_TOKEN = "pk.eyJ1IjoiYTJsZCIsImEiOiJjbThjMjRvYmoxc3psMmpwc3M2cjBrY21uIn0.hb7DDqzLhyxPX_l1EyR50Q"

export default function FindSpotPage() {
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState([1])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error)
      }
    )
  }, [])

  useEffect(() => {
    if (location.length > 2) {
      const fetchSuggestions = async () => {
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=cl&types=place,poi,address`
        
        try {
          const res = await fetch(mapboxUrl)
          const data = await res.json()
          
          if (data.features.length > 0) {
            const places = data.features.map((feature: any) => feature.place_name)
            setSuggestions(places)
          } else {
            // Si Mapbox no encuentra resultados, buscar en OpenStreetMap (Nominatim)
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=CL`
            const resOsm = await fetch(nominatimUrl)
            const dataOsm = await resOsm.json()

            if (dataOsm.length > 0) {
              const places = dataOsm.map((place: any) => place.display_name)
              setSuggestions(places)
            } else {
              setSuggestions(["No se encontraron resultados"])
            }
          }
        } catch (error) {
          console.error("Error buscando lugares:", error)
          setSuggestions([])
        }
      }
      fetchSuggestions()
    } else {
      setSuggestions([])
    }
  }, [location])

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

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find a Parking Spot</h1>

          <Card>
            <CardHeader>
              <CardTitle>Search Parameters</CardTitle>
              <CardDescription>Enter your location and preferences to find available parking spots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 relative">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      id="location"
                      placeholder="Ingresa la dirección o un lugar (ej. Cine, Supermercado)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                      required
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              setLocation(suggestion)
                              setSuggestions([])
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="radius">Search Radius: {radius[0]} kilómetros</Label>
                <Slider id="radius" min={0.1} max={5} step={0.1} value={radius} onValueChange={setRadius} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
