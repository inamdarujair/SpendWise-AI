import React from 'react';
import { Card, CardContent } from './Card';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  // Map simple colors to Tailwind/custom hex for gradients
  const colorMap: Record<string, { from: string, to: string, text: string, bg: string }> = {
    green: { from: '#10b981', to: '#059669', text: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    blue: { from: '#3b82f6', to: '#2563eb', text: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    red: { from: '#ef4444', to: '#dc2626', text: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
    purple: { from: '#8b5cf6', to: '#7c3aed', text: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    orange: { from: '#f59e0b', to: '#d97706', text: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="stat-card gradient-border-card group">
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} shadow-sm backdrop-blur-md`}>
              {icon}
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend.positive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={trend.positive ? "" : "rotate-180"}>
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase mb-1">{title}</p>
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            >
              {value}
            </motion.h4>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">{subtitle}</p>}
          </div>

          {/* Decorative Background Gradient */}
          <div 
            className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
            style={{ background: `linear-gradient(135deg, ${scheme.from}, ${scheme.to})` }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
