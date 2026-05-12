// src/utils/buildExecutionGraph.js
export function buildExecutionGraph(flow) {
  if (!flow?.nodes || !flow?.startNode) {
    return null;
  }

  const visited = new Set();

  function build(nodeId) {
    if (!nodeId) return null;

    const node = flow.nodes[nodeId];

    if (!node) return null;

    // prevent infinite recursion
    if (visited.has(nodeId)) {
      return {
        ...node,
        __isReference: true,
      };
    }

    visited.add(nodeId);

    const result = {
      ...node,
    };

    // =====================================================
    // PARALLEL
    // =====================================================
    if (node.type === "parallel") {
      result.__type = "parallel";

      result.__branches = (node.next || [])
        .map((id) => build(id))
        .filter(Boolean);
    }

    // =====================================================
    // DECISION
    // =====================================================
    else if (node.type === "decision") {
      result.__type = "decision";

      result.__branches = {
        success: build(node.next?.success),
        fail: build(node.next?.fail),
      };
    }

    // =====================================================
    // ROUTER
    // =====================================================
    else if (node.type === "router") {
      result.__type = "router";

      result.__branches = {};

      Object.entries(node.next || {}).forEach(
        ([key, value]) => {
          result.__branches[key] = build(value);
        }
      );
    }

    // =====================================================
    // LINEAR
    // =====================================================
    else if (typeof node.next === "string") {
      result.__next = build(node.next);
    }

    return result;
  }

  return build(flow.startNode);
}