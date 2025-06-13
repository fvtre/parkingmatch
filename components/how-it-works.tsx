import { Car, MapPin, Clock, Handshake } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cómo funciona ParkMatch</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
            Nuestra plataforma conecta a los conductores que dejan un espacio de estacionamiento con quienes buscan una, ahorrándole tiempo y frustraciones.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Registra tu vehiculo</h3>
            <p className="text-gray-500">Cree una cuenta y agregue los detalles de su vehículo para comenzar.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Comparte tu ubicación</h3>
            <p className="text-gray-500">Hazle saber a los demás cuando estás a punto de abandonar un lugar de estacionamiento o de buscar uno.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Encuentra espacio en tiempo real</h3>
            <p className="text-gray-500">Nuestro algoritmo combina a los conductores que salen con aquellos que buscan lugares.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <Handshake className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Completa el intercambio</h3>
            <p className="text-gray-500">Coordina la entrega y disfruta de tu lugar de estacionamiento o continúa tu camino.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

