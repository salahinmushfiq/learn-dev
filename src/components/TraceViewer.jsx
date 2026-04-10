//src/components/TraceViewer.jsx
export const TraceViewer = ({ history, goTo, stepIndex }) => {
  return (
    <div className="bg-[#050506] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="bg-white/[0.02] px-4 py-3 flex items-center justify-between border-b border-white/10">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Live_Execution_Log</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-red-500/50 rounded-full" />
          <div className="w-1 h-1 bg-yellow-500/50 rounded-full" />
          <div className="w-1 h-1 bg-green-500/50 rounded-full" />
        </div>
      </div>

      <div className="p-3 space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar">
        {history.map((item, i) => {
          const isCurrent = i === stepIndex;
          return (
            <div
              key={i}
              onClick={() => goTo(i)}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                isCurrent 
                  ? "bg-blue-600/10 border border-blue-500/30" 
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className={`w-1 h-5 rounded-full transition-all ${isCurrent ? "bg-blue-500" : "bg-zinc-800"}`} />
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                   <span className={`text-[11px] font-bold ${isCurrent ? "text-white" : "text-zinc-500"}`}>
                    {item.event}
                   </span>
                   <span className="text-[9px] font-mono text-zinc-700">{item.meta?.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-mono text-blue-500/80 uppercase">{item.meta?.service}</span>
                   <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                   <span className={`text-[8px] font-mono ${item.meta?.type === 'parallel' ? 'text-purple-500' : 'text-zinc-700'}`}>
                     {item.meta?.type || 'TASK'}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};