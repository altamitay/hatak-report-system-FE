
import React, { useState, useMemo } from 'react';
import { AnomalyDetail, CounterValue } from '../types';

interface MappingSummaryScreenProps {
  vehicleId: string;
  anomalies: AnomalyDetail[];
  counters: CounterValue[];
  onNext: (id: string) => void;
  onFinish: () => void;
}

const MOCK_VEHICLES = [
  '776-554',
  '112-233',
  '554-123',
  '998-112',
  '443-221',
  '887-990',
  '223-114',
  '334-556',
  '100-200',
  '456-789'
];

const MappingSummaryScreen: React.FC<MappingSummaryScreenProps> = ({ 
  vehicleId, 
  anomalies, 
  counters, 
  onNext, 
  onFinish 
}) => {
  const [nextId, setNextId] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const term = nextId.trim();
    if (!term) return [];
    return MOCK_VEHICLES.filter(v => v.includes(term) && v !== term);
  }, [nextId]);

  const handleSelect = (id: string) => {
    setNextId(id);
    setShowSuggestions(false);
  };

  const isButtonEnabled = nextId.trim().length >= 3;

  return (
    <div className="h-full flex flex-col items-center justify-start text-center animate-in fade-in zoom-in duration-700 pt-2 pb-2 overflow-y-auto scrollbar-hide relative">
      <div className="relative mb-4 pt-4 shrink-0">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce-subtle">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-black text-white mb-0.5 shrink-0 tracking-tight">המיפוי הושלם!</h2>
      <p className="text-emerald-400 text-xs font-bold mb-4 opacity-80">נתונים סונכרנו בהצלחה מול SAP</p>

      {/* Main Results Container */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 mb-4 shadow-2xl shrink-0 text-right relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-orange-500/5 pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
           <div className="flex flex-col text-right">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1 opacity-60">מזהה כלי</span>
             <span className="text-xl font-black text-white tracking-tighter">צ': {vehicleId}</span>
           </div>
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-black text-emerald-400 uppercase">מדווח</span>
           </div>
        </div>

        {/* Replacements Section */}
        <div className="mb-4">
          <p className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-[0.2em] opacity-60">שינויים ועדכונים:</p>
          {anomalies.length > 0 ? (
            <div className="space-y-2">
              {anomalies.map((a, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl relative group/item hover:bg-white/10 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-1 h-full bg-orange-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-3 justify-between relative z-10">
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-slate-500 font-black uppercase mb-0.5 opacity-50 text-right">רשום</span>
                      <span className="text-sm font-black text-slate-400 line-through decoration-slate-600 text-right tracking-tight leading-none">{a.oldSerial}</span>
                      {a.oldMaterial && <span className="text-[9px] text-slate-500 text-right opacity-40 mt-1 font-bold">מק"ט: {a.oldMaterial}</span>}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-orange-500 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-orange-500 font-black uppercase mb-0.5 opacity-70 text-left">נוכחי</span>
                      <span className="text-lg font-black text-emerald-400 text-left tracking-tighter leading-none">{a.newSerial}</span>
                      {a.newMaterial && <span className="text-[9px] text-emerald-500/60 text-left tracking-tight mt-1 font-bold">מק"ט: {a.newMaterial}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center border-dashed">
              <span className="text-xs font-bold text-slate-600 italic">לא בוצעו החלפות ציוד</span>
            </div>
          )}
        </div>

        {/* Counters Section */}
        {counters.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <p className="text-[9px] text-slate-500 mb-2 font-black uppercase tracking-[0.2em] opacity-60">מונים מעודכנים:</p>
            <div className="grid grid-cols-2 gap-2">
              {counters.map((c, idx) => (
                <div key={idx} className="bg-black/30 backdrop-blur-md border border-white/5 flex flex-col p-3 rounded-xl shadow-inner">
                  <span className="text-[10px] font-black text-slate-500 uppercase opacity-70 mb-1">{c.type}</span>
                  <span className="text-xl font-black text-emerald-400 tabular-nums tracking-tighter">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Step Section */}
      <div className="w-full max-w-sm space-y-3 relative shrink-0 z-[100]">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 relative">
          <p className="text-white text-sm font-black mb-2 text-center tracking-tight leading-none">המשך למיפוי כלי נוסף</p>
          
          <div className="relative group mb-2">
            {/* Suggestions Dropdown (Now explicitly z-indexed and opening upwards) */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-3 bg-slate-900/95 backdrop-blur-3xl border-2 border-orange-500 rounded-xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-[200] animate-in fade-in slide-in-from-bottom-2 max-h-48 overflow-y-auto scrollbar-hide">
                <div className="bg-orange-500/20 px-3 py-2 text-[10px] font-black text-orange-400 border-b border-white/10 text-right uppercase tracking-[0.2em]">בחר כלי מהרשימה</div>
                {filteredSuggestions.map((v) => (
                  <button
                    key={v}
                    onMouseDown={() => handleSelect(v)}
                    className="w-full p-4 text-center hover:bg-orange-500/40 hover:text-white text-white text-2xl font-black border-b border-white/5 last:border-0 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-xs opacity-40 font-bold bg-white/10 px-2 py-0.5 rounded">צ'</span>
                    {v}
                  </button>
                ))}
              </div>
            )}

            <input 
              type="text"
              placeholder="הקלד מספר צ'..."
              value={nextId}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setNextId(val);
                setShowSuggestions(true);
              }}
              className={`w-full bg-slate-950/80 border-2 rounded-xl p-4 text-2xl font-black text-center outline-none transition-all placeholder:text-slate-400 shadow-2xl ${
                MOCK_VEHICLES.includes(nextId) ? 'border-emerald-500 text-emerald-400' : 'border-slate-600 text-white focus:border-orange-500'
              }`}
            />
          </div>

          <button 
            disabled={!MOCK_VEHICLES.includes(nextId)}
            onClick={() => onNext(nextId)}
            className={`w-full py-5 rounded-2xl text-xl font-black shadow-2xl transition-all border-b-4 ${
              MOCK_VEHICLES.includes(nextId) 
                ? 'bg-orange-500 text-white border-orange-700 active:translate-y-1 active:border-b-0 shadow-orange-500/50 hover:bg-orange-400' 
                : 'bg-white/5 text-slate-600 border-white/10 opacity-30 cursor-not-allowed grayscale'
            }`}
          >
            עבור לכלי הבא
          </button>
        </div>

        <button 
          onClick={onFinish}
          className="w-full py-4 text-slate-400 text-sm font-black uppercase tracking-[0.3em] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>סיום וחזרה לתפריט</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default MappingSummaryScreen;
