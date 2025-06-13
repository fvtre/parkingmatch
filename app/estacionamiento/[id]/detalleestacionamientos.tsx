// app/estacionamiento/[id]/DetalleEstacionamiento.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, MessageCircle, Navigation, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";

// Importar el mapa dinámicamente
const MapWithNoSSR = dynamic(() => import("@/components/parking-map").then((mod) => mod.default), {
  ssr: false,
});

// Importar el componente de chat dinámicamente
const ChatDialog = dynamic(() => import("@/components/chatdialog"), {
  ssr: false,
  loading: () => <p>Cargando chat...</p>,
});

// Importar el componente de ruta dinámicamente
const RouteMap = dynamic(() => import("@/components/routemap"), {
  ssr: false,
  loading: () => <p>Cargando mapa de ruta...</p>,
});

interface Estacionamiento {
  id: string;
  propietarioId: string;
  direccion: string;
  latitud: number;
  longitud: number;
  precio: number;
  disponible: boolean;
  horarioInicio: string;
  horarioFin: string;
  caracteristicas: string[];
  imagenes: string[];
}

interface DetalleEstacionamientoProps {
  initialEstacionamiento: Estacionamiento;
}

export default function DetalleEstacionamiento({ initialEstacionamiento }: DetalleEstacionamientoProps) {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [estacionamiento, setEstacionamiento] = useState<Estacionamiento | null>(initialEstacionamiento);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [reservaDialogOpen, setReservaDialogOpen] = useState(false);
  const [reservando, setReservando] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number; lng: number } | null>(null);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionUsuario({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        },
      );
    }
  }, []);

  // Función para reservar el estacionamiento
  const reservarEstacionamiento = async () => {
    if (!user || !estacionamiento) return;

    try {
      setReservando(true);

      // Crear la reserva en Firestore
      const reservaData = {
        estacionamientoId: estacionamiento.id,
        propietarioId: estacionamiento.propietarioId,
        usuarioId: user.uid,
        direccion: estacionamiento.direccion,
        precio: estacionamiento.precio,
        estado: "pendiente",
        fechaReserva: serverTimestamp(),
        fechaUso: serverTimestamp(),
      };

      await addDoc(collection(db, "reservas"), reservaData);

      // Actualizar disponibilidad del estacionamiento
      const estacionamientoRef = doc(db, "estacionamientos", estacionamiento.id);
      await updateDoc(estacionamientoRef, {
        disponible: false,
      });

      // Actualizar estado local
      setEstacionamiento({
        ...estacionamiento,
        disponible: false,
      });

      toast({
        title: "Reserva exitosa",
        description: "Has reservado este estacionamiento correctamente",
      });

      setReservaDialogOpen(false);
    } catch (error) {
      console.error("Error al reservar estacionamiento:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo completar la reserva. Inténtalo de nuevo.",
      });
    } finally {
      setReservando(false);
    }
  };

  if (!estacionamiento) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>No se encontró el estacionamiento</p>
        <Button onClick={() => router.push("/buscar-estacionamiento")} className="mt-4">
          Volver a la búsqueda
        </Button>
      </div>
    );
  }

  // Verificar si el usuario es el propietario
  const esPropietario = user && user.uid === estacionamiento.propietarioId;

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-80 mb-4 rounded-lg overflow-hidden border">
            {estacionamiento.imagenes && estacionamiento.imagenes.length > 0 ? (
              <>
                <img
                  src={estacionamiento.imagenes[currentImage] || "/placeholder.svg?height=320&width=640"}
                  alt={estacionamiento.direccion}
                  className="w-full h-full object-cover"
                />
                {estacionamiento.imagenes.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {estacionamiento.imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-3 h-3 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Sin imagen</p>
              </div>
            )}
          </div>

          {estacionamiento.imagenes && estacionamiento.imagenes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {estacionamiento.imagenes.map((imagen, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    index === currentImage ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={imagen || "/placeholder.svg?height=80&width=80"}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
            <div className="h-60 rounded-lg overflow-hidden border">
              <MapWithNoSSR
                center={{ lat: estacionamiento.latitud, lng: estacionamiento.longitud }}
                zoom={16}
                estacionamientos={[
                  {
                    id: estacionamiento.id,
                    position: { lat: estacionamiento.latitud, lng: estacionamiento.longitud },
                    title: estacionamiento.direccion,
                    price: estacionamiento.precio,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{estacionamiento.direccion}</h1>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-2xl text-green-600 font-bold">${estacionamiento.precio}/hora</p>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                estacionamiento.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {estacionamiento.disponible ? "Disponible" : "No disponible"}
            </span>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Dirección</h3>
                    <p>{estacionamiento.direccion}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Horario disponible</h3>
                    <p>
                      {estacionamiento.horarioInicio} - {estacionamiento.horarioFin}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Precio</h3>
                    <p>${estacionamiento.precio} por hora</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-3">Características</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {estacionamiento.caracteristicas && estacionamiento.caracteristicas.length > 0 ? (
              estacionamiento.caracteristicas.map((caracteristica) => (
                <span key={caracteristica} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {caracteristica}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No se han especificado características</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {estacionamiento.disponible && !esPropietario && (
              <Button
                onClick={() => setReservaDialogOpen(true)}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <Calendar className="h-5 w-5" />
                Reservar ahora
              </Button>
            )}

            <Button
              variant={estacionamiento.disponible && !esPropietario ? "outline" : "default"}
              onClick={() => setRouteDialogOpen(true)}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <Navigation className="h-5 w-5" />
              Cómo llegar
            </Button>

            {!esPropietario && (
              <Button
                variant="outline"
                onClick={() => setChatOpen(true)}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                Chatear con propietario
              </Button>
            )}
          </div>
        </div>
      </div>

      <ChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        estacionamientoId={estacionamiento.id}
        propietarioId={estacionamiento.propietarioId}
        estacionamientoDireccion={estacionamiento.direccion}
      />

      <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cómo llegar</DialogTitle>
            <DialogDescription>Ruta hacia {estacionamiento.direccion}</DialogDescription>
          </DialogHeader>

          <div className="h-[500px] w-full rounded-lg overflow-hidden border mt-4">
            {ubicacionUsuario ? (
              <RouteMap
                origin={ubicacionUsuario}
                destination={{ lat: estacionamiento.latitud, lng: estacionamiento.longitud }}
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
                if (estacionamiento) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${estacionamiento.latitud},${estacionamiento.longitud}`;
                  window.open(url, "_blank");
                }
              }}
            >
              Abrir en Google Maps
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reservaDialogOpen} onOpenChange={setReservaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservar estacionamiento</DialogTitle>
            <DialogDescription>
              Estás a punto de reservar este estacionamiento. Una vez confirmada la reserva, el espacio quedará bloqueado para ti.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Dirección:</span>
                <span>{estacionamiento.direccion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Precio por hora:</span>
                <span className="text-green-600 font-bold">${estacionamiento.precio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Horario disponible:</span>
                <span>
                  {estacionamiento.horarioInicio} - {estacionamiento.horarioFin}
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
    </div>
  );
}