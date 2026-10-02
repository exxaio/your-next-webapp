# Design System

Visual design tokens, semantic styling, and page structure archetypes for the web application.

> For layout containment, flex/grid overflow rules, and breakpoint behavior, see [Responsive Design Guidelines](./RESPONSIVE_DESIGN.md).

---

## Golden Rules

1. **Pair colors** — never use dark mode colors alone; always use tokens defined in `app/globals.css`.
2. **Use semantic tokens** — `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`, etc.
3. **No hardcoded scales** — avoid `bg-gray-*`, `text-slate-*`, `bg-indigo-*`, or raw hex codes.
4. **Primary** — reserve for primary CTAs, links, and focus rings.
5. **Accent** — reserve for active indicators and highlighted status states.

---

## Color Tokens

Configured via `@theme inline` in `app/globals.css`:

| Token | Light Hex | Dark Hex | Utility Class / Usage |
|-------|-----------|----------|-----------------------|
| `--background` | `#FAFAFB` | `#0B0B0F` | `bg-background` (page canvas) |
| `--surface` | `#FFFFFF` | `#14141A` | `bg-surface` (elevated surface) |
| `--foreground` | `#0F0F14` | `#F3F3F6` | `text-foreground` (body text) |
| `--muted-foreground` | `#6B6B78` | `#9A9AA8` | `text-muted-foreground` (subtle text) |
| `--primary` | `#5B5BF0` | `#7C7CFF` | `bg-primary`, `text-primary` (CTAs, links) |
| `--primary-hover` | `#4646D6` | `#9494FF` | `hover:bg-primary-hover` |
| `--accent` | `#14B8A6` | `#2DD4BF` | `text-accent`, `bg-accent` (active tabs, highlights) |
| `--border` | `#E4E4EA` | `#26262F` | `border-border` (dividers, borders) |
| `--success` | `#16A34A` | `#4ADE80` | Success states and badges |
| `--warning` | `#D97706` | `#FBBF24` | Warning states and badges |
| `--danger` | `#DC2626` | `#F87171` | Error states and destructive actions |

### Chart Tokens

| Token | Light | Dark | Accent Color |
|-------|-------|------|--------------|
| `--chart-1` | `#5B5BF0` | `#7C7CFF` | Indigo |
| `--chart-2` | `#14B8A6` | `#2DD4BF` | Teal |
| `--chart-3` | `#D97706` | `#FBBF24` | Amber |
| `--chart-4` | `#16A34A` | `#4ADE80` | Green |
| `--chart-5` | `#DC2626` | `#F87171` | Red |

---

## Surface Hierarchy & Semantic States

### Surface Layers

| Layer | Recommended Classes |
|-------|---------------------|
| Canvas | `bg-background` |
| Raised Surface | `bg-surface` |
| Card | `bg-card text-card-foreground border border-border` |
| Sidebar | `bg-sidebar text-sidebar-foreground border-sidebar-border` |
| Frosted Overlay | `bg-card/60 backdrop-blur-md border-border/60` |
| Muted Container | `bg-muted text-muted-foreground` |

### Semantic State Badges & Indicators

```tsx
// Active / Selected
className="border-primary/40 bg-primary/5 text-primary"

// Status Highlight (accent)
className="bg-accent/15 text-accent"

// Success
className="border-success/30 bg-success/5 text-success"

// Warning
className="border-warning/30 bg-warning/10 text-warning"

// Error / Danger
className="border-danger/30 bg-danger/10 text-danger"
```

---

## Dark Mode Setup

- **Strategy**: `class` (via `next-themes`, `attribute="class"`).
- **Provider**: `<ThemeProvider>` in `app/[locale]/layout.tsx`.
- **Toggle Component**: `<ThemeToggle />` header icon button in `<TopNavbar />`.
- **Keyboard Shortcut**: Press `D` anywhere to toggle (ignored in text inputs).

---

## Page Layout Archetypes

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Settings Pages (max-w-4xl centered, single column)       │
│    - Account, Profile, Organization, Billing, Security      │
├─────────────────────────────────────────────────────────────┤
│ 2. Content & Workspace Pages (full-width fluid canvas)      │
│    - Dashboard, Analytics, Studio/Playground, Logs, Tables  │
├─────────────────────────────────────────────────────────────┤
│ 3. Interactive Canvas Pages (viewport-locked, zero scroll)  │
│    - Agent Workflow Builder, Visual Pipelines, Graph Nodes  │
└─────────────────────────────────────────────────────────────┘
```

### 1. Settings Pages Archetype

Used for preferences, credentials, profile, and organization management.

- **Container**: Centered, max-width constrained for reading comfort:
  ```tsx
  <PageContainer variant="settings">
  ```
- **Header**: Explicit `h1` (`text-2xl font-bold tracking-tight`) with explanatory subtitle (`text-sm text-muted-foreground`).
- **Section Eyebrow**: Icon chip badge with tracking label to group cards:
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
- **Cards**: Single-column stacked cards (`border border-border bg-card p-6 shadow-xs sm:p-7`).
- **Danger Zone**: Distinct section for irreversible actions with `border-danger/20 bg-danger/10 text-danger` eyebrow headers.

### 2. Content & Workspace Pages Archetype

Used for primary operational views: Dashboard, Analytics, Studio/Playground, and Data Tables.

- **Container**: Fluid full-width container to maximize viewport space:
  ```tsx
  <PageContainer variant="workspace">
  ```
- **Header & Navigation**:
  - Breadcrumbs are automatically resolved by `<TopNavbar />` based on route and query parameters (zero boilerplate on pages; optional `<NavbarBreadcrumbs>` override supported).
  - Contextual action buttons mounted into the top navigation via `<NavbarActions>`.
  - Accessible heading: `<h1 className="sr-only">Page Title</h1>`.
- **Layout Rhythms**:
  - **KPI Grids**: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`
  - **Visualization Grids**: `grid gap-4 md:grid-cols-2`
  - **Split Workspace**: `grid gap-4 lg:grid-cols-[1fr_320px]` (canvas + inspector)

### 3. Interactive Canvas Archetype

Used for viewport-locked node graphs, pipeline builders, and zero-scroll canvas interactions.

- **Container**: Viewport-locked, zero-scroll container:
  ```tsx
  <PageContainer variant="canvas">
  ```
- **Header & Navigation**:
  - Sticky frosted-glass `<TopNavbar />` with automatic route breadcrumbs.
  - Global pipeline actions (Run/Simulate, Deploy, Export) mounted into `<TopNavbar />` via `<NavbarActions>`.
  - Accessible heading: `<h1 className="sr-only">Page Title</h1>`.
- **Layout Rhythms**:
  - **Panels**: Collapsible side rails (`w-64 border-r` library palette on left, `w-80 border-l` inspector drawer on right) wrapping a boundless interactive canvas.
  - **Canvas Surface**: Dot or grid patterned surface with glassmorphic floating controls (`bg-card/80 backdrop-blur-md border border-border shadow-md`).
  - **Containment**: Strict `min-w-0 min-h-0 overflow-hidden` hierarchy to preserve zero-scroll viewport lock.
