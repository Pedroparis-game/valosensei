import React from "react";
import { motion } from "motion/react";
import { RefreshCcw, Brain, Target } from "lucide-react";
import { PlayerStats, AnalysisResult } from "../types";
import StatsOverview from "./dashboard/StatsOverview";
import Insights from "./dashboard/Insights";
import { Button } from "./ui/Button";

interface DashboardViewProps {
  stats: PlayerStats;
  analysis: AnalysisResult | null;
  loading: boolean;
  theme: "cartoon" | "kuronami" | "gaia";
  handleRefresh: () => void;
  handleNewSearch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  analysis,
  loading,
  theme,
  handleRefresh,
  handleNewSearch
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="max-w-5xl mx-auto px-2 md:px-0"
    >
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 border-b-8 border-brand-secondary pb-10">
         <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xs font-black uppercase opacity-60 tracking-widest bg-brand-secondary/5 px-3 py-1 rounded-lg">Identidade Digital</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none flex flex-wrap items-baseline justify-center md:justify-start gap-2">
              <span className="text-brand-secondary tracking-tighter">{stats.name}</span>
              <span className="text-brand-primary text-3xl md:text-5xl">#{stats.tag}</span>
            </h2>
         </div>
          <div className="flex gap-4 w-full md:w-auto">
             <Button 
               onClick={handleRefresh}
               loading={loading}
               theme={theme}
               className="!px-6 !py-3 text-xs w-1/2 md:w-auto"
               icon={<RefreshCcw size={16} />}
             >
               Recalcular
             </Button>
             <Button 
               onClick={handleNewSearch}
               theme="cartoon"
               className="!px-6 !py-3 text-xs w-1/2 md:w-auto !bg-brand-secondary"
             >
               Novo Alvo
             </Button>
          </div>
      </div>

      <div className="space-y-12">
        <StatsOverview stats={stats} theme={theme} />
        
        {analysis ? (
          <Insights analysis={analysis} theme={theme} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6 bg-white/50 rounded-3xl border-4 border-dashed border-brand-secondary/10"
          >
            <div className="relative">
              <Brain size={80} className="text-brand-primary animate-pulse" />
              <Target size={32} className="absolute -top-2 -right-2 text-brand-accent animate-bounce" />
            </div>
            <div className="text-center">
              <div className="font-black uppercase text-3xl italic tracking-tighter mb-2 animate-pulse">O Sensei está Processando...</div>
              <p className="text-base font-bold opacity-60 uppercase tracking-widest">Cruzando telemetria de combate e precisão balística</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
