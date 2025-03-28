import Link from "next/link";
import { Button } from "@/components/ui/button";
import ParkingMap from "./parking-map";

export function ParkingHero() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Find Parking Spots in Real-Time
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Connect with drivers leaving their spots and save time finding parking. The smart way to park in busy
                areas.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full w-[600px] h-[600px]aspect-video rounded-xl overflow-hidden shadow-2xl">
              <ParkingMap /> {/* Aquí se coloca el mapa en lugar de la imagen */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
