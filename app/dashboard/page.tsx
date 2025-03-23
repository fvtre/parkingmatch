"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Car, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardPage() {
  const router = useRouter()
  const { logout } = useAuth() // Importa la función logout del contexto
  const [activeSpots, setActiveSpots] = useState([
    {
      id: 1,
      type: "offering",
      location: "123 Main St, Downtown",
      time: "Leaving at 5:30 PM",
      status: "Waiting for match",
    },
  ])

  const [pastSpots, setPastSpots] = useState([
    {
      id: 101,
      type: "found",
      location: "456 Market St, Downtown",
      time: "March 12, 2025",
      matchedWith: "Jamie L.",
    },
    {
      id: 102,
      type: "offering",
      location: "789 Park Ave, Downtown",
      time: "March 10, 2025",
      matchedWith: "Alex S.",
    },
  ])

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const cancelSpot = (id: number) => {
    setActiveSpots(activeSpots.filter((spot) => spot.id !== id))
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
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm font-medium hover:text-blue-600 flex items-center gap-1">
              <User className="h-4 w-4" /> Profile
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:text-blue-600 flex items-center gap-1">
              <Settings className="h-4 w-4" /> Settings
            </Link>
            {/* Botón de logout */}
            <button 
              onClick={handleLogout} 
              className="text-sm font-medium hover:text-red-600 flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Resto del contenido del dashboard... */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex gap-4">
              <Link href="/find-spot">
                <Button variant="outline">Find a Spot</Button>
              </Link>
              <Link href="/offer-spot">
                <Button>Offer Your Spot</Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Spots</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* El resto del código existente... */}
          </Tabs>
        </div>
      </main>
    </div>
  )
}