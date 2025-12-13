import React from 'react';
import { DomainTable } from './DomainTable';
import { Domain } from '../types';

interface AllDomainsViewProps {
  domains: Domain[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, newUrl: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'copied') => void;
}

export const AllDomainsView: React.FC<AllDomainsViewProps> = ({
  domains,
  onRemove,
  onUpdate,
  onStatusChange
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">File Manager</h2>
        <p className="text-slate-500 text-sm">View, edit, and manage all your stored domain lists.</p>
      </div>
      
      <DomainTable 
        domains={domains} 
        onRemove={onRemove} 
        onUpdate={onUpdate}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};