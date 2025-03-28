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

export default function Home() {
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

        {/* Sección Lista de Estacionamientos */}
        <section className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-1 gap-6">
            {/* Lista de estacionamientos */}
            <div className="w-full col-span-1">
              <Card className="h-[300px] md:h-[400px] overflow-hidden">
                <CardHeader>
                  <CardTitle>Lugares disponibles</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto h-full">
                  <ParkingList />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <HowItWorks />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
