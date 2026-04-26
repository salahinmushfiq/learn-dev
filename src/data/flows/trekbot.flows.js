// src/data/flows/trekbot.flows.js

/**
 * TREKBOT AI SYSTEM (ENGINE SAFE v2)
 * ----------------------------------
 * This file contains TWO SEPARATE FLOWS under the same project:
 *
 * 1. RAG PIPELINE FLOW
 *    - Retrieval Augmented Generation system
 *    - intent → routing → retrieval → prompt → LLM
 *
 * 2. AGENTIC PIPELINE FLOW
 *    - Tool-using AI agent system
 *    - decision → tool routing → parallel execution → aggregation → reasoning
 * 
 * 3. TREKBOT UNIFIED AI SYSTEM (FINAL CLEAN ARCHITECTURE)
 *    - RAG Pipeline (knowledge grounding)
      - Agentic Tool Layer (actions + APIs)
      - Decision Orchestration (route logic)
      - Memory Persistence
 * This is what modern AI systems actually look like
 * (LangGraph / AutoGPT-style architecture simplified)
      
 * Designed for:
 * ✔ executeFlow deterministic engine
 * ✔ parallel + join synchronization safety
 * ✔ decision routing correctness
 * ✔ state isolation & trace visualization
 */

export const trekBotFlows = [

  // =====================================================
  // 🟡 FLOW 1: RAG PIPELINE (CORE KNOWLEDGE SYSTEM)
  // =====================================================
  {
    id: "tb_rag_dev",
    projectId: "trekbot",
    tabLabel: "RAG Pipeline",
    startNode: "input",

    nodes: {

      // =========================
      // 🟢 USER INPUT
      // =========================
      input: {
        id: "input",
        title: "User Input",
        meta: { service: "frontend" },

        run: (s) => ({
          ...s,
          question: s.question || "Plan a 3-day trip to Cox’s Bazar",
        }),

        next: "intent",
      },

      // =========================
      // 🧠 INTENT DETECTION
      // =========================
      intent: {
        id: "intent",
        title: "Intent Detection",
        meta: { service: "ai" },

        run: (s) => ({
          ...s,
          intent: s.intent || "itinerary",
        }),

        next: "route",
      },

      // =========================
      // 🔀 RAG ROUTER (DECISION)
      // =========================
      route: {
        id: "route",
        title: "RAG Router",
        type: "decision",
        meta: { service: "orchestrator" },

        run: (s) => ({
          ...s,
          useRag: ["itinerary", "hotel", "pricing"].includes(s.intent),
        }),

        next: {
          success: "preferences",
          fail: "direct_prompt",
        },
      },

      // =========================
      // ❤️ USER PREFERENCES
      // =========================
      preferences: {
        id: "preferences",
        title: "Preference Extraction",
        meta: { service: "ai" },

        run: (s) => ({
          ...s,
          preferences: {
            interests: ["beach", "relaxation"],
            duration: "3 days",
          },
        }),

        next: "retrieval",
      },

      // =========================
      // ⚡ PARALLEL RETRIEVAL
      // =========================
      retrieval: {
        id: "retrieval",
        title: "Multi-Source Retrieval",
        type: "parallel",
        meta: { service: "orchestrator" },
        next: ["vector_search", "kb_search"],
      },

      // -------- VECTOR DB --------
      vector_search: {
        id: "vector_search",
        title: "Vector Search",
        meta: { service: "vector-db" },

        run: (s) => ({
          ...s,
          vectorDocs: [
            "Cox’s Bazar 3-day itinerary guide",
            "Top beaches: Laboni, Inani, Himchari",
          ],
        }),

        next: "context_join",
      },

      // -------- KNOWLEDGE BASE --------
      kb_search: {
        id: "kb_search",
        title: "Knowledge Base",
        meta: { service: "kb" },

        run: (s) => ({
          ...s,
          kbDocs: [
            "Best season: November–February",
            "Avoid monsoon season due to heavy rain",
          ],
        }),

        next: "context_join",
      },

      // =========================
      // 🔗 CONTEXT JOIN (SAFE MERGE)
      // =========================
      context_join: {
        id: "context_join",
        title: "Context Aggregation",
        type: "join",
        waitFor: ["vector_search", "kb_search"],
        meta: { service: "orchestrator" },

        run: (s) => {
          const vector = s.vector_search?.vectorDocs || [];
          const kb = s.kb_search?.kbDocs || [];

          return {
            ...s,
            context: [...vector, ...kb],
          };
        },

        next: "prompt",
      },

      // =========================
      // 🧩 PROMPT ENGINEERING
      // =========================
      prompt: {
        id: "prompt",
        title: "Prompt Builder",
        meta: { service: "ai" },

        run: (s) => ({
          ...s,
          prompt: `
Intent: ${s.intent}
Preferences: ${JSON.stringify(s.preferences || {})}
Context:
${(s.context || []).join("\n")}

User Query:
${s.question}
          `.trim(),
        }),

        next: "llm",
      },

      // =========================
      // 🤖 LLM GENERATION
      // =========================
      llm: {
        id: "llm",
        title: "LLM Response",
        meta: { service: "llm" },

        run: (s) => ({
          ...s,
          answer: "Generated personalized 3-day Cox’s Bazar itinerary...",
        }),

        next: "memory",
      },

      // =========================
      // 🚫 DIRECT RESPONSE MODE
      // =========================
      direct_prompt: {
        id: "direct_prompt",
        title: "Direct LLM Mode",
        meta: { service: "llm" },

        run: (s) => ({
          ...s,
          answer: "Direct response without retrieval pipeline",
        }),

        next: "memory",
      },

      // =========================
      // 💾 MEMORY STORE
      // =========================
      memory: {
        id: "memory",
        title: "Memory Store",
        meta: { service: "memory" },

        run: (s) => ({
          ...s,
          stored: true,
        }),

        next: null,
      },
    },
  },

  // =====================================================
  // 🟠 FLOW 2: AGENTIC AI SYSTEM (TOOL-USING AGENT)
  // =====================================================
  {
    id: "tb_agent_dev",
    projectId: "trekbot",
    tabLabel: "Agentic Pipeline",
    startNode: "intent_gate",

    nodes: {

      // =========================
      // 🧠 INTENT GATE
      // =========================
      intent_gate: {
        id: "intent_gate",
        title: "Intent Gate",
        type: "decision",
        meta: { service: "orchestrator" },

        run: (s) => ({
          ...s,
          isItinerary: s.intent === "itinerary",
        }),

        next: {
          success: "tool_router",
          fail: "memory",
        },
      },

      // =========================
      // 🧭 TOOL DECISION ENGINE
      // =========================
      tool_router: {
        id: "tool_router",
        title: "Tool Router",
        type: "decision",
        meta: { service: "agent" },

        run: (s) => ({
          ...s,
          needsTools: true,
        }),

        next: {
          success: "tool_executor",
          fail: "final_reasoning",
        },
      },

      // =========================
      // ⚡ PARALLEL TOOL EXECUTION
      // =========================
      tool_executor: {
        id: "tool_executor",
        title: "Tool Execution Layer",
        type: "parallel",
        meta: { service: "agent" },
        next: ["weather_tool", "booking_tool", "pricing_tool"],
      },

      // -------- WEATHER TOOL --------
      weather_tool: {
        id: "weather_tool",
        title: "Weather Tool",
        meta: { service: "api" },

        run: (s) => ({
          ...s,
          weather: "Sunny 28°C",
        }),

        next: "tool_join",
      },

      // -------- BOOKING TOOL --------
      booking_tool: {
        id: "booking_tool",
        title: "Booking Tool",
        meta: { service: "api" },

        run: (s) => ({
          ...s,
          bookingStatus: "available",
        }),

        next: "tool_join",
      },

      // -------- PRICING TOOL --------
      pricing_tool: {
        id: "pricing_tool",
        title: "Pricing Tool",
        meta: { service: "api" },

        run: (s) => ({
          ...s,
          price: 4500,
        }),

        next: "tool_join",
      },

      // =========================
      // 🔗 TOOL JOIN (SAFE MERGE)
      // =========================
      tool_join: {
        id: "tool_join",
        title: "Tool Aggregation",
        type: "join",
        waitFor: ["weather_tool", "booking_tool", "pricing_tool"],
        meta: { service: "agent" },

        run: (s) => ({
          ...s,
          toolResults: {
            weather: s.weather,
            booking: s.bookingStatus,
            price: s.price,
          },
        }),

        next: "final_reasoning",
      },

      // =========================
      // 🧠 FINAL AGENT REASONING
      // =========================
      final_reasoning: {
        id: "final_reasoning",
        title: "Agent Reasoning Layer",
        meta: { service: "agent" },

        run: (s) => ({
          ...s,
          final_answer: `Optimized trip plan → Weather: ${s.toolResults?.weather}, Price: ${s.toolResults?.price}`,
        }),

        next: "memory",
      },

      // =========================
      // 💾 MEMORY STORE
      // =========================
      memory: {
        id: "memory",
        title: "Memory Store",
        meta: { service: "memory" },

        run: (s) => ({
          ...s,
          stored: true,
        }),

        next: null,
      },
    },
  },
  // =====================================================
  // 🟠 FLOW 3: AGENTIC AI SYSTEM (Production)
  // =====================================================
   {
    id: "tb_runtime",
    projectId: "trekbot",
    tabLabel: "Unified AI System",
    startNode: "input",

    nodes: {

      // =====================================================
      // 🟢 1. USER INPUT
      // =====================================================
      input: {
        id: "input",
        title: "User Query Input",
        meta: { service: "frontend" },

        run: (s) => ({
          ...s,
          question: s.question || "Plan a 3-day trip to Cox’s Bazar",
          userId: "U1001",
        }),

        next: "intent",
      },

      // =====================================================
      // 🧠 2. INTENT CLASSIFICATION
      // =====================================================
      intent: {
        id: "intent",
        title: "Intent Detection",
        meta: { service: "ai" },

        run: (s) => ({
          ...s,
          intent: s.intent || "itinerary",
        }),

        next: "router",
      },

      // =====================================================
      // 🔀 3. GLOBAL ROUTER (RAG vs DIRECT vs AGENT)
      // =====================================================
      router: {
        id: "router",
        title: "System Router",
        type: "decision",
        meta: { service: "orchestrator" },

        run: (s) => {
          const isRagIntent = ["itinerary", "hotel", "pricing"].includes(s.intent);
          const needsTools = s.intent === "booking_support";

          return {
            ...s,
            route: isRagIntent ? "rag" : needsTools ? "agent" : "direct",
          };
        },

        next: {
          success: "preferences",
          fail: "direct_response",
        },
      },

      // =====================================================
      // ❤️ 4. USER PREFERENCES (RAG START)
      // =====================================================
      preferences: {
        id: "preferences",
        title: "Preference Extraction",
        meta: { service: "ai" },

        run: (s) => ({
          ...s,
          preferences: {
            interest: ["beach"],
            duration: "3 days",
          },
        }),

        next: "retrieval",
      },

      // =====================================================
      // ⚡ 5. PARALLEL RETRIEVAL
      // =====================================================
      retrieval: {
        id: "retrieval",
        title: "Multi-Source Retrieval",
        type: "parallel",
        meta: { service: "orchestrator" },

        next: ["vector_search", "kb_search"],
      },

      vector_search: {
        id: "vector_search",
        title: "Vector DB Search",
        meta: { service: "vector-db" },

        run: (s) => ({
          ...s,
          vectorDocs: [
            "3-day Cox’s Bazar itinerary",
            "Best beaches: Laboni, Inani",
          ],
        }),

        next: "context_join",
      },

      kb_search: {
        id: "kb_search",
        title: "Knowledge Base",
        meta: { service: "kb" },

        run: (s) => ({
          ...s,
          kbDocs: [
            "Best season: Nov–Feb",
            "Avoid monsoon season",
          ],
        }),

        next: "context_join",
      },

      // =====================================================
      // 🔗 6. CONTEXT MERGE
      // =====================================================
      context_join: {
        id: "context_join",
        title: "Context Aggregation",
        type: "join",
        waitFor: ["vector_search", "kb_search"],
        meta: { service: "orchestrator" },

        run: (s) => ({
          ...s,
          context: [
            ...(s.vector_search?.vectorDocs || []),
            ...(s.kb_search?.kbDocs || []),
          ],
        }),

        next: "prompt",
      },

      // =====================================================
      // 🧩 7. PROMPT ENGINEERING
      // =====================================================
      prompt: {
        id: "prompt",
        title: "Prompt Builder",
        meta: { service: "ai" },

        run: (s) => ({
          ...s,
          prompt: `
Intent: ${s.intent}
Preferences: ${JSON.stringify(s.preferences)}
Context:
${(s.context || []).join("\n")}

User: ${s.question}
          `.trim(),
        }),

        next: "llm",
      },

      // =====================================================
      // 🤖 8. LLM GENERATION
      // =====================================================
      llm: {
        id: "llm",
        title: "LLM Response",
        meta: { service: "llm" },

        run: (s) => ({
          ...s,
          answer: "3-day Cox’s Bazar itinerary generated using RAG context.",
          needsTools: true, // 👈 triggers agentic escalation
        }),

        next: "agent_router",
      },

      // =====================================================
      // 🧠 9. AGENT ROUTER (POST-LLM DECISION)
      // =====================================================
      agent_router: {
        id: "agent_router",
        title: "Agent Decision Layer",
        type: "decision",
        meta: { service: "agent" },

        run: (s) => ({
          ...s,
          useTools: s.needsTools === true,
        }),

        next: {
          success: "tool_executor",
          fail: "memory",
        },
      },

      // =====================================================
      // 🛠 10. TOOL EXECUTION (PARALLEL ACTIONS)
      // =====================================================
      tool_executor: {
        id: "tool_executor",
        title: "Tool Execution Layer",
        type: "parallel",
        meta: { service: "agent" },

        next: ["weather_tool", "booking_tool", "pricing_tool"],
      },

      weather_tool: {
        id: "weather_tool",
        title: "Weather API",
        meta: { service: "api" },

        run: (s) => ({
          ...s,
          weather: "Sunny 28°C",
        }),

        next: "tool_join",
      },

      booking_tool: {
        id: "booking_tool",
        title: "Booking API",
        meta: { service: "api" },

        run: (s) => ({
          ...s,
          bookingStatus: "available",
        }),

        next: "tool_join",
      },

      pricing_tool: {
        id: "pricing_tool",
        title: "Pricing API",
        meta: { service: "api" },

        run: (s) => ({
          ...s,
          price: 4800,
        }),

        next: "tool_join",
      },

      // =====================================================
      // 🔗 11. TOOL AGGREGATION
      // =====================================================
      tool_join: {
        id: "tool_join",
        title: "Tool Aggregation",
        type: "join",
        waitFor: ["weather_tool", "booking_tool", "pricing_tool"],
        meta: { service: "agent" },

        run: (s) => ({
          ...s,
          toolResults: {
            weather: s.weather,
            booking: s.bookingStatus,
            price: s.price,
          },
        }),

        next: "final_reasoning",
      },

      // =====================================================
      // 🧠 12. FINAL REASONING LAYER
      // =====================================================
      final_reasoning: {
        id: "final_reasoning",
        title: "Final Agent Reasoning",
        meta: { service: "agent" },

        run: (s) => ({
          ...s,
          final_answer: `
${s.answer}

Enhanced with tools:
Weather: ${s.toolResults?.weather}
Price: ${s.toolResults?.price}
Booking: ${s.toolResults?.booking}
          `.trim(),
        }),

        next: "memory",
      },

      // =====================================================
      // 💾 13. MEMORY
      // =====================================================
      memory: {
        id: "memory",
        title: "Memory Store",
        meta: { service: "memory" },

        run: (s) => ({
          ...s,
          stored: true,
        }),

        next: null,
      },

      // =====================================================
      // 🟡 DIRECT RESPONSE (FALLBACK)
      // =====================================================
      direct_response: {
        id: "direct_response",
        title: "Direct LLM Response",
        meta: { service: "llm" },

        run: (s) => ({
          ...s,
          answer: "Direct response without RAG or tools.",
        }),

        next: "memory",
      },
    },
  }
];