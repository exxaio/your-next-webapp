export type NodeCategory = "trigger" | "agent" | "tool" | "router" | "output"
export type NodeStatus = "idle" | "running" | "success" | "error"

export interface WorkflowNodeConfig {
  model?: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  streaming?: boolean
  fallbackModel?: boolean
  inputs?: string[]
  outputs?: string[]
  condition?: string
  toolAction?: string
}

export interface NodeTelemetry {
  lastLatencyMs?: number
  tokensUsed?: number
  costUsd?: number
  outputPreview?: string
  executedAt?: string
}

export interface WorkflowNode {
  id: string
  title: string
  subtitle: string
  category: NodeCategory
  x: number
  y: number
  status: NodeStatus
  config: WorkflowNodeConfig
  telemetry: NodeTelemetry
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
}

export interface NodeTemplate {
  category: NodeCategory
  title: string
  subtitle: string
  defaultConfig: WorkflowNodeConfig
}
