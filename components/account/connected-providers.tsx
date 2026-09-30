"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
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

// ── Provider metadata ──────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: "google.com",
    name: "Google",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="size-4"
        aria-hidden
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
    ),
    providerKey: "google" as const,
  },
  {
    id: "github.com",
    name: "GitHub",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
        aria-hidden
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    providerKey: "github" as const,
  },
  {
    id: "password",
    name: "Email & Password",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden
      >
        <rect width="16" height="12" x="4" y="6" rx="2" />
        <path d="m4 8 8 5 8-5" />
      </svg>
    ),
    providerKey: null,
  },
]

// ── Component ──────────────────────────────────────────────────────────────────

export function ConnectedProviders() {
  const { user, linkProvider, unlinkProvider, loading } = useAuth()

  const [localError, setLocalError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
  const [unlinkTarget, setUnlinkTarget] = React.useState<
    (typeof PROVIDERS)[number] | null
  >(null)

  const linkedIds = React.useMemo(
    () => new Set(user?.providerData.map((p) => p.providerId) ?? []),
    [user]
  )

  const linkedCount = linkedIds.size

  const handleLink = async (provider: "google" | "github") => {
    setLocalError(null)
    setSuccessMsg(null)
    try {
      await linkProvider(provider)
      setSuccessMsg(
        `${provider === "google" ? "Google" : "GitHub"} linked successfully.`
      )
    } catch (err: any) {
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        err?.code !== "auth/cancelled-popup-request"
      ) {
        setLocalError(err?.message ?? "Failed to link provider.")
      }
    }
  }

  const confirmUnlink = async () => {
    if (!unlinkTarget) return
    setLocalError(null)
    setSuccessMsg(null)
    try {
      await unlinkProvider(unlinkTarget.id)
      setSuccessMsg(`${unlinkTarget.name} unlinked.`)
    } catch (err: any) {
      setLocalError(err?.message ?? "Failed to unlink provider.")
    } finally {
      setUnlinkTarget(null)
    }
  }

  return (
    <section aria-labelledby="providers-section-heading" className="space-y-6">
      <div>
        <h2 id="providers-section-heading" className="text-base font-semibold">
          Connected Sign-in Methods
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage the sign-in methods linked to your account.
        </p>
      </div>

      {localError && (
        <Alert variant="destructive">
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}
      {successMsg && (
        <Alert className="border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
          <AlertDescription>
            {successMsg}
          </AlertDescription>
        </Alert>
      )}

      <div className="divide-y divide-border rounded-lg border border-border/80 bg-card/75 dark:bg-card/50 backdrop-blur-xs">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedIds.has(provider.id)
          const canUnlink = isLinked && linkedCount > 1
          const canLink = !isLinked && provider.providerKey !== null

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-foreground">{provider.icon}</span>
                <div>
                  <p className="text-sm font-medium">{provider.name}</p>
                  {isLinked && (
                    <p className="text-xs text-muted-foreground">
                      {user?.providerData.find(
                        (p) => p.providerId === provider.id
                      )?.email ??
                        user?.email ??
                        "Connected"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLinked && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
                    Connected
                  </span>
                )}
                {canUnlink && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUnlinkTarget(provider)}
                    disabled={loading}
                  >
                    Unlink
                  </Button>
                )}
                {canLink && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLink(provider.providerKey!)}
                    disabled={loading}
                  >
                    {loading ? "Linking…" : "Link"}
                  </Button>
                )}
                {!isLinked && provider.providerKey === null && (
                  <span className="text-xs text-muted-foreground">
                    Not connected
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {linkedCount === 1 && (
        <p className="text-xs text-muted-foreground">
          You must have at least one sign-in method. Link another provider
          before unlinking the current one.
        </p>
      )}

      {/* Unlink confirm dialog */}
      <AlertDialog
        open={!!unlinkTarget}
        onOpenChange={(open) => !open && setUnlinkTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink {unlinkTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer be able to sign in using {unlinkTarget?.name}.
              You can always re-link it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnlinkTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmUnlink}
              disabled={loading}
            >
              {loading ? "Unlinking…" : "Unlink"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
