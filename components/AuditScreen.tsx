
import React, { useState } from 'react';
import { Extinguisher, LocationStatus, ActionType } from '../types';

interface AuditScreenProps {
  items: Extinguisher[];
  setItems: React.Dispatch<React.SetStateAction<Extinguisher[]>>;
  onFinish: () => void;
  onBack: () => void;
  vehicleId: string;
  storageLocation: string;
  actionType: ActionType | null;
}

// Global pool with location metadata for auditing
const GLOBAL_EXTINGUISHERS_POOL: Partial<Extinguisher>[] = [
  { serialNumber: 'S-1001', materialNumber: 'MAT-101', name: 'מטף אבקה 6 ק"ג', locationStatus: 'unit_stock' },
  { serialNumber: 'S-1002', materialNumber: 'MAT-101', name: 'מטף אבקה 6 ק"ג', locationStatus: 'other_vehicle', locationName: 'כלי 776-554' },
  { serialNumber: 'S-2001', materialNumber: 'MAT-202', name: 'מטף הלון 2.5 ק"ג', locationStatus: 'current_vehicle' },
  { serialNumber: 'S-2002', materialNumber: 'MAT-202', name: 'מטף הלון 2.5 ק"ג', locationStatus: 'in_air' },
  { serialNumber: 'S-9999', materialNumber: 'MAT-909', name: 'מטף קצף 9 ליטר', locationStatus: 'unit_stock' },
  { serialNumber: 'S-12345', materialNumber: 'MAT-505', name: 'מטף פחמן דו-חמצני', locationStatus: 'other_vehicle', locationName: 'כלי 112-233' },
  { serialNumber: '12345', materialNumber: 'M-100', name: 'מטף ראשי' }
];

const StatusBadge: React.FC<{ status?: LocationStatus; name?: string; storageLocation?: string }> = ({ status, name, storageLocation }) => {
  switch (status) {
    case 'current_vehicle':
      return <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full font-black border border-emerald-500/30">על כלי זה</span>;
    case 'other_vehicle':
      return <span className="bg-amber-500/20 text-amber-400 text-[8px] px-2 py-0.5 rounded-full font-black border border-amber-500/30">{name || 'כלי אחר'}</span>;
    case 'unit_stock':
      return <span className="bg-blue-500/20 text-blue-400 text-[8px] px-2 py-0.5 rounded-full font-black border border-blue-500/30 whitespace-nowrap">באתר אחסון {storageLocation || 'יחידה'}</span>;
    case 'in_air':
      return <span className="bg-slate-500/20 text-slate-400 text-[8px] px-2 py-0.5 rounded-full font-black border border-slate-500/30">באוויר</span>;
    default:
      return null;
  }
};

