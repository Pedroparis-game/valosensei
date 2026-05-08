import { motion } from "motion/react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";
import { AnalysisResult } from "../../types";

interface Props {
  analysis: AnalysisResult;
  theme: string;
}

export default function PerformanceRadar({ analysis, theme }: Props) {
  const data = [
    { subject: 'Mira', A: analysis.tacticalBreakdown.mira.value, fullMark: 100 },
    { subject: 'Noção', A: analysis.tacticalBreakdown.gameSense.value, fullMark: 100 },
    { subject: 'Eco', A: analysis.tacticalBreakdown.economia.value, fullMark: 100 },
    { subject: 'Posicion.', A: analysis.tacticalBreakdown.posicionamento.value, fullMark: 100 },
    { subject: 'Utilities', A: analysis.tacticalBreakdown.utilitarias.value, fullMark: 100 },
  ];

  const getColor = () => {
    switch(theme) {
      case 'kuronami': return '#00f2ff';
      case 'gaia': return '#27ae60';
      default: return '#ff4655';
    }
  };

  const getThemeClass = () => {
    switch(theme) {
      case 'kuronami': return 'kuronami-border';
      case 'gaia': return 'gaia-border';
      default: return 'cartoon-card';
    }
  };

  const getAccentText = () => {
    switch(theme) {
      case 'kuronami': return 'text-kuronami-accent';
      case 'gaia': return 'text-gaia-leaf';
      default: return 'text-brand-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`${getThemeClass()} p-10 flex flex-col items-center justify-center h-full min-h-[450px]`}
    >
      <h3 className={`text-2xl font-black uppercase italic mb-8 w-full text-left border-l-8 ${theme === 'kuronami' ? 'border-kuronami-accent' : 'border-brand-primary'} pl-4`}>
        Equilíbrio Tático
      </h3>
      
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke={theme === 'kuronami' ? '#00f2ff40' : '#0f192340'} strokeWidth={2} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: theme === 'kuronami' ? '#00f2ff' : '#0f1923', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Player"
              dataKey="A"
              stroke={getColor()}
              strokeWidth={4}
              fill={getColor()}
              fillOpacity={0.6}
              animationBegin={500}
              animationDuration={2000}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 w-full">
        <div className={`text-center p-4 ${theme === 'kuronami' ? 'bg-black/40 border-kuronami-accent/20' : 'bg-brand-secondary/5 border-brand-secondary/10'} rounded-xl border-2`}>
           <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Impact Score</div>
           <div className={`text-3xl font-black ${getAccentText()}`}>{analysis.overallScore}</div>
        </div>
        <div className={`text-center p-4 ${theme === 'kuronami' ? 'bg-black/40 border-kuronami-accent/20' : 'bg-brand-secondary/5 border-brand-secondary/10'} rounded-xl border-2`}>
           <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Estilo</div>
           <div className={`text-3xl font-black ${theme === 'kuronami' ? 'text-kuronami-glow' : theme === 'gaia' ? 'text-gaia-nature' : 'text-brand-accent'}`}>PRO</div>
        </div>
      </div>
    </motion.div>
  );
}
