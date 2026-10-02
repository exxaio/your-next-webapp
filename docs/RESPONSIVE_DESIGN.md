# Responsive Design Guidelines

Comprehensive responsive architecture and layout containment guidelines for the web application.

---

## 1. Core Philosophy & Container-Aware Layouts

A common pitfall in web development is assuming **viewport width equals content width**. In this application:

- On desktop viewports (`md` and above), `<AppSidebar />` is fixed at **`16rem` (256px)**.
- At a 900px viewport, the remaining content container width is only **644px** (less than standard `sm` 640px space once padding is considered).
- Therefore, responsive layouts must be designed with **strict flexbox and grid containment** so that no child can force the outer frame beyond the viewport.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Screen Width: 900px                                                    │
├────────────────────┬───────────────────────────────────────────────────┤
│ Sidebar (256px)    │ Main Inset Container (644px)                      │
│                    │ ┌───────────────────────────────────────────────┐ │
│                    │ │ Content Padding: 48px (24px left + 24px right)│ │
│                    │ │ Inner Available: 596px                        │ │
│                    │ └───────────────────────────────────────────────┘ │
└────────────────────┴───────────────────────────────────────────────────┘
```

---

## 2. The Flex & Grid Containment Golden Rules

### Rule 1: Always apply `min-w-0` to flex and grid children
In the CSS Flexbox and Grid specifications, flex items and grid tracks default to `min-width: auto`. This means a container will **never shrink below the intrinsic min-content width of its children**. If a table, code block, or chart is 900px wide, an ancestor without `min-w-0` will expand to 900px, causing the entire window to scroll horizontally.

- `<SidebarInset>`: Must use `min-w-0 flex-1` (never `w-full` alone).
- `<main>`: Must include `min-w-0 flex-1`.
- Any multi-column grid item or split-pane column: Must include `min-w-0`.

```tsx
// ✅ Correct: Contained flex hierarchy
<SidebarInset className="relative flex min-h-svh min-w-0 flex-1 flex-col bg-background">
  <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
    {/* Page content */}
  </main>
</SidebarInset>

// ❌ Incorrect: Will overflow on wide children
<SidebarInset className="relative flex w-full flex-1 flex-col bg-background">
  <main className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
    {/* Page content */}
  </main>
</SidebarInset>
```

### Rule 2: Wrap wide child components with `min-w-0 overflow-hidden`
Cards that enclose data tables, pre/code blocks, or responsive charts must be isolated:

```tsx
// ✅ Correct: Contains inner scrollbars and charts
<Card className="border border-border bg-card p-6 min-w-0 overflow-hidden">
  <div className="min-w-0 overflow-x-auto">
    <Table>...</Table>
  </div>
</Card>
```

---

## 3. Component-Specific Implementation Guidelines

### A. Top Navigation Bar (`<TopNavbar />`)

The header must adapt seamlessly across screen widths without wrapping buttons or pushing action items offscreen:

1. **Flex distribution**: The breadcrumbs container takes `flex-1 min-w-0`, allowing breadcrumbs to truncate.
2. **Page title truncation**: `<BreadcrumbPage className="truncate max-w-[140px] sm:max-w-[220px] md:max-w-none">`.
3. **Actions pinning**: Contextual action buttons, language selector, and theme toggle use `shrink-0` to remain visible and fully functional at all times.

```tsx
<header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40">
  <div className="flex flex-1 min-w-0 items-center gap-2 px-4">
    <SidebarTrigger className="-ml-1 shrink-0" />
    <Separator orientation="vertical" className="mr-2 shrink-0 data-vertical:h-4" />
    
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {/* Breadcrumb items with truncation on the active page */}
      </BreadcrumbList>
    </Breadcrumb>
    
    <div className="ml-auto flex shrink-0 items-center gap-2">
      {navbar?.actions}
      <div className="flex shrink-0 items-center gap-1">
        <LanguageSwitcher />
        <div className="h-4 w-px bg-border" />
        <ThemeToggle />
      </div>
    </div>
  </div>
