"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  RoboticIcon,
  CpuIcon,
  Activity01Icon,
  ZapIcon,
  Search01Icon,
  PlusSignIcon,
  SparklesIcon,
  ArrowRight01Icon,
  CheckmarkBadgeIcon,
  Layers01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModelItem {
  id: string
  name: string
  family: "genesis" | "explorer" | "quantum"
  category: "llm" | "multimodal" | "code" | "embeddings"
  description: string
  context: string
  inputCost: string
  outputCost: string
  latency: string
  throughput: number
  status: "operational" | "beta" | "degraded"
  featured?: boolean
}

const MODELS_DATA: ModelItem[] = [
  {
    id: "genesis-4-ultra",
    name: "Genesis-4 Ultra",
    family: "genesis",
    category: "llm",
    description:
      "Flagship intelligence for high-complexity multi-step reasoning and deep analysis.",
    context: "128k tokens",
    inputCost: "$2.50",
    outputCost: "$10.00",
    latency: "185ms",
    throughput: 94,
    status: "operational",
    featured: true,
  },
  {
    id: "genesis-3.5-flash",
    name: "Genesis-3.5 Flash",
    family: "genesis",
    category: "llm",
    description:
      "Ultra-low latency lightweight model engineered for high-frequency agentic tasks.",
    context: "1M tokens",
    inputCost: "$0.075",
    outputCost: "$0.30",
    latency: "74ms",
    throughput: 168,
    status: "operational",
    featured: true,
  },
  {
    id: "explorer-2-vision",
    name: "Explorer-2 OmniVision",
    family: "explorer",
    category: "multimodal",
    description:
      "Dense multimodal architecture processing high-resolution imagery, video, and audio.",
    context: "64k tokens",
    inputCost: "$1.80",
    outputCost: "$5.40",
    latency: "142ms",
    throughput: 88,
    status: "operational",
  },
  {
    id: "explorer-audio-pulse",
    name: "Explorer Audio Pulse",
    family: "explorer",
    category: "multimodal",
    description:
      "Real-time bidirectional speech translation and voice reasoning engine.",
    context: "32k tokens",
    inputCost: "$0.90",
    outputCost: "$2.70",
    latency: "96ms",
    throughput: 120,
    status: "beta",
  },
  {
    id: "quantum-coder-pro",
    name: "Quantum Coder Pro",
    family: "quantum",
    category: "code",
    description:
      "Code generation and architectural refactoring model fine-tuned on 40+ programming stacks.",
    context: "128k tokens",
    inputCost: "$1.20",
    outputCost: "$4.00",
    latency: "112ms",
    throughput: 145,
    status: "operational",
    featured: true,
  },
  {
    id: "quantum-reasoner",
    name: "Quantum Reasoner R1",
    family: "quantum",
    category: "code",
    description:
      "Reinforcement-learned chain-of-thought engine for mathematical proofs and logic verification.",
    context: "64k tokens",
    inputCost: "$3.00",
    outputCost: "$12.00",
    latency: "290ms",
    throughput: 62,
    status: "beta",
  },
  {
    id: "semantic-vector-large",
    name: "Semantic Vector v3",
    family: "genesis",
    category: "embeddings",
    description:
      "3072-dimensional dense embedding model for hybrid semantic search and retrieval.",
    context: "8k tokens",
    inputCost: "$0.02",
    outputCost: "N/A",
    latency: "28ms",
    throughput: 320,
    status: "operational",
  },
]

const benchmarkData = [
  { name: "Gen-3.5 Flash", throughput: 168, latency: 74 },
  { name: "Gen-4 Ultra", throughput: 94, latency: 185 },
  { name: "Exp-2 Vision", throughput: 88, latency: 142 },
  { name: "Quantum Coder", throughput: 145, latency: 112 },
  { name: "Quantum R1", throughput: 62, latency: 290 },
]

const chartConfig = {
  throughput: {
    label: "Throughput (tps)",
    color: "var(--chart-1)",
  },
  latency: {
    label: "Latency (ms)",
    color: "var(--chart-2)",
  },
}

