
import React, { useState, useMemo, useRef } from 'react';
import { Extinguisher, LocationStatus, ActionType } from '../types';

interface IdentifyScreenProps {
  extinguishers: Extinguisher[]; // Items currently on vehicle
  inventory: Extinguisher[]; // Items available to assemble
  onSelect: (ext: Extinguisher) => void;
  onBack: () => void;
  actionType: ActionType | null;
  storageLocation: string;
}

// Simulated Master Data (Global Pool)
const GLOBAL_POOL: Partial<Extinguisher>[] = [
  { serialNumber: 'S-1001', name: 'מטף אבקה 6 ק"ג', materialNumber: 'MAT-101', locationStatus: 'unit_stock' },
  { serialNumber: 'S-1002', name: 'מטף אבקה 6 ק"ג', materialNumber: 'MAT-101', locationStatus: 'other_vehicle', locationName: 'כלי 776-554' },
  { serialNumber: 'S-2001', name: 'מטף הלון 2.5 ק"ג', materialNumber: 'MAT-202', locationStatus: 'current_vehicle' },
  { serialNumber: 'S-2002', name: 'מטף הלון 2.5 ק"ג', materialNumber: 'MAT-202', locationStatus: 'in_air' },
  { serialNumber: 'S-9999', name: 'מטף קצף 9 ליטר', materialNumber: 'MAT-909', locationStatus: 'unit_stock' },
  { serialNumber: 'S-12345', name: 'מטף פחמן דו-חמצני', materialNumber: 'MAT-505', locationStatus: 'other_vehicle', locationName: 'כלי 112-233' },
  { serialNumber: '12345', name: 'מטף ראשי (קיים)', materialNumber: 'M-100', locationStatus: 'current_vehicle' },
];

const StatusBadge: React.FC<{ status?: LocationStatus; name?: string; storageLocation?: string }> = ({ status, name, storageLocation }) => {
  switch (status) {
    case 'current_vehicle':
      return <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-emerald-500/30">על כלי זה</span>;
    case 'other_vehicle':
      return <span className="bg-amber-500/20 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-amber-500/30">{name || 'כלי אחר'}</span>;
    case 'unit_stock':
      return <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-blue-500/30 whitespace-nowrap">באתר אחסון {storageLocation || 'יחידה'}</span>;
    case 'in_air':
      return <span className="bg-slate-500/20 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-slate-500/30">באוויר</span>;
    default:
      return null;
  }
};

const IdentifyScreen: React.FC<IdentifyScreenProps> = ({ extinguishers, inventory, onSelect, onBack, actionType, storageLocation }) => {
  const [manualSerial, setManualSerial] = useState('');
  const [manualMaterial, setManualMaterial] = useState('');
  const [isNewItem, setIsNewItem] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(extinguishers.length > 0 ? null : false);
  const [pendingExt, setPendingExt] = useState<Extinguisher | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const term = manualSerial.toLowerCase();
    if (!term || term.length < 1) return [];

    return GLOBAL_POOL.filter(item => {
      const matches = item.serialNumber?.toLowerCase().includes(term);
      // Logic fix: In ASSEMBLE flow, do not show items already on the current vehicle
      if (actionType === ActionType.ASSEMBLE && item.locationStatus === 'current_vehicle') {
        return false;
      }
      return matches;
    });
  }, [manualSerial, actionType]);

  const checkLocationAndProceed = (ext: Extinguisher) => {
    let needsConfirmation = false;
    let locationDesc = '';

    if (actionType === ActionType.ASSEMBLE) {
      // Logic: For assembly, it should be in the current unit's stock
      // Also allow if it's already on the current vehicle (verification step)
      const isCorrectStock = (ext.locationStatus === 'unit_stock' && (!ext.locationName || ext.locationName === storageLocation)) ||
        (ext.locationStatus === 'current_vehicle');

      if (!isCorrectStock) {
        needsConfirmation = true;
        if (ext.locationStatus === 'other_vehicle') {
          locationDesc = ext.locationName ? `ב${ext.locationName}` : 'על כלי אחר';
        } else if (ext.locationStatus === 'unit_stock' && ext.locationName) { // This case means it's unit_stock but locationName doesn't match
          locationDesc = `באתר אחסון ${ext.locationName}`;
        } else if (ext.locationStatus === 'in_air') {
          locationDesc = 'באוויר (לא משויך)';
        } else if (ext.locationStatus === 'current_vehicle') {
          locationDesc = 'על כלי זה';
        } else {
          locationDesc = 'מיקום לא ידוע';
        }
      }
    } else if (actionType === ActionType.DISASSEMBLE) {
      // Logic: For disassembly, it should be on the current vehicle
      if (ext.locationStatus !== 'current_vehicle') {
        needsConfirmation = true;
        if (ext.locationStatus === 'other_vehicle') {
          locationDesc = ext.locationName ? `ב${ext.locationName}` : 'על כלי אחר';
        } else if (ext.locationStatus === 'unit_stock') {
          locationDesc = `באתר אחסון ${ext.locationName || storageLocation}`;
        } else if (ext.locationStatus === 'in_air') {
          locationDesc = 'באוויר (לא משויך)';
        } else {
          locationDesc = 'מיקום אחר';
        }
      }
    }

    if (needsConfirmation) {
      setPendingExt({ ...ext, locationName: locationDesc });
    } else {
      onSelect(ext);
    }
  };

  const handleSuggestionClick = (item: Partial<Extinguisher>) => {
    const fullExt: Extinguisher = {
      id: `ext-${Date.now()}`,
      name: item.name || 'מטף מזוהה',
      serialNumber: item.serialNumber!,
      materialNumber: item.materialNumber,
      requiredCounters: ['שע"מ', 'ק"מ'],
      isNew: false,
      locationStatus: item.locationStatus as any,
      locationName: item.locationName
    };
    checkLocationAndProceed(fullExt);
  };

  const handleManualSubmit = () => {
    const exactMatch = suggestions.find(i => i.serialNumber?.toLowerCase() === manualSerial.toLowerCase());

    if (exactMatch) {
      const fullExt: Extinguisher = {
        id: `ext-${Date.now()}`,
        name: exactMatch.name || 'מטף מזוהה',
        serialNumber: exactMatch.serialNumber!,
        materialNumber: exactMatch.materialNumber,
        requiredCounters: ['שע"מ', 'ק"מ'],
        isNew: false,
        locationStatus: exactMatch.locationStatus as any,
        locationName: exactMatch.locationName
      };
      checkLocationAndProceed(fullExt);
      return;
    }

    if (!isNewItem) {
      setIsNewItem(true);
      setShowSuggestions(false);
      return;
    }

    if (manualSerial && manualMaterial) {
      onSelect({
        id: `new-${Date.now()}`,
        name: 'מטף חדש (לא מוכר)',
        serialNumber: manualSerial.trim(),
        materialNumber: manualMaterial.trim(),
        requiredCounters: [],
        isNew: true,
        locationStatus: 'in_air' // New items are considered 'in_air' until assembled
      });
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-500 overflow-hidden relative">
      {/* ⚠️ Confirmation Modal */}
      {pendingExt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md" onClick={() => setPendingExt(null)}></div>
          <div className="relative bg-slate-900 border-2 border-amber-500/50 rounded-[40px] p-8 md:p-12 w-full max-w-lg shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h4 className="text-3xl font-black text-white mb-4 italic">תעשו טובה תבדקו שבחרתם נכון...</h4>

            <p className="text-xl text-slate-300 mb-8 font-bold leading-relaxed">
              רשום שהמטף הזה נמצא <span className="text-amber-400 underline underline-offset-4">{pendingExt.locationName}</span>.
              <br />
              בטוח שזה המטף?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { onSelect(pendingExt); setPendingExt(null); }}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xl transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20"
              >
                אני בטוח
              </button>
              <button
                onClick={() => setPendingExt(null)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-lg transition-all border border-white/10"
              >
                וואלה טעות שלי
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white leading-tight">
            {actionType === ActionType.ASSEMBLE ? 'הרכבת מטף' : actionType === ActionType.DISASSEMBLE ? 'פירוק מטף' : 'זיהוי מטף'}
          </h2>
          <p className="text-slate-400 text-lg mt-1 font-bold italic">
            {isVerified === null ? 'אימות מטף מותקן' : 'זיהוי מטף לביצוע פעולה'}
          </p>
        </div>
        <button onClick={onBack} className="p-4 bg-slate-800 rounded-2xl active:bg-slate-700 transition-colors shadow-lg">
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Recommended for current vehicle / Inventory List */}
      <div className={`flex-1 ${isVerified === null ? 'flex flex-col overflow-hidden' : 'overflow-y-auto scrollbar-hide'} mb-6 pr-1 min-h-0`}>
        {isVerified === null ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col h-full">
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-[40px] p-4 md:p-8 flex-1 flex flex-col justify-between shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-black text-white text-center mb-4 md:mb-6 leading-tight">
                {actionType === ActionType.ASSEMBLE ? 'זה המטף המותקן כרגע. נמשיך איתו להרכבה?' : 'האם זה המטף שברצונך לפרק?'}
              </h3>

              {extinguishers.map((ext) => (
                <div key={ext.id} className="flex flex-col gap-4 md:gap-8 flex-1 justify-center">
                  {/* Extinguisher Details Card */}
                  <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-[32px] p-6 md:p-10 text-center shadow-2xl relative overflow-hidden shrink-0">
                    <div className="relative z-10">
                      <div className="flex flex-col items-center gap-4">
                        <StatusBadge status="current_vehicle" />

                        <div className="flex flex-col gap-2">
                          <div className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg">
                            <span className="text-slate-500 text-xl md:text-2xl ml-2 font-bold opacity-50">מס"ד:</span>
                            {ext.serialNumber}
                          </div>

                          {ext.materialNumber && (
                            <div className="text-3xl md:text-5xl font-black text-orange-500 tracking-tighter drop-shadow-md">
                              <span className="text-orange-500/50 text-lg md:text-xl ml-2 font-bold opacity-40">מק"ט:</span>
                              {ext.materialNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Subtle Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-6 md:gap-10 shrink-0">
                    <button
                      onClick={() => setIsVerified(false)}
                      className="group relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-red-600 border-b-8 border-red-900 rounded-[32px] active:translate-y-2 active:border-b-0 transition-all shadow-xl"
                    >
                      <svg className="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <button
                      onClick={() => checkLocationAndProceed(ext)}
                      className="group relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-emerald-600 border-b-8 border-emerald-900 rounded-[32px] active:translate-y-2 active:border-b-0 transition-all shadow-xl"
                    >
                      <svg className="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Global Search / Manual Entry Input - MOVED TO TOP */}
            <div className={`bg-slate-800/50 p-4 md:p-6 rounded-3xl border-2 transition-all duration-300 shrink-0 ${isNewItem ? 'border-orange-500 shadow-2xl ring-4 ring-orange-500/10' : 'border-slate-700'}`}>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <label className="block text-orange-400 font-black mr-2 text-base md:text-xl uppercase tracking-tight">
                  {isNewItem
                    ? 'פריט לא נמצא - חובה להזין מק"ט'
                    : actionType === ActionType.DISASSEMBLE
                      ? 'הזן מס"ד של המטף שמותקן בפועל:'
                      : 'הזן מס"ד של המטף להרכבה:'}
                </label>
                {isNewItem && (
                  <button onClick={() => setIsNewItem(false)} className="text-[10px] md:text-xs text-orange-400 underline font-black">ביטול</button>
                )}
              </div>

              <div className="space-y-3 relative">
                {/* Serial Number Field */}
                <div className="flex gap-2 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={manualSerial}
                    readOnly={isNewItem}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setManualSerial(e.target.value);
                      setShowSuggestions(true);
                      setIsNewItem(false);
                    }}
                    placeholder="הקלד מס' מס״ד..."
                    className={`flex-1 min-w-0 bg-slate-950 border-2 rounded-2xl p-3 md:p-4 text-lg md:text-xl font-bold text-white outline-none transition-all ${isNewItem ? 'border-emerald-500/30 opacity-60' : 'border-slate-700 focus:border-orange-500'}`}
                  />
                  {!isNewItem && (
                    <button
                      onClick={handleManualSubmit}
                      disabled={!manualSerial.trim()}
                      className="bg-orange-500 disabled:bg-slate-700 text-white px-4 md:px-6 rounded-2xl active:scale-95 transition-all shadow-lg shrink-0"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Suggestions Overlay */}
                  {!isNewItem && showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 max-h-72 overflow-y-auto scrollbar-hide">
                      <div className="bg-slate-800 px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 flex justify-between items-center">
                        <span>תוצאות ממלאי ארגוני</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded-full text-orange-500">{suggestions.length}</span>
                      </div>
                      {suggestions.map((item) => (
                        <button
                          key={item.serialNumber}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full p-4 text-right hover:bg-orange-500/10 hover:text-orange-400 text-white font-bold border-b border-slate-800 last:border-0 flex justify-between items-center transition-colors group"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-lg font-black text-white tracking-tighter">
                                <span className="text-slate-500 text-[10px] ml-1 font-bold">מס"ד:</span>
                                {item.serialNumber}
                              </div>
                              <StatusBadge status={item.locationStatus} name={item.locationName} storageLocation={storageLocation} />
                            </div>
                            {item.materialNumber && (
                              <div className="text-xs font-black text-orange-500 tracking-tighter">
                                <span className="text-orange-500/50 text-[8px] ml-1 font-bold">מק"ט:</span>
                                {item.materialNumber}
                              </div>
                            )}
                          </div>
                          <svg className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* New Item - Material Number Field Flow */}
                {isNewItem && (
                  <div className="flex gap-2 animate-in slide-in-from-top-4 duration-300">
                    <input
                      type="text"
                      autoFocus
                      value={manualMaterial}
                      onChange={(e) => setManualMaterial(e.target.value)}
                      placeholder="הזן מספר מק״ט (Material)..."
                      className="flex-1 min-w-0 bg-slate-950 border-2 border-orange-500 rounded-2xl p-3 md:p-4 text-lg md:text-xl font-bold text-white outline-none focus:ring-4 focus:ring-orange-500/20"
                    />
                    <button
                      onClick={handleManualSubmit}
                      disabled={!manualMaterial.trim()}
                      className="bg-emerald-500 disabled:bg-slate-700 text-white px-4 md:px-6 rounded-2xl active:scale-95 transition-all shadow-lg shrink-0"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {actionType === ActionType.ASSEMBLE && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2 mb-2">
                  או בחר מטף להרכבה מהמלאי:
                </h3>
                {inventory.length > 0 ? (
                  inventory.map((ext) => (
                    <button
                      key={ext.id}
                      onClick={() => checkLocationAndProceed(ext)}
                      className="w-full flex items-center p-3 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl active:bg-orange-600 active:border-orange-400 transition-all shadow-md text-right group"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-slate-500 text-[10px] font-black uppercase">מס"ד:</span>
                            <span className="text-xl font-black text-white tracking-tighter leading-none">{ext.serialNumber}</span>
                            <StatusBadge status={ext.locationStatus} name={ext.locationName} storageLocation={storageLocation} />
                          </div>
                          {ext.materialNumber && (
                            <div className="flex items-center gap-2">
                              <span className="text-orange-400/50 text-[9px] font-black uppercase">מק"ט:</span>
                              <span className="text-sm font-black text-orange-400 tracking-tighter leading-none">{ext.materialNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-700/50 flex items-center justify-center group-active:bg-white/20 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-700 font-bold italic">
                    אין פריטים זמינים במלאי
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentifyScreen;
