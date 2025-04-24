"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { auth, googleAuthProvider, facebookAuthProvider } from "@/lib/firebase"

// Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null
  currentUser: User | null // Alias para user para mantener compatibilidad
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>
  signin: (email: string, password: string) => Promise<UserCredential>
  login: (email: string, password: string) => Promise<UserCredential> // Alias para signin
  signInWithGoogle: () => Promise<UserCredential>
  signInWithFacebook: () => Promise<UserCredential>
  logout: () => Promise<void>
}

// Crear el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType>({
  user: null,
  currentUser: null,
  loading: true,
  signup: async () => {
    throw new Error("AuthContext not initialized")
  },
  signin: async () => {
    throw new Error("AuthContext not initialized")
  },
  login: async () => {
    throw new Error("AuthContext not initialized")
  },
  signInWithGoogle: async () => {
    throw new Error("AuthContext not initialized")
  },
  signInWithFacebook: async () => {
    throw new Error("AuthContext not initialized")
  },
  logout: async () => {
    throw new Error("AuthContext not initialized")
  },
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Configurar persistencia al cargar el componente
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
        console.log("Persistencia configurada correctamente")
      } catch (error) {
        console.error("Error al configurar persistencia:", error)
      }
    }

    setupPersistence()
  }, [])

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    console.log("Configurando listener de autenticación")
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Estado de autenticación cambiado:", currentUser ? "Usuario autenticado" : "No autenticado")
      setUser(currentUser)
      setLoading(false)
    })

    // Limpiar el listener al desmontar
    return () => {
      console.log("Limpiando listener de autenticación")
      unsubscribe()
    }
  }, [])

  const signup = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })
      setUser(userCredential.user)
      return userCredential
    } catch (error) {
      console.error("Error en signup:", error)
      throw error
    }
  }

  const signin = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      return userCredential
    } catch (error) {
      console.error("Error en signin:", error)
      throw error
    }
  }

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider)
      setUser(userCredential.user)
      return userCredential
    } catch (error) {
      console.error("Error en signInWithGoogle:", error)
      throw error
    }
  }

  const signInWithFacebook = async (): Promise<UserCredential> => {
    try {
      const userCredential = await signInWithPopup(auth, facebookAuthProvider)
      setUser(userCredential.user)
      return userCredential
    } catch (error) {
      console.error("Error en signInWithFacebook:", error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Error en logout:", error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    currentUser: user, // Alias para mantener compatibilidad
    loading,
    signup,
    signin,
    login: signin, // Alias para mantener compatibilidad
    signInWithGoogle,
    signInWithFacebook,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}
