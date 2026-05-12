// // src/data/flows/trekbot.flows.js

// /**
//  * TREKBOT AI SYSTEM (ENGINE SAFE v2)
//  * ----------------------------------
//  * This file contains TWO SEPARATE FLOWS under the same project:
//  *
//  * 1. RAG PIPELINE FLOW
//  *    - Retrieval Augmented Generation system
//  *    - intent → routing → retrieval → prompt → LLM
//  *
//  * 2. AGENTIC PIPELINE FLOW
//  *    - Tool-using AI agent system
//  *    - decision → tool routing → parallel execution → aggregation → reasoning
//  * 
//  * 3. TREKBOT UNIFIED AI SYSTEM (FINAL CLEAN ARCHITECTURE)
//  *    - RAG Pipeline (knowledge grounding)
//       - Agentic Tool Layer (actions + APIs)
//       - Decision Orchestration (route logic)
//       - Memory Persistence
//  * This is what modern AI systems actually look like
//  * (LangGraph / AutoGPT-style architecture simplified)
      
//  * Designed for:
//  * ✔ executeFlow deterministic engine
//  * ✔ parallel + join synchronization safety
//  * ✔ decision routing correctness
//  * ✔ state isolation & trace visualization
//  */

// export const trekBotFlows = [

//   // =====================================================
//   // 🟡 FLOW 1: RAG PIPELINE (CORE KNOWLEDGE SYSTEM)
//   // =====================================================
//   {
//     id: "tb_rag_dev",
//     projectId: "trekbot",
//     tabLabel: "RAG Pipeline",
//     startNode: "input",

//     nodes: {

//       // =========================
//       // 🟢 USER INPUT
//       // =========================
//       input: {
//         id: "input",
//         title: "User Input",
//         meta: { service: "frontend" },

//         run: (s) => ({
//           ...s,
//           question: s.question || "Plan a 3-day trip to Cox’s Bazar",
//         }),

//         next: "intent",
//       },

//       // =========================
//       // 🧠 INTENT DETECTION
//       // =========================
//       intent: {
//         id: "intent",
//         title: "Intent Detection",
//         meta: { service: "ai" },

//         run: (s) => ({
//           ...s,
//           intent: s.intent || "itinerary",
//         }),

//         next: "route",
//       },

//       // =========================
//       // 🔀 RAG ROUTER (DECISION)
//       // =========================
//       route: {
//         id: "route",
//         title: "RAG Router",
//         type: "decision",
//         meta: { service: "orchestrator" },

//         run: (s) => ({
//           ...s,
//           useRag: ["itinerary", "hotel", "pricing"].includes(s.intent),
//         }),

//         next: {
//           success: "preferences",
//           fail: "direct_prompt",
//         },
//       },

//       // =========================
//       // ❤️ USER PREFERENCES
//       // =========================
//       preferences: {
//         id: "preferences",
//         title: "Preference Extraction",
//         meta: { service: "ai" },

//         run: (s) => ({
//           ...s,
//           preferences: {
//             interests: ["beach", "relaxation"],
//             duration: "3 days",
//           },
//         }),

//         next: "retrieval",
//       },

//       // =========================
//       // ⚡ PARALLEL RETRIEVAL
//       // =========================
//       retrieval: {
//         id: "retrieval",
//         title: "Multi-Source Retrieval",
//         type: "parallel",
//         meta: { service: "orchestrator" },
//         next: ["vector_search", "kb_search"],
//       },

//       // -------- VECTOR DB --------
//       vector_search: {
//         id: "vector_search",
//         title: "Vector Search",
//         meta: { service: "vector-db" },

//         run: (s) => ({
//           ...s,
//           vectorDocs: [
//             "Cox’s Bazar 3-day itinerary guide",
//             "Top beaches: Laboni, Inani, Himchari",
//           ],
//         }),

//         next: "context_join",
//       },

//       // -------- KNOWLEDGE BASE --------
//       kb_search: {
//         id: "kb_search",
//         title: "Knowledge Base",
//         meta: { service: "kb" },

