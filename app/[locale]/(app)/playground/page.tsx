"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon,
  SparklesIcon,
  Copy01Icon,
  Tick02Icon,
  Delete02Icon,
  SourceCodeIcon,
  StarIcon,
  Settings05Icon,
  ArrowReloadHorizontalIcon,
  Share03Icon,
  ComputerTerminalIcon,
} from "@hugeicons/core-free-icons"

import { NavbarActions } from "@/components/top-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Progress, ProgressLabel } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  model?: string
  tokens?: number
  timestamp?: string
}

interface PromptPreset {
  id: string
  name: string
  description: string
  systemPrompt: string
  initialPrompt: string
  model: string
  temperature: number
}

const PRESETS: PromptPreset[] = [
  {
    id: "fullstack-architect",
    name: "Fullstack Architect",
    description:
      "Expert senior developer reviewing architectures, code, and APIs",
    systemPrompt:
      "You are an elite principal software architect specializing in Next.js, TypeScript, PostgreSQL, and scalable distributed systems. Deliver precise, production-grade recommendations with zero fluff.",
    initialPrompt:
      "Compare server actions vs route handlers for authenticated mutation flows in Next.js App Router.",
    model: "gpt-4o",
    temperature: 0.2,
  },
  {
    id: "sql-optimizer",
    name: "SQL & Query Optimizer",
    description: "Database specialist analyzing queries, indexes, and schemas",
    systemPrompt:
      "You are an expert PostgreSQL DBA. Analyze queries for index utilization, lock contention, and execution plan bottlenecks.",
    initialPrompt:
      "How can I optimize a high-frequency pagination query over a 50M rows audit_logs table without offset-based lag?",
    model: "claude-3-5-sonnet",
    temperature: 0.1,
  },
  {
    id: "product-copy",
    name: "Product & UX Copywriter",
    description: "Crafting crisp, punchy SaaS microcopy and onboarding flows",
    systemPrompt:
      "You are a world-class conversion copywriter. Write concise, active-voice UI copy with high clarity and persuasive appeal.",
    initialPrompt:
      "Write 3 variations of empty-state copy for an analytics dashboard with zero data yet.",
    model: "gemini-1-5-pro",
    temperature: 0.7,
  },
]

const HISTORY_MOCK = [
  {
    id: "hist-1",
    prompt: "Generate an auth middleware with rate limiting in Next.js",
    model: "GPT-4o",
    latency: "640ms",
    tokens: 412,
    date: "10 mins ago",
    status: "200 OK",
  },
  {
    id: "hist-2",
    prompt: "Write a React hook to debounce asynchronous search queries",
    model: "Claude 3.5 Sonnet",
    latency: "480ms",
    tokens: 288,
    date: "1 hour ago",
    status: "200 OK",
  },
  {
    id: "hist-3",
    prompt: "Explain p99 latency spikes in distributed caching topologies",
    model: "Gemini 1.5 Pro",
    latency: "810ms",
    tokens: 520,
    date: "Yesterday",
    status: "200 OK",
  },
]

const STARRED_MOCK = [
  {
    id: "star-1",
    title: "Tailwind v4 PostCSS Config",
    prompt: "How to configure @tailwindcss/postcss in Next.js with zero config",
    model: "GPT-4o",
    tokens: 340,
  },
  {
    id: "star-2",
    title: "Zod Schema Type Inferrer",
    prompt: "Create an inferrable recursive JSON schema with Zod v3",
    model: "Claude 3.5 Sonnet",
    tokens: 410,
  },
]

