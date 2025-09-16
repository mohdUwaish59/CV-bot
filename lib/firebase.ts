import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate configuration
const isConfigValid = () => {
  const isValid = Object.entries(firebaseConfig).every(([key, value]) => {
    const valid = value && value !== "undefined" && value.trim() !== ""
    if (!valid) {
    }
    return valid
  })
  return isValid
}

// Cached instances
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null
let googleProvider: GoogleAuthProvider | null = null

// Initialize Firebase app only when needed
const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") {
    return null
  }

  if (app) {
    return app
  }

  if (!isConfigValid()) {
    console.error("[v0] Firebase configuration is invalid. Please check your environment variables.")
    return null
  }

  try {
    const existingApps = getApps()

    if (existingApps.length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = existingApps[0]
    }
    return app
  } catch (error) {
    console.error("[v0] Firebase app initialization error:", error)
    return null
  }
}

// Get Firebase Auth instance
export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") {
    return null
  }

  if (auth) {
    return auth
  }

  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) {
    return null
  }

  try {
    auth = getAuth(firebaseApp)
    return auth
  } catch (error) {
    console.error("[v0] Firebase Auth initialization error:", error)
    return null
  }
}

// Get Firestore instance
export const getFirebaseFirestore = (): Firestore | null => {
  if (typeof window === "undefined") return null

  if (db) return db

  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null

  try {
    db = getFirestore(firebaseApp)
    return db
  } catch (error) {
    console.error("[v0] Firebase Firestore initialization error:", error)
    return null
  }
}

// Get Storage instance
export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (typeof window === "undefined") return null

  if (storage) return storage

  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null

  try {
    storage = getStorage(firebaseApp)
    return storage
  } catch (error) {
    console.error("[v0] Firebase Storage initialization error:", error)
    return null
  }
}

// Get Google Provider
export const getGoogleProvider = (): GoogleAuthProvider | null => {
  if (typeof window === "undefined") return null

  if (googleProvider) return googleProvider

  try {
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })
    return googleProvider
  } catch (error) {
    console.error("[v0] Google Provider initialization error:", error)
    return null
  }
}

// Legacy exports for backward compatibility (but these will be null initially)
export { auth, db, storage, googleProvider }
export default app
