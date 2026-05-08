import React, { useMemo } from "react";
import { motion } from "motion/react";
import { PlayerStats } from "../../types";
import { Card } from "../ui/Card";
import { Trophy, Target, TrendingUp } from "lucide-react";

interface Props {
  stats: PlayerStats;
  theme: "cartoon" | "kuronami" | "gaia";
}

export default function StatsOverview({ stats, theme }: Props) {
  const getRankBg = () => {
    switch(theme) {
      case 'kuronami': return 'bg-kuronami-primary border-kuronami-accent/30';
      case 'gaia': return 'bg-gaia-nature border-gaia-wood/20';
      default: return 'bg-brand-secondary';
    }
  };

  const getAccentColor = () => {
    switch(theme) {
      case 'kuronami': return 'text-kuronami-accent';
      case 'gaia': return 'text-gaia-leaf';
      default: return 'text-brand-primary';
    }
  };

  const getRankIcon = (rank: string) => {
    if (!rank || rank === "Sem Rank") return "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png";
    const formattedRank = rank.trim().replace(/\s+/g, '_');
    return `/ranks/${formattedRank}_Rank.png`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      {/* CARD DE RANKING */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          theme={theme} 
          className="flex flex-col sm:flex-row items-center gap-8 p-10 h-full relative overflow-hidden group"
        >
          <div className={`w-32 h-32 ${getRankBg()} rounded-[2.5rem] flex items-center justify-center relative shadow-2xl shrink-0 border-4 border-black/10 overflow-hidden group-hover:rotate-3 transition-transform duration-500`}>
             <motion.img 
               initial={{ scale: 0.5, rotate: -20 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
               src={getRankIcon(stats.rank)} 
               alt={stats.rank}
               className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform"
               referrerPolicy="no-referrer"
             />
             {theme === 'kuronami' && (
               <div className="absolute inset-0 bg-kuronami-glow/10 animate-pulse pointer-events-none" />
             )}
          </div>
          
          <div className="flex-grow text-center sm:text-left">
             <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Trophy size={14} className={getAccentColor()} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Classificação Oficial</span>
             </div>
             <h3 className={`text-5xl font-black italic uppercase leading-none tracking-tighter mb-6 ${theme === 'kuronami' ? 'text-kuronami-glow' : ''}`}>
               {stats.rank}
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-black uppercase opacity-60">Progresso de Ranque</span>
                   <span className="text-xs font-black italic tracking-tighter">75/100 RR</span>
                </div>
                <div className={`h-4 w-full ${theme === 'kuronami' ? 'bg-black/40' : 'bg-brand-secondary/10'} rounded-full overflow-hidden border-2 border-black/5`}>
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "75%" }}
                     transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                     className={`h-full ${theme === 'kuronami' ? 'bg-kuronami-accent shadow-[0_0_15px_rgba(0,242,255,0.6)]' : theme === 'gaia' ? 'bg-gaia-leaf' : 'bg-brand-primary'}`} 
                   />
                </div>
             </div>
          </div>
        </Card>
      </motion.div>

      {/* CARD DE ESTATÍSTICAS RÁPIDAS */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          theme={theme} 
          className="grid grid-cols-3 gap-4 h-full !p-10 divide-x-4 divide-brand-secondary/5"
        >
          <StatBox 
            label="Win Rate" 
            value={`${stats.overallWinRate}%`} 
            icon={<TrendingUp size={16} />}
            color={getAccentColor()}
          />
          <StatBox 
            label="Headshot" 
            value={`${stats.overallHs}%`} 
            icon={<Target size={16} />}
            color={theme === 'kuronami' ? 'text-kuronami-glow' : 'text-brand-accent'}
          />
          <StatBox 
            label="K/D Total" 
            value="1.18" 
            icon={<Activity size={16} />}
            color={theme === 'kuronami' ? 'text-white' : 'text-brand-secondary'}
          />
        </Card>
      </motion.div>
    </div>
  );
}

const StatBox = ({ label, value, icon, color }: any) => (
  <div className="flex flex-col items-center justify-center text-center px-2">
    <div className={`mb-4 p-2 rounded-lg bg-black/5 opacity-40 ${color}`}>
       {icon}
    </div>
    <div className="text-[10px] font-black uppercase opacity-60 mb-2 leading-tight tracking-widest">{label}</div>
    <div className={`text-3xl md:text-5xl font-black italic tracking-tighter ${color}`}>{value}</div>
  </div>
);

const Activity = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
