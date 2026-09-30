"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PendingLinkState } from "@/hooks/use-auth"
import type { UserCredential } from "firebase/auth"

interface LinkAccountDialogProps {
  open: boolean
  pendingLinkState: PendingLinkState | null
  onLinkWithOAuth: () => Promise<UserCredential>
  onLinkWithPassword: (password: string) => Promise<UserCredential>
  onSuccess: (result: UserCredential) => void
  onCancel: () => void
  loading: boolean
  error: string | null
}

export function LinkAccountDialog({
  open,
  pendingLinkState,
  onLinkWithOAuth,
  onLinkWithPassword,
  onSuccess,
  onCancel,
  loading,
  error,
}: LinkAccountDialogProps) {
  const [password, setPassword] = React.useState("")
  const [showPasswordMode, setShowPasswordMode] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setPassword("")
      setLocalError(null)
      setShowPasswordMode(false)
    }
  }, [open])

  if (!pendingLinkState) {
    return null
  }

  const { email, existingMethods, attemptedProvider } = pendingLinkState
  const attemptedName = attemptedProvider === "github" ? "GitHub" : "Google"

  const hasGoogle = existingMethods.includes("google.com")
  const hasGithub = existingMethods.includes("github.com")
  const hasPassword =
    existingMethods.includes("password") || (!hasGoogle && !hasGithub) // fallback to password if methods empty

  const primaryOAuth = hasGoogle
    ? { id: "google.com", name: "Google" }
    : hasGithub
      ? { id: "github.com", name: "GitHub" }
      : null

  const isPasswordOnly = hasPassword && !primaryOAuth
  const showPasswordInput = isPasswordOnly || showPasswordMode

  const handleOAuthLink = async () => {
    setLocalError(null)
    try {
      const result = await onLinkWithOAuth()
      onSuccess(result)
    } catch (err: any) {
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        err?.code !== "auth/cancelled-popup-request"
      ) {
        setLocalError(
          err?.message || "Failed to link account. Please try again."
        )
      }
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setLocalError("Please enter your account password.")
      return
    }
    setLocalError(null)
    try {
      const result = await onLinkWithPassword(password)
      onSuccess(result)
    } catch (err: any) {
      setLocalError(err?.message || "Incorrect password or linking failed.")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <AlertDialogTitle className="text-center text-lg">
            Connect your {attemptedName} account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm">
            <span className="font-semibold text-foreground">{email}</span> is
            already registered
            {primaryOAuth
              ? ` with ${primaryOAuth.name}`
              : " with email & password"}
            . Sign in to link your {attemptedName} account so you can use either
            method in the future.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {(localError || error) && (
          <Alert variant="destructive" className="my-2">
            <AlertDescription>{localError || error}</AlertDescription>
          </Alert>
        )}

        {showPasswordInput ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="existing-password">
                Account Password
              </FieldLabel>
              <Input
                id="existing-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
                required
              />
            </Field>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Linking..." : `Verify & Link ${attemptedName}`}
              </Button>
              {primaryOAuth && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPasswordMode(false)
                    setLocalError(null)
                  }}
                  disabled={loading}
                >
                  Use {primaryOAuth.name} instead
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-3 py-2">
            {primaryOAuth?.id === "google.com" && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleOAuthLink}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 size-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                {loading
                  ? "Linking..."
                  : `Sign in with Google to Link ${attemptedName}`}
              </Button>
            )}

            {primaryOAuth?.id === "github.com" && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleOAuthLink}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 size-4"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {loading
                  ? "Linking..."
                  : `Sign in with GitHub to Link ${attemptedName}`}
              </Button>
            )}

            {hasPassword && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    setShowPasswordMode(true)
                    setLocalError(null)
                  }}
                  disabled={loading}
                >
                  Verify with password instead
                </Button>
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
