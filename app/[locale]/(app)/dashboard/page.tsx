"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  FlowConnectionIcon,
  ChartRingIcon,
  Settings02Icon,
  ArrowRight01Icon,
  SecurityIcon,
  CommandIcon,
  GlobeIcon,
  BookOpen02Icon,
  CheckmarkBadge01Icon,
  Activity01Icon,
  ComputerTerminalIcon,
  RoboticIcon,
  UserGroupIcon,
  CreditCardIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/page-container"
import { NavbarActions } from "@/components/top-navbar"

export default function DashboardLandingPage() {
  const t = useTranslations("Dashboard")
  const tNav = useTranslations("Navigation")
  const tSidebar = useTranslations("Sidebar")

  return (
    <>
      <NavbarActions>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/workflows" />}
            className="gap-1.5"
          >
            <HugeiconsIcon
              icon={FlowConnectionIcon}
              className="size-3.5 text-accent"
            />
            <span className="hidden sm:inline">{t("exploreWorkflows")}</span>
          </Button>
        </div>
      </NavbarActions>

      <PageContainer variant="workspace">
        <h1 className="sr-only">{t("landingTitle")}</h1>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
              >
                <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
                {t("badgeStarter")}
              </Badge>
              <Badge
                variant="outline"
                className="border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                Next.js 15 • React 19 • Tailwind v4
              </Badge>
            </div>

            <div className="max-w-3xl space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("landingTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("landingSubtitle")}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="default"
                size="sm"
                render={<Link href="/workflows" />}
                className="gap-2 shadow-xs"
              >
                <HugeiconsIcon icon={FlowConnectionIcon} className="size-4" />
                <span>{t("exploreWorkflows")}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/analytics" />}
                className="gap-2"
              >
                <HugeiconsIcon icon={ChartRingIcon} className="size-4" />
                <span>{t("viewAnalytics")}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                render={<a href="#architecture" />}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={BookOpen02Icon} className="size-4" />
                <span>{t("architectureTitle")}</span>
              </Button>
            </div>
          </div>

          {/* Decorative subtle ambient gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/5 blur-3xl"
          />
        </div>

        {/* Section 1: The 3 Layout Archetypes */}
        <section id="archetypes" className="space-y-4">
          <div className="flex flex-col gap-1 px-1">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <HugeiconsIcon icon={Layers01Icon} className="size-3.5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {t("archetypesTitle")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t("archetypesSubtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Archetype 1: Settings */}
            <Card className="flex flex-col justify-between border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Settings02Icon} className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 font-mono text-[11px] text-primary"
                  >
                    variant=&quot;settings&quot;
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    {t("archetype1Title")}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {t("archetype1Desc")}
                  </p>
                </div>

                {/* Visual Mini Mockup */}
                <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                  <div className="mx-auto flex w-4/5 flex-col gap-1.5">
                    <div className="h-2 w-1/3 rounded-xs bg-muted-foreground/30" />
                    <div className="h-6 w-full rounded-xs border border-border/80 bg-card shadow-2xs" />
                    <div className="h-6 w-full rounded-xs border border-border/80 bg-card shadow-2xs" />
                  </div>
                  <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground/70">
                    max-w-4xl • Single Column Centered
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Key Conventions
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("archetype1Features")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="text-[11px] font-medium text-muted-foreground">
                  {t("liveDemos")}:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/account" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tSidebar("account")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/billing" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={CreditCardIcon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tSidebar("billing")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/team" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tSidebar("team")}</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Archetype 2: Content & Workspace */}
            <Card className="flex flex-col justify-between border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-accent/40 hover:shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <HugeiconsIcon icon={ChartRingIcon} className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-accent/30 bg-accent/10 font-mono text-[11px] text-accent"
                  >
                    variant=&quot;workspace&quot;
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    {t("archetype2Title")}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {t("archetype2Desc")}
                  </p>
                </div>

                {/* Visual Mini Mockup */}
                <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-6 rounded-xs border border-border/80 bg-card shadow-2xs" />
                    <div className="h-6 rounded-xs border border-border/80 bg-card shadow-2xs" />
                    <div className="h-6 rounded-xs border border-border/80 bg-card shadow-2xs" />
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    <div className="h-7 rounded-xs border border-border/80 bg-card shadow-2xs" />
                    <div className="h-7 rounded-xs border border-border/80 bg-card shadow-2xs" />
                  </div>
                  <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground/70">
                    Fluid Operational Grid • Recharts • Tables
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Key Conventions
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("archetype2Features")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="text-[11px] font-medium text-muted-foreground">
                  {t("liveDemos")}:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/analytics" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={ChartRingIcon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tSidebar("analytics")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/monitoring" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={Activity01Icon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tSidebar("monitoring")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/playground" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={ComputerTerminalIcon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tNav("playground")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    render={<Link href="/models" />}
                    className="gap-1 text-xs"
                  >
                    <HugeiconsIcon
                      icon={RoboticIcon}
                      className="size-3 text-muted-foreground"
                    />
                    <span>{tNav("models")}</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Archetype 3: Interactive Canvas */}
            <Card className="flex flex-col justify-between border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-chart-1/40 hover:shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-chart-1/15 text-chart-1">
                    <HugeiconsIcon
                      icon={FlowConnectionIcon}
                      className="size-5"
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-chart-1/30 bg-chart-1/10 font-mono text-[11px] text-chart-1"
                  >
                    variant=&quot;canvas&quot;
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    {t("archetype3Title")}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {t("archetype3Desc")}
                  </p>
                </div>

                {/* Visual Mini Mockup */}
                <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="h-10 w-1/5 rounded-xs border border-border/80 bg-card shadow-2xs" />
                    <div className="relative flex h-10 flex-1 items-center justify-center">
                      <div className="h-0.5 w-full bg-accent/40" />
                      <div className="absolute size-4 rounded-full border border-accent bg-card text-center text-[8px] font-bold text-accent" />
                    </div>
                    <div className="h-10 w-1/4 rounded-xs border border-border/80 bg-card shadow-2xs" />
                  </div>
                  <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground/70">
                    Viewport-Locked • Infinite Pan/Zoom DAG
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Key Conventions
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("archetype3Features")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="text-[11px] font-medium text-muted-foreground">
                  {t("referenceImplementation")}:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant="default"
                    size="xs"
                    render={<Link href="/workflows" />}
                    className="gap-1.5 text-xs shadow-2xs"
                  >
                    <HugeiconsIcon
                      icon={FlowConnectionIcon}
                      className="size-3"
                    />
                    <span>{tSidebar("builder")}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 2: How the Demo Pages Are Setup */}
        <section id="architecture" className="space-y-4 pt-2">
          <div className="flex flex-col gap-1 px-1">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <HugeiconsIcon icon={CommandIcon} className="size-3.5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {t("architectureTitle")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t("architectureSubtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: App Router & Protected Routing */}
            <Card className="border border-border bg-card p-5 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={SecurityIcon} className="size-4.5" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">
                {t("archRoutingTitle")}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t("archRoutingDesc")}
              </p>
            </Card>

            {/* Card 2: TopNavbar Portal */}
            <Card className="border border-border bg-card p-5 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <HugeiconsIcon icon={CommandIcon} className="size-4.5" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">
                {t("archNavbarTitle")}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t("archNavbarDesc")}
              </p>
            </Card>

            {/* Card 3: Design Tokens & Dark Mode */}
            <Card className="border border-border bg-card p-5 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
                <HugeiconsIcon icon={SparklesIcon} className="size-4.5" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">
                {t("archDesignTitle")}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t("archDesignDesc")}
              </p>
            </Card>

            {/* Card 4: Type-Safe i18n */}
            <Card className="border border-border bg-card p-5 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-lg bg-chart-4/15 text-chart-4">
                <HugeiconsIcon icon={GlobeIcon} className="size-4.5" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">
                {t("archI18nTitle")}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t("archI18nDesc")}
              </p>
            </Card>
          </div>
        </section>

        {/* Section 3: Quickstart Checklist */}
        <section id="quickstart" className="space-y-4 pt-2">
          <Card className="border border-border bg-card p-6 shadow-xs">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-success/15 text-success">
                  <HugeiconsIcon
                    icon={CheckmarkBadge01Icon}
                    className="size-3.5"
                  />
                </span>
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  {t("quickstartTitle")}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {t("quickstartSubtitle")}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-muted/20 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    1
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {t("step1")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("step1Desc")}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-muted/20 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    2
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {t("step2")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("step2Desc")}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-muted/20 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    3
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {t("step3")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("step3Desc")}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-muted/20 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    4
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {t("step4")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("step4Desc")}
                </p>
              </div>
            </div>
          </Card>
        </section>
      </PageContainer>
    </>
  )
}
