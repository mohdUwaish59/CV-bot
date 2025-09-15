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
  console.log("[v0] Firebase config validation:", firebaseConfig)
  const isValid = Object.entries(firebaseConfig).every(([key, value]) => {
    const valid = value && value !== "undefined" && value.trim() !== ""
    if (!valid) {
      console.log(`[v0] Invalid Firebase config for ${key}:`, value)
    }
    return valid
  })
  console.log("[v0] Firebase config is valid:", isValid)
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
    console.log("[v0] Firebase app: Server-side rendering, returning null")
    return null
  }

  if (app) {
    console.log("[v0] Firebase app: Using cached instance")
    return app
  }

  if (!isConfigValid()) {
    console.error("[v0] Firebase configuration is invalid. Please check your environment variables.")
    return null
  }

  try {
    console.log("[v0] Firebase app: Initializing new instance")
    const existingApps = getApps()
    console.log("[v0] Existing Firebase apps:", existingApps.length)

    if (existingApps.length === 0) {
      app = initializeApp(firebaseConfig)
      console.log("[v0] Firebase app: Successfully initialized new app")
    } else {
      app = existingApps[0]
      console.log("[v0] Firebase app: Using existing app")
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
    console.log("[v0] Firebase auth: Server-side rendering, returning null")
    return null
  }

  if (auth) {
    console.log("[v0] Firebase auth: Using cached instance")
    return auth
  }

  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) {
    console.log("[v0] Firebase auth: No app available")
    return null
  }

  try {
    console.log("[v0] Firebase auth: Initializing auth service")
    auth = getAuth(firebaseApp)
    console.log("[v0] Firebase auth: Successfully initialized")
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
    console.log("[v0] Firebase firestore: Initializing")
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
    console.log("[v0] Firebase storage: Initializing")
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
    console.log("[v0] Google provider: Initializing")
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
