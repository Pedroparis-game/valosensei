import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, ChevronRight, Timer, Trophy } from "lucide-react";
import { AnalysisResult } from "../../types";

interface Props {
  plan: AnalysisResult["trainingPlan"];
  onClose: () => void;
}

export default function TrainingSession({ plan, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const exercises = plan.exercises;
  const currentExercise = exercises[currentStep];

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleNext = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeLeft(0);
      setIsActive(false);
    } else {
      setIsFinished(true);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimeLeft(300); // 5 minutes default for exercise
    setIsActive(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-brand-secondary/95 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="max-w-xl w-full">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="cartoon-card bg-white border-brand-primary p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(15,25,35,0.1)]"
            >
              <div className="flex justify-between items-center mb-10 bg-brand-secondary/5 p-6 rounded-2xl border-2 border-black/10">
                <span className="text-sm font-black uppercase tracking-[0.2em] bg-brand-primary text-white px-4 py-2 rounded-xl shadow-lg">
                  Protocolo {currentStep + 1} / {exercises.length}
                </span>
                <div className="flex items-center gap-4 font-mono font-black text-3xl text-brand-secondary">
                  <Timer size={32} className={isActive ? "text-brand-primary animate-pulse" : "text-brand-secondary/30"} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              <h2 className="text-6xl font-black uppercase italic mb-4 leading-none text-brand-secondary tracking-tighter drop-shadow-sm">{currentExercise.name}</h2>
              <div className="text-brand-primary font-black uppercase tracking-[0.3em] text-lg mb-10 flex items-center gap-3">
                 <span className="w-3 h-3 bg-brand-primary rounded-full animate-pulse" />
                 {currentExercise.mode} <span className="opacity-20">|</span> {currentExercise.sets}
              </div>
              
              <div className="bg-brand-secondary/5 p-10 rounded-3xl border-4 border-dashed border-brand-secondary/20 mb-10">
                <div className="text-xs font-black uppercase opacity-60 mb-4 tracking-[0.2em] text-brand-secondary">Objetivo do Sensei</div>
                <p className="text-3xl font-black leading-tight text-brand-secondary italic">"{currentExercise.focus}"</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={startTimer}
                  disabled={isActive}
                  className="py-6 rounded-2xl border-4 border-brand-secondary text-brand-secondary font-black uppercase italic text-2xl hover:bg-brand-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
                >
                  {isActive ? "EM FOCO" : "INICIAR"}
                </button>
                <button 
                  onClick={handleNext}
                  className="py-6 rounded-2xl bg-brand-primary text-white font-black uppercase italic text-2xl border-4 border-brand-primary hover:bg-brand-accent hover:border-brand-accent hover:text-brand-secondary transition-all flex items-center justify-center gap-3 group shadow-lg active:scale-95"
                >
                  {currentStep === exercises.length - 1 ? "FINALIZAR" : "PRÓXIMO"}
                  <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="cartoon-card bg-brand-accent text-brand-secondary text-center py-12"
            >
              <Trophy size={80} className="mx-auto mb-6 text-brand-secondary" />
              <h2 className="text-5xl font-black uppercase italic mb-4">Protocolo Concluído!</h2>
              <p className="text-lg font-bold mb-10 opacity-80 select-none">
                Excelente trabalho, agente. Seu foco hoje foi excepcional. Repita este protocolo diariamente para alcançar o Radiante.
              </p>
              <button 
                onClick={onClose}
                className="w-full py-5 bg-brand-secondary text-white font-black uppercase italic text-xl border-4 border-brand-secondary hover:scale-105 transition-transform"
              >
                Voltar para o Painel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Dots */}
        {!isFinished && (
          <div className="flex justify-center gap-3 mt-8">
            {exercises.map((_, i) => (
              <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === currentStep ? "w-12 bg-brand-primary" : i < currentStep ? "w-4 bg-brand-accent" : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
