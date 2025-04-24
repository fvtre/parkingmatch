"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// Rutas que no requieren autenticación
const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/como-funciona"]

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Función para verificar si la ruta está autorizada
    const checkAuth = () => {
      // Si la ruta es pública, permitir acceso
      if (publicRoutes.includes(pathname)) {
        setAuthorized(true)
        return
      }

      // Si el usuario no está autenticado y la página está cargando, esperar
      if (loading) {
        setAuthorized(false)
        return
      }

      // Si el usuario no está autenticado, redirigir al login
      if (!currentUser) {
        setAuthorized(false)
        router.push("/login")
        return
      }

      // Si el usuario está autenticado y la ruta no es pública, permitir acceso
      setAuthorized(true)
    }

    // Verificar autorización
    checkAuth()
  }, [currentUser, loading, pathname, router])

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (!authorized && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si está autorizado, mostrar los hijos
  return <>{children}</>
}
