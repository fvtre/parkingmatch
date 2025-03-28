"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Save, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Estados para configuraciones
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Estados para notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reservationAlerts, setReservationAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Estados para privacidad
  const [showProfile, setShowProfile] = useState(true)
  const [shareLocation, setShareLocation] = useState(true)
  const [saveSearchHistory, setSaveSearchHistory] = useState(true)

  // Estado para idioma
  const [language, setLanguage] = useState("es")

  const handleSavePassword = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    // Validación básica
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      // Aquí iría la lógica para cambiar la contraseña
      // Por ejemplo: await updatePassword(currentPassword, newPassword)

      // Simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Contraseña actualizada correctamente")

      // Limpiar campos
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setError("Error al actualizar la contraseña: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Aquí iría la lógica para guardar las preferencias de notificaciones
      // Por ejemplo: await updateNotificationSettings({ emailNotifications, pushNotifications, ... })

      // Simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Preferencias de notificaciones actualizadas")
    } catch (error) {
      setError("Error al guardar las preferencias: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Aquí iría la lógica para guardar las preferencias de privacidad
      // Por ejemplo: await updatePrivacySettings({ showProfile, shareLocation, ... })

      // Simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Preferencias de privacidad actualizadas")
    } catch (error) {
      setError("Error al guardar las preferencias: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    // En una aplicación real, aquí habría una confirmación adicional
    if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      setLoading(true)
      setError("")

      try {
        // Aquí iría la lógica para eliminar la cuenta
        // Por ejemplo: await deleteUserAccount()

        // Simulamos una operación exitosa
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Redirigir al inicio
        router.push("/")
      } catch (error) {
        setError("Error al eliminar la cuenta: " + (error as Error).message)
        setLoading(false)
      }
    }
  }

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para acceder a la configuración</CardDescription>
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
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      <Tabs defaultValue="cuenta" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacidad">Privacidad</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="cuenta">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Cuenta</CardTitle>
              <CardDescription>Gestiona tu contraseña y opciones de cuenta</CardDescription>
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
                <h3 className="text-lg font-medium mb-4">Cambiar Contraseña</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSavePassword} disabled={loading}>
                    {loading ? "Guardando..." : "Cambiar Contraseña"}
                    {!loading && <Save className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Eliminar Cuenta</h3>
                <p className="text-gray-500 mb-4">
                  Al eliminar tu cuenta, todos tus datos serán borrados permanentemente. Esta acción no se puede
                  deshacer.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                  {loading ? "Procesando..." : "Eliminar Cuenta"}
                  {!loading && <Trash2 className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificaciones por email</Label>
                    <p className="text-sm text-gray-500">Recibe actualizaciones importantes por email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Notificaciones push</Label>
                    <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real</p>
                  </div>
                  <Switch id="pushNotifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reservationAlerts">Alertas de reservas</Label>
                    <p className="text-sm text-gray-500">Recibe alertas sobre tus reservas</p>
                  </div>
                  <Switch id="reservationAlerts" checked={reservationAlerts} onCheckedChange={setReservationAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Emails de marketing</Label>
                    <p className="text-sm text-gray-500">Recibe ofertas y novedades</p>
                  </div>
                  <Switch id="marketingEmails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} disabled={loading}>
                {loading ? "Guardando..." : "Guardar Preferencias"}
                {!loading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacidad">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Privacidad</CardTitle>
              <CardDescription>Controla quién puede ver tu información</CardDescription>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showProfile">Perfil visible</Label>
                    <p className="text-sm text-gray-500">Permite que otros usuarios vean tu perfil</p>
                  </div>
                  <Switch id="showProfile" checked={showProfile} onCheckedChange={setShowProfile} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shareLocation">Compartir ubicación</Label>
                    <p className="text-sm text-gray-500">Permite que la app use tu ubicación actual</p>
                  </div>
                  <Switch id="shareLocation" checked={shareLocation} onCheckedChange={setShareLocation} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="saveSearchHistory">Guardar historial de búsqueda</Label>
                    <p className="text-sm text-gray-500">Guarda tus búsquedas recientes</p>
                  </div>
                  <Switch id="saveSearchHistory" checked={saveSearchHistory} onCheckedChange={setSaveSearchHistory} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy} disabled={loading}>
                {loading ? "Guardando..." : "Guardar Preferencias"}
                {!loading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia y Preferencias</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Modo oscuro</Label>
                    <p className="text-sm text-gray-500">Cambia entre modo claro y oscuro</p>
                  </div>
                  <Switch id="darkMode" checked={theme === "dark"} onCheckedChange={toggleDarkMode} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

