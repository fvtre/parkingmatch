"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  estacionamientoId: string
  propietarioId: string
  estacionamientoDireccion: string
}

interface Mensaje {
  id: string
  texto: string
  emisorId: string
  emisorNombre: string
  receptorId: string
  estacionamientoId: string
  createdAt: any
  leido: boolean
}

interface Usuario {
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export default function ChatDialog({
  open,
  onOpenChange,
  estacionamientoId,
  propietarioId,
  estacionamientoDireccion,
}: ChatDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [mensaje, setMensaje] = useState("")
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [propietario, setPropietario] = useState<Usuario | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Obtener información del propietario
  useEffect(() => {
    const fetchPropietario = async () => {
      if (!propietarioId) return

      try {
        // Primero intentamos obtener del documento de usuario
        const userDoc = await getDoc(doc(db, "users", propietarioId))

        if (userDoc.exists()) {
          setPropietario(userDoc.data() as Usuario)
        } else {
          // Si no existe un documento específico para el usuario, intentamos obtener de auth
          const authUserDoc = await getDoc(doc(db, "userProfiles", propietarioId))
          if (authUserDoc.exists()) {
            setPropietario(authUserDoc.data() as Usuario)
          } else {
            // Usar información básica si no hay datos
            setPropietario({
              displayName: "Propietario",
              email: null,
              photoURL: null,
            })
          }
        }
      } catch (error) {
        console.error("Error al obtener información del propietario:", error)
        setError("No se pudo cargar la información del propietario")
      }
    }

    if (open && propietarioId) {
      fetchPropietario()
    }
  }, [propietarioId, open])

  // Cargar mensajes
  useEffect(() => {
    if (!open || !user || !estacionamientoId) return

    setLoading(true)
    setError("")

    // Crear una consulta para obtener mensajes entre el usuario actual y el propietario
    // relacionados con este estacionamiento específico
    const mensajesQuery = query(
      collection(db, "mensajes"),
      where("estacionamientoId", "==", estacionamientoId),
      where("participantes", "array-contains", user.uid),
      orderBy("createdAt", "asc"),
    )

    const unsubscribe = onSnapshot(
      mensajesQuery,
      (snapshot) => {
        const nuevosMensajes: Mensaje[] = []
        snapshot.forEach((doc) => {
          nuevosMensajes.push({
            id: doc.id,
            ...doc.data(),
          } as Mensaje)
        })
        setMensajes(nuevosMensajes)
        setLoading(false)

        // Marcar mensajes como leídos si el usuario actual es el receptor
        nuevosMensajes.forEach(async (msg) => {
          if (msg.receptorId === user.uid && !msg.leido) {
            try {
              await updateDoc(doc(db, "mensajes", msg.id), {
                leido: true,
              })

              // También actualizar el contador de no leídos en la conversación
              const conversacionesQuery = query(
                collection(db, "conversaciones"),
                where("estacionamientoId", "==", estacionamientoId),
                where("participantes", "array-contains", user.uid),
              )

              const conversacionesSnapshot = await getDocs(conversacionesQuery)
              if (!conversacionesSnapshot.empty) {
                const conversacionId = conversacionesSnapshot.docs[0].id
                await updateDoc(doc(db, "conversaciones", conversacionId), {
                  [`noLeidos_${user.uid}`]: 0,
                })
              }
            } catch (error) {
              console.error("Error al marcar mensaje como leído:", error)
            }
          }
        })

        // Scroll al último mensaje
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      },
      (error) => {
        console.error("Error al obtener mensajes:", error)
        setError("Error al cargar los mensajes. Intenta de nuevo.")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [estacionamientoId, user, open])

  // Efecto para marcar mensajes como leídos cuando se abre el chat
  useEffect(() => {
    if (open && user && estacionamientoId) {
      const marcarMensajesComoLeidos = async () => {
        try {
          // Buscar la conversación
          const conversacionesQuery = query(
            collection(db, "conversaciones"),
            where("estacionamientoId", "==", estacionamientoId),
            where("participantes", "array-contains", user.uid),
          )

          const conversacionesSnapshot = await getDocs(conversacionesQuery)
          if (!conversacionesSnapshot.empty) {
            const conversacionId = conversacionesSnapshot.docs[0].id
            // Actualizar contador de no leídos a cero
            await updateDoc(doc(db, "conversaciones", conversacionId), {
              [`noLeidos_${user.uid}`]: 0,
            })
          }

          // Marcar todos los mensajes como leídos
          const mensajesQuery = query(
            collection(db, "mensajes"),
            where("estacionamientoId", "==", estacionamientoId),
            where("receptorId", "==", user.uid),
            where("leido", "==", false),
          )

          const mensajesSnapshot = await getDocs(mensajesQuery)
          const batch = writeBatch(db)

          mensajesSnapshot.forEach((doc) => {
            batch.update(doc.ref, { leido: true })
          })

          if (mensajesSnapshot.size > 0) {
            await batch.commit()
          }
        } catch (error) {
          console.error("Error al marcar mensajes como leídos:", error)
        }
      }

      marcarMensajesComoLeidos()
    }
  }, [open, user, estacionamientoId])

  // Scroll al último mensaje cuando cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes])

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!mensaje.trim() || !user || !estacionamientoId || !propietarioId) return

    try {
      // Determinar el receptor (si el usuario actual es el propietario, el receptor es el otro usuario)
      const esUsuarioPropietario = user.uid === propietarioId
      const receptorId = esUsuarioPropietario
        ? mensajes.find((m) => m.emisorId !== user.uid)?.emisorId || ""
        : propietarioId

      if (!receptorId && esUsuarioPropietario) {
        setError("No se puede determinar el destinatario del mensaje")
        return
      }

      // Crear nuevo mensaje
      await addDoc(collection(db, "mensajes"), {
        texto: mensaje.trim(),
        emisorId: user.uid,
        emisorNombre: user.displayName || user.email?.split("@")[0] || "Usuario",
        receptorId: receptorId,
        estacionamientoId,
        participantes: [user.uid, receptorId], // Para facilitar consultas
        createdAt: serverTimestamp(),
        leido: false,
      })

      // Crear o actualizar la conversación para facilitar el acceso a chats recientes
      const conversacionData = {
        estacionamientoId,
        estacionamientoDireccion,
        participantes: [user.uid, receptorId],
        ultimoMensaje: mensaje.trim(),
        ultimoMensajeTimestamp: serverTimestamp(),
        ultimoEmisorId: user.uid,
        // Agregar campos para notificaciones no leídas para cada usuario
        [`noLeidos_${user.uid}`]: 0,
        [`noLeidos_${receptorId}`]: 1, // Incrementar contador para el receptor
      }

      // Buscar si ya existe una conversación para este estacionamiento entre estos usuarios
      const conversacionesQuery = query(
        collection(db, "conversaciones"),
        where("estacionamientoId", "==", estacionamientoId),
        where("participantes", "array-contains", user.uid),
      )

      const conversacionesSnapshot = await getDocs(conversacionesQuery)

      if (conversacionesSnapshot.empty) {
        // Crear nueva conversación
        await addDoc(collection(db, "conversaciones"), conversacionData)
      } else {
        // Actualizar conversación existente
        const conversacionId = conversacionesSnapshot.docs[0].id
        const conversacionActual = conversacionesSnapshot.docs[0].data()

        // Incrementar contador de no leídos para el receptor
        const noLeidosActual = conversacionActual[`noLeidos_${receptorId}`] || 0

        await updateDoc(doc(db, "conversaciones", conversacionId), {
          ultimoMensaje: mensaje.trim(),
          ultimoMensajeTimestamp: serverTimestamp(),
          ultimoEmisorId: user.uid,
          [`noLeidos_${receptorId}`]: noLeidosActual + 1,
        })
      }

      setMensaje("")
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.")
    }
  }

  // Obtener iniciales para avatar
  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Chat sobre estacionamiento</span>
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">{estacionamientoDireccion}</p>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4 min-h-[300px] max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : mensajes.length > 0 ? (
            mensajes.map((msg) => {
              const esEmisor = msg.emisorId === user?.uid
              return (
                <div key={msg.id} className={`flex items-start gap-2 ${esEmisor ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={esEmisor ? user?.photoURL || "" : propietario?.photoURL || ""}
                      alt={esEmisor ? user?.displayName || "Usuario" : propietario?.displayName || "Propietario"}
                    />
                    <AvatarFallback>
                      {esEmisor
                        ? getInitials(user?.displayName || user?.email?.split("@")[0] || "U")
                        : getInitials(propietario?.displayName || "P")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[75%] ${
                      esEmisor ? "bg-blue-500 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.texto}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {msg.createdAt?.toDate
                        ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Enviando..."}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p>No hay mensajes aún.</p>
              <p className="text-sm">Envía un mensaje para iniciar la conversación.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Input
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                enviarMensaje()
              }
            }}
          />
          <Button size="icon" onClick={enviarMensaje} disabled={!mensaje.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
