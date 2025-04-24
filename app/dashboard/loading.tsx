import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Buscar Estacionamiento</h1>
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Cargando estacionamientos...</p>
        </div>
      </div>
    </div>
  )
}
