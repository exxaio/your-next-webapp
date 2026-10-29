"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { LinkSquare02Icon } from "@hugeicons/core-free-icons"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    external?: boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isExternal = item.external ?? item.url.startsWith("http")
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  size="sm"
                  render={
                    <a
                      href={item.url}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    />
                  }
                >
                  {item.icon}
                  <span className="truncate">{item.title}</span>
                  {isExternal && (
                    <HugeiconsIcon
                      icon={LinkSquare02Icon}
                      strokeWidth={2}
                      className="ml-auto size-3! text-muted-foreground/60 opacity-0 transition-opacity duration-150 group-hover/menu-button:opacity-100 group-data-[collapsible=icon]:hidden"
                    />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
