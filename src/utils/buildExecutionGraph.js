// src/utils/buildExecutionGraph.js
export function buildExecutionGraph(flow) {
  if (!flow || !flow.nodes || !flow.startNode) return null;

  const nodes = flow.nodes;

  const cache = new Map();
  const visiting = new Set();

  function buildNode(nodeId) {
    if (!nodeId) return null;

    // 🔁 cycle detected
    if (visiting.has(nodeId)) {
      return {
        id: nodeId,
        title: "CYCLE_DETECTED",
        __type: "cycle",
      };
    }

    if (cache.has(nodeId)) {
      return cache.get(nodeId);
    }

    const node = nodes[nodeId];
    if (!node) return null;

    visiting.add(nodeId);

    let builtNode = {
      ...node,
      __type: node.type || "linear",
    };

    cache.set(nodeId, builtNode);

    if (node.type === "parallel") {
      builtNode.__branches = (node.next || []).map((id) =>
        buildNode(id)
      );
    } 
    else if (node.type === "decision") {
      builtNode.__branches = {
        success: buildNode(node.next?.success),
        fail: buildNode(node.next?.fail),
      };
    } 
    else {
      builtNode.__next = buildNode(node.next);
    }

    visiting.delete(nodeId);

    return builtNode;
  }

  return buildNode(flow.startNode);
}