"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Car, Clock, MapPin } from "lucide-react";
const GOOGLE_MAPS_API_KEY = "AIzaSyCXQI2698beKX3RoxhDBQWI6-Qp3FJFWS8"; 


interface ParkingSpot {
  id: string;
  address: string;
  lat: number;
  lng: number;
  availableIn: number;
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function ParkingList() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);
  const [message, setMessage] = useState<string>("Cargando estacionamientos...");

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`);
        const data = await response.json();
        setParkingSpots(data);
      } catch (error) {
        console.error("Error al obtener estacionamientos:", error);
        setMessage("No se pudieron cargar los estacionamientos.");
      }
    };

    fetchParkingSpots();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          setMessage("No se pudo acceder a la ubicación.");
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const filtered = parkingSpots.filter((spot) => {
        return getDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng) <= 5;
      });
      setFilteredSpots(filtered);
      setMessage(filtered.length === 0 ? "No hay estacionamientos cercanos en este momento." : "");
    }
  }, [userLocation, parkingSpots]);

  const reserveSpot = (id: string) => {
    setFilteredSpots(filteredSpots.filter((spot) => spot.id !== id));
    alert("¡Lugar reservado! Recibirás direcciones al estacionamiento.");
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <div key={spot.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{spot.address}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      A {getDistance(userLocation!.lat, userLocation!.lng, spot.lat, spot.lng).toFixed(2)} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-amber-600 dark:text-amber-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{spot.availableIn} min</span>
                </div>
              </div>
              <Button onClick={() => reserveSpot(spot.id)} variant="outline" className="w-full mt-2" size="sm">
                <Car className="h-4 w-4 mr-2" />
                Reservar lugar
              </Button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>{message}</p>
            <p className="text-sm mt-2">Intenta ampliar tu radio de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}