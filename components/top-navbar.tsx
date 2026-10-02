"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

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

export function TopNavbar() {
  const tNav = useTranslations("Navigation")
  const tSidebar = useTranslations("Sidebar")
  const tPlayground = useTranslations("Playground")
  const pathname = usePathname()
  const navbar = useNavbar()

  const breadcrumbs = React.useMemo<BreadcrumbItemType[]>(() => {
    if (navbar?.breadcrumbs && navbar.breadcrumbs.length > 0) {
      return navbar.breadcrumbs
    }

    const cleanPath = pathname?.replace(/\/$/, "") || ""

    if (cleanPath === "/dashboard" || cleanPath === "") {
      return [
        { label: tNav("dashboard"), href: "/dashboard" },
        { label: tSidebar("analytics") },
      ]
    }

    if (cleanPath === "/playground" || cleanPath.startsWith("/playground")) {
      return [
        { label: tNav("playground"), href: "/playground" },
        { label: tPlayground("modeChat") },
      ]
    }

    if (cleanPath === "/account" || cleanPath.startsWith("/account")) {
      return [
        { label: tNav("settings"), href: "/account" },
        { label: tSidebar("account") },
      ]
    }

    if (cleanPath === "/models" || cleanPath.startsWith("/models")) {
      return [
        { label: tNav("models"), href: "/models" },
        { label: tSidebar("allModels") },
      ]
    }

    if (cleanPath === "/monitoring" || cleanPath.startsWith("/monitoring")) {
      return [
        { label: tNav("dashboard"), href: "/dashboard" },
        { label: tSidebar("monitoring") },
      ]
    }

    if (cleanPath === "/billing" || cleanPath.startsWith("/billing")) {
      return [
        { label: tNav("account"), href: "/account" },
        { label: tNav("billing") },
      ]
    }

    if (cleanPath === "/team" || cleanPath.startsWith("/team")) {
      return [
        { label: tNav("account"), href: "/account" },
        { label: tNav("team") },
      ]
    }

    // Fallback for any other paths
    const segments = cleanPath.split("/").filter(Boolean)
    if (segments.length === 0) {
      return [{ label: tNav("dashboard") }]
    }

    const navKeys = [
      "dashboard",
      "playground",
      "models",
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
  }, [navbar?.breadcrumbs, pathname, tNav, tSidebar, tPlayground])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-2 shrink-0 data-vertical:h-4 data-vertical:self-auto"
        />
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
