"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle } from "lucide-react"
import ChatDialog from "@/components/chatdialog"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Conversacion {
  id: string
  estacionamientoId: string
  estacionamientoDireccion: string
  participantes: string[]
  ultimoMensaje: string
  ultimoMensajeTimestamp: any
  ultimoEmisorId: string
  noLeidos: number
}

interface Usuario {
  id: string
  displayName: string | null | undefined
  email: string | null | undefined
  photoURL: string | null | undefined
}

export default function MensajesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [usuarios, setUsuarios] = useState<{ [key: string]: Usuario }>({})
  const [filtro, setFiltro] = useState<"todos" | "noLeidos">("todos")
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [chatOpen, setChatOpen] = useState(false)
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState<Conversacion | null>(null)

  // Cargar conversaciones
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    console.log("Cargando conversaciones para user.uid:", user.uid)

    const conversacionesQuery = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", user.uid),
      orderBy("ultimoMensajeTimestamp", "desc"),
    )

    const unsubscribe = onSnapshot(
      conversacionesQuery,
      async (querySnapshot) => {
        console.log("Conversaciones recibidas:", querySnapshot.size)
        const conversacionesData: Conversacion[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          conversacionesData.push({
            id: doc.id,
            estacionamientoId: data.estacionamientoId,
            estacionamientoDireccion: data.estacionamientoDireccion,
            participantes: data.participantes,
            ultimoMensaje: data.ultimoMensaje,
            ultimoMensajeTimestamp: data.ultimoMensajeTimestamp,
            ultimoEmisorId: data.ultimoEmisorId,
            noLeidos: data[`noLeidos_${user.uid}`] || 0,
          })
        })

        setConversaciones(conversacionesData)

        const usuariosNuevos: { [key: string]: Usuario } = { ...usuarios }
        for (const conv of conversacionesData) {
          const otroUsuarioId = conv.participantes.find((id) => id !== user.uid)
          if (otroUsuarioId && !usuariosNuevos[otroUsuarioId]) {
            try {
              const userDoc = await getDoc(doc(db, "users", otroUsuarioId))
              if (userDoc.exists()) {
                usuariosNuevos[otroUsuarioId] = {
                  id: otroUsuarioId,
                  ...userDoc.data(),
                } as Usuario
              } else {
                const authUserDoc = await getDoc(doc(db, "userProfiles", otroUsuarioId))
                if (authUserDoc.exists()) {
                  usuariosNuevos[otroUsuarioId] = {
                    id: otroUsuarioId,
                    ...authUserDoc.data(),
                  } as Usuario
                } else {
                  usuariosNuevos[otroUsuarioId] = {
                    id: otroUsuarioId,
                    displayName: "Usuario",
                    email: null,
                    photoURL: null,
                  }
                }
              }
            } catch (error) {
              console.error("Error al obtener usuario:", error)
            }
          }
        }
        setUsuarios(usuariosNuevos)
        setLoading(false)
      },
      (error) => {
        console.error("Error al cargar conversaciones:", error)
        setError("Error al cargar tus mensajes. Por favor, intenta nuevamente.")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  const renderConversations = () => {
    const conversacionesFiltradas = conversaciones
      .filter((conv) => (filtro === "noLeidos" ? conv.noLeidos > 0 : true))
      .filter((conv) =>
        conv.estacionamientoDireccion.toLowerCase().includes(busqueda.toLowerCase()),
      )

    if (loading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )
    }

    if (conversacionesFiltradas.length === 0) {
      return (
        <div className="text-center text-gray-500">
          <MessageCircle className="mx-auto h-12 w-12 mb-2" />
          <p>No tienes mensajes aún.</p>
          <p className="text-sm">¡Busca un estacionamiento y comienza una conversación!</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {conversacionesFiltradas.map((conversacion) => {
          const otroUsuario = getOtroUsuario(conversacion)
          return (
            <div
              key={conversacion.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setConversacionSeleccionada(conversacion)
                setChatOpen(true)
              }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={otroUsuario?.photoURL || ""} alt={otroUsuario?.displayName || "Usuario"} />
                <AvatarFallback>{getInitials(otroUsuario?.displayName ?? "U")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{otroUsuario?.displayName || otroUsuario?.email || "Usuario"}</p>
                  {conversacion.noLeidos > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conversacion.noLeidos}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{conversacion.estacionamientoDireccion}</p>
                <p className="text-sm text-gray-600 truncate">{conversacion.ultimoMensaje}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const getOtroUsuario = (conversacion: Conversacion) => {
    const otroUsuarioId = conversacion.participantes.find((id) => id !== user?.uid)
    return otroUsuarioId ? usuarios[otroUsuarioId] : null
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Mensajes</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Button
            variant={filtro === "todos" ? "default" : "outline"}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </Button>
          <Button
            variant={filtro === "noLeidos" ? "default" : "outline"}
            onClick={() => setFiltro("noLeidos")}
          >
            No Leídos
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {renderConversations()}

      {conversacionSeleccionada && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          estacionamientoId={conversacionSeleccionada.estacionamientoId}
          propietarioId={getOtroUsuario(conversacionSeleccionada)?.id || ""}
          estacionamientoDireccion={conversacionSeleccionada.estacionamientoDireccion}
        />
      )}
    </div>
  )
}