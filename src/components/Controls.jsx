// src/components/Controls.jsx
export const Controls = ({ history, stepIndex, next, prev, goTo }) => {
  const progress = ((stepIndex + 1) / history.length) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl px-4">
      <div className="glass-panel p-2 lg:p-3 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-4">
        
        {/* Step Indicator */}
        <div className="hidden sm:flex flex-col px-4 border-r border-white/5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Step</span>
          <span className="text-sm font-bold text-blue-400 font-mono">
            {(stepIndex + 1).toString().padStart(2, '0')} <span className="text-zinc-700">/</span> {history.length}
          </span>
        </div>

        {/* Playback Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={prev} 
            disabled={stepIndex === 0} 
            className="p-2.5 bg-zinc-900 rounded-xl hover:bg-zinc-800 disabled:opacity-20 transition-all border border-white/5 text-zinc-300"
          >
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path d="M15 18l-6-6 6-6"/>
             </svg>
          </button>
          
          <button 
            onClick={next} 
            disabled={stepIndex === history.length - 1} 
            className="group relative px-6 py-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-20"
          >
             <span className="relative z-10 font-bold text-xs lg:text-sm text-white flex items-center gap-2">
               {stepIndex === history.length - 1 ? 'FINISH' : 'NEXT STEP'}
               <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                 <path d="M9 18l6-6-6-6"/>
               </svg>
             </span>
          </button>
        </div>

        {/* Progress Bar (Interactive) */}
        <div className="flex-1 hidden md:block px-2">
          <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 progress-glow transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mobile Mini-Progress */}
        <div className="md:hidden flex-1 text-right">
           <span className="text-[10px] font-mono text-blue-500 font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}