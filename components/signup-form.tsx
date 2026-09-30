"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { cn } from "cn"

import { useRouter } from "@/i18n/routing"
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

  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)
  const [passwordStrengthText, setPasswordStrengthText] = React.useState("")
  const [validationError, setValidationError] = React.useState("")

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

    // Calculate strength
    if (checks.length) strength += 20
    if (checks.lowercase) strength += 20
    if (checks.uppercase) strength += 20
    if (checks.number) strength += 20
    if (checks.special) strength += 20

    setPasswordStrength(strength)

    // Set strength text
    if (strength <= 40) setPasswordStrengthText("Weak")
    else if (strength <= 60) setPasswordStrengthText("Fair")
    else if (strength <= 80) setPasswordStrengthText("Good")
    else setPasswordStrengthText("Strong")
  }, [password])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setValidationError("")

    // Validation
    if (!fullName.trim()) {
      setValidationError("Please enter your full name")
      return
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    if (!acceptedTerms) {
      setValidationError("Please accept the terms and conditions")
      return
    }

    try {
      await signUpWithEmail(email, password, fullName)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Sign up error:", err)
      // Error is handled by useAuth
    }
  }

  const handleGoogleSignIn = async () => {
    clearError()
    setValidationError("")
    try {
      const res = await signInWithGoogle()
      if (res) {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Google sign in error:", err)
    }
  }

  const handleGithubSignIn = async () => {
    clearError()
    setValidationError("")
    try {
      const res = await signInWithGithub()
      if (res) {
        router.push("/dashboard")
      }
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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("createAccount")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {(error || validationError) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error || validationError}
                  </AlertDescription>
                </Alert>
              )}

              {/* OAuth Buttons */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t("signupWithGoogle")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t("signupWithGithub")}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {t("orContinueWith")}
              </FieldSeparator>

              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="name">{t("fullName")}</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("passwordStrength")}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
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
                          className={cn(getPasswordStrengthColor())}
                        />
                      </ProgressTrack>
                    </Progress>
                  </div>
                )}
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("confirmPassword")}
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <FieldDescription className="text-red-500">
                    {t("passwordsDoNotMatch")}
                  </FieldDescription>
                )}
              </Field>

              {/* Terms Checkbox */}
              <Field>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={loading}
                    className="mt-1 size-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    {t("acceptTerms")}{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {t("termsOfService")}
                    </a>{" "}
                    {t("and")}{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {t("privacyPolicy")}
                    </a>
                  </label>
                </div>
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? t("loading") : t("createAccount")}
                </Button>
                <FieldDescription className="text-center">
                  {t("haveAccount")}{" "}
                  <a
                    href="/login"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {t("signIn")}
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
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
