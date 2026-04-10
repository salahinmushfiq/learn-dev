//src/core/visualization/buildLanes.js
export function buildLanes(history, graph) {
  if (!history?.length) return { lanes: [], nodeMap: {} };

  const nodeMap = graph.nodes;

  const lanes = [];
  const laneMap = new Map(); // nodeId -> laneIndex

  function getOrCreateLane(nodeId) {
    if (laneMap.has(nodeId)) return laneMap.get(nodeId);

    const laneIndex = lanes.length;
    lanes.push([]);
    laneMap.set(nodeId, laneIndex);
    return laneIndex;
  }

  history.forEach((step, index) => {
    const node = nodeMap[step.stepId];
    if (!node) return;

    // Default lane assignment
    let laneIndex = getOrCreateLane(step.stepId);

    // If this node is part of a parallel system, keep same lane grouping
    if (node.type === "parallel") {
      node.next.forEach((childId, i) => {
        const childLane = getOrCreateLane(childId);

        if (!lanes[childLane]) lanes[childLane] = [];
      });
    }

    lanes[laneIndex].push({
      ...step,
      index,
    });
  });

  return { lanes, nodeMap };
}