"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Search, User, LogOut } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { currentUser, loading, logout } = useAuth()
  const router = useRouter()

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login")
    }
  }, [currentUser, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading || !currentUser) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido a ParkMatch, {currentUser.displayName || currentUser.email?.split("@")[0]}
          </h1>
          <p className="text-gray-600">¿Qué te gustaría hacer hoy?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Buscar Estacionamiento
              </CardTitle>
              <CardDescription>Encuentra lugares disponibles cerca de ti</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Busca estacionamientos disponibles en tu zona
              </p>
              <Link href="/buscar-estacionamiento">
                <Button className="w-full">Buscar Estacionamiento</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Publicar Estacionamiento
              </CardTitle>
              <CardDescription>Ofrece un espacio o publica tu estacionamiento y genera ganancias</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Publica estacionamientos y ayuda a conductores que lo necesitan
              </p>
              <Link href="/publicar-estacionamiento">
                <Button className="w-full">Publicar Estacionamiento</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Mi Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Administra tu información personal y preferencias de cuenta.</p>
              <Link href="/mi-perfil">
                <Button variant="outline" className="w-full">
                  Ver Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Mis Estacionamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gestiona los estacionamientos que has publicado.</p>
              <Link href="/mis-estacionamientos">
                <Button variant="outline" className="w-full">
                  Ver Mis Estacionamientos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <LogOut className="h-5 w-5 text-red-500" />
                Cerrar Sesión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Cierra tu sesión actual en ParkMatch.</p>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
