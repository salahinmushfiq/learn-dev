// src/utils/normalizeFlow.js
export function normalizeFlow(flow) {
  if (!flow) return null;

  if (flow.nodes) {
    return {
      type: "graph",
      id: flow.id,
      label: flow.label || flow.title || flow.tabLabel,
      startNode: flow.startNode,
      nodes: flow.nodes
    };
  }

  return null;
}