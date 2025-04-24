"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Edit, Trash2, AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaArrowLeft } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
}

export default function MisEstacionamientosPage() {
  const handleBack = () => {
    window.history.back();
  };
  const { user, loading } = useAuth()
  const router = useRouter()
  const [estacionamientos, setEstacionamientos] = useState<Estacionamiento[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [estacionamientoToDelete, setEstacionamientoToDelete] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router, mounted])

  // Cargar estacionamientos del usuario
  useEffect(() => {
    const fetchEstacionamientos = async () => {
      if (!user) return

      try {
        setLoadingData(true)
        const estacionamientosRef = collection(db, "estacionamientos")
        const q = query(estacionamientosRef, where("propietarioId", "==", user.uid))
        const querySnapshot = await getDocs(q)

        const estacionamientosData: Estacionamiento[] = []
        querySnapshot.forEach((doc) => {
          estacionamientosData.push({
            id: doc.id,
            ...doc.data(),
          } as Estacionamiento)
        })

        setEstacionamientos(estacionamientosData)
        setError("")
      } catch (error) {
        console.error("Error al cargar estacionamientos:", error)
        setError("Error al cargar tus estacionamientos. Por favor, intenta nuevamente.")
      } finally {
        setLoadingData(false)
      }
    }

    if (user) {
      fetchEstacionamientos()
    }
  }, [user])

  // Cambiar disponibilidad del estacionamiento
  const toggleDisponibilidad = async (id: string, disponible: boolean) => {
    try {
      const estacionamientoRef = doc(db, "estacionamientos", id)
      await updateDoc(estacionamientoRef, {
        disponible: !disponible,
      })

      // Actualizar estado local
      setEstacionamientos((prev) => prev.map((e) => (e.id === id ? { ...e, disponible: !disponible } : e)))
    } catch (error) {
      console.error("Error al cambiar disponibilidad:", error)
      setError("Error al cambiar la disponibilidad. Por favor, intenta nuevamente.")
    }
  }

  // Eliminar estacionamiento
  const handleDelete = async () => {
    if (!estacionamientoToDelete) return

    try {
      await deleteDoc(doc(db, "estacionamientos", estacionamientoToDelete))

      // Actualizar estado local
      setEstacionamientos((prev) => prev.filter((e) => e.id !== estacionamientoToDelete))
      setDeleteDialogOpen(false)
      setEstacionamientoToDelete(null)
    } catch (error) {
      console.error("Error al eliminar estacionamiento:", error)
      setError("Error al eliminar el estacionamiento. Por favor, intenta nuevamente.")
    }
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading || !mounted || !user) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Estacionamientos</h1>
          <p className="text-gray-600 mt-1">Administra tus estacionamientos publicados</p>
          <button
            onClick={handleBack}
            className="absolute top-10 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <FaArrowLeft className="text-xl text-gray-700" />
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loadingData ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tus estacionamientos...</p>
          </div>
        </div>
      ) : estacionamientos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estacionamientos.map((estacionamiento) => (
            <Card key={estacionamiento.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden relative">
                {estacionamiento.imagenes && estacionamiento.imagenes.length > 0 ? (
                  <img
                    src={estacionamiento.imagenes[0] || "/placeholder.svg?height=160&width=320"}
                    alt={estacionamiento.direccion}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Sin imagen</p>
                  </div>
                )}
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${estacionamiento.disponible ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}
                >
                  {estacionamiento.disponible ? "Disponible" : "No disponible"}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{estacionamiento.direccion}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    <span>
                      {estacionamiento.horarioInicio} - {estacionamiento.horarioFin}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2 text-gray-500" />
                    <span>
                      {estacionamiento.caracteristicas && estacionamiento.caracteristicas.length > 0
                        ? estacionamiento.caracteristicas.join(", ")
                        : "Sin características"}
                    </span>
                  </div>
                  <div className="font-bold text-lg text-green-600">${estacionamiento.precio}/hora</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={estacionamiento.disponible ? "default" : "outline"}
                    className="w-full"
                    onClick={() => toggleDisponibilidad(estacionamiento.id, estacionamiento.disponible)}
                  >
                    {estacionamiento.disponible ? "Deshabilitar" : "Habilitar"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={() => router.push(`/editar-estacionamiento/${estacionamiento.id}`)}
                  >
                    <Edit size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full col-span-2 flex items-center justify-center gap-1"
                    onClick={() => {
                      setEstacionamientoToDelete(estacionamiento.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tienes estacionamientos publicados</h3>
          <p className="text-gray-600 mb-6">Publica tu primer estacionamiento y comienza a generar ingresos extra.</p>
          <div className="fixed bottom-[100px] left-0 w-full flex justify-center z-50">
            <Button
              onClick={() => router.push("/publicar-estacionamiento")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Publicar Nuevo
            </Button>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este estacionamiento de nuestros
              servidores.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
