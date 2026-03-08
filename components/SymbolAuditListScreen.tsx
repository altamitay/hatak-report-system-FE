
import React, { useState, useMemo } from 'react';
import { Extinguisher, LocationStatus } from '../types';

interface VehicleAuditStatus extends Extinguisher {
    tempVehicleId: string;
    isDone?: boolean;
    lastAudit?: string;
    // For visual consistency, App will populate these on done
    actualSerialNumber?: string;
    actualMaterialNumber?: string;
}

interface SymbolAuditListScreenProps {
    vehicles: VehicleAuditStatus[];
    onSelectVehicle: (vehicleId: string, isAnomaly: boolean, newSerial?: string, newMaterial?: string) => void;
    onBack: () => void;
    storageLocation: string;
}

const SymbolAuditListScreen: React.FC<SymbolAuditListScreenProps> = ({ vehicles, onSelectVehicle, onBack, storageLocation }) => {
    const [activeAnomalyId, setActiveAnomalyId] = useState<string | null>(null);
    const [newSerial, setNewSerial] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [isNewItemFlow, setIsNewItemFlow] = useState(false);
    const [showMaterialSuggestions, setShowMaterialSuggestions] = useState(false);

    const MOCK_MATERIALS = [
        { id: 'MAT-101', name: 'מטף אבקה 6 ק"ג' },
        { id: 'MAT-202', name: 'מטף הלון 2.5 ק"ג' },
        { id: 'MAT-909', name: 'מטף קצף 9 ליטר' },
        { id: 'MAT-505', name: 'מטף פחמן דו-חמצני' },
        { id: 'M-100', name: 'מטף ראשי' },
    ];

    const materialSuggestions = useMemo(() => {
        const term = newMaterial.toLowerCase();
        if (!term) return [];
        return MOCK_MATERIALS.filter(m => m.id.toLowerCase().includes(term) || m.name.includes(term));
    }, [newMaterial]);

    const handleAnomalyClick = (id: string) => {
        if (activeAnomalyId === id) {
            setActiveAnomalyId(null);
            setNewSerial('');
            setNewMaterial('');
            setIsNewItemFlow(false);
        } else {
            setActiveAnomalyId(id);
            setNewSerial('');
            setNewMaterial('');
            setIsNewItemFlow(false);
        }
    };

    const handleSerialSubmit = () => {
        if (newSerial.trim()) {
            setIsNewItemFlow(true);
        }
    };

    const doneCount = vehicles.filter(v => v.isDone).length;
    const progress = (doneCount / vehicles.length) * 100;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 overflow-hidden text-right font-['Assistant']">
            {/* Header with Progress Bar */}
            <div className="mb-6 flex flex-col gap-4 shrink-0 px-1">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">מיפוי סימול</h2>
                    </div>
                    <button onClick={onBack} className="w-14 h-14 bg-white/5 border-2 border-white/10 rounded-[20px] active:bg-slate-800 transition-all flex items-center justify-center shadow-lg active:scale-95 group">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Performance Progress */}
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">התקדמות מיפוי</span>
                        <span className="text-sm font-black text-white">{doneCount} מתוך {vehicles.length} כלים</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Vehicle List */}
            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide px-1 min-h-0 pb-16 overflow-x-hidden">
                {vehicles.map((v) => {
                    const hasChange = v.isDone && v.actualSerialNumber && v.actualSerialNumber !== v.serialNumber;

                    return (
                        <div
                            key={v.tempVehicleId}
                            className={`group relative overflow-hidden rounded-[30px] border-2 bg-white/5 border-white/10 shadow-xl transition-all duration-500`}
                        >
                            {/* Status Strip - Different colors for different report types */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500 
                                ${!v.isDone ? 'bg-white/10' : hasChange ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}
                            `} />

                            <div className="p-6 flex flex-col gap-5 relative z-10 w-full overflow-hidden">
                                {/* Card Content Row */}
                                <div className="flex items-start justify-between gap-2 md:gap-4 overflow-hidden">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-sm font-black uppercase tracking-widest px-3 py-1 rounded-xl bg-white/10 text-white border border-white/10 shadow-inner">
                                                רכב: {v.tempVehicleId}
                                            </div>
                                            {v.lastAudit && (
                                                <div className="text-[11px] font-bold text-slate-400">
                                                    בדיקה אחרונה: {v.lastAudit}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {/* Serial Info Block */}
                                            <div className="flex flex-col">
                                                {hasChange ? (
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-bold text-slate-500 line-through decoration-red-500/60 decoration-2">רשום: {v.serialNumber}</span>
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <div className="text-3xl font-black text-orange-400 tracking-tighter transition-all">
                                                                {v.actualSerialNumber}
                                                            </div>
                                                            <span className="text-[11px] bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-xl font-black uppercase border border-orange-500/30 whitespace-nowrap shadow-sm">
                                                                עודכן
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-4xl font-black text-white tracking-tighter leading-none">
                                                        {v.serialNumber}
                                                        <span className="text-xs text-slate-500 font-bold mr-3 opacity-60 uppercase tracking-widest leading-none">מס"ד רשום</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Material Info Block */}
                                            {(v.isDone ? v.actualMaterialNumber : v.materialNumber) && (
                                                <div className="flex items-center gap-3 bg-white/5 p-2 px-3 rounded-2xl border border-white/5 w-fit">
                                                    <div className="w-4 h-4 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
                                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,1)]" />
                                                    </div>
                                                    <span className="text-lg font-black text-white tracking-tight leading-none">
                                                        {v.isDone ? v.actualMaterialNumber : v.materialNumber}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">מק"ט פריט</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interaction Buttons - Compact and ensure no clipping */}
                                    <div className="flex items-center gap-1.5 shrink-0 overflow-visible">
                                        <button
                                            onClick={() => handleAnomalyClick(v.tempVehicleId)}
                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-[0.85] ${activeAnomalyId === v.tempVehicleId
                                                ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                                                : 'bg-white/5 border-white/5 hover:border-red-500/30 group active:bg-red-600/20'
                                                }`}
                                        >
                                            <svg className={`w-6 h-6 transition-colors ${activeAnomalyId === v.tempVehicleId ? 'text-white' : 'text-slate-500 group-hover:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => onSelectVehicle(v.tempVehicleId, false)}
                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-[0.85] ${v.isDone && !hasChange
                                                ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-600/20 group active:bg-emerald-600'
                                                }`}
                                        >
                                            <svg className={`w-7 h-7 transition-colors ${v.isDone && !hasChange ? 'text-white' : 'text-emerald-500 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Anomaly Data Entry Section */}
                                {activeAnomalyId === v.tempVehicleId && (
                                    <div className="animate-in slide-in-from-top-4 duration-500 space-y-4 pt-5 border-t border-white/10 relative z-10 mt-1 overflow-visible">
                                        <div className={`p-4 md:p-5 rounded-[24px] border-2 transition-all duration-500 ${isNewItemFlow ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 bg-black/20'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isNewItemFlow ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`} />
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        {isNewItemFlow ? 'פריט לא נמצא - חובה להזין מק"ט לחדש' : 'דיווח חריגה - הזן מס"ד שנמצא'}
                                                    </label>
                                                </div>
                                                {isNewItemFlow && (
                                                    <button onClick={() => setIsNewItemFlow(false)} className="px-2 py-1 text-[9px] bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors border border-white/5">החלף מס"ד</button>
                                                )}
                                            </div>

                                            <div className="space-y-4 relative w-full">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        autoFocus={!isNewItemFlow}
                                                        placeholder="הקלד מס״ד חדש..."
                                                        value={newSerial}
                                                        readOnly={isNewItemFlow}
                                                        onChange={(e) => { setNewSerial(e.target.value); setIsNewItemFlow(false); }}
                                                        className={`flex-1 min-w-0 bg-black/40 border-2 rounded-2xl p-3 md:p-4 text-lg md:text-xl font-black text-white outline-none transition-all ${isNewItemFlow ? 'border-emerald-500/20 opacity-50' : 'border-white/10 focus:border-red-500 shadow-inner'}`}
                                                    />
                                                    {!isNewItemFlow && (
                                                        <button
                                                            onClick={handleSerialSubmit}
                                                            disabled={!newSerial.trim()}
                                                            className="bg-red-600 hover:bg-red-500 disabled:opacity-20 text-white px-4 md:px-5 rounded-2xl active:scale-90 transition-all shadow-lg shrink-0"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>

                                                {isNewItemFlow && (
                                                    <div className="animate-in fade-in slide-in-from-top-2 relative space-y-4">
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                autoFocus
                                                                placeholder="הזן מק״ט ליצירת פריט חדש..."
                                                                value={newMaterial}
                                                                onFocus={() => setShowMaterialSuggestions(true)}
                                                                onBlur={() => setTimeout(() => setShowMaterialSuggestions(false), 200)}
                                                                onChange={(e) => { setNewMaterial(e.target.value); setShowMaterialSuggestions(true); }}
                                                                className="w-full bg-black/40 border-2 border-orange-500 rounded-2xl p-3 md:p-4 text-lg md:text-xl font-black text-white focus:ring-8 focus:ring-orange-500/10 outline-none shadow-inner"
                                                            />

                                                            {showMaterialSuggestions && materialSuggestions.length > 0 && (
                                                                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border-2 border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in slide-in-from-top-2 max-h-40 overflow-y-auto">
                                                                    {materialSuggestions.map(m => (
                                                                        <button
                                                                            key={m.id}
                                                                            onMouseDown={() => { setNewMaterial(m.id); setShowMaterialSuggestions(false); }}
                                                                            className="w-full p-4 text-right hover:bg-orange-500/10 text-white border-b border-white/5 last:border-0 flex flex-col items-end transition-colors"
                                                                        >
                                                                            <span className="text-lg font-black tracking-tight">{m.id}</span>
                                                                            <span className="text-[11px] font-bold text-slate-500">{m.name}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            disabled={!newMaterial.trim()}
                                                            onClick={() => onSelectVehicle(v.tempVehicleId, true, newSerial, newMaterial)}
                                                            className="w-full py-4 md:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:opacity-20 text-white rounded-2xl font-black text-lg shadow-[0_10px_20px_rgba(234,88,12,0.3)] transition-all active:scale-[0.98]"
                                                        >
                                                            אישור ויצירת פריט
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SymbolAuditListScreen;
