"use client"

import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  CreditCardIcon,
  DollarCircleIcon,
  TrendingUpIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Demo data
const revenueData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 9800, expenses: 3908 },
  { month: "Apr", revenue: 3908, expenses: 4800 },
  { month: "May", revenue: 4890, expenses: 3800 },
  { month: "Jun", revenue: 7390, expenses: 4300 },
]

const performanceData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 600 },
  { name: "Thu", value: 800 },
  { name: "Fri", value: 500 },
  { name: "Sat", value: 400 },
  { name: "Sun", value: 300 },
]

const recentTransactions = [
  {
    id: "INV-001",
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "$1,999.00",
    status: "Paid",
  },
  {
    id: "INV-002",
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "$39.00",
    status: "Pending",
  },
  {
    id: "INV-003",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "$299.00",
    status: "Paid",
  },
  {
    id: "INV-004",
    customer: "William Kim",
    email: "william.kim@email.com",
    amount: "$99.00",
    status: "Failed",
  },
  {
    id: "INV-005",
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "$499.00",
    status: "Paid",
  },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  value: {
    label: "Performance",
    color: "hsl(var(--chart-3))",
  },
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard")

  return (
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
                  <BreadcrumbLink href="#">
                    {t("dashboard")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("analyticsHeading")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Alert Banner */}
          <Alert>
            <HugeiconsIcon icon={Activity01Icon} className="h-4 w-4" />
            <AlertTitle>{t("systemStatus")}</AlertTitle>
            <AlertDescription>{t("dashboardUpToDate")}</AlertDescription>
            <AlertAction>
              <Button variant="ghost" size="sm">
                {t("refresh")}
              </Button>
            </AlertAction>
          </Alert>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("totalRevenue")}
                </p>
                <HugeiconsIcon
                  icon={DollarCircleIcon}
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">$45,231</h3>
                <Badge variant="secondary" className="gap-1">
                  <HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" />
                  20.1%
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                +$4,500 {t("lastMonth")}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("activeUsers")}
                </p>
                <HugeiconsIcon
                  icon={UsersIcon}
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">2,350</h3>
                <Badge variant="secondary" className="gap-1">
                  <HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" />
                  15.3%
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                +180 {t("lastWeek")}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("transactions")}
                </p>
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">12,234</h3>
                <Badge variant="destructive" className="gap-1">
                  <HugeiconsIcon icon={ArrowDown01Icon} className="h-3 w-3" />
                  5.2%
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                -573 {t("lastMonth")}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("conversionRate")}
                </p>
                <HugeiconsIcon
                  icon={Activity01Icon}
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">3.42%</h3>
                <Badge variant="secondary" className="gap-1">
                  <HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" />
                  2.1%
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                +0.3% {t("lastWeek")}
              </p>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">
                  {t("revenueVsExpenses")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("monthlyComparison")}
                </p>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="var(--color-expenses)"
                    fill="var(--color-expenses)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">
                  {t("weeklyPerformance")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("dailyActivityThisWeek")}
                </p>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>

          {/* Progress Indicators */}
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">{t("projectGoals")}</h3>
            <div className="space-y-4">
              <Progress value={75}>
                <ProgressLabel>{t("q1SalesTarget")}</ProgressLabel>
                <ProgressValue />
              </Progress>
              <Progress value={45}>
                <ProgressLabel>{t("productLaunch")}</ProgressLabel>
                <ProgressValue />
              </Progress>
              <Progress value={90}>
                <ProgressLabel>{t("customerSatisfaction")}</ProgressLabel>
                <ProgressValue />
              </Progress>
              <Progress value={60}>
                <ProgressLabel>{t("teamHiring")}</ProgressLabel>
                <ProgressValue />
              </Progress>
            </div>
          </Card>

          {/* Tabs with Table */}
          <Card className="p-6">
            <Tabs defaultValue="recent">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {t("transactionsTab")}
                </h3>
                <TabsList>
                  <TabsTrigger value="recent">{t("recent")}</TabsTrigger>
                  <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
                  <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="recent">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("invoice")}</TableHead>
                      <TableHead>{t("customer")}</TableHead>
                      <TableHead>{t("email")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">
                        {t("amount")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "Paid"
                                ? "default"
                                : transaction.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {transaction.status === "Paid"
                              ? t("paid")
                              : transaction.status === "Pending"
                                ? t("pendingStatus")
                                : t("failedStatus")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="pending">
                <div className="py-8 text-center text-base text-muted-foreground">
                  {t("noPendingTransactions")}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="py-8 text-center text-base text-muted-foreground">
                  {t("completedTransactionsLastThirtyDays")}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
