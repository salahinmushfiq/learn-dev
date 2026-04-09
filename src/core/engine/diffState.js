// src/engine/diffState.js
export function diffState(prev = {}, next = {}) {
  const diff = {};
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  for (const key of keys) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
      diff[key] = { before: prev[key], after: next[key] };
    }
  }

  return diff;
}