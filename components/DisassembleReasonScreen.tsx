
import React from 'react';

import { Extinguisher } from '../types';

interface DisassembleReasonScreenProps {
  onSelect: (reason: string) => void;
  onBack: () => void;
  extinguisher: Extinguisher | null;
}

const REASONS = [
  'העברה לכלי מפקד',
  'תקלה X',
  'תקלה Y',
];

const DisassembleReasonScreen: React.FC<DisassembleReasonScreenProps> = ({ onSelect, onBack, extinguisher }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 pt-2 text-right">
      <div className="mb-6 shrink-0">
        <button 
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-black text-sm uppercase tracking-widest">חזרה לבחירת מטף</span>
        </button>

        {extinguisher && (
          <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">מטף נבחר</span>
              <span className="text-lg font-black text-white">{extinguisher.serialNumber}</span>
            </div>
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">למה המטף מפורק?</h2>
        <p className="text-slate-400 text-lg mt-1 font-bold italic">בחר את סיבת הפירוק מהרשימה</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide pb-8">
        {REASONS.map((reason, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(reason)}
            className="group relative flex items-center p-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl active:scale-[0.98] active:bg-orange-600 active:border-orange-400 transition-all shadow-xl shrink-0 overflow-hidden text-right"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center group-active:bg-white/20 ml-5 shrink-0 backdrop-blur-md border border-orange-500/30">
              <span className="text-orange-500 group-active:text-white font-black text-xl">{idx + 1}</span>
            </div>
            <div className="flex-1 relative z-10">
              <span className="block text-2xl font-black text-white">{reason}</span>
            </div>
            <svg className="w-6 h-6 text-white/20 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisassembleReasonScreen;
