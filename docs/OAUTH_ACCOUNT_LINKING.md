# OAuth Account Linking Implementation

This document describes the architecture, mechanics, and UI implementation of seamless OAuth account linking in this application.

---

## 1. Overview

When users authenticate with multiple identity providers (such as GitHub, Google, or Email/Password) using the same email address, Firebase Auth's default project configuration enforces **"One account per email address"**.

### The Problem

If a user signs up using one provider (e.g. Email/Password or Google) and later attempts to sign up or sign in using a different provider (e.g. GitHub) with the same email address, Firebase throws an error:

```
auth/account-exists-with-different-credential
```

In default setups, this aborts authentication and presents users with a confusing error message, leaving them stranded.

### The Solution

Instead of treating this conflict as a terminal error:
1. The error is intercepted and suppressed from showing as a red failure.
2. The user's pending OAuth credential (GitHub or Google token) is preserved in memory.
3. A modal dialog ([`LinkAccountDialog`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/link-account-dialog.tsx)) prompts the user to verify their identity with their existing provider or password.
4. Firebase's `linkWithCredential` links the new provider to the existing account.
5. The user is authenticated and immediately redirected to `/dashboard`. Future sign-ins succeed with **either** provider.

---

## 2. Authentication Flow

```
User initiates OAuth sign-in (GitHub or Google)
                     │
                     ▼
             Firebase OAuth Popup
                     │
         ┌───────────┴───────────┐
         │                       │
      Success                 Conflict
         │           (account-exists-with-different-credential)
         ▼                       │
    /dashboard                   ▼
                    handleOAuthConflict()
                    • Extract pending OAuthCredential
                    • Fetch existing methods for email
                    • Populate pendingLinkState (no error set)
                                 │
                                 ▼
                    LinkAccountDialog Opens
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        Existing is OAuth              Existing is Password
                 │                               │
                 ▼                               ▼
        "Sign in with Google"           Enter password & click
        runs signInWithPopup()         "Verify & Link"
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
              linkWithCredential(user, pendingCredential)
                                 │
                                 ▼
                     Clear pendingLinkState
                     Redirect to /dashboard
```

---

## 3. Core Architecture & Files

The solution spans three primary components:

| File | Role |
| --- | --- |
| [`hooks/use-auth.ts`](file:///Users/aa/git/github_exxaio/your-next-webapp/hooks/use-auth.ts) | Manages authentication lifecycle, intercepts conflicts, exposes linking functions and states |
| [`components/link-account-dialog.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/link-account-dialog.tsx) | Controlled modal UI that orchestrates the secondary verification and account linking |
| [`components/login-form.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/login-form.tsx) & [`components/signup-form.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/signup-form.tsx) | Integrate the dialog and trigger seamless redirection upon completion |

---

## 4. Implementation Details

### 4.1. `useAuth` Hook ([`hooks/use-auth.ts`](file:///Users/aa/git/github_exxaio/your-next-webapp/hooks/use-auth.ts))

#### Data Structure: `PendingLinkState`

```typescript
export interface PendingLinkState {
  email: string                      // Conflicting email address
  existingMethods: string[]          // Registered providers (e.g. ["google.com", "password"])
  pendingCredential: OAuthCredential // Credential extracted from the conflict error
  attemptedProvider: "github" | "google"
}
```

#### Conflict Interception: `handleOAuthConflict`

When an OAuth popup rejects with `auth/account-exists-with-different-credential`:

```typescript
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
    setError("This email is linked to a different sign-in method. Please sign in with that method.")
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
```

> **Key Rule**: `setError()` is intentionally **not called** on conflict. The presence of `pendingLinkState` signals the UI to open the resolution dialog rather than display an inline red error.

#### Linking Methods

The hook exposes two linking methods:

- **`linkWithOAuthProvider()`**: Authenticates the user with their existing OAuth provider (`GoogleAuthProvider` or `GithubAuthProvider`) via popup, then calls `linkWithCredential(user, pendingCredential)`.
- **`linkWithPassword(password)`**: Authenticates using `signInWithEmailAndPassword`, then calls `linkWithCredential(user, pendingCredential)`.
- **`clearPendingLink()`**: Resets the pending state if the user cancels the dialog.

---

### 4.2. Modal Dialog ([`components/link-account-dialog.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/link-account-dialog.tsx))

The dialog is built on accessible `@base-ui/react/alert-dialog` primitives ([`components/ui/alert-dialog.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/ui/alert-dialog.tsx)).

#### Adaptive UI States:

1. **Existing method is an OAuth provider (e.g. Google):**
   - Renders a button: `Sign in with Google to Link [GitHub]`.
   - If the account also has a password, displays a subtle toggle: *"Verify with password instead"*.

2. **Existing method is Email & Password:**
   - Automatically renders a password input and a `"Verify & Link [Provider]"` submit button.

3. **Error Isolation:**
   - Validation errors (such as wrong password) are contained **inside the modal** without breaking or resetting the form behind it.

4. **Dismissal Handling:**
   - Clicking **Cancel** or backdrop invokes `onCancel()`, clearing `pendingLinkState` cleanly.

---

### 4.3. Form Integration ([`login-form.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/login-form.tsx) & [`signup-form.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/signup-form.tsx))

Both authentication forms bind to `useAuth()`:

```tsx
const {
  signInWithGoogle,
  signInWithGithub,
  linkWithOAuthProvider,
  linkWithPassword,
  pendingLinkState,
  clearPendingLink,
  loading,
  error,
} = useAuth()

const handleGithubSignIn = async () => {
  clearError()
  try {
    const res = await signInWithGithub()
    if (res) router.push("/dashboard")
  } catch (err) {
    console.error("GitHub sign in error:", err)
  }
}
```

At the bottom of each form component:

```tsx
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
```

---

## 5. Security & Session Considerations

- **In-Memory Credential Retention:** Pending OAuth tokens are held only in React memory (`useState`). They are never persisted to `localStorage`, cookies, or session storage. If the user navigates away or refreshes, the state is cleared.
- **Proof of Account Ownership:** Linking requires authenticating with the existing account first (via verified OAuth token or matching password). An attacker cannot link their GitHub account to another user's account without proving ownership of that existing account.
- **Silent Popup Cancelation:** If a user closes an OAuth popup during linking, Firebase throws `auth/popup-closed-by-user`. This is treated as a neutral dismissal rather than a fatal error, keeping the dialog open.

---

## 6. Firebase Console Settings

For this account linking flow to work properly, verify the following in the [Firebase Console](https://console.firebase.google.com):

1. **Authentication > Settings > User account linking**:
   - Ensure **"Link accounts that use the same email"** or **"One account per email address"** is selected.
2. **Authentication > Sign-in method**:
   - **Google**: Enabled with Web Client ID and secret.
   - **GitHub**: Enabled with Client ID, Client Secret, and authorized redirect URI (`https://<project-id>.firebaseapp.com/__/auth/handler`).
   - **Email/Password**: Enabled.