//         run: (s) => ({
//           ...s,
//           kbDocs: [
//             "Best season: November–February",
//             "Avoid monsoon season due to heavy rain",
//           ],
//         }),

//         next: "context_join",
//       },

//       // =========================
//       // 🔗 CONTEXT JOIN (SAFE MERGE)
//       // =========================
//       context_join: {
//         id: "context_join",
//         title: "Context Aggregation",
//         type: "join",
//         waitFor: ["vector_search", "kb_search"],
//         meta: { service: "orchestrator" },

//         run: (s) => {
//           const vector = s.vector_search?.vectorDocs || [];
//           const kb = s.kb_search?.kbDocs || [];

//           return {
//             ...s,
//             context: [...vector, ...kb],
//           };
//         },

//         next: "prompt",
//       },

//       // =========================
//       // 🧩 PROMPT ENGINEERING
//       // =========================
//       prompt: {
//         id: "prompt",
//         title: "Prompt Builder",
//         meta: { service: "ai" },

//         run: (s) => ({
//           ...s,
//           prompt: `
// Intent: ${s.intent}
// Preferences: ${JSON.stringify(s.preferences || {})}
// Context:
// ${(s.context || []).join("\n")}

// User Query:
// ${s.question}
//           `.trim(),
//         }),

//         next: "llm",
//       },

//       // =========================
//       // 🤖 LLM GENERATION
//       // =========================
//       llm: {
//         id: "llm",
//         title: "LLM Response",
//         meta: { service: "llm" },

//         run: (s) => ({
//           ...s,
//           answer: "Generated personalized 3-day Cox’s Bazar itinerary...",
//         }),

//         next: "memory",
//       },

//       // =========================
//       // 🚫 DIRECT RESPONSE MODE
//       // =========================
//       direct_prompt: {
//         id: "direct_prompt",
//         title: "Direct LLM Mode",
//         meta: { service: "llm" },

//         run: (s) => ({
//           ...s,
//           answer: "Direct response without retrieval pipeline",
//         }),

//         next: "memory",
//       },

//       // =========================
//       // 💾 MEMORY STORE
//       // =========================
//       memory: {
//         id: "memory",
//         title: "Memory Store",
//         meta: { service: "memory" },

//         run: (s) => ({
//           ...s,
//           stored: true,
//         }),

//         next: null,
//       },
//     },
//   },

//   // =====================================================
//   // 🟠 FLOW 2: AGENTIC AI SYSTEM (TOOL-USING AGENT)
//   // =====================================================
//   {
//     id: "tb_agent_dev",
//     projectId: "trekbot",
//     tabLabel: "Agentic Pipeline",
//     startNode: "intent_gate",

//     nodes: {

//       // =========================
//       // 🧠 INTENT GATE
//       // =========================
//       intent_gate: {
//         id: "intent_gate",
//         title: "Intent Gate",
//         type: "decision",
//         meta: { service: "orchestrator" },

//         run: (s) => ({
//           ...s,
//           isItinerary: s.intent === "itinerary",
//         }),

//         next: {
//           success: "tool_router",
//           fail: "memory",
//         },
//       },

//       // =========================
//       // 🧭 TOOL DECISION ENGINE
//       // =========================
//       tool_router: {
//         id: "tool_router",
//         title: "Tool Router",
//         type: "decision",
//         meta: { service: "agent" },

//         run: (s) => ({
//           ...s,
//           needsTools: true,
//         }),

//         next: {
//           success: "tool_executor",
//           fail: "final_reasoning",
//         },
//       },

//       // =========================
//       // ⚡ PARALLEL TOOL EXECUTION
//       // =========================
//       tool_executor: {
//         id: "tool_executor",
//         title: "Tool Execution Layer",
//         type: "parallel",
//         meta: { service: "agent" },
//         next: ["weather_tool", "booking_tool", "pricing_tool"],
//       },

//       // -------- WEATHER TOOL --------
//       weather_tool: {
//         id: "weather_tool",
//         title: "Weather Tool",
//         meta: { service: "api" },

//         run: (s) => ({
//           ...s,
//           weather: "Sunny 28°C",
//         }),

