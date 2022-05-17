import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

export const firebaseConfig = {
  apiKey: "AIzaSyBvk41kRWgCj9cQ2Bn_WRcxuULTcV3TwqI",
  authDomain: "newsroom-bec1a.firebaseapp.com",
  projectId: "newsroom-bec1a",
  storageBucket: "newsroom-bec1a.appspot.com",
  messagingSenderId: "479379145905",
  appId: "1:479379145905:web:8ceabb2b56f2d542190e90",
  measurementId: "G-JWJXD9J650",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
connectFirestoreEmulator(db, "localhost", 8080)

export const analytics = getAnalytics(app)
// import { setLogLevel } from "firebase/firestore"
// setLogLevel("debug")
