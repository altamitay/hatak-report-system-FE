
import React from 'react';
import { ActionType } from '../types';

interface TriggerScreenProps {
  onSelect: (type: ActionType) => void;
}

const TriggerScreen: React.FC<TriggerScreenProps> = ({ onSelect }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 pt-2">
      <div className="mb-4 shrink-0">
        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">מה המשימה שלך עכשיו?</h2>
        <p className="text-slate-400 text-lg mt-1 font-bold italic">בחר את הפעולה שביצעת בכלי</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide">
        <button
          onClick={() => onSelect(ActionType.DISASSEMBLE)}
          className="group relative flex items-center p-5 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl active:scale-[0.98] active:bg-orange-600 active:border-orange-400 transition-all shadow-xl shrink-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center group-active:bg-white/20 ml-4 shrink-0 backdrop-blur-md border border-orange-500/30">
            <svg className="w-8 h-8 text-orange-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-right relative z-10">
            <span className="block text-2xl font-black text-white">פירוק מטף</span>
            <span className="text-slate-400 text-xs font-bold group-active:text-white/80 opacity-70">הסרה מהכלי / תקלה</span>
          </div>
        </button>

        <button
          onClick={() => onSelect(ActionType.ASSEMBLE)}
          className="group relative flex items-center p-5 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl active:scale-[0.98] active:bg-emerald-600 active:border-emerald-400 transition-all shadow-xl shrink-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center group-active:bg-white/20 ml-4 shrink-0 backdrop-blur-md border border-emerald-500/30">
            <svg className="w-8 h-8 text-emerald-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-right relative z-10">
            <span className="block text-2xl font-black text-white">הרכבת מטף</span>
            <span className="text-slate-400 text-xs font-bold group-active:text-white/80 opacity-70">התקנה חדשה / חזרה מתיקון</span>
          </div>
        </button>

        <button
          onClick={() => onSelect(ActionType.AUDIT)}
          className="group relative flex items-center p-5 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl active:scale-[0.98] active:bg-blue-600 active:border-blue-400 transition-all shadow-xl shrink-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center group-active:bg-white/20 ml-4 shrink-0 backdrop-blur-md border border-blue-500/30">
            <svg className="w-8 h-8 text-blue-500 group-active:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-right relative z-10">
            <span className="block text-2xl font-black text-white">מיפוי</span>
            <span className="text-slate-400 text-xs font-bold group-active:text-white/80 opacity-70">בדיקת מלאי וצ'ק ליסט</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TriggerScreen;
