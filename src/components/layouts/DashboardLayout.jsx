// src/components/layout/DashboardLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({
  projectId,
  sidebarItems,
  activeId,
  onSelect,
  isSidebarOpen,
  setSidebarOpen,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050506] text-zinc-300 overflow-hidden font-sans">
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-zinc-950 z-50">
        <button onClick={() => navigate("/")} className="text-blue-500 text-xs font-bold tracking-widest">
          ← HUB
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">{projectId}</h2>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-0 z-40 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 border-r border-white/5 bg-zinc-950 flex flex-col 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-white/5 hidden lg:block">
          <button
            onClick={() => navigate("/")}
            className="text-[10px] font-bold tracking-[0.2em] text-blue-500 hover:text-blue-400 transition uppercase"
          >
            ← SYSTEM HUB
          </button>
          <h2 className="mt-4 text-lg font-bold text-white capitalize tracking-tight">
            {projectId?.replace("-", " ")}
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2">Flows</p>
          {sidebarItems?.map((flow) => (
            <button
              key={flow.id}
              onClick={() => {
                onSelect(flow.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                activeId === flow.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "hover:bg-white/5 text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              {/* Uses the normalized label from flowService/normalizeFlow */}
              {flow.label || flow.title || "Untitled Flow"}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="hidden lg:flex h-14 border-b border-white/5 items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                Node Engine Active
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-zinc-400 font-mono text-[10px] opacity-60">ID: {activeId || "ROOT_PROCESS"}</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}