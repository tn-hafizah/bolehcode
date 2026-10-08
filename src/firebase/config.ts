import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// User's BolehCode web app Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDEffD1LM4jgTCbs_wJKdcprqcW4ahpUYE",
  authDomain: "bolehcode.firebaseapp.com",
  projectId: "bolehcode",
  storageBucket: "bolehcode.firebasestorage.app",
  messagingSenderId: "84444378555",
  appId: "1:84444378555:web:c5bce9c06bb78a76a0409e",
  measurementId: "G-GBFG0NB96D"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

