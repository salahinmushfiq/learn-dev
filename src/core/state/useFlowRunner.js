// src/core/state/useFlowRunner.js
import { useMemo, useState, useEffect } from "react";
import { runFlow } from "../engine/runFlow";

export function useFlowRunner(flow) {
  const result = useMemo(() => {
    return runFlow(Array.isArray(flow) ? flow : [], {
      status: "initialized",
      trace: [],
    });
  }, [flow]);

  const history = result.history || [];
  const maxIndex = Math.max(history.length - 1, 0);

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
  }, [flow]);

  const safeIndex = Math.min(Math.max(stepIndex, 0), maxIndex);

  return {
    history,
    stepIndex: safeIndex,
    currentState: history[safeIndex]?.state || result.state,

    next: () => setStepIndex((i) => Math.min(i + 1, maxIndex)),
    prev: () => setStepIndex((i) => Math.max(i - 1, 0)),
    goTo: (i) => setStepIndex(Math.min(Math.max(i, 0), maxIndex)),
  };
}