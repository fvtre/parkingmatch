"use client"

import { useEffect, useRef } from "react"

interface RouteMapProps {
  origin: { lat: number; lng: number }
  destination: { lat: number; lng: number }
  zoom: number
}

const RouteMap = ({ origin, destination, zoom }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
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
        script.onload = () => loadMap()
        document.head.appendChild(script)
      } else {
        loadMap()
      }
    }

    // Función para cargar el mapa una vez que la API está disponible
    const loadMap = () => {
      if (!mapRef.current || !window.google) return

      // Crear el mapa
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: origin,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      })

      googleMapRef.current = googleMap

      // Crear el DirectionsService y DirectionsRenderer
      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: googleMap,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#3B82F6", // Color azul para la ruta
          strokeWeight: 5,
        },
      })

      directionsRendererRef.current = directionsRenderer

      // Calcular y mostrar la ruta
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result)

            // Mostrar información de la ruta
            if (result && result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
              const distance = result.routes[0].legs[0].distance?.text
              const duration = result.routes[0].legs[0].duration?.text

              // Crear un panel de información
              const infoPanel = document.createElement("div")
              infoPanel.className =
                "absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg border text-center"
              infoPanel.innerHTML = `
                <div class="font-medium">Distancia: ${distance || "N/A"}</div>
                <div>Tiempo estimado: ${duration || "N/A"}</div>
              `

              // Añadir el panel al mapa
              googleMap.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(infoPanel)
            }
          } else {
            console.error("Error al calcular la ruta:", status)
          }
        },
      )
    }

    initMap()

    // Limpieza al desmontar
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
      }
    }
  }, [origin, destination, zoom])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
}

export default RouteMap
