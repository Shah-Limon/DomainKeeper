import React, { useState } from 'react';
import { Search, Copy, Edit2, Trash2, Check, X, Filter, ClipboardCheck, Clock } from 'lucide-react';
import { Domain } from '../types';

interface DomainTableProps {
  domains: Domain[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, newUrl: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'copied') => void;
}

export const DomainTable: React.FC<DomainTableProps> = ({ 
  domains, 
  onRemove, 
  onUpdate,
  onStatusChange 
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'copied'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredDomains = domains.filter(d => {
    const matchesSearch = d.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartEdit = (domain: Domain) => {
    setEditingId(domain.id);
    setEditValue(domain.url);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdate(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleCopy = (domain: Domain) => {
    navigator.clipboard.writeText(domain.url);
    onStatusChange(domain.id, 'copied');
  };

  const handleCopyAllFiltered = () => {
    const text = filteredDomains.map(d => d.url).join('\n');
    navigator.clipboard.writeText(text);
    
    // Optional: Mark all as copied?
    // filteredDomains.forEach(d => onStatusChange(d.id, 'copied'));
    // For now, let's just copy without bulk status change unless requested, 
    // to avoid accidental mass updates.
    alert(`Copied ${filteredDomains.length} domains to clipboard`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col mt-8">
      {/* Table Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800 text-lg">All Domains</h2>
          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {filteredDomains.length} / {domains.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search domains..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-slate-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white appearance-none cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="copied">Copied</option>
            </select>
          </div>

          {/* Bulk Action */}
          <button
            onClick={handleCopyAllFiltered}
            disabled={filteredDomains.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            Copy List
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-medium">
              <th className="px-6 py-4 w-16 text-center">#</th>
              <th className="px-6 py-4">Domain Name</th>
              <th className="px-6 py-4 w-40">Status</th>
              <th className="px-6 py-4 w-48">Date Added</th>
              <th className="px-6 py-4 w-48 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDomains.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No domains found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredDomains.map((domain, index) => (
                <tr key={domain.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-center text-xs font-mono text-slate-300 select-none">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === domain.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full max-w-sm text-sm font-mono border border-slate-300 rounded px-2 py-1 outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(domain.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button onClick={() => handleSaveEdit(domain.id)} className="text-emerald-600 hover:bg-emerald-100 p-1.5 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-200 p-1.5 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-700 font-mono">{domain.url}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {domain.status === 'copied' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        Copied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(domain.createdAt).toLocaleDateString()} <span className="text-xs opacity-50">{new Date(domain.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleCopy(domain)}
                        className={`p-1.5 rounded-md transition-colors ${domain.status === 'copied' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStartEdit(domain)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit Domain"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onRemove(domain.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};