import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

export const firebaseConfig = {
  apiKey: "AIzaSyAXBQG6b0_AKCY63dbQlcecWNKmiLAKjiI",
  authDomain: "daftdoris-cns.firebaseapp.com",
  projectId: "daftdoris-cns",
  storageBucket: "daftdoris-cns.appspot.com",
  messagingSenderId: "785842200541",
  appId: "1:785842200541:web:8b34412472e7aa2feaa034",
  measurementId: "G-CCEL9G8W59",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
export const analytics = getAnalytics(app)
