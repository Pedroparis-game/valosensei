import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "cartoon" | "kuronami" | "gaia";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  theme = "cartoon", 
  loading = false, 
  icon,
  className = "", 
  ...props 
}) => {
  const getThemeClass = () => {
    switch (theme) {
      case "kuronami": return "kuronami-button";
      case "gaia": return "gaia-button";
      default: return "cartoon-button";
    }
  };

  return (
    <button 
      className={`${getThemeClass()} flex items-center justify-center gap-3 active:scale-95 transition-all ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : icon}
      <span>{children}</span>
    </button>
  );
};
