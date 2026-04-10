// src/utils/buildEdges.js

export function buildEdges(nodes = {}) {
  const edges = [];

  Object.values(nodes).forEach((node) => {
    if (!node?.next) return;

    // PARALLEL
    if (Array.isArray(node.next)) {
      node.next.forEach((target) => {
        edges.push({
          from: node.id,
          to: target,
          type: "parallel",
        });
      });
      return;
    }

    // DECISION
    if (typeof node.next === "object") {
      if (node.next.success) {
        edges.push({
          from: node.id,
          to: node.next.success,
          type: "success",
        });
      }

      if (node.next.fail) {
        edges.push({
          from: node.id,
          to: node.next.fail,
          type: "fail",
        });
      }

      return;
    }

    // NORMAL
    edges.push({
      from: node.id,
      to: node.next,
      type: "normal",
    });
  });

  return edges;
}