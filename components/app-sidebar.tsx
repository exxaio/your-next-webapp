"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { usePathname, useRouter } from "@/i18n/routing"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerTerminalIcon,
  RoboticIcon,
  BookOpen02Icon,
  Settings05Icon,
  ChartRingIcon,
  SentIcon,
  CropIcon,
  PieChartIcon,
  MapsIcon,
  CommandIcon,
  Sun01Icon,
  Moon01Icon,
  GlobeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

function useIsMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function SidebarThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsMounted()
  const tSidebar = useTranslations("Sidebar")

  const isDark = mounted && resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={
          isDark ? tSidebar("switchToLightMode") : tSidebar("switchToDarkMode")
        }
        onClick={toggleTheme}
        aria-label={
          isDark ? tSidebar("switchToLightMode") : tSidebar("switchToDarkMode")
        }
      >
        {isDark ? (
          <HugeiconsIcon icon={Sun01Icon} strokeWidth={2} />
        ) : (
          <HugeiconsIcon icon={Moon01Icon} strokeWidth={2} />
        )}
        <span>{isDark ? tSidebar("lightMode") : tSidebar("darkMode")}</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium opacity-100 select-none group-data-[collapsible=icon]:hidden sm:inline-flex">
          D
        </kbd>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarLanguagePicker() {
  const { isMobile } = useSidebar()
  const tCommon = useTranslations("Common")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  const handleLanguageChange = (nextLocale: "en" | "zh-CN") => {
    startTransition(() => {
      // Use window.location for a hard refresh to avoid hydration issues
      const newPath = `/${nextLocale}${pathname === "/" ? "" : pathname}`
      window.location.href = newPath
    })
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              className="aria-expanded:bg-muted"
              aria-label={tCommon("language")}
              title={tCommon("language")}
            />
          }
        >
          <HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />
          <span>{tCommon("language")}</span>
          <span className="pointer-events-none ml-auto hidden h-5 items-center rounded border bg-muted px-1.5 font-sans text-[11px] font-medium opacity-100 select-none group-data-[collapsible=icon]:hidden sm:inline-flex">
            {locale === "zh-CN" ? "中文" : "EN"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-36 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuItem
            onClick={() => handleLanguageChange("en")}
            className="flex items-center justify-between"
            disabled={isPending}
          >
            <span>{tCommon("english")}</span>
            {locale === "en" && (
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-3.5"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLanguageChange("zh-CN")}
            className="flex items-center justify-between"
            disabled={isPending}
          >
            <span>{tCommon("chinese")}</span>
            {locale === "zh-CN" && (
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-3.5"
              />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tNav = useTranslations("Navigation")
  const tSidebar = useTranslations("Sidebar")
  const { user: authUser } = useAuth()

  const data = React.useMemo(
    () => ({
      user: {
        name: authUser?.displayName ?? authUser?.email ?? "Guest",
        email: authUser?.email ?? "",
        avatar: authUser?.photoURL ?? "",
      },
      navMain: [
        {
          title: tNav("dashboard"),
          url: "#",
          icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
          isActive: true,
          items: [
            {
              title: tSidebar("analytics"),
              url: "#",
            },
          ],
        },
        {
          title: tNav("playground"),
          url: "#",
          icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
          items: [
            {
              title: tSidebar("history"),
              url: "#",
            },
            {
              title: tSidebar("starred"),
              url: "#",
            },
            {
              title: tNav("settings"),
              url: "#",
            },
          ],
        },
        {
          title: tNav("models"),
          url: "#",
          icon: <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />,
          items: [
            {
              title: tSidebar("genesis"),
              url: "#",
            },
            {
              title: tSidebar("explorer"),
              url: "#",
            },
            {
              title: tSidebar("quantum"),
              url: "#",
            },
          ],
        },
        {
          title: tNav("documentation"),
          url: "#",
          icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
          items: [
            {
              title: tSidebar("introduction"),
              url: "#",
            },
            {
              title: tSidebar("getStarted"),
              url: "#",
            },
            {
              title: tSidebar("tutorials"),
              url: "#",
            },
            {
              title: tSidebar("changelog"),
              url: "#",
            },
          ],
        },
        {
          title: tNav("settings"),
          url: "#",
          icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
          items: [
            {
              title: tSidebar("general"),
              url: "#",
            },
            {
              title: tSidebar("team"),
              url: "#",
            },
            {
              title: tSidebar("billing"),
              url: "#",
            },
            {
              title: tSidebar("limits"),
              url: "#",
            },
          ],
        },
      ],
      navSecondary: [
        {
          title: tNav("support"),
          url: "#",
          icon: <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />,
        },
        {
          title: tNav("feedback"),
          url: "#",
          icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
        },
      ],
      projects: [
        {
          name: tSidebar("designEngineering"),
          url: "#",
          icon: <HugeiconsIcon icon={CropIcon} strokeWidth={2} />,
        },
        {
          name: tSidebar("salesMarketing"),
          url: "#",
          icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
        },
        {
          name: tSidebar("travel"),
          url: "#",
          icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
        },
      ],
    }),
    [tNav, tSidebar, authUser]
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon
                  icon={CommandIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium">NextWebapp</span>
                <span className="truncate text-sm">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarThemeToggle />
          <SidebarLanguagePicker />
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
