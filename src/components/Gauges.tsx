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

  // Define gradients and colors based on scheme
  const schemes = {
    blue: {
      stroke: 'stroke-blue-600',
      track: 'stroke-blue-100',
      text: 'text-blue-600',
      bg: 'from-blue-50 to-indigo-50',
    },
    emerald: {
      stroke: 'stroke-emerald-500',
      track: 'stroke-emerald-100',
      text: 'text-emerald-600',
      bg: 'from-emerald-50 to-teal-50',
    },
    violet: {
      stroke: 'stroke-violet-500',
      track: 'stroke-violet-100',
      text: 'text-violet-600',
      bg: 'from-violet-50 to-purple-50',
    },
    amber: {
      stroke: 'stroke-amber-500',
      track: 'stroke-amber-100',
      text: 'text-amber-600',
      bg: 'from-amber-50 to-yellow-50',
    },
    rose: {
      stroke: 'stroke-rose-500',
      track: 'stroke-rose-100',
      text: 'text-rose-600',
      bg: 'from-rose-50 to-pink-50',
    },
  };

  const scheme = schemes[colorScheme] || schemes.blue;

  return (
    <div id={`gauge-container-${label.toLowerCase().replace(/\s+/g, '-')}`} className="flex flex-col items-center justify-center p-6 bg-white/75 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Decorative Circle */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-tr ${scheme.bg} opacity-50 blur-[2px]`} />

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

      <span className="text-sm font-semibold text-slate-700 mt-4 tracking-wide text-center">
        {label}
      </span>
    </div>
  );
};
