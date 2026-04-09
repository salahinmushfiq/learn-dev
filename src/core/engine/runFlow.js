// src/engine/runFlow.js
import { diffState } from "./diffState";

export function runFlow(flow = [], initialState = {}, options = {}) {
  const history = [];
  let state = structuredClone(initialState);

  const chaos = options.chaos || false;
  const seed = options.seed || 1;

  const rand = (i) => {
    const x = Math.sin(seed + i * 9999) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < flow.length; i++) {
    const step = flow[i];

    const runFn = step.run || ((s) => s);

    // chaos injection
    if (chaos && rand(i) < 0.25) {
      const failedState = {
        ...state,
        status: "failed_temp",
        failedAt: step.id,
      };

      history.push({
        stepId: step.id,
        label: step.label,
        type: "failure",
        state: failedState,
        diff: diffState(state, failedState),
      });

      state = failedState;
      continue;
    }

    const nextState = structuredClone(runFn(state, { flow, index: i }));

    history.push({
      stepId: step.id,
      label: step.label,
      type: step.type || "state",
      state: nextState,
      diff: diffState(state, nextState),
      meta: step.meta || {},
    });

    state = nextState;
  }

  return { state, history };
}
