"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParkingHero } from "@/components/parking-hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import ParkingMap from "@/components/parking-map"
import ParkingList from "@/components/parking-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { currentUser } = useAuth()
  const router = useRouter()

  // Redirigir al dashboard si está autenticado
  useEffect(() => {
    if (currentUser) {
      router.push("/buscar-estacionamiento")
    }
  }, [currentUser, router])
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
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
            <Link href="#how-it-works" className="text-sm font-medium hover:text-blue-600">
              Cómo funciona
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-blue-600">
              Acerca de
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-blue-600">
              Clientes
            </Link>
            <Link href="/contactanos" className="text-sm font-medium hover:text-blue-600">
              Contactanos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <ParkingHero />
        <HowItWorks />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
