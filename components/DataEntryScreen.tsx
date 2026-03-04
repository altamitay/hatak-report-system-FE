
import React from 'react';
import { Extinguisher, CounterValue } from '../types';
import CounterReporting from './CounterReporting';

interface DataEntryScreenProps {
  onConfirm: (counters: CounterValue[]) => void;
  onBack: () => void;
  extinguisher: Extinguisher | null;
  reason?: string | null;
}

const DataEntryScreen: React.FC<DataEntryScreenProps> = ({ onConfirm, onBack, extinguisher, reason }) => {
  const title = extinguisher ? (
    <div className="flex flex-col gap-1">
      <div className="text-2xl md:text-3xl font-black text-white tracking-tighter">
        <span className="text-slate-500 text-sm ml-2 font-bold">מס"ד:</span>
        {extinguisher.serialNumber}
      </div>
      {extinguisher.materialNumber && (
        <div className="text-lg md:text-xl font-black text-orange-400 tracking-tighter">
          <span className="text-orange-400/50 text-[10px] ml-2 font-bold">מק"ט:</span>
          {extinguisher.materialNumber}
        </div>
      )}
    </div>
  ) : 'הזנת מונים';

  const headerExtra = reason ? (
    <div className="mt-1 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg inline-flex items-center gap-2">
      <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">סיבת פירוק:</span>
      <span className="text-xs font-black text-white">{reason}</span>
    </div>
  ) : null;

  return (
    <CounterReporting
      title={title}
      headerExtra={headerExtra}
      requiredCounters={extinguisher?.requiredCounters || []}
      isDynamic={extinguisher?.isNew || (extinguisher?.requiredCounters?.length === 0)}
      onConfirm={onConfirm}
      onBack={onBack}
      confirmLabel="סיום ודיווח"
    />
  );
};

export default DataEntryScreen;
