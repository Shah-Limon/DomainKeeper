import React, { useState } from 'react';
import { Search, Upload, RefreshCw } from 'lucide-react';

interface InputAreaProps {
  onAnalyze: (text: string) => void;
  isProcessing: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleAnalyze = () => {
    if (!input.trim()) return;
    onAnalyze(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] border-t-4 border-t-slate-500">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Input Domains</h3>
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors border border-slate-200 hover:border-slate-300 rounded px-2 py-1">
            <Upload className="w-3 h-3" />
            Import
          </button>
        </div>
        <div className="mt-3 relative">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             disabled 
             placeholder="Filter input... (disabled)" 
             className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg text-slate-400 cursor-not-allowed"
           />
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-0 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste domains here...&#10;example.com&#10;google.com&#10;test.org"
          className="w-full h-full p-4 resize-none outline-none font-mono text-sm text-slate-600 placeholder:text-slate-300 custom-scrollbar"
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleAnalyze}
          disabled={!input.trim() || isProcessing}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all
            ${!input.trim() || isProcessing
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200 active:scale-95'}
          `}
        >
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Analyze Input
        </button>
      </div>
    </div>
  );
};