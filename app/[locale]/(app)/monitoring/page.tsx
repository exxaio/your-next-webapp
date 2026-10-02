"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  ZapIcon,
  Download01Icon,
  ArrowReloadHorizontalIcon,
  CheckmarkBadgeIcon,
  AlertCircleIcon,
  CloudIcon,
  Layers01Icon,
  PlayIcon,
  StopIcon,
} from "@hugeicons/core-free-icons"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { NavbarActions } from "@/components/top-navbar"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/page-container"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LogTrace {
  id: string
  time: string
  method: "POST" | "GET"
  endpoint: string
  statusCode: number
  statusCategory: "2xx" | "4xx" | "5xx"
  latency: string
  region: string
  clientIp: string
  tokens?: number
}

const TRACES_DATA: LogTrace[] = [
  {
    id: "req-98831",
    time: "14:23:48.102",
    method: "POST",
    endpoint: "/v1/chat/completions",
    statusCode: 200,
    statusCategory: "2xx",
    latency: "142ms",
    region: "iad-1",
    clientIp: "192.0.2.45",
    tokens: 380,
  },
  {
    id: "req-98830",
    time: "14:23:47.890",
    method: "POST",
    endpoint: "/v1/embeddings",
    statusCode: 200,
    statusCategory: "2xx",
    latency: "28ms",
    region: "sfo-1",
    clientIp: "198.51.100.12",
    tokens: 512,
  },
  {
    id: "req-98829",
    time: "14:23:45.312",
    method: "POST",
    endpoint: "/v1/models/deploy",
    statusCode: 429,
    statusCategory: "4xx",
    latency: "8ms",
    region: "fra-1",
    clientIp: "203.0.113.88",
  },
  {
    id: "req-98828",
    time: "14:23:42.110",
    method: "GET",
    endpoint: "/v1/models",
    statusCode: 200,
    statusCategory: "2xx",
    latency: "14ms",
    region: "sin-1",
    clientIp: "198.51.100.74",
  },
  {
    id: "req-98827",
    time: "14:23:40.400",
    method: "POST",
    endpoint: "/v1/chat/completions",
    statusCode: 500,
    statusCategory: "5xx",
    latency: "840ms",
    region: "iad-1",
    clientIp: "192.0.2.110",
    tokens: 0,
  },
  {
    id: "req-98826",
    time: "14:23:38.220",
    method: "POST",
    endpoint: "/v1/chat/completions",
    statusCode: 200,
    statusCategory: "2xx",
    latency: "164ms",
    region: "sfo-1",
    clientIp: "198.51.100.99",
    tokens: 240,
  },
  {
    id: "req-98825",
    time: "14:23:35.010",
    method: "POST",
    endpoint: "/v1/audio/transcriptions",
    statusCode: 200,
    statusCategory: "2xx",
    latency: "96ms",
    region: "fra-1",
    clientIp: "203.0.113.5",
    tokens: 120,
  },
]

const telemetryData = [
  { time: "14:00", reqs: 1240, latency: 135 },
  { time: "14:05", reqs: 1380, latency: 140 },
  { time: "14:10", reqs: 1420, latency: 148 },
  { time: "14:15", reqs: 1610, latency: 152 },
  { time: "14:20", reqs: 1540, latency: 142 },
  { time: "14:25", reqs: 1480, latency: 138 },
]

const errorBreakdownData = [
  { code: "200 OK", count: 18450 },
  { code: "304 Cache", count: 2100 },
  { code: "400 Client", count: 42 },
  { code: "429 RateLimit", count: 18 },
  { code: "500 Server", count: 6 },
]

const chartConfig = {
  reqs: {
    label: "Throughput (req/s)",
    color: "var(--chart-1)",
  },
  latency: {
    label: "Latency (ms)",
    color: "var(--chart-2)",
  },
  count: {
    label: "Requests",
    color: "var(--chart-1)",
  },
}

