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
  displayName: string | null | undefined
  email: string | null | undefined
  photoURL: string | null | undefined
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
      if (!propietarioId) {
        setError("ID del propietario no proporcionado")
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", propietarioId))
        if (userDoc.exists()) {
          setPropietario(userDoc.data() as Usuario)
        } else {
          const authUserDoc = await getDoc(doc(db, "userProfiles", propietarioId))
          if (authUserDoc.exists()) {
            setPropietario(authUserDoc.data() as Usuario)
          } else {
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
    if (!open || !user || !estacionamientoId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    console.log("Cargando mensajes - estacionamientoId:", estacionamientoId, "user.uid:", user.uid)

    const mensajesQuery = query(
      collection(db, "mensajes"),
      where("estacionamientoId", "==", estacionamientoId),
      where("participantes", "array-contains", user.uid),
      orderBy("createdAt", "asc"),
    )

    const unsubscribe = onSnapshot(
      mensajesQuery,
      (snapshot) => {
        console.log("Documentos recibidos:", snapshot.size)
        const nuevosMensajes: Mensaje[] = []
        snapshot.forEach((doc) => {
          console.log("Mensaje:", doc.data())
          nuevosMensajes.push({
            id: doc.id,
            ...doc.data(),
          } as Mensaje)
        })
        console.log("Mensajes actualizados:", nuevosMensajes)
        setMensajes(nuevosMensajes)
        setLoading(false)

        nuevosMensajes.forEach(async (msg) => {
          if (msg.receptorId === user.uid && !msg.leido) {
            try {
              await updateDoc(doc(db, "mensajes", msg.id), {
                leido: true,
              })
              console.log(`Mensaje ${msg.id} marcado como leído`)
            } catch (error) {
              console.error("Error al marcar mensaje como leído:", error)
            }
          }
        })

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      },
      (error) => {
        console.error("Error al obtener mensajes:", error)
        setError("Error al cargar los mensajes. Por favor, intenta de nuevo.")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [estacionamientoId, user, open])

  // Monitorear estado de renderizado
  useEffect(() => {
    console.log("Estado de renderizado - loading:", loading, "mensajes:", mensajes)
  }, [loading, mensajes])

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!mensaje.trim() || !user || !estacionamientoId || !propietarioId) {
      setError("Faltan datos para enviar el mensaje")
      return
    }

    try {
      const esUsuarioPropietario = user.uid === propietarioId
      const receptorId = esUsuarioPropietario
        ? mensajes.find((m) => m.emisorId !== user.uid)?.emisorId || ""
        : propietarioId

      console.log("Enviando mensaje - receptorId:", receptorId)

      if (!receptorId && esUsuarioPropietario) {
        setError("No se puede determinar el destinatario del mensaje")
        return
      }

      const mensajeData = {
        texto: mensaje.trim(),
        emisorId: user.uid,
        emisorNombre: user.displayName || user.email?.split("@")[0] || "Usuario",
        receptorId: receptorId,
        estacionamientoId,
        participantes: [user.uid, receptorId].filter(Boolean),
        createdAt: serverTimestamp(),
        leido: false,
      }

      console.log("Datos del mensaje:", mensajeData)

      await addDoc(collection(db, "mensajes"), mensajeData)

      const conversacionData = {
        estacionamientoId,
        estacionamientoDireccion,
        participantes: [user.uid, receptorId],
        ultimoMensaje: mensaje.trim(),
        ultimoMensajeTimestamp: serverTimestamp(),
        ultimoEmisorId: user.uid,
        [`noLeidos_${user.uid}`]: 0,
        [`noLeidos_${receptorId}`]: 1,
      }

      const conversacionesQuery = query(
        collection(db, "conversaciones"),
        where("estacionamientoId", "==", estacionamientoId),
        where("participantes", "array-contains", user.uid),
      )

      const conversacionesSnapshot = await getDocs(conversacionesQuery)

      if (conversacionesSnapshot.empty) {
        await addDoc(collection(db, "conversaciones"), conversacionData)
      } else {
        const conversacionId = conversacionesSnapshot.docs[0].id
        const conversacionActual = conversacionesSnapshot.docs[0].data()
        const noLeidosActual = conversacionActual[`noLeidos_${receptorId}`] || 0

        await updateDoc(doc(db, "conversaciones", conversacionId), {
          ultimoMensaje: mensaje.trim(),
          ultimoMensajeTimestamp: serverTimestamp(),
          ultimoEmisorId: user.uid,
          [`noLeidos_${receptorId}`]: noLeidosActual + 1,
        })
      }

      setMensaje("")
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado correctamente.",
      })
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje.",
      })
    }
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

  const renderMessages = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )
    }

    if (mensajes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <p>No hay mensajes aún.</p>
          <p className="text-sm">Envía un mensaje para iniciar la conversación.</p>
          <p className="text-xs text-red-500 mt-2">Debug: Revisa la consola para verificar si los mensajes se cargaron.</p>
        </div>
      )
    }

    return mensajes.map((msg) => {
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
                ? getInitials(user?.displayName ?? user?.email?.split("@")[0] ?? "U")
                : getInitials(propietario?.displayName ?? "P")}
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
          {renderMessages()}
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