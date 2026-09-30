"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function LanguageSwitcher({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const isZh = locale === "zh-CN"
  const nextLocale = isZh ? "en" : "zh-CN"

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as "en" | "zh-CN" })
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={isZh ? "Switch to English" : "切换为中文"}
      onClick={handleSwitch}
      disabled={isPending}
      className={cn(
        "h-8 gap-0 px-2 font-medium tracking-wide tabular-nums",
        "text-muted-foreground hover:text-foreground",
        "transition-all duration-200",
        isPending && "opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "transition-all duration-200",
          !isZh ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        EN
      </span>
      <span className="mx-1 text-muted-foreground/50 select-none">/</span>
      <span
        className={cn(
          "transition-all duration-200",
          isZh ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        中
      </span>
    </Button>
  )
}

export { LanguageSwitcher }
