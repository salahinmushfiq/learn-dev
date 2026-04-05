//src/data/flows.registry.js
import { authFlow } from "./auth.flow";
import { rbacFlow } from "./rbac.flow";
import { paymentsFlow } from "./payments.flow";
import { architectureFlow } from "./architecture.flow";

export const flowsRegistry = {
  jwt: authFlow,
  rbac: rbacFlow,
  payment: paymentsFlow,
  architecture: architectureFlow,
};

export const getFlow = (key) => flowsRegistry[key] || [];