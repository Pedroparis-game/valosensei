import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: "cartoon" | "kuronami" | "gaia";
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  theme = "cartoon", 
  hover = true, 
  className = "", 
  ...props 
}) => {
  const getThemeClass = () => {
    switch (theme) {
      case "kuronami": return "kuronami-border";
      case "gaia": return "gaia-border";
      default: return hover ? "cartoon-card" : "p-6 rounded-2xl border-4 border-brand-secondary bg-white";
    }
  };

  return (
    <div 
      className={`${getThemeClass()} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
