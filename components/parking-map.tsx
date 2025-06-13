"use client"

import { useEffect, useRef } from "react"

export interface ParkingMapProps {
  center: { lat: number; lng: number }
  zoom: number
  estacionamientos: {
    id: string
    position: { lat: number; lng: number }
    title: string
    price: number
  }[]
  radio?: number
  onMarkerClick?: (id: string) => void
}

const ParkingMap = ({ center, zoom, estacionamientos, radio, onMarkerClick }: ParkingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const circleRef = useRef<google.maps.Circle | null>(null)

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
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      })

      googleMapRef.current = googleMap

      // Crear círculo para mostrar el radio de búsqueda
      if (radio) {
        circleRef.current = new window.google.maps.Circle({
          strokeColor: "#3B82F6",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3B82F6",
          fillOpacity: 0.1,
          map: googleMap,
          center,
          radius: radio,
        })
      }

      // Crear marcadores para los estacionamientos
      estacionamientos.forEach((estacionamiento) => {
        // Crear un icono personalizado con una "E"
        const iconoEstacionamiento = {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
          scale: 12,
          labelOrigin: new window.google.maps.Point(0, 0),
        }

        const marker = new window.google.maps.Marker({
          position: estacionamiento.position,
          map: googleMap,
          title: `${estacionamiento.title} - ${estacionamiento.price}/hora`,
          icon: iconoEstacionamiento,
          label: {
            text: "E",
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: "12px",
          },
        })

        // Añadir evento click
        if (onMarkerClick) {
          marker.addListener("click", () => {
            onMarkerClick(estacionamiento.id)
          })
        }

        // Añadir InfoWindow
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px; font-weight: bold;">${estacionamiento.title}</h3>
              <p style="margin: 0; color: green; font-weight: bold;">$${estacionamiento.price}/hora</p>
            </div>
          `,
        })

        marker.addListener("mouseover", () => {
          infoWindow.open(googleMap, marker)
        })

        marker.addListener("mouseout", () => {
          infoWindow.close()
        })

        markersRef.current.push(marker)
      })
    }

    // Limpiar marcadores anteriores
    const clearMarkers = () => {
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      if (circleRef.current) {
        circleRef.current.setMap(null)
        circleRef.current = null
      }
    }

    clearMarkers()
    initMap()

    // Limpieza al desmontar
    return () => {
      clearMarkers()
    }
  }, [center, zoom, estacionamientos, radio, onMarkerClick])

  // Actualizar el centro y zoom del mapa cuando cambien
  useEffect(() => {
    if (typeof window === "undefined") return

    if (googleMapRef.current) {
      googleMapRef.current.setCenter(center)
      googleMapRef.current.setZoom(zoom)

      // Actualizar círculo si existe
      if (circleRef.current && radio) {
        circleRef.current.setCenter(center)
        circleRef.current.setRadius(radio)
      }
    }
  }, [center, zoom, radio])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
}

// Añadir esta declaración para el tipo global de window con google maps
declare global {
  interface Window {
    google: any
  }
}

export default ParkingMap
