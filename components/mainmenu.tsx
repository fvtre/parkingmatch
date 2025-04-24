"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, Car, MapPin, Search, Home, Info, Settings, ChevronDown } from "lucide-react"

export default function MainMenu() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (!mounted) {
    return null
  }

  // Definir los enlaces del menú basados en el estado de autenticación
  const menuLinks = user
    ? [
        { href: "/dashboard", label: "Inicio", icon: <Home size={18} /> },
        { href: "/buscar-estacionamiento", label: "Buscar Estacionamiento", icon: <Search size={18} /> },
        { href: "/publicar-estacionamiento", label: "Publicar Estacionamiento", icon: <MapPin size={18} /> },
        { href: "/mis-estacionamientos", label: "Mis Estacionamientos", icon: <Car size={18} /> },
        { href: "/como-funciona", label: "Cómo Funciona", icon: <Info size={18} /> },
      ]
    : [
        { href: "/", label: "Inicio", icon: <Home size={18} /> },
        { href: "/como-funciona", label: "Cómo Funciona", icon: <Info size={18} /> },
      ]

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12h6" />
                <path d="M12 9v6" />
              </svg>
              <span className="text-xl font-bold">ParkMatch</span>
            </Link>
          </div>

          {/* Navegación para escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botones de autenticación para escritorio */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="max-w-[120px] truncate">
                      {user.displayName || user.email?.split("@")[0] || "Usuario"}
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <Home size={16} />
                      <span>Inicio</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex items-center gap-2 cursor-pointer">
                      <User size={16} />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-estacionamientos" className="flex items-center gap-2 cursor-pointer">
                      <MapPin size={16} />
                      <span>Mis Estacionamientos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracion" className="flex items-center gap-2 cursor-pointer">
                      <Settings size={16} />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-600"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Iniciar Sesión</Button>
                </Link>
                <Link href="/signup">
                  <Button>Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {user && (
                    <div className="mb-6 pb-6 border-b">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.displayName || user.email?.split("@")[0]}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <nav className="space-y-4">
                    {menuLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
                          pathname === link.href ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    {user ? (
                      <>
                        <Link
                          href="/perfil"
                          className="flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User size={18} />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          href="/configuracion"
                          className="flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings size={18} />
                          <span>Configuración</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <LogOut size={18} />
                          <span>Cerrar Sesión</span>
                        </button>
                      </>
                    ) : (
                      <div className="pt-4 space-y-3">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Iniciar Sesión
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full">Registrarse</Button>
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}
