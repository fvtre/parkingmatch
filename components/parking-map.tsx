"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Navigation, MapPin, AlertTriangle, RefreshCw } from 'lucide-react';

// Usar variable de entorno para la API key
const GOOGLE_MAPS_API_KEY = "AIzaSyB0HrQff9pm3w9ebYV-XmTiL3WVzlL6eRc"; 

interface ParkingSpot {
  id: string;
  lat: number;
  lng: number;
  address: string;
  availableIn: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function ParkingMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [destination, setDestination] = useState<string>("");
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isRouteVisible, setIsRouteVisible] = useState<boolean>(false);
  const [mapError, setMapError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Obtener la ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          // Ubicación predeterminada si no se puede obtener la ubicación del usuario
          setIsLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  // Inicializar el mapa cuando tenemos la ubicación del usuario
  useEffect(() => {
    if (userLocation && mapRef.current && !mapError) {
      // Función para manejar errores de carga del mapa
      const handleMapError = () => {
        setMapError(true);
        setIsLoading(false);
        console.error("Error al cargar Google Maps API");
      };

      // Función para inicializar el mapa
      window.initMap = () => {
        if (!mapRef.current) return;
        
        try {
          // Crear instancia del mapa
          const googleMap = new window.google.maps.Map(mapRef.current, {
            center: userLocation,
            zoom: 14,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            gestureHandling: "cooperative",
          });
          
          setMap(googleMap);
          setIsLoading(false);

          // Crear servicios de direcciones
          const dirService = new window.google.maps.DirectionsService();
          const dirRenderer = new window.google.maps.DirectionsRenderer({
            map: googleMap,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#1E88E5",
              strokeWeight: 5,
            },
          });
          
          setDirectionsService(dirService);
          setDirectionsRenderer(dirRenderer);

          // Marcador para la ubicación del usuario
          new window.google.maps.Marker({
            position: userLocation,
            map: googleMap,
            title: "Tu ubicación",
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            },
          });

          // Inicializar autocompletado
          if (autocompleteInputRef.current) {
            const autoComplete = new window.google.maps.places.Autocomplete(
              autocompleteInputRef.current,
              { 
                types: ["address"],
                fields: ["formatted_address", "geometry", "name"],
                componentRestrictions: { country: "cl" },
              }
            );
            
            autoComplete.addListener("place_changed", () => {
              const place = autoComplete.getPlace();
              if (place.geometry) {
                setDestination(place.formatted_address);
                googleMap.setCenter(place.geometry.location);
                
                // Añadir marcador para el destino
                new window.google.maps.Marker({
                  position: place.geometry.location,
                  map: googleMap,
                  title: place.name,
                  animation: window.google.maps.Animation.DROP,
                  icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  },
                });
              }
            });
            
            setAutocomplete(autoComplete);
          }

          // Añadir marcadores para los spots de estacionamiento (cuando existan)
          spots.forEach((spot) => {
            new window.google.maps.Marker({
              position: { lat: spot.lat, lng: spot.lng },
              map: googleMap,
              title: spot.address,
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/parking.png",
                scaledSize: new window.google.maps.Size(40, 40),
              },
            });
          });
        } catch (error) {
          console.error("Error inicializando el mapa:", error);
          handleMapError();
        }
      };

      // Cargar el script de Google Maps si aún no está cargado
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = handleMapError;
        document.head.appendChild(script);
      } else {
        try {
          window.initMap();
        } catch (error) {
          console.error("Error llamando a initMap:", error);
          handleMapError();
        }
      }
    }
  }, [userLocation, spots, mapError]);

  // Función para calcular y mostrar la ruta
  const calculateAndDisplayRoute = () => {
    if (!directionsService || !directionsRenderer || !userLocation || !destination) return;

    try {
      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response: any, status: string) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
            setIsRouteVisible(true);
          } else {
            console.error(`Error al calcular la ruta: ${status}`);
            alert("No se pudo calcular la ruta. Por favor, intenta con otra dirección.");
          }
        }
      );
    } catch (error) {
      console.error("Error al calcular la ruta:", error);
      alert("Ocurrió un error al calcular la ruta. Por favor, intenta nuevamente.");
    }
  };

  // Función para limpiar la ruta
  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
      setIsRouteVisible(false);
    }
  };

  // Función para reintentar cargar el mapa
  const retryLoadMap = () => {
    setMapError(false);
    setIsLoading(true);
    
    // Limpiar cualquier script previo
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => script.remove());
    
    // Reiniciar el proceso
    if (userLocation && mapRef.current) {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          setMapError(true);
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        try {
          window.initMap();
        } catch (error) {
          setMapError(true);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <Input
            ref={autocompleteInputRef}
            placeholder="Ingresa una dirección de destino"
            className="w-full"
            onChange={(e) => setDestination(e.target.value)}
            disabled={mapError || isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={calculateAndDisplayRoute}
            className="flex items-center gap-2"
            disabled={!destination || mapError || isLoading}
          >
            <Navigation size={16} />
            Mostrar ruta
          </Button>
          {isRouteVisible && (
            <Button 
              variant="outline" 
              onClick={clearRoute}
              className="flex items-center gap-2"
              disabled={mapError || isLoading}
            >
              Limpiar ruta
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="w-full h-[300px] rounded-lg shadow-md flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      ) : mapError ? (
        <div className="w-full h-[300px] rounded-lg shadow-md flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar Google Maps</h3>
            <p className="text-gray-600 mb-4">No se pudo cargar el mapa correctamente. Esto puede deberse a:</p>
            <ul className="text-left text-gray-600 mb-4 max-w-md mx-auto">
              <li className="mb-1">• Problemas con la clave de API de Google Maps</li>
              <li className="mb-1">• Restricciones de dominio en la clave de API</li>
              <li className="mb-1">• Problemas de conexión a internet</li>
              <li className="mb-1">• Bloqueo de cookies o JavaScript en el navegador</li>
            </ul>
            <Button 
              onClick={retryLoadMap}
              className="flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} />
              Intentar nuevamente
            </Button>
          </div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-[300px] rounded-lg shadow-md"></div>
      )}
      
    </div>
  );
}