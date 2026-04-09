// //src/components/StateViewer.jsx
// import React from 'react'

// const StateViewer = ({history,stepIndex}) => {
//   return (
//     <div className="bg-[#0a0a0c] rounded-xl border border-white/5 overflow-hidden">
//         <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
//             <span className="text-[10px] font-mono text-zinc-400 uppercase">Live_State.json</span>
//             <div className="flex gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-red-500/20" />
//             <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
//             <div className="w-2 h-2 rounded-full bg-green-500/20" />
//             </div>
//         </div>
//         <pre className="p-4 text-[11px] leading-relaxed font-mono text-blue-300 overflow-x-auto">
//             {JSON.stringify(history[stepIndex]?.state || {}, null, 2)}
//         </pre>
//     </div>
//   )
// }

// export default StateViewer
// src/components/StateViewer.jsx
// src/components/StateViewer.jsx (Enhanced version of your update)
import React, { useMemo } from 'react';

const StateViewer = ({ history, stepIndex }) => {
  const currentState = history[stepIndex]?.state || {};
  const prevState = stepIndex > 0 ? history[stepIndex - 1]?.state : {};

  const changedKeys = useMemo(() => {
    const keys = new Set();
    Object.keys(currentState).forEach(key => {
      const prevVal = prevState[key];
      const currVal = currentState[key];
      if (!(key in prevState) || JSON.stringify(prevVal) !== JSON.stringify(currVal)) {
        keys.add(key);
      }
    });
    return keys;
  }, [currentState, prevState]);

  return (
    <div className="bg-[#050506] rounded-2xl border border-white/5 overflow-hidden shadow-2xl glass-panel">
      <div className="bg-white/5 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">State_Monitor</span>
        </div>
        <div className="flex gap-1.5">
           <span className="w-2 h-2 rounded-full bg-red-500/20" />
           <span className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>

      <div className="p-5 overflow-x-auto custom-scrollbar max-h-[450px]">
        <pre className="font-mono text-[11px] leading-relaxed">
          <span className="text-zinc-600">{"{"}</span>
          {Object.entries(currentState).map(([key, value], i, arr) => {
            const isChanged = changedKeys.has(key);
            const isNew = !(key in prevState);
            
            return (
              <div 
                key={key} 
                className={`group pl-4 flex flex-wrap items-center gap-x-2 py-1 transition-all duration-500 ${
                  isChanged ? "bg-blue-600/10 -mx-5 px-5 border-l-2 border-blue-500" : "border-l-2 border-transparent"
                }`}
              >
                <span className={`${isChanged ? "text-blue-300 font-bold" : "text-zinc-500"}`}>
                  "{key}":
                </span>
                
                <span className={`transition-all duration-700 break-all ${
                  isChanged ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-blue-400/80"
                }`}>
                  {typeof value === 'object' && value !== null 
                    ? <span className="text-[10px] opacity-80">{JSON.stringify(value, null, 1).replace(/\n/g, ' ')}</span>
                    : JSON.stringify(value)}
                  {i < arr.length - 1 && <span className="text-zinc-600">,</span>}
                </span>

                {isChanged && (
                  <span className="animate-in fade-in zoom-in duration-300 text-[7px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ml-auto">
                    {isNew ? "NEW_ENTRY" : "VAL_MODIFIED"}
                  </span>
                )}
              </div>
            );
          })}
          <span className="text-zinc-600">{"}"}</span>
        </pre>

        {Object.keys(currentState).length === 0 && (
          <div className="text-zinc-800 font-mono text-[10px] py-4 flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-800 rounded-full animate-ping" />
            // NULL_STATE_AWAITING_INPUT
          </div>
        )}
      </div>
    </div>
  );
};

export default StateViewer;