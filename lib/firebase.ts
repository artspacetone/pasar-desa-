import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi asli Anda dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBNeNPx6YXvPzCId7aHbI335d7cZvOHUmY",
  authDomain: "desacurugbadak-55c25.firebaseapp.com",
  projectId: "desacurugbadak-55c25",
  storageBucket: "desacurugbadak-55c25.firebasestorage.app",
  messagingSenderId: "720596175681",
  appId: "1:720596175681:web:8f44e0081326472792efc0",
  measurementId: "G-CQ2QKZM8TH"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Database Firestore
export const db = getFirestore(app);