"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  SparklesIcon,
  CheckmarkBadgeIcon,
  Download01Icon,
  AlertCircleIcon,
  PlusSignIcon,
  CpuIcon,
  Database01Icon,
  UserGroupIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/page-container"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const INVOICES = [
  {
    id: "INV-2026-009",
    date: "Sep 14, 2026",
    amount: "$79.00",
    status: "Paid",
  },
  {
    id: "INV-2026-008",
    date: "Aug 14, 2026",
    amount: "$79.00",
    status: "Paid",
  },
  {
    id: "INV-2026-007",
    date: "Jul 14, 2026",
    amount: "$79.00",
    status: "Paid",
  },
  {
    id: "INV-2026-006",
    date: "Jun 14, 2026",
    amount: "$79.00",
    status: "Paid",
  },
]

export default function BillingPage() {
  const t = useTranslations("Billing")
  const [selectedPlan, setSelectedPlan] = React.useState<
    "hobby" | "pro" | "enterprise"
  >("pro")
  const [isAddCardOpen, setIsAddCardOpen] = React.useState(false)

  return (
    <PageContainer variant="settings">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Overview Banner */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={SparklesIcon} className="size-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {t("proPlan")}
                </span>
                <Badge
                  variant="secondary"
                  className="gap-1 border-success/30 bg-success/5 text-[11px] font-medium text-success"
                >
                  <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-3" />
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("planBillingCycle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById("subscription-plans")
                el?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {t("managePlan")}
            </Button>
          </div>
        </div>
      </div>

      {/* Group 1: Resource Quotas & Usage */}
      <div id="quotas" className="scroll-mt-6 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <HugeiconsIcon icon={CpuIcon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("resourceUsage")}
          </span>
        </div>

        <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="mb-4">
            <h3 className="text-base font-semibold">{t("resourceUsage")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("resourceUsageDesc")}
            </p>
          </div>

          <div className="space-y-5">
            <Progress
              value={78}
              className="[&_[data-slot=progress-indicator]]:bg-primary"
            >
              <div className="flex justify-between text-xs">
                <ProgressLabel>{t("apiTokens")}</ProgressLabel>
                <span className="font-mono text-muted-foreground">
                  7.8M / 10.0M (78%)
                </span>
              </div>
              <ProgressValue />
            </Progress>

            <Progress
              value={45}
              className="[&_[data-slot=progress-indicator]]:bg-accent"
            >
              <div className="flex justify-between text-xs">
                <ProgressLabel>{t("gpuCompute")}</ProgressLabel>
                <span className="font-mono text-muted-foreground">
                  45.0 / 100.0 hrs (45%)
                </span>
              </div>
              <ProgressValue />
            </Progress>

            <Progress value={62}>
              <div className="flex justify-between text-xs">
                <ProgressLabel>{t("storageUsage")}</ProgressLabel>
                <span className="font-mono text-muted-foreground">
                  31.0 / 50.0 GB (62%)
                </span>
              </div>
              <ProgressValue />
            </Progress>

            <Progress
              value={40}
              className="[&_[data-slot=progress-indicator]]:bg-success"
            >
              <div className="flex justify-between text-xs">
                <ProgressLabel>{t("teamSeats")}</ProgressLabel>
                <span className="font-mono text-muted-foreground">
                  4 / 10 seats
                </span>
              </div>
              <ProgressValue />
            </Progress>
          </div>
        </Card>
      </div>

      {/* Group 2: Subscription Plans Tier Matrix */}
      <div id="subscription-plans" className="scroll-mt-6 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("subscriptionPlans")}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Starter Plan */}
          <Card
            className={`flex flex-col justify-between border p-6 transition-all ${
              selectedPlan === "hobby"
                ? "border-primary/40 bg-primary/5 shadow-xs"
                : "border-border bg-card"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{t("hobbyTitle")}</h4>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{t("hobbyPrice")}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("hobbyDesc")}</p>
              <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  1M API tokens / mo
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  Shared serverless compute
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  Community Discord support
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => setSelectedPlan("hobby")}
            >
              Downgrade
            </Button>
          </Card>

          {/* Pro Team Plan (Current) */}
          <Card
            className={`relative flex flex-col justify-between border p-6 transition-all ${
              selectedPlan === "pro"
                ? "border-primary/40 bg-primary/5 shadow-xs ring-1 ring-primary/40"
                : "border-border bg-card"
            }`}
          >
            <div className="absolute -top-3 right-4">
              <Badge className="bg-primary text-[10px] text-primary-foreground">
                {t("currentActive")}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-primary">{t("proTitle")}</h4>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{t("proPrice")}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("proDesc")}</p>
              <ul className="space-y-2 pt-2 text-xs text-foreground">
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  10M API tokens / mo
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  100 Dedicated GPU hours
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  10 Collaborative team seats
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  Priority 24/7 SLA Support
                </li>
              </ul>
            </div>
            <Button
              variant="default"
              size="sm"
              disabled
              className="mt-6 w-full"
            >
              {t("currentActive")}
            </Button>
          </Card>

          {/* Enterprise Plan */}
          <Card
            className={`flex flex-col justify-between border p-6 transition-all ${
              selectedPlan === "enterprise"
                ? "border-primary/40 bg-primary/5 shadow-xs"
                : "border-border bg-card"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{t("enterpriseTitle")}</h4>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {t("enterprisePrice")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("enterpriseDesc")}
              </p>
              <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  Custom token volumes
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  Dedicated H100 GPU clusters
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  VPC Peering & HIPAA Compliance
                </li>
                <li className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 text-success"
                  />
                  Dedicated Technical Account Manager
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => setSelectedPlan("enterprise")}
            >
              {t("contactSales")}
            </Button>
          </Card>
        </div>
      </div>

      {/* Group 3: Payment Methods & Invoices */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <HugeiconsIcon icon={CreditCardIcon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("paymentMethods")}
          </span>
        </div>

        {/* Card: Active Payment Method */}
        <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted/60">
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  className="size-6 text-foreground"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    Mastercard ending in 4242
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {t("defaultBadge")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("expires")} 08/29
                </p>
              </div>
            </div>

            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                    <span>{t("addCard")}</span>
                  </Button>
                }
              />
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("addCard")}</DialogTitle>
                  <DialogDescription>
                    Provide card details for automated monthly billing.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="4242 •••• •••• 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="card-exp">Expiration</Label>
                      <Input id="card-exp" placeholder="MM / YY" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input id="card-cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose
                    render={
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    }
                  />
                  <Button size="sm" onClick={() => setIsAddCardOpen(false)}>
                    Save Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Card: Invoice History Table */}
        <Card className="min-w-0 overflow-hidden border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="mb-4">
            <h3 className="text-base font-semibold">{t("invoices")}</h3>
            <p className="text-xs text-muted-foreground">
              Download receipts and tax statements.
            </p>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("invoiceId")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("amount")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INVOICES.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {inv.id}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {inv.date}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">
                      {inv.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-success/30 bg-success/5 text-[11px] text-success"
                      >
                        {t("paid")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                      >
                        <HugeiconsIcon
                          icon={Download01Icon}
                          className="size-3.5"
                        />
                        <span>{t("download")}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Group 4: Danger Zone */}
      <div id="danger-zone" className="scroll-mt-6 space-y-3 pb-8">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md border border-danger/20 bg-danger/10 text-danger">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-danger uppercase">
            {t("criticalActions")}
          </span>
        </div>

        <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-danger">
                {t("cancelSubscription")}
              </h4>
              <p className="text-xs text-muted-foreground">{t("cancelDesc")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-danger/30 text-danger hover:bg-danger/10"
            >
              {t("cancelAction")}
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
