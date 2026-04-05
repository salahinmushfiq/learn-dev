// src/engine/runFlow.js
import { adaptFlow } from "./adaptFlow";

export function runFlow(flow = [], initialState = {}, options = {}) {
  const history = [];
  let state = structuredClone(initialState);

  // 🔥 ADD THIS
  const normalizedFlow = adaptFlow(flow, options.projectMeta);

  for (let i = 0; i < normalizedFlow.length; i++) {
    const step = normalizedFlow[i];

    const nextState = step.run(state, { flow: normalizedFlow, index: i });

    history.push({
      stepId: step.id,
      label: step.label,
      type: step.type,
      state: nextState,
      diff: diffState(state, nextState),

      // NOW THIS MAKES SENSE
      explanation: step.explain?.(nextState),

      meta: step.meta,
    });

    state = nextState;
  }

  return { state, history };
}

function diffState(prev = {}, next = {}) {
  const diff = {};
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  for (const key of keys) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
      diff[key] = { before: prev[key], after: next[key] };
    }
  }

  return diff;
}