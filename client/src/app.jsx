import { useState, useEffect } from "react";
import { Satellite, Bot, Globe, ShieldAlert, Sparkles, Send, Activity, RefreshCw } from "lucide-react";

export default function App() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("Ask SpaceVault AI anything about active missions, orbital mechanics, or asteroids.");
  const [loadingAi, setLoadingAi] = useState(false);

  async function handleAiQuery(e) {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setLoadingAi(true);
    setAiResponse("Querying deep space telemetry nodes...");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.answer);
      } else {
        setAiResponse("Telemetry node error responding to request.");
      }
    } catch (err) {
      setAiResponse("Unable to reach backend intelligence server. Ensure Node.js server is running.");
    } finally {
      setLoadingAi(false);
      setAiPrompt("");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/80 bg-[#0b0e17]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center glow-cyan">
            <Satellite className="text-black w-6 h-6 font-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">SpaceVault</h1>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Intelligence v2.6</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl text-cyan-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Live Telemetry Connected</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-10 flex-grow">
        
        {/* AI Space Copilot Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles className="w-4 h-4" />
            <span>AI Space Intelligence Copilot</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Query Mission Status & Orbital Hazards</h2>
          
          <div className="bg-black/60 p-4 rounded-2xl border border-gray-800 mb-6 min-h-[80px] flex items-center">
            <p className="text-sm font-mono text-gray-300">{aiResponse}</p>
          </div>

          <form onSubmit={handleAiQuery} className="flex gap-3">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., What is the current telemetry status of Perseverance on Mars?" 
              className="flex-grow bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
            />
            <button 
              disabled={loadingAi}
              type="submit" 
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask AI</span>
            </button>
          </form>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="text-gray-400 text-xs font-mono uppercase mb-2">Active Tracked Assets</div>
            <div className="text-3xl font-black text-white">6 Missions</div>
            <span className="text-[11px] text-emerald-400 font-mono">100% Nominal Telemetry</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="text-gray-400 text-xs font-mono uppercase mb-2">Near-Earth Asteroids</div>
            <div className="text-3xl font-black text-pink-400">14 Tracked</div>
            <span className="text-[11px] text-pink-400 font-mono">2 High Risk Close Approaches</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="text-gray-400 text-xs font-mono uppercase mb-2">Exoplanet Database</div>
            <div className="text-3xl font-black text-purple-400">5,500+ Worlds</div>
            <span className="text-[11px] text-purple-400 font-mono">Habitable Zone Verified</span>
          </div>
        </div>

      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500 font-mono">
        © 2026 SpaceVault Platform. All rights reserved. Built with React & Node.js.
      </footer>
    </div>
  );
}