//         next: "tool_join",
//       },

//       // -------- BOOKING TOOL --------
//       booking_tool: {
//         id: "booking_tool",
//         title: "Booking Tool",
//         meta: { service: "api" },

//         run: (s) => ({
//           ...s,
//           bookingStatus: "available",
//         }),

//         next: "tool_join",
//       },

//       // -------- PRICING TOOL --------
//       pricing_tool: {
//         id: "pricing_tool",
//         title: "Pricing Tool",
//         meta: { service: "api" },

//         run: (s) => ({
//           ...s,
//           price: 4500,
//         }),

//         next: "tool_join",
//       },

//       // =========================
//       // 🔗 TOOL JOIN (SAFE MERGE)
//       // =========================
//       tool_join: {
//         id: "tool_join",
//         title: "Tool Aggregation",
//         type: "join",
//         waitFor: ["weather_tool", "booking_tool", "pricing_tool"],
//         meta: { service: "agent" },

//         run: (s) => ({
//           ...s,
//           toolResults: {
//             weather: s.weather,
//             booking: s.bookingStatus,
//             price: s.price,
//           },
//         }),

//         next: "final_reasoning",
//       },

//       // =========================
//       // 🧠 FINAL AGENT REASONING
//       // =========================
//       final_reasoning: {
//         id: "final_reasoning",
//         title: "Agent Reasoning Layer",
//         meta: { service: "agent" },

//         run: (s) => ({
//           ...s,
//           final_answer: `Optimized trip plan → Weather: ${s.toolResults?.weather}, Price: ${s.toolResults?.price}`,
//         }),

//         next: "memory",
//       },

//       // =========================
//       // 💾 MEMORY STORE
//       // =========================
//       memory: {
//         id: "memory",
//         title: "Memory Store",
//         meta: { service: "memory" },

//         run: (s) => ({
//           ...s,
//           stored: true,
//         }),

//         next: null,
//       },
//     },
//   },
//   // =====================================================
//   // 🟠 FLOW 3: AGENTIC AI SYSTEM (Production)
//   // =====================================================
//    {
//     id: "tb_runtime",
//     projectId: "trekbot",
//     tabLabel: "Unified AI System",
//     startNode: "input",

//     nodes: {

//       // =====================================================
//       // 🟢 1. USER INPUT
//       // =====================================================
//       input: {
//         id: "input",
//         title: "User Query Input",
//         meta: { service: "frontend" },

//         run: (s) => ({
//           ...s,
//           question: s.question || "Plan a 3-day trip to Cox’s Bazar",
//           userId: "U1001",
//         }),

//         next: "intent",
//       },

//       // =====================================================
//       // 🧠 2. INTENT CLASSIFICATION
//       // =====================================================
//       intent: {
//         id: "intent",
//         title: "Intent Detection",
//         meta: { service: "ai" },

//         run: (s) => ({
//           ...s,
//           intent: s.intent || "itinerary",
//         }),

//         next: "router",
//       },

//       // =====================================================
//       // 🔀 3. GLOBAL ROUTER (RAG vs DIRECT vs AGENT)
//       // =====================================================
//       router: {
//         id: "router",
//         title: "System Router",
//         type: "decision",
//         meta: { service: "orchestrator" },

//         run: (s) => {
//           const isRagIntent = ["itinerary", "hotel", "pricing"].includes(s.intent);
//           const needsTools = s.intent === "booking_support";

//           return {
//             ...s,
//             route: isRagIntent ? "rag" : needsTools ? "agent" : "direct",
//           };
//         },

//         next: {
//           success: "preferences",
//           fail: "direct_response",
//         },
//       },

//       // =====================================================
//       // ❤️ 4. USER PREFERENCES (RAG START)
//       // =====================================================
//       preferences: {
//         id: "preferences",
//         title: "Preference Extraction",
//         meta: { service: "ai" },

//         run: (s) => ({
//           ...s,
//           preferences: {
//             interest: ["beach"],
//             duration: "3 days",
//           },
//         }),

//         next: "retrieval",
//       },

