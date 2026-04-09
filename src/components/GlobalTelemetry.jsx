// src/components/GlobalTelemetry.jsx
import { useFlowContext } from "../contexts/FlowContext";
import { useLocation } from "react-router-dom";

export default function GlobalTelemetry() {
  const { activeProject } = useFlowContext();
  const location = useLocation();

  // Only show full telemetry when inside a flow, show "Standby" on Home
  const isHome = location.pathname === "/";

  if (!activeProject && isHome) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-white/5">
      <div 
        className={`h-full bg-blue-500 transition-all duration-1000 ease-in-out ${activeProject ? 'w-full shadow-[0_0_15px_#3b82f6]' : 'w-0'}`} 
      />
      
      <div className="absolute top-4 right-6 flex flex-col items-end gap-1 pointer-events-none">
        <div className="bg-zinc-950/80 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xl flex items-center gap-3 shadow-2xl">
          <div className="flex gap-1">
            <span className={`w-1 h-1 rounded-full ${activeProject ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'}`} />
            <span className={`w-1 h-1 rounded-full ${activeProject ? 'bg-blue-400 animate-pulse delay-75' : 'bg-zinc-700'}`} />
          </div>
          
          <span className="text-[10px] font-mono font-bold tracking-tighter uppercase flex gap-2">
            <span className="text-zinc-500">System_Status:</span>
            <span className={activeProject ? "text-blue-400" : "text-zinc-600"}>
              {activeProject ? `LINKED_TO_${activeProject.toUpperCase()}` : "CORE_STANDBY"}
            </span>
          </span>
        </div>
        
        {activeProject && (
          <span className="text-[8px] font-mono text-zinc-600 mr-2 uppercase tracking-[0.2em] animate-pulse">
            Telemetry Sync Active
          </span>
        )}
      </div>
    </div>
  );
}