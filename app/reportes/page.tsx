"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "../../components/date-range-picker"
import { Download, FileText, DollarSign, Calendar, Users, Car } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Datos simulados para los gráficos
const reservationData = [
  { name: "Ene", reservas: 65 },
  { name: "Feb", reservas: 59 },
  { name: "Mar", reservas: 80 },
  { name: "Abr", reservas: 81 },
  { name: "May", reservas: 56 },
  { name: "Jun", reservas: 55 },
  { name: "Jul", reservas: 40 },
  { name: "Ago", reservas: 70 },
  { name: "Sep", reservas: 90 },
  { name: "Oct", reservas: 110 },
  { name: "Nov", reservas: 95 },
  { name: "Dic", reservas: 85 },
]

const revenueData = [
  { name: "Ene", ingresos: 4000 },
  { name: "Feb", ingresos: 3000 },
  { name: "Mar", ingresos: 5000 },
  { name: "Abr", ingresos: 5500 },
  { name: "May", ingresos: 4500 },
  { name: "Jun", ingresos: 3500 },
  { name: "Jul", ingresos: 2800 },
  { name: "Ago", ingresos: 4800 },
  { name: "Sep", ingresos: 6000 },
  { name: "Oct", ingresos: 7500 },
  { name: "Nov", ingresos: 6500 },
  { name: "Dic", ingresos: 5800 },
]

const parkingTypeData = [
  { name: "Residencial", value: 45 },
  { name: "Comercial", value: 30 },
  { name: "Público", value: 15 },
  { name: "Privado", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const userActivityData = [
  { name: "Lun", usuarios: 120 },
  { name: "Mar", usuarios: 150 },
  { name: "Mié", usuarios: 180 },
  { name: "Jue", usuarios: 170 },
  { name: "Vie", usuarios: 200 },
  { name: "Sáb", usuarios: 250 },
  { name: "Dom", usuarios: 220 },
]

export default function ReportesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [reportType, setReportType] = useState("reservas")

  // Estadísticas resumidas
  const stats = [
    { title: "Total Reservas", value: "1,248", icon: Calendar, color: "bg-blue-100 text-blue-600" },
    { title: "Ingresos", value: "$58,350", icon: DollarSign, color: "bg-green-100 text-green-600" },
    { title: "Usuarios Activos", value: "843", icon: Users, color: "bg-purple-100 text-purple-600" },
    { title: "Estacionamientos", value: "156", icon: Car, color: "bg-orange-100 text-orange-600" },
  ]

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para ver los reportes</CardDescription>
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
          <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
          <p className="text-gray-500">Visualiza el rendimiento de tu cuenta en ParkMatch</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <DatePickerWithRange className="w-full sm:w-auto" />

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservas Mensuales</CardTitle>
                <CardDescription>Total de reservas realizadas por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reservationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reservas" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
                <CardDescription>Total de ingresos generados por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Estacionamiento</CardTitle>
                <CardDescription>Distribución por tipo de estacionamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={parkingTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {parkingTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad de Usuarios</CardTitle>
                <CardDescription>Usuarios activos por día de la semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usuarios" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reservas">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Detalle de Reservas</CardTitle>
                  <CardDescription>Historial completo de reservas realizadas</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="completadas">Completadas</SelectItem>
                      <SelectItem value="pendientes">Pendientes</SelectItem>
                      <SelectItem value="canceladas">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generar Reporte
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Fecha</th>
                      <th className="py-3 px-4 text-left font-medium">Usuario</th>
                      <th className="py-3 px-4 text-left font-medium">Ubicación</th>
                      <th className="py-3 px-4 text-left font-medium">Duración</th>
                      <th className="py-3 px-4 text-left font-medium">Monto</th>
                      <th className="py-3 px-4 text-left font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{(1000 + i).toString()}</td>
                        <td className="py-3 px-4">{`${10 + i}/11/2023`}</td>
                        <td className="py-3 px-4">{`Usuario ${i + 1}`}</td>
                        <td className="py-3 px-4">{`Estacionamiento ${i + 1}`}</td>
                        <td className="py-3 px-4">{`${i + 1} hora(s)`}</td>
                        <td className="py-3 px-4">{`$${(i + 1) * 500}`}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              i % 3 === 0
                                ? "bg-green-100 text-green-800"
                                : i % 3 === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {i % 3 === 0 ? "Completada" : i % 3 === 1 ? "Pendiente" : "Cancelada"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Mostrando 10 de 248 reservas</div>
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

        <TabsContent value="ingresos">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Ingresos</CardTitle>
                <CardDescription>Desglose de ingresos por período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Detalle de Ingresos</CardTitle>
                    <CardDescription>Transacciones y pagos recibidos</CardDescription>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar a Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">ID Transacción</th>
                        <th className="py-3 px-4 text-left font-medium">Fecha</th>
                        <th className="py-3 px-4 text-left font-medium">Concepto</th>
                        <th className="py-3 px-4 text-left font-medium">Método de Pago</th>
                        <th className="py-3 px-4 text-left font-medium">Monto</th>
                        <th className="py-3 px-4 text-left font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">TX-{(10000 + i).toString()}</td>
                          <td className="py-3 px-4">{`${10 + i}/11/2023`}</td>
                          <td className="py-3 px-4">{`Reserva #${1000 + i}`}</td>
                          <td className="py-3 px-4">{i % 2 === 0 ? "Tarjeta de Crédito" : "PayPal"}</td>
                          <td className="py-3 px-4 font-medium">{`$${(i + 1) * 500}`}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                i % 4 === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {i % 4 === 0 ? "Completado" : "Procesado"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad de Usuarios</CardTitle>
                <CardDescription>Usuarios activos por día de la semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usuarios" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nuevos Registros</CardTitle>
                <CardDescription>Usuarios nuevos por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: "Ene", usuarios: 25 },
                        { name: "Feb", usuarios: 30 },
                        { name: "Mar", usuarios: 45 },
                        { name: "Abr", usuarios: 40 },
                        { name: "May", usuarios: 35 },
                        { name: "Jun", usuarios: 55 },
                        { name: "Jul", usuarios: 50 },
                        { name: "Ago", usuarios: 65 },
                        { name: "Sep", usuarios: 70 },
                        { name: "Oct", usuarios: 85 },
                        { name: "Nov", usuarios: 75 },
                        { name: "Dic", usuarios: 60 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="usuarios" stroke="#ec4899" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

