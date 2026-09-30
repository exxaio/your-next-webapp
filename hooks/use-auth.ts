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
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  type OAuthCredential,
  type UserCredential,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

/** Maps Firebase Auth error codes to user-friendly messages. */
function getAuthErrorMessage(err: any): string {
  const code: string = err?.code ?? ""
  switch (code) {
    case "auth/account-exists-with-different-credential":
      return ""
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again."
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment and try again."
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead."
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password."
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return ""
    default:
      return err?.message || "An unexpected error occurred. Please try again."
  }
}

export interface PendingLinkState {
  email: string
  existingMethods: string[]
  pendingCredential: OAuthCredential
  attemptedProvider: "github" | "google"
}

export interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  pendingLinkState: PendingLinkState | null
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential | undefined>
  signInWithGithub: () => Promise<UserCredential | undefined>
  linkWithOAuthProvider: () => Promise<UserCredential>
  linkWithPassword: (password: string) => Promise<UserCredential>
  clearPendingLink: () => void
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingLinkState, setPendingLinkState] =
    useState<PendingLinkState | null>(null)

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

  const handleOAuthConflict = async (
    err: any,
    attemptedProvider: "github" | "google"
  ) => {
    const email: string | undefined = err?.customData?.email || err?.email
    const pendingCredential =
      attemptedProvider === "github"
        ? GithubAuthProvider.credentialFromError(err)
        : GoogleAuthProvider.credentialFromError(err)

    if (!pendingCredential || !email) {
      setError(
        "This email is linked to a different sign-in method. Please sign in with that method."
      )
      return
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email)
      setPendingLinkState({
        email,
        existingMethods: methods,
        pendingCredential,
        attemptedProvider,
      })
    } catch {
      setPendingLinkState({
        email,
        existingMethods: [],
        pendingCredential,
        attemptedProvider,
      })
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (err: any) {
      const msg = getAuthErrorMessage(err)
      if (msg) setError(msg)
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
      if (err?.code === "auth/account-exists-with-different-credential") {
        await handleOAuthConflict(err, "google")
        return undefined
      }
      const msg = getAuthErrorMessage(err)
      if (msg) setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithGithub = async () => {
    setError(null)
    setLoading(true)
    try {
      const provider = new GithubAuthProvider()
      provider.addScope("user:email")
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (err: any) {
      if (err?.code === "auth/account-exists-with-different-credential") {
        await handleOAuthConflict(err, "github")
        return undefined
      }
      const msg = getAuthErrorMessage(err)
      if (msg) setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const linkWithOAuthProvider = async (): Promise<UserCredential> => {
    if (!pendingLinkState) {
      throw new Error("No pending link state")
    }
    const { existingMethods, pendingCredential } = pendingLinkState

    setError(null)
    setLoading(true)
    try {
      const provider = existingMethods.includes("google.com")
        ? new GoogleAuthProvider()
        : new GithubAuthProvider()

      const result = await signInWithPopup(auth, provider)
      await linkWithCredential(result.user, pendingCredential)
      setPendingLinkState(null)
      return result
    } catch (err: any) {
      const msg = getAuthErrorMessage(err)
      if (msg) setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const linkWithPassword = async (
    password: string
  ): Promise<UserCredential> => {
    if (!pendingLinkState) {
      throw new Error("No pending link state")
    }
    const { email, pendingCredential } = pendingLinkState

    setError(null)
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await linkWithCredential(result.user, pendingCredential)
      setPendingLinkState(null)
      return result
    } catch (err: any) {
      const msg = getAuthErrorMessage(err)
      if (msg) setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearPendingLink = () => {
    setPendingLinkState(null)
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
    pendingLinkState,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    linkWithOAuthProvider,
    linkWithPassword,
    clearPendingLink,
    logout,
    resetPassword,
    clearError,
  }
}