//       // =====================================================
//       // ⚡ 5. PARALLEL RETRIEVAL
//       // =====================================================
//       retrieval: {
//         id: "retrieval",
//         title: "Multi-Source Retrieval",
//         type: "parallel",
//         meta: { service: "orchestrator" },

//         next: ["vector_search", "kb_search"],
//       },

//       vector_search: {
//         id: "vector_search",
//         title: "Vector DB Search",
//         meta: { service: "vector-db" },

//         run: (s) => ({
//           ...s,
//           vectorDocs: [
//             "3-day Cox’s Bazar itinerary",
//             "Best beaches: Laboni, Inani",
//           ],
//         }),

//         next: "context_join",
//       },

//       kb_search: {
//         id: "kb_search",
//         title: "Knowledge Base",
//         meta: { service: "kb" },

//         run: (s) => ({
//           ...s,
//           kbDocs: [
//             "Best season: Nov–Feb",
//             "Avoid monsoon season",
//           ],
//         }),

//         next: "context_join",
//       },

//       // =====================================================
//       // 🔗 6. CONTEXT MERGE
//       // =====================================================
//       context_join: {
//         id: "context_join",
//         title: "Context Aggregation",
//         type: "join",
//         waitFor: ["vector_search", "kb_search"],
//         meta: { service: "orchestrator" },

//         run: (s) => ({
//           ...s,
//           context: [
//             ...(s.vector_search?.vectorDocs || []),
//             ...(s.kb_search?.kbDocs || []),
//           ],
//         }),

//         next: "prompt",
//       },

//       // =====================================================
//       // 🧩 7. PROMPT ENGINEERING
//       // =====================================================
//       prompt: {
//         id: "prompt",
//         title: "Prompt Builder",
//         meta: { service: "ai" },

//         run: (s) => ({
//           ...s,
//           prompt: `
// Intent: ${s.intent}
// Preferences: ${JSON.stringify(s.preferences)}
// Context:
// ${(s.context || []).join("\n")}

// User: ${s.question}
//           `.trim(),
//         }),

//         next: "llm",
//       },

//       // =====================================================
//       // 🤖 8. LLM GENERATION
//       // =====================================================
//       llm: {
//         id: "llm",
//         title: "LLM Response",
//         meta: { service: "llm" },

//         run: (s) => ({
//           ...s,
//           answer: "3-day Cox’s Bazar itinerary generated using RAG context.",
//           needsTools: true, // 👈 triggers agentic escalation
//         }),

//         next: "agent_router",
//       },

//       // =====================================================
//       // 🧠 9. AGENT ROUTER (POST-LLM DECISION)
//       // =====================================================
//       agent_router: {
//         id: "agent_router",
//         title: "Agent Decision Layer",
//         type: "decision",
//         meta: { service: "agent" },

//         run: (s) => ({
//           ...s,
//           useTools: s.needsTools === true,
//         }),

//         next: {
//           success: "tool_executor",
//           fail: "memory",
//         },
//       },

//       // =====================================================
//       // 🛠 10. TOOL EXECUTION (PARALLEL ACTIONS)
//       // =====================================================
//       tool_executor: {
//         id: "tool_executor",
//         title: "Tool Execution Layer",
//         type: "parallel",
//         meta: { service: "agent" },

//         next: ["weather_tool", "booking_tool", "pricing_tool"],
//       },

//       weather_tool: {
//         id: "weather_tool",
//         title: "Weather API",
//         meta: { service: "api" },

//         run: (s) => ({
//           ...s,
//           weather: "Sunny 28°C",
//         }),

//         next: "tool_join",
//       },

//       booking_tool: {
//         id: "booking_tool",
//         title: "Booking API",
//         meta: { service: "api" },

//         run: (s) => ({
//           ...s,
//           bookingStatus: "available",
//         }),

//         next: "tool_join",
//       },

//       pricing_tool: {
//         id: "pricing_tool",
//         title: "Pricing API",
//         meta: { service: "api" },

//         run: (s) => ({
//           ...s,
//           price: 4800,
//         }),

//         next: "tool_join",
//       },

