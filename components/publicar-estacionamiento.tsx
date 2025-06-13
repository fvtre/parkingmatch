"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import ImageUploader from "@/components/imageuploader"

export default function PublicarEstacionamiento() {
  const { user } = useAuth()
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
  const [imagenesUrls, setImagenesUrls] = useState<string[]>([])
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

  // Manejar imágenes subidas
  const handleImagesUploaded = (urls: string[]) => {
    setImagenesUrls(urls)
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
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

      // Verificar si hay imágenes seleccionadas pero no confirmadas
      const imageUploader = document.getElementById("image-uploader-submit")
      if (imageUploader) {
        // Simular clic en el botón de confirmar imágenes
        imageUploader.click()

        // Esperar un momento para que se complete la simulación
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Crear documento en Firestore (sin URLs reales de imágenes)
      const estacionamientoData = {
        propietarioId: user.uid,
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
        imagenes: [], // No guardamos URLs reales ya que no tenemos Firebase Storage
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "estacionamientos"), estacionamientoData)

      alert("Estacionamiento publicado con éxito! (Las imágenes se muestran solo localmente)")
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
        <CardTitle className="text-2xl font-bold text-center">Publicar Estacionamiento</CardTitle>
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
            <label className="font-medium">Imágenes del estacionamiento</label>
            {user && (
              <>
                <ImageUploader
                  onImagesUploaded={handleImagesUploaded}
                  userId={user.uid}
                  maxImages={5}
                  folder="estacionamientos"
                />
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ Nota: Las imágenes solo se mostrarán localmente. Para guardarlas permanentemente, se requiere
                  habilitar Firebase Storage.
                </p>
              </>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Publicando..." : "Publicar Estacionamiento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
