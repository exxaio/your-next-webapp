# Design System

**Indigo primary (light) / Indigo-violet primary (dark)** + **Teal accent** — vibrant, high-contrast, WCAG AA

---

## Golden Rules

1. **Always pair colors** — never use dark mode colors alone
2. **Use semantic tokens** — `bg-card`, `text-foreground`, `bg-primary`, `text-accent`, etc.
3. **Avoid** hardcoded scales — no `bg-gray-*`, `text-slate-*`, `bg-indigo-*`, raw hex, etc.
4. **Primary** — buttons, links, focus rings only
5. **Accent** — status indicators and active states only

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
- **Toggle component**: `<ThemeToggle />` — header icon button
- **Sidebar toggle**: `SidebarThemeToggle` inside `<AppSidebar>`

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

## Files Changed (Color System v2)

| File | Change |
|------|--------|
| `app/globals.css` | Full `:root` + `.dark` token rewrite; `--surface` + `--primary-hover` added to `@theme inline` |
| `components/ui/button.tsx` | `hover:bg-primary-hover` on default; `hover:text-primary-hover` on link |
| `components/ui/tabs.tsx` | Active tab indicator uses `bg-accent` (was `bg-foreground`) |
| `components/theme-toggle.tsx` | New standalone `<ThemeToggle>` icon button component |
| `app/[locale]/dashboard/page.tsx` | `<ThemeToggle className="ml-auto" />` added to page header |
