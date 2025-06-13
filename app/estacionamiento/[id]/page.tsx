// app/estacionamiento/[id]/page.tsx
import { db } from "@/lib/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { notFound } from "next/navigation";
import DetalleEstacionamiento from "./detalleestacionamientos"; // Importa el componente del cliente

interface Estacionamiento {
  id: string;
  propietarioId: string;
  direccion: string;
  latitud: number;
  longitud: number;
  precio: number;
  disponible: boolean;
  horarioInicio: string;
  horarioFin: string;
  caracteristicas: string[];
  imagenes: string[];
}

// Generar los parámetros estáticos
export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "estacionamientos"));
  const ids = querySnapshot.docs.map((doc) => ({
    id: doc.id,
  }));

  return ids;
}

// Componente del servidor
export default async function EstacionamientoPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Obtener los datos del estacionamiento desde Firestore
  const docRef = doc(db, "estacionamientos", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound(); // Mostrar 404 si no existe el estacionamiento
  }

  const estacionamiento: Estacionamiento = {
    id: docSnap.id,
    ...docSnap.data(),
  } as Estacionamiento;

  // Renderizar el componente del cliente con los datos iniciales
  return <DetalleEstacionamiento initialEstacionamiento={estacionamiento} />;
}