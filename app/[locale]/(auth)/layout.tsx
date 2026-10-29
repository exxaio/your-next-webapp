import Image from "next/image"
import { setRequestLocale } from "next-intl/server"

import { Link } from "@/i18n/routing"
import { Github01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
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
          <div className="flex size-7 items-center justify-center overflow-hidden rounded-lg shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="YourNext Webapp Logo"
              width={28}
              height={28}
              className="size-7 rounded-lg object-contain"
            />
          </div>
          <span className="text-base font-bold tracking-tight">
            YourNext Webapp
          </span>
        </Link>

        {/* Theme, language switcher, and GitHub link */}
        <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2 py-1 shadow-xs backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full text-muted-foreground hover:text-foreground"
            render={
              <a
                href="https://github.com/exxaio/your-next-webapp#readme"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              />
            }
          >
            <HugeiconsIcon
              icon={Github01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </Button>
          <div className="h-3.5 w-px bg-border/60" />
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
        <p className="flex items-center justify-center gap-2">
          <span>
            © {new Date().getFullYear()} YourNext Webapp Inc. All rights
            reserved.
          </span>
          <span>•</span>
          <a
            href="https://github.com/exxaio/your-next-webapp#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 underline underline-offset-4 transition-colors hover:text-foreground"
          >
            <span>GitHub</span>
            <HugeiconsIcon
              icon={LinkSquare02Icon}
              className="size-3 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </a>
        </p>
      </footer>
    </div>
  )
}
