// src/components/GlobalTelemetry.jsx
import { useFlowContext } from "../contexts/FlowContext";
import { useLocation } from "react-router-dom";

export default function GlobalTelemetry({ progress = 0 }) {
  const { activeProject } = useFlowContext();
  
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-white/5">
      {/* Dynamic progress bar linked to StepIndex */}
      <div 
        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
        style={{ width: `${progress}%` }} 
      />
      
      <div className="absolute top-10 lg:top-8 right-16 lg:right-6  flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Engine_Status</span>
          <span className="text-[10px] text-zinc-400 font-mono italic">
            {activeProject ? `NODES_ACTIVE: ${activeProject}` : "STANDBY"}
          </span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
           <div className={`w-2 h-2 rounded-full ${activeProject ? 'bg-blue-500 animate-ping' : 'bg-zinc-800'}`} />
        </div>
      </div>
    </div>
  );
}