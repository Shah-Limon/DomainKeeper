import React from 'react';
import { Database, PlusCircle, Files, Plus } from 'lucide-react';
import { Domain } from '../types';
import { InputArea } from './InputArea';
import { StatsCard } from './StatsCard';
import { ResultColumn } from './ResultColumn';
import { VisualAnalytics } from './VisualAnalytics';

interface AnalysisResult {
  unique: string[];
  duplicates: string[];
}

interface DashboardViewProps {
  domains: Domain[];
  analysis: AnalysisResult;
  onAnalyze: (input: string) => void;
  onAppendUnique: () => void;
  onUpdateAnalysis: (type: 'unique' | 'duplicates', index: number, value: string) => void;
  onRemoveAnalysis: (type: 'unique' | 'duplicates', index: number) => void;
  onClearAnalysis: (type: 'unique' | 'duplicates') => void;
  isProcessing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  domains,
  analysis,
  onAnalyze,
  onAppendUnique,
  onUpdateAnalysis,
  onRemoveAnalysis,
  onClearAnalysis,
  isProcessing
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Database Domains" value={domains.length} subtitle="Stored securely in cloud" icon={Database} variant="primary" />
        <StatsCard title="New Unique Found" value={analysis.unique.length} subtitle="Ready to append" icon={PlusCircle} variant="success" />
        <StatsCard title="Duplicates Detected" value={analysis.duplicates.length} subtitle="Filtered out automatically" icon={Files} variant="danger" />
      </div>
      <VisualAnalytics domains={domains} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <InputArea onAnalyze={onAnalyze} isProcessing={isProcessing} />
        <ResultColumn title="Unique New Domains" count={analysis.unique.length} items={analysis.unique} variant="success" emptyMessage="No unique domains found yet. Try pasting or importing some and clicking Analyze." onUpdate={(idx, val) => onUpdateAnalysis('unique', idx, val)} onRemove={(idx) => onRemoveAnalysis('unique', idx)} onClear={() => onClearAnalysis('unique')} actionButton={<button onClick={onAppendUnique} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 active:scale-95"><Plus className="w-4 h-4" />Append {analysis.unique.length} to Database</button>} />
        <ResultColumn title="Duplicates Found" count={analysis.duplicates.length} items={analysis.duplicates} variant="danger" emptyMessage="No duplicates detected." onUpdate={(idx, val) => onUpdateAnalysis('duplicates', idx, val)} onRemove={(idx) => onRemoveAnalysis('duplicates', idx)} onClear={() => onClearAnalysis('duplicates')} />
      </div>
    </div>
  );
};