"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { cn } from "cn"

import { Link, useRouter } from "@/i18n/routing"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
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
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import { LinkAccountDialog } from "@/components/link-account-dialog"

type Step = "email" | "details"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const t = useTranslations("Signup")
  const {
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    linkWithOAuthProvider,
    linkWithPassword,
    pendingLinkState,
    clearPendingLink,
    error,
    loading,
    clearError,
  } = useAuth()

  const [step, setStep] = React.useState<Step>("email")
  const [animating, setAnimating] = React.useState(false)

  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)
  const [passwordStrengthText, setPasswordStrengthText] = React.useState("")
  const [validationError, setValidationError] = React.useState("")

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

  // Calculate password strength
  React.useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordStrengthText("")
      return
    }

    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    if (checks.length) strength += 20
    if (checks.lowercase) strength += 20
    if (checks.uppercase) strength += 20
    if (checks.number) strength += 20
    if (checks.special) strength += 20

    setPasswordStrength(strength)

    if (strength <= 40) setPasswordStrengthText(t("strengthWeak"))
    else if (strength <= 60) setPasswordStrengthText(t("strengthFair"))
    else if (strength <= 80) setPasswordStrengthText(t("strengthGood"))
    else setPasswordStrengthText(t("strengthStrong"))
  }, [password, t])

  const handleEmailNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidationError("")
    if (!isValidEmail(email)) {
      setValidationError(t("invalidEmail"))
      return
    }
    setAnimating(true)
    setTimeout(() => {
      setStep("details")
      setAnimating(false)
    }, 220)
  }

  const handleBack = () => {
    setAnimating(true)
    setTimeout(() => {
      setStep("email")
      setAnimating(false)
      setValidationError("")
      clearError()
    }, 220)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setValidationError("")

    if (!fullName.trim()) {
      setValidationError(t("nameRequired"))
      return
    }

    if (password.length < 8) {
      setValidationError(t("passwordTooShort"))
      return
    }

    if (password !== confirmPassword) {
      setValidationError(t("passwordsDoNotMatch"))
      return
    }

    if (!acceptedTerms) {
      setValidationError(t("termsRequired"))
      return
    }

    try {
      await signUpWithEmail(email, password, fullName)
      router.push("/dashboard")
    } catch (err: unknown) {
      console.error("Sign up error:", err)
    }
  }

  const handleGoogleSignIn = async () => {
    clearError()
    setValidationError("")
    try {
      const res = await signInWithGoogle()
      if (res) router.push("/dashboard")
    } catch (err) {
      console.error("Google sign in error:", err)
    }
  }

  const handleGithubSignIn = async () => {
    clearError()
    setValidationError("")
    try {
      const res = await signInWithGithub()
      if (res) router.push("/dashboard")
    } catch (err) {
      console.error("GitHub sign in error:", err)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 40) return "bg-red-500"
    if (passwordStrength <= 60) return "bg-orange-500"
    if (passwordStrength <= 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border/60 shadow-xl">
        {/* Step indicator */}
        <div className="flex h-1 w-full overflow-hidden rounded-t-xl bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: step === "email" ? "50%" : "100%" }}
          />
        </div>

        <CardHeader className="px-6 pt-6 pb-2 text-center">
          <div
            className={cn(
              "transition-all duration-220 ease-in-out",
              animating
                ? "translate-y-1 opacity-0"
                : "translate-y-0 opacity-100"
            )}
          >
            <CardTitle className="text-2xl font-bold tracking-tight">
              {step === "email" ? t("createAccount") : t("almostThere")}
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm">
              {step === "email"
                ? t("description")
                : t("detailsDescription", { email })}
            </CardDescription>
          </div>

          {/* Step label */}
          <p className="mt-3 text-xs font-medium tracking-widest text-muted-foreground/70 uppercase">
            {t("stepLabel", { current: step === "email" ? 1 : 2, total: 2 })}
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {/* ─── STEP 1: Email + Social ─── */}
          <div
            className={cn(
              "transition-all duration-220 ease-in-out",
              step === "email" && !animating
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none absolute translate-y-2 opacity-0",
              step !== "email" && "hidden"
            )}
          >
            <form onSubmit={handleEmailNext} noValidate>
              <FieldGroup>
                {(error || validationError) && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error || validationError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Social Buttons */}
                <Field>
                  <Button
                    id="signup-google-btn"
                    variant="outline"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="gap-2 font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    {t("signupWithGoogle")}
                  </Button>
                  <Button
                    id="signup-github-btn"
                    variant="outline"
                    type="button"
                    onClick={handleGithubSignIn}
                    disabled={loading}
                    className="gap-2 font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    {t("signupWithGithub")}
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  {t("orContinueWith")}
                </FieldSeparator>

                {/* Email Field */}
                <Field>
                  <FieldLabel htmlFor="signup-email">{t("email")}</FieldLabel>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (validationError) setValidationError("")
                    }}
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
                    required
                    className="h-11"
                  />
                </Field>

                {/* Next Button */}
                <Field>
                  <Button
                    id="signup-next-btn"
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="h-11 text-sm font-semibold tracking-wide"
                  >
                    {t("next")} →
                  </Button>
                  <FieldDescription className="text-center text-xs">
                    {t("haveAccount")}{" "}
                    <Link
                      href="/login"
                      className="font-medium underline underline-offset-4 transition-colors hover:text-primary"
                    >
                      {t("signIn")}
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>

          {/* ─── STEP 2: Full details form ─── */}
          <div
            className={cn(
              "transition-all duration-220 ease-in-out",
              step === "details" && !animating
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0",
              step !== "details" && "hidden"
            )}
          >
            {/* Email summary chip */}
            {step === "details" && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-border/70 bg-muted/50 px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5 shrink-0 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="flex-1 truncate text-xs font-medium text-foreground">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={handleBack}
                  className="ml-1 shrink-0 text-xs text-primary underline-offset-2 transition-colors hover:underline"
                  aria-label={t("changeEmail")}
                >
                  {t("change")}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                {(error || validationError) && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error || validationError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Full Name */}
                <Field>
                  <FieldLabel htmlFor="signup-name">{t("fullName")}</FieldLabel>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    autoComplete="name"
                    autoFocus
                    required
                    className="h-11"
                  />
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="signup-password">
                    {t("password")}
                  </FieldLabel>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    className="h-11"
                  />
                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t("passwordStrength")}
                        </span>
                        <span
                          className={cn(
                            "font-semibold",
                            passwordStrength <= 40 && "text-red-500",
                            passwordStrength > 40 &&
                              passwordStrength <= 60 &&
                              "text-orange-500",
                            passwordStrength > 60 &&
                              passwordStrength <= 80 &&
                              "text-yellow-500",
                            passwordStrength > 80 && "text-green-500"
                          )}
                        >
                          {passwordStrengthText}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className="h-1.5">
                        <ProgressTrack>
                          <ProgressIndicator
                            className={cn(
                              getPasswordStrengthColor(),
                              "transition-all duration-300"
                            )}
                          />
                        </ProgressTrack>
                      </Progress>
                    </div>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field>
                  <FieldLabel htmlFor="signup-confirm-password">
                    {t("confirmPassword")}
                  </FieldLabel>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    className="h-11"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <FieldDescription className="text-xs text-red-500">
                      {t("passwordsDoNotMatch")}
                    </FieldDescription>
                  )}
                </Field>

                {/* Terms Checkbox */}
                <Field>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <input
                      type="checkbox"
                      id="signup-terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      disabled={loading}
                      className="mt-0.5 size-4 rounded border-border accent-primary"
                    />
                    <label
                      htmlFor="signup-terms"
                      className="cursor-pointer text-xs leading-relaxed text-muted-foreground"
                    >
                      {t("acceptTerms")}{" "}
                      <a
                        href="#"
                        className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                      >
                        {t("termsOfService")}
                      </a>{" "}
                      {t("and")}{" "}
                      <a
                        href="#"
                        className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                      >
                        {t("privacyPolicy")}
                      </a>
                    </label>
                  </div>
                </Field>

                {/* Submit */}
                <Field>
                  <Button
                    id="signup-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="h-11 text-sm font-semibold tracking-wide"
                  >
                    {loading ? t("loading") : t("createAccount")}
                  </Button>
                  <FieldDescription className="text-center text-xs">
                    {t("haveAccount")}{" "}
                    <Link
                      href="/login"
                      className="font-medium underline underline-offset-4 transition-colors hover:text-primary"
                    >
                      {t("signIn")}
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </CardContent>
      </Card>

      <LinkAccountDialog
        open={!!pendingLinkState}
        pendingLinkState={pendingLinkState}
        onLinkWithOAuth={linkWithOAuthProvider}
        onLinkWithPassword={linkWithPassword}
        onSuccess={() => router.push("/dashboard")}
        onCancel={clearPendingLink}
        loading={loading}
        error={error}
      />
    </div>
  )
}
