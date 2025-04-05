"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Search, HelpCircle, Book, FileText, Video, MessageCircle, ChevronRight } from "lucide-react"

export default function AyudaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Categorías de ayuda
  const helpCategories = [
    { id: "registro", name: "Registro y Cuenta", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "reservas", name: "Reservas", icon: <Book className="h-5 w-5" /> },
    { id: "estacionamientos", name: "Estacionamientos", icon: <FileText className="h-5 w-5" /> },
    { id: "pagos", name: "Pagos", icon: <FileText className="h-5 w-5" /> },
    { id: "app", name: "Uso de la App", icon: <Video className="h-5 w-5" /> },
  ]

  // Preguntas frecuentes
  const faqs = [
    {
      category: "registro",
      questions: [
        {
          id: "faq-1",
          question: "¿Cómo creo una cuenta en ParkMatch?",
          answer:
            "Para crear una cuenta en ParkMatch, haz clic en el botón 'Registrarse' en la página principal. Completa el formulario con tu nombre, correo electrónico y contraseña. También puedes registrarte utilizando tu cuenta de Google para mayor rapidez.",
        },
        {
          id: "faq-2",
          question: "¿Cómo recupero mi contraseña?",
          answer:
            "Si olvidaste tu contraseña, ve a la página de inicio de sesión y haz clic en '¿Olvidaste tu contraseña?'. Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
        },
        {
          id: "faq-3",
          question: "¿Puedo cambiar mi correo electrónico?",
          answer:
            "Actualmente no es posible cambiar el correo electrónico asociado a tu cuenta. Si necesitas usar un correo diferente, deberás crear una nueva cuenta.",
        },
      ],
    },
    {
      category: "reservas",
      questions: [
        {
          id: "faq-4",
          question: "¿Cómo reservo un estacionamiento?",
          answer:
            "Para reservar un estacionamiento, busca la ubicación deseada en el mapa o mediante la barra de búsqueda. Selecciona un estacionamiento disponible, elige la fecha y hora, y completa el proceso de pago.",
        },
        {
          id: "faq-5",
          question: "¿Puedo cancelar una reserva?",
          answer:
            "Sí, puedes cancelar una reserva hasta 2 horas antes de la hora programada. Para hacerlo, ve a 'Mis Reservas' en tu perfil, selecciona la reserva que deseas cancelar y haz clic en 'Cancelar Reserva'.",
        },
        {
          id: "faq-6",
          question: "¿Qué sucede si llego tarde a mi reserva?",
          answer:
            "Tienes un período de gracia de 15 minutos después de la hora de inicio de tu reserva. Si llegas después de este período, el propietario puede considerar tu reserva como no utilizada.",
        },
      ],
    },
    {
      category: "estacionamientos",
      questions: [
        {
          id: "faq-7",
          question: "¿Cómo puedo ofrecer mi estacionamiento?",
          answer:
            "Para ofrecer tu estacionamiento, ve a tu perfil y selecciona 'Publicar Estacionamiento'. Completa la información requerida, incluyendo ubicación, disponibilidad, fotos y precio. Una vez aprobado, tu estacionamiento aparecerá en las búsquedas.",
        },
        {
          id: "faq-8",
          question: "¿Cuánto puedo cobrar por mi estacionamiento?",
          answer:
            "Tú decides el precio de tu estacionamiento. Te recomendamos investigar los precios en tu zona para establecer un valor competitivo. ParkMatch cobra una comisión del 5% por cada reserva completada.",
        },
      ],
    },
    {
      category: "pagos",
      questions: [
        {
          id: "faq-9",
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Actualmente aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), así como PayPal. Estamos trabajando para incorporar más métodos de pago en el futuro.",
        },
        {
          id: "faq-10",
          question: "¿Cuándo recibo el pago por mis estacionamientos?",
          answer:
            "Los pagos se procesan cada 15 días. El dinero se transferirá a la cuenta bancaria que hayas registrado en tu perfil.",
        },
      ],
    },
    {
      category: "app",
      questions: [
        {
          id: "faq-11",
          question: "¿Cómo funciona el mapa de búsqueda?",
          answer:
            "El mapa muestra los estacionamientos disponibles en la zona que estás visualizando. Puedes hacer zoom, arrastrar el mapa y filtrar por precio, disponibilidad y características. Haz clic en un marcador para ver más detalles del estacionamiento.",
        },
        {
          id: "faq-12",
          question: "¿Puedo usar ParkMatch sin conexión a internet?",
          answer:
            "Necesitas conexión a internet para buscar, reservar y gestionar estacionamientos. Sin embargo, una vez confirmada tu reserva, puedes acceder a los detalles incluso sin conexión.",
        },
      ],
    },
  ]

  // Tutoriales
  const tutorials = [
    {
      id: "tutorial-1",
      title: "Cómo registrarse en ParkMatch",
      description: "Aprende a crear tu cuenta y configurar tu perfil",
      image: "/placeholder.svg?height=120&width=200",
      duration: "2:30",
    },
    {
      id: "tutorial-2",
      title: "Reservar un estacionamiento",
      description: "Guía paso a paso para encontrar y reservar estacionamientos",
      image: "/placeholder.svg?height=120&width=200",
      duration: "3:45",
    },
    {
      id: "tutorial-3",
      title: "Publicar tu estacionamiento",
      description: "Cómo ofrecer tu espacio y maximizar tus ganancias",
      image: "/placeholder.svg?height=120&width=200",
      duration: "4:20",
    },
    {
      id: "tutorial-4",
      title: "Gestionar tus reservas",
      description: "Aprende a ver, modificar y cancelar reservas",
      image: "/placeholder.svg?height=120&width=200",
      duration: "2:15",
    },
  ]

  // Documentos
  const documents = [
    {
      id: "doc-1",
      title: "Manual de Usuario",
      description: "Guía completa de uso de ParkMatch",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "doc-2",
      title: "Términos y Condiciones",
      description: "Condiciones legales de uso del servicio",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "doc-3",
      title: "Política de Privacidad",
      description: "Cómo manejamos tus datos personales",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "doc-4",
      title: "Guía de Resolución de Problemas",
      description: "Soluciones a problemas comunes",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Encuentra respuestas a tus preguntas sobre ParkMatch. Explora nuestras guías, tutoriales y documentación.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Buscar en el centro de ayuda..."
            className="pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="space-y-1">
            <h3 className="font-medium text-lg mb-3">Categorías</h3>
            {helpCategories.map((category) => (
              <Link
                key={category.id}
                href={`#${category.id}`}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {category.icon}
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
              <TabsTrigger value="tutoriales">Tutoriales</TabsTrigger>
              <TabsTrigger value="documentos">Documentación</TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                  <CardDescription>Respuestas a las preguntas más comunes sobre ParkMatch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faqs.map((category) => (
                      <div key={category.category} id={category.category}>
                        <h3 className="text-lg font-medium mb-4">
                          {helpCategories.find((c) => c.id === category.category)?.name}
                        </h3>
                        <Accordion type="single" collapsible className="mb-6">
                          {category.questions.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-gray-600">{faq.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutoriales">
              <Card>
                <CardHeader>
                  <CardTitle>Tutoriales en Video</CardTitle>
                  <CardDescription>Aprende a usar ParkMatch con nuestros tutoriales paso a paso</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tutorials.map((tutorial) => (
                      <div key={tutorial.id} className="border rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src={tutorial.image || "/placeholder.svg"}
                            alt={tutorial.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {tutorial.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-500 mb-3">{tutorial.description}</p>
                          <Button variant="outline" size="sm" className="w-full">
                            Ver Tutorial
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentos">
              <Card>
                <CardHeader>
                  <CardTitle>Documentación</CardTitle>
                  <CardDescription>Guías y documentos de referencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <Link
                        key={doc.id}
                        href="#"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-blue-100 p-3 rounded-full mr-4">{doc.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-gray-500">{doc.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">¿No encuentras lo que buscas?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-6">
          Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta o problema que tengas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contactar Soporte
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Solicitar Demostración
          </Button>
        </div>
      </div>
    </div>
  )
}

