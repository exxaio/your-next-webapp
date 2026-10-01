"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PencilEdit01Icon,
  Tick01Icon,
  Cancel01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

function getInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return "U"
}

export function ProfileSection() {
  const { user, updateDisplayName, loading } = useAuth()

  const [editing, setEditing] = React.useState(false)
  const [nameValue, setNameValue] = React.useState("")
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)

  const startEdit = () => {
    setNameValue(user?.displayName ?? "")
    setLocalError(null)
    setSuccessMsg(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setLocalError(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = nameValue.trim()
    if (!trimmed) {
      setLocalError("Display name cannot be empty.")
      return
    }
    if (trimmed === user?.displayName) {
      setEditing(false)
      return
    }
    setLocalError(null)
    try {
      await updateDisplayName(trimmed)
      setSuccessMsg("Display name updated.")
      setEditing(false)
    } catch (err: any) {
      setLocalError(err?.message ?? "Failed to update display name.")
    }
  }

  const initials = getInitials(user?.displayName, user?.email)

  return (
    <section aria-labelledby="profile-section-heading" className="space-y-6">
      <div>
        <h2 id="profile-section-heading" className="text-base font-semibold">
          Profile
        </h2>
        <p className="text-sm text-muted-foreground">
          Your public profile information.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage
            src={user?.photoURL ?? ""}
            alt={user?.displayName ?? "User avatar"}
          />
          <AvatarFallback className="text-lg font-semibold">
            {initials || (
              <HugeiconsIcon
                icon={UserIcon}
                strokeWidth={1.5}
                className="size-6"
              />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">
            {user?.displayName || "No display name set"}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {successMsg && (
        <Alert className="border-success/30 bg-success/5 text-success">
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Display Name */}
      {editing ? (
        <form onSubmit={handleSave} className="max-w-sm space-y-3">
          <Field>
            <FieldLabel htmlFor="display-name-input">Display Name</FieldLabel>
            <Input
              id="display-name-input"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              disabled={loading}
              autoFocus
              maxLength={64}
              placeholder="Your name"
            />
            <FieldDescription>
              This is the name shown across the application.
            </FieldDescription>
            {localError && <FieldError>{localError}</FieldError>}
          </Field>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={loading}>
              <HugeiconsIcon icon={Tick01Icon} strokeWidth={2} />
              {loading ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={cancelEdit}
              disabled={loading}
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex max-w-sm items-center gap-3">
          <div className="flex-1 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm">
            {user?.displayName || (
              <span className="text-muted-foreground italic">Not set</span>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={startEdit}>
            <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
            Edit
          </Button>
        </div>
      )}

      {/* Email (read-only) */}
      <Field className="max-w-sm">
        <FieldLabel htmlFor="account-email">Email</FieldLabel>
        <Input
          id="account-email"
          type="email"
          value={user?.email ?? ""}
          readOnly
          disabled
          className="cursor-not-allowed"
        />
        <FieldDescription>
          Your email address is managed by your sign-in provider.
        </FieldDescription>
      </Field>
    </section>
  )
}
