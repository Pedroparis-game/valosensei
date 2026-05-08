import React from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface LandingPageProps {
  riotId: string;
  setRiotId: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  loading: boolean;
  theme: "cartoon" | "kuronami" | "gaia";
  setTheme: (t: "cartoon" | "kuronami" | "gaia") => void;
  error?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  riotId,
  setRiotId,
  handleSearch,
  loading,
  theme,
  setTheme,
  error
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto text-center py-12 md:py-20"
    >
      <div className="mb-10 inline-block">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
          className="flex gap-2 mb-6 justify-center"
        >
          <span className={`
            ${theme === 'gaia' ? 'bg-gaia-leaf' : theme === 'kuronami' ? 'bg-kuronami-glow' : 'bg-brand-accent'} 
            text-brand-secondary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl animate-pulse border-2 border-black/10
          `}>
            🔥 VERSÃO PRO v1.2
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8"
        >
          <span className="block text-brand-secondary">DOMINE O</span>
          <span className={`
            ${theme === 'kuronami' ? 'text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.6)]' : 'text-brand-primary'} 
            italic bg-white/5 px-4 transform -skew-x-12 inline-block transition-all
          `}>
            CONTRATO
          </span>
          <span className="block text-brand-secondary">DA VITÓRIA.</span>
        </motion.h2>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl font-bold opacity-80 max-w-md mx-auto leading-tight bg-brand-secondary/5 p-6 rounded-2xl border-4 border-dashed border-brand-secondary/10"
        >
          Análise de dados de elite. Treinamento personalizado. <br/>
          <span className="text-brand-primary">O Sensei não aceita desculpas.</span>
        </motion.p>
      </div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onSubmit={handleSearch} 
        className="relative mb-6"
      >
        <Input 
          type="text" 
          placeholder="NOME#TAG (ex: Jett#ASP)"
          value={riotId}
          onChange={(e) => setRiotId(e.target.value)}
          theme={theme}
          className="mb-8"
        />
        <Button 
          type="submit" 
          loading={loading}
          theme={theme}
          icon={<Search size={28} className="group-hover:rotate-12 transition-transform" />}
          className="w-full !py-8 text-2xl !italic"
        >
          Analisar Protocolos
        </Button>

        <div className="flex flex-wrap gap-4 mt-12 justify-center">
          <ThemeButton 
            active={theme === 'kuronami'} 
            onClick={() => setTheme('kuronami')}
            label="⚡ KURONAMI"
            theme="kuronami"
          />
          <ThemeButton 
            active={theme === 'gaia'} 
            onClick={() => setTheme('gaia')}
            label="🌿 GAIA"
            theme="gaia"
          />
          <ThemeButton 
            active={theme === 'cartoon'} 
            onClick={() => setTheme('cartoon')}
            label="🎯 CLASSIC"
            theme="cartoon"
          />
        </div>
      </motion.form>
    
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-primary/10 text-brand-primary p-6 border-4 border-brand-primary font-black uppercase rounded-2xl shadow-xl mt-8"
        >
          ⚠️ Erro de Sincronia: {error}
        </motion.div>
      )}
    </motion.div>
  );
};

const ThemeButton = ({ active, onClick, label, theme }: any) => {
  const getStyles = () => {
    if (!active) return "bg-white border-brand-secondary text-brand-secondary opacity-60 grayscale hover:grayscale-0 hover:opacity-100";
    if (theme === 'kuronami') return "bg-kuronami-accent border-kuronami-primary text-kuronami-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
    if (theme === 'gaia') return "bg-gaia-leaf border-gaia-wood text-white shadow-[4px_4px_0px_0px_rgba(75,54,33,1)]";
    return "bg-brand-primary border-brand-secondary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  };

  return (
    <button 
      type="button"
      onClick={onClick}
      className={`text-[11px] font-black uppercase px-6 py-3 rounded-xl border-4 transition-all active:scale-90 ${getStyles()}`}
    >
      {label}
    </button>
  );
};
