//src/core/state/useFlowRunner.js
import { useState, useEffect } from "react";
import { executeFlow } from "../engine/executeFlow";

export function useFlowRunner(graphData) {
  const [history, setHistory] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!graphData) return;

      setLoading(true);

      const result = await executeFlow(graphData);

      if (active) {
        setHistory(result || []);
        setStepIndex(0);
        setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [graphData]);

  const maxIndex = Math.max(history.length - 1, 0);

  return {
    history,
    stepIndex: Math.min(stepIndex, maxIndex),
    loading,
    next: () => setStepIndex((i) => Math.min(i + 1, maxIndex)),
    prev: () => setStepIndex((i) => Math.max(i - 1, 0)),
    goTo: (i) => setStepIndex(Math.min(Math.max(i, 0), maxIndex)),
  };
}