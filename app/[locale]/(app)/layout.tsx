import { setRequestLocale } from "next-intl/server"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TopNavbar, NavbarProvider } from "@/components/top-navbar"

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <NavbarProvider>
            <TopNavbar />
            {children}
          </NavbarProvider>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
