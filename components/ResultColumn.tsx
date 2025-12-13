import React, { useState } from 'react';
import { Search, Copy, Edit2, Trash2, Check, X, MoreHorizontal, Eraser } from 'lucide-react';

interface ResultColumnProps {
  title: string;
  count: number;
  items: string[];
  variant: 'success' | 'danger';
  emptyMessage: string;
  actionButton?: React.ReactNode;
  onUpdate?: (index: number, value: string) => void;
  onRemove?: (index: number) => void;
  onClear?: () => void;
}

export const ResultColumn: React.FC<ResultColumnProps> = ({
  title,
  count,
  items,
  variant,
  emptyMessage,
  actionButton,
  onUpdate,
  onRemove,
  onClear
}) => {
  const [search, setSearch] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // We need to map original indices to filtered items to handle updates correctly
  const filteredItemsWithIndex = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.toLowerCase().includes(search.toLowerCase()));

  const handleStartEdit = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (index: number) => {
    if (onUpdate && editValue.trim()) {
      onUpdate(index, editValue.trim());
    }
    setEditingIndex(null);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(items.join('\n'));
  };

  const colors = {
    success: {
      header: 'bg-emerald-50 border-emerald-100 text-emerald-900',
      badge: 'bg-emerald-200 text-emerald-800',
      border: 'border-t-4 border-t-emerald-400'
    },
    danger: {
      header: 'bg-rose-50 border-rose-100 text-rose-900',
      badge: 'bg-rose-200 text-rose-800',
      border: 'border-t-4 border-t-rose-400'
    }
  };

  const currentStyle = colors[variant];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] overflow-hidden ${currentStyle.border}`}>
      {/* Header */}
      <div className={`p-4 border-b ${currentStyle.header}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{title}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentStyle.badge}`}>
              {count}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
             {items.length > 0 && (
               <>
                 <button 
                   onClick={handleCopyAll}
                   className="p-1.5 hover:bg-white/50 rounded-md text-inherit opacity-70 hover:opacity-100 transition-all"
                   title="Copy All"
                 >
                   <Copy className="w-4 h-4" />
                 </button>
                 {onClear && (
                   <button 
                     onClick={onClear}
                     className="p-1.5 hover:bg-white/50 rounded-md text-inherit opacity-70 hover:opacity-100 transition-all"
                     title="Clear List"
                   >
                     <Eraser className="w-4 h-4" />
                   </button>
                 )}
               </>
             )}
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input 
            type="text" 
            placeholder="Filter domains..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border-none rounded-lg bg-white/50 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : filteredItemsWithIndex.length === 0 ? (
           <div className="h-full flex items-center justify-center text-slate-400">
            <p className="text-sm">No matches found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItemsWithIndex.map(({ item, index }) => (
              <div 
                key={index} 
                className={`
                  group flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 transition-colors
                  ${editingIndex === index ? 'bg-slate-50 ring-1 ring-slate-200' : ''}
                `}
              >
                {editingIndex === index ? (
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 text-sm font-mono border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(index);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                    />
                    <button onClick={() => handleSaveEdit(index)} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingIndex(null)} className="text-slate-400 hover:bg-slate-200 p-1 rounded"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <>
                    <span className="truncate flex-1 text-slate-600 text-sm font-mono">{item}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigator.clipboard.writeText(item)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-all"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {onUpdate && (
                        <button 
                          onClick={() => handleStartEdit(index, item)}
                          className="p-1 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onRemove && (
                        <button 
                          onClick={() => onRemove(index)}
                          className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Action */}
      {actionButton && items.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {actionButton}
        </div>
      )}
    </div>
  );
};