export default function ModelsPage() {
  const t = useTranslations("Models")
  const searchParams = useSearchParams()

  const familyParam = searchParams.get("family")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDeployDialogOpen, setIsDeployDialogOpen] = React.useState(false)
  const [replicas, setReplicas] = React.useState(2)

  const filteredModels = React.useMemo(() => {
    return MODELS_DATA.filter((model) => {
      if (familyParam && model.family !== familyParam) {
        return false
      }
      if (selectedCategory !== "all" && model.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.family.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [familyParam, selectedCategory, searchQuery])

  return (
    <>

      <NavbarActions>
        <div className="flex items-center gap-2">
          <Dialog
            open={isDeployDialogOpen}
            onOpenChange={setIsDeployDialogOpen}
          >
            <DialogTrigger
              render={
                <Button size="sm" className="gap-1.5">
                  <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                  <span>{t("deployModel")}</span>
                </Button>
              }
            />
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t("deployDialogTitle")}</DialogTitle>
                <DialogDescription>{t("deployDialogDesc")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="model-select">{t("modelId")}</Label>
                  <Select defaultValue="genesis-4-ultra">
                    <SelectTrigger id="model-select">
                      <SelectValue placeholder="Select checkpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis-4-ultra">
                        Genesis-4 Ultra (FP16)
                      </SelectItem>
                      <SelectItem value="genesis-3.5-flash">
                        Genesis-3.5 Flash (INT8)
                      </SelectItem>
                      <SelectItem value="quantum-coder-pro">
                        Quantum Coder Pro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="instance-tier">{t("instanceType")}</Label>
                  <Select defaultValue="h100-80gb">
                    <SelectTrigger id="instance-tier">
                      <SelectValue placeholder="Hardware accelerator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h100-80gb">
                        1x NVIDIA H100 (80GB SXM5)
                      </SelectItem>
                      <SelectItem value="2x-a100">
                        2x NVIDIA A100 (80GB PCIe)
                      </SelectItem>
                      <SelectItem value="l40s-48gb">
                        1x NVIDIA L40S (48GB)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-xs">
                    <Label>{t("maxReplicas")}</Label>
                    <span className="font-mono font-medium">
                      {replicas} instances
                    </span>
                  </div>
                  <Slider
                    value={[replicas]}
                    onValueChange={(vals) =>
                      setReplicas(Array.isArray(vals) ? vals[0] : vals)
                    }
                    min={1}
                    max={8}
                    step={1}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose
                  render={
                    <Button variant="outline" size="sm">
                      {t("cancel")}
                    </Button>
                  }
                />
                <Button size="sm" onClick={() => setIsDeployDialogOpen(false)}>
                  {t("confirmDeploy")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </NavbarActions>

      <PageContainer variant="workspace">
        <h1 className="sr-only">{t("title")}</h1>

        {/* Global Operational Status Context Bar */}
        <Alert className="border-l-4 border-l-accent bg-card text-card-foreground">
          <HugeiconsIcon
            icon={Activity01Icon}
            className="h-4 w-4 text-accent"
          />
          <AlertTitle>{t("systemStatus")}</AlertTitle>
          <AlertDescription className="pr-28 sm:pr-0">
            {t("systemStatusDesc")}
          </AlertDescription>
          <AlertAction className="static mt-2 sm:absolute sm:top-1.5 sm:right-2 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/monitoring" />}
              className="gap-1.5"
            >
              <span>View Telemetry</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
            </Button>
          </AlertAction>
        </Alert>

        {/* KPI Stat Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("totalModels")}
              </p>
              <HugeiconsIcon
                icon={RoboticIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">28</h3>
              <Badge
                variant="outline"
                className="border-success/30 bg-success/5 text-success"
              >
                +4 new
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              3 foundation families
            </p>
          </Card>

          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("activeDeployments")}
              </p>
              <HugeiconsIcon
                icon={CpuIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">14</h3>
              <Badge variant="outline" className="bg-accent/15 text-accent">
                99.98% SLA
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Dedicated GPU clusters
            </p>
          </Card>

          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("avgLatency")}</p>
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
                -18ms
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Weighted edge latency
            </p>
          </Card>

          <Card className="min-w-0 border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("dailyRequests")}
              </p>
              <HugeiconsIcon
                icon={SparklesIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">42.8M</h3>
              <Badge
                variant="outline"
                className="border-success/30 bg-success/5 text-success"
              >
                +24%
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Tokens processed today
            </p>
          </Card>
        </div>

        {/* Visual Benchmark Chart */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                {t("compareBenchmarks")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("benchmarkSubtitle")}
              </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={benchmarkData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="throughput"
                  fill="var(--color-throughput)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </Card>

          <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Response Latency (ms)</h3>
              <p className="text-sm text-muted-foreground">
                Time to first token across top checkpoints
              </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={benchmarkData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="latency"
                  fill="var(--color-latency)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Filter Toolbar & Model Directory Table */}
        <Card className="min-w-0 overflow-hidden border border-border bg-card p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full lg:w-auto"
            >
              <TabsList className="h-9 w-full max-w-full justify-start overflow-x-auto sm:w-auto sm:justify-center">
                <TabsTrigger value="all" className="shrink-0 text-xs">
                  {t("allFamilies")}
                </TabsTrigger>
                <TabsTrigger value="llm" className="shrink-0 text-xs">
                  {t("llm")}
                </TabsTrigger>
                <TabsTrigger value="multimodal" className="shrink-0 text-xs">
                  {t("multimodal")}
                </TabsTrigger>
                <TabsTrigger value="code" className="shrink-0 text-xs">
                  {t("code")}
                </TabsTrigger>
                <TabsTrigger value="embeddings" className="shrink-0 text-xs">
                  {t("embeddings")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full lg:w-72">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute top-2.5 left-2.5 size-4 text-muted-foreground"
              />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">
                    {t("modelName")}
                  </TableHead>
                  <TableHead>{t("family")}</TableHead>
                  <TableHead>{t("contextWindow")}</TableHead>
                  <TableHead>{t("inputPrice")}</TableHead>
                  <TableHead>{t("outputPrice")}</TableHead>
                  <TableHead>{t("latency")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">
                            {model.name}
                          </span>
                          {model.featured && (
                            <Badge
                              variant="secondary"
                              className="border-primary/40 bg-primary/5 text-[10px] text-primary"
                            >
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="line-clamp-1 max-w-sm text-xs text-muted-foreground">
                          {model.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground uppercase">
                        {model.family}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {model.context}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {model.inputCost}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {model.outputCost}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">
                      {model.latency}
                    </TableCell>
                    <TableCell>
                      {model.status === "operational" ? (
                        <Badge
                          variant="outline"
                          className="border-success/30 bg-success/5 text-[11px] text-success"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkBadgeIcon}
                            className="mr-1 size-3"
                          />
                          {t("operational")}
                        </Badge>
                      ) : model.status === "beta" ? (
                        <Badge
                          variant="outline"
                          className="bg-accent/15 text-[11px] text-accent"
                        >
                          {t("beta")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-warning/30 bg-warning/10 text-[11px] text-warning"
                        >
                          {t("degraded")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href="/playground" />}
                        className="h-8 gap-1 text-xs"
                      >
                        <HugeiconsIcon
                          icon={SparklesIcon}
                          className="size-3 text-primary"
                        />
                        <span>{t("testInPlayground")}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </PageContainer>
    </>
  )
}
