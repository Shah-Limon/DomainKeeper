import React from 'react';
import { PieChart, Clock, CheckCircle2, BarChart3 } from 'lucide-react';
import { Domain } from '../types';

interface VisualAnalyticsProps {
  domains: Domain[];
}

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({ domains }) => {
  const total = domains.length;
  const copied = domains.filter(d => d.status === 'copied').length;
  const pending = domains.filter(d => d.status === 'pending').length;
  const copiedPercent = total > 0 ? Math.round((copied / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between overflow-hidden relative">
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50" />
        <div className="z-10">
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-slate-400" />
            Overview
          </h3>
          <p className="text-sm text-slate-500 mb-6">Action status</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-slate-600">Copied</span>
              <span className="text-sm font-bold text-slate-900 ml-auto">{copied.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-slate-200"></span>
              <span className="text-sm font-medium text-slate-600">Pending</span>
              <span className="text-sm font-bold text-slate-900 ml-auto">{pending.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
            <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (copiedPercent / 100) * 226} strokeLinecap="round" className="text-blue-500 transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
             <span className="text-sm font-bold">{copiedPercent}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-400" />
          Weekly Volume
        </h3>
        <div className="flex items-end justify-between h-32 pt-4">
          {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
              <div className="w-8 bg-slate-100 rounded-t-md relative overflow-hidden h-full group-hover:bg-slate-200 transition-colors">
                 <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-500" style={{ height: `${h}%` }} />
              </div>
              <span className="text-xs text-slate-400 font-medium">{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 className="w-24 h-24 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Activity
        </h3>
        <div className="grid grid-cols-3 gap-4 h-32 items-end">
          <div className="flex flex-col items-center gap-2">
             <div className="w-full bg-slate-100 rounded-t-lg h-16 relative overflow-hidden group">
                <div className="absolute bottom-0 w-full bg-slate-300 h-[40%] group-hover:bg-slate-400 transition-colors"></div>
             </div>
             <span className="text-xs font-medium text-slate-400">2d Ago</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-full bg-slate-100 rounded-t-lg h-20 relative overflow-hidden group">
                <div className="absolute bottom-0 w-full bg-slate-300 h-[60%] group-hover:bg-slate-400 transition-colors"></div>
             </div>
             <span className="text-xs font-medium text-slate-400">Yest.</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-full bg-blue-50 rounded-t-lg h-full relative overflow-hidden group">
                <div className="absolute bottom-0 w-full bg-blue-500 h-[85%] group-hover:bg-blue-600 transition-colors"></div>
             </div>
             <span className="text-xs font-bold text-blue-600">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};