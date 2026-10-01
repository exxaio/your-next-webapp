import { setRequestLocale } from "next-intl/server"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"

import { Link } from "@/i18n/routing"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-background">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-10%] -bottom-32 size-96 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10"
        aria-hidden="true"
      />

      {/* Top navigation header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
            <HugeiconsIcon
              icon={LayoutBottomIcon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <span className="text-base font-bold tracking-tight">NextWebapp</span>
        </Link>

        {/* Theme and language switcher */}
        <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2 py-1 shadow-xs backdrop-blur-md">
          <LanguageSwitcher />
          <div className="h-3.5 w-px bg-border/60" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main card container */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[440px]">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground/80">
        <p>© {new Date().getFullYear()} NextWebapp Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
