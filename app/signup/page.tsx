"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup, signInWithGoogle, signInWithFacebook } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setError("")
    setLoading(true)

    try {
      await signup(email, password, name)
      router.push("/dashboard")
    } catch (error) {
      setError("Error al registrarse: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError("")
    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error) {
      setError("Error al registrarse con Google: " + (error as Error).message)
    }
  }

  const handleFacebookSignup = async () => {
    setError("")
    try {
      await signInWithFacebook()
      router.push("/dashboard")
    } catch (error) {
      setError("Error al iniciar sesión con Facebook: " + (error as Error).message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logopark1.png"
              alt="Logo"
              className="h-20 w-20 object-cover"
            />
              <span className="text-xl font-bold">ParkMatch</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">Ingresa tus datos para crear tu cuenta en ParkMatch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Botón de registro con Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignup}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Registrarse con Google
          </Button>

          {/* Botón de inicio de sesión con Facebook */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mt-2"
            onClick={handleFacebookSignup}
          >
            <svg fill="#1877F2" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.337v21.326C0 23.403.597 24 1.337 24h11.492V14.706H9.691V11h3.138V8.309c0-3.108 1.895-4.805 4.664-4.805 1.325 0 2.462.099 2.795.143v3.24H18.41c-1.515 0-1.807.72-1.807 1.775V11h3.595l-.467 3.706h-3.128V24h6.17c.74 0 1.337-.597 1.337-1.337V1.337C24 .597 23.403 0 22.675 0z" />
            </svg>
            Iniciar sesión con Facebook
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O regístrate con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                    Términos de Servicio
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                    Política de Privacidad
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !agreedToTerms}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Iniciar Sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

