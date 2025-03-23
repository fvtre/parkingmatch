"use client";

import React, { useEffect, useRef, useState } from "react";

// API de Google Maps
const GOOGLE_MAPS_API_KEY = "AIzaSyCXQI2698beKX3RoxhDBQWI6-Qp3FJFWS8"; 

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
  }
}

export default function ParkingMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [spots, setSpots] = useState<ParkingSpot[]>([
  ]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          setUserLocation({ lat: spots[0].lat, lng: spots[0].lng });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      const initMap = () => {
        if (!mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current as HTMLElement, {
          center: userLocation,
          zoom: 14,
        });

        new window.google.maps.Marker({
          position: userLocation,
          map,
          title: "Tu ubicación",
          icon: {
            url: "/images/gps.png",
            scaledSize: new window.google.maps.Size(50, 50),
          },
        });

        spots.forEach((spot) => {
          new window.google.maps.Marker({
            position: { lat: spot.lat, lng: spot.lng },
            map,
            title: spot.address,
            icon: {
              url: "/images/parking-icon.jpeg",
              scaledSize: new window.google.maps.Size(50, 50),
            },
          });
        });
      };

      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = initMap;
      } else {
        initMap();
      }
    }
  }, [userLocation, spots]);

  return <div ref={mapRef} className="w-full h-96"></div>;
}
