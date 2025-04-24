"use client"

import type React from "react"
import { FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Car, MapPin, Star, Clock, Upload, Save, User } from "lucide-react"

export default function MiPerfilPage() {
  const handleBack = () => {
    window.history.back();
  };
  const { currentUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Estados para los datos del perfil
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [fotoPerfil, setFotoPerfil] = useState("")

  // Datos simulados para historial y vehículos
  const historialReservas = [
    { id: "1", fecha: "15/03/2024", ubicacion: "Av. Providencia 1234", estado: "Completada", calificacion: 5 },
    { id: "2", fecha: "10/03/2024", ubicacion: "Las Condes 4321", estado: "Completada", calificacion: 4 },
    { id: "3", fecha: "05/03/2024", ubicacion: "Santiago Centro 567", estado: "Cancelada", calificacion: 0 },
  ]

  const vehiculos = [
    { id: "1", placa: "ABCD12", marca: "Toyota", modelo: "Corolla", color: "Blanco", año: "2020" },
    { id: "2", placa: "WXYZ98", marca: "Honda", modelo: "Civic", color: "Gris", año: "2019" },
  ]

  useEffect(() => {
    if (currentUser) {
      // Cargar datos del usuario desde Firebase
      setNombre(currentUser.displayName || "")
      // En un caso real, estos datos vendrían de la base de datos
      setTelefono("+56 9 1234 5678")
      setDireccion("Av. Ejemplo 1234, Santiago")
      setFotoPerfil(currentUser.photoURL || "")
    }
  }, [currentUser])

  const handleSaveProfile = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Aquí iría la lógica para guardar los cambios en Firebase
      // Por ejemplo: await updateUserProfile(user.uid, { nombre, telefono, direccion })

      // Simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Perfil actualizado correctamente")
    } catch (error) {
      setError("Error al actualizar el perfil: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // En un caso real, aquí subiríamos la imagen a Firebase Storage
      // y obtendríamos la URL para actualizar el perfil

      // Simulamos con un FileReader para mostrar la imagen seleccionada
      const reader = new FileReader()
      reader.onload = (event) => {
        setFotoPerfil(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/login")} className="w-full">
              Iniciar Sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <button
        onClick={handleBack}
        className="absolute top-7 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <FaArrowLeft className="text-xl text-gray-700" />
      </button>
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="perfil">Información</TabsTrigger>
          <TabsTrigger value="vehiculos">Mis Vehículos</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={fotoPerfil || "/placeholder.svg?height=128&width=128"} alt={nombre} />
                  <AvatarFallback>
                    <User size={64} />
                  </AvatarFallback>
                </Avatar>

                <div className="w-full">
                  <Label htmlFor="picture" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md hover:bg-gray-50">
                      <Upload size={16} />
                      <span>Cambiar foto</span>
                    </div>
                    <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tus datos personales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={currentUser.email || ""} disabled />
                  <p className="text-sm text-gray-500">El email no se puede cambiar</p>
                </div>

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
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Tu dirección"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Cambios"}
                  {!loading && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehiculos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mis Vehículos</CardTitle>
                <CardDescription>Vehículos registrados en tu cuenta</CardDescription>
              </div>
              <Button>Agregar Vehículo</Button>
            </CardHeader>
            <CardContent>
              {vehiculos.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No tienes vehículos registrados</h3>
                  <p className="mt-1 text-gray-500">Agrega un vehículo para facilitar tus reservas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehiculos.map((vehiculo) => (
                    <div key={vehiculo.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Car className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {vehiculo.marca} {vehiculo.modelo}
                            </h3>
                            <p className="text-sm text-gray-500">Placa: {vehiculo.placa}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Eliminar
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Color:</span> {vehiculo.color}
                        </div>
                        <div>
                          <span className="text-gray-500">Año:</span> {vehiculo.año}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Reservas</CardTitle>
              <CardDescription>Tus reservas anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              {historialReservas.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No tienes reservas anteriores</h3>
                  <p className="mt-1 text-gray-500">Tu historial de reservas aparecerá aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historialReservas.map((reserva) => (
                    <div key={reserva.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <h3 className="font-medium">{reserva.ubicacion}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {reserva.fecha}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              reserva.estado === "Completada"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {reserva.estado}
                          </span>
                          {reserva.calificacion > 0 && (
                            <div className="flex items-center justify-end mt-1">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-sm">{reserva.calificacion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Ver Historial Completo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

