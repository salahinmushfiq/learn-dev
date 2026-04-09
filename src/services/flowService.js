// src/services/flowService.js
import {
  getFlowsByProject,
  getStandaloneFlows,
} from "../data/flows.registry";
import { normalizeFlow } from "../utils/normalizeFlow";

export function loadProjectFlows(projectId) {
  const projectFlows = getFlowsByProject(projectId);

  if (projectFlows) {
    return {
      type: "project",
      data: projectFlows.map(normalizeFlow),
    };
  }

  const standaloneFlows = getStandaloneFlows();

  if (standaloneFlows[projectId]) {
    return {
      type: "graph",
      data: normalizeFlow(standaloneFlows[projectId]),
    };
  }

  return null;
}