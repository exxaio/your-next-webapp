"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AirplayIcon,
  AiBrain05Icon,
  Database01Icon,
  GitBranchIcon,
  SentIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Copy01Icon,
  Delete02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { WorkflowNode, NodeCategory } from "./workflow-types"

interface WorkflowNodeProps {
  node: WorkflowNode
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMouseDown: (e: React.MouseEvent, id: string) => void
}

function getCategoryIcon(category: NodeCategory) {
  switch (category) {
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

function getCategoryBadgeClass(category: NodeCategory) {
  switch (category) {
    case "trigger":
      return "border-info/30 bg-info/10 text-info"
    case "agent":
      return "border-primary/30 bg-primary/10 text-primary"
    case "tool":
      return "border-warning/30 bg-warning/10 text-warning"
    case "router":
      return "border-accent/30 bg-accent/10 text-accent"
    case "output":
      return "border-success/30 bg-success/10 text-success"
  }
}

export function WorkflowNodeCard({
  node,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMouseDown,
}: WorkflowNodeProps) {
  const isTrigger = node.category === "trigger"
  const isOutput = node.category === "output"

  return (
    <div
      data-slot="workflow-node"
      role="button"
      tabIndex={0}
      aria-label={`${node.title} node`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(node.id)
        }
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(node.id)
      }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
      }}
      className={cn(
        "group absolute cursor-grab select-none active:cursor-grabbing",
        "w-64 rounded-xl border bg-card p-3 shadow-xs transition-shadow duration-150",
        isSelected
          ? "border-primary shadow-md ring-2 ring-primary/20"
          : "border-border hover:border-border/80 hover:shadow-xs",
        node.status === "running" &&
          "animate-pulse border-accent/60 ring-2 ring-accent/30",
        node.status === "error" && "border-danger/60 ring-2 ring-danger/30"
      )}
    >
      {/* Input Port (unless trigger) */}
      {!isTrigger && (
        <div
          data-slot="node-port-input"
          title="Input connection port"
          className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full border-2 border-background bg-muted-foreground/60 transition-transform hover:scale-125 hover:bg-primary"
        />
      )}

      {/* Output Port (unless terminal output) */}
      {!isOutput && (
        <div
          data-slot="node-port-output"
          title="Output connection port"
          className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full border-2 border-background bg-muted-foreground/60 transition-transform hover:scale-125 hover:bg-primary"
        />
      )}

      {/* Card Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn(
              "flex shrink-0 items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase",
              getCategoryBadgeClass(node.category)
            )}
          >
            {getCategoryIcon(node.category)}
            <span>{node.category}</span>
          </Badge>
        </div>

        {/* Status Indicator */}
        <div className="flex shrink-0 items-center gap-1">
          {node.status === "running" && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-accent">
              <span className="size-2 animate-ping rounded-full bg-accent" />
              Run
            </span>
          )}
          {node.status === "success" && (
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-success">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-3 text-success"
              />
            </span>
          )}
          {node.status === "error" && (
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-danger">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="size-3 text-danger"
              />
            </span>
          )}
          {node.status === "idle" && (
            <span className="size-2 rounded-full bg-muted-foreground/30" />
          )}

          {/* Quick node action buttons visible on hover/selected */}
          <div className="ml-1 hidden items-center gap-0.5 group-hover:flex">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate(node.id)
              }}
              title="Duplicate node"
            >
              <HugeiconsIcon icon={Copy01Icon} className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id)
              }}
              className="text-danger hover:bg-danger/10 hover:text-danger"
              title="Delete node"
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Node Title & Description */}
      <div className="mt-2 min-w-0">
        <h4 className="truncate text-sm font-semibold tracking-tight text-foreground">
          {node.title}
        </h4>
        <p className="truncate text-xs text-muted-foreground">
          {node.subtitle}
        </p>
      </div>

      {/* Node Metrics / Telemetry Pill */}
      {node.telemetry.lastLatencyMs !== undefined && (
        <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-mono">
            <HugeiconsIcon icon={Clock01Icon} className="size-2.5" />
            {node.telemetry.lastLatencyMs}ms
          </span>
          {node.telemetry.tokensUsed !== undefined && (
            <span className="font-mono">{node.telemetry.tokensUsed} tok</span>
          )}
        </div>
      )}
    </div>
  )
}
