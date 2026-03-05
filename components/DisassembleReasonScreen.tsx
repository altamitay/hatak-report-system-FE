
import React, { useState } from 'react';

import { Extinguisher } from '../types';


const REASONS = [
  'העברה לכלי מפקד',
  'תקלה X',
  'תקלה Y',
];

const STORAGE_SITES = [
  'A101', 'A102', 'A103', 'B201', 'B202', 'C500', 'WH-01', 'YARD-2'
];

interface DisassembleReasonScreenProps {
  onSelect: (reason: string, destination: string) => void;
  onBack: () => void;
  extinguisher: Extinguisher | null;
}

const DisassembleReasonScreen: React.FC<DisassembleReasonScreenProps> = ({ onSelect, onBack, extinguisher }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherText, setOtherText] = useState('');

  // Storage Location State
  const [targetStorage, setTargetStorage] = useState('');
  const [showStorageSuggestions, setShowStorageSuggestions] = useState(false);

  const filteredReasons = REASONS.filter(reason =>
    reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStorage = STORAGE_SITES.filter(site =>
    site.toLowerCase().includes(targetStorage.toLowerCase())
  );

  const handleReasonSelect = (reason: string) => {
    if (targetStorage.trim()) {
      onSelect(reason, targetStorage.trim());
    }
  };

  const handleOtherSubmit = () => {
    if (otherText.trim() && targetStorage.trim()) {
      onSelect(otherText.trim(), targetStorage.trim());
    }
  };

  const isReady = STORAGE_SITES.includes(targetStorage);

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 pt-2 text-right">
      <div className="mb-4 shrink-0">
        <button
          onClick={onBack}
          className="mb-2 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-black text-xs uppercase tracking-widest">חזרה לבחירת מטף</span>
        </button>

        {extinguisher && (
          <div className="mb-3 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">מטף מיועד לפירוק</span>
              <span className="text-base font-black text-white leading-none">{extinguisher.serialNumber}</span>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* 1. Storage Location Selection */}
        <div className="mb-4 relative">
          <label className="block text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1.5 mr-1">
            לאן מפרקים? (אתר אחסון יעד):
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 ${targetStorage ? 'text-emerald-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="חפש/הזן אתר אחסון..."
              value={targetStorage}
              onFocus={() => setShowStorageSuggestions(true)}
              onChange={(e) => {
                setTargetStorage(e.target.value);
                setShowStorageSuggestions(true);
              }}
              className={`w-full bg-slate-900 border-2 rounded-2xl py-3 pr-12 pl-4 text-white font-black outline-none transition-all ${targetStorage ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 focus:border-emerald-500/30'}`}
            />
            {showStorageSuggestions && filteredStorage.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 max-h-40 overflow-y-auto scrollbar-hide">
                {filteredStorage.map((site) => (
                  <button
                    key={site}
                    onClick={() => {
                      setTargetStorage(site);
                      setShowStorageSuggestions(false);
                    }}
                    className="w-full p-3 text-right hover:bg-emerald-500/10 text-white font-bold border-b border-slate-800 last:border-0 transition-colors"
                  >
                    {site}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">למה המטף מפורק?</h2>
        </div>

        {/* Search Bar for reasons */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="חפש סיבת פירוק..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white font-bold placeholder:text-slate-600 focus:border-orange-500/50 focus:bg-white/10 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide pb-4 transition-opacity duration-300 ${!isReady ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
        {/* Pinned "Other" Option */}
        <div className="shrink-0 mb-2">
          {!isOtherSelected ? (
            <button
              onClick={() => setIsOtherSelected(true)}
              className="w-full group relative flex items-center p-4 bg-orange-500/10 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl active:scale-[0.98] transition-all shadow-lg text-right overflow-hidden"
            >
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center ml-4 shrink-0 border border-orange-500/40">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-xl font-black text-orange-400">אחר (הזנה ידנית)</span>
              </div>
            </button>
          ) : (
            <div className="animate-in slide-in-from-top-2 duration-300 bg-orange-600 border-2 border-orange-400 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3 text-white">
                <span className="text-xs font-black uppercase tracking-widest">הזן סיבת פירוק מפורטת:</span>
                <button onClick={() => setIsOtherSelected(false)}>
                  <svg className="w-5 h-5 text-white/60 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="הקלד כאן..."
                  className="flex-1 bg-black/30 border border-white/20 rounded-xl p-3 text-lg font-bold text-white outline-none focus:bg-black/50 transition-all placeholder:text-white/30"
                />
                <button
                  onClick={handleOtherSubmit}
                  disabled={!otherText.trim()}
                  className="bg-white text-orange-600 px-4 rounded-xl font-black disabled:opacity-50 active:scale-95 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Divider */}
        {searchQuery && (
          <div className="px-2 mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">תוצאות חיפוש ({filteredReasons.length})</span>
          </div>
        )}

        {/* Filtered Reasons */}
        {filteredReasons.length > 0 ? (
          filteredReasons.map((reason, idx) => (
            <button
              key={idx}
              onClick={() => handleReasonSelect(reason)}
              className="group relative flex items-center p-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl active:scale-[0.98] active:bg-orange-600 active:border-orange-400 transition-all shadow-lg shrink-0 overflow-hidden text-right"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-active:bg-white/20 ml-4 shrink-0 border border-white/10">
                <span className="text-slate-400 group-active:text-white font-black text-lg">{idx + 1}</span>
              </div>
              <div className="flex-1 relative z-10">
                <span className="block text-xl font-black text-white">{reason}</span>
              </div>
              <svg className="w-5 h-5 text-white/20 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ))
        ) : !isOtherSelected && (
          <div className="py-12 text-center">
            <p className="text-slate-500 font-bold italic">לא נמצאו סיבות התואמות לחיפוש</p>
          </div>
        )}
      </div>

      {!isReady && (
        <div className="pb-4 animate-bounce">
          <p className="text-center text-emerald-400 text-xs font-black uppercase tracking-tighter shadow-emerald-500/20">בחר אתר אחסון יעד כדי להמשיך</p>
        </div>
      )}
    </div>
  );
};

export default DisassembleReasonScreen;
