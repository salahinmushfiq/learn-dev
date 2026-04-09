//src/core/state/useFlowRunner.js
import { useMemo, useState, useEffect } from "react";
export function useFlowRunner(graphData) {
  const history = useMemo(() => {
    if (!graphData || !graphData.nodes) return [];

    const historyLog = [];
    let currentState = { status: "initialized" };
    let currentNodeId = graphData.startNode;
    const visited = new Set();

    while (currentNodeId && !visited.has(currentNodeId)) {
      const node = graphData.nodes[currentNodeId];
      if (!node) break;
      
      visited.add(currentNodeId);
      const runFn = node.run || ((s) => s);
      const nextState = structuredClone(runFn(currentState));

      historyLog.push({
        stepId: node.id,
        event: node.title || node.label, 
        state: nextState,
        meta: {
          service: node.meta?.service || "system"
        }
      });

      currentState = nextState;

      // Branching Logic
      const nextLink = node.next;
      if (typeof nextLink === "function") {
        currentNodeId = nextLink(nextState);
      } else if (typeof nextLink === "object" && nextLink !== null) {
        const condition = (nextState.error || nextState.failed) ? "fail" : "success";
        currentNodeId = nextLink[condition];
      } else {
        currentNodeId = nextLink;
      }
    }
    return historyLog;
  }, [graphData]);

  const [stepIndex, setStepIndex] = useState(0);
  useEffect(() => setStepIndex(0), [graphData]);

  const maxIndex = Math.max(history.length - 1, 0);
  
  return {
    history,
    stepIndex: Math.min(stepIndex, maxIndex),
    next: () => setStepIndex((i) => Math.min(i + 1, maxIndex)),
    prev: () => setStepIndex((i) => Math.max(i - 1, 0)),
    goTo: (i) => setStepIndex(Math.min(Math.max(i, 0), maxIndex)),
  };
}