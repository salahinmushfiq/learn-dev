// src/utils/getActiveSet.js
export function getActiveSet(history = [], stepIndex = 0) {
  const active = new Set();

  for (let i = 0; i <= stepIndex; i++) {
    const step = history[i];
    if (step?.stepId) {
      active.add(step.stepId);
    }
  }

  return active;
}