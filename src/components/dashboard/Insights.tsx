import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, CheckCircle2, ShieldAlert, Quote, Target, TrendingUp, AlertTriangle, Brain, Activity } from "lucide-react";
import { AnalysisResult } from "../../types";
import TacticalBreakdown from "./TacticalBreakdown";
import MapMastery from "./MapMastery";
import TrainingSession from "./TrainingSession";
import PerformanceRadar from "./PerformanceRadar";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface InsightsProps {
  analysis: AnalysisResult;
  theme: "cartoon" | "kuronami" | "gaia";
}

const categoryIcons: Record<string, any> = {
  mira: Target,
  posicionamento: ShieldAlert,
  economia: Zap,
  utilitarias: TrendingUp,
};

export default function Insights({ analysis, theme }: InsightsProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);

  const getAccentText = () => {
    switch (theme) {
      case "kuronami": return "text-kuronami-accent";
      case "gaia": return "text-gaia-leaf";
      default: return "text-brand-primary";
    }
  };

  const prioritizedInsights = useMemo(() => {
    return [...analysis.insights].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
    });
  }, [analysis.insights]);

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return theme === 'kuronami' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-brand-primary text-white shadow-sm';
    return theme === 'kuronami' ? 'bg-kuronami-accent/20 text-kuronami-accent border-kuronami-accent/30' : 'bg-brand-secondary text-white';
  };

  return (
    <div className="space-y-24 py-12 pb-32">
      <AnimatePresence>
        {isSessionActive && (
          <TrainingSession 
            plan={analysis.trainingPlan} 
            onClose={() => setIsSessionActive(false)} 
          />
        )}
      </AnimatePresence>

      {/* SEÇÃO 1: VEREDITO DO SENSEI (O CORAÇÃO DO DOSSIÊ) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Activity className={getAccentText()} size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Relatório de Inteligência Tática</span>
          <div className="flex-grow h-[2px] bg-brand-secondary/10" />
        </div>
        
        <Card theme={theme} className="!p-12 md:!p-16 relative overflow-hidden bg-brand-secondary text-white !border-brand-primary border-4 shadow-[12px_12px_0px_0px_rgba(255,70,85,0.3)]">
          <Quote className={`absolute top-6 left-6 ${theme === 'kuronami' ? 'text-kuronami-accent/5' : 'text-white/5'}`} size={120} />
          <div className="relative z-10 flex flex-col items-center text-center">
             <div className={`mb-8 p-4 rounded-3xl ${theme === 'kuronami' ? 'bg-kuronami-accent/10' : 'bg-brand-primary/10'} rotate-3 border-2 border-dashed border-white/20`}>
                <Brain size={48} className={theme === 'kuronami' ? 'text-kuronami-accent' : 'text-brand-primary'} />
             </div>
             <h3 className={`text-4xl font-black uppercase italic mb-8 tracking-tighter ${theme === 'kuronami' ? 'text-kuronami-glow' : 'text-white'}`}>Diagnóstico do Sensei</h3>
             <p className="text-xl md:text-3xl font-black italic leading-tight text-white mb-10 max-w-4xl tracking-tight">
               "{analysis.coachVerdict}"
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 border-t-2 border-white/10 pt-8 w-full">
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Impact Score</div>
                   <div className={`text-3xl font-black ${getAccentText()}`}>{analysis.overallScore}<span className="text-sm opacity-50">/100</span></div>
                </div>
                <div className="w-[2px] h-10 bg-white/10 hidden md:block" />
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Foco Estimado</div>
                   <div className="text-xl font-black uppercase tracking-tight">{analysis.trainingPlan.duration}</div>
                </div>
                <div className="w-[2px] h-10 bg-white/10 hidden md:block" />
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Status de Vôo</div>
                   <div className="text-xl font-black uppercase tracking-tight text-brand-accent">RADIANCE READY</div>
                </div>
             </div>
          </div>
        </Card>
      </motion.section>

      {/* SEÇÃO 2: MÉTRICAS DE COMBATE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card theme={theme} className="!p-10 flex flex-col items-center justify-center">
           <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-10 opacity-40 border-b-2 border-brand-primary/10 pb-2 w-full text-center">Eficácia em Campo</h4>
           <div className="w-full">
              <PerformanceRadar analysis={analysis} theme={theme} />
           </div>
        </Card>
        
        <Card theme={theme} className="!p-10">
           <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-8 opacity-40 border-b-2 border-brand-primary/10 pb-2 w-full text-center">Competências Específicas</h4>
           <TacticalBreakdown data={analysis.tacticalBreakdown} theme={theme} />
        </Card>
      </section>

      {/* SEÇÃO 3: MAPAS & TERRITÓRIO */}
      <section>
        <MapMastery maps={analysis.mapMastery} theme={theme} />
      </section>

      {/* SEÇÃO 4: INSIGHTS & CORREÇÕES */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <AlertTriangle className={getAccentText()} size={28} />
          <h3 className="text-3xl font-black uppercase italic tracking-tighter">Vulnerabilidades Identificadas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prioritizedInsights.map((insight, idx) => {
            const Icon = categoryIcons[insight.category] || Zap;
             return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Card theme={theme} className="h-full flex flex-col !p-8 border-l-[16px] border-l-brand-primary group/insight">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex items-center gap-3 font-black uppercase text-xs tracking-widest ${getAccentText()}`}>
                      <Icon size={20} /> {insight.category}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase border-2 border-black/10 transition-transform group-hover/insight:-translate-y-1 ${getPriorityColor(insight.priority)}`}>
                      {insight.priority} PRIORIDADE
                    </div>
                  </div>
                  <h4 className="font-black text-2xl mb-4 uppercase italic tracking-tighter leading-tight drop-shadow-sm">{insight.title}</h4>
                  <p className="text-sm font-medium opacity-80 leading-relaxed mb-8 flex-grow">{insight.description}</p>
                  
                  <div className={`p-5 rounded-2xl border-4 border-dashed flex items-start gap-4 ${
                    theme === 'kuronami' ? 'bg-kuronami-accent/10 border-kuronami-accent/20' : 'bg-brand-primary/5 border-brand-primary/20'
                  }`}>
                    <Zap size={20} className={`mt-1 shrink-0 ${getAccentText()}`} />
                    <div>
                      <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Protocolo de Ajuste</div>
                      <span className="text-sm font-black uppercase italic tracking-tight leading-tight block">{insight.actionableStep}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO 5: PLANO DE TREINO FINAL */}
      <section className="max-w-5xl mx-auto">
        <Card theme={theme} className={`!p-0 border-8 overflow-hidden ${theme === 'kuronami' ? 'border-kuronami-accent' : 'border-brand-primary'} shadow-[16px_16px_0px_0px_rgba(255,70,85,0.2)]`}>
           <div className="bg-[#0f1923] p-12 md:p-16 border-b-8 border-white/5">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-2 bg-brand-primary animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-[0.5em] text-brand-primary opacity-80">Ordem de Operações</span>
                   </div>
                   <h4 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-white drop-shadow-md">{analysis.trainingPlan.title}</h4>
                   <div className="flex flex-wrap gap-8 items-center mt-6">
                      <div className="flex items-center gap-3 text-white">
                         <TrendingUp className="text-brand-accent" size={24} />
                         <span className="text-sm font-black uppercase tracking-widest">Tempo de Execução: {analysis.trainingPlan.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                         <CheckCircle2 className="text-brand-accent" size={24} />
                         <span className="text-sm font-black uppercase tracking-widest">{analysis.trainingPlan.exercises.length} Sequências</span>
                      </div>
                   </div>
                </div>
                <div className="bg-brand-primary text-white px-10 py-6 rounded-2xl border-4 border-black/30 text-2xl font-black uppercase italic tracking-widest shadow-2xl shrink-0 rotate-1">
                   ATIVAR PROTOCOLO
                </div>
             </div>
           </div>
           
           <div className="p-10 md:p-16 bg-white space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
               {analysis.trainingPlan.exercises.map((ex, idx) => (
                 <motion.div 
                   key={idx}
                   whileHover={{ x: 10 }}
                   className="flex gap-8 group"
                 >
                   <div className={`w-20 h-20 shrink-0 ${theme === 'kuronami' ? 'bg-kuronami-accent text-kuronami-primary' : theme === 'gaia' ? 'bg-gaia-leaf text-white' : 'bg-brand-primary text-white'} rounded-3xl flex items-center justify-center font-black text-4xl border-4 border-black/20 group-hover:rotate-12 transition-all shadow-2xl italic`}>
                     {idx + 1}
                   </div>
                   <div>
                     <div className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${getAccentText()}`}>
                       {ex.mode} <span className="opacity-30">|</span> {ex.sets}
                     </div>
                     <div className="text-3xl font-black leading-none mb-3 uppercase tracking-tighter italic">{ex.name}</div>
                     <div className="text-sm opacity-70 font-bold uppercase tracking-widest border-l-4 border-brand-secondary/10 pl-3 leading-relaxed">Foco: {ex.focus}</div>
                   </div>
                 </motion.div>
               ))}
             </div>
             
             <Button 
                onClick={() => setIsSessionActive(true)}
                theme={theme}
                className="w-full !py-10 text-4xl !italic !border-8 !shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
             >
                INICIAR TREINAMENTO AGORA
             </Button>
           </div>
        </Card>
      </section>
    </div>
  );
}
