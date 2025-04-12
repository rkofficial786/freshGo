import React from "react";
import { ChevronRight, Loader2 } from "lucide-react";

const EnhancedButton = ({
  onClick,
  title,
  children,
  arrow,
  size = "md",
  loading = false,
  disabled = false,
  theme = "#012970",
  className = "",
  icon: Icon,
  effect = "ripple",
}: any) => {
  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2.5 px-5",
    lg: "text-base py-3.5 px-7",
  };

  const buttonStyle: any = {
    "--theme-color": theme,
    "--theme-color-light": `${theme}33`,
    "--theme-color-dark": `${theme}CC`,
  };

  const effectClasses = {
    ripple: "group-hover:scale-150 group-hover:opacity-0",
    pulse: "animate-pulse",
    glow: "animate-glow",
    shake: "group-hover:animate-shake",
    rotate: "group-hover:rotate-180",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      style={buttonStyle}
      disabled={disabled || loading}
      className={`
        group relative overflow-hidden 
        flex items-center justify-center
        bg-[var(--theme-color)]
        text-white font-semibold
        rounded-md
        transition-all duration-300 ease-in-out
        ${sizeClasses[size]} ${className}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Effect based on the selected effect prop */}
      {effect === "ripple" && (
        <span className={`absolute inset-0 bg-white rounded-full w-full h-full opacity-30 scale-0 transition-all duration-500 ease-out ${effectClasses.ripple}`}></span>
      )}
      
      {effect === "pulse" && (
        <span className={`absolute inset-0 bg-white opacity-0 ${effectClasses.pulse}`}></span>
      )}
      
      {effect === "glow" && (
        <span className={`absolute inset-0 bg-white opacity-0 ${effectClasses.glow}`}></span>
      )}

      {/* Content wrapper */}
      <span className={`relative flex items-center justify-center z-10 ${effect === "shake" ? effectClasses.shake : ''} ${effect === "rotate" ? effectClasses.rotate : ''}`}>
        {loading ? (
          <Loader2
            size={size === "sm" ? 16 : size === "md" ? 20 : 24}
            className="animate-spin mr-2"
          />
        ) : (
          Icon && (
            <Icon
              size={size === "sm" ? 16 : size === "md" ? 20 : 24}
              className="mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-12"
            />
          )
        )}
        <span className="font-bold group-hover:tracking-wider transition-all duration-300 ease-in-out">
          {loading ? "Loading..." : children}
        </span>
      </span>

      {arrow && <ChevronRight className="ml-2" />}
    </button>
  );
};

export default EnhancedButton;