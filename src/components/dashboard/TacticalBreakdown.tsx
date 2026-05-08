import React, { useMemo } from "react";
import { motion } from "motion/react";
import { TacticalMetric } from "../../types";
import { Crosshair, Brain, Wallet, MapPin, Zap } from "lucide-react";
import { Card } from "../ui/Card";

interface Props {
  data: {
    mira: TacticalMetric;
    gameSense: TacticalMetric;
    economia: TacticalMetric;
    posicionamento: TacticalMetric;
    utilitarias: TacticalMetric;
  };
  theme: "cartoon" | "kuronami" | "gaia";
}

export default function TacticalBreakdown({ data, theme }: Props) {
  const getAccentText = () => {
    switch(theme) {
      case 'kuronami': return 'text-kuronami-accent';
      case 'gaia': return 'text-gaia-leaf';
      default: return 'text-brand-primary';
    }
  };

  const getProgressColor = () => {
    switch(theme) {
      case 'kuronami': return 'bg-kuronami-accent shadow-[0_0_10px_rgba(0,242,255,0.5)]';
      case 'gaia': return 'bg-gaia-leaf shadow-[0_0_10px_rgba(39,174,96,0.5)]';
      default: return 'bg-brand-primary';
    }
  };

  const metrics = useMemo(() => Object.entries(data), [data]);

  const getIcon = (key: string) => {
    const colorClass = getAccentText();
    switch (key) {
      case 'mira': return <Crosshair size={24} className={colorClass} />;
      case 'gameSense': return <Brain size={24} className={colorClass} />;
      case 'economia': return <Wallet size={24} className={colorClass} />;
      case 'posicionamento': return <MapPin size={24} className={colorClass} />;
      case 'utilitarias': return <Zap size={24} className={colorClass} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {metrics.map(([key, metric], idx) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card 
            theme={theme} 
            className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left !p-5 group relative overflow-hidden gap-5"
          >
            <div className="p-4 rounded-2xl bg-brand-secondary/5 group-hover:bg-brand-secondary/10 transition-colors shrink-0">
              {getIcon(key)}
            </div>
            
            <div className="flex-grow w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                  {metric.label}
                </div>
                <div className={`text-3xl font-black italic tracking-tighter ${getAccentText()}`}>
                  {metric.value}<span className="text-sm opacity-40 ml-1">%</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className={`w-full ${theme === 'kuronami' ? 'bg-black/40' : 'bg-brand-secondary/5'} h-2 rounded-full mb-3 overflow-hidden border border-black/5`}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                  className={`h-full ${getProgressColor()}`}
                />
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                <p className="text-[11px] leading-relaxed opacity-80 font-bold italic flex-grow">
                  "{metric.description}"
                </p>
                <div className={`text-[9px] font-black uppercase px-2 py-1 ${theme === 'kuronami' ? 'bg-kuronami-accent/5 border-kuronami-accent/20' : 'bg-brand-secondary/5 border-brand-secondary/10'} border rounded-lg whitespace-nowrap shrink-0`}>
                  Rank Avg: <span className="opacity-60">{metric.average}%</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
