// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDla1p2lTB5mGCqz6CSW8U_DC6-VMwffsk",
    authDomain: "parkingmatch-95e32.firebaseapp.com",
    projectId: "parkingmatch-95e32",
    storageBucket: "parkingmatch-95e32.firebasestorage.app",
    messagingSenderId: "784445877686",
    appId: "1:784445877686:web:66e7a139483188760be517",
    measurementId: "G-C6RHNHXP99"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics solo en el cliente
let analytics = null;
if (typeof window !== 'undefined') {
  // Importación dinámica de analytics
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(error => {
    console.error('Error loading analytics:', error);
  });
}
// Exportar servicios
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
export default app;