//       // =====================================================
//       // 🔗 11. TOOL AGGREGATION
//       // =====================================================
//       tool_join: {
//         id: "tool_join",
//         title: "Tool Aggregation",
//         type: "join",
//         waitFor: ["weather_tool", "booking_tool", "pricing_tool"],
//         meta: { service: "agent" },

//         run: (s) => ({
//           ...s,
//           toolResults: {
//             weather: s.weather,
//             booking: s.bookingStatus,
//             price: s.price,
//           },
//         }),

//         next: "final_reasoning",
//       },

//       // =====================================================
//       // 🧠 12. FINAL REASONING LAYER
//       // =====================================================
//       final_reasoning: {
//         id: "final_reasoning",
//         title: "Final Agent Reasoning",
//         meta: { service: "agent" },

//         run: (s) => ({
//           ...s,
//           final_answer: `
// ${s.answer}

// Enhanced with tools:
// Weather: ${s.toolResults?.weather}
// Price: ${s.toolResults?.price}
// Booking: ${s.toolResults?.booking}
//           `.trim(),
//         }),

//         next: "memory",
//       },

//       // =====================================================
//       // 💾 13. MEMORY
//       // =====================================================
//       memory: {
//         id: "memory",
//         title: "Memory Store",
//         meta: { service: "memory" },

//         run: (s) => ({
//           ...s,
//           stored: true,
//         }),

//         next: null,
//       },

//       // =====================================================
//       // 🟡 DIRECT RESPONSE (FALLBACK)
//       // =====================================================
//       direct_response: {
//         id: "direct_response",
//         title: "Direct LLM Response",
//         meta: { service: "llm" },

//         run: (s) => ({
//           ...s,
//           answer: "Direct response without RAG or tools.",
//         }),

//         next: "memory",
//       },
//     },
//   }
// ];
// src/data/flows/trekbot.flows.js

/**
 * TREKBOT AI SYSTEM (ENGINE SAFE v3)
 * ----------------------------------
 *
 * CURRENT REAL SYSTEM ARCHITECTURE
 * =================================
 *
 * This file now reflects the ACTUAL backend architecture
 * implemented inside the Smart Travel AI Assistant backend.
 *
 * SYSTEM CAPABILITIES:
 *
 * ✅ Retrieval-Augmented Generation (RAG)
 * ✅ Semantic vector retrieval
 * ✅ ChromaDB persistence
 * ✅ Redis conversational memory
 * ✅ Intent-aware prompting
 * ✅ Deterministic tool routing
 * ✅ Structured backend tool execution
 * ✅ Tool validation/execution layer
 * ✅ AI orchestration pipeline
 * ✅ Session-aware memory persistence
 * ✅ Distributed backend architecture
 *
 * -----------------------------------------------------
 * REAL BACKEND REPRESENTATION
 * -----------------------------------------------------
 *
 * FastAPI Backend
 *   ├── AI Orchestration
 *   ├── Tool Router
 *   ├── Tool Executor
 *   ├── RAG Pipeline
 *   ├── Prompt Builder
 *   ├── Redis Memory
 *   └── Groq LLM Layer
 *
 * Django Backend
 *   ├── Tours
 *   ├── Bookings
 *   └── Business Logic
 *
 * External Services
 *   ├── ChromaDB
 *   ├── Redis
 *   └── Groq API
 *
 * -----------------------------------------------------
 * ENGINE DESIGN GOALS
 * -----------------------------------------------------
 *
 * ✔ executeFlow deterministic safety
 * ✔ orchestration trace visualization
 * ✔ parallel execution safety
 * ✔ scalable node architecture
 * ✔ state isolation correctness
 * ✔ production-oriented AI systems modeling
 */

// src/data/flows/trekbot.flows.js

