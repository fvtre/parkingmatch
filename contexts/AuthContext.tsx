"use client"

// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  UserCredential,
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleAuthProvider, facebookAuthProvider } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string, name: string) => Promise<User>;
  login: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithFacebook: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  

  // Registrar usuario
  const signup = async (email: string, password: string, name: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return result.user;
  };

  // Iniciar sesión
  const login = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = (): Promise<UserCredential> => {
    return signInWithPopup(auth, googleAuthProvider)
  }

  const signInWithFacebook = (): Promise<UserCredential> => {
    return signInWithPopup(auth, facebookAuthProvider);
  };

  // Cerrar sesión
  const logout = (): Promise<void> => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    signInWithFacebook,
    logout
  };
  

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
  

};