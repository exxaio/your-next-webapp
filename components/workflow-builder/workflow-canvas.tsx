"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cursor01Icon,
  HandIcon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  Maximize01Icon,
  ArrowReloadHorizontalIcon,
  SparklesIcon,
  PlusSignIcon,
  Grid02Icon,
  MapsIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { WorkflowNodeCard } from "./workflow-node"
import { MiniMap } from "./minimap"
import type { WorkflowNode, WorkflowEdge } from "./workflow-types"

interface WorkflowCanvasProps {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  onSelectNode: (id: string | null) => void
  onUpdateNodePosition: (id: string, x: number, y: number) => void
  onDeleteNode: (id: string) => void
  onDuplicateNode: (id: string) => void
  onAddNodeAtCenter: () => void
  onAutoLayout: () => void
  onResetCanvas: () => void
  isRunning: boolean
}

export function WorkflowCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  onDeleteNode,
  onDuplicateNode,
  onAddNodeAtCenter,
  onAutoLayout,
  onResetCanvas,
  isRunning,
}: WorkflowCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = React.useState(1)
  const [panOffset, setPanOffset] = React.useState({ x: 40, y: 40 })
  const [activeMode, setActiveMode] = React.useState<"select" | "pan">("select")
  const [showGrid, setShowGrid] = React.useState(true)
  const [showMinimap, setShowMinimap] = React.useState(true)
  const [dimensions, setDimensions] = React.useState({
    width: 1000,
    height: 700,
  })

  // Dragging state
  const isDraggingCanvas = React.useRef(false)
  const dragStartPos = React.useRef({ x: 0, y: 0 })
  const activeDragNode = React.useRef<{
    id: string
    startX: number
    startY: number
    nodeStartX: number
    nodeStartY: number
  } | null>(null)

  // Measure container dimensions
  React.useEffect(() => {
    if (!containerRef.current) return
    const updateDims = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateDims()
    window.addEventListener("resize", updateDims)
    return () => window.removeEventListener("resize", updateDims)
  }, [])

  // Canvas Mouse Down (Pan canvas or deselect)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only primary button
    if (activeMode === "pan" || e.altKey) {
      isDraggingCanvas.current = true
      dragStartPos.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      }
    } else {
      onSelectNode(null)
    }
  }

  // Node Drag Start
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const targetNode = nodes.find((n) => n.id === id)
    if (!targetNode) return

    onSelectNode(id)

    if (activeMode === "pan") {
      isDraggingCanvas.current = true
      dragStartPos.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      }
      return
    }

    activeDragNode.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      nodeStartX: targetNode.x,
      nodeStartY: targetNode.y,
    }
  }

  // Global Mouse Move for pan and node dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas.current) {
      setPanOffset({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      })
      return
    }

    if (activeDragNode.current) {
      const dx = (e.clientX - activeDragNode.current.startX) / zoom
      const dy = (e.clientY - activeDragNode.current.startY) / zoom
      const newX =
        Math.round((activeDragNode.current.nodeStartX + dx) / 10) * 10
      const newY =
        Math.round((activeDragNode.current.nodeStartY + dy) / 10) * 10

      onUpdateNodePosition(activeDragNode.current.id, newX, newY)
    }
  }

  // Global Mouse Up
  const handleMouseUp = () => {
    isDraggingCanvas.current = false
    activeDragNode.current = null
  }

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      setZoom((prev) => Math.min(Math.max(0.4, prev + delta), 1.6))
    } else if (activeMode === "pan") {
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }))
    }
  }

  // Zoom Helpers
  const handleZoomIn = () => setZoom((z) => Math.min(1.6, z + 0.15))
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, z - 0.15))
  const handleZoomReset = () => {
    setZoom(1)
    setPanOffset({ x: 40, y: 40 })
  }
  const handleFitToView = () => {
    if (nodes.length === 0) return
    const minX = Math.min(...nodes.map((n) => n.x))
    const maxX = Math.max(...nodes.map((n) => n.x + 260))
    const minY = Math.min(...nodes.map((n) => n.y))
    const maxY = Math.max(...nodes.map((n) => n.y + 120))

    const graphWidth = maxX - minX + 160
    const graphHeight = maxY - minY + 160

    const scaleX = dimensions.width / graphWidth
    const scaleY = dimensions.height / graphHeight
    const newZoom = Math.min(Math.max(0.5, Math.min(scaleX, scaleY)), 1.2)

    setZoom(newZoom)
    setPanOffset({
      x: (dimensions.width - (maxX + minX) * newZoom) / 2,
      y: (dimensions.height - (maxY + minY) * newZoom) / 2,
    })
  }

  return (
    <div
      ref={containerRef}
      data-slot="workflow-canvas"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={cn(
        "relative h-full w-full flex-1 overflow-hidden bg-background select-none",
        activeMode === "pan"
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      )}
    >
      <style>{`
        @keyframes flowDash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .flow-animated-edge {
          stroke-dasharray: 6 6;
          animation: flowDash 0.8s linear infinite;
        }
      `}</style>

      {/* Background SVG Grid */}
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="canvas-grid-pattern"
            width={24 * zoom}
            height={24 * zoom}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}
          >
            {showGrid && (
              <circle
                cx={2 * zoom}
                cy={2 * zoom}
                r={1.2}
                className="fill-muted-foreground/25"
              />
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#canvas-grid-pattern)" />
      </svg>

      {/* Infinite Canvas Layer (Pan & Zoom Transformed) */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
        className="absolute top-0 left-0 will-change-transform"
      >
        {/* SVG Edges Layer */}
        <svg
          className="pointer-events-none absolute top-0 left-0 overflow-visible"
          style={{ width: 1, height: 1 }}
        >
          <defs>
            <marker
              id="edge-arrow-idle"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1 L 8 5 L 0 9 z"
                className="fill-muted-foreground/60"
              />
            </marker>
            <marker
              id="edge-arrow-active"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" className="fill-accent" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            const targetNode = nodes.find((n) => n.id === edge.target)
            if (!sourceNode || !targetNode) return null

            // Output port position of source
            const x1 = sourceNode.x + 256
            const y1 = sourceNode.y + 44

            // Input port position of target
            const x2 = targetNode.x
            const y2 = targetNode.y + 44

            // Bezier curvature
            const dx = Math.max(40, Math.abs(x2 - x1) * 0.45)
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`

            const isEdgeActive =
              isRunning ||
              sourceNode.status === "running" ||
              sourceNode.status === "success"

            return (
              <g key={edge.id} className="transition-all">
                {/* Background wider hit target */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={14}
                  className="pointer-events-stroke cursor-pointer"
                />

                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isEdgeActive ? "var(--accent)" : "var(--border)"}
                  strokeWidth={isEdgeActive ? 2.5 : 1.75}
                  markerEnd={
                    isEdgeActive
                      ? "url(#edge-arrow-active)"
                      : "url(#edge-arrow-idle)"
                  }
                  className={cn(
                    "transition-colors duration-300",
                    isEdgeActive && "flow-animated-edge"
                  )}
                />

                {/* Optional Connection Label Pill */}
                {edge.label && (
                  <g
                    transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}
                  >
                    <rect
                      x="-38"
                      y="-10"
                      width="76"
                      height="20"
                      rx="10"
                      className="fill-card stroke-border"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground font-mono text-[10px] select-none"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => (
          <WorkflowNodeCard
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={onSelectNode}
            onDelete={onDeleteNode}
            onDuplicate={onDuplicateNode}
            onMouseDown={handleNodeMouseDown}
          />
        ))}
      </div>

      {/* Floating Center Control Toolbar */}
      <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border bg-card/85 px-1.5 py-1 shadow-md backdrop-blur-md">
        <Button
          variant={activeMode === "select" ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setActiveMode("select")}
          title="Pointer / Select Mode (V)"
          className={cn(activeMode === "select" && "text-primary")}
        >
          <HugeiconsIcon icon={Cursor01Icon} className="size-3.5" />
        </Button>

        <Button
          variant={activeMode === "pan" ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setActiveMode("pan")}
          title="Pan Hand Mode (H)"
          className={cn(activeMode === "pan" && "text-primary")}
        >
          <HugeiconsIcon icon={HandIcon} className="size-3.5" />
        </Button>

        <div className="mx-0.5 h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onAddNodeAtCenter}
          title="Add Node to Canvas"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onAutoLayout}
          title="Auto-Arrange Nodes"
        >
          <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onResetCanvas}
          title="Reset Pipeline Layout"
        >
          <HugeiconsIcon
            icon={ArrowReloadHorizontalIcon}
            className="size-3.5"
          />
        </Button>

        <div className="mx-0.5 h-4 w-px bg-border" />

        <Button
          variant={showGrid ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid Dots"
        >
          <HugeiconsIcon icon={Grid02Icon} className="size-3.5" />
        </Button>
      </div>

      {/* Floating Bottom Left: Zoom & Viewport Controls */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-xl border border-border bg-card/85 px-1.5 py-1 shadow-md backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <HugeiconsIcon icon={ZoomOutAreaIcon} className="size-3.5" />
        </Button>

        <button
          type="button"
          onClick={handleZoomReset}
          title="Click to reset 100%"
          className="px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {Math.round(zoom * 100)}%
        </button>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <HugeiconsIcon icon={ZoomInAreaIcon} className="size-3.5" />
        </Button>

        <div className="mx-0.5 h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleFitToView}
          title="Fit Graph to View"
        >
          <HugeiconsIcon icon={Maximize01Icon} className="size-3.5" />
        </Button>

        <Button
          variant={showMinimap ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setShowMinimap(!showMinimap)}
          title="Toggle Mini-map"
        >
          <HugeiconsIcon icon={MapsIcon} className="size-3.5" />
        </Button>
      </div>

      {/* Floating Bottom Right: MiniMap */}
      {showMinimap && (
        <div className="pointer-events-auto absolute right-3 bottom-3 z-10">
          <MiniMap
            nodes={nodes}
            zoom={zoom}
            panOffset={panOffset}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        </div>
      )}
    </div>
  )
}
