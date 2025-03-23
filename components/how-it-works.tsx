import { Car, MapPin, Clock, Handshake } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cómo funciona ParkMatch</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Our platform connects drivers leaving parking spots with those looking for one, saving you time and
              frustration.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Register Your Vehicle</h3>
            <p className="text-gray-500">Create an account and add your vehicle details to get started.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Share Your Location</h3>
            <p className="text-gray-500">Let others know when you're leaving a parking spot or looking for one.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Get Matched in Real-Time</h3>
            <p className="text-gray-500">Our algorithm matches drivers leaving with those looking for spots.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-blue-100 rounded-full">
              <Handshake className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">Complete the Exchange</h3>
            <p className="text-gray-500">Coordinate the handover and enjoy your parking spot or be on your way.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