export default function MonitoringPage() {
  const t = useTranslations("Monitoring")

  const [activeTab, setActiveTab] = React.useState<
    "all" | "2xx" | "4xx" | "5xx"
  >("all")
  const [isLive, setIsLive] = React.useState(true)
  const [selectedTrace, setSelectedTrace] = React.useState<LogTrace | null>(
    null
  )

  const filteredTraces = React.useMemo(() => {
    if (activeTab === "all") return TRACES_DATA
    return TRACES_DATA.filter((trace) => trace.statusCategory === activeTab)
  }, [activeTab])

  return (
    <>

      <NavbarActions>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive((v) => !v)}
            className="gap-1.5"
          >
            <span
              className={`size-2 rounded-full ${
                isLive ? "animate-ping bg-accent" : "bg-muted-foreground"
              }`}
            />
            <span className="hidden sm:inline">
              {isLive ? t("liveStream") : t("paused")}
            </span>
          </Button>

          <Button variant="outline" size="sm" className="gap-1.5">
            <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
            <span className="hidden sm:inline">{t("exportLogs")}</span>
          </Button>
        </div>
      </NavbarActions>

      <PageContainer variant="workspace">
        <h1 className="sr-only">{t("title")}</h1>

        {/* Global Live Stream Telemetry Banner */}
        <Alert className="border-l-4 border-l-accent bg-card text-card-foreground">
          <HugeiconsIcon
            icon={Activity01Icon}
            className="h-4 w-4 text-accent"
          />
          <AlertTitle>{t("liveAlertTitle")}</AlertTitle>
          <AlertDescription className="pr-24 sm:pr-0">
            {t("liveAlertDesc")}
          </AlertDescription>
          <AlertAction className="static mt-2 sm:absolute sm:top-1.5 sm:right-2 sm:mt-0">
            <Badge
              variant="outline"
              className="gap-1 border-success/30 bg-success/5 text-[11px] text-success"
            >
              <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-3" />
              Healthy
            </Badge>
          </AlertAction>
        </Alert>

        {/* 4 Stat KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("requestsPerSec")}
              </p>
              <HugeiconsIcon
                icon={Activity01Icon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">1,480</h3>
              <Badge
                variant="outline"
                className="border-success/30 bg-success/5 text-success"
              >
                +8.4%
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              req/sec across all regions
            </p>
          </Card>

          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("errorRate")}</p>
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">0.04%</h3>
              <Badge
                variant="outline"
                className="border-success/30 bg-success/5 text-success"
              >
                -0.01%
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              4xx/5xx responses
            </p>
          </Card>

          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("p95Latency")}</p>
              <HugeiconsIcon
                icon={ZapIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">142ms</h3>
              <Badge
                variant="outline"
                className="border-success/30 bg-success/5 text-success"
              >
                Normal
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              95th percentile response
            </p>
          </Card>

          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("cacheHit")}</p>
              <HugeiconsIcon
                icon={Layers01Icon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">94.2%</h3>
              <Badge variant="outline" className="bg-accent/15 text-accent">
                Optimal
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Edge CDN & semantic cache
            </p>
          </Card>
        </div>

        {/* Charts: Throughput & Latency Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                {t("trafficThroughput")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("trafficSubtitle")}
              </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <AreaChart data={telemetryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="reqs"
                  stroke="var(--color-reqs)"
                  fill="var(--color-reqs)"
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ChartContainer>
          </Card>

          <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                {t("errorDistribution")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("errorSubtitle")}
              </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={errorBreakdownData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="code"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Request Logs Table with Tabs */}
        <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold">{t("requestLogs")}</h3>
              <p className="text-sm text-muted-foreground">
                Inspecting real-time edge invocation traces.
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
              className="w-full lg:w-auto"
            >
              <TabsList className="h-8 w-full max-w-full justify-start overflow-x-auto sm:w-auto sm:justify-center">
                <TabsTrigger value="all" className="shrink-0 text-xs">
                  {t("all")}
                </TabsTrigger>
                <TabsTrigger value="2xx" className="shrink-0 text-xs">
                  {t("success")}
                </TabsTrigger>
                <TabsTrigger value="4xx" className="shrink-0 text-xs">
                  {t("clientErrors")}
                </TabsTrigger>
                <TabsTrigger value="5xx" className="shrink-0 text-xs">
                  {t("serverErrors")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("timestamp")}</TableHead>
                  <TableHead>{t("method")}</TableHead>
                  <TableHead>{t("endpoint")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("latency")}</TableHead>
                  <TableHead>{t("region")}</TableHead>
                  <TableHead className="text-right">Inspection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTraces.map((trace) => (
                  <TableRow key={trace.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {trace.time}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px] uppercase"
                      >
                        {trace.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">
                      {trace.endpoint}
                    </TableCell>
                    <TableCell>
                      {trace.statusCode === 200 ? (
                        <Badge
                          variant="outline"
                          className="border-success/30 bg-success/5 text-[11px] text-success"
                        >
                          {trace.statusCode} OK
                        </Badge>
                      ) : trace.statusCode === 429 ? (
                        <Badge
                          variant="outline"
                          className="border-warning/30 bg-warning/10 text-[11px] text-warning"
                        >
                          {trace.statusCode} Rate Limit
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-danger/30 bg-danger/10 text-[11px] text-danger"
                        >
                          {trace.statusCode} Error
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {trace.latency}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground uppercase">
                        {trace.region}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTrace(trace)}
                        className="h-7 text-xs"
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Trace Inspector Dialog */}
        <Dialog
          open={!!selectedTrace}
          onOpenChange={() => setSelectedTrace(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Trace Inspector</DialogTitle>
              <DialogDescription>
                Telemetry detail for invocation trace {selectedTrace?.id}
              </DialogDescription>
            </DialogHeader>
            {selectedTrace && (
              <div className="space-y-3 rounded-lg bg-muted/40 p-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request ID:</span>
                  <span className="font-semibold">{selectedTrace.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span>{selectedTrace.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method / Path:</span>
                  <span>
                    {selectedTrace.method} {selectedTrace.endpoint}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Code:</span>
                  <span className="font-semibold">
                    {selectedTrace.statusCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{selectedTrace.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client IP:</span>
                  <span>{selectedTrace.clientIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Edge Region:</span>
                  <span>{selectedTrace.region}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="secondary" size="sm">
                    Close
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  )
}
