import { motion } from "motion/react";
import { MapPerformance } from "../../types";

interface Props {
  maps: MapPerformance[];
  theme: string;
}

export default function MapMastery({ maps, theme }: Props) {
  const getThemeClass = () => {
    switch(theme) {
      case 'kuronami': return 'kuronami-border';
      case 'gaia': return 'gaia-border';
      default: return 'cartoon-card';
    }
  };

  const getHeaderBg = () => {
    switch(theme) {
      case 'kuronami': return 'bg-kuronami-primary';
      case 'gaia': return 'bg-gaia-wood';
      default: return 'bg-brand-secondary';
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
    <div className="mt-12">
      <h3 className={`text-2xl font-black uppercase italic border-l-8 ${theme === 'kuronami' ? 'border-kuronami-accent' : theme === 'gaia' ? 'border-gaia-leaf' : 'border-brand-primary'} pl-4 mb-6`}>
        Domínio de Mapas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {maps.map((m, idx) => (
          <motion.div
            key={m.mapName}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 150 }}
            className={`${getThemeClass()} overflow-hidden group p-0 cursor-default`}
          >
            <div className={`${getHeaderBg()} h-24 flex items-center justify-center overflow-hidden relative border-b-4 border-black/10`}>
               <motion.div 
                 animate={{ rotate: [12, 15, 12], scale: [1.8, 2, 1.8] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="text-white/5 text-5xl font-black uppercase tracking-tighter absolute"
               >
                 {m.mapName}
               </motion.div>
               <div className={`relative text-white font-black text-2xl uppercase tracking-widest group-hover:scale-110 transition-all duration-300 drop-shadow-lg ${theme === 'kuronami' ? 'group-hover:text-kuronami-accent' : theme === 'gaia' ? 'group-hover:text-gaia-nature' : 'group-hover:text-brand-accent'}`}>
                 {m.mapName}
               </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Win Rate</span>
                <div className={`text-2xl font-black italic ${getAccentText()}`}>
                  {m.winRate}<span className="text-sm opacity-40">%</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase opacity-60 mb-2">Melhor Agente</div>
                  <div className={`${theme === 'kuronami' ? 'bg-kuronami-accent/10 border-kuronami-accent/20 text-kuronami-accent' : theme === 'gaia' ? 'bg-gaia-leaf/10 border-gaia-leaf/20 text-gaia-leaf' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'} p-3 rounded-lg border-2 font-black uppercase italic text-center text-xs tracking-widest`}>
                    {m.bestAgent}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${theme === 'kuronami' ? 'bg-black/20' : 'bg-brand-secondary/5'}`}>
                  <div className="text-[10px] font-black uppercase opacity-60 mb-1">Tendência Tática</div>
                  <p className="text-[11px] italic leading-relaxed opacity-80 font-medium">{m.tendency}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
