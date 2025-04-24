"use client"

import PublicarEstacionamiento from "@/components/publicar-estacionamiento";
import { FaArrowLeft } from 'react-icons/fa';

export default function PublicarEstacionamientoPage() {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div className="relative min-h-screen bg-white">
      {/* Flecha de volver */}
      <button
        onClick={handleBack}
        className="absolute top-7 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <FaArrowLeft className="text-xl text-gray-700" />
      </button>

      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Publicar Estacionamiento</h1>
        <PublicarEstacionamiento />
      </div>
    </div>
  );
}