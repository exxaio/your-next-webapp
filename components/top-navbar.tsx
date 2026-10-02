"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { useSearchParams } from "next/navigation"

import { Link, usePathname } from "@/i18n/routing"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface NavbarContextType {
  actions: React.ReactNode | null
  setActions: (actions: React.ReactNode | null) => void
  breadcrumbs: BreadcrumbItemType[] | null
  setBreadcrumbs: (breadcrumbs: BreadcrumbItemType[] | null) => void
}

const NavbarContext = React.createContext<NavbarContextType | null>(null)

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = React.useState<React.ReactNode | null>(null)
  const [breadcrumbs, setBreadcrumbs] = React.useState<
    BreadcrumbItemType[] | null
  >(null)

  return (
    <NavbarContext.Provider
      value={{ actions, setActions, breadcrumbs, setBreadcrumbs }}
    >
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  return React.useContext(NavbarContext)
}

export function NavbarActions({ children }: { children: React.ReactNode }) {
  const navbar = useNavbar()

  React.useEffect(() => {
    navbar?.setActions(children)
    return () => {
      navbar?.setActions(null)
    }
  }, [children, navbar])

  return null
}

export function NavbarBreadcrumbs({ items }: { items: BreadcrumbItemType[] }) {
  const navbar = useNavbar()

  React.useEffect(() => {
    navbar?.setBreadcrumbs(items)
    return () => {
      navbar?.setBreadcrumbs(null)
    }
  }, [items, navbar])

  return null
}

function useResolvedBreadcrumbs(customBreadcrumbs: BreadcrumbItemType[] | null) {
  const tNav = useTranslations("Navigation")
  const tSidebar = useTranslations("Sidebar")
  const tPlayground = useTranslations("Playground")
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return React.useMemo<BreadcrumbItemType[]>(() => {
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs
    }

    const cleanPath = pathname?.replace(/\/$/, "") || ""

    if (cleanPath === "/dashboard" || cleanPath === "") {
      return [{ label: tNav("dashboard") }]
    }

    if (cleanPath === "/analytics" || cleanPath.startsWith("/analytics")) {
      return [
        { label: tNav("dashboard"), href: "/dashboard" },
        { label: tSidebar("analytics") },
      ]
    }

    if (cleanPath === "/monitoring" || cleanPath.startsWith("/monitoring")) {
      return [
        { label: tNav("dashboard"), href: "/dashboard" },
        { label: tSidebar("monitoring") },
      ]
    }

    if (cleanPath === "/playground" || cleanPath.startsWith("/playground")) {
      const tabParam = searchParams.get("tab")
      const modeParam = searchParams.get("mode")
      const current = tabParam || modeParam
      const tabLabel =
        current === "history"
          ? tSidebar("history")
          : current === "starred"
            ? tSidebar("starred")
            : current === "parameters"
              ? tNav("settings")
              : current === "compare"
                ? tPlayground("modeCompare")
                : current === "complete"
                  ? tPlayground("modeComplete")
                  : tPlayground("modeChat")

      return [
        { label: tNav("playground"), href: "/playground" },
        { label: tabLabel },
      ]
    }

    if (cleanPath === "/account" || cleanPath.startsWith("/account")) {
      return [
        { label: tNav("settings"), href: "/account" },
        { label: tSidebar("account") },
      ]
    }

    if (cleanPath === "/billing" || cleanPath.startsWith("/billing")) {
      return [
        { label: tNav("settings"), href: "/account" },
        { label: tSidebar("billing") },
      ]
    }

    if (cleanPath === "/team" || cleanPath.startsWith("/team")) {
      return [
        { label: tNav("settings"), href: "/account" },
        { label: tSidebar("team") },
      ]
    }

    if (cleanPath === "/models" || cleanPath.startsWith("/models")) {
      const familyParam = searchParams.get("family")
      const familyLabel = familyParam
        ? familyParam.charAt(0).toUpperCase() + familyParam.slice(1)
        : tSidebar("allModels")

      return [
        { label: tNav("models"), href: "/models" },
        { label: familyLabel },
      ]
    }

    if (cleanPath === "/workflows" || cleanPath.startsWith("/workflows")) {
      return [
        { label: tNav("workflows"), href: "/workflows" },
        { label: tSidebar("builder") },
      ]
    }

    // Fallback for any other paths
    const segments = cleanPath.split("/").filter(Boolean)
    if (segments.length === 0) {
      return [{ label: tNav("dashboard") }]
    }

    const navKeys = [
      "dashboard",
      "analytics",
      "playground",
      "models",
      "workflows",
      "documentation",
      "settings",
      "support",
      "feedback",
      "account",
      "billing",
      "team",
      "monitoring",
    ] as const

    const items: BreadcrumbItemType[] = []

    segments.forEach((seg, idx) => {
      const isLast = idx === segments.length - 1
      const segLower = seg.toLowerCase() as (typeof navKeys)[number]
      const label = navKeys.includes(segLower)
        ? tNav(segLower)
        : seg.charAt(0).toUpperCase() + seg.slice(1)

      items.push({
        label,
        href: isLast ? undefined : `/${segments.slice(0, idx + 1).join("/")}`,
      })
    })

    return items
  }, [customBreadcrumbs, pathname, searchParams, tNav, tSidebar, tPlayground])
}

function BreadcrumbNavContent() {
  const navbar = useNavbar()
  const breadcrumbs = useResolvedBreadcrumbs(navbar?.breadcrumbs ?? null)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <React.Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem
                className={
                  !isLast ? "hidden shrink-0 md:inline-flex" : "min-w-0"
                }
              >
                {isLast || !crumb.href ? (
                  <BreadcrumbPage className="max-w-[140px] truncate sm:max-w-[220px] md:max-w-none">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="hidden shrink-0 md:inline-flex" />
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function TopNavbar() {
  const navbar = useNavbar()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-2 shrink-0 data-vertical:h-4 data-vertical:self-auto"
        />
        <React.Suspense
          fallback={<div className="h-4 w-28 animate-pulse rounded bg-muted/60" />}
        >
          <BreadcrumbNavContent />
        </React.Suspense>
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
  )
}
