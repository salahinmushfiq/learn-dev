export function adaptFlow(flow, projectMeta = {}) {
  return flow.map((step) => ({
    ...step,

    // normalize missing fields
    meta: {
        ...(step.meta || {}),
        service: step.meta?.service || "system",
        project: projectMeta?.projectId || "generic",
    },

    explain:
      step.explain ||
      (() => `${step.label} executed on ${step.meta?.service}`),

    branch:
      step.branch ||
      (() => null),
  }));
}