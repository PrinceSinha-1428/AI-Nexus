import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-nexus-f9bd7.firebaseapp.com",
  projectId: "ai-nexus-f9bd7",
  storageBucket: "ai-nexus-f9bd7.firebasestorage.app",
  messagingSenderId: "679501442490",
  appId: "1:679501442490:web:d5b3399055fc16863f8183",
  measurementId: "G-YTBK5MWF70"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
