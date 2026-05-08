import { motion } from "motion/react";
import { Leaf, Droplets, Sword } from "lucide-react";

type Theme = "cartoon" | "kuronami" | "gaia";

export const ThemeBackground = ({ theme }: { theme: Theme }) => {
  if (theme === "cartoon") return null;

  return (
    <div className="theme-bg-container">
      {theme === "kuronami" && (
        <>
          <div className="kuronami-thunder" />
          <div className="absolute inset-0 bg-gradient-to-b from-kuronami-secondary/50 via-transparent to-black" />
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="kuronami-rain"
              style={{
                left: Math.random() * 110 - 5 + "%",
                top: Math.random() * -100 + "%",
                animationDuration: Math.random() * 0.8 + 0.3 + "s",
                animationDelay: Math.random() * 2 + "s",
                opacity: Math.random() * 0.4 + 0.2,
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] kuronami-orb" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] kuronami-orb" style={{ animationDelay: '-1s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] kuronami-orb" style={{ animationDelay: '-3s' }} />
        </>
      )}
      {theme === "gaia" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-gaia-leaf/5 to-gaia-wood/10" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                top: -50, 
                left: Math.random() * 100 + "%",
                opacity: 0,
                rotate: Math.random() * 360
              }}
              animate={{ 
                top: "110%",
                left: (Math.random() * 110 - 5) + "%",
                opacity: [0, 0.6, 0.6, 0],
                rotate: 720
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 15
              }}
              style={{ zIndex: -1 }}
            >
              <div style={{ animation: `swing ${Math.random() * 3 + 2}s infinite ease-in-out` }}>
                <Leaf 
                  size={Math.random() * 24 + 12} 
                  className={i % 2 === 0 ? "text-gaia-leaf" : "text-gaia-nature"} 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(46, 204, 113, 0.4))' }}
                />
              </div>
            </motion.div>
          ))}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gaia-leaf/20 to-transparent" />
        </>
      )}
    </div>
  );
};
