// src/components/FlowGraph.jsx 
import React, { useEffect, useRef } from "react";

export default function FlowGraph({ flow, activeNode }) {
  // We extract nodes in order of execution for the visual list
  const nodesList = [];
  const visited = new Set();
  let current = flow.startNode;

  while (current && !visited.has(current)) {
    const node = flow.nodes[current];
    if (!node) break;
    nodesList.push(node);
    visited.add(current);
    // For visualization, we follow the first string path or success path
    current = typeof node.next === 'string' ? node.next : node.next?.success || null;
  }

  const nodeRefs = useRef({});

  useEffect(() => {
    if (activeNode && nodeRefs.current[activeNode]) {
      const timer = setTimeout(() => {
        nodeRefs.current[activeNode].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeNode]);

  return (
    <div className="relative p-6 lg:p-8 glass-panel rounded-3xl border border-white/10 shadow-2xl bg-zinc-950/20">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em] mb-1">Topology Monitor</h3>
            <h2 className="text-xl font-bold text-white tracking-tight">{flow.label || flow.title}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-20 gap-x-8 relative">
          {nodesList.map((node, i) => {
            const isActive = activeNode === node.id;
            
            return (
              <div key={node.id} className="relative group scroll-mt-32" ref={(el) => (nodeRefs.current[node.id] = el)}>
                {/* Visual Connectors */}
                {i < nodesList.length - 1 && (
                  <>
                    <div className="hidden md:block absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-0 opacity-20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`${isActive ? 'text-blue-500 opacity-100' : 'text-zinc-500'}`}>
                         <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="md:hidden absolute left-1/2 -bottom-12 -translate-x-1/2 z-0 opacity-20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`${isActive ? 'text-blue-500 opacity-100' : 'text-zinc-500'} rotate-90`}>
                         <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </>
                )}

                <div className={`relative z-10 p-5 rounded-2xl border transition-all duration-500 
                  ${isActive 
                    ? "bg-blue-600 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.3)] scale-[1.05] z-20" 
                    : "bg-zinc-900/40 border-white/5 opacity-40 grayscale-[0.5]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${isActive ? "bg-white/20 border-white/30 text-white" : "bg-black/20 border-white/5 text-zinc-600"}`}>
                      N_{i+1}
                    </span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />}
                  </div>
                  <h4 className={`font-bold text-sm mb-3 tracking-tight ${isActive ? "text-white" : "text-zinc-400"}`}>
                    {node.title}
                  </h4>
                  <div className={`text-[9px] font-mono px-2 py-1 rounded flex items-center gap-2 ${isActive ? "bg-black/30 text-blue-100" : "bg-zinc-950/50 text-blue-500/50"}`}>
                    SERVICE::{node.meta?.service?.toUpperCase() || 'CORE'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}