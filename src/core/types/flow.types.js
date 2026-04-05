export const FlowStepSchema = {
  id: "",
  label: "",
  type: "request | middleware | api | decision | async | terminal",
  service: "react | django | gateway | system | auth | router",
  run: (state, ctx) => ({}),
  explain: (state) => "",
  branch: (next, prev) => null,
};