function PlaygroundContent() {
  const tPlayground = useTranslations("Playground")
  const searchParams = useSearchParams()

  // Tab navigation from query or default
  const defaultTab = searchParams.get("tab") || "chat"
  const [activeTab, setActiveTab] = React.useState(
    [
      "chat",
      "complete",
      "compare",
      "history",
      "starred",
      "parameters",
    ].includes(defaultTab)
      ? defaultTab
      : "chat"
  )

  // Playground state
  const [selectedPreset, setSelectedPreset] = React.useState<string>(
    PRESETS[0].id
  )
  const [selectedModel, setSelectedModel] = React.useState("gpt-4o")
  const [temperature, setTemperature] = React.useState(0.7)
  const [maxTokens, setMaxTokens] = React.useState(2048)
  const [topP, setTopP] = React.useState(0.9)
  const [streamOutput, setStreamOutput] = React.useState(true)
  const [webSearch, setWebSearch] = React.useState(false)
  const [codeSandbox, setCodeSandbox] = React.useState(true)
  const [jsonMode, setJsonMode] = React.useState(false)

  // Prompts & Messages
  const [systemPrompt, setSystemPrompt] = React.useState(
    PRESETS[0].systemPrompt
  )
  const [userInput, setUserInput] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [showShareNotification, setShowShareNotification] =
    React.useState(false)

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "user",
      content:
        "Compare server actions vs route handlers for authenticated mutation flows in Next.js App Router.",
      timestamp: "12:40 PM",
    },
    {
      id: "msg-2",
      role: "assistant",
      content: `Here is a concise architectural breakdown for **Next.js App Router**:

### 1. Server Actions (Recommended for Forms & Direct Mutations)
- **Deep React Integration:** Supports Progressive Enhancement, optimistic updates via \`useOptimistic\`, and pending states with \`useActionState\`.
- **Automatic Revalidation:** Can trigger \`revalidatePath\` or \`revalidateTag\` in the same request cycle without extra roundtrips.
- **Security:** CSRF protections are built-in by Next.js when invoked from forms.

### 2. Route Handlers (\`/api/...\`)
- **Web Standards:** Exposes standard \`Request\` and \`Response\` endpoints.
- **Public & Mobile Consumers:** Essential if you support third-party webhooks, mobile apps, or public API clients.
- **Granular Headers:** Gives complete control over response headers, status codes, and streaming protocols.

**Verdict:** For first-party web UI mutations, prefer **Server Actions**. For public APIs or third-party webhooks, use **Route Handlers**.`,
      model: "gpt-4o",
      tokens: 310,
      timestamp: "12:40 PM",
    },
  ])

  // Completion mode prompt
  const [completionPrompt, setCompletionPrompt] = React.useState(
    "Write a TypeScript utility function to retry an async operation with exponential backoff and jitter."
  )
  const [completionResult, setCompletionResult] = React.useState(
    `export async function retryWithBackoff<T>(\n  fn: () => Promise<T>,\n  maxRetries = 3,\n  baseDelayMs = 200\n): Promise<T> {\n  let attempt = 0;\n  while (true) {\n    try {\n      return await fn();\n    } catch (error) {\n      attempt++;\n      if (attempt > maxRetries) throw error;\n      const jitter = Math.random() * 50;\n      const delay = baseDelayMs * Math.pow(2, attempt) + jitter;\n      await new Promise((r) => setTimeout(r, delay));\n    }\n  }\n}`
  )

  // Compare mode prompts
  const [comparePrompt, setComparePrompt] = React.useState(
    "Explain how React 19's Server Actions handle optimistic UI updates."
  )

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    const preset = PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setSystemPrompt(preset.systemPrompt)
      setSelectedModel(preset.model)
      setTemperature(preset.temperature)
      setUserInput(preset.initialPrompt)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareNotification(true)
    setTimeout(() => setShowShareNotification(false), 2500)
  }

  const handleRunChat = () => {
    if (!userInput.trim() || isGenerating) return

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, newMsg])
    const promptText = userInput
    setUserInput("")
    setIsGenerating(true)

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `**[${selectedModel.toUpperCase()} Response]**\n\nProcessed query: "${promptText}"\n\nConfiguration parameters applied:\n- **Temperature:** ${temperature.toFixed(2)}\n- **Max Tokens:** ${maxTokens}\n- **Top P:** ${topP.toFixed(2)}\n- **Web Grounding:** ${webSearch ? "Active" : "Disabled"}\n- **Sandbox:** ${codeSandbox ? "Enabled" : "Off"}\n\nExecution completed with status code **200 OK**. System resources verified.`,
        model: selectedModel,
        tokens: Math.floor(Math.random() * 200) + 120,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsGenerating(false)
    }, 900)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      handleRunChat()
    }
  }

  const handleResetDefaults = () => {
    setTemperature(0.7)
    setMaxTokens(2048)
    setTopP(0.9)
    setStreamOutput(true)
    setWebSearch(false)
    setCodeSandbox(true)
    setJsonMode(false)
  }

  // Generate reproducible SDK code snippet
  const generatedCode = `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});

async function main() {
  const response = await client.chat.completions.create({
    model: "${selectedModel}",
    temperature: ${temperature},
    max_tokens: ${maxTokens},
    top_p: ${topP},
    stream: ${streamOutput},
    messages: [
      { role: "system", content: ${JSON.stringify(systemPrompt)} },
      ...${JSON.stringify(
        messages.map((m) => ({ role: m.role, content: m.content })),
        null,
        2
      )}
    ],
  });

  console.log(response);
}

main();`

  return (
    <>
      <NavbarActions>
        <div className="flex items-center gap-2">
          {showShareNotification && (
            <Badge
              variant="secondary"
              className="border-success/30 bg-success/10 text-success"
            >
              <HugeiconsIcon icon={Tick02Icon} className="mr-1 size-3" />
              Link copied to clipboard
            </Badge>
          )}

          {/* View Code Dialog */}
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5">
                  <HugeiconsIcon icon={SourceCodeIcon} className="size-3.5" />
                  <span className="hidden sm:inline">
                    {tPlayground("viewCode")}
                  </span>
                </Button>
              }
            />
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{tPlayground("viewCode")}</DialogTitle>
                <DialogDescription>
                  Export this playground session to your Node.js or Python
                  backend.
                </DialogDescription>
              </DialogHeader>
              <div className="relative mt-2 rounded-lg bg-muted/80 p-4 font-mono text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(generatedCode, "modal-code")}
                  className="absolute top-2 right-2 h-7 px-2"
                >
                  {copiedId === "modal-code" ? (
                    <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                  ) : (
                    <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                  )}
                </Button>
                <pre className="max-h-96 overflow-x-auto whitespace-pre">
                  {generatedCode}
                </pre>
              </div>
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

          {/* Save Preset Dialog */}
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5">
                  <HugeiconsIcon icon={StarIcon} className="size-3.5" />
                  <span className="hidden sm:inline">
                    {tPlayground("savePreset")}
                  </span>
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tPlayground("savePreset")}</DialogTitle>
                <DialogDescription>
                  Save your current configuration, model parameters, and system
                  prompts.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="preset-name">Preset Name</Label>
                  <Input
                    id="preset-name"
                    placeholder="e.g. Production API Validator"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="preset-desc">Description</Label>
                  <Input
                    id="preset-desc"
                    placeholder="Brief summary of this prompt template"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose
                  render={
                    <Button variant="default" size="sm">
                      Save Configuration
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={Share03Icon} className="size-3.5" />
            <span className="hidden sm:inline">{tPlayground("share")}</span>
          </Button>
        </div>
      </NavbarActions>

      {/* Main Container */}
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <h1 className="sr-only">{tPlayground("title")}</h1>
        {/* Presets and Mode Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {tPlayground("presets")}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <Button
                  key={p.id}
                  variant={selectedPreset === p.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetChange(p.id)}
                  className="h-7 text-xs"
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Mode Tabs Switcher */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="h-8">
              <TabsTrigger value="chat" className="text-xs">
                {tPlayground("modeChat")}
              </TabsTrigger>
              <TabsTrigger value="complete" className="text-xs">
                {tPlayground("modeComplete")}
              </TabsTrigger>
              <TabsTrigger value="compare" className="text-xs">
                {tPlayground("modeCompare")}
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                {tPlayground("history")}
              </TabsTrigger>
              <TabsTrigger value="starred" className="text-xs">
                {tPlayground("starred")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Split Grid: Canvas on Left/Center, Parameters on Right */}
        <div className="grid flex-1 items-start gap-4 lg:grid-cols-[1fr_320px]">
          {/* Left / Center Canvas */}
          <div className="flex flex-col gap-4">
            {/* CHAT MODE */}
            {activeTab === "chat" && (
              <div className="flex flex-col gap-4">
                {/* System Prompt Collapsible Card */}
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <HugeiconsIcon
                          icon={Settings05Icon}
                          className="size-4 text-muted-foreground"
                        />
                        {tPlayground("systemPrompt")}
                      </CardTitle>
                      <Badge variant="outline" className="text-[11px]">
                        {systemPrompt.length} chars
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder={tPlayground("systemPlaceholder")}
                      className="min-h-20 font-mono text-xs leading-relaxed"
                    />
                  </CardContent>
                </Card>

                {/* Messages Thread Container */}
                <Card className="flex flex-1 flex-col">
                  <CardHeader className="border-b py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={ComputerTerminalIcon}
                          className="size-4 text-primary"
                        />
                        <CardTitle className="text-sm font-medium">
                          Conversation Session
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMessages([])}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          className="mr-1 size-3.5"
                        />
                        {tPlayground("clear")}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-4 p-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                        <HugeiconsIcon
                          icon={SparklesIcon}
                          className="mb-2 size-8 opacity-40"
                        />
                        <p className="text-sm font-medium">Session is empty</p>
                        <p className="text-xs">
                          Type a prompt below or pick a preset above to begin.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col gap-1.5 rounded-lg border p-3.5 ${
                            msg.role === "user"
                              ? "border-primary/20 bg-primary/5 dark:bg-primary/10"
                              : "border-border bg-card shadow-xs"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  msg.role === "user" ? "default" : "secondary"
                                }
                                className="text-[10px] capitalize"
                              >
                                {msg.role}
                              </Badge>
                              {msg.model && (
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  {msg.model}
                                </span>
                              )}
                              {msg.tokens && (
                                <span className="text-[11px] text-muted-foreground">
                                  • {msg.tokens} tokens
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {msg.timestamp && (
                                <span className="text-[11px] text-muted-foreground">
                                  {msg.timestamp}
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="h-6 w-6 p-0"
                              >
                                {copiedId === msg.id ? (
                                  <HugeiconsIcon
                                    icon={Tick02Icon}
                                    className="size-3 text-success"
                                  />
                                ) : (
                                  <HugeiconsIcon
                                    icon={Copy01Icon}
                                    className="size-3 text-muted-foreground"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs/relaxed whitespace-pre-wrap">
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}

                    {isGenerating && (
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                        <span className="size-2 animate-ping rounded-full bg-primary" />
                        <span>{tPlayground("running")}</span>
                      </div>
                    )}
                  </CardContent>

                  {/* Prompt Input Box */}
                  <div className="border-t p-3">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={tPlayground("promptPlaceholder")}
                      className="min-h-20 text-xs"
                    />
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                          ⌘ + Enter
                        </kbd>
                        <span>to run</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleRunChat}
                          disabled={isGenerating || !userInput.trim()}
                          className="gap-1.5"
                        >
                          <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                          {isGenerating
                            ? tPlayground("running")
                            : tPlayground("run")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* COMPLETION MODE */}
            {activeTab === "complete" && (
              <Card className="flex flex-col gap-4 p-5">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Direct Text & Code Completion
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Single-prompt completions for raw token generation and code
                    tasks.
                  </CardDescription>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs">Prompt</Label>
                  <Textarea
                    value={completionPrompt}
                    onChange={(e) => setCompletionPrompt(e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsGenerating(true)
                      setTimeout(() => {
                        setCompletionResult(
                          `// Completion output generated by ${selectedModel.toUpperCase()} (T: ${temperature.toFixed(2)}, MaxTokens: ${maxTokens})\n// Prompt: "${completionPrompt}"\n\n` +
                            `export async function executeTask() {\n  // Implementation for: "${completionPrompt}"\n  console.log("Task executed successfully");\n  return { success: true, timestamp: Date.now() };\n}`
                        )
                        setIsGenerating(false)
                      }, 600)
                    }}
                    disabled={isGenerating}
                    className="gap-1.5"
                  >
                    <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                    {isGenerating ? tPlayground("running") : "Complete Prompt"}
                  </Button>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Completion Output</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(completionResult, "complete-out")
                      }
                      className="h-6 text-xs"
                    >
                      <HugeiconsIcon
                        icon={Copy01Icon}
                        className="mr-1 size-3"
                      />
                      Copy
                    </Button>
                  </div>
                  <div className="rounded-md border bg-muted/60 p-4 font-mono text-xs">
                    <pre className="overflow-x-auto whitespace-pre">
                      {completionResult}
                    </pre>
                  </div>
                </div>
              </Card>
            )}

            {/* COMPARE MODE */}
            {activeTab === "compare" && (
              <div className="flex flex-col gap-4">
                <Card className="p-4">
                  <Label className="text-xs font-medium">
                    Shared Test Prompt
                  </Label>
                  <Textarea
                    value={comparePrompt}
                    onChange={(e) => setComparePrompt(e.target.value)}
                    className="mt-1.5 min-h-16 text-xs"
                  />
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Model A */}
                  <Card className="p-4">
                    <div className="mb-3 flex items-center justify-between border-b pb-2">
                      <Badge variant="default" className="font-mono text-xs">
                        GPT-4o
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Latency: 420ms
                      </span>
                    </div>
                    <p className="text-xs/relaxed text-muted-foreground">
                      In React 19, Server Actions use optimistic updates by
                      pairing{" "}
                      <code className="text-foreground">useOptimistic</code>{" "}
                      with{" "}
                      <code className="text-foreground">useTransition</code>.
                      When an action triggers, the UI instantly reflects
                      expected state mutations before the server responds.
                    </p>
                  </Card>

                  {/* Model B */}
                  <Card className="p-4">
                    <div className="mb-3 flex items-center justify-between border-b pb-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        Claude 3.5 Sonnet
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Latency: 380ms
                      </span>
                    </div>
                    <p className="text-xs/relaxed text-muted-foreground">
                      React 19 orchestrates optimistic state updates through the{" "}
                      <code className="text-foreground">useOptimistic</code>{" "}
                      hook. While the async Server Action processes across the
                      network wire, an ephemeral state branch is projected,
                      reverting if the mutation encounters a reject.
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <Card className="p-4">
                <div className="mb-4">
                  <CardTitle className="text-base font-medium">
                    Execution History
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Review previously completed prompt executions and metrics.
                  </CardDescription>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Prompt</TableHead>
                      <TableHead className="text-xs">Model</TableHead>
                      <TableHead className="text-xs">Latency</TableHead>
                      <TableHead className="text-xs">Tokens</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-right text-xs">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {HISTORY_MOCK.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-xs truncate text-xs font-medium">
                          {item.prompt}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.model}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.latency}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.tokens}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUserInput(item.prompt)
                              setActiveTab("chat")
                            }}
                            className="h-6 text-[11px]"
                          >
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* STARRED TAB */}
            {activeTab === "starred" && (
              <Card className="p-4">
                <div className="mb-4">
                  <CardTitle className="text-base font-medium">
                    Starred Prompt Snippets
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Quickly reuse high-value prompts saved for your team.
                  </CardDescription>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {STARRED_MOCK.map((star) => (
                    <Card key={star.id} className="p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {star.title}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {star.model}
                        </Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {star.prompt}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t pt-2">
                        <span className="text-[11px] text-muted-foreground">
                          ~{star.tokens} tokens
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setUserInput(star.prompt)
                            setActiveTab("chat")
                          }}
                          className="h-6 text-[11px]"
                        >
                          Load in Chat
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Parameters Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between border-b pb-2">
                <CardTitle className="text-sm font-semibold">
                  {tPlayground("parameters")}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleResetDefaults}
                          className="h-6 w-6 p-0"
                        >
                          <HugeiconsIcon
                            icon={ArrowReloadHorizontalIcon}
                            className="size-3.5 text-muted-foreground"
                          />
                        </Button>
                      }
                    />
                    <TooltipContent>
                      <span>{tPlayground("resetDefaults")}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex flex-col gap-4 pt-3">
                {/* Model Select */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium">
                    {tPlayground("model")}
                  </Label>
                  <Select
                    value={selectedModel}
                    onValueChange={(val) => {
                      if (val) setSelectedModel(val)
                    }}
                  >
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>OpenAI</SelectLabel>
                        <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                        <SelectItem value="gpt-4o-mini">
                          GPT-4o Mini (Fast)
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Anthropic</SelectLabel>
                        <SelectItem value="claude-3-5-sonnet">
                          Claude 3.5 Sonnet
                        </SelectItem>
                        <SelectItem value="claude-3-haiku">
                          Claude 3 Haiku
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Google</SelectLabel>
                        <SelectItem value="gemini-1-5-pro">
                          Gemini 1.5 Pro
                        </SelectItem>
                        <SelectItem value="gemini-1-5-flash">
                          Gemini 1.5 Flash
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Temperature Slider */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      {tPlayground("temperature")}
                    </Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {temperature.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[temperature]}
                    onValueChange={(val) =>
                      setTemperature(Array.isArray(val) ? val[0] : val)
                    }
                    min={0}
                    max={2}
                    step={0.05}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Max Tokens Slider */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      {tPlayground("maxTokens")}
                    </Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {maxTokens}
                    </span>
                  </div>
                  <Slider
                    value={[maxTokens]}
                    onValueChange={(val) =>
                      setMaxTokens(Array.isArray(val) ? val[0] : val)
                    }
                    min={256}
                    max={8192}
                    step={256}
                  />
                </div>

                {/* Top P Slider */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      {tPlayground("topP")}
                    </Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {topP.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[topP]}
                    onValueChange={(val) =>
                      setTopP(Array.isArray(val) ? val[0] : val)
                    }
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>

                <Separator />

                {/* Feature Switches */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="stream-switch"
                      className="text-xs font-normal"
                    >
                      {tPlayground("streaming")}
                    </Label>
                    <Switch
                      id="stream-switch"
                      checked={streamOutput}
                      onCheckedChange={setStreamOutput}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="web-search-switch"
                      className="text-xs font-normal"
                    >
                      {tPlayground("webSearch")}
                    </Label>
                    <Switch
                      id="web-search-switch"
                      checked={webSearch}
                      onCheckedChange={setWebSearch}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="sandbox-switch"
                      className="text-xs font-normal"
                    >
                      {tPlayground("codeInterpreter")}
                    </Label>
                    <Switch
                      id="sandbox-switch"
                      checked={codeSandbox}
                      onCheckedChange={setCodeSandbox}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="json-switch"
                      className="text-xs font-normal"
                    >
                      {tPlayground("jsonMode")}
                    </Label>
                    <Switch
                      id="json-switch"
                      checked={jsonMode}
                      onCheckedChange={setJsonMode}
                    />
                  </div>
                </div>

                <Separator />

                {/* Context Window & Token Meter */}
                <div className="rounded-lg border bg-muted/30 p-3">
                  <Progress value={28}>
                    <ProgressLabel className="text-xs">
                      {tPlayground("tokenUsage")}
                    </ProgressLabel>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      1,842 / 128k
                    </span>
                  </Progress>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Est. Cost:{" "}
                    <span className="font-mono font-medium text-foreground">
                      $0.0054
                    </span>{" "}
                    / run
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}

export default function PlaygroundPage() {
  return (
    <React.Suspense fallback={null}>
      <PlaygroundContent />
    </React.Suspense>
  )
}
