"use client"

import { useEffect, useState } from "react"

export default function BackgroundPattern() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-80"></div>

      {/* Patrón de puntos */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#3b82f6 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
          opacity: 0.1,
        }}
      ></div>

      {/* Formas decorativas */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Líneas de carretera estilizadas */}
      <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-200 opacity-20"></div>
      <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white opacity-40"></div>
      <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-200 opacity-20"></div>
      <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-white opacity-40"></div>

      {/* Iconos de estacionamiento estilizados */}
      <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-blue-200 rounded-lg opacity-10 rotate-12"></div>
      <div className="absolute top-2/3 right-1/4 w-16 h-16 border-2 border-blue-200 rounded-lg opacity-10 -rotate-6"></div>
      <div className="absolute bottom-1/4 left-1/2 w-16 h-16 border-2 border-blue-200 rounded-lg opacity-10 rotate-45"></div>
    </div>
  )
}
