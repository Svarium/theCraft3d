import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCboLfcL9Y1b2etxF1cHMawReGPxnkZNSk",
  authDomain: "thecraft-9a97d.firebaseapp.com",
  projectId: "thecraft-9a97d",
  storageBucket: "thecraft-9a97d.firebasestorage.app",
  messagingSenderId: "945796503596",
  appId: "1:945796503596:web:027bcf66527382b9d05989",
  measurementId: "G-PK8NMHRQMC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, analytics };
export default app;
