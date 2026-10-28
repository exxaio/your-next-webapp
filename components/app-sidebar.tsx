"use client"

import * as React from "react"
import Image from "next/image"
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
  ChartRingIcon,
  SentIcon,
  CropIcon,
  PieChartIcon,
  MapsIcon,
  CommandIcon,
  FlowConnectionIcon,
  Settings02Icon,
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
          isActive:
            pathname === "/dashboard" ||
            pathname === "/analytics" ||
            pathname === "/monitoring",
          items: [
            {
              title: tSidebar("overview"),
              url: "/dashboard",
              isActive: pathname === "/dashboard",
            },
            {
              title: tSidebar("analytics"),
              url: "/analytics",
              isActive: pathname === "/analytics",
            },
            {
              title: tSidebar("monitoring"),
              url: "/monitoring",
              isActive: pathname === "/monitoring",
            },
          ],
        },
        {
          title: tNav("workflows"),
          url: "/workflows",
          icon: <HugeiconsIcon icon={FlowConnectionIcon} strokeWidth={2} />,
          isActive:
            pathname === "/workflows" || pathname?.startsWith("/workflows"),
          items: [
            {
              title: tSidebar("builder"),
              url: "/workflows",
              isActive: pathname === "/workflows",
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
          url: "/models",
          icon: <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />,
          isActive: pathname === "/models" || pathname?.startsWith("/models"),
          items: [
            {
              title: tSidebar("allModels"),
              url: "/models",
              isActive: pathname === "/models",
            },
            {
              title: tSidebar("genesis"),
              url: "/models?family=genesis",
            },
            {
              title: tSidebar("explorer"),
              url: "/models?family=explorer",
            },
            {
              title: tSidebar("quantum"),
              url: "/models?family=quantum",
            },
          ],
        },
        {
          title: tNav("settings"),
          url: "/account",
          icon: <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />,
          isActive:
            pathname === "/account" ||
            pathname === "/billing" ||
            pathname === "/team",
          items: [
            {
              title: tSidebar("account"),
              url: "/account",
              isActive: pathname === "/account",
            },
            {
              title: tSidebar("billing"),
              url: "/billing",
              isActive: pathname === "/billing",
            },
            {
              title: tSidebar("team"),
              url: "/team",
              isActive: pathname === "/team",
            },
          ],
        },
        {
          title: tNav("documentation"),
          url: "/dashboard#architecture",
          icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
          items: [
            {
              title: tSidebar("archetypes"),
              url: "/dashboard#archetypes",
            },
            {
              title: tSidebar("architecture"),
              url: "/dashboard#architecture",
            },
            {
              title: tSidebar("getStarted"),
              url: "/dashboard#quickstart",
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
              <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="YourNext Webapp Logo"
                  width={32}
                  height={32}
                  className="size-8 rounded-lg object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium">YourNext</span>
                <span className="truncate text-xs">Webapp</span>
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
