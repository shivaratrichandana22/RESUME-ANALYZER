import React from 'react';

interface CircularGaugeProps {
  score: number;
  label: string;
  subLabel?: string;
  size?: number;
  strokeWidth?: number;
  colorScheme?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  label,
  subLabel,
  size = 140,
  strokeWidth = 12,
  colorScheme = 'blue',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Define gradients and colors based on scheme suitable for dark glassmorphism
  const schemes = {
    blue: {
      stroke: 'stroke-blue-500',
      track: 'stroke-white/10',
      text: 'text-blue-400',
      bg: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
    },
    emerald: {
      stroke: 'stroke-emerald-400',
      track: 'stroke-white/10',
      text: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    },
    violet: {
      stroke: 'stroke-violet-400',
      track: 'stroke-white/10',
      text: 'text-violet-400',
      bg: 'from-violet-500/10 to-purple-500/10 border-violet-500/20',
    },
    amber: {
      stroke: 'stroke-amber-400',
      track: 'stroke-white/10',
      text: 'text-amber-400',
      bg: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20',
    },
    rose: {
      stroke: 'stroke-rose-400',
      track: 'stroke-white/10',
      text: 'text-rose-400',
      bg: 'from-rose-500/10 to-pink-500/10 border-rose-500/20',
    },
  };

  const scheme = schemes[colorScheme] || schemes.blue;

  return (
    <div id={`gauge-container-${label.toLowerCase().replace(/\s+/g, '-')}`} className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-white/5 transition-all duration-300 hover:border-white/10">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Decorative Circle */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-tr ${scheme.bg} opacity-60 blur-[3px]`} />

        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Track Circle */}
          <circle
            className={`${scheme.track} transition-all duration-300`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth - 2}
            fill="transparent"
          />
          {/* Animated Value Circle */}
          <circle
            className={`${scheme.stroke} transition-all duration-500 ease-out`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Percentage Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${scheme.text}`}>
            {score}%
          </span>
          {subLabel && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
              {subLabel}
            </span>
          )}
        </div>
      </div>

      <span className="text-sm font-semibold text-slate-200 mt-4 tracking-wide text-center">
        {label}
      </span>
    </div>
  );
};
