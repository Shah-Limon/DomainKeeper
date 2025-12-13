import React from 'react';
import { X, Cloud, Save, RefreshCw } from 'lucide-react';
import { DomainList } from './DomainList';
import { Domain } from '../types';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: Domain[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, newUrl: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  hasUnsavedChanges: boolean;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  domains,
  onRemove,
  onUpdate,
  onSync,
  isSyncing,
  hasUnsavedChanges
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              Total Database
            </h2>
            <p className="text-slate-400 text-sm mt-1">Manage all stored unique domains</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-50">
          <DomainList domains={domains} onRemove={onRemove} onUpdate={onUpdate} />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center">
          <div className="text-sm text-slate-500">
             {domains.length.toLocaleString()} total records
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onSync}
              disabled={isSyncing || !hasUnsavedChanges}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all
                ${isSyncing || !hasUnsavedChanges
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'}
              `}
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {hasUnsavedChanges ? 'Save Changes' : 'All Synced'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};