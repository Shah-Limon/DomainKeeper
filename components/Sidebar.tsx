import React from 'react';
import { LayoutDashboard, Database, Cloud, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium text-sm ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`;

  return (
    <div className="w-64 bg-white min-h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-slate-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="p-6 flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg"><Cloud className="w-5 h-5" /></div>
        <h1 className="text-slate-800 font-bold text-xl tracking-tight">Cloud Domain</h1>
      </div>
      <nav className="flex-1 px-4 space-y-1.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-2">Overview</div>
        <NavLink to="/" className={linkClass}><LayoutDashboard className="w-5 h-5" /><span>Dashboard</span></NavLink>
        <NavLink to="/domains" className={linkClass}><Database className="w-5 h-5" /><span>File Manager</span></NavLink>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-6">Settings</div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors text-sm font-medium"><Settings className="w-5 h-5" /><span>Configuration</span></button>
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">JD</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-700 truncate">John Doe</p><p className="text-xs text-slate-400 truncate">Admin</p></div>
          <LogOut className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};