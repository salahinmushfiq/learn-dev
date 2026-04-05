// src/components/Controls.jsx
import React from 'react'
export const Controls = ({ history, stepIndex, next, prev, goTo }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl border border-white/10">
        <div className="mb-4">
        <input
            type="range"
            min="0"
            max={history.length > 0 ? history.length - 1 : 0}
            value={stepIndex}
            onChange={(e) => goTo(Number(e.target.value))}
            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
            <span>STEP {history.length ? stepIndex + 1 : 0} / {history.length}</span>
            <span>MODE: SNAPSHOT {stepIndex}</span>
        </div>
        </div>

        <div className="flex gap-3">
        <button
            onClick={prev}
            disabled={stepIndex === 0}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-colors"
        >
            Previous
        </button>
        <button
            onClick={next}
            disabled={stepIndex === history.length - 1}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-colors"
        >
            Next
        </button>
        </div>
    </div>
  )
}
