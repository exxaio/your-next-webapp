"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { LogoutIcon, Delete01Icon } from "@hugeicons/core-free-icons"

export function DangerZone() {
  const { user, logout, deleteAccount, loading } = useAuth()
  const router = useRouter()

  const hasPassword =
    user?.providerData.some((p) => p.providerId === "password") ?? false

  // Sign out all devices
  const [signOutOpen, setSignOutOpen] = React.useState(false)
  const [signOutError, setSignOutError] = React.useState<string | null>(null)

  const handleSignOutAll = async () => {
    setSignOutError(null)
    try {
      // Force token refresh (revokes current session) then sign out
      await user?.getIdToken(true)
      await logout()
      router.push("/login")
    } catch (err: any) {
      setSignOutError(err?.message ?? "Failed to sign out.")
    }
  }

  // Delete account
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletePassword, setDeletePassword] = React.useState("")
  const [deleteError, setDeleteError] = React.useState<string | null>(null)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteError(null)
    try {
      await deleteAccount(hasPassword ? deletePassword : undefined)
      router.push("/login")
    } catch (err: any) {
      setDeleteError(err?.message ?? "Failed to delete account.")
    }
  }

  const openDelete = () => {
    setDeletePassword("")
    setDeleteError(null)
    setDeleteOpen(true)
  }

  return (
    <section aria-labelledby="danger-zone-heading" className="space-y-6">
      <div>
        <h2
          id="danger-zone-heading"
          className="text-base font-semibold text-destructive"
        >
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          Irreversible actions. Please proceed carefully.
        </p>
      </div>

      <div className="divide-y divide-destructive/15 rounded-lg border border-destructive/30 bg-card/75 backdrop-blur-xs dark:bg-card/50">
        {/* Sign out all devices */}
        <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Sign out of all devices</p>
            <p className="text-xs text-muted-foreground">
              Invalidates all active sessions including this one.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSignOutError(null)
              setSignOutOpen(true)
            }}
            disabled={loading}
            className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
            Sign out everywhere
          </Button>
        </div>

        {/* Delete account */}
        <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={openDelete}
            disabled={loading}
            className="shrink-0"
          >
            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
            Delete account
          </Button>
        </div>
      </div>

      {signOutError && (
        <Alert variant="destructive">
          <AlertDescription>{signOutError}</AlertDescription>
        </Alert>
      )}

      {/* Sign out confirm */}
      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              All active sessions will be terminated. You will need to sign in
              again on each device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleSignOutAll}
              disabled={loading}
            >
              {loading ? "Signing out…" : "Sign out everywhere"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete account confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. All your data will
              be deleted immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form
            id="delete-account-form"
            onSubmit={handleDelete}
            className="space-y-3 pt-1"
          >
            {hasPassword && (
              <Field>
                <FieldLabel htmlFor="delete-confirm-password">
                  Enter your password to confirm
                </FieldLabel>
                <Input
                  id="delete-confirm-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                  disabled={loading}
                />
                {deleteError && <FieldError>{deleteError}</FieldError>}
              </Field>
            )}
            {!hasPassword && deleteError && (
              <Alert variant="destructive">
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
          </form>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              type="submit"
              form="delete-account-form"
              disabled={loading || (hasPassword && !deletePassword)}
            >
              {loading ? "Deleting…" : "Delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
