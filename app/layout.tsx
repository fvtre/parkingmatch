import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { RouteGuard } from "@/components/routeguard"
import TabBar from "@/components/tapbar"
import { Toaster } from "@/components/toaster"
import BackgroundPattern from "@/components/backgroundpattern"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ParkMatch - Encuentra estacionamiento fácilmente",
  description: "Plataforma para encontrar y reservar estacionamientos en tiempo real",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <RouteGuard>
              <div className="flex min-h-screen flex-col relative">
                <BackgroundPattern />
                <TabBar />
                <main className="flex-1 pb-20 md:pb-0 relative z-10">{children}</main>
                <footer className="bg-white/80 backdrop-blur-sm py-6 border-t relative z-10">
                  <div className="container mx-auto text-center text-gray-600">
                    <p>© {new Date().getFullYear()} ParkMatch. Todos los derechos reservados.</p>
                  </div>
                </footer>
              </div>
            </RouteGuard>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
