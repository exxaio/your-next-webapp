# Contributing to your-next-webapp

Thank you for your interest in contributing to **your-next-webapp**! We welcome community contributions, bug reports, and suggestions.

---

## Code of Conduct

All contributors are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat all participants with respect and empathy.

---

## Getting Started

### Prerequisites

- **Node.js**: `20.x` or `22.x` (LTS recommended)
- **pnpm**: `9.x` or later (`npm i -g pnpm`)
- **Git**: installed and configured

### Local Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/your-next-webapp.git
   cd your-next-webapp
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your Firebase credentials to `.env.local` (see [Firebase Setup Guide](docs/FIREBASE_SETUP.md)).

4. **Start the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Workflow

### Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start the local Next.js development server with Turbopack |
| `pnpm build` | Compile and verify the production build |
| `pnpm start` | Run the built production application locally |
| `pnpm lint` | Run ESLint checks across the codebase |
| `pnpm typecheck` | Run `tsc --noEmit` to verify TypeScript types |
| `pnpm format` | Automatically format code with Prettier |
| `pnpm format:check` | Verify that code complies with Prettier formatting rules |
| `pnpm check` | Run both formatting check and linter (used by pre-commit hook) |

### Git Hooks

We use [Husky](https://typicode.github.io/husky/) to automatically enforce standards:
- **`pre-commit`**: Validates code formatting and ESLint rules (`pnpm check`).
- **`pre-push`**: Runs full TypeScript typechecking (`pnpm typecheck`).

---

## Pull Request Guidelines

1. **Create a branch**:
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/issue-description
   ```
2. **Make your changes**:
   - Write readable, well-typed TypeScript code.
   - Adhere to the established [Design System](docs/DESIGN_SYSTEM.md) and [Responsive Design](docs/RESPONSIVE_DESIGN.md) conventions.
   - Add internationalized translation strings under `messages/en/` and `messages/zh-CN/` for any new UI text.
3. **Verify checks pass locally**:
   ```bash
   pnpm check
   pnpm typecheck
   pnpm build
   ```
4. **Commit with clear commit messages**:
   - Follow standard semantic commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `chore:`.
5. **Submit your Pull Request**:
   - Provide a clear summary of changes in the PR description.
   - Link any related issues (e.g. `Fixes #12`).

Thank you for helping make `your-next-webapp` better!
