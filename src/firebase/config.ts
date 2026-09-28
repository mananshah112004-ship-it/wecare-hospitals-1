import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAglLado3RSJ1P3wYuQyq_GdMC2yb21kfY",
  authDomain: "wecare-hospitals-2937a.firebaseapp.com",
  projectId: "wecare-hospitals-2937a",
  storageBucket: "wecare-hospitals-2937a.firebasestorage.app",
  messagingSenderId: "1098362836123",
  appId: "1:1098362836123:web:e0e6f956ddcbdf14c0e23e"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
