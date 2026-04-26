// src/data/flows.registry.js

import { tourmateFlows } from "./flows/tourmate.flows";
import { innerPatissierFlows } from "./flows/innerPatissier.flows";

import jwtFlow from "./flows/auth/jwt.flow";
import { paymentFlow } from "./flows/payments/payment.flow";
import { rbacFlow } from "./flows/rbac/rbac.flow";
import { trekBotFlows } from "./flows/trekbot.flows";

// 🔥 PROJECT FLOWS → ALWAYS ARRAY
export function getFlowsByProject(projectId) {
  const projectMap = {
    "tour-mate": tourmateFlows,
    "inner-patissier": innerPatissierFlows,
    "trek-bot": trekBotFlows
  };

  const flows = projectMap[projectId];

  if (!flows) return null;

  return Array.isArray(flows) ? flows : [flows]; // SAFETY
}

// STANDALONE FLOWS → OBJECT MAP (converted later to array)
export function getStandaloneFlows() {
  return {
    jwt: jwtFlow,
    payment: paymentFlow,
    rbac: rbacFlow
  };
}