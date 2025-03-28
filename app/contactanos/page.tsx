"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

export default function ContactanosPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validación básica
    if (!nombre || !email || !asunto || !mensaje) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    try {
      // Aquí iría la lógica para enviar el formulario
      // Por ejemplo: await sendContactForm({ nombre, email, asunto, mensaje })

      // Simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)

      // Limpiar el formulario
      setNombre("")
      setEmail("")
      setAsunto("")
      setMensaje("")
    } catch (error) {
      setError("Error al enviar el mensaje: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
      <p className="text-gray-500 mb-8">
        Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {success ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">¡Mensaje enviado!</h2>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad.
                  </p>
                  <Button onClick={() => setSuccess(false)}>Enviar otro mensaje</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Formulario de Contacto</CardTitle>
                <CardDescription>Completa el formulario para enviarnos tu consulta</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo</Label>
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto</Label>
                    <Select value={asunto} onValueChange={setAsunto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un asunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta">Consulta general</SelectItem>
                        <SelectItem value="soporte">Soporte técnico</SelectItem>
                        <SelectItem value="sugerencia">Sugerencia</SelectItem>
                        <SelectItem value="reclamo">Reclamo</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje</Label>
                    <Textarea
                      id="mensaje"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                    {!loading && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Otras formas de contactarnos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-gray-500">contacto@parkmatch.com</p>
                  <p className="text-sm text-gray-500">soporte@parkmatch.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Teléfono</h3>
                  <p className="text-sm text-gray-500">+56 2 2123 4567</p>
                  <p className="text-sm text-gray-500">Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Dirección</h3>
                  <p className="text-sm text-gray-500">Av. Providencia 1234, Oficina 567</p>
                  <p className="text-sm text-gray-500">Providencia, Santiago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
                {/* Aquí iría un mapa de Google Maps */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">Mapa de ubicación</div>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">¿Cómo funciona ParkMatch?</h3>
                <p className="text-sm text-gray-500">
                  ParkMatch conecta conductores que buscan estacionamiento con personas que tienen espacios disponibles.
                </p>
              </div>

              <div>
                <h3 className="font-medium">¿Cómo puedo ofrecer mi estacionamiento?</h3>
                <p className="text-sm text-gray-500">
                  Regístrate, completa tu perfil y publica tu espacio indicando disponibilidad y precio.
                </p>
              </div>

              <div>
                <h3 className="font-medium">¿Cómo se realizan los pagos?</h3>
                <p className="text-sm text-gray-500">
                  Los pagos se procesan de forma segura a través de nuestra plataforma utilizando tarjetas de crédito o
                  débito.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todas las preguntas
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

