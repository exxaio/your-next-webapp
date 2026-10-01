"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"

import { HugeiconsIcon } from "@hugeicons/react"
import { GlobeIcon } from "@hugeicons/core-free-icons"

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
      variant="outline"
      size="sm"
      aria-label={isZh ? "Switch to English" : "切换为中文"}
      onClick={handleSwitch}
      disabled={isPending}
      className={cn(
        "h-7 gap-1.5 rounded-md border-border/80 bg-muted/40 px-2 font-medium tracking-wide tabular-nums shadow-xs",
        "hover:bg-muted/80 hover:text-foreground active:scale-[0.98]",
        "transition-all duration-200",
        isPending && "opacity-50",
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        icon={GlobeIcon}
        strokeWidth={2}
        className="size-3.5 text-muted-foreground/70"
      />
      <span className="flex items-center gap-0.5">
        <span
          className={cn(
            "transition-all duration-200",
            !isZh
              ? "text-xs font-bold text-foreground"
              : "text-[11px] font-normal text-muted-foreground/50"
          )}
        >
          EN
        </span>
        <span className="mx-0.5 text-[10px] text-muted-foreground/30 select-none">
          /
        </span>
        <span
          className={cn(
            "transition-all duration-200",
            isZh
              ? "text-xs font-bold text-foreground"
              : "text-[11px] font-normal text-muted-foreground/50"
          )}
        >
          中
        </span>
      </span>
    </Button>
  )
}

export { LanguageSwitcher }
