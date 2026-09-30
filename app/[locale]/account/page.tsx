"use client"

import * as React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { Link } from "@/i18n/routing"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Shield01Icon,
  AlertCircleIcon,
  CheckmarkBadgeIcon,
} from "@hugeicons/core-free-icons"

import { ProfileSection } from "@/components/account/profile-section"
import { ConnectedProviders } from "@/components/account/connected-providers"
import { ChangePasswordSection } from "@/components/account/change-password-section"
import { DangerZone } from "@/components/account/danger-zone"

function getInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return "U"
}

export default function AccountPage() {
  const { user } = useAuth()

  const linkedCount = user?.providerData?.length ?? 0
  const initials = getInitials(user?.displayName, user?.email)

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink render={<Link href="/dashboard" />}>
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Account</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 p-4 pt-0 md:p-6 md:pt-0">
            {/* Page Header & Quick User Summary */}
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Account Settings
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your personal profile, connected authentication
                  providers, and security settings.
                </p>
              </div>

              {/* User Overview Banner */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-center gap-3.5">
                  <Avatar className="size-12 ring-2 ring-border/50">
                    <AvatarImage
                      src={user?.photoURL ?? ""}
                      alt={user?.displayName ?? "User avatar"}
                    />
                    <AvatarFallback className="bg-muted text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {user?.displayName || "Signed-in User"}
                      </span>
                      <Badge
                        variant="secondary"
                        className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkBadgeIcon}
                          className="size-3"
                        />
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "No email associated"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1">
                    {linkedCount}
                    {" Sign-in "}
                    {linkedCount === 1 ? "Provider" : "Providers"}
                  </span>
                </div>
              </div>
            </div>

            {/* Group 1: Personal Details */}
            <div id="profile-section" className="scroll-mt-6 space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={UserIcon} className="size-3.5" />
                </span>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Personal Information
                </span>
              </div>
              <Card className="border border-border/80 bg-card p-6 shadow-xs sm:p-7">
                <ProfileSection />
              </Card>
            </div>

            {/* Group 2: Authentication & Security */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <span className="flex size-6 items-center justify-center rounded-md border border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300">
                  <HugeiconsIcon icon={Shield01Icon} className="size-3.5" />
                </span>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Authentication & Credentials
                </span>
              </div>

              {/* Section Card: Connected Sign-In Methods (Active/Violet Surface) */}
              <div id="connected-providers-section" className="scroll-mt-6">
                <Card className="border border-violet-500/25 bg-violet-50/40 p-6 shadow-xs sm:p-7 dark:border-violet-500/30 dark:bg-violet-500/[0.06]">
                  <ConnectedProviders />
                </Card>
              </div>

              {/* Section Card: Password & Credentials (Warning/Amber Surface) */}
              <div id="security-section" className="scroll-mt-6">
                <Card className="border border-amber-500/25 bg-amber-50/40 p-6 shadow-xs sm:p-7 dark:border-amber-500/30 dark:bg-amber-500/[0.06]">
                  <ChangePasswordSection defaultOpen={false} />
                </Card>
              </div>
            </div>

            {/* Group 3: Danger Zone */}
            <div
              id="danger-zone-section"
              className="scroll-mt-6 space-y-3 pb-8"
            >
              <div className="flex items-center gap-2 px-1">
                <span className="flex size-6 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5" />
                </span>
                <span className="text-xs font-semibold tracking-wider text-red-700 uppercase dark:text-red-400">
                  Critical Actions
                </span>
              </div>
              <Card className="border border-red-500/25 bg-red-50/40 p-6 shadow-xs sm:p-7 dark:border-red-500/30 dark:bg-red-500/[0.06]">
                <DangerZone />
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
