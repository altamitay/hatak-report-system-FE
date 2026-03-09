
import React, { useState } from 'react';
import { Extinguisher, CounterValue } from '../types';
import CounterReporting from './CounterReporting';

interface AuditSummaryScreenProps {
  items: Extinguisher[];
  onConfirm: (counters: CounterValue[]) => void;
  onBack: () => void;
}

const AuditSummaryScreen: React.FC<AuditSummaryScreenProps> = ({ items, onConfirm, onBack }) => {
  const [showReplacementConfirm, setShowReplacementConfirm] = useState(false);
  const [pendingCounters, setPendingCounters] = useState<CounterValue[] | null>(null);

  const anomalies = items.filter(i => i.status === 'anomaly');
  const hasAnomaly = anomalies.length > 0;

  const handleConfirmAction = (counters: CounterValue[]) => {
    if (hasAnomaly) {
      setPendingCounters(counters);
      setShowReplacementConfirm(true);
    } else {
      onConfirm(counters);
    }
  };

  const handleFinalSubmit = () => {
    if (pendingCounters) {
      onConfirm(pendingCounters);
    }
  };

  const headerExtra = (
    <div className="flex items-center gap-2 mt-1">
      <p className="text-slate-400 text-sm font-bold">
        {items.length} מטפים נבדקו. 
      </p>
      <span className={`text-xs px-2 py-0.5 rounded-full font-black ${hasAnomaly ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
        {anomalies.length} החלפות נמצאו
      </span>
    </div>
  );

  return (
    <div className="h-full relative overflow-hidden">
      <CounterReporting
        title="סיכום מיפוי"
        headerExtra={headerExtra}
        onConfirm={handleConfirmAction}
        onBack={onBack}
        confirmLabel="אישור וסיום כלי"
        isDynamic={true}
      />

      {/* Replacement Confirmation Modal */}
      {showReplacementConfirm && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-orange-500/30 rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">רגע לפני שמאשרים...</h3>
            <p className="text-slate-400 font-bold mb-6 italic">
              עשית כאן החלפה, בוא נעיף על זה עוד מבט יחד לוודא שהכל סגור. נראה טוב?
            </p>

            <div className="bg-black/40 rounded-3xl p-6 mb-8 border border-white/5 shadow-inner">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-slate-500 font-black uppercase mb-1 opacity-60">היה רשום</span>
                  <span className="text-lg font-black text-slate-400 line-through decoration-slate-600 tracking-tighter leading-none">
                    {anomalies[0].serialNumber}
                  </span>
                </div>
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-500 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-orange-500 font-black uppercase mb-1 opacity-80">דיווחת</span>
                  <span className="text-xl font-black text-emerald-400 tracking-tighter leading-none">
                    {anomalies[0].actualSerialNumber || '---'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFinalSubmit}
                className="w-full py-5 bg-orange-500 text-white rounded-2xl text-xl font-black shadow-xl shadow-orange-500/20 border-b-4 border-orange-700 active:translate-y-1 active:border-b-0 transition-all"
              >
                כן, הכל סגור!
              </button>
              <button
                onClick={() => setShowReplacementConfirm(false)}
                className="w-full py-4 text-slate-500 font-black uppercase tracking-widest text-sm hover:text-slate-300 transition-colors"
              >
                חזור לעריכה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditSummaryScreen;
