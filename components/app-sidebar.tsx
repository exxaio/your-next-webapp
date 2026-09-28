"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
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
} from "@hugeicons/core-free-icons"

function SidebarThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const tSidebar = useTranslations("Sidebar")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={
            isDark
              ? tSidebar("switchToLightMode")
              : tSidebar("switchToDarkMode")
          }
          onClick={toggleTheme}
          aria-label={
            isDark
              ? tSidebar("switchToLightMode")
              : tSidebar("switchToDarkMode")
          }
        >
          {isDark ? (
            <HugeiconsIcon icon={Sun01Icon} strokeWidth={2} />
          ) : (
            <HugeiconsIcon icon={Moon01Icon} strokeWidth={2} />
          )}
          <span>{isDark ? tSidebar("lightMode") : tSidebar("darkMode")}</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none group-data-[collapsible=icon]:hidden sm:inline-flex">
            D
          </kbd>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tNav = useTranslations("Navigation")
  const tSidebar = useTranslations("Sidebar")

  const data = React.useMemo(
    () => ({
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        {
          title: tNav("playground"),
          url: "#",
          icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
          isActive: true,
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
          icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
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
    [tNav, tSidebar]
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
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
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
        <SidebarThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
