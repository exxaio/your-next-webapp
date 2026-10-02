"use client"

import * as React from "react"
import { cn } from "cn"
import type { WorkflowNode } from "./workflow-types"

interface MiniMapProps {
  nodes: WorkflowNode[]
  zoom: number
  panOffset: { x: number; y: number }
  containerWidth: number
  containerHeight: number
  className?: string
}

export function MiniMap({
  nodes,
  zoom,
  panOffset,
  containerWidth,
  containerHeight,
  className,
}: MiniMapProps) {
  const mapWidth = 140
  const mapHeight = 90

  // Calculate bounds of all nodes
  const minX = Math.min(...nodes.map((n) => n.x), 0) - 100
  const maxX =
    Math.max(...nodes.map((n) => n.x + 260), containerWidth || 800) + 100
  const minY = Math.min(...nodes.map((n) => n.y), 0) - 100
  const maxY =
    Math.max(...nodes.map((n) => n.y + 120), containerHeight || 600) + 100

  const worldWidth = Math.max(maxX - minX, 1000)
  const worldHeight = Math.max(maxY - minY, 700)

  const scaleX = mapWidth / worldWidth
  const scaleY = mapHeight / worldHeight
  const scale = Math.min(scaleX, scaleY)

  // Viewport rectangle calculation
  const vpX = (-panOffset.x - minX) * scale
  const vpY = (-panOffset.y - minY) * scale
  const vpW = ((containerWidth || 800) / zoom) * scale
  const vpH = ((containerHeight || 600) / zoom) * scale

  return (
    <div
      data-slot="canvas-minimap"
      className={cn(
        "rounded-lg border border-border bg-card/90 p-1.5 shadow-md backdrop-blur-md",
        className
      )}
    >
      <div
        style={{ width: mapWidth, height: mapHeight }}
        className="relative overflow-hidden rounded bg-muted/40"
      >
        {/* Render nodes as miniature pills */}
        {nodes.map((node) => {
          const nx = (node.x - minX) * scale
          const ny = (node.y - minY) * scale
          const nw = Math.max(260 * scale, 6)
          const nh = Math.max(80 * scale, 3)

          return (
            <div
              key={node.id}
              style={{
                left: `${nx}px`,
                top: `${ny}px`,
                width: `${nw}px`,
                height: `${nh}px`,
              }}
              className={cn(
                "absolute rounded-xs transition-colors",
                node.status === "running"
                  ? "bg-accent"
                  : node.status === "success"
                    ? "bg-success"
                    : "bg-muted-foreground/50"
              )}
            />
          )
        })}

        {/* Viewport frame */}
        <div
          style={{
            left: `${Math.max(0, vpX)}px`,
            top: `${Math.max(0, vpY)}px`,
            width: `${Math.min(mapWidth, Math.max(10, vpW))}px`,
            height: `${Math.min(mapHeight, Math.max(10, vpH))}px`,
          }}
          className="pointer-events-none absolute rounded-xs border border-primary bg-primary/10"
        />
      </div>
    </div>
  )
}
