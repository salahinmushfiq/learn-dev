// src/data/flows.registry.js
import { tourmateFlows } from "./flows/tourmate.flows";
import { innerPatissierFlows } from "./flows/innerPatissier.flows";

import jwtFlow from "./flows/auth/jwt.flow";
import { paymentFlow } from "./flows/payments/payment.flow";
import {rbacFlow} from "./flows/rbac/rbac.flow";

export function getFlowsByProject(projectId) {
  const projectMap = {
    "tour-mate": tourmateFlows,
    "inner-patissier": innerPatissierFlows,
  };

  return projectMap[projectId] || null;
}

export function getStandaloneFlows() {
  return {
    jwt: jwtFlow,
    payment: paymentFlow,
    rbac: rbacFlow,
  };
}