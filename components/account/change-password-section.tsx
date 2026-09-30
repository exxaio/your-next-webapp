"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = React.useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  const colors = [
    "",
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ]

  if (!password) return null

  return (
    <div
      className="space-y-1"
      aria-live="polite"
      aria-label={`Password strength: ${labels[strength]}`}
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${i <= strength ? colors[strength] : "bg-muted"
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[strength]}</p>
    </div>
  )
}

interface ChangePasswordSectionProps {
  defaultOpen?: boolean
}

export function ChangePasswordSection({
  defaultOpen = false,
}: ChangePasswordSectionProps = {}) {
  const {
    user,
    changePassword,
    setPassword: setInitialPassword,
    loading,
  } = useAuth()

  const hasPassword =
    user?.providerData.some((p) => p.providerId === "password") ?? false

  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const [currentPw, setCurrentPw] = React.useState("")
  const [newPw, setNewPw] = React.useState("")
  const [confirmPw, setConfirmPw] = React.useState("")
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMsg(null)

    if (newPw.length < 8) {
      setLocalError("New password must be at least 8 characters.")
      return
    }
    if (newPw !== confirmPw) {
      setLocalError("Passwords do not match.")
      return
    }

    try {
      if (hasPassword) {
        if (!currentPw) {
          setLocalError("Please enter your current password.")
          return
        }
        await changePassword(currentPw, newPw)
      } else {
        await setInitialPassword(newPw)
      }
      setSuccessMsg(
        hasPassword
          ? "Password changed successfully."
          : "Password set successfully."
      )
      setCurrentPw("")
      setNewPw("")
      setConfirmPw("")
    } catch (err: any) {
      setLocalError(err?.message ?? "Failed to update password.")
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setLocalError(null)
    }
  }

  return (
    <section aria-labelledby="password-section-heading">
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 id="password-section-heading" className="text-base font-semibold">
              {hasPassword ? "Change Password" : "Set a Password"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {hasPassword
                ? "Update your account password."
                : "Add email & password sign-in to your account."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(!isOpen)}
            className="shrink-0 self-start sm:self-center"
          >
            {isOpen ? "Cancel" : hasPassword ? "Change" : "Set password"}
          </Button>
        </div>

        <CollapsibleContent className="space-y-6 pt-6">
          {localError && (
            <Alert variant="destructive" className="max-w-sm">
              <AlertDescription>{localError}</AlertDescription>
            </Alert>
          )}
          {successMsg && (
            <Alert className="max-w-sm border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
            {hasPassword && (
              <Field>
                <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="new-password">
                {hasPassword ? "New Password" : "Password"}
              </FieldLabel>
              <Input
                id="new-password"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <PasswordStrengthBar password={newPw} />
              <FieldDescription>Minimum 8 characters.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              {confirmPw && newPw !== confirmPw && (
                <FieldError>Passwords do not match.</FieldError>
              )}
            </Field>

            <div className="flex items-center gap-2 pt-1">
              <Button type="submit" size="sm" disabled={loading}>
                {loading
                  ? "Saving…"
                  : hasPassword
                    ? "Change Password"
                    : "Set Password"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
