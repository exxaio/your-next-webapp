"use client"

import { useEffect, useState } from "react"
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  type UserCredential,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  signInWithApple: () => Promise<UserCredential>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setError(error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    setError(null)
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }

      return result
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope("profile")
      provider.addScope("email")
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    setError(null)
    setLoading(true)
    try {
      const provider = new OAuthProvider("apple.com")
      provider.addScope("email")
      provider.addScope("name")
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Apple")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await signOut(auth)
    } catch (err: any) {
      setError(err.message || "Failed to log out")
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email")
      throw err
    }
  }

  const clearError = () => setError(null)

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    logout,
    resetPassword,
    clearError,
  }
}
