# Agent Workflow Builder Guide

The **Agent Workflow Builder** (`/workflows`) is a visual orchestration canvas for designing, testing, and deploying autonomous multi-agent systems and Retrieval-Augmented Generation (RAG) pipelines.

It serves as the reference implementation for **Archetype 3 (Interactive Canvas)** using `<PageContainer variant="canvas">`.

---

## 1. Page Architecture & Layout Archetype

The builder is constructed around a viewport-locked, zero-scroll architecture designed for canvas interactivity:

```
┌────────────────────────────────────────────────────────────────────────┐
│ <TopNavbar />                                                          │
│ Breadcrumbs: Workflows > Pipeline Name  │  [Test Run] [Deploy] [Share] │
├────────────────────────────────────────────────────────────────────────┤
│ <PageContainer variant="canvas">                                       │
│ ┌──────────────┬───────────────────────────────────────┬─────────────┐ │
│ │ Node Library │ Boundless Interactive Canvas          │ Inspector   │ │
│ │ (Palette)    │ - Panning & Zooming (0.4x - 1.6x)     │ - Config    │ │
│ │              │ - Draggable Node Cards                │ - Schema    │ │
│ │ - Triggers   │ - Animated SVG Bezier Connectors      │ - Telemetry │ │
│ │ - AI Agents  │ - Floating Controls (Center & Bottom) │             │ │
│ │ - Tools      │ - Mini-map Navigator (Bottom-Right)   │             │ │
│ │ - Logic      │                                       │             │ │
│ │ - Outputs    │                                       │             │ │
│ └──────────────┴───────────────────────────────────────┴─────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Containment Rules
- **Container**: `<PageContainer variant="canvas">` applies `h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.5rem)]` with `overflow-hidden`.
- **Top Navigation Integration**: Breadcrumbs are automatically resolved by `<TopNavbar />` to `Workflows > Agent Builder`, and primary workflow execution triggers are mounted via `<NavbarActions>`.
- **Screen Reader Accessible Header**: `<h1 className="sr-only">Agent Workflow Builder</h1>`.

---

## 2. Core Features & User Workflows

### 2.1 Canvas Navigation & Viewport Controls

| Action | Control / Shortcut | Description |
|--------|--------------------|-------------|
| **Select / Move** | `V` / Pointer Icon | Click nodes to select; drag to reposition. |
| **Pan Canvas** | `H` / Hand Icon, or `Alt + Drag` | Pan across the infinite canvas surface. |
| **Mouse Wheel Pan/Zoom** | `Ctrl + Wheel` / `Cmd + Wheel` | Dynamically zoom in and out (40% to 160%). |
| **Fit to Screen** | Maximize Icon (Bottom Toolbar) | Automatically scales and centers all nodes in view. |
| **Reset View** | `100%` Button | Resets zoom to 1.0 and pan offset to origin `(40, 40)`. |
| **Toggle Grid** | Grid Icon (Top Toolbar) | Shows or hides the dot grid pattern. |
| **Mini-map** | Map Icon (Bottom Toolbar) | Shows or hides the real-time layout overview. |

---

### 2.2 Preloaded Demo Pipeline

The canvas is preconfigured with an end-to-end enterprise support pipeline:

1. **Webhook Trigger** (`trigger`): Captures incoming HTTP POST payloads and extracts query parameters.
2. **Intent & Safety Guard** (`agent`): Runs fast classification with *Explorer Fast 1.5* to reject prompt injection and classify intent.
3. **Vector RAG Retriever** (`tool`): Performs hybrid search across enterprise documentation embeddings (`top_k=4`).
4. **Reasoning Synthesizer** (`agent`): Utilizes *Genesis Ultra 2.5* chain-of-thought reasoning to formulate a verified solution with citations.
5. **Human Approval Gate** (`router`): Evaluates risk policy (`risk_score < 0.70`) to determine if human intervention is required.
6. **Action Dispatcher** (`output`): Streams the verified resolution back to the user client and updates audit logs.

---

### 2.3 Simulating & Testing Workflows ("Test Run")

Clicking **"Test Run"** in the top navigation bar executes a simulated data flow across the pipeline:

1. **Live State Propagation**:
   - Nodes transition from `idle` &rarr; `running` (pulsing accent ring) &rarr; `success` (green checkmark).
2. **Animated Edge Flow**:
   - Connector paths display animated glowing stroke dashes (`stroke-dasharray="6 6"`) indicating active data transfer.
3. **Telemetry Generation**:
   - Latency (ms), tokens consumed, and simulated cost are calculated per node.
4. **Completion Summary**:
   - A floating status toast appears with the aggregated execution summary:
     `"Pipeline executed successfully in 1.15s • 1,540 tokens • $0.0031 total cost"`.

---

### 2.4 Node Library (Left Palette)

Click the **SidebarLeft** icon in the canvas to expand or collapse the Node Library.

- **Search**: Filter nodes by keyword across titles and descriptions.
- **Categories**:
  - **Triggers**: Webhook Event, Scheduled Cron, User Prompt.
  - **AI Agents**: Reasoning Agent, Intent & Safety Guard, Code Specialist, Prompt Agent.
  - **Tools**: Vector RAG Retriever, Python Code Sandbox, SQL Query Tool.
  - **Logic & Routing**: Conditional Router, Human Approval Gate.
  - **Outputs**: Action Dispatcher, Slack / Webhook Alert.
- **Insert**: Click any node card or the **+** button to place it directly on the canvas.

---

### 2.5 Node Inspector (Right Drawer)

Selecting any node on the canvas opens the **Node Inspector** on the right side:

#### 1. Configuration Tab (`Config`)
- **Target Model**: Switch between *Genesis Ultra 2.5*, *Explorer Fast 1.5*, *Quantum Code 3.0*, or *Genesis Lite 1.0*.
- **System Instructions**: Define persona instructions, role constraints, and reasoning protocols.
- **Hyperparameter Sliders**: Adjust `temperature` (0.0 to 1.0) and token generation limits.
- **Feature Toggles**: Enable/disable streaming output and fallback failover models.
- **Conditional Rules**: For router nodes, configure the boolean decision expression.

#### 2. Schema Tab (`Schema`)
- Inspect required input parameters and emitted output variables.

#### 3. Telemetry Tab (`Telemetry`)
- View node execution duration, token breakdown, and live JSON output payloads with a one-click copy button.

---

### 2.6 Pipeline Management & Deployment

- **Auto Layout**: Click the **Sparkles** icon in the toolbar or options menu to automatically align all nodes in a sequential DAG layout.
- **Export JSON**: Click the **Share** menu &rarr; **Export JSON** to download the complete pipeline configuration (`agent_workflow_pipeline.json`).
- **Reset Canvas**: Restore default nodes and connections at any time.
- **Deploy Pipeline**: Click **Deploy Pipeline** in the top navbar to open the release dialog, review the target runtime endpoint (`us-east.prod.nextwebapp.ai`), and lock version tags (`v1.4-release`).

---

## 3. Component Architecture & File Locations

| File | Purpose |
|------|---------|
| [`app/[locale]/(app)/workflows/page.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/app/[locale]/(app)/workflows/page.tsx) | Main page coordinating canvas state, simulation, top navbar integration, and deployment modal. |
| [`components/workflow-builder/workflow-canvas.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/workflow-builder/workflow-canvas.tsx) | SVG-backed infinite canvas with panning, zooming, bezier connectors, and floating toolbars. |
| [`components/workflow-builder/workflow-node.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/workflow-builder/workflow-node.tsx) | Interactive node card with ports, category badges, telemetry indicators, and drag handlers. |
| [`components/workflow-builder/node-palette.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/workflow-builder/node-palette.tsx) | Collapsible node catalog with search and template insertion. |
| [`components/workflow-builder/node-inspector.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/workflow-builder/node-inspector.tsx) | Collapsible configuration drawer with tabs for settings, parameters, and telemetry. |
| [`components/workflow-builder/minimap.tsx`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/workflow-builder/minimap.tsx) | Real-time viewport minimap preview. |
| [`components/workflow-builder/workflow-types.ts`](file:///Users/aa/git/github_exxaio/your-next-webapp/components/workflow-builder/workflow-types.ts) | TypeScript interfaces for nodes, edges, telemetry, and categories. |
| [`messages/en/Workflows.json`](file:///Users/aa/git/github_exxaio/your-next-webapp/messages/en/Workflows.json) | English localization strings. |
| [`messages/zh-CN/Workflows.json`](file:///Users/aa/git/github_exxaio/your-next-webapp/messages/zh-CN/Workflows.json) | Simplified Chinese localization strings. |

---

## 4. Design System Compliance

- **Semantic Color Tokens**: All components utilize CSS variable tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-accent`, `bg-surface`, `bg-background`).
- **Dark Mode Support**: Seamless adaptation across light and dark themes using semantic surface and border tokens.
- **Viewport Lock**: Preserves strict zero-scroll containment on desktop and tablet environments without creating window-level scrollbars.
