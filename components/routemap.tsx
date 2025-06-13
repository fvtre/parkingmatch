"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Navigation2, Volume2, VolumeX } from "lucide-react"

interface RouteMapProps {
  origin: { lat: number; lng: number }
  destination: { lat: number; lng: number }
  zoom: number
}

interface Paso {
  index: number
  instruccion: string
  distancia: string
  duracion: string
  maniobra: string
  inicio: google.maps.LatLng
  fin: google.maps.LatLng
}

const RouteMap = ({ origin, destination, zoom }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const watchPositionIdRef = useRef<number | null>(null)
  const userMarkerRef = useRef<google.maps.Marker | null>(null)
  const [instrucciones, setInstrucciones] = useState<Paso[]>([])
  const [distanciaTotal, setDistanciaTotal] = useState("")
  const [tiempoTotal, setTiempoTotal] = useState("")
  const [pasoActual, setPasoActual] = useState(0)
  const [panelExpandido, setPanelExpandido] = useState(true)
  const [audioActivado, setAudioActivado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const [navegacionActiva, setNavegacionActiva] = useState(false)
  const [precision, setPrecision] = useState<number | null>(null)

  useEffect(() => {
    // Inicializar síntesis de voz
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = window.speechSynthesis
    }

    // Función para inicializar el mapa
    const initMap = async () => {
      // Verificar que estamos en el cliente
      if (typeof window === "undefined") return

      // Verificar si la API de Google Maps ya está cargada
      if (!window.google) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => {
          // Declare google variable after the script is loaded
          if (typeof google === "undefined") {
            // @ts-ignore
            window.google = google
          }
          loadMap()
        }
        document.head.appendChild(script)
      } else {
        loadMap()
      }
    }

    // Función para cargar el mapa una vez que la API está disponible
    const loadMap = () => {
      if (!mapRef.current || !window.google) return

      setCargando(true)

      // Crear el mapa
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: origin,
        zoom,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy", // Permite zoom con un solo dedo en móviles
      })

      googleMapRef.current = googleMap

      // Crear el DirectionsService y DirectionsRenderer
      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: googleMap,
        suppressMarkers: true, // Suprimimos los marcadores predeterminados
        polylineOptions: {
          strokeColor: "#4285F4", // Color azul de Google Maps
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      })

      directionsRendererRef.current = directionsRenderer

      // Marcador personalizado para el destino
      new window.google.maps.Marker({
        position: destination,
        map: googleMap,
        title: "Destino",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
        zIndex: 1,
      })

      // Marcador para la posición actual del usuario con flecha de dirección
      userMarkerRef.current = new window.google.maps.Marker({
        position: origin,
        map: googleMap,
        title: "Tu ubicación",
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
          scale: 8,
          rotation: 0, // Se actualizará con el rumbo
        },
        zIndex: 999, // Para que aparezca por encima de otros marcadores
      })

      // Función para calcular distancia entre dos puntos (Haversine)
      const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371 // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * (Math.PI / 180)
        const dLon = (lon2 - lon1) * (Math.PI / 180)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c // Distancia en km
      }

      // Función para determinar el paso actual basado en la posición
      const determinarPasoActual = (posicionActual: { lat: number; lng: number }, pasos: Paso[]) => {
        if (!pasos || pasos.length === 0) return

        // Encontrar el paso más cercano a la posición actual
        let distanciaMinima = Number.POSITIVE_INFINITY
        let pasoMasCercano = 0

        pasos.forEach((paso, index) => {
          const distanciaAPaso = calcularDistancia(
            posicionActual.lat,
            posicionActual.lng,
            paso.inicio.lat(),
            paso.inicio.lng(),
          )

          if (distanciaAPaso < distanciaMinima) {
            distanciaMinima = distanciaAPaso
            pasoMasCercano = index
          }
        })

        // Si cambiamos de paso y el audio está activado, leer la instrucción
        if (pasoMasCercano !== pasoActual && audioActivado && speechSynthesisRef.current) {
          const textoLimpio = pasos[pasoMasCercano].instruccion.replace(/<[^>]*>/g, "")
          const utterance = new SpeechSynthesisUtterance(textoLimpio)
          utterance.lang = "es-ES"
          speechSynthesisRef.current.speak(utterance)
        }

        setPasoActual(pasoMasCercano)
      }

      // Función para actualizar la ruta
      const actualizarRuta = (posicionActual: { lat: number; lng: number }, rumbo = 0) => {
        directionsService.route(
          {
            origin: posicionActual,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false,
            avoidTolls: false,
            avoidHighways: false,
            optimizeWaypoints: true,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result)

              // Actualizar la flecha de dirección con el rumbo
              if (userMarkerRef.current) {
                const icon = userMarkerRef.current.getIcon() as google.maps.Symbol
                icon.rotation = rumbo
                userMarkerRef.current.setIcon(icon)
              }

              // Extraer instrucciones paso a paso
              if (result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
                const ruta = result.routes[0].legs[0]

                // Guardar distancia y tiempo total
                setDistanciaTotal(ruta.distance?.text || "")
                setTiempoTotal(ruta.duration?.text || "")

                // Guardar pasos de la ruta
                if (ruta.steps) {
                  const pasos = ruta.steps.map((paso, index) => ({
                    index,
                    instruccion: paso.instructions,
                    distancia: paso.distance?.text || "",
                    duracion: paso.duration?.text || "",
                    maniobra: paso.maneuver || "",
                    inicio: paso.start_location,
                    fin: paso.end_location,
                  }))
                  setInstrucciones(pasos)

                  // Determinar el paso actual basado en la posición
                  determinarPasoActual(posicionActual, pasos)
                }
              }

              setCargando(false)
            } else {
              console.error("Error al calcular la ruta:", status)
              setCargando(false)
            }
          },
        )
      }

      // Iniciar seguimiento de ubicación
      if (navigator.geolocation) {
        // Calcular ruta inicial
        actualizarRuta(origin)

        // Configurar seguimiento en tiempo real solo si la navegación está activa
        if (navegacionActiva) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const posicionActual = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }

              // Mostrar información de precisión en consola para depuración
              console.log("Precisión de ubicación:", position.coords.accuracy, "metros")

              // Guardar la precisión
              setPrecision(position.coords.accuracy)

              // Calcular rumbo si hay datos de rumbo disponibles
              let rumbo = 0
              if (position.coords.heading !== null && !isNaN(position.coords.heading)) {
                rumbo = position.coords.heading
              }

              // Actualizar posición del marcador del usuario
              if (userMarkerRef.current) {
                userMarkerRef.current.setPosition(posicionActual)
              }

              // Centrar el mapa en la posición actual
              if (googleMapRef.current) {
                googleMapRef.current.panTo(posicionActual)
              }

              // Actualizar la ruta
              actualizarRuta(posicionActual, rumbo)
            },
            (error) => {
              console.error("Error al seguir la ubicación:", error)
              setCargando(false)
            },
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 10000,
            },
          )

          // Guardar el ID del seguimiento para limpiarlo después
          watchPositionIdRef.current = watchId
        } else {
          // Si la navegación no está activa, detener el seguimiento
          if (watchPositionIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchPositionIdRef.current)
            watchPositionIdRef.current = null
          }
        }
      } else {
        // Si no hay geolocalización, calcular la ruta con el origen inicial
        actualizarRuta(origin)
        setCargando(false)
      }
    }

    initMap()

    // Limpieza al desmontar
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
      }

      // Detener el seguimiento de ubicación
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current)
      }

      // Detener síntesis de voz
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [origin, destination, zoom, navegacionActiva, pasoActual, audioActivado])

  // Efecto para controlar el seguimiento cuando cambia el estado de navegación
  useEffect(() => {
    // Función para actualizar la ruta
    const actualizarRuta = (posicionActual: { lat: number; lng: number }, rumbo = 0) => {
      if (!directionsRendererRef.current || !window.google) return
      const directionsService = new window.google.maps.DirectionsService()
      directionsService.route(
        {
          origin: posicionActual,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false,
          avoidTolls: false,
          avoidHighways: false,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result)

            // Actualizar la flecha de dirección con el rumbo
            if (userMarkerRef.current) {
              const icon = userMarkerRef.current.getIcon() as google.maps.Symbol
              icon.rotation = rumbo
              userMarkerRef.current.setIcon(icon)
            }

            // Extraer instrucciones paso a paso
            if (result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
              const ruta = result.routes[0].legs[0]

              // Guardar distancia y tiempo total
              setDistanciaTotal(ruta.distance?.text || "")
              setTiempoTotal(ruta.duration?.text || "")

              // Guardar pasos de la ruta
              if (ruta.steps) {
                const pasos = ruta.steps.map((paso, index) => ({
                  index,
                  instruccion: paso.instructions,
                  distancia: paso.distance?.text || "",
                  duracion: paso.duration?.text || "",
                  maniobra: paso.maneuver || "",
                  inicio: paso.start_location,
                  fin: paso.end_location,
                }))
                setInstrucciones(pasos)

                // Función para calcular distancia entre dos puntos (Haversine)
                const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
                  const R = 6371 // Radio de la Tierra en km
                  const dLat = (lat2 - lat1) * (Math.PI / 180)
                  const dLon = (lon2 - lon1) * (Math.PI / 180)
                  const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * (Math.PI / 180)) *
                      Math.cos(lat2 * (Math.PI / 180)) *
                      Math.sin(dLon / 2) *
                      Math.sin(dLon / 2)
                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                  return R * c // Distancia en km
                }

                // Función para determinar el paso actual basado en la posición
                const determinarPasoActual = (posicionActual: { lat: number; lng: number }, pasos: Paso[]) => {
                  if (!pasos || pasos.length === 0) return

                  // Encontrar el paso más cercano a la posición actual
                  let distanciaMinima = Number.POSITIVE_INFINITY
                  let pasoMasCercano = 0

                  pasos.forEach((paso, index) => {
                    const distanciaAPaso = calcularDistancia(
                      posicionActual.lat,
                      posicionActual.lng,
                      paso.inicio.lat(),
                      paso.inicio.lng(),
                    )

                    if (distanciaAPaso < distanciaMinima) {
                      distanciaMinima = distanciaAPaso
                      pasoMasCercano = index
                    }
                  })

                  // Si cambiamos de paso y el audio está activado, leer la instrucción
                  if (pasoMasCercano !== pasoActual && audioActivado && speechSynthesisRef.current) {
                    const textoLimpio = pasos[pasoMasCercano].instruccion.replace(/<[^>]*>/g, "")
                    const utterance = new SpeechSynthesisUtterance(textoLimpio)
                    utterance.lang = "es-ES"
                    speechSynthesisRef.current.speak(utterance)
                  }

                  setPasoActual(pasoMasCercano)
                }

                // Determinar el paso actual basado en la posición
                determinarPasoActual(posicionActual, pasos)
              }
            }
          } else {
            console.error("Error al calcular la ruta:", status)
          }
        },
      )
    }

    if (navegacionActiva) {
      // Iniciar seguimiento
      if (navigator.geolocation && watchPositionIdRef.current === null) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const posicionActual = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }

            // Calcular rumbo si hay datos de rumbo disponibles
            let rumbo = 0
            if (position.coords.heading !== null && !isNaN(position.coords.heading)) {
              rumbo = position.coords.heading
            }

            // Actualizar posición del marcador del usuario
            if (userMarkerRef.current) {
              userMarkerRef.current.setPosition(posicionActual)
            }

            // Centrar el mapa en la posición actual
            if (googleMapRef.current) {
              googleMapRef.current.panTo(posicionActual)
            }

            // Actualizar la ruta
            if (directionsRendererRef.current) {
              actualizarRuta(posicionActual, rumbo)
            }
          },
          (error) => {
            console.error("Error al seguir la ubicación:", error)
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          },
        )

        watchPositionIdRef.current = watchId
      }
    } else {
      // Detener seguimiento
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current)
        watchPositionIdRef.current = null
      }
    }

    return () => {
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current)
        watchPositionIdRef.current = null
      }
    }
  }, [navegacionActiva, destination, pasoActual, audioActivado])

  // Función para obtener el icono de maniobra
  const getIconoManiobra = (maniobra: string): string => {
    switch (maniobra) {
      case "turn-right":
        return "↱"
      case "turn-left":
        return "↰"
      case "turn-slight-right":
        return "↱"
      case "turn-slight-left":
        return "↰"
      case "turn-sharp-right":
        return "↱"
      case "turn-sharp-left":
        return "↰"
      case "uturn-right":
        return "⮐"
      case "uturn-left":
        return "⮑"
      case "roundabout-right":
        return "⟳"
      case "roundabout-left":
        return "⟲"
      case "straight":
        return "↑"
      case "merge":
        return "↑"
      case "fork-right":
        return "⋔"
      case "fork-left":
        return "⋔"
      case "ferry":
        return "⚓"
      case "ferry-train":
        return "⚓"
      case "ramp-right":
        return "↱"
      case "ramp-left":
        return "↰"
      default:
        return "↑"
    }
  }

  // Función para alternar el audio
  const toggleAudio = () => {
    setAudioActivado(!audioActivado)
  }

  return (
    <div className="relative w-full h-full">
      {/* Mapa */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Pantalla de carga */}
      {cargando && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Calculando la mejor ruta...</p>
          </div>
        </div>
      )}

      {/* Indicador de navegación activa */}
      {navegacionActiva && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-40 flex items-center gap-2">
          <Navigation2 className="h-4 w-4 animate-pulse" />
          <span>Navegación activa</span>
        </div>
      )}

      {/* Panel de navegación */}
      <div
        className={`absolute left-0 right-0 ${
          panelExpandido ? "bottom-0" : "bottom-16"
        } bg-white rounded-t-xl shadow-lg transition-all duration-300 z-40 max-h-[60%] flex flex-col`}
      >
        {/* Botón para expandir/contraer */}
        <div
          className="flex justify-center py-2 border-b cursor-pointer"
          onClick={() => setPanelExpandido(!panelExpandido)}
        >
          {panelExpandido ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>

        {/* Información de ruta */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Navegando al estacionamiento</h3>
              <p className="text-gray-600">
                {distanciaTotal} · {tiempoTotal}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={toggleAudio}
                title={audioActivado ? "Desactivar instrucciones de voz" : "Activar instrucciones de voz"}
              >
                {audioActivado ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  if (googleMapRef.current && userMarkerRef.current) {
                    googleMapRef.current.panTo(userMarkerRef.current.getPosition() as google.maps.LatLng)
                    googleMapRef.current.setZoom(17)
                  }
                }}
                title="Centrar en mi ubicación"
              >
                <Navigation2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {/* Botón de iniciar viaje */}
          <Button
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
            onClick={() => setNavegacionActiva(!navegacionActiva)}
          >
            {navegacionActiva ? "Detener navegación" : "Iniciar viaje"}
          </Button>
        </div>

        {/* Lista de instrucciones */}
        {panelExpandido && (
          <div className="overflow-y-auto flex-grow">
            {instrucciones.map((paso, index) => (
              <div
                key={index}
                className={`p-4 border-b flex items-center gap-3 ${
                  index === pasoActual ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold">
                  {getIconoManiobra(paso.maniobra)}
                </div>
                <div className="flex-grow">
                  <div dangerouslySetInnerHTML={{ __html: paso.instruccion }} />
                  <div className="text-sm text-gray-500">
                    {paso.distancia} · {paso.duracion}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {precision !== null && (
        <div className="absolute bottom-20 left-4 bg-white px-3 py-1 rounded-md shadow-md text-xs">
          Precisión: {precision < 100 ? "Alta" : precision < 500 ? "Media" : "Baja"}({Math.round(precision)}m)
        </div>
      )}
    </div>
  )
}

export default RouteMap
