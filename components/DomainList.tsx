import React, { useState } from 'react';
import { Globe, Trash2, Search, ExternalLink, Edit2, Check, X } from 'lucide-react';
import { Domain } from '../types';

interface DomainListProps {
  domains: Domain[];
  onRemove: (id: string) => void;
  onUpdate?: (id: string, newUrl: string) => void;
}

export const DomainList: React.FC<DomainListProps> = ({ domains, onRemove, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredDomains = domains.filter(d => d.url.toLowerCase().includes(search.toLowerCase()));

  const handleStartEdit = (domain: Domain) => {
    setEditingId(domain.id);
    setEditValue(domain.url);
  };

  const handleSaveEdit = (id: string) => {
    if (onUpdate && editValue.trim()) onUpdate(id, editValue.trim());
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search database..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white" />
        </div>
      </div>
      <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
        {domains.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center"><Globe className="w-12 h-12 mb-3 opacity-20" /><p className="text-sm">Database is empty.</p></div>
        ) : filteredDomains.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-400"><p className="text-sm">No matches found for "{search}"</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDomains.map((domain, index) => (
              <div key={domain.id} className={`group flex items-center justify-between p-3 hover:bg-slate-50 transition-colors ${editingId === domain.id ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-slate-300 w-8 text-right select-none">{(index + 1).toLocaleString()}</span>
                  {editingId === domain.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 text-sm font-medium text-slate-700 border border-slate-300 rounded px-2 py-1 outline-none focus:border-accent" onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(domain.id); if (e.key === 'Escape') setEditingId(null); }} />
                    </div>
                  ) : (
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-700 truncate">{domain.url}</span>
                      <span className="text-[10px] text-slate-400 truncate">{new Date(domain.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === domain.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(domain.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded-md" title="Save"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-md" title="Cancel"><X className="w-3.5 h-3.5" /></button>
                    </>
                  ) : (
                    <>
                      <a href={`https://${domain.url}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Visit"><ExternalLink className="w-3.5 h-3.5" /></a>
                      {onUpdate && <button onClick={() => handleStartEdit(domain)} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>}
                      <button onClick={() => onRemove(domain.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};