
import React, { useState, useMemo } from 'react';

interface NextVehicleScreenProps {
  onNext: (id: string) => void;
  onFinishBatch: () => void;
}

// Mock vehicle database for suggestions
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

const NextVehicleScreen: React.FC<NextVehicleScreenProps> = ({ onNext, onFinishBatch }) => {
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
    <div className="h-full flex flex-col justify-start animate-in fade-in slide-in-from-bottom-12 duration-700 overflow-hidden pt-6">
      <div className="text-center mb-6 shrink-0">
        <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
           <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
           </svg>
        </div>
        <h2 className="text-3xl font-black text-white leading-tight">הכלי מופה בהצלחה!</h2>
        <p className="text-slate-400 text-base mt-1 font-bold italic tracking-tight">הזן מספר כלי להמשך סבב המיפויים</p>
      </div>

      <div className="space-y-3 relative shrink-0">
        <div className="relative group">
          <input 
            type="text"
            placeholder="הקלד מספר כלי..."
            value={nextId}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => {
              setNextId(e.target.value);
              setShowSuggestions(true);
            }}
            className={`w-full bg-white/5 backdrop-blur-xl border-2 rounded-3xl p-6 text-3xl font-black text-center outline-none transition-all placeholder:text-slate-700 shadow-2xl ${
              isButtonEnabled ? 'border-orange-500 text-white' : 'border-white/10 text-slate-500'
            }`}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-3 bg-slate-900/90 backdrop-blur-2xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 max-h-48 overflow-y-auto scrollbar-hide">
              <div className="bg-white/5 px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10">כלים מוכרים במערכת</div>
              {filteredSuggestions.map((v) => (
                <button
                  key={v}
                  onMouseDown={() => handleSelect(v)}
                  className="w-full p-5 text-center hover:bg-orange-500/20 hover:text-orange-400 text-white text-2xl font-black border-b border-white/5 last:border-0 transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          disabled={!isButtonEnabled}
          onClick={() => onNext(nextId)}
          className={`w-full py-6 rounded-3xl text-2xl font-black shadow-xl transition-all border-b-4 ${
            isButtonEnabled 
              ? 'bg-orange-500 text-white border-orange-700 active:translate-y-1 active:border-b-0 shadow-orange-500/40' 
              : 'bg-white/5 text-slate-600 border-white/10 opacity-40 cursor-not-allowed grayscale'
          }`}
        >
          מפה כלי חדש
        </button>

        <button 
          onClick={onFinishBatch}
          className="w-full py-5 bg-white/5 backdrop-blur-md text-slate-400 rounded-3xl text-lg font-bold active:bg-white/10 transition-all border-2 border-white/10 border-dashed hover:text-white"
        >
          סיום סבב מיפויים
        </button>
      </div>
    </div>
  );
};

export default NextVehicleScreen;
