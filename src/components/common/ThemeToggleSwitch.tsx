import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleSwitchProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({
  className = '',
  size = 'md'
}) => {
  const { isDark, toggleTheme, setTheme } = useTheme();

  const isSmall = size === 'sm';
  const trackWidth = isSmall ? 'w-14 h-7' : 'w-16 h-8';
  const thumbSize = isSmall ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const slideDistance = isSmall ? 28 : 32;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${trackWidth} ${
        isDark
          ? 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-amber-500/40 shadow-inner'
          : 'bg-gradient-to-r from-amber-100 via-amber-200 to-sky-100 border border-amber-300/80 shadow-inner'
      } ${className}`}
      title={isDark ? "Kéo hoặc bấm để chuyển sang Light Mode" : "Kéo hoặc bấm để chuyển sang Dark Mode"}
      aria-label={isDark ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
    >
      {/* BACKGROUND ICONS (SUN ON LEFT, MOON ON RIGHT) */}
      <div className="absolute inset-0 px-1.5 flex items-center justify-between pointer-events-none text-slate-400">
        <Sun className={`${iconSize} transition-opacity duration-200 ${isDark ? 'opacity-30 text-amber-200' : 'opacity-100 text-amber-600 font-bold'}`} />
        <Moon className={`${iconSize} transition-opacity duration-200 ${isDark ? 'opacity-100 text-amber-300 font-bold' : 'opacity-30 text-slate-400'}`} />
      </div>

      {/* SLIDING / DRAGGABLE THUMB KNOB */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: slideDistance }}
        dragElastic={0.05}
        dragSnapToOrigin={false}
        onDragEnd={(_, info) => {
          if (info.offset.x > 10 && !isDark) {
            setTheme('dark');
          } else if (info.offset.x < -10 && isDark) {
            setTheme('light');
          }
        }}
        animate={{ x: isDark ? slideDistance : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`relative z-10 ${thumbSize} rounded-full flex items-center justify-center shadow-md border transition-colors ${
          isDark
            ? 'bg-gradient-to-tr from-indigo-900 to-slate-800 border-amber-300/60 text-amber-300'
            : 'bg-gradient-to-tr from-amber-300 to-amber-400 border-amber-200 text-amber-950'
        }`}
      >
        {isDark ? (
          <Moon className={`${iconSize} fill-amber-300/30`} />
        ) : (
          <Sun className={`${iconSize} fill-amber-950/20`} />
        )}
      </motion.div>
    </button>
  );
};
