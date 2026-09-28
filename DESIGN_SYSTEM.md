# Design System

**Warm cream (light) / warm olive-charcoal (dark)** — no cold blacks

## Golden Rules

1. **Always pair colors** — never use dark mode colors alone
2. **Use semantic tokens** — `bg-card`, `text-foreground`, etc.
3. **Avoid** — `bg-black`, `bg-zinc-950`, `dark:border-white/10` alone

## Semantic States

```tsx
// Active
className="border-violet-500/80 bg-violet-50 text-violet-700 dark:border-violet-500 dark:bg-violet-500/15 dark:text-violet-300"

// Success
className="border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"

// Warning
className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"

// Error
className="border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-300"
```

## Surface Hierarchy

| Layer | Classes |
|-------|---------|
| Page canvas | `bg-background` |
| Sidebar | `bg-sidebar text-sidebar-foreground border-sidebar-border` |
| Cards | `bg-card text-card-foreground border border-border` |
| Frosted | `dark:bg-card/60 backdrop-blur-md dark:border-white/10 dark:bg-white/5` |
| Code | `dark:bg-black/40 text-muted-foreground` |

## Tokens

**Surfaces**: `background`, `card`, `muted`, `accent`  
**Sidebar**: `sidebar`, `sidebar-primary`, `sidebar-accent`, `sidebar-muted-foreground`  
**Semantic**: `destructive`, `success`, `warning`, `info`, `danger`
