import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  size?: "sm" | "md";
}

export function ThemeToggle({ size = "md" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center rounded-full transition-all duration-300 cursor-pointer ${
        size === "sm" ? "w-14 h-7 p-1" : "w-16 h-8 p-1"
      } ${isDark ? "bg-[#789DFC]" : "bg-[#D9E3FC]"}`}
    >
      <span
        className={`inline-flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
          size === "sm" ? "w-5 h-5" : "w-6 h-6"
        } ${isDark ? (size === "sm" ? "translate-x-7" : "translate-x-8") : "translate-x-0"}`}
      >
        {isDark ? (
          <Moon className={`text-[#4475F2] ${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
        ) : (
          <Sun className={`text-[#4475F2] ${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
        )}
      </span>
      <span className={`absolute transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-100"} ${size === "sm" ? "right-1.5" : "right-2"}`}>
        <Moon className={`text-[#4475F2]/60 ${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
      </span>
      <span className={`absolute transition-opacity duration-200 ${isDark ? "opacity-100" : "opacity-0"} ${size === "sm" ? "left-1.5" : "left-2"}`}>
        <Sun className={`text-white/70 ${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
      </span>
    </button>
  );
}
