# Responsive Design Guidelines

Layout containment, container-aware math, and responsive implementation patterns for the web application.

> For visual tokens, color scales, and surface hierarchy, see [Design System](./DESIGN_SYSTEM.md).

---

## 1. Container-Aware Layout Math

On desktop viewports (`md` / 768px+), `<AppSidebar />` is fixed at **`16rem` (256px)**.

$$\text{Available Content Width} = \text{Viewport Width} - 256\text{px} - \text{Padding}$$

At a 900px viewport:
`900px - 256px - 48px (padding) = 596px` (narrower than a standard `sm` 640px phone container).

**Key Takeaway**: Any child element without containment will expand its parent and cause horizontal page scrolling.

---

## 2. Flex & Grid Containment Rules

1. **Always add `min-w-0` to flex and grid children**  
   Flex items and grid tracks default to `min-width: auto`, preventing them from shrinking below their intrinsic content size.
   ```tsx
   // Hierarchy containment requirement:
   <SidebarInset className="relative flex min-h-svh min-w-0 flex-1 flex-col bg-background">
     <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
       {/* Content */}
     </main>
   </SidebarInset>
   ```

2. **Isolate wide children with `min-w-0 overflow-hidden`**  
   Cards wrapping tables, code blocks, or charts must isolate inner overflow:
   ```tsx
   <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
     <div className="min-w-0 overflow-x-auto">
       <Table>...</Table>
     </div>
   </Card>
   ```

---

## 3. Component Responsive Recipes

### Top Navigation Bar (`<TopNavbar />`)
- **Breadcrumbs**: Use `flex-1 min-w-0` on container and truncate active item:
  `<BreadcrumbPage className="truncate max-w-[140px] sm:max-w-[220px] md:max-w-none">`
- **Actions**: Pin action buttons, language toggle, and theme switch with `shrink-0` to prevent wrapping.

### Data Tables (`<Table />`)
- Always wrap `<Table>` in `<div className="min-w-0 overflow-x-auto">`.
- Set `min-w-[180px]` or `line-clamp-1` on text columns.
- Use `whitespace-nowrap font-mono text-xs` on numeric/status columns.
- Set `text-right shrink-0` on actions column.

### Visualizations & Charts (`<ChartContainer />`)
Recharts `<ResponsiveContainer>` will loop infinitely or cause horizontal expansion unless bounded:
- Pass `initialDimension={{ width: 0, height: 0 }}` to `<ResponsiveContainer>`.
- Wrap in a container with `min-w-0 max-w-full overflow-hidden`.
- In 2-column chart grids (`grid gap-4 md:grid-cols-2`), both child cards must have `min-w-0 overflow-hidden`.

### Toolbars & Tab Lists
- Switch layout from column to row at `lg:` (not `sm:`):
  `className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"`
- Make tab lists horizontally scrollable on mobile:
  `<TabsList className="h-9 w-full max-w-full justify-start overflow-x-auto sm:w-auto sm:justify-center">`
  `<TabsTrigger className="shrink-0">`

### Alert Banners with Actions
- Prevent action buttons from overlapping long text:
  - `<AlertDescription className="pr-24 sm:pr-0">`
  - `<AlertAction className="static mt-2 sm:absolute sm:top-1.5 sm:right-2 sm:mt-0">`

### Split Workspaces (Playground / Studio)
- Grid layout: `grid min-w-0 flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]`
- Ensure code blocks and canvas panes have `min-w-0 overflow-x-auto` or `break-words`.

---

## 4. Breakpoint & Available Width Reference

| Breakpoint | Window Width | Sidebar Mode | Available Content Width | Recommended Grid Columns |
|------------|--------------|--------------|-------------------------|--------------------------|
| **`< sm`** | `< 640px` | Off-canvas sheet | `~340px - 600px` | 1 col |
| **`sm`** | `640px - 767px` | Off-canvas sheet | `608px - 735px` | 2 col (KPIs) |
| **`md` (Narrow Desktop)** | `768px - 1023px` | **Expanded (256px)** | **`464px - 719px`** | **2 col (KPIs, Charts)** |
| **`lg` (Desktop)** | `1024px - 1279px` | Expanded (256px) | `720px - 975px` | 4 col (KPIs), 2 col (Charts) |
| **`xl` (Wide)** | `1280px+` | Expanded (256px) | `976px+` | 4 col (KPIs), Split canvas + rail |

> [!IMPORTANT]
> Because the sidebar expands at `md` (768px), the remaining content area is temporarily **narrower** than at mobile `sm` (640px). Always verify page layouts at **768px – 1024px**.

---

## 5. Responsive Verification Checklist

- [ ] **900px viewport**: No horizontal window or body scrollbar.
- [ ] **375px mobile**: Content stacks cleanly; sheet sidebar functions properly.
- [ ] **Header**: Top navigation actions, language toggle, and theme switch remain visible and accessible without wrapping.
- [ ] **Tables**: Wrapped in `min-w-0 overflow-x-auto` inside `min-w-0 overflow-hidden` cards.
- [ ] **Charts**: Use `initialDimension={{ width: 0, height: 0 }}` inside `min-w-0 overflow-hidden` cards.
- [ ] **Toolbars / Tabs**: Tab lists scroll cleanly without forcing page overflow.
- [ ] **Alerts**: Banner titles/descriptions do not collide with action buttons.
