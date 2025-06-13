"use client"

import { useEffect, useState } from "react"
import { CheckCircle, MessageCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReservaConfirmadaProps {
  onChatClick: () => void
  onRouteClick: () => void
  autoOpenChat: boolean
  autoOpenRoute: boolean
}

export default function ReservaConfirmada({
  onChatClick,
  onRouteClick,
  autoOpenChat = true,
  autoOpenRoute = true,
}: ReservaConfirmadaProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Configurar temporizadores para abrir automáticamente el chat y la ruta
    if (autoOpenChat) {
      const chatTimer = setTimeout(() => {
        onChatClick()
      }, 1500)

      // Limpiar temporizador
      return () => clearTimeout(chatTimer)
    }
  }, [autoOpenChat, onChatClick])

  useEffect(() => {
    // Configurar temporizador para abrir la ruta después del chat
    if (autoOpenRoute) {
      const routeTimer = setTimeout(() => {
        onRouteClick()
      }, 3000)

      // Limpiar temporizador
      return () => clearTimeout(routeTimer)
    }
  }, [autoOpenRoute, onRouteClick])

  // Ocultar después de un tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h2>
          <p className="text-gray-600">
            Tu estacionamiento ha sido reservado exitosamente. Abriendo chat con el propietario y ruta al
            estacionamiento...
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onChatClick} className="w-full flex items-center justify-center gap-2" variant="outline">
            <MessageCircle className="h-5 w-5" />
            Chatear con el propietario
          </Button>

          <Button onClick={onRouteClick} className="w-full flex items-center justify-center gap-2">
            <Navigation className="h-5 w-5" />
            Ver ruta al estacionamiento
          </Button>
        </div>
      </div>
    </div>
  )
}
