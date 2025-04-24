"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Search,
  Clock,
  DollarSign,
  List,
  MapIcon,
  Loader2,
  MessageCircle,
  Navigation,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import dynamic from "next/dynamic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Importar el mapa dinámicamente para evitar problemas de SSR
const MapWithNoSSR = dynamic(() => import("@/components/parking-map"), {
  ssr: false,
})

// Importar el componente de ruta dinámicamente
const RouteMap = dynamic(() => import("@/components/routemap"), {
  ssr: false,
  loading: () => <p>Cargando mapa de ruta...</p>,
})

// Importar el componente de chat dinámicamente
const ChatDialog = dynamic(() => import("@/components/chatdialog"), {
  ssr: false,
  loading: () => <p>Cargando chat...</p>,
})

interface Estacionamiento {
  id: string
  propietarioId: string
  direccion: string
  latitud: number
  longitud: number
  precio: number
  disponible: boolean
  horarioInicio: string
  horarioFin: string
  caracteristicas: string[]
  imagenes: string[]
  distancia?: number // Distancia calculada desde la ubicación del usuario
}

export default function BuscarEstacionamiento() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number; lng: number } | null>(null)
  const [radio, setRadio] = useState<number>(2) // Radio en km
  const [estacionamientos, setEstacionamientos] = useState<Estacionamiento[]>([])
  const [estacionamientosFiltrados, setEstacionamientosFiltrados] = useState<Estacionamiento[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [direccionBusqueda, setDireccionBusqueda] = useState<string>("")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [ordenarPor, setOrdenarPor] = useState<string>("precio")
  const [precioMaximo, setPrecioMaximo] = useState<number>(10000)
  const [caracteristicasFiltro, setCaracteristicasFiltro] = useState<string[]>([])

  // Estados para los diálogos
  const [chatOpen, setChatOpen] = useState(false)
  const [routeDialogOpen, setRouteDialogOpen] = useState(false)
  const [reservaDialogOpen, setReservaDialogOpen] = useState(false)
  const [estacionamientoSeleccionado, setEstacionamientoSeleccionado] = useState<Estacionamiento | null>(null)
  const [reservando, setReservando] = useState(false)

  // Obtener ubicación del usuario al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionUsuario({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
          // Ubicación por defecto (Santiago Centro)
          setUbicacionUsuario({ lat: -33.4489, lng: -70.6693 })
        },
      )
    } else {
      // Ubicación por defecto si no hay geolocalización
      setUbicacionUsuario({ lat: -33.4489, lng: -70.6693 })
    }
  }, [])

  // Función para calcular distancia entre dos puntos (fórmula de Haversine)
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distancia en km
    return d
  }

  // Buscar estacionamientos disponibles
  const buscarEstacionamientos = async () => {
    if (!ubicacionUsuario) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se ha podido obtener tu ubicación",
      })
      return
    }

    setLoading(true)

    try {
      // Consultar todos los estacionamientos disponibles
      const estacionamientosRef = collection(db, "estacionamientos")
      const q = query(estacionamientosRef, where("disponible", "==", true), limit(50))

      const querySnapshot = await getDocs(q)
      const estacionamientosData: Estacionamiento[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Estacionamiento, "id">

        // Calcular distancia
        const distancia = calcularDistancia(ubicacionUsuario.lat, ubicacionUsuario.lng, data.latitud, data.longitud)

        estacionamientosData.push({
          id: doc.id,
          ...data,
          distancia,
        })
      })

      setEstacionamientos(estacionamientosData)
      aplicarFiltros(estacionamientosData)
    } catch (error) {
      console.error("Error al buscar estacionamientos:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al buscar estacionamientos. Inténtalo de nuevo.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros a los estacionamientos
  const aplicarFiltros = (estacionamientosData: Estacionamiento[] = estacionamientos) => {
    let filtrados = [...estacionamientosData]

    // Filtrar por radio
    if (ubicacionUsuario) {
      filtrados = filtrados.filter((e) => {
        const distancia =
          e.distancia || calcularDistancia(ubicacionUsuario.lat, ubicacionUsuario.lng, e.latitud, e.longitud)
        return distancia <= radio
      })
    }

    // Filtrar por precio máximo
    filtrados = filtrados.filter((e) => e.precio <= precioMaximo)

    // Filtrar por características
    if (caracteristicasFiltro.length > 0) {
      filtrados = filtrados.filter((e) => caracteristicasFiltro.every((c) => e.caracteristicas.includes(c)))
    }

    // Ordenar resultados
    switch (ordenarPor) {
      case "precio":
        filtrados.sort((a, b) => a.precio - b.precio)
        break
      case "distancia":
        if (ubicacionUsuario) {
          filtrados.sort((a, b) => {
            const distanciaA =
              a.distancia || calcularDistancia(ubicacionUsuario.lat, ubicacionUsuario.lng, a.latitud, a.longitud)
            const distanciaB =
              b.distancia || calcularDistancia(ubicacionUsuario.lat, ubicacionUsuario.lng, b.latitud, b.longitud)
            return distanciaA - distanciaB
          })
        }
        break
      default:
        break
    }

    setEstacionamientosFiltrados(filtrados)
  }

  // Buscar por dirección usando la API de Geocoding
  const buscarPorDireccion = async () => {
    if (!direccionBusqueda) return

    try {
      setLoading(true)
      // Aquí deberías usar la API de Geocoding de Google
      // Para simplificar, usaremos una API pública gratuita
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionBusqueda)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        setUbicacionUsuario({
          lat: Number.parseFloat(data[0].lat),
          lng: Number.parseFloat(data[0].lon),
        })

        // Buscar estacionamientos después de actualizar la ubicación
        setTimeout(buscarEstacionamientos, 500)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró la dirección. Intenta con otra.",
        })
        setLoading(false)
      }
    } catch (error) {
      console.error("Error al buscar dirección:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al buscar la dirección. Inténtalo de nuevo.",
      })
      setLoading(false)
    }
  }

  // Manejar cambio en características
  const toggleCaracteristica = (caracteristica: string) => {
    setCaracteristicasFiltro((prev) =>
      prev.includes(caracteristica) ? prev.filter((c) => c !== caracteristica) : [...prev, caracteristica],
    )
  }

  // Efecto para buscar estacionamientos cuando cambia la ubicación
  useEffect(() => {
    if (ubicacionUsuario) {
      buscarEstacionamientos()
    }
  }, [ubicacionUsuario])

  // Efecto para aplicar filtros cuando cambian
  useEffect(() => {
    aplicarFiltros()
  }, [radio, ordenarPor, precioMaximo, caracteristicasFiltro])

  // Formatear hora para mostrar
  const formatearHora = (hora: string) => {
    if (!hora) return ""
    const [horas, minutos] = hora.split(":")
    return `${horas}:${minutos}`
  }

  // Función para abrir el diálogo de ruta
  const abrirRuta = (estacionamiento: Estacionamiento) => {
    setEstacionamientoSeleccionado(estacionamiento)
    setRouteDialogOpen(true)
  }

  // Función para abrir el diálogo de chat
  const abrirChat = (estacionamiento: Estacionamiento) => {
    setEstacionamientoSeleccionado(estacionamiento)
    setChatOpen(true)
  }

  // Función para abrir el diálogo de reserva
  const abrirReserva = (estacionamiento: Estacionamiento) => {
    setEstacionamientoSeleccionado(estacionamiento)
    setReservaDialogOpen(true)
  }

  // Función para reservar el estacionamiento
  const reservarEstacionamiento = async () => {
    if (!user || !estacionamientoSeleccionado) return

    try {
      setReservando(true)

      // Crear la reserva en Firestore
      const reservaData = {
        estacionamientoId: estacionamientoSeleccionado.id,
        propietarioId: estacionamientoSeleccionado.propietarioId,
        usuarioId: user.uid,
        direccion: estacionamientoSeleccionado.direccion,
        precio: estacionamientoSeleccionado.precio,
        estado: "pendiente", // pendiente, confirmada, cancelada, completada
        fechaReserva: serverTimestamp(),
        fechaUso: serverTimestamp(), // Esto debería ser personalizable
      }

      await addDoc(collection(db, "reservas"), reservaData)

      // Actualizar disponibilidad del estacionamiento
      const estacionamientoRef = doc(db, "estacionamientos", estacionamientoSeleccionado.id)
      await updateDoc(estacionamientoRef, {
        disponible: false,
      })

      // Actualizar estado local
      setEstacionamientos((prev) =>
        prev.map((e) => (e.id === estacionamientoSeleccionado.id ? { ...e, disponible: false } : e)),
      )
      aplicarFiltros()

      toast({
        title: "Reserva exitosa",
        description: "Has reservado este estacionamiento correctamente",
      })

      setReservaDialogOpen(false)
    } catch (error) {
      console.error("Error al reservar estacionamiento:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo completar la reserva. Inténtalo de nuevo.",
      })
    } finally {
      setReservando(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por dirección o lugar"
                  value={direccionBusqueda}
                  onChange={(e) => setDireccionBusqueda(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={buscarPorDireccion} className="flex items-center gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search size={18} />}
                Buscar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      setUbicacionUsuario({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      })
                    })
                  }
                }}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <MapPin size={18} />
                Mi ubicación
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Radio de búsqueda: {radio} km</span>
                </div>
                <Slider value={[radio]} min={0.5} max={10} step={0.5} onValueChange={(value) => setRadio(value[0])} />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Precio máximo: ${precioMaximo}</span>
                <Slider
                  value={[precioMaximo]}
                  min={1000}
                  max={10000}
                  step={500}
                  onValueChange={(value) => setPrecioMaximo(value[0])}
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Ordenar por:</span>
                <Select value={ordenarPor} onValueChange={setOrdenarPor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="precio">Precio: menor a mayor</SelectItem>
                    <SelectItem value="distancia">Distancia: más cercanos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Características:</span>
              <div className="flex flex-wrap gap-2">
                {["techado", "vigilancia", "iluminacion"].map((caracteristica) => (
                  <Badge
                    key={caracteristica}
                    variant={caracteristicasFiltro.includes(caracteristica) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCaracteristica(caracteristica)}
                  >
                    {caracteristica}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contador de resultados y selector de vista */}
      <div className="w-full">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "map")}>
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <List size={16} />
              Lista
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1">
              <MapIcon size={16} />
              Mapa
            </TabsTrigger>
          </TabsList>

          {/* Vista de mapa */}
          <TabsContent value="map" className="mt-0">
            {ubicacionUsuario && (
              <div className="h-[600px] w-full rounded-lg overflow-hidden border">
                <MapWithNoSSR
                  center={ubicacionUsuario}
                  zoom={14}
                  estacionamientos={estacionamientosFiltrados.map((e) => ({
                    id: e.id,
                    position: { lat: e.latitud, lng: e.longitud },
                    title: e.direccion,
                    price: e.precio,
                  }))}
                  radio={radio * 1000}
                  onMarkerClick={(id) => {
                    const estacionamiento = estacionamientosFiltrados.find((e) => e.id === id)
                    if (estacionamiento) {
                      setEstacionamientoSeleccionado(estacionamiento)
                      setRouteDialogOpen(true)
                    }
                  }}
                />

              </div>
            )}
          </TabsContent>

          {/* Vista de lista */}
          <TabsContent value="list" className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                  <p>Buscando estacionamientos disponibles...</p>
                </div>
              </div>
            ) : estacionamientosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {estacionamientosFiltrados.map((estacionamiento) => {
                  // Verificar si el usuario es el propietario
                  const esPropietario = user && user.uid === estacionamiento.propietarioId

                  return (
                    <Card key={estacionamiento.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 overflow-hidden relative">
                        {estacionamiento.imagenes && estacionamiento.imagenes.length > 0 ? (
                          <img
                            src={estacionamiento.imagenes[0] || "/placeholder.svg?height=192&width=384"}
                            alt={estacionamiento.direccion}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <MapPin className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className={estacionamiento.disponible ? "bg-green-500" : "bg-red-500"}>
                            {estacionamiento.disponible ? "Disponible" : "No disponible"}
                          </Badge>
                        </div>
                        {estacionamiento.distancia && (
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="bg-white/80 text-gray-800">
                              {estacionamiento.distancia.toFixed(1)} km
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1">{estacionamiento.direccion}</h3>
                        <div className="flex items-center text-green-600 font-bold text-xl mb-2">
                          <DollarSign className="h-5 w-5" />
                          <span>${estacionamiento.precio.toLocaleString()}/hora</span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              {formatearHora(estacionamiento.horarioInicio)} -{" "}
                              {formatearHora(estacionamiento.horarioFin)}
                            </span>
                          </div>
                          {estacionamiento.caracteristicas && estacionamiento.caracteristicas.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {estacionamiento.caracteristicas.map((caracteristica) => (
                                <Badge key={caracteristica} variant="outline" className="text-xs">
                                  {caracteristica}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Nuevos botones de acción */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Botón de reserva - solo visible si está disponible y el usuario no es el propietario */}
                          {estacionamiento.disponible && !esPropietario && user && (
                            <Button
                              onClick={() => abrirReserva(estacionamiento)}
                              className="flex items-center justify-center gap-1"
                              size="sm"
                            >
                              <Calendar className="h-4 w-4" />
                              Reservar
                            </Button>
                          )}

                          {/* Botón para mostrar ruta */}
                          <Button
                            variant={estacionamiento.disponible && !esPropietario && user ? "outline" : "default"}
                            onClick={() => abrirRuta(estacionamiento)}
                            className="flex items-center justify-center gap-1"
                            size="sm"
                          >
                            <Navigation className="h-4 w-4" />
                            Cómo llegar
                          </Button>

                          {/* Botón para chatear - no visible si el usuario es el propietario o no está autenticado */}
                          {!esPropietario && user && (
                            <Button
                              variant="outline"
                              onClick={() => abrirChat(estacionamiento)}
                              className={`flex items-center justify-center gap-1 ${estacionamiento.disponible && !esPropietario ? "col-span-1" : "col-span-2"}`}
                              size="sm"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Chatear
                            </Button>
                          )}

                          {/* Si el usuario no está autenticado, mostrar botón para iniciar sesión */}
                          {!user && (
                            <Button onClick={() => router.push("/login")} className="col-span-2" size="sm">
                              Iniciar sesión para reservar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No se encontraron estacionamientos</h3>
                <p className="text-gray-600 mb-6">Intenta ampliar el radio de búsqueda o buscar en otra ubicación.</p>
                <Button onClick={() => setRadio(Math.min(radio + 2, 10))} className="mx-auto">
                  Ampliar radio de búsqueda
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de chat */}
      {estacionamientoSeleccionado && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          estacionamientoId={estacionamientoSeleccionado.id}
          propietarioId={estacionamientoSeleccionado.propietarioId}
          estacionamientoDireccion={estacionamientoSeleccionado.direccion}
        />
      )}

      {/* Diálogo de ruta */}
      {estacionamientoSeleccionado && (
        <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cómo llegar</DialogTitle>
              <DialogDescription>Ruta hacia {estacionamientoSeleccionado.direccion}</DialogDescription>
            </DialogHeader>

            <div className="h-[500px] w-full rounded-lg overflow-hidden border mt-4">
              {ubicacionUsuario ? (
                <RouteMap
                  origin={ubicacionUsuario}
                  destination={{ lat: estacionamientoSeleccionado.latitud, lng: estacionamientoSeleccionado.longitud }}
                  zoom={13}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p>Permitir acceso a tu ubicación para mostrar la ruta</p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={() => setRouteDialogOpen(false)}>Cerrar</Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Abrir en Google Maps
                  if (estacionamientoSeleccionado) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${estacionamientoSeleccionado.latitud},${estacionamientoSeleccionado.longitud}`
                    window.open(url, "_blank")
                  }
                }}
              >
                Abrir en Google Maps
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de reserva */}
      {estacionamientoSeleccionado && (
        <Dialog open={reservaDialogOpen} onOpenChange={setReservaDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reservar estacionamiento</DialogTitle>
              <DialogDescription>
                Estás a punto de reservar este estacionamiento. Una vez confirmada la reserva, el espacio quedará
                bloqueado para ti.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dirección:</span>
                  <span>{estacionamientoSeleccionado.direccion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Precio por hora:</span>
                  <span className="text-green-600 font-bold">${estacionamientoSeleccionado.precio}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Horario disponible:</span>
                  <span>
                    {estacionamientoSeleccionado.horarioInicio} - {estacionamientoSeleccionado.horarioFin}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReservaDialogOpen(false)} disabled={reservando}>
                Cancelar
              </Button>
              <Button onClick={reservarEstacionamiento} disabled={reservando}>
                {reservando ? "Procesando..." : "Confirmar reserva"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
