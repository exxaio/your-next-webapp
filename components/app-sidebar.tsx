"use client"

import * as React from "react"
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
import { useAuth } from "@/hooks/use-auth"
import { Link, usePathname } from "@/i18n/routing"
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
} from "@hugeicons/core-free-icons"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tNav = useTranslations("Navigation")
  const tSidebar = useTranslations("Sidebar")
  const tPlayground = useTranslations("Playground")
  const { user: authUser } = useAuth()
  const pathname = usePathname()

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
          url: "/dashboard",
          icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
          isActive: pathname === "/dashboard",
          items: [
            {
              title: tSidebar("analytics"),
              url: "/dashboard",
              isActive: pathname === "/dashboard",
            },
          ],
        },
        {
          title: tNav("playground"),
          url: "/playground",
          icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
          isActive:
            pathname === "/playground" || pathname?.startsWith("/playground"),
          items: [
            {
              title: tPlayground("modeChat"),
              url: "/playground",
              isActive: pathname === "/playground",
            },
            {
              title: tSidebar("history"),
              url: "/playground?tab=history",
            },
            {
              title: tSidebar("starred"),
              url: "/playground?tab=starred",
            },
            {
              title: tNav("settings"),
              url: "/playground?tab=parameters",
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
          url: "/account",
          icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
          isActive: pathname === "/account",
          items: [
            {
              title: tSidebar("account"),
              url: "/account",
              isActive: pathname === "/account",
            },
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
    [tNav, tSidebar, tPlayground, authUser, pathname]
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon
                  icon={CommandIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium">NextWebapp</span>
                <span className="truncate text-sm">Demo</span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
