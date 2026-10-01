"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { cn } from "cn"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Mail01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"

import { Link } from "@/i18n/routing"
import { useAuth } from "@/hooks/use-auth"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("ForgotPassword")
  const { resetPassword, loading, error, clearError } = useAuth()

  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [countdown, setCountdown] = React.useState(0)

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    clearError()

    try {
      await resetPassword(email)
      setSubmitted(true)
      setCountdown(60)
    } catch (err) {
      console.error("Password reset error:", err)
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || !email) return
    clearError()

    try {
      await resetPassword(email)
      setCountdown(60)
    } catch (err) {
      console.error("Resend reset email error:", err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border/60 shadow-xl">
        <CardHeader className="px-6 pt-6 pb-2 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <HugeiconsIcon
              icon={submitted ? CheckmarkCircle01Icon : Mail01Icon}
              strokeWidth={2}
              className="size-6"
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {submitted ? t("successTitle") : t("title")}
          </CardTitle>
          <CardDescription className="mt-1.5 text-sm">
            {submitted ? t("successDescription", { email }) : t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {submitted ? (
            <div className="flex flex-col gap-4 pt-2">
              <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-center text-xs text-muted-foreground">
                <p>{t("resendPrompt")}</p>
                {countdown > 0 ? (
                  <p className="mt-1 font-medium text-foreground">
                    {t("resendCountdown", { seconds: countdown })}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="mt-1 font-semibold text-primary underline underline-offset-4 transition-colors hover:opacity-80"
                  >
                    {t("resendLink")}
                  </button>
                )}
              </div>

              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-full gap-2 text-sm font-semibold"
                )}
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {t("backToSignIn")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="reset-email">{t("email")}</FieldLabel>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    required
                    className="h-11"
                  />
                </Field>

                <Field>
                  <Button
                    id="forgot-password-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="h-11 text-sm font-semibold tracking-wide"
                  >
                    {loading ? t("sending") : t("sendResetLink")}
                  </Button>
                  <FieldDescription className="text-center text-xs">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                      {t("backToSignIn")}
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
