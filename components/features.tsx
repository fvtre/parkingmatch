import { Shield, Clock, MapPin, Bell, CreditCard, Users } from "lucide-react"

export function Features() {
  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Características</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Todo lo que necesitas para que aparcar sea más fácil y eficiente.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Clock className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Coincidencia en tiempo real</h3>
            <p className="text-gray-500">Obtenga coincidencias con conductores en tiempo real según la ubicación y el horario.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Seguimiento de ubicación</h3>
            <p className="text-gray-500">Seguimiento preciso de la ubicación para garantizar intercambios fluidos de lugares de estacionamiento.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Bell className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Notificaciones instantáneas</h3>
            <p className="text-gray-500">
              Recibe una notificación inmediata cuando se encuentre una coincidencia o cuando sea el momento de intercambiar.
            </p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Plataforma segura</h3>
            <p className="text-gray-500">Sus datos están protegidos con medidas de seguridad estándar de la industria.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Pagos fáciles</h3>
            <p className="text-gray-500">Procesamiento de pagos sin inconvenientes para funciones y servicios premium.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Users className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Calificaciones de usuarios</h3>
            <p className="text-gray-500">Califica tu experiencia para ayudar a construir una comunidad confiable de conductores.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