</header>
```

---

### B. Data Tables (`<Table />`)

Tables with 5+ columns often have intrinsic widths between 700px and 1100px due to badges, timestamps, and action buttons.

1. **Containment**: Enclose `<Table>` in a dedicated horizontal scroll container:
   ```tsx
   <div className="min-w-0 overflow-x-auto">
     <Table>...</Table>
   </div>
   ```
2. **Column formatting**:
   - Primary text columns: Use `min-w-[180px]` or `max-w-sm line-clamp-1` to prevent unconstrained text wrapping.
   - Numeric and status columns: Keep compact with `whitespace-nowrap font-mono text-xs`.
   - Action columns: Add `text-right shrink-0`.

---

### C. Visualizations & Charts (`<ChartContainer />`)

Recharts components require strict dimension boundaries to prevent infinite growth loops or layout stretching:

1. **Zero initial dimension**: `initialDimension = { width: 0, height: 0 }` prevents `<ResponsiveContainer>` from locking to an artificial 320px minimum size before the container is measured.
2. **Chart container sizing**:
   ```tsx
   <div
     data-slot="chart"
     data-chart={chartId}
     className={cn(
       "flex aspect-video justify-center text-sm min-w-0 max-w-full overflow-hidden",
       className
     )}
   >
     <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
       {children}
     </RechartsPrimitive.ResponsiveContainer>
   </div>
   ```
3. **Chart grid rhythm**: In 2-column chart grids (`grid gap-4 md:grid-cols-2`), both child cards must have `min-w-0 overflow-hidden`.

---

### D. Toolbars, Tab Lists & Action Bars

When building toolbars with tabs and search bars:

1. **Breakpoint threshold**: Switch from vertical stack to horizontal row at `lg` (`lg:flex-row`), not `sm`. At `sm` (640px), a desktop sidebar leaves insufficient room for 5 tabs plus an input.
2. **Scrollable tab lists**: Add `max-w-full overflow-x-auto justify-start sm:justify-center` to `<TabsList>` and `shrink-0` to `<TabsTrigger>`.

```tsx
<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <Tabs value={tab} onValueChange={setTab} className="w-full lg:w-auto">
    <TabsList className="h-9 w-full max-w-full justify-start overflow-x-auto sm:w-auto sm:justify-center">
      <TabsTrigger value="all" className="shrink-0 text-xs">All Models</TabsTrigger>
      <TabsTrigger value="llm" className="shrink-0 text-xs">LLM</TabsTrigger>
      {/* ... */}
    </TabsList>
  </Tabs>

  <div className="relative w-full lg:w-72">
    <SearchInput />
  </div>
</div>
```

---

### E. Alert Banners & Context Bars

Context bars (`<Alert>`) with actions must adapt without text overlapping:

1. **Responsive action layout**: Use `static mt-2 sm:absolute sm:top-1.5 sm:right-2 sm:mt-0` for `<AlertAction>`.
2. **Padding offset**: Apply `pr-24 sm:pr-0` or `pr-28 sm:pr-0` on `<AlertDescription>` so long sentences don't clip under absolute buttons on tablet screens.

```tsx
<Alert className="border-l-4 border-l-accent bg-card text-card-foreground">
  <HugeiconsIcon icon={Activity01Icon} className="h-4 w-4 text-accent" />
  <AlertTitle>Operational Status</AlertTitle>
  <AlertDescription className="pr-24 sm:pr-0">
    All nodes operating normally.
  </AlertDescription>
  <AlertAction className="static mt-2 sm:absolute sm:top-1.5 sm:right-2 sm:mt-0">
    <Button variant="outline" size="sm">View Telemetry</Button>
  </AlertAction>
</Alert>
```

---

### F. Studio & Split Workspaces (Playground)

In split layouts (`grid flex-1 items-start gap-4 lg:grid-cols-[1fr_320px]`):

1. **Grid containment**: Add `min-w-0` to the grid container and the main canvas container (`lg:grid-cols-[minmax(0,1fr)_320px]` or `min-w-0` on the `1fr` child).
2. **Code & text areas**: Long unbreaking text strings, JSON outputs, or `<pre>` blocks inside the canvas must specify `min-w-0 overflow-x-auto` or `break-words`.

---

## 4. Breakpoint & Available Width Reference

| Screen Breakpoint | Window Width | Sidebar Mode | Available Content Width | Recommended Grid Columns |
|-------------------|--------------|--------------|-------------------------|--------------------------|
| **`< sm`** | `< 640px` | Off-canvas sheet | `~340px - 600px` | 1 col |
| **`sm`** | `640px - 767px` | Off-canvas sheet | `608px - 735px` | 2 col (KPIs) |
| **`md` (Narrow Desktop)** | `768px - 1023px` | **Expanded (256px)** | **`464px - 719px`** | **2 col (KPIs, Charts)** |
| **`lg` (Desktop)** | `1024px - 1279px` | Expanded (256px) | `720px - 975px` | 4 col (KPIs), 2 col (Charts) |
| **`xl` (Wide)** | `1280px+` | Expanded (256px) | `976px+` | 4 col (KPIs), Split canvas + rail |

> [!IMPORTANT]
> Notice that at `md: 768px - 1023px`, the sidebar is expanded on desktop! The remaining width is **narrower than mobile `sm` width**. Always verify designs specifically between **768px and 1024px**.

---

## 5. Pre-Commit Responsive Checklist

Before opening a PR or completing page work, test against this checklist:

- [ ] Window resized to **900px**: No horizontal scrollbar appears on the window or `<body>`.
- [ ] Window resized to **375px** (Mobile): Content stacks properly, sheet sidebar opens smoothly.
- [ ] Top navbar action buttons, language toggle, and theme switch remain fully accessible and visible at all screen widths.
- [ ] All `<Card>` containers with charts or tables include `min-w-0 overflow-hidden`.
- [ ] All table containers include `min-w-0 overflow-x-auto`.
- [ ] Tab toolbars wrap cleanly or scroll horizontally without clipping.
- [ ] Alert banners do not allow title/description text to collide with right-side action buttons.
