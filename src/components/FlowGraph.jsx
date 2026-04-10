// src/components/FlowGraph.jsx
import React, { useMemo, useEffect, useRef } from "react";
import { buildExecutionGraph } from "../utils/buildExecutionGraph";
import { buildEdges } from "../utils/buildEdges";
import { getActiveSet } from "../utils/getActiveSet";

export default function FlowGraph({ flow, history = [], stepIndex = 0 }) {
  const graph = useMemo(() => buildExecutionGraph(flow), [flow]);
  const edges = useMemo(() => buildEdges(flow?.nodes || {}), [flow]);
  const activeSet = useMemo(() => getActiveSet(history, stepIndex), [history, stepIndex]);
  
  // Track the most recently activated node ID
  const activeNodeId = history[stepIndex]?.stepId;
  const activeNodeRef = useRef(null);

  // AUTO-SCROLL LOGIC
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Keep it centered in the viewport
        inline: "nearest",
      });
    }
  }, [activeNodeId]); // Trigger every time the step changes

  if (!flow || !graph) return null;

  const visited = new Set();

  // ================= UPGRADED NODE CARD =================
  const NodeCard = ({ node }) => {
    const isActive = node.id === activeNodeId;
    const isCompleted = history.some(h => h.stepId === node.id && history.indexOf(h) <= stepIndex);

    return (
      <div
        ref={isActive ? activeNodeRef : null} // 🔥 Attach Ref here
        className={`relative p-5 rounded-2xl border transition-all duration-500 w-[280px] group
        ${isActive
            ? "bg-blue-600 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.4)] z-20 scale-[1.05]"
            : isCompleted 
            ? "bg-zinc-900/80 border-blue-500/40 text-zinc-300 opacity-90" 
            : "bg-zinc-950 border-white/5 text-zinc-500 opacity-40 hover:opacity-100"
        }`}
      >
        {/* Glow effect for active nodes */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 animate-pulse blur-2xl" />
        )}

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
             <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
               isActive ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500"
             }`}>
               {node.type || 'task'}
             </span>
             <span className="text-[10px] font-mono opacity-50">{node.meta?.service}</span>
          </div>
          
          <h4 className={`font-bold tracking-tight text-base ${isActive ? "text-white" : "text-zinc-200"}`}>
            {node.title}
          </h4>

          {node.type === "join" && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Input Sync</span>
                <span className="text-[9px] font-bold text-blue-400">
                  {node.waitFor?.filter(id => activeSet.has(id)).length} / {node.waitFor?.length}
                </span>
              </div>
              <div className="flex gap-1.5">
                {node.waitFor?.map((id) => {
                  const isArrived = activeSet.has(id);
                  return (
                    <div 
                      key={id} 
                      className={`h-1 flex-1 rounded-full transition-all duration-700 ${
                        isArrived 
                        ? "bg-green-500 shadow-[0_0_8px_#22c55e]" 
                        : "bg-zinc-800"
                      }`} 
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ================= CONNECTOR LINE =================
  const Connector = ({ active = false, type = "normal" }) => {
    const colorClass = active 
      ? (type === "fail" ? "bg-red-500" : "bg-blue-500") 
      : "bg-zinc-800";

    return (
      <div className="flex flex-col items-center relative">
        <div className={`w-px h-10 transition-all duration-700 ${colorClass} ${
          active ? "active-path-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-y-110" : ""
        }`} />
      </div>
    );
  };

  // ================= RECURSIVE RENDER =================
  const renderNode = (node) => {
    if (!node) return null;

    if (visited.has(node.id)) {
      return (
        <div className="group flex flex-col items-center py-4">
           <div className="w-px h-6 bg-gradient-to-b from-zinc-800 to-transparent" />
           <div className="text-[9px] font-mono text-zinc-600 bg-zinc-900/50 px-2 py-1 rounded border border-white/5">
             ↩ MERGE: {node.title}
           </div>
        </div>
      );
    }
    visited.add(node.id);

    const isNodeCompleted = history.some(h => h.stepId === node.id && history.indexOf(h) <= stepIndex);

    return (
      <div className="flex flex-col items-center w-full">
        <NodeCard node={node} />

        {/* PARALLEL BRANCHES */}
        {node.__type === "parallel" && (
          <div className="w-full flex flex-col items-center mt-4">
            <div className="w-px h-6 bg-purple-500/50" />
            <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12 w-full relative pt-6">
              {/* Horizontal Fork Line */}
              <div className="hidden lg:block absolute top-0 left-[20%] right-[20%] h-px bg-zinc-800" />
              
              {node.__branches?.map((branch, i) => (
                <div key={i} className="flex flex-col items-center w-full lg:w-auto">
                  <Connector active={isNodeCompleted && activeSet.has(branch?.id)} type="parallel" />
                  {renderNode(branch)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DECISION BRANCHES */}
        {node.__type === "decision" && (
          <div className="w-full flex flex-col items-center mt-4">
            <div className="w-px h-6 bg-yellow-500/50" />
            <div className="flex justify-center gap-16 relative pt-6">
               <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-green-500 mb-1 tracking-widest">SUCCESS</span>
                  <Connector active={isNodeCompleted && activeSet.has(node.__branches?.success?.id)} type="success" />
                  {renderNode(node.__branches?.success)}
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-red-500 mb-1 tracking-widest">FAILURE</span>
                  <Connector active={isNodeCompleted && activeSet.has(node.__branches?.fail?.id)} type="fail" />
                  {renderNode(node.__branches?.fail)}
               </div>
            </div>
          </div>
        )}

        {/* LINEAR NEXT */}
        {node.__next && (
          <div className="flex flex-col items-center">
            <Connector active={isNodeCompleted && activeSet.has(node.__next?.id)} />
            {renderNode(node.__next)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-12 rounded-[2.5rem] border border-white/5 bg-[#08080a] relative overflow-auto custom-scrollbar max-h-[80vh]">
      {/* Visual background decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              {flow.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Virtual_DOM_Orchestrator</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center pb-32 min-w-max">
          {renderNode(graph)}
        </div>
      </div>
    </div>
  );
}