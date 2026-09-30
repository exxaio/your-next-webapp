"use client"

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
import { Link } from "@/i18n/routing"

import { ProfileSection } from "@/components/account/profile-section"
import { ConnectedProviders } from "@/components/account/connected-providers"
import { ChangePasswordSection } from "@/components/account/change-password-section"
import { DangerZone } from "@/components/account/danger-zone"

export default function AccountPage() {
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

          <main className="flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 pt-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Account Settings
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your personal profile, connected authentication
                providers, and security settings.
              </p>
            </div>

            <ProfileSection />
            <ConnectedProviders />
            <ChangePasswordSection />
            <DangerZone />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
