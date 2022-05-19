import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {
  getFirestore,
  connectFirestoreEmulator,
  setLogLevel,
  initializeFirestore,
} from "firebase/firestore"

export const firebaseConfig = {
  apiKey: "AIzaSyBvk41kRWgCj9cQ2Bn_WRcxuULTcV3TwqI",
  authDomain: "newsroom-bec1a.firebaseapp.com",
  projectId: "newsroom-bec1a",
  storageBucket: "newsroom-bec1a.appspot.com",
  messagingSenderId: "479379145905",
  appId: "1:479379145905:web:8ceabb2b56f2d542190e90",
  measurementId: "G-JWJXD9J650",
  // experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: true,
  timeout: 5000,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const initialdb = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
})
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(initialdb, "localhost", 8082)
  setLogLevel("debug")
}
export const db = getFirestore()

export const analytics = getAnalytics(app)
