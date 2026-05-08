import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme?: "cartoon" | "kuronami" | "gaia";
}

export const Input: React.FC<InputProps> = ({ 
  theme = "cartoon", 
  className = "", 
  ...props 
}) => {
  const getThemeClass = () => {
    switch (theme) {
      case "kuronami": 
        return "kuronami-border !bg-kuronami-secondary text-white placeholder:text-white/40";
      case "gaia": 
        return "gaia-border border-gaia-nature text-brand-secondary bg-white focus:ring-2 ring-gaia-leaf/20";
      default: 
        return "cartoon-card focus:shadow-[12px_12px_0px_0px_rgba(15,25,35,1)] bg-white";
    }
  };

  return (
    <input 
      className={`w-full text-2xl font-black py-8 px-10 outline-none transition-all placeholder:opacity-50 ${getThemeClass()} ${className}`}
      {...props}
    />
  );
};
