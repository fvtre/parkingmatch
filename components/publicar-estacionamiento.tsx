"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function PublicarEstacionamiento() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    direccion: "",
    latitud: "",
    longitud: "",
    precio: "",
    horarioInicio: "",
    horarioFin: "",
    caracteristicas: {
      techado: false,
      vigilancia: false,
      iluminacion: false,
    },
  })
  const [imagenes, setImagenes] = useState<FileList | null>(null)
  const [ubicacionActual, setUbicacionActual] = useState(false)

  // Obtener ubicación actual
  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString(),
          })
          setUbicacionActual(true)
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
          setError("No se pudo obtener tu ubicación. Por favor ingresa las coordenadas manualmente.")
        },
      )
    } else {
      setError("Tu navegador no soporta geolocalización")
    }
  }

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Manejar cambios en checkboxes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      caracteristicas: {
        ...formData.caracteristicas,
        [name]: checked,
      },
    })
  }

  // Manejar cambios en imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(e.target.files)
    }
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      setError("Debes iniciar sesión para publicar un estacionamiento")
      router.push("/login")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Validar datos
      if (!formData.direccion || !formData.latitud || !formData.longitud || !formData.precio) {
        throw new Error("Por favor completa todos los campos obligatorios")
      }

      // Subir imágenes a Firebase Storage
      const imagenesUrls: string[] = []

      if (imagenes) {
        for (let i = 0; i < imagenes.length; i++) {
          const imagen = imagenes[i]
          const storageRef = ref(storage, `estacionamientos/${currentUser.uid}/${Date.now()}_${imagen.name}`)
          const snapshot = await uploadBytes(storageRef, imagen)
          const url = await getDownloadURL(snapshot.ref)
          imagenesUrls.push(url)
        }
      }

      // Crear documento en Firestore
      const estacionamientoData = {
        propietarioId: currentUser.uid,
        direccion: formData.direccion,
        latitud: Number.parseFloat(formData.latitud),
        longitud: Number.parseFloat(formData.longitud),
        precio: Number.parseFloat(formData.precio),
        disponible: true,
        horarioInicio: formData.horarioInicio,
        horarioFin: formData.horarioFin,
        caracteristicas: Object.entries(formData.caracteristicas)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        imagenes: imagenesUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "estacionamientos"), estacionamientoData)

      alert("Estacionamiento publicado con éxito!")
      router.push("/mis-estacionamientos")
    } catch (error) {
      console.error("Error al publicar estacionamiento:", error)
      setError(`Error al publicar estacionamiento: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="direccion" className="font-medium">
              Dirección
            </label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. Providencia 1234, Santiago"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="latitud" className="font-medium">
                Latitud
              </label>
              <Input
                id="latitud"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                placeholder="Ej: -33.4489"
                required
                disabled={ubicacionActual}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="longitud" className="font-medium">
                Longitud
              </label>
              <Input
                id="longitud"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                placeholder="Ej: -70.6693"
                required
                disabled={ubicacionActual}
              />
            </div>
          </div>

          <Button type="button" variant="outline" onClick={obtenerUbicacion} className="w-full flex items-center gap-2">
            <MapPin size={18} />
            Usar mi ubicación actual
          </Button>

          <div className="space-y-2">
            <label htmlFor="precio" className="font-medium">
              Precio por hora (CLP)
            </label>
            <Input
              id="precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              placeholder="Ej: 1500"
              required
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="horarioInicio" className="font-medium">
                Horario de inicio
              </label>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <Input
                  id="horarioInicio"
                  name="horarioInicio"
                  type="time"
                  value={formData.horarioInicio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="horarioFin" className="font-medium">
                Horario de fin
              </label>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <Input
                  id="horarioFin"
                  name="horarioFin"
                  type="time"
                  value={formData.horarioFin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Características</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="techado"
                  checked={formData.caracteristicas.techado}
                  onCheckedChange={(checked) => handleCheckboxChange("techado", checked as boolean)}
                />
                <label htmlFor="techado">Techado</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vigilancia"
                  checked={formData.caracteristicas.vigilancia}
                  onCheckedChange={(checked) => handleCheckboxChange("vigilancia", checked as boolean)}
                />
                <label htmlFor="vigilancia">Vigilancia</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="iluminacion"
                  checked={formData.caracteristicas.iluminacion}
                  onCheckedChange={(checked) => handleCheckboxChange("iluminacion", checked as boolean)}
                />
                <label htmlFor="iluminacion">Iluminación</label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="imagenes" className="font-medium">
              Imágenes (opcional)
            </label>
            <Input
              id="imagenes"
              name="imagenes"
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500">Puedes subir hasta 5 imágenes</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Publicando..." : "Publicar Estacionamiento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
