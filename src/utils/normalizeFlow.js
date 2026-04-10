// src/utils/normalizeFlow.js
export function normalizeFlow(flow) {
  if (!flow) return null;

  if (flow.nodes) {
    return {
      type: "graph",
      id: flow.id,
      // 🔥 UNIFIED LABEL SYSTEM
      label: flow.tabLabel || flow.title || "Untitled Flow",

      // keep title separately (for headers, etc.)
      title: flow.title || flow.tabLabel || "Untitled Flow",

      startNode: flow.startNode,
      nodes: flow.nodes || {},
    };
  }

  return null;
}