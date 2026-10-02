"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SidebarRightIcon,
  Settings01Icon,
  Copy01Icon,
  Tick02Icon,
  Delete02Icon,
  Activity01Icon,
  Clock01Icon,
  Coins01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WorkflowNode } from "./workflow-types"

interface NodeInspectorProps {
  selectedNode: WorkflowNode | null
  isOpen: boolean
  onToggle: () => void
  onUpdateNode: (id: string, updates: Partial<WorkflowNode>) => void
  onDeleteNode: (id: string) => void
  totalNodes: number
  totalEdges: number
}

const AVAILABLE_MODELS = [
  { id: "Genesis Ultra 2.5", label: "Genesis Ultra 2.5 (Flagship Reasoning)" },
  { id: "Explorer Fast 1.5", label: "Explorer Fast 1.5 (Low Latency Guard)" },
  { id: "Quantum Code 3.0", label: "Quantum Code 3.0 (Specialized Code)" },
  { id: "Genesis Lite 1.0", label: "Genesis Lite 1.0 (High Throughput)" },
]

export function NodeInspector({
  selectedNode,
  isOpen,
  onToggle,
  onUpdateNode,
  onDeleteNode,
  totalNodes,
  totalEdges,
}: NodeInspectorProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyPayload = () => {
    if (!selectedNode?.telemetry.outputPreview) return
    navigator.clipboard.writeText(selectedNode.telemetry.outputPreview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) {
    return (
      <div className="absolute top-3 right-3 z-20">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggle}
          title="Open Node Inspector"
          className="border-border bg-card/90 shadow-sm backdrop-blur-md"
        >
          <HugeiconsIcon icon={SidebarRightIcon} className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      data-slot="node-inspector"
      className={cn(
        "absolute top-0 right-0 bottom-0 z-20 flex w-80 flex-col border-l border-border bg-card/95 shadow-lg backdrop-blur-md transition-all"
      )}
    >
      {/* Inspector Header */}
      <div className="flex items-center justify-between border-b border-border p-3.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {selectedNode ? "Node Inspector" : "Pipeline Overview"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {selectedNode ? selectedNode.title : "Global configuration"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggle}
          title="Collapse Panel"
        >
          <HugeiconsIcon icon={SidebarRightIcon} className="size-3.5" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode ? (
          <div className="space-y-4">
            {/* Node Metadata Card */}
            <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] tracking-wider uppercase"
                >
                  {selectedNode.category}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] capitalize",
                    selectedNode.status === "success" &&
                      "border-success/30 bg-success/10 text-success",
                    selectedNode.status === "running" &&
                      "animate-pulse border-accent/30 bg-accent/10 text-accent",
                    selectedNode.status === "error" &&
                      "border-danger/30 bg-danger/10 text-danger"
                  )}
                >
                  {selectedNode.status}
                </Badge>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Node Title
                </Label>
                <Input
                  value={selectedNode.title}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, { title: e.target.value })
                  }
                  className="mt-1 h-8 bg-card text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Description
                </Label>
                <Input
                  value={selectedNode.subtitle}
                  onChange={(e) =>
                    onUpdateNode(selectedNode.id, { subtitle: e.target.value })
                  }
                  className="mt-1 h-8 bg-card text-xs"
                />
              </div>
            </div>

            {/* Inspector Tabs */}
            <Tabs defaultValue="config">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="config" className="text-xs">
                  Config
                </TabsTrigger>
                <TabsTrigger value="schema" className="text-xs">
                  Schema
                </TabsTrigger>
                <TabsTrigger value="telemetry" className="text-xs">
                  Telemetry
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Config */}
              <TabsContent value="config" className="space-y-3 pt-2">
                {selectedNode.category === "agent" && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Target Model</Label>
                      <Select
                        value={selectedNode.config.model || "Genesis Ultra 2.5"}
                        onValueChange={(val) =>
                          onUpdateNode(selectedNode.id, {
                            config: {
                              ...selectedNode.config,
                              model: val || undefined,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="h-8 bg-surface text-xs">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODELS.map((m) => (
                            <SelectItem
                              key={m.id}
                              value={m.id}
                              className="text-xs"
                            >
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">System Instructions</Label>
                      <Textarea
                        value={selectedNode.config.systemPrompt || ""}
                        onChange={(e) =>
                          onUpdateNode(selectedNode.id, {
                            config: {
                              ...selectedNode.config,
                              systemPrompt: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="bg-surface text-xs leading-relaxed"
                        placeholder="Define system persona and constraints..."
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <Label>Temperature</Label>
                        <span className="font-mono text-muted-foreground">
                          {selectedNode.config.temperature ?? 0.7}
                        </span>
                      </div>
                      <Slider
                        value={[selectedNode.config.temperature ?? 0.7]}
                        min={0}
                        max={1}
                        step={0.05}
                        onValueChange={(val) => {
                          const temp = Array.isArray(val)
                            ? val[0]
                            : typeof val === "number"
                              ? val
                              : 0.7
                          onUpdateNode(selectedNode.id, {
                            config: {
                              ...selectedNode.config,
                              temperature: temp,
                            },
                          })
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Label className="cursor-pointer text-xs">
                        Stream Output
                      </Label>
                      <Switch
                        checked={selectedNode.config.streaming ?? true}
                        onCheckedChange={(checked) =>
                          onUpdateNode(selectedNode.id, {
                            config: {
                              ...selectedNode.config,
                              streaming: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="cursor-pointer text-xs">
                        Fallback Failover
                      </Label>
                      <Switch
                        checked={selectedNode.config.fallbackModel ?? false}
                        onCheckedChange={(checked) =>
                          onUpdateNode(selectedNode.id, {
                            config: {
                              ...selectedNode.config,
                              fallbackModel: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {selectedNode.category === "router" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Routing Condition</Label>
                    <Input
                      value={selectedNode.config.condition || ""}
                      onChange={(e) =>
                        onUpdateNode(selectedNode.id, {
                          config: {
                            ...selectedNode.config,
                            condition: e.target.value,
                          },
                        })
                      }
                      className="h-8 bg-surface font-mono text-xs"
                      placeholder="e.g. confidence >= 0.85"
                    />
                  </div>
                )}

                {selectedNode.category === "tool" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Tool Handler Action</Label>
                    <Input
                      value={selectedNode.config.toolAction || "vector_search"}
                      onChange={(e) =>
                        onUpdateNode(selectedNode.id, {
                          config: {
                            ...selectedNode.config,
                            toolAction: e.target.value,
                          },
                        })
                      }
                      className="h-8 bg-surface font-mono text-xs"
                    />
                  </div>
                )}

                {selectedNode.category === "trigger" && (
                  <div className="rounded-md bg-muted/50 p-2.5 text-xs text-muted-foreground">
                    Triggers initialize the execution context upon receipt of an
                    external event or user prompt.
                  </div>
                )}

                {selectedNode.category === "output" && (
                  <div className="rounded-md bg-muted/50 p-2.5 text-xs text-muted-foreground">
                    Terminal node that formats and dispatches the final payload
                    to consumer clients.
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Schema */}
              <TabsContent value="schema" className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Input Parameters
                  </Label>
                  <div className="space-y-1">
                    {(selectedNode.config.inputs || ["input: any"]).map(
                      (inp, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md border border-border/60 bg-surface px-2.5 py-1 text-xs"
                        >
                          <span className="font-mono text-[11px] text-primary">
                            {inp}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            required
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-medium">
                    Output Variables
                  </Label>
                  <div className="space-y-1">
                    {(selectedNode.config.outputs || ["output: any"]).map(
                      (out, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md border border-border/60 bg-surface px-2.5 py-1 text-xs"
                        >
                          <span className="font-mono text-[11px] text-accent">
                            {out}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            emitted
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Telemetry */}
              <TabsContent value="telemetry" className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-border bg-surface p-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                      Latency
                    </div>
                    <div className="mt-1 font-mono text-sm font-semibold">
                      {selectedNode.telemetry.lastLatencyMs
                        ? `${selectedNode.telemetry.lastLatencyMs} ms`
                        : "—"}
                    </div>
                  </div>

                  <div className="rounded-md border border-border bg-surface p-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <HugeiconsIcon icon={Coins01Icon} className="size-3" />
                      Tokens
                    </div>
                    <div className="mt-1 font-mono text-sm font-semibold">
                      {selectedNode.telemetry.tokensUsed
                        ? `${selectedNode.telemetry.tokensUsed}`
                        : "—"}
                    </div>
                  </div>
                </div>

                {selectedNode.telemetry.outputPreview && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Output Payload</Label>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleCopyPayload}
                        title="Copy JSON payload"
                      >
                        <HugeiconsIcon
                          icon={copied ? Tick02Icon : Copy01Icon}
                          className="size-3 text-muted-foreground"
                        />
                      </Button>
                    </div>
                    <pre className="max-h-36 overflow-x-auto rounded-md bg-muted p-2 font-mono text-[10px] leading-normal whitespace-pre-wrap text-muted-foreground">
                      {selectedNode.telemetry.outputPreview}
                    </pre>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Danger Actions */}
            <div className="border-t border-border pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 border-danger/20 text-xs text-danger hover:bg-danger/10 hover:text-danger"
                onClick={() => onDeleteNode(selectedNode.id)}
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                Delete Node
              </Button>
            </div>
          </div>
        ) : (
          /* Pipeline Overview when no node is selected */
          <div className="space-y-4">
            <div className="space-y-2 rounded-lg border border-border bg-surface p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Graph Architecture
                </span>
                <Badge variant="outline" className="text-[10px] text-accent">
                  Connected DAG
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="rounded-md bg-muted/60 p-2">
                  <span className="block text-[10px] text-muted-foreground">
                    Active Nodes
                  </span>
                  <span className="text-base font-semibold">{totalNodes}</span>
                </div>
                <div className="rounded-md bg-muted/60 p-2">
                  <span className="block text-[10px] text-muted-foreground">
                    Data Edges
                  </span>
                  <span className="text-base font-semibold">{totalEdges}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border bg-card p-3 text-xs">
              <h4 className="flex items-center gap-1.5 font-semibold text-foreground">
                <HugeiconsIcon
                  icon={Activity01Icon}
                  className="size-3.5 text-primary"
                />
                Quick Orchestration Tips
              </h4>
              <ul className="space-y-1.5 text-[11px] leading-relaxed text-muted-foreground">
                <li>
                  • Drag nodes on the canvas to re-arrange graph hierarchy.
                </li>
                <li>
                  • Click &quot;Test Run&quot; to simulate end-to-end
                  multi-agent execution.
                </li>
                <li>
                  • Select any node to customize prompts, models, and
                  hyperparameters.
                </li>
                <li>
                  • Use the mouse wheel or bottom toolbar to pan and zoom.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
