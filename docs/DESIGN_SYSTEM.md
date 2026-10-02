# Design System

**Indigo primary (light) / Indigo-violet primary (dark)** + **Teal accent** — vibrant, high-contrast, WCAG AA

---

## Golden Rules

1. **Always pair colors** — never use dark mode colors alone
2. **Use semantic tokens** — `bg-card`, `text-foreground`, `bg-primary`, `text-accent`, etc.
3. **Avoid** hardcoded scales — no `bg-gray-*`, `text-slate-*`, `bg-indigo-*`, raw hex, etc.
4. **Primary** — buttons, links, focus rings only
5. **Accent** — status indicators and active states only
6. **Enforce containment** — always apply `min-w-0` to flex/grid items and `overflow-hidden` to cards (see [Responsive Design Guidelines](./RESPONSIVE_DESIGN.md))

---

## Color Tokens

### Light Mode (`:root`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#FAFAFB` | Page canvas — `bg-background` |
| `--surface` | `#FFFFFF` | Elevated surfaces — `bg-surface` |
| `--foreground` | `#0F0F14` | Body text — `text-foreground` |
| `--muted-foreground` | `#6B6B78` | Subtle text — `text-muted` |
| `--primary` | `#5B5BF0` | CTA buttons, links — `bg-primary` |
| `--primary-hover` | `#4646D6` | Button hover — `hover:bg-primary-hover` |
| `--accent` | `#14B8A6` | Active/status states — `text-accent` |
| `--border` | `#E4E4EA` | Dividers — `border-border` |
| `--success` | `#16A34A` | Success states |
| `--warning` | `#D97706` | Warning states |
| `--danger` | `#DC2626` | Error/danger states |

### Dark Mode (`.dark`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0B0B0F` | Page canvas |
| `--surface` | `#14141A` | Elevated surfaces |
| `--foreground` | `#F3F3F6` | Body text |
| `--muted-foreground` | `#9A9AA8` | Subtle text |
| `--primary` | `#7C7CFF` | CTA buttons, links |
| `--primary-hover` | `#9494FF` | Button hover |
| `--accent` | `#2DD4BF` | Active/status states |
| `--border` | `#26262F` | Dividers |
| `--success` | `#4ADE80` | Success states |
| `--warning` | `#FBBF24` | Warning states |
| `--danger` | `#F87171` | Error/danger states |

---

## Tailwind Utility Mapping

Tokens are wired in `@theme inline` inside `app/globals.css`, so all standard utility classes work out of the box:

| Purpose | Utility Class |
|---------|--------------|
| Page background | `bg-background` |
| Card/surface | `bg-card` or `bg-surface` |
| Body text | `text-foreground` |
| Muted text | `text-muted-foreground` |
| Primary button | `bg-primary text-primary-foreground hover:bg-primary-hover` |
| Primary link | `text-primary hover:text-primary-hover` |
| Focus ring | `ring-ring` / `focus-visible:ring-ring/50` |
| Active/status | `text-accent` / `bg-accent` |
| Borders | `border-border` |

---

## Surface Hierarchy

| Layer | Classes |
|-------|---------|
| Page canvas | `bg-background` |
| Raised surface | `bg-surface` |
| Sidebar | `bg-sidebar text-sidebar-foreground border-sidebar-border` |
| Cards | `bg-card text-card-foreground border border-border` |
| Frosted overlay | `bg-card/60 backdrop-blur-md border-border/60` |
| Muted container | `bg-muted text-muted-foreground` |

---

## Semantic State Styles

Use semantic tokens — not raw color scales:

```tsx
// Active / selected
className="border-primary/40 bg-primary/5 text-primary"

// Success
className="border-success/30 bg-success/5 text-success"

// Warning
className="border-warning/30 bg-warning/10 text-warning"

// Error / Danger
className="border-danger/30 bg-danger/10 text-danger"

// Status badge (accent)
className="bg-accent/15 text-accent"
```

---

## Dark Mode Setup

- **Strategy**: `class` (via `next-themes`, `attribute="class"`)
- **Provider**: `<ThemeProvider>` in `app/[locale]/layout.tsx`
- **Keyboard shortcut**: Press `D` anywhere to toggle (not in inputs)
- **Toggle component**: `<ThemeToggle />` — header icon button in `<TopNavbar />`

---

## Chart Colors

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | `#5B5BF0` (indigo) | `#7C7CFF` |
| `--chart-2` | `#14B8A6` (teal) | `#2DD4BF` |
| `--chart-3` | `#D97706` (amber) | `#FBBF24` |
| `--chart-4` | `#16A34A` (green) | `#4ADE80` |
| `--chart-5` | `#DC2626` (red) | `#F87171` |

---

## Page Layout Archetypes

> 📖 **Detailed Guidelines**: For container containment rules (`min-w-0`), component-specific implementations (tables, charts, top navbar), and screen breakpoint matrix, consult the dedicated [Responsive Design Guidelines](./RESPONSIVE_DESIGN.md).