export const trekBotFlows = [

  // =====================================================
  // 🟡 FLOW 1 — PRODUCTION RAG PIPELINE
  // =====================================================
  {
    id: "tb_rag_runtime",
    projectId: "trekbot",
    tabLabel: "Production RAG Pipeline",
    startNode: "input",

    nodes: {

      // =====================================================
      // 🟢 USER INPUT
      // =====================================================
      input: {
        id: "input",
        title: "User Query",

        meta: {
          service: "frontend",
          layer: "ui",
        },

        run: (s) => ({
          ...s,

          question:
            s.question ||
            "Tell me about hill tours in Bangladesh",

          sessionId:
            s.sessionId || "session_001",
        }),

        next: "intent_detection",
      },

      // =====================================================
      // 🧠 INTENT DETECTION
      // =====================================================
      intent_detection: {
        id: "intent_detection",
        title: "Intent Detection",

        meta: {
          service: "ai",
          layer: "orchestration",
        },

        run: (s) => ({
          ...s,
          intent: s.intent || "explain",
        }),

        next: "tool_router",
      },

      // =====================================================
      // 🔀 TOOL ROUTER
      // =====================================================
      tool_router: {
        id: "tool_router",
        title: "Tool Router",

        type: "router",

        meta: {
          service: "agent",
          layer: "routing",
        },

        run: (s) => {

          const toolIntents = [
            "booking",
            "reservation",
            "cancel",
            "tour_list",
          ];

          return {
            ...s,

            route: toolIntents.includes(
              s.intent
            )
              ? "tools"
              : "memory",
          };
        },

        next: {
          tools: "tool_executor",
          memory: "meta_question_gate",
        },
      },

      // =====================================================
      // 🛠 TOOL EXECUTION PATH
      // =====================================================
      tool_executor: {
        id: "tool_executor",
        title: "Structured Tool Executor",

        meta: {
          service: "backend-tools",
          layer: "execution",
        },

        run: (s) => ({
          ...s,

          toolResult: {
            status: "success",

            tool: "list_tours",

            data: [
              {
                id: 1,
                title:
                  "Bandarban Adventure Tour",
                price: 4500,
              },
            ],
          },
        }),

        next: "memory_store",
      },

      // =====================================================
      // 🧠 META QUESTION DETECTION
      // =====================================================
      meta_question_gate: {
        id: "meta_question_gate",
        title: "Meta Question Detection",

        type: "router",

        meta: {
          service: "memory",
          layer: "conversation",
        },

        run: (s) => ({
          ...s,

          route:
            s.question?.includes(
              "what did i ask"
            )
              ? "memory"
              : "retrieval",
        }),

        next: {
          memory: "memory_context",
          retrieval: "retrieval",
        },
      },

      // =====================================================
      // 💾 MEMORY CONTEXT
      // =====================================================
      memory_context: {
        id: "memory_context",
        title: "Redis Conversation Memory",

        meta: {
          service: "redis",
          layer: "memory",
        },

        run: (s) => ({
          ...s,

          history: [
            "User asked about beach tours",
            "Assistant recommended Cox's Bazar",
          ],

          summary:
            "User prefers beach and relaxation trips.",
        }),

        next: "prompt_builder",
      },

      // =====================================================
      // ⚡ RETRIEVAL ORCHESTRATION
      // =====================================================
      retrieval: {
        id: "retrieval",
        title: "Semantic Retrieval",

        type: "parallel",

        meta: {
          service: "orchestrator",
          layer: "retrieval",
        },

        next: [
          "embedding_generation",
          "redis_history",
        ],
      },

      // =====================================================
      // 🧬 EMBEDDING GENERATION
      // =====================================================
      embedding_generation: {
        id: "embedding_generation",
        title:
          "SentenceTransformer Embeddings",

        meta: {
          service: "embedding-model",
          layer: "retrieval",
        },

        run: (s) => ({
          ...s,

          embeddingModel:
            "all-MiniLM-L6-v2",

          vectorQuery:
            "384-dimensional semantic embedding",
        }),

        next: "vector_search",
      },

      // =====================================================
      // 💾 REDIS HISTORY
      // =====================================================
      redis_history: {
        id: "redis_history",
        title: "Session Memory Fetch",

        meta: {
          service: "redis",
          layer: "memory",
        },

        run: (s) => ({
          ...s,

          history: [
            "Previous travel preference: hills",
          ],

          sessionMetadata: {
            interests: [
              "hill",
              "nature",
            ],
          },
        }),

        next: "retrieval_join",
      },

      // =====================================================
      // 🗂 VECTOR SEARCH
      // =====================================================
      vector_search: {
        id: "vector_search",
        title: "ChromaDB Vector Search",

        meta: {
          service: "chromadb",
          layer: "retrieval",
        },

        run: (s) => ({
          ...s,

          retrievedDocs: [
            {
              content:
                "Bandarban hill tour package with hiking.",

              score: 0.91,
            },

            {
              content:
                "Nature-focused Sajek valley experience.",

              score: 0.88,
            },
          ],
        }),

        next: "retrieval_join",
      },

      // =====================================================
      // 🔗 RETRIEVAL JOIN
      // =====================================================
      retrieval_join: {
        id: "retrieval_join",
        title: "Retrieval Aggregation",

        type: "join",

        waitFor: [
          "vector_search",
          "redis_history",
        ],

        meta: {
          service: "orchestrator",
          layer: "aggregation",
        },

        run: (s) => ({
          ...s,

          context: [
            ...(s.vector_search
              ?.retrievedDocs || []),
          ],

          memory:
            s.redis_history?.history || [],
        }),

        next: "prompt_builder",
      },

      // =====================================================
      // 🧩 PROMPT BUILDER
      // =====================================================
      prompt_builder: {
        id: "prompt_builder",
        title:
          "Intent-Aware Prompt Builder",

        meta: {
          service: "ai",
          layer: "prompting",
        },

        run: (s) => ({
          ...s,

          prompt: `
Intent: ${s.intent}

Memory:
${JSON.stringify(
  s.memory || []
)}

Context:
${JSON.stringify(
  s.context || []
)}

Question:
${s.question}

Rules:
- Use ONLY retrieved context
- Do not hallucinate
- If missing, admit uncertainty
          `.trim(),
        }),

        next: "llm_generation",
      },

      // =====================================================
      // 🤖 LLM GENERATION
      // =====================================================
      llm_generation: {
        id: "llm_generation",
        title: "Groq LLM Generation",

        meta: {
          service: "groq",
          layer: "generation",
        },

        run: (s) => ({
          ...s,

          model: "llama3-8b-8192",

          answer:
            "Bandarban and Sajek are popular hill destinations in Bangladesh.",
        }),

        next: "memory_store",
      },

      // =====================================================
      // 💾 MEMORY STORE
      // =====================================================
      memory_store: {
        id: "memory_store",
        title:
          "Redis Memory Persistence",

        meta: {
          service: "redis",
          layer: "memory",
        },

        run: (s) => ({
          ...s,
          stored: true,
        }),

        next: null,
      },
    },
  },

  // =====================================================
  // 🟠 FLOW 2 — TOOL ORCHESTRATION SYSTEM
  // =====================================================
  {
    id: "tb_tools_runtime",
    projectId: "trekbot",
    tabLabel:
      "Tool Orchestration System",

    startNode: "tool_input",

    nodes: {

      // =====================================================
      // 🟢 USER ACTION
      // =====================================================
      tool_input: {
        id: "tool_input",
        title: "User Action Request",

        meta: {
          service: "frontend",
        },

        run: (s) => ({
          ...s,

          question:
            s.question ||
            "Book tour 5 for demo_user",
        }),

        next: "tool_detection",
      },

      // =====================================================
      // 🧠 TOOL DETECTION
      // =====================================================
      tool_detection: {
        id: "tool_detection",
        title:
          "Deterministic Tool Router",

        type: "router",

        meta: {
          service: "agent",
        },

        run: (s) => ({
          ...s,

          route:
            s.question?.includes("Book")
              ? "tool"
              : "fallback",
        }),

        next: {
          tool: "parameter_extraction",
          fallback:
            "fallback_response",
        },
      },

      // =====================================================
      // 🧩 PARAM EXTRACTION
      // =====================================================
      parameter_extraction: {
        id: "parameter_extraction",
        title: "Parameter Extraction",

        meta: {
          service: "ai",
        },

        run: (s) => ({
          ...s,

          params: {
            tour_id: 5,
            user_name: "demo_user",
          },
        }),

        next: "tool_validation",
      },

      // =====================================================
      // ✅ TOOL VALIDATION
      // =====================================================
      tool_validation: {
        id: "tool_validation",
        title: "Tool Validation Layer",

        meta: {
          service: "backend",
        },

        run: (s) => ({
          ...s,
          validated: true,
        }),

        next: "tool_execution",
      },

      // =====================================================
      // ⚡ TOOL EXECUTION
      // =====================================================
      tool_execution: {
        id: "tool_execution",
        title:
          "Backend Tool Execution",

        meta: {
          service: "django-api",
        },

        run: (s) => ({
          ...s,

          toolResponse: {
            status: "success",

            message:
              "Booking created successfully.",
          },
        }),

        next:
          "tool_response_builder",
      },

      // =====================================================
      // 📦 RESPONSE BUILDER
      // =====================================================
      tool_response_builder: {
        id: "tool_response_builder",
        title:
          "Structured Tool Response",

        meta: {
          service: "backend",
        },

        run: (s) => ({
          ...s,

          response: {
            answer:
              "Your booking has been created.",

            tool_used:
              "create_booking",
          },
        }),

        next: "tool_memory",
      },

      // =====================================================
      // 💾 TOOL MEMORY
      // =====================================================
      tool_memory: {
        id: "tool_memory",
        title:
          "Conversation Persistence",

        meta: {
          service: "redis",
        },

        run: (s) => ({
          ...s,
          stored: true,
        }),

        next: null,
      },

      // =====================================================
      // 🟡 FALLBACK
      // =====================================================
      fallback_response: {
        id: "fallback_response",
        title: "Fallback Response",

        meta: {
          service: "assistant",
        },

        run: (s) => ({
          ...s,

          answer:
            "No suitable tool found. Falling back to RAG.",
        }),

        next: null,
      },
    },
  },

  // =====================================================
  // 🔵 FLOW 3 — DISTRIBUTED AI ARCHITECTURE
  // =====================================================
  {
    id: "tb_distributed_architecture",

    projectId: "trekbot",

    tabLabel:
      "Distributed Architecture",

    startNode: "frontend",

    nodes: {

      frontend: {
        id: "frontend",
        title: "React Frontend",

        meta: {
          service: "react-vite",
        },

        run: (s) => ({
          ...s,
          ui: "AI Chat Popup",
        }),

        next: "fastapi",
      },

      fastapi: {
        id: "fastapi",
        title: "FastAPI AI Engine",

        type: "parallel",

        meta: {
          service: "fastapi",
        },

        next: [
          "redis",
          "groq",
          "chromadb",
          "django_backend",
        ],
      },

      redis: {
        id: "redis",
        title: "Redis Memory Layer",

        meta: {
          service: "redis",
        },

        run: (s) => ({
          ...s,
          memory: true,
        }),

        next: "join",
      },

      groq: {
        id: "groq",
        title: "Groq LLM Provider",

        meta: {
          service: "groq-api",
        },

        run: (s) => ({
          ...s,
          llm: true,
        }),

        next: "join",
      },

      chromadb: {
        id: "chromadb",
        title: "ChromaDB Vector Store",

        meta: {
          service: "vector-db",
        },

        run: (s) => ({
          ...s,
          vectors: true,
        }),

        next: "join",
      },

      django_backend: {
        id: "django_backend",
        title:
          "Django Business Backend",

        meta: {
          service: "django",
        },

        run: (s) => ({
          ...s,

          services: [
            "Tours",
            "Bookings",
            "Business Logic",
          ],
        }),

        next: "join",
      },

      join: {
        id: "join",
        title:
          "Unified AI Orchestration",

        type: "join",

        waitFor: [
          "redis",
          "groq",
          "chromadb",
          "django_backend",
        ],

        meta: {
          service: "system",
        },

        run: (s) => ({
          ...s,
          distributedSystemReady: true,
        }),

        next: null,
      },
    },
  },
];