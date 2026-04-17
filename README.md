# ⚙️ Flow Execution Engine (Explainable Workflow System)

A deterministic, visual workflow execution engine with real-time state tracing, branching logic, parallel execution, and explainable runtime inspection.

This project simulates a **workflow orchestration system** similar in concept to tools like Temporal, AWS Step Functions, and Airflow — but with a focus on **visual explainability and debugging clarity**.

---

## 🚀 Key Features

### 🧠 Deterministic Execution Engine
- Predictable execution order based on flow graph structure
- Supports linear, branching, and parallel workflows
- Cycle detection and runtime safety guards
- Controlled async execution model

---

### 🔀 Advanced Flow Types

#### ✔ Linear Flow
Sequential node execution with state propagation

#### 🔀 Decision Nodes
Conditional branching:
- `success` path
- `fail` path

#### ⚡ Parallel Execution
True fork-based execution model:
- Multiple branches execute independently
- Supports controlled synchronization via join nodes

#### 🔗 Join Nodes
- Waits for multiple upstream branches
- Merges state before continuing execution

---

### 🧬 Explainability Layer (Core Feature)
Every execution step is fully traceable:

- Input state vs Output state
- State diff visualization
- Decision reasoning logs
- Execution duration per node
- Branch path tracking

---

### 📊 Execution Inspector UI
Interactive debugging panel:
- Click any node to inspect execution
- View full input/output state
- Highlight state changes
- Understand decision outcomes
- Debug parallel execution flow

---

### ⏱ Execution Timeline
- Step-by-step history tracking
- Playback-ready execution log
- Step navigation support
- Active node highlighting

---

### 🧱 Graph Visualization Engine
- Recursive graph rendering
- Shared node reuse handling
- Parallel fork visualization
- Decision split visualization
- Cycle-safe rendering

---

## 🏗 Architecture Overview


Flow Definition
↓
buildExecutionGraph()
↓
Execution Engine (executeFlow)
↓
History + State Tracking
↓
FlowGraph Renderer
↓
Explainability Layer (Inspector UI)


---

## ⚙️ Core Modules

### 1. Execution Engine
`src/core/engine/executeFlow.js`

Responsible for:
- Running workflow graph
- Managing async execution
- Handling parallel + decision logic
- Join synchronization
- Runtime safety (depth + visit guards)

---

### 2. Flow Builder
`src/utils/buildExecutionGraph.js`

- Converts raw flow definition into executable graph
- Handles recursion, caching, and cycle detection
- Builds structured node relationships

---

### 3. Edge Builder
`src/utils/buildEdges.js`

- Extracts graph edges for visualization
- Supports:
  - linear
  - decision
  - parallel

---

### 4. State Tracker
`src/utils/getActiveSet.js`

- Builds active execution set from history
- Enables real-time node highlighting

---

### 5. React Flow Renderer
`src/components/FlowGraph.jsx`

- Recursive graph rendering
- Visualizes execution path
- Handles:
  - parallel forks
  - decision branches
  - node reuse
- Integrates active execution state

---

### 6. Execution Hook
`src/core/state/useFlowRunner.js`

- Executes flow on load
- Maintains execution history
- Controls step navigation
- Exposes runtime controls (next/prev/goTo)

---

### 7. Explainability Inspector
`src/components/ExecutionInspector.jsx`

- Shows execution details per node:
  - Input state
  - Output state
  - State diff
  - Decision reasoning
- Fully interactive debugging panel

---

## 🧪 Execution Model

Each node produces:

```js
{
  stepId: "node_1",
  event: "Payment Processing",
  state: { ... },
  meta: {
    service: "payment-service",
    duration: "32ms",
    type: "task"
  }
}
🔄 Parallel Execution Model
Parallel nodes spawn multiple execution branches
Execution tracked via activeTasks
Optional deterministic mode using Promise.all
🔗 Join Logic

Join nodes:

Wait for multiple branch completions
Track incoming states
Merge state before continuing execution
🧠 Explainability Design Philosophy

This system is designed around one principle:

“Every execution must be explainable in human terms.”

That means:

No hidden transitions
No black-box state changes
Every decision is traceable
Every state mutation is visible
🖥 UI Structure
FlowViewer
 ├── DashboardLayout
 ├── FlowRunnerView
 │    ├── FlowGraph (visual engine)
 │    └── ExecutionInspector (debug panel)
📦 Tech Stack
React (Vite)
TailwindCSS
React Router
Custom Execution Engine (no external DAG lib)
Pure JS graph traversal logic
📌 Current Capabilities

✔ Workflow execution engine
✔ Parallel + decision branching
✔ Join synchronization
✔ Cycle-safe graph building
✔ Execution history tracking
✔ Step-by-step replay
✔ Explainable state transitions
✔ Interactive debugging UI

🚧 Future Improvements
Timeline scrubber (DevTools-style replay)
Persistent execution storage
Node retry / timeout policies
Visual edge animation (live execution flow)
Plugin-based node system (API / Transform / AI nodes)
Multi-flow orchestration
🧠 Why This Project Matters

This is not just a flow visualizer.

It demonstrates:

Distributed systems thinking
Execution modeling
State synchronization logic
Debuggable architecture design
Frontend + engine co-design
📸 Conceptual Inspiration
AWS Step Functions
Temporal.io
Apache Airflow
Redux DevTools (for explainability layer)
Node-based workflow engines
