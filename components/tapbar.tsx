"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { Search, MapPin, Car, User, LogOut, Settings, ChevronUp, X, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot } from "firebase/firestore"

export default function TabBar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Escuchar mensajes no leídos
  useEffect(() => {
    if (!user) return

    const conversacionesQuery = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", user.uid),
    )

    const unsubscribe = onSnapshot(conversacionesQuery, (snapshot) => {
      let totalNoLeidos = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        totalNoLeidos += data[`noLeidos_${user.uid}`] || 0
      })

      setMensajesNoLeidos(totalNoLeidos)
    })

    return () => unsubscribe()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (!mounted || !user) {
    return null
  }

  // Definir las pestañas de navegación
  const tabs = [
    {
      name: "Buscar",
      href: "/buscar-estacionamiento",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Publicar",
      href: "/publicar-estacionamiento",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      name: "Mis Spots",
      href: "/mis-estacionamientos",
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: "Mensajes",
      href: "/mensajes",
      icon: <MessageCircle className="h-5 w-5" />,
      badge: mensajesNoLeidos > 0 ? mensajesNoLeidos : null,
    },
    {
      name: "Perfil",
      href: "#profile",
      icon: <User className="h-5 w-5" />,
      isDropdown: true,
    },
  ]

  // Obtener las iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return user.email ? user.email[0].toUpperCase() : "U"
  }

  return (
    <>
      {/* TabBar para móvil - Flotante en la parte inferior */}
      <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden">
        <div className="mx-auto max-w-md px-4">
          <div className="flex items-center justify-between rounded-full bg-white shadow-lg border p-2">
            {tabs.map((tab) => {
              if (tab.isDropdown) {
                return (
                  <Sheet key={tab.name} open={profileOpen} onOpenChange={setProfileOpen}>
                    <SheetTrigger asChild>
                      <button
                        className={cn(
                          "flex flex-1 flex-col items-center justify-center rounded-full p-2 text-xs",
                          profileOpen ? "text-blue-600" : "text-gray-600 hover:text-blue-600",
                        )}
                      >
                        {profileOpen ? <X className="h-5 w-5" /> : tab.icon}
                        <span className="mt-1">{tab.name}</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-xl h-auto pb-8">
                      <SheetHeader className="text-left pb-4">
                        <SheetTitle>Mi Perfil</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "Usuario"} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.displayName || user.email?.split("@")[0]}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link
                            href="/perfil"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                            onClick={() => setProfileOpen(false)}
                          >
                            <User className="h-5 w-5 text-gray-600" />
                            <span>Mi Perfil</span>
                          </Link>

                          <Link
                            href="/configuracion"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span>Configuración</span>
                          </Link>

                          <button
                            onClick={() => {
                              handleLogout()
                              setProfileOpen(false)
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-red-600 w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                )
              }

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center rounded-full p-2 text-xs relative",
                    pathname === tab.href ? "text-blue-600" : "text-gray-600 hover:text-blue-600",
                  )}
                >
                  {tab.icon}
                  <span className="mt-1">{tab.name}</span>
                  {tab.badge && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                      {tab.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* TabBar para desktop - En la parte superior */}
      <div className="hidden md:block border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/logopark1.png"
                alt="Logo"
                className="h-12 w-12 object-cover"
              />
              <span className="text-xl font-bold">ParkMatch</span>
            </Link>

            {/* Navegación */}
            <div className="flex items-center gap-6">
              {tabs.slice(0, 4).map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
                    pathname === tab.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600",
                  )}
                >
                  {tab.icon}
                  {tab.name}
                  {tab.badge && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-500">{tab.badge}</Badge>
                  )}
                </Link>
              ))}

              {/* Dropdown de perfil para desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "Usuario"} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2 border-b">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "Usuario"} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user.displayName || user.email?.split("@")[0]}</span>
                      <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracion" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
