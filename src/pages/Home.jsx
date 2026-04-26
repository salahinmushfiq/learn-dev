// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

const projects = [
  { id: "tour-mate", name: "TourMate", category: "Fullstack", status: "Stable" },
  { id: "inner-patissier", name: "Inner Patissier", category: "Inventory", status: "Stable" },
  { id: "trek-bot", name: "TrekBot", category: "AI", status: "Stable" },
  { id: "jwt", name: "JWT Auth", category: "Security", status: "Internal" },
  { id: "payment", name: "Payment Gateway", category: "Finance", status: "External" },
  { id: "rbac", name: "RBAC Flow", category: "Access Control", status: "Stable" }
];

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050506] text-zinc-300 p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase">System Ready</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Dev Learning Platform</h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">Select a module to visualize architectural flows.</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/flow/${p.id}`)}
            className="group relative text-left p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 bg-white/5 rounded">
                {p.category}
              </span>
              <span className="text-[10px] font-mono text-green-500 italic">{p.status}</span>
            </div>
            
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {p.name}
            </h3>
            <p className="text-sm text-zinc-500 mt-1 font-mono">ID: {p.id}_FLOW</p>
            
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              INITIALIZE INTERFACE 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}