"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, ImageIcon, X, Loader2, Check } from "lucide-react"

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void
  maxImages?: number
  userId: string
  initialImages?: string[]
  folder?: string
}

export default function ImageUploader({
  onImagesUploaded,
  maxImages = 5,
  userId,
  initialImages = [],
  folder = "estacionamientos",
}: ImageUploaderProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Manejar selección de imágenes desde la galería
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Verificar si excede el límite de imágenes
      if (previewUrls.length + newFiles.length > maxImages) {
        alert(`Solo puedes subir un máximo de ${maxImages} imágenes.`)
        return
      }

      // Añadir nuevas imágenes a la selección
      setSelectedImages((prev) => [...prev, ...newFiles])

      // Crear URLs de vista previa
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  // Abrir selector de archivos
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Abrir cámara
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  // Eliminar imagen
  const removeImage = (index: number) => {
    // Si es una imagen ya subida (de initialImages)
    if (index < initialImages.length) {
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
      onImagesUploaded(previewUrls.filter((_, i) => i !== index))
    } else {
      // Si es una imagen recién seleccionada
      const adjustedIndex = index - initialImages.length

      // Liberar URL de objeto para evitar fugas de memoria
      URL.revokeObjectURL(previewUrls[index])

      setSelectedImages((prev) => prev.filter((_, i) => i !== adjustedIndex))
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    }
  }

  // Simular subida de imágenes (sin Firebase Storage)
  const simulateUpload = async () => {
    if (selectedImages.length === 0) {
      // Si no hay nuevas imágenes seleccionadas, mantener las iniciales
      if (initialImages.length > 0) {
        onImagesUploaded(initialImages)
      }
      return initialImages
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simular progreso de carga
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        // Esperar un poco para simular la carga
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // Usar las URLs de vista previa como "URLs subidas"
      // En un entorno real, estas serían reemplazadas por URLs de Firebase Storage
      const simulatedUrls = previewUrls

      // Notificar al componente padre sobre las URLs "subidas"
      onImagesUploaded(simulatedUrls)

      // Mostrar mensaje de éxito
      alert("Imágenes procesadas correctamente (modo simulación)")

      return simulatedUrls
    } catch (error) {
      console.error("Error al procesar imágenes:", error)
      alert(`Error al procesar imágenes: ${(error as Error).message || "Error desconocido"}`)
      throw error
    } finally {
      setUploading(false)
      setUploadProgress(0)
      // No limpiamos selectedImages para mantener las imágenes seleccionadas
    }
  }

  return (
    <div className="space-y-4">
      {/* Vista previa de imágenes */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previewUrls.map((url, index) => (
            <Card key={index} className="relative overflow-hidden group aspect-square">
              <img
                src={url || "/placeholder.svg"}
                alt={`Vista previa ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Eliminar imagen"
              >
                <X size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        {/* Botón para seleccionar de la galería */}
        <Button
          type="button"
          variant="outline"
          onClick={openFileSelector}
          disabled={uploading || previewUrls.length >= maxImages}
          className="flex items-center gap-2"
        >
          <ImageIcon size={18} />
          Elegir de la galería
        </Button>

        {/* Botón para tomar foto */}
        <Button
          type="button"
          variant="outline"
          onClick={openCamera}
          disabled={uploading || previewUrls.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Camera size={18} />
          Tomar foto
        </Button>

        {/* Botón para "subir" imágenes (simulado) */}
        {selectedImages.length > 0 && (
          <Button
            type="button"
            onClick={simulateUpload}
            disabled={uploading}
            className="flex items-center gap-2 ml-auto"
            id="image-uploader-submit"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Procesando... {uploadProgress}%
              </>
            ) : (
              <>
                <Check size={18} />
                Confirmar selección
              </>
            )}
          </Button>
        )}
      </div>

      {/* Inputs ocultos */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelection}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleImageSelection}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500">
        Puedes seleccionar hasta {maxImages} imágenes.{" "}
        {previewUrls.length > 0 && `(${previewUrls.length}/${maxImages})`}
      </p>
      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-sm text-amber-700">
          <strong>Modo de demostración:</strong> Las imágenes no se subirán a un servidor. Esta es una simulación para
          fines de desarrollo.
        </p>
      </div>
    </div>
  )
}
