// src/pages/ProjectPage.jsx
import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useFlowContext } from "../contexts/FlowContext";
import { loadProjectFlows } from "../services/flowService";
import DashboardLayout from "../components/layouts/DashboardLayout";
import FlowRunnerView from "../components/FlowRunnerView";
export default function FlowViewer() {
  const { projectId } = useParams();
  const { setActiveProject } = useFlowContext(); 
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Sync Project Context
  useEffect(() => {
    setActiveProject(projectId);
    return () => setActiveProject(null);
  }, [projectId, setActiveProject]);

  const result = useMemo(() => loadProjectFlows(projectId), [projectId]);
  
  // Ensure we have an array of flows for the sidebar
  const projectFlows = useMemo(() => {
    if (!result) return [];
    return result.type === "project" ? result.data : [result.data];
  }, [result]);

  // Set default active flow
  useEffect(() => {
    if (projectFlows.length > 0 && !activeFlowId) {
      setActiveFlowId(projectFlows[0].id);
    }
  }, [projectFlows, activeFlowId]);

  const graphData = useMemo(() => {
    return projectFlows.find((f) => f.id === activeFlowId) || null;
  }, [projectFlows, activeFlowId]);

  if (!result) return <div className="h-screen flex items-center justify-center text-zinc-500 font-mono">404 // FLOW_NOT_FOUND</div>;

  return (
    <DashboardLayout
      projectId={projectId}
      sidebarItems={projectFlows}
      activeId={activeFlowId}
      onSelect={setActiveFlowId}
      isSidebarOpen={isSidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
        {graphData ? (
          <FlowRunnerView 
            key={`${projectId}-${activeFlowId}`} 
            graphData={graphData} 
          />
        ) : (
          <div className="h-full flex items-center justify-center font-mono text-blue-500">
             INITIALIZING_NODE_ENGINE...
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}