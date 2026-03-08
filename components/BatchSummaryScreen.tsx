
import React, { useState } from 'react';
import { BatchStats } from '../types';

interface BatchSummaryScreenProps {
  stats: BatchStats;
  onFinish: () => void;
}

const BatchSummaryScreen: React.FC<BatchSummaryScreenProps> = ({ stats, onFinish }) => {
  const [showVehicles, setShowVehicles] = useState(false);
  const [showAnomalies, setShowAnomalies] = useState(false);

  const isExpanded = showVehicles || showAnomalies;

  return (
    <div className={`h-full flex flex-col items-center justify-start text-center animate-in fade-in zoom-in-90 duration-700 scrollbar-hide pt-6 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(249,115,22,0.4)] shrink-0">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>

      <h2 className="text-3xl font-black text-white mb-3 shrink-0">סבב מיפויים הושלם!</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4 shrink-0">
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none"></div>
          <div className="text-3xl font-black text-orange-500 mb-0.5 relative z-10">{stats.vehiclesCount}</div>
          <div className="text-slate-400 font-bold text-[9px] uppercase tracking-widest leading-none relative z-10 opacity-70">כלים נבדקו</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
          <div className="text-3xl font-black text-red-400 mb-0.5 relative z-10">{stats.anomaliesFound}</div>
          <div className="text-slate-400 font-bold text-[9px] uppercase tracking-widest leading-none relative z-10 opacity-70">החלפות דווחו</div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="w-full max-w-sm space-y-3 mb-8 text-right">
        {/* Vehicles List Toggle */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className="w-full px-5 py-4 flex items-center justify-between text-slate-300 font-bold hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 transition-transform ${showVehicles ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
              <span>פירוט כלים שנבדקו</span>
            </div>
            <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full text-slate-500 font-black">{stats.vehiclesList.length}</span>
          </button>

          {showVehicles && (
            <div className="px-5 pb-4 pt-1 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
              {stats.vehiclesList.length > 0 ? (
                stats.vehiclesList.map((v, i) => (
                  <span key={i} className="bg-white/5 px-3 py-1 rounded-lg text-xs font-black text-slate-400 border border-white/5">
                    {v}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-600 italic">אין נתונים להצגה</span>
              )}
            </div>
          )}
        </div>

        {/* Anomalies List Toggle */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          <button
            onClick={() => setShowAnomalies(!showAnomalies)}
            className="w-full px-5 py-4 flex items-center justify-between text-slate-300 font-bold hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 transition-transform ${showAnomalies ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
              <span>פירוט החלפות</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-black ${stats.anomaliesList.length > 0 ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-slate-500'}`}>
              {stats.anomaliesList.length}
            </span>
          </button>

          {showAnomalies && (
            <div className="px-5 pb-5 pt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
              {stats.anomaliesList.length > 0 ? (
                stats.anomaliesList.map((a, i) => (
                  <div key={i} className="bg-black/20 p-3 rounded-xl border border-white/5 text-right">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase opacity-60">כלי: {a.vehicleId}</span>
                      <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-1.5 rounded uppercase">דווחה החלפה</span>
                    </div>
                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 font-bold uppercase mb-0.5 opacity-50">מס"ד רשום</span>
                        <span className="text-sm font-black text-slate-400 line-through decoration-slate-600">{a.oldSerial}</span>
                      </div>
                      <svg className="w-4 h-4 text-orange-500 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] text-orange-500 font-bold uppercase mb-0.5 opacity-70">מס"ד שנמצא</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-emerald-400">{a.newSerial === '---' ? 'חסר' : a.newSerial}</span>
                          {a.newMaterial && (
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 rounded uppercase font-bold">מק"ט: {a.newMaterial}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-600 italic">לא דווחו החלפות בסבב זה</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full max-w-sm py-5 bg-white text-slate-900 rounded-3xl text-xl font-black active:scale-95 transition-all shadow-2xl border-b-8 border-slate-300 active:border-b-0 active:translate-y-2 hover:bg-slate-100 shrink-0 mb-6"
      >
        סיום וחזרה לראשי
      </button>
    </div>
  );
};

export default BatchSummaryScreen;
