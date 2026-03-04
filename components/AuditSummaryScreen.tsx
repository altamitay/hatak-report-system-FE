
import React from 'react';
import { Extinguisher, CounterValue } from '../types';
import CounterReporting from './CounterReporting';

interface AuditSummaryScreenProps {
  items: Extinguisher[];
  onConfirm: (counters: CounterValue[]) => void;
  onBack: () => void;
}

const AuditSummaryScreen: React.FC<AuditSummaryScreenProps> = ({ items, onConfirm, onBack }) => {
  const anomalies = items.filter(i => i.status === 'anomaly').length;

  const headerExtra = (
    <div className="flex items-center gap-2 mt-1">
      <p className="text-slate-400 text-sm font-bold">
        {items.length} מטפים נבדקו. 
      </p>
      <span className={`text-xs px-2 py-0.5 rounded-full font-black ${anomalies > 0 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
        {anomalies} החלפות נמצאו
      </span>
    </div>
  );

  return (
    <CounterReporting
      title="סיכום מיפוי"
      headerExtra={headerExtra}
      onConfirm={onConfirm}
      onBack={onBack}
      confirmLabel="אישור וסיום כלי"
      isDynamic={true} // In audit summary, we usually want to allow both counters
    />
  );
};

export default AuditSummaryScreen;
