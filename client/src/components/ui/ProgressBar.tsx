import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  label?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = 'blue', label, showLabel = false }) => {
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  const colorMap: Record<string, string> = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    green: 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    yellow: 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    red: 'bg-gradient-to-r from-red-400 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600 shadow-[0_0_12px_rgba(139,92,246,0.5)]',
  };

  const bgClass = colorMap[color] || `bg-${color}-500`;

  return (
    <div className="w-full">
      {label && showLabel && (
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase">{label}</span>
          <span className="font-bold text-gray-500 dark:text-gray-400">{Math.round(safeValue)}%</span>
        </div>
      )}
      <div className="progress-track">
        <div 
          className={`progress-fill ${bgClass}`} 
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
};
