import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Cloud, Check, AlertCircle, Database } from 'lucide-react';
import { Domain, Toast } from './types';
import { normalizeDomain, generateId } from './utils';
import { fetchDomains, saveDomains } from './src/services/mongoService';

import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AllDomainsView } from './components/AllDomainsView';

interface AnalysisResult {
  unique: string[];
  duplicates: string[];
}

function App() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  
  const [analysis, setAnalysis] = useState<AnalysisResult>({ unique: [], duplicates: [] });

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDomains();
        setDomains(data);
      } catch (err) {
        showToast('Could not connect to Server', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = generateId();
    setToast({ id, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Core Logic ---

  const handleAnalyze = useCallback((rawInput: string) => {
    const lines = rawInput.split('\n');
    const existingUrls = new Set(domains.map(d => d.url));
    const processedUnique = new Set<string>();
    const processedDuplicates = new Set<string>();

    lines.forEach(line => {
      const normalized = normalizeDomain(line);
      if (!normalized) return;

      if (existingUrls.has(normalized)) {
        processedDuplicates.add(normalized);
      } else {
        if (processedUnique.has(normalized)) {
            processedDuplicates.add(normalized); 
        } else {
            processedUnique.add(normalized);
        }
      }
    });

    setAnalysis({
      unique: Array.from(processedUnique),
      duplicates: Array.from(processedDuplicates)
    });
    
    if (processedUnique.size > 0 || processedDuplicates.size > 0) {
      showToast('Analysis complete', 'success');
    }
  }, [domains]);

  const handleUpdateAnalysisItem = (type: 'unique' | 'duplicates', index: number, newValue: string) => {
    setAnalysis(prev => {
      const newList = [...prev[type]];
      newList[index] = newValue;
      return { ...prev, [type]: newList };
    });
  };

  const handleRemoveAnalysisItem = (type: 'unique' | 'duplicates', index: number) => {
    setAnalysis(prev => {
      const newList = prev[type].filter((_, i) => i !== index);
      return { ...prev, [type]: newList };
    });
  };

  const handleClearAnalysisColumn = (type: 'unique' | 'duplicates') => {
    setAnalysis(prev => ({ ...prev, [type]: [] }));
  };

  const handleAppendUnique = () => {
    if (analysis.unique.length === 0) return;

    const newDomains: Domain[] = analysis.unique.map(url => ({
      id: generateId(),
      url,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }));

    setDomains(prev => [...newDomains, ...prev]);
    setHasUnsavedChanges(true);
    showToast(`Added ${analysis.unique.length} domains`, 'success');
    setAnalysis({ unique: [], duplicates: [] });
  };

  const handleRemoveDomain = useCallback((id: string) => {
    setDomains(prev => prev.filter(d => d.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  const handleUpdateDomain = useCallback((id: string, newUrl: string) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, url: newUrl } : d));
    setHasUnsavedChanges(true);
  }, []);

  // --- AUTO-SAVE ON STATUS CHANGE ---
  // This function is passed down to the table. When "Copy" is clicked, 
  // status becomes 'copied', triggering an immediate DB sync.
  const handleDomainStatusChange = useCallback((id: string, status: 'pending' | 'copied') => {
    setDomains(prev => {
      const updatedDomains = prev.map(d => d.id === id ? { ...d, status } : d);
      
      const autoSave = async () => {
        setSyncing(true);
        try {
          await saveDomains(updatedDomains);
          setHasUnsavedChanges(false);
          // showToast('Status saved', 'success'); // Optional feedback
        } catch (error) {
          console.error('Auto-save error', error);
          showToast('Failed to save status', 'error');
          setHasUnsavedChanges(true);
        } finally {
          setSyncing(false);
        }
      };
      
      autoSave();
      return updatedDomains;
    });
  }, []);

  // Manual Sync Button Handler
  const handleSync = async () => {
    setSyncing(true);
    try {
      await saveDomains(domains);
      setHasUnsavedChanges(false);
      showToast('Database synced successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin text-slate-800">
          <Database className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Header / Sync Status */}
            <div className="flex items-center justify-end mb-4">
               <button
                onClick={handleSync}
                disabled={syncing || !hasUnsavedChanges}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm
                  ${syncing || !hasUnsavedChanges 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'}
                `}
              >
                {syncing ? <Check className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {syncing ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved to DB'}
              </button>
            </div>

            <Routes>
              <Route path="/" element={
                <DashboardView 
                  domains={domains}
                  analysis={analysis}
                  onAnalyze={handleAnalyze}
                  onAppendUnique={handleAppendUnique}
                  onUpdateAnalysis={handleUpdateAnalysisItem}
                  onRemoveAnalysis={handleRemoveAnalysisItem}
                  onClearAnalysis={handleClearAnalysisColumn}
                  isProcessing={false}
                />
              } />
              <Route path="/domains" element={
                <AllDomainsView 
                  domains={domains}
                  onRemove={handleRemoveDomain}
                  onUpdate={handleUpdateDomain}
                  onStatusChange={handleDomainStatusChange}
                />
              } />
            </Routes>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`
            fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-fade-in-up z-[60] bg-white
            ${toast.type === 'success' ? 'border-green-100 text-green-800' : ''}
            ${toast.type === 'error' ? 'border-red-100 text-red-800' : ''}
            ${toast.type === 'info' ? 'border-blue-100 text-blue-800' : ''}
          `}>
            {toast.type === 'success' && <Check className="w-5 h-5 text-green-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
            {toast.type === 'info' && <Database className="w-5 h-5 text-blue-500" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;