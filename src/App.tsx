/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sword, Loader2, Target } from "lucide-react";
import { AnalysisResult, PlayerStats } from "./types";
import { apiService, geminiService } from "./services/api";
import { ThemeBackground } from "./components/ThemeBackground";
import { LandingPage } from "./components/LandingPage";
import { DashboardView } from "./components/DashboardView";
import SenseiChat from "./components/dashboard/SenseiChat";

type Theme = "cartoon" | "kuronami" | "gaia";

export default function App() {
  const [riotId, setRiotId] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<Theme>("cartoon");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      document.body.className = theme === "cartoon" ? "" : `theme-${theme}`;
      setIsTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [theme]);

  const handleSearch = useCallback(async (e?: FormEvent, isRefresh = false) => {
    if (e) e.preventDefault();
    
    const formattedId = riotId.trim();
    if (!formattedId.includes("#")) {
      setError("Assinatura inválida. Use Nome#Tag.");
      return;
    }

    setLoading(true);
    setError("");
    
    if (!isRefresh) {
      setStats(null);
      setAnalysis(null);
    }

    try {
      const [name, tag] = formattedId.split("#");
      const playerStats = await apiService.getPlayerStats(name, tag);
      setStats(playerStats);
      
      const cacheKey = `analysis_v1.2_${name.toLowerCase()}_${tag.toLowerCase()}`;
      
      if (!isRefresh) {
        const savedAnalysis = localStorage.getItem(cacheKey);
        if (savedAnalysis) {
          setAnalysis(JSON.parse(savedAnalysis));
          setLoading(false);
          return;
        }
      }

      const analysisData = await geminiService.analyzeMatch(playerStats);
      setAnalysis(analysisData);
      localStorage.setItem(cacheKey, JSON.stringify(analysisData));
    } catch (err: any) {
      console.error("Search Error:", err);
      setError(err.message || "Falha na sincronização dos sistemas");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [riotId]);

  return (
    <div className="min-h-screen relative overflow-x-hidden pt-10 pb-20 selection:bg-brand-primary selection:text-white">
      <ThemeBackground theme={theme} />
      {!stats && <div className="fixed inset-0 gamer-scanlines opacity-30 pointer-events-none" />}
      
      <AnimatePresence mode="wait">
        {(isTransitioning || loading) && (
          <motion.div 
            key="global-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-xl ${
              theme === 'kuronami' ? 'bg-[#020205]/90' : theme === 'gaia' ? 'bg-[#f1f2f6]/90' : 'bg-brand-bg/90'
            }`}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border-4 border-brand-primary/10 rounded-full"
            />
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ["brightness(1)", "brightness(1.8)", "brightness(1)"]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Target size={120} className="text-brand-primary drop-shadow-[0_0_20px_rgba(255,70,85,0.4)]" />
              </motion.div>
            </div>
            <h3 className="mt-12 text-3xl font-black uppercase italic tracking-tighter text-brand-secondary">
              {loading ? "Sincronizando Protocolos..." : "Reconfigurando Realidade..."}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="container mx-auto px-4 flex justify-between items-center mb-16 relative z-10">
        <button onClick={() => setStats(null)} className="flex items-center gap-4 group">
          <div className="bg-brand-primary p-3 cartoon-border rounded-xl group-hover:rotate-6 transition-transform">
             <Sword className="text-white" size={36} />
          </div>
          <div className="text-left hidden sm:block">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">ValoSensei</h1>
            <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.4em] border-t-2 border-brand-primary pt-1 mt-1 block">
              AI TACTICAL CO-PILOT
            </span>
          </div>
        </button>
        
        <nav className="flex items-center gap-2 md:gap-8 font-black uppercase text-[10px] tracking-widest">
           <button className="hover:text-brand-primary transition-colors py-2 border-b-4 border-transparent hover:border-brand-primary px-2">Histórico</button>
           <button className="hover:text-brand-primary transition-colors py-2 border-b-4 border-transparent hover:border-brand-primary px-2">Meta-Dados</button>
        </nav>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {!stats ? (
            <LandingPage 
              key="landing"
              riotId={riotId}
              setRiotId={setRiotId}
              handleSearch={handleSearch}
              loading={loading}
              theme={theme}
              setTheme={setTheme}
              error={error}
            />
          ) : (
            <DashboardView 
              key="dashboard"
              stats={stats}
              analysis={analysis}
              loading={loading}
              theme={theme}
              handleRefresh={() => handleSearch(undefined, true)}
              handleNewSearch={() => setStats(null)}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-32 py-10 border-t-4 border-brand-secondary/5 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">
          DESIGNED FOR RADIANCE <span className="text-brand-primary mx-2">●</span> NO REGRETS
        </p>
      </footer>

      {stats && <SenseiChat />}
    </div>
  );
}
