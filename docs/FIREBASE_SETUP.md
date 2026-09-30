# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication in your Next.js application.

## Prerequisites

- A Firebase account ([Sign up here](https://firebase.google.com/))
- Node.js and pnpm installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Register Your Web App

1. In your Firebase project, click on the web icon (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Your Next WebApp")
3. Copy the Firebase configuration object (you'll need this later)

## Step 3: Enable Authentication Methods

1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the authentication providers you want to use:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable → Add support email → Save
   - **Apple**: Click "Apple" → Enable → Configure (requires Apple Developer account)

### For Google Sign-In:
- No additional configuration needed for development
- For production, add your domain to authorized domains

### For Apple Sign-In:
1. You need an Apple Developer account
2. Configure your Apple Service ID in Firebase
3. Add authorized domains
4. Set up the Return URL in your Apple Developer console

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase credentials from Step 2:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 5: Test Authentication

1. Start your development server:

```bash
pnpm dev
```

2. Navigate to `http://localhost:3000/en/login` (or your configured locale)
3. Try signing up with email/password or using social login

## Project Structure

```
lib/
  firebase.ts              # Firebase initialization
hooks/
  use-auth.ts             # Authentication hook with all methods
components/
  login-form.tsx          # Login form with Firebase integration
  auth-provider.tsx       # Auth context provider (optional)
  protected-route.tsx     # HOC for protecting routes
app/
  [locale]/
    login/
      page.tsx            # Login page
    dashboard/
      page.tsx            # Protected dashboard page
```

## Available Authentication Methods

### useAuth Hook

The `useAuth` hook provides the following methods:

```typescript
const {
  user,                    // Current user object or null
  loading,                 // Loading state
  error,                   // Error message
  signInWithEmail,         // (email, password) => Promise
  signUpWithEmail,         // (email, password, displayName?) => Promise
  signInWithGoogle,        // () => Promise
  signInWithApple,         // () => Promise
  logout,                  // () => Promise
  resetPassword,           // (email) => Promise
  clearError,              // () => void
} = useAuth()
```

### Example Usage

```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return <div>Welcome, {user.displayName}!</div>
}
```

## Protecting Routes

Wrap any page or component with `ProtectedRoute` to require authentication:

```typescript
import { ProtectedRoute } from '@/components/protected-route'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

## Security Notes

### API Keys are Public

Firebase API keys in `NEXT_PUBLIC_*` variables are safe to expose in client-side code. They identify your Firebase project, but actual security is enforced by:

1. **Firebase Security Rules**: Control database/storage access
2. **Authorized Domains**: Only listed domains can use authentication
3. **OAuth Configuration**: Provider-specific security settings

### Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Configure authorized domains** in Firebase Console for production
3. **Set up Firebase Security Rules** for Firestore/Storage if used
4. **Enable App Check** for production to prevent abuse
5. **Use environment-specific Firebase projects** (dev/staging/prod)
