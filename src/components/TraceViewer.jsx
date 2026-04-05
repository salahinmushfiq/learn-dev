// src/components/TraceViewer.jsx
import React from 'react'
import { servicesConfig } from "../data/services.config";
export const TraceViewer = ({trace}) => {
  return (
    <div className="mt-6 mb-2">
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Request Trace</h3>
        <div className="text-[11px] space-y-1 bg-black/40 p-3 rounded-lg border border-white/5">
        {trace.map((t, i) => {
            const svc = typeof servicesConfig !== 'undefined' ? servicesConfig[t.service] : null;
            return (
            <div key={i} className="flex gap-3 items-center py-1 border-b border-white/5 last:border-0">
                {svc && (
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${svc.color}`}>
                    {svc.label}
                </span>
                )}
                <span className="text-zinc-400 font-mono">{t.event}</span>
            </div>
            );
        })}
        </div>
    </div>
  )
}
