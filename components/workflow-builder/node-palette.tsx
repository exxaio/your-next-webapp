"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AirplayIcon,
  AiBrain05Icon,
  Database01Icon,
  GitBranchIcon,
  SentIcon,
  Search01Icon,
  PlusSignIcon,
  SidebarLeftIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { NodeTemplate, NodeCategory } from "./workflow-types"

interface NodePaletteProps {
  isOpen: boolean
  onToggle: () => void
  onAddNode: (template: NodeTemplate) => void
}

const TEMPLATES: NodeTemplate[] = [
  // Triggers
  {
    category: "trigger",
    title: "Webhook Trigger",
    subtitle: "Incoming HTTP POST payload",
    defaultConfig: {
      inputs: ["payload: json", "headers: object"],
      outputs: ["event_id: string", "body: object"],
    },
  },
  {
    category: "trigger",
    title: "Scheduled Cron",
    subtitle: "Trigger pipeline on timer/cron",
    defaultConfig: {
      inputs: ["schedule: string"],
      outputs: ["timestamp: number"],
    },
  },
  {
    category: "trigger",
    title: "User Prompt Trigger",
    subtitle: "Interactive chat message input",
    defaultConfig: {
      inputs: ["user_query: string"],
      outputs: ["query: string", "session_id: string"],
    },
  },
  // Agents
  {
    category: "agent",
    title: "Reasoning Agent",
    subtitle: "Genesis Ultra 2.5 chain-of-thought",
    defaultConfig: {
      model: "Genesis Ultra 2.5",
      temperature: 0.7,
      maxTokens: 4096,
      streaming: true,
      fallbackModel: true,
      systemPrompt:
        "You are an expert autonomous reasoning assistant. Analyze the incoming user intent and synthesize verified knowledge into a solution.",
      inputs: ["query: string", "context: array"],
      outputs: ["response: string", "citations: array"],
    },
  },
  {
    category: "agent",
    title: "Intent & Safety Guard",
    subtitle: "Classifier & jailbreak detection",
    defaultConfig: {
      model: "Explorer Fast 1.5",
      temperature: 0.1,
      maxTokens: 1024,
      streaming: false,
      systemPrompt:
        "Classify the intent of user prompt and check for policy violations.",
      inputs: ["input_text: string"],
      outputs: ["is_safe: boolean", "intent: string"],
    },
  },
  {
    category: "agent",
    title: "Code Specialist",
    subtitle: "Synthesizes code and runs checks",
    defaultConfig: {
      model: "Quantum Code 3.0",
      temperature: 0.2,
      maxTokens: 4096,
      streaming: true,
      systemPrompt: "Generate type-safe, tested code snippets.",
      inputs: ["task: string", "language: string"],
      outputs: ["code: string", "tests: string"],
    },
  },
  // Tools
  {
    category: "tool",
    title: "Vector RAG Retriever",
    subtitle: "Hybrid search across document index",
    defaultConfig: {
      toolAction: "vector_search",
      inputs: ["embedding_query: string", "top_k: number"],
      outputs: ["documents: array", "scores: array"],
    },
  },
  {
    category: "tool",
    title: "Python Code Sandbox",
    subtitle: "Execute isolated code in container",
    defaultConfig: {
      toolAction: "python_exec",
      inputs: ["script: string"],
      outputs: ["stdout: string", "return_code: number"],
    },
  },
  {
    category: "tool",
    title: "SQL Query Tool",
    subtitle: "Read-only enterprise database query",
    defaultConfig: {
      toolAction: "sql_select",
      inputs: ["sql_statement: string"],
      outputs: ["rows: array", "count: number"],
    },
  },
  // Logic
  {
    category: "router",
    title: "Conditional Router",
    subtitle: "Branch workflow based on rule",
    defaultConfig: {
      condition: "confidence_score >= 0.85",
      inputs: ["eval_expression: string"],
      outputs: ["branch_true", "branch_false"],
    },
  },
  {
    category: "router",
    title: "Human Approval Gate",
    subtitle: "Pause until authorized by reviewer",
    defaultConfig: {
      condition: "risk_level == 'high'",
      inputs: ["approval_request: object"],
      outputs: ["status: approved | rejected"],
    },
  },
  // Outputs
  {
    category: "output",
    title: "Action Dispatcher",
    subtitle: "Deliver final response to client",
    defaultConfig: {
      inputs: ["message: string", "attachments: array"],
      outputs: ["delivery_status: success"],
    },
  },
  {
    category: "output",
    title: "Slack / Webhook Alert",
    subtitle: "Post notification to incident channel",
    defaultConfig: {
      inputs: ["channel: string", "text: string"],
      outputs: ["sent_at: string"],
    },
  },
]

function getCategoryIcon(cat: NodeCategory) {
  switch (cat) {
    case "trigger":
      return <HugeiconsIcon icon={AirplayIcon} className="size-3.5" />
    case "agent":
      return <HugeiconsIcon icon={AiBrain05Icon} className="size-3.5" />
    case "tool":
      return <HugeiconsIcon icon={Database01Icon} className="size-3.5" />
    case "router":
      return <HugeiconsIcon icon={GitBranchIcon} className="size-3.5" />
    case "output":
      return <HugeiconsIcon icon={SentIcon} className="size-3.5" />
  }
}

export function NodePalette({ isOpen, onToggle, onAddNode }: NodePaletteProps) {
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<NodeCategory | "all">("all")

  const filtered = React.useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      const matchesSearch =
        tpl.title.toLowerCase().includes(search.toLowerCase()) ||
        tpl.subtitle.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeTab === "all" || tpl.category === activeTab
      return matchesSearch && matchesCategory
    })
  }, [search, activeTab])

  if (!isOpen) {
    return (
      <div className="absolute top-3 left-3 z-20">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggle}
          title="Open Node Library"
          className="border-border bg-card/90 shadow-sm backdrop-blur-md"
        >
          <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      data-slot="node-palette"
      className={cn(
        "absolute top-0 bottom-0 left-0 z-20 flex w-72 flex-col border-r border-border bg-card/95 shadow-lg backdrop-blur-md transition-all"
      )}
    >
      {/* Palette Header */}
      <div className="flex items-center justify-between border-b border-border p-3.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={Layers01Icon} className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Node Library
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Click to insert into canvas
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggle}
          title="Collapse Panel"
        >
          <HugeiconsIcon icon={SidebarLeftIcon} className="size-3.5" />
        </Button>
      </div>

      {/* Search Input */}
      <div className="border-b border-border/60 p-3">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="h-8 bg-surface pl-8 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="mt-2 flex flex-wrap gap-1">
          {(
            ["all", "trigger", "agent", "tool", "router", "output"] as const
          ).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-medium capitalize transition-colors",
                activeTab === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Nodes List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No matching nodes found.
          </div>
        ) : (
          filtered.map((tpl, idx) => (
            <div
              key={`${tpl.title}-${idx}`}
              onClick={() => onAddNode(tpl)}
              className={cn(
                "group relative flex cursor-pointer items-start justify-between rounded-lg border border-border/70 bg-surface p-2.5 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {getCategoryIcon(tpl.category)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {tpl.title}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {tpl.subtitle}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-muted-foreground group-hover:text-primary"
                title="Add to canvas"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="size-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border p-2.5 text-center text-[10px] text-muted-foreground">
        Click any node to place on canvas
      </div>
    </div>
  )
}