The application defines two distinct layout archetypes: **Settings Pages** (focused, single-column, max-width constrained) and **Content & Workspace Pages** (fluid, multi-column or split-pane, full-width).

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Settings Pages (max-w-4xl, min-w-0, gap-8)               │
│    - Account, Profile, Organization, Security               │
├─────────────────────────────────────────────────────────────┤
│ 2. Content & Workspace Pages (full-width fluid, min-w-0)    │
│    - Dashboard, Analytics, Playground/Studio, Logs, Tables  │
└─────────────────────────────────────────────────────────────┘
```

---

### 1. Settings Pages Archetype

Used for user preferences, account management, credentials, organization settings, and billing.

- **Width & Spacing**: Centered with a constrained width for form readability:  
  `className="mx-auto flex w-full max-w-4xl min-w-0 flex-1 flex-col gap-8 p-4 pt-0 md:p-6 md:pt-0"`
- **Page Header**: Explicit `h1` title (`text-2xl font-bold tracking-tight`) with explanatory subtitle (`text-sm text-muted-foreground`).
- **Overview Banner (Optional)**: Top profile/summary card (`rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs`) highlighting user avatar, status badges, and quick stats.
- **Section Eyebrow Headers**: Group cards with an icon chip badge and uppercase tracking label:
  ```tsx
  <div className="flex items-center gap-2 px-1">
    <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <HugeiconsIcon icon={UserIcon} className="size-3.5" />
    </span>
    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      Personal Information
    </span>
  </div>
  ```
- **Modular Cards**: Single-column stacked cards with generous padding:  
  `Card className="border border-border bg-card p-6 shadow-xs sm:p-7"`
- **Danger Zone**: For irreversible or high-impact actions (account deletion, API key revoke):
  ```tsx
  <div id="danger-zone" className="scroll-mt-6 space-y-3">
    <div className="flex items-center gap-2 px-1">
      <span className="flex size-6 items-center justify-center rounded-md border border-danger/20 bg-danger/10 text-danger">
        <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5" />
      </span>
      <span className="text-xs font-semibold tracking-wider text-danger uppercase">
        Critical Actions
      </span>
    </div>
    <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
      {/* Danger Zone content */}
    </Card>
  </div>
  ```

---

### 2. Content & Workspace Pages Archetype

Used for all primary application experiences: Dashboard, Analytics, Studio/Playground, Data Tables, and Monitoring.

- **Width & Spacing**: Fluid full-width container to maximize viewport real estate:  
  `className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0"`
- **Header & Navigation**:
  - Integrate contextual actions and breadcrumbs directly into the top navigation via `<NavbarActions>` and `<NavbarBreadcrumbs>`.
  - Provide an accessible heading: `<h1 className="sr-only">Page Title</h1>`.
  - Top context bar (optional): Alert banners (`Alert border-l-4 border-l-accent`), filter bars, or preset toolbars spanning full width with responsive actions (`static mt-2 sm:absolute sm:top-1.5 sm:right-2 sm:mt-0`).
- **Grid & Modular Rhythm**:
  - **KPI / Stat Grids**: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` with `min-w-0` on cards.
  - **Visualization / Charts**: `grid gap-4 md:grid-cols-2` using `ChartContainer` (`initialDimension={width: 0, height: 0}`) inside `<Card className="min-w-0 overflow-hidden">`.
  - **Studio / Split Workspaces**: Use unified `gap-4` split layouts:  
    `grid min-w-0 flex-1 items-start gap-4 lg:grid-cols-[1fr_320px]` (canvas + parameter/inspector rail with `min-w-0` on both columns).
- **Tables & Lists**: Wrap within `<Card className="border border-border bg-card p-6 min-w-0 overflow-hidden">` combined with `<Tabs>` for switching sub-views, and `<div className="min-w-0 overflow-x-auto">` enclosing `<Table>`.
- **Status Badges**: Standardized semantic badges for data rows:
  - Success: `border-success/30 bg-success/5 text-success`
  - Warning: `border-warning/30 bg-warning/10 text-warning`
  - Error: `border-danger/30 bg-danger/10 text-danger`

---

## Files Changed (Color System v2)

| File | Change |
|------|--------|
| `app/globals.css` | Full `:root` + `.dark` token rewrite; `--surface` + `--primary-hover` added to `@theme inline` |
| `components/ui/button.tsx` | `hover:bg-primary-hover` on default; `hover:text-primary-hover` on link |
| `components/ui/tabs.tsx` | Active tab indicator uses `bg-accent` (was `bg-foreground`) |
| `components/theme-toggle.tsx` | New standalone `<ThemeToggle>` icon button component |
| `app/[locale]/dashboard/page.tsx` | `<ThemeToggle className="ml-auto" />` added to page header |

