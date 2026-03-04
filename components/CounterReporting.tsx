
import React, { useState } from 'react';
import { CounterType, CounterValue } from '../types';

interface CounterReportingProps {
  requiredCounters?: CounterType[];
  isDynamic?: boolean;
  onConfirm: (counters: CounterValue[]) => void;
  onBack: () => void;
  confirmLabel: string;
  title: React.ReactNode;
  headerExtra?: React.ReactNode;
}

const CounterReporting: React.FC<CounterReportingProps> = ({
  requiredCounters = [],
  isDynamic = false,
  onConfirm,
  onBack,
  confirmLabel,
  title,
  headerExtra
}) => {
  const [drafts, setDrafts] = useState<Record<CounterType, string>>({
    'שע"מ': '',
    'ק"מ': '',
    'מייל': ''
  });
  
  const [editingCategory, setEditingCategory] = useState<'hours' | 'distance'>(() => {
    if (requiredCounters.includes('שע"מ') || isDynamic) return 'hours';
    return 'distance';
  });

  const [selectedDistanceUnit, setSelectedDistanceUnit] = useState<CounterType | null>(() => {
    const hasKm = requiredCounters.includes('ק"מ');
    const hasMiles = requiredCounters.includes('מייל');
    
    if (hasKm && !hasMiles) return 'ק"מ';
    if (hasMiles && !hasKm) return 'מייל';
    if (isDynamic || (hasKm && hasMiles)) return 'ק"מ';
    return null;
  });

  const activeType: CounterType = editingCategory === 'hours' ? 'שע"מ' : (selectedDistanceUnit || 'ק"מ');
  const currentValue = drafts[activeType];
  
  const isValidEntry = (val: string) => val.length >= 1;

  const handleKeyPress = (num: string) => {
    if (editingCategory === 'distance' && !selectedDistanceUnit) return;
    setDrafts(prev => {
      const current = prev[activeType];
      if (current.length < 8) return { ...prev, [activeType]: current + num };
      return prev;
    });
  };

  const handleDelete = () => {
    setDrafts(prev => ({ ...prev, [activeType]: prev[activeType].slice(0, -1) }));
  };

  const handleClear = () => {
    setDrafts(prev => ({ ...prev, [activeType]: '' }));
  };

  const hasHoursValue = isValidEntry(drafts['שע"מ']);
  const hasDistanceValue = selectedDistanceUnit ? isValidEntry(drafts[selectedDistanceUnit]) : false;
  
  const isHoursRequired = requiredCounters.includes('שע"מ');
  const isDistanceRequired = requiredCounters.includes('ק"מ') || requiredCounters.includes('מייל');

  const canConfirm = isDynamic 
    ? (hasHoursValue || hasDistanceValue)
    : ((!isHoursRequired || hasHoursValue) && (!isDistanceRequired || hasDistanceValue));

  const handleFinalConfirm = () => {
    const finalCounters: CounterValue[] = [];
    if (hasHoursValue) finalCounters.push({ type: 'שע"מ', value: drafts['שע"מ'] });
    if (selectedDistanceUnit && isValidEntry(drafts[selectedDistanceUnit])) {
      finalCounters.push({ type: selectedDistanceUnit, value: drafts[selectedDistanceUnit] });
    }
    onConfirm(finalCounters);
  };

  return (
    <div className="h-full flex flex-col text-right overflow-hidden">
      {/* Header Section */}
      <div className="shrink-0 mb-1 md:mb-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-white leading-tight">{title}</h2>
            {headerExtra}
          </div>
          <button onClick={onBack} className="p-1.5 md:p-3 bg-slate-800 rounded-xl md:rounded-2xl text-slate-400 active:scale-90 transition-transform shadow-lg">
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-2 gap-3 mb-2 shrink-0">
        <button
          onClick={() => setEditingCategory('hours')}
          className={`flex flex-col p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 transition-all text-right h-20 md:h-24 justify-between ${
            editingCategory === 'hours' 
              ? 'bg-orange-500 border-orange-400 text-white shadow-xl shadow-orange-500/20' 
              : hasHoursValue 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
              : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}
        >
          <span className="text-[10px] md:text-[8px] font-black uppercase tracking-widest leading-none">שעות מנוע</span>
          <div className="text-2xl md:text-3xl font-black tabular-nums tracking-tighter leading-none">{drafts['שע"מ'] || '---'}</div>
        </button>

        <div 
          onClick={() => setEditingCategory('distance')}
          className={`flex flex-col p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 transition-all text-right h-20 md:h-24 justify-between cursor-pointer ${
            editingCategory === 'distance' 
              ? 'bg-slate-800 border-orange-500 shadow-xl' 
              : hasDistanceValue 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
              : 'bg-slate-900 border-slate-800 text-slate-600'
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <span className={`text-[10px] md:text-[8px] font-black uppercase tracking-widest leading-none ${editingCategory === 'distance' ? 'text-orange-400' : ''}`}>מרחק נסיעה</span>
            <div className="flex bg-slate-950 p-0.5 rounded-lg gap-0.5" onClick={e => e.stopPropagation()}>
              {['ק"מ', 'מייל'].map(unit => (
                <button
                  key={unit}
                  onClick={() => {
                    setSelectedDistanceUnit(unit as CounterType);
                    setEditingCategory('distance');
                  }}
                  className={`px-2 md:px-3 py-1 rounded text-[9px] md:text-[8px] font-black transition-all ${
                    selectedDistanceUnit === unit ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          <div className={`text-2xl md:text-3xl font-black tabular-nums tracking-tighter leading-none ${editingCategory === 'distance' ? 'text-white' : ''}`}>
            {selectedDistanceUnit ? (drafts[selectedDistanceUnit] || '---') : '---'}
          </div>
        </div>
      </div>

      {/* Main Display */}
      <div className="bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-6 mb-2 md:mb-4 text-center shrink-0 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        <div className="text-[10px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2 relative z-10 opacity-60">
          פעיל: <span className="text-orange-400">{editingCategory === 'hours' ? 'שעות מנוע (שע"מ)' : `מרחק נסיעה (${selectedDistanceUnit})`}</span>
        </div>
        <div className="flex items-center justify-center gap-4 h-12 md:h-16 relative z-10">
          <span className={`text-4xl md:text-6xl font-black tabular-nums transition-all duration-300 drop-shadow-xl ${currentValue ? 'text-white scale-110' : 'text-slate-800'}`}>
            {currentValue || '00000'}
          </span>
          {currentValue && (
            <button onClick={handleClear} className="text-slate-600 hover:text-red-500 p-2 md:p-3 transition-colors active:scale-90">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 grid-rows-4 gap-1 mb-2 h-48 md:h-64 shrink-0">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map(num => (
          <button 
            key={num.toString()} 
            onClick={() => handleKeyPress(num.toString())}
            className="bg-white/5 backdrop-blur-lg rounded-xl text-lg md:text-2xl font-black text-white active:bg-orange-600 border border-white/10 flex items-center justify-center transition-all active:scale-95 shadow-lg"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={handleDelete}
          className="bg-white/5 backdrop-blur-lg rounded-xl text-red-400 active:bg-red-900 border border-white/10 flex items-center justify-center transition-all active:scale-95 shadow-lg"
        >
          <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
      </div>

      {/* Action Button */}
      <div className="shrink-0 pb-1">
        <button
          disabled={!canConfirm}
          onClick={handleFinalConfirm}
          className={`w-full py-2.5 md:py-5 rounded-xl md:rounded-3xl text-lg md:text-2xl font-black transition-all border-b-2 md:border-b-8 ${
            canConfirm 
              ? 'bg-orange-500 text-white shadow-2xl shadow-orange-500/20 border-orange-700 active:translate-y-1 active:border-b-0 cursor-pointer' 
              : 'bg-slate-800 text-slate-600 border-slate-900 grayscale opacity-40 cursor-not-allowed'
          }`}
        >
          {canConfirm ? confirmLabel : 'הזן נתונים חסרים'}
        </button>
      </div>
    </div>
  );
};

export default CounterReporting;
