"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { getFirebaseAuth, getGoogleProvider } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isFirebaseReady: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  isFirebaseReady: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const auth = getFirebaseAuth()

      if (!auth) {
        console.error("[v0] Firebase auth not initialized. Please check your environment variables.")
        setLoading(false)
        return
      }

      setIsFirebaseReady(true)

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setLoading(false)
      })

      return () => {
        unsubscribe()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth()
    const provider = getGoogleProvider()

    if (!auth || !provider) {
      console.error("Firebase auth not initialized. Please check your environment variables.")
      return
    }

    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const logout = async () => {
    const auth = getFirebaseAuth()

    if (!auth) {
      console.error("Firebase auth not initialized. Please check your environment variables.")
      return
    }

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
    isFirebaseReady,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
