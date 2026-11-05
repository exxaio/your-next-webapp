<div align="center">

<a href="https://github.com/exxaio/your-next-webapp">
  <img src="public/logo.png" alt="your-next-webapp Logo" width="80" height="80" />
</a>

# ⚡ your-next-webapp

**A production-ready, full-stack Next.js web application template built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, next-intl, and Firebase Auth.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Live Demo](https://img.shields.io/badge/Demo-Live_Online-00c853?logo=vercel&logoColor=white)](https://your-next-webapp.vercel.app/)
[![CI](https://github.com/exxaio/your-next-webapp/actions/workflows/ci.yml/badge.svg)](https://github.com/exxaio/your-next-webapp/actions/workflows/ci.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)

[Overview](#overview) • [Live Demo](#live-demo) • [Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Structure](#repository-structure) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

<a id="overview"></a>
## 🌟 Overview

**your-next-webapp** provides a production-grade foundation for modern SaaS and AI applications. It combines Next.js 16 (App Router & Turbopack) with a refined design system, full internationalization (English & Simplified Chinese), comprehensive Firebase authentication with OAuth account linking, and operational pages including an interactive node-based workflow builder canvas.

<a id="live-demo"></a>
### 🌐 Live Demo & Instant Deploy

- 🔗 **Live Demo URL**: [https://your-next-webapp.vercel.app/](https://your-next-webapp.vercel.app/)
- 🚀 **One-Click Deploy to Vercel**:

  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fexxaio%2Fyour-next-webapp&env=NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID&envDescription=Firebase%20credentials%20for%20authentication)

---

<a id="features"></a>
## ✨ Features

### 🔐 Authentication & Account Management
- **Full Firebase Auth Suite**: Email/password, Google OAuth, and GitHub OAuth.
- **OAuth Account Linking**: Seamless handling of email collisions when signing in with multiple providers (see [OAuth Linking Guide](docs/OAUTH_ACCOUNT_LINKING.md)).
- **Animated Auth Flows**: 2-step registration with dynamic password strength analysis and password reset.
- **Account Control Center**: Update display name, profile avatar, change or set passwords, link/unlink third-party providers, revoke sessions, and account deletion.

<p align="center">
  <img src="public/images/Screenshot 2026-11-05 at 04.20.46.png" alt="your-next-webapp Banner" width="100%" />
  <img src="public/images/Screenshot 2026-11-05 at 04.21.01.png" alt="your-next-webapp Banner" width="100%" />
</p>

### 🌐 Internationalization (i18n)
- **Built on `next-intl`**: Route-based localization supporting English (`/en`) and Simplified Chinese (`/zh-CN`).
- **Modular Namespace Dictionaries**: Clean separation of translation strings by domain (`Dashboard`, `Billing`, `Workflows`, etc.).
- **Dynamic Language Switcher**: Available in both the sticky top navbar and collapsible sidebar.

### 🎨 Design System & Layout
- **Tailwind CSS v4 & Semantic Tokens**: Dark/light modes powered by `next-themes` with frosted glass (backdrop blur) styling.
- **Dual Layout Archetypes**: Responsive single-column constrained layouts (`max-w-4xl`) for settings and fluid full-width views for dashboards and canvases.
- **Automatic Breadcrumb Resolution**: Breadcrumbs resolved dynamically per route.
- **Accessible UI Primitives**: Built with `@base-ui/react`, shadcn/ui, and Hugeicons.

<p align="center">
  <img src="public/images/Screenshot 2026-11-05 at 04.23.24.png" alt="your-next-webapp Banner" width="100%" />
</p>

### 🛠️ Interactive Workflow Builder
- **Node Canvas**: Interactive drag-and-drop workspace with execution engine simulation.
- **Minimap & Navigation**: Live viewport tracker with zoom and panning controls.
- **Node Inspector & Presets**: Configurable node parameters and pre-built starter workflow templates (see [Workflow Builder Docs](docs/WORKFLOW_BUILDER.md)).

### 📊 Operational App Pages
- **`/dashboard`**: Executive dashboard with high-level KPI cards, recent activity, and system alerts.
- **`/analytics`**: Comprehensive telemetry, performance metrics, and charts powered by Recharts.
- **`/models`**: AI model registry with token pricing, context window specs, and latency benchmarks.
- **`/playground`**: Interactive prompt engineering studio with reproducible SDK code export.
- **`/monitoring`**: Real-time edge latency monitoring, error rate tracking, and invocation log stream.
- **`/team`**: Team member directory, invitation modal, and role-based permissions management.
- **`/billing`**: Plan selection, tier feature matrices, quota usage progress bars, and invoice history.

---

<p align="center">
  <img src="app/opengraph-image.jpeg" alt="your-next-webapp Banner" width="100%" />
</p>

---

<a id="quick-start"></a>
## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) `20.x` or `22.x` (LTS recommended)
- [pnpm](https://pnpm.io/) `9.x` or later (`npm install -g pnpm`)

### 1. Clone & Install
```bash
git clone https://github.com/exxaio/your-next-webapp.git
cd your-next-webapp
pnpm install
```

### 2. Configure Environment Variables
Copy the example environment configuration template:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Firebase credentials from the [Firebase Console](https://console.firebase.google.com/):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional:
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Environment Variables Reference

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase project Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Auth domain (`<project-id>.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase Cloud Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase default Cloud Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase Cloud Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase Web Client Application ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Google Analytics measurement ID (`G-XXXXXXXXXX`) |

> For step-by-step instructions on configuring Firebase Authentication, Google sign-in, and GitHub OAuth, see the [Firebase Setup Guide](docs/FIREBASE_SETUP.md).

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3023](http://localhost:3023) in your browser to view the application.

---

<a id="architecture"></a>
## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                       │
│      Locale Negotiation & Routing Proxy (/en, /zh-CN)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│     (auth) Route Group       │        │      (app) Route Group       │
│  - /login (OAuth + Email)    │        │  - /dashboard & /analytics   │
│  - /signup (2-Step Flow)     │        │  - /workflows (Node Canvas)  │
│  - /forgot-password          │        │  - /account & /team          │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│  - useAuth & OAuth Account Linking State Machine             │
│  - next-intl Localization Provider & Scoped Dictionaries    │
│  - Tailwind CSS v4 Semantic Tokens & next-themes            │
│  - Base UI / shadcn/ui Accessible Primitives                │
└─────────────────────────────────────────────────────────────┘
```

- **Next.js 16 App Router**: Strict separation of concerns using Route Groups: `(auth)` for unauthenticated onboarding screens, and `(app)` for protected SaaS views.
- **Internationalization (`next-intl`)**: Server-side request locale resolution in `layout.tsx` combined with modular JSON translation dictionaries under `messages/{locale}/`.
- **Firebase Auth & Conflict Resolution**: Robust client-side auth state hook (`useAuth`) with automatic detection and recovery from `auth/account-exists-with-different-credential` errors.
- **Tailwind CSS v4 & Semantic CSS Variables**: Native CSS `@theme` tokens in `app/globals.css` with dark/light mode switching via `next-themes`.

---

<a id="repository-structure"></a>
## 📁 Repository Structure

```
your-next-webapp/
├── .github/                 # Workflows, issue templates & community health files
│   ├── workflows/ci.yml     # Automated CI (lint, format, typecheck, build)
│   ├── ISSUE_TEMPLATE/      # Bug report & feature request templates
│   ├── pull_request_template.md
│   ├── CODE_OF_CONDUCT.md   # Community guidelines
│   ├── CONTRIBUTING.md      # Contribution guide
│   └── SECURITY.md          # Security policy
├── app/                     # Next.js App Router
│   ├── [locale]/            # Localized route hierarchy (/en, /zh-CN)
│   │   ├── (app)/           # Authenticated application routes
│   │   │   ├── account/     # User profile & account security
│   │   │   ├── analytics/   # System telemetry & charts
│   │   │   ├── billing/     # Plans, usage & billing history
│   │   │   ├── dashboard/   # Executive overview
│   │   │   ├── models/      # Model catalog & specs
│   │   │   ├── monitoring/  # Real-time health & edge logs
│   │   │   ├── playground/  # AI test bench & prompt studio
│   │   │   ├── team/        # Member management & permissions
│   │   │   └── workflows/   # Interactive workflow canvas
│   │   ├── (auth)/          # Authentication pages (login, signup, forgot-pw)
│   │   └── layout.tsx       # Root localized HTML & theme wrapper
│   └── globals.css          # Tailwind CSS v4 design tokens & theme layers
├── components/              # Modular UI components
│   ├── account/             # Account management subsections
│   ├── ui/                  # Accessible Base UI / shadcn design system primitives
│   ├── workflow-builder/    # Canvas, minimap, inspector, and nodes
│   ├── app-sidebar.tsx      # Main collapsible navigation
│   └── top-navbar.tsx       # Sticky frosted navbar with breadcrumbs & language switch
├── docs/                    # In-depth architectural documentation
│   ├── DESIGN_SYSTEM.md     # Design tokens, typography, and contrast rules
│   ├── FIREBASE_SETUP.md    # Firebase Auth & provider configuration guide
│   ├── OAUTH_ACCOUNT_LINKING.md # OAuth conflict resolution flow
│   ├── RESPONSIVE_DESIGN.md # Layout archetypes & responsive guidelines
│   └── WORKFLOW_BUILDER.md  # Canvas architecture & simulation engine
├── hooks/                   # React custom hooks (use-auth, use-mobile)
├── i18n/                    # next-intl configuration & routing definitions
├── lib/                     # Firebase client and utility helpers
├── messages/                # Translation dictionaries
│   ├── en/                  # English locale JSON strings
│   └── zh-CN/               # Simplified Chinese locale JSON strings
├── types/                   # Global TypeScript type declarations
├── proxy.ts                 # Next.js 16 proxy (formerly middleware)
└── package.json
```

---

<a id="available-scripts"></a>
## 📜 Available Scripts

| Script | Purpose |
| :--- | :--- |
| `pnpm dev` | Starts local Next.js development server with Turbopack (default port `3023`) |
| `pnpm build` | Builds the optimized production bundle |
| `pnpm start` | Runs the compiled production server |
| `pnpm lint` | Runs ESLint with Next.js Core Web Vitals and TypeScript rules |
| `pnpm typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |
| `pnpm format` | Formats TypeScript and JSX files using Prettier |
| `pnpm format:check` | Verifies code formatting without modifying files |
| `pnpm check` | Runs both format verification and lint checks (enforced on pre-commit) |

---

<a id="documentation"></a>
## 📚 Documentation

Detailed architectural and operational documentation is available in the [`docs/`](./docs) directory:

- 🎨 **[Design System Guide](docs/DESIGN_SYSTEM.md)** — Semantic color palette, dark mode tokens, typography scale, and contrast guidelines.
- 🔑 **[Firebase Setup](docs/FIREBASE_SETUP.md)** — Guide for creating a Firebase project, enabling Email/Password, Google, and GitHub OAuth.
- 🔗 **[OAuth Account Linking](docs/OAUTH_ACCOUNT_LINKING.md)** — Technical breakdown of credential conflict detection and automated account linking.
- 📱 **[Responsive Design Architecture](docs/RESPONSIVE_DESIGN.md)** — Principles for dual layout archetypes, fluid cards, and table scrolling.
- ⚡ **[Workflow Builder Engine](docs/WORKFLOW_BUILDER.md)** — State models, canvas simulation, node definitions, and preset patterns.

---

<a id="deployment"></a>
## 🚢 Deployment

### Deploy to Vercel

The quickest way to deploy `your-next-webapp` is with [Vercel](https://vercel.com/):

1. Click the **Deploy with Vercel** button above or import the GitHub repository in your Vercel Dashboard.
2. In the environment variables configuration step, provide your Firebase keys (`NEXT_PUBLIC_FIREBASE_*`).
3. Deploy! Next.js 16 build optimization and SSR will configure automatically.

### Deploy with Node.js Server / Docker

To host on your own infrastructure or container:

```bash
# 1. Build application bundle
pnpm build

# 2. Run standalone production server
pnpm start
```

---

<a id="contributing"></a>
## 🤝 Contributing

Contributions are warmly welcomed! Please read our **[Contributing Guide](.github/CONTRIBUTING.md)** and review our **[Code of Conduct](.github/CODE_OF_CONDUCT.md)** before submitting pull requests.

1. Fork the repo and create your branch: `git checkout -b feature/amazing-feature`
2. Run validation checks: `pnpm check && pnpm typecheck && pnpm build`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<a id="security"></a>
## 🔒 Security

For security vulnerability reports, please refer to our **[Security Policy](.github/SECURITY.md)**.

---

<a id="license"></a>
## 📄 License

This project is open source and available under the **[MIT License](LICENSE)**.
