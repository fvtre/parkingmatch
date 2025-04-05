"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Users,
  Car,
  Settings,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Save,
  RefreshCw,
} from "lucide-react"

export default function AdminPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Datos simulados para usuarios
  const users = [
    { id: 1, name: "Juan Pérez", email: "juan@ejemplo.com", role: "Usuario", status: "Activo", joined: "15/01/2023" },
    {
      id: 2,
      name: "María López",
      email: "maria@ejemplo.com",
      role: "Propietario",
      status: "Activo",
      joined: "20/02/2023",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
      role: "Usuario",
      status: "Inactivo",
      joined: "10/03/2023",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@ejemplo.com",
      role: "Propietario",
      status: "Activo",
      joined: "05/04/2023",
    },
    {
      id: 5,
      name: "Pedro Sánchez",
      email: "pedro@ejemplo.com",
      role: "Administrador",
      status: "Activo",
      joined: "12/05/2023",
    },
  ]

  // Datos simulados para estacionamientos
  const parkings = [
    {
      id: 1,
      name: "Estacionamiento Central",
      address: "Av. Providencia 1234",
      owner: "María López",
      spots: 15,
      status: "Activo",
    },
    {
      id: 2,
      name: "Parking Las Condes",
      address: "Las Condes 4321",
      owner: "Ana Martínez",
      spots: 8,
      status: "Activo",
    },
    {
      id: 3,
      name: "Estacionamiento Norte",
      address: "Vitacura 567",
      owner: "Carlos Gómez",
      spots: 12,
      status: "Pendiente",
    },
    { id: 4, name: "Parking Sur", address: "Gran Avenida 890", owner: "Roberto Díaz", spots: 20, status: "Activo" },
    {
      id: 5,
      name: "Estacionamiento Express",
      address: "Santiago Centro 123",
      owner: "Laura Torres",
      spots: 5,
      status: "Inactivo",
    },
  ]

  // Datos simulados para configuración del sistema
  const [systemSettings, setSystemSettings] = useState({
    reservationFee: "5",
    maxReservationTime: "24",
    autoApproveListings: true,
    requireVerification: true,
    maintenanceMode: false,
    allowGuestBooking: false,
  })

  const handleSystemSettingsSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Aquí iría la lógica para guardar la configuración
      // Por ejemplo: await updateSystemSettings(systemSettings)

      // Simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Configuración del sistema actualizada correctamente")
    } catch (error) {
      setError("Error al actualizar la configuración: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Debes iniciar sesión como administrador para acceder a este panel</CardDescription>
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona usuarios, estacionamientos y configuración del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="usuarios">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="estacionamientos">
            <Car className="h-4 w-4 mr-2" />
            Estacionamientos
          </TabsTrigger>
          <TabsTrigger value="configuracion">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Administra los usuarios registrados en la plataforma</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar usuario..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Nombre</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Rol</th>
                      <th className="py-3 px-4 text-left font-medium">Estado</th>
                      <th className="py-3 px-4 text-left font-medium">Fecha Registro</th>
                      <th className="py-3 px-4 text-left font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{user.id}</td>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "Administrador"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "Propietario"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.joined}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Mostrando 5 de 120 usuarios</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="estacionamientos">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Gestión de Estacionamientos</CardTitle>
                  <CardDescription>Administra los estacionamientos registrados en la plataforma</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar estacionamiento..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select defaultValue="todos">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Nombre</th>
                      <th className="py-3 px-4 text-left font-medium">Dirección</th>
                      <th className="py-3 px-4 text-left font-medium">Propietario</th>
                      <th className="py-3 px-4 text-left font-medium">Espacios</th>
                      <th className="py-3 px-4 text-left font-medium">Estado</th>
                      <th className="py-3 px-4 text-left font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parkings.map((parking) => (
                      <tr key={parking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{parking.id}</td>
                        <td className="py-3 px-4">{parking.name}</td>
                        <td className="py-3 px-4">{parking.address}</td>
                        <td className="py-3 px-4">{parking.owner}</td>
                        <td className="py-3 px-4">{parking.spots}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              parking.status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : parking.status === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {parking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {parking.status === "Pendiente" ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Mostrando 5 de 45 estacionamientos</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Ajusta los parámetros generales de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div>
                <h3 className="text-lg font-medium mb-4">Configuración General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reservationFee">Comisión por reserva (%)</Label>
                    <Input
                      id="reservationFee"
                      type="number"
                      value={systemSettings.reservationFee}
                      onChange={(e) => setSystemSettings({ ...systemSettings, reservationFee: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxReservationTime">Tiempo máximo de reserva (horas)</Label>
                    <Input
                      id="maxReservationTime"
                      type="number"
                      value={systemSettings.maxReservationTime}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maxReservationTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Opciones de la Plataforma</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoApproveListings">Aprobar estacionamientos automáticamente</Label>
                      <p className="text-sm text-gray-500">
                        Los nuevos estacionamientos se aprobarán sin revisión manual
                      </p>
                    </div>
                    <Switch
                      id="autoApproveListings"
                      checked={systemSettings.autoApproveListings}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, autoApproveListings: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireVerification">Requerir verificación de usuarios</Label>
                      <p className="text-sm text-gray-500">
                        Los usuarios deben verificar su identidad para usar la plataforma
                      </p>
                    </div>
                    <Switch
                      id="requireVerification"
                      checked={systemSettings.requireVerification}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, requireVerification: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Modo mantenimiento</Label>
                      <p className="text-sm text-gray-500">
                        Activa el modo mantenimiento para realizar actualizaciones
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowGuestBooking">Permitir reservas sin registro</Label>
                      <p className="text-sm text-gray-500">Los usuarios pueden reservar sin crear una cuenta</p>
                    </div>
                    <Switch
                      id="allowGuestBooking"
                      checked={systemSettings.allowGuestBooking}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, allowGuestBooking: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Mantenimiento del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Limpiar Caché del Sistema
                  </Button>

                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Regenerar Índices de Búsqueda
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSystemSettingsSave} disabled={loading} className="flex items-center gap-2">
                {loading ? "Guardando..." : "Guardar Configuración"}
                {!loading && <Save className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

