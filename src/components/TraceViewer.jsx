export const TraceViewer = ({ history, goTo, stepIndex }) => {
  // Defensive check: if history isn't ready, show a placeholder
  if (!history || history.length === 0) {
    return (
      <div className="bg-black/40 rounded-xl border border-white/5 p-4 text-zinc-500 font-mono text-[10px]">
        AWAITING_EXECUTION_TRACE...
      </div>
    );
  }

  return (
    <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
      <div className="bg-white/5 px-4 py-2 border-b border-white/5">
        <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Execution Trace</h3>
      </div>

      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
        {history.map((item, i) => (
          <div
            key={item.stepId + i}
            onClick={() => goTo(i)}
            className={`group flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all border 
              ${i === stepIndex 
                ? "bg-blue-500/20 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                : "hover:bg-white/5 border-transparent hover:border-white/10"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-600 w-4">{i + 1}</span>
              <span className="text-[11px] text-zinc-300 group-hover:text-white transition-colors">
                {item.event}
              </span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-tighter">
              {item.meta?.service}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};