const AuditScreen: React.FC<AuditScreenProps> = ({ items, setItems, onFinish, onBack, vehicleId, storageLocation, actionType }) => {
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<string | null>(null);
  const [showMaterialSuggestionsFor, setShowMaterialSuggestionsFor] = useState<string | null>(null);

  const MOCK_MATERIALS = [
    { id: 'MAT-101', name: 'מטף אבקה 6 ק"ג' },
    { id: 'MAT-202', name: 'מטף הלון 2.5 ק"ג' },
    { id: 'MAT-909', name: 'מטף קצף 9 ליטר' },
    { id: 'MAT-505', name: 'מטף פחמן דו-חמצני' },
    { id: 'MAT-662', name: 'מטף אבקה 6 ק"ג (חדש)' },
    { id: 'MAT-884', name: 'מטף הלון 2.5 ק"ג (מדגם ב)' },
    { id: 'M-100', name: 'מטף ראשי' },
  ];

  const toggleStatus = (id: string, status: 'ok' | 'anomaly') => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status, actualSerialNumber: status === 'ok' ? '' : item.actualSerialNumber, actualMaterialNumber: '' } : item
    ));
    if (status === 'anomaly') {
      setShowSuggestionsFor(id);
    } else {
      setShowSuggestionsFor(null);
    }
  };

  const updateActualId = (id: string, actualId: string, fromSuggestion = false, suggestionMaterial?: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          actualSerialNumber: actualId,
          actualMaterialNumber: fromSuggestion ? (suggestionMaterial || '') : item.actualMaterialNumber
        };
      }
      return item;
    }));
    if (fromSuggestion) {
      setShowSuggestionsFor(null);
    }
  };

  const updateActualMaterial = (id: string, material: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, actualMaterialNumber: material } : item));
  };

  const isNewItem = (serial?: string) => {
    if (!serial || serial.trim() === '') return false;
    return !GLOBAL_EXTINGUISHERS_POOL.some(p => p.serialNumber === serial);
  };

  const allChecked = items.every(i => {
    if (i.status === null) return false;
    // Anomaly can be an empty serial (No Extinguisher)
    if (i.status === 'anomaly' && i.actualSerialNumber && i.actualSerialNumber.trim().length > 0) {
      if (isNewItem(i.actualSerialNumber)) {
        return i.actualMaterialNumber && i.actualMaterialNumber.length >= 1;
      }
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-left-8 duration-500 overflow-hidden text-right">
      <div className="mb-6 flex items-start justify-between shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white leading-tight">
            {actionType === ActionType.SINGLE_VEHICLE_AUDIT ? 'מיפוי כלי בודד' : 'מיפוי סימול'}
          </h2>
          <p className="text-slate-400 text-lg mt-1 font-bold italic">כלי: {vehicleId}</p>
        </div>
        <button onClick={onBack} className="p-4 bg-slate-800 rounded-2xl active:bg-slate-700 transition-colors shadow-lg">
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-1 min-h-0">
        {items.map((item) => (
          <div key={item.id} className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex-1">
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-black text-white tracking-tighter drop-shadow-md">
                    <span className="text-slate-500 text-sm ml-2 font-bold opacity-50">מס"ד:</span>
                    {item.serialNumber}
                  </div>
                  {item.materialNumber && (
                    <div className="text-lg font-black text-orange-400 tracking-tighter drop-shadow-sm">
                      <span className="text-orange-400/50 text-[10px] ml-2 font-bold opacity-40">מק"ט:</span>
                      {item.materialNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleStatus(item.id, 'anomaly')}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all backdrop-blur-md ${item.status === 'anomaly' ? 'bg-red-600 border-red-400 scale-105 shadow-lg shadow-red-900/40' : 'bg-black/40 border-white/10 active:bg-white/10'
                    }`}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={() => toggleStatus(item.id, 'ok')}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all backdrop-blur-md ${item.status === 'ok' ? 'bg-emerald-600 border-emerald-400 scale-105 shadow-lg shadow-emerald-900/40' : 'bg-black/40 border-white/10 active:bg-white/10'
                    }`}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>

            {item.status === 'anomaly' && (
              <div className="animate-in slide-in-from-top-2 duration-300 space-y-4 relative z-10">
                <div className="relative">
                  <label className="block text-slate-400 text-xs font-black mb-2 mr-1 uppercase tracking-tighter opacity-70">
                    הזן מס"ד שנמצא בפועל (או השאר ריק אם אין מטף):
                  </label>
                  <input
                    type="text"
                    placeholder="הקלד מספר מס״ד..."
                    value={item.actualSerialNumber || ''}
                    onFocus={() => setShowSuggestionsFor(item.id)}
                    onChange={(e) => {
                      updateActualId(item.id, e.target.value);
                      setShowSuggestionsFor(item.id);
                    }}
                    className="w-full bg-black/40 backdrop-blur-md border-2 border-white/10 rounded-2xl p-4 text-xl font-black text-white outline-none focus:border-red-500 transition-all placeholder:text-slate-800"
                  />

                  {showSuggestionsFor === item.id && item.actualSerialNumber && item.actualSerialNumber.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-20 max-h-56 overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-top-2">
                      <div className="bg-slate-800 px-4 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 flex justify-between">
                        <span>הצעות ממלאי ארגוני</span>
                        <span>SAP S/4HANA</span>
                      </div>
                      {GLOBAL_EXTINGUISHERS_POOL
                        .filter(s => s.serialNumber?.toLowerCase() === item.actualSerialNumber!.toLowerCase())
                        .map(suggestion => (
                          <button
                            key={suggestion.serialNumber}
                            onClick={() => updateActualId(item.id, suggestion.serialNumber!, true, suggestion.materialNumber)}
                            className="w-full p-4 text-right hover:bg-slate-800 text-slate-200 font-bold border-b border-slate-800 last:border-0 transition-colors flex justify-between items-center group"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-lg font-black text-white tracking-tighter">
                                  <span className="text-slate-500 text-[10px] ml-1 font-bold">מס"ד:</span>
                                  {suggestion.serialNumber}
                                </div>
                                <StatusBadge status={suggestion.locationStatus} name={suggestion.locationName} storageLocation={storageLocation} />
                              </div>
                              {suggestion.materialNumber && (
                                <div className="text-xs font-black text-orange-500 tracking-tighter">
                                  <span className="text-orange-500/50 text-[8px] ml-1 font-bold">מק"ט:</span>
                                  {suggestion.materialNumber}
                                </div>
                              )}
                            </div>
                            <svg className="w-4 h-4 text-slate-700 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Material number field if it's a new item */}
                {item.actualSerialNumber && item.actualSerialNumber.length > 0 && isNewItem(item.actualSerialNumber) && (
                  <div className="animate-in slide-in-from-top-4 duration-500 bg-orange-500/10 p-5 rounded-3xl border-2 border-orange-500/40 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                      <label className="block text-orange-400 text-sm font-black uppercase tracking-widest">
                        פריט לא מוכר - חובה להזין מק"ט (MATERIAL):
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="הזן מספר מק״ט של המטף שנמצא..."
                        value={item.actualMaterialNumber || ''}
                        onFocus={() => {
                          setShowSuggestionsFor(null);
                          setShowMaterialSuggestionsFor(item.id);
                        }}
                        onBlur={() => setTimeout(() => setShowMaterialSuggestionsFor(null), 200)}
                        onChange={(e) => {
                          updateActualMaterial(item.id, e.target.value);
                          setShowMaterialSuggestionsFor(item.id);
                        }}
                        className="w-full bg-slate-950 border-2 border-orange-500/60 rounded-2xl p-4 text-xl font-bold text-white outline-none focus:border-orange-400 transition-all placeholder:text-slate-800"
                      />

                      {/* Material Suggestions Overlay */}
                      {showMaterialSuggestionsFor === item.id && item.actualMaterialNumber && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border-2 border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl z-[30] animate-in fade-in slide-in-from-top-2 max-h-40 overflow-y-auto scrollbar-hide">
                          <div className="bg-slate-800 px-3 py-1 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">מק"טים מוכרים</div>
                          {MOCK_MATERIALS
                            .filter(m => m.id.toLowerCase().includes(item.actualMaterialNumber!.toLowerCase()) || m.name.includes(item.actualMaterialNumber!))
                            .map(m => (
                              <button
                                key={m.id}
                                onMouseDown={() => {
                                  updateActualMaterial(item.id, m.id);
                                  setShowMaterialSuggestionsFor(null);
                                }}
                                className="w-full p-3 text-right hover:bg-orange-500/10 text-white border-b border-white/5 last:border-0 transition-colors flex flex-col items-end"
                              >
                                <span className="font-black text-base">{m.id}</span>
                                <span className="text-slate-400 text-[10px] font-bold">{m.name}</span>
                              </button>
                            ))
                          }
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-[10px] text-orange-500/60 font-bold italic mr-1">המטף יירשם במערכת SAP כפריט חדש המשויך לכלי זה.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        disabled={!allChecked}
        onClick={onFinish}
        className={`mt-6 w-full py-6 shrink-0 rounded-3xl text-2xl font-black transition-all shadow-xl ${allChecked ? 'bg-orange-500 text-white shadow-orange-500/20 border-b-4 border-orange-700 active:translate-y-1 active:border-b-0 cursor-pointer' : 'bg-slate-800 text-slate-600 grayscale cursor-not-allowed opacity-50'
          }`}
      >
        סיום מיפוי והמשך
      </button>
    </div>
  );
};

export default AuditScreen;
