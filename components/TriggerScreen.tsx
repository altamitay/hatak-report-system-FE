import React from 'react';
import { ActionType, Extinguisher, LastAction } from '../types';

interface TriggerScreenProps {
  onSelect: (type: ActionType) => void;
  installedHatak: Extinguisher | null;
  storageLocation: string;
  lastAction: LastAction | null;
}

const TriggerScreen: React.FC<TriggerScreenProps> = ({ onSelect, installedHatak, storageLocation, lastAction }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 pt-1">
      <div className="mb-2 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight underline decoration-orange-500/30 decoration-4 underline-offset-4">מה המשימה שלך?</h2>
        </div>
      </div>

      {/* Unified Vehicle Info Card */}
      <div className="mb-3 relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-emerald-500/5"></div>

        <div className="flex justify-between items-center relative z-10 gap-4">
          {/* Left Side: Hatak Info */}
          <div className="flex-1 flex flex-col gap-1.5 border-l border-white/10 pr-1">
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">חט"כ מותקן (מטף)</p>
            {installedHatak ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">מס"ד:</span>
                  <span className="text-xl font-black text-white tracking-tighter leading-none">{installedHatak.serialNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-400/80">מק"ט:</span>
                  <span className="text-sm font-black text-orange-400 tracking-tighter leading-none">{installedHatak.materialNumber}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs font-black text-red-400/70">לא נמצא חט"כ</p>
            )}
          </div>

          {/* Right Side: Storage Info */}
          <div className="flex-1 flex flex-col gap-1.5 text-left">
            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">אתר אחסון (צ')</p>
            <div className="flex items-center justify-end gap-3 py-1">
              <span className="text-xl font-black text-white tracking-widest leading-none">{storageLocation}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Last Activity Section (as per user image) */}
        {lastAction && (
          <div className="mt-3 pt-3 border-t border-white/10 relative z-10">
            <div className="flex justify-between items-center mb-2">
              <div className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded text-[9px] font-black text-pink-400 uppercase tracking-tight">
                {lastAction.type}
              </div>
              <span className="text-[9px] font-bold text-slate-500 tabular-nums">{lastAction.timestamp}</span>
            </div>

            {lastAction.details && (
              <div className="flex items-center justify-between px-3 py-2 bg-black/20 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">מס"ד רשום</span>
                  <span className="text-sm font-black text-slate-500 line-through tabular-nums leading-none">{lastAction.details.oldSerial}</span>
                </div>

                <svg className="w-4 h-4 text-orange-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>

                <div className="flex flex-col text-left items-end">
                  <span className="text-[8px] text-emerald-500 font-bold uppercase mb-0.5">מס"ד שנמצא</span>
                  <div className="flex items-center gap-1.5">
                    {lastAction.details.newMaterial && (
                      <span className="px-1 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 tracking-tighter">
                        מק"ט: {lastAction.details.newMaterial}
                      </span>
                    )}
                    <span className="text-sm font-black text-emerald-400 tabular-nums leading-none">{lastAction.details.newSerial}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2">
        <button
          onClick={() => onSelect(ActionType.DISASSEMBLE)}
          className="group relative flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl active:scale-[0.98] active:bg-orange-600 active:border-orange-400 transition-all shadow-xl overflow-hidden aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 mb-3 bg-orange-500/20 rounded-xl flex items-center justify-center group-active:bg-white/20 shrink-0 backdrop-blur-md border border-orange-500/30">
            <svg className="w-10 h-10 text-orange-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center relative z-10">
            <span className="block text-lg font-black text-white leading-tight">פירוק מטף</span>
            <span className="text-slate-400 text-[10px] font-bold group-active:text-white/80 opacity-70">הסרה / תקלה</span>
          </div>
        </button>

        <button
          onClick={() => onSelect(ActionType.ASSEMBLE)}
          className="group relative flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl active:scale-[0.98] active:bg-emerald-600 active:border-emerald-400 transition-all shadow-xl overflow-hidden aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 mb-3 bg-emerald-500/20 rounded-xl flex items-center justify-center group-active:bg-white/20 shrink-0 backdrop-blur-md border border-emerald-500/30">
            <svg className="w-10 h-10 text-emerald-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center relative z-10">
            <span className="block text-lg font-black text-white leading-tight">הרכבת מטף</span>
            <span className="text-slate-400 text-[10px] font-bold group-active:text-white/80 opacity-70">התקנה חדשה</span>
          </div>
        </button>

        <button
          onClick={() => onSelect(ActionType.AUDIT)}
          className="group relative flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl active:scale-[0.98] active:bg-blue-600 active:border-blue-400 transition-all shadow-xl overflow-hidden aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 mb-3 bg-blue-500/20 rounded-xl flex items-center justify-center group-active:bg-white/20 shrink-0 backdrop-blur-md border border-blue-500/30">
            <svg className="w-10 h-10 text-blue-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-center relative z-10">
            <span className="block text-lg font-black text-white leading-tight">מיפוי</span>
            <span className="text-slate-400 text-[10px] font-bold group-active:text-white/80 opacity-70">בדיקת מלאי</span>
          </div>
        </button>

        <button
          onClick={() => onSelect(ActionType.COUNTER_REPORTING)}
          className="group relative flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl active:scale-[0.98] active:bg-violet-600 active:border-violet-400 transition-all shadow-xl overflow-hidden aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 mb-3 bg-violet-500/20 rounded-xl flex items-center justify-center group-active:bg-white/20 shrink-0 backdrop-blur-md border border-violet-500/30">
            <svg className="w-10 h-10 text-violet-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center relative z-10">
            <span className="block text-lg font-black text-white leading-tight">דיווח מונים</span>
            <span className="text-slate-400 text-[10px] font-bold group-active:text-white/80 opacity-70">שע"מ וק"מ</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TriggerScreen;
