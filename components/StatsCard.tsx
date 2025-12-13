import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'danger';
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant,
  onClick
}) => {
  const styles = {
    primary: 'bg-slate-900 text-white',
    success: 'bg-emerald-50 text-emerald-900 border border-emerald-100',
    danger: 'bg-rose-50 text-rose-900 border border-rose-100',
  };

  const iconStyles = {
    primary: 'bg-slate-800 text-slate-200',
    success: 'bg-emerald-100 text-emerald-600',
    danger: 'bg-rose-100 text-rose-500',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        rounded-xl p-6 relative overflow-hidden transition-all
        ${styles[variant]}
        ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {onClick && (
          <div className="text-white/50 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold mb-1 tracking-tight">
          {value.toLocaleString()}
        </h3>
        <p className={`text-sm font-medium opacity-90 mb-1`}>{title}</p>
        <p className={`text-xs opacity-60`}>{subtitle}</p>
      </div>
    </div>
  );
};