
import React from 'react';
import { Extinguisher } from '../types';

interface SuccessScreenProps {
  extinguisher: Extinguisher | null;
  onFinish: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ extinguisher, onFinish }) => {
  if (!extinguisher) return null;

  const isVehicleReporting = extinguisher.id === 'vehicle-meters';

  return (
    <div className="h-full flex flex-col items-center justify-start text-center animate-in fade-in zoom-in duration-700 pt-6 pb-4 overflow-hidden">
      {/* Container with extra top padding to prevent icon clipping during bounce animation */}
      <div className="relative mb-4 pt-4 shrink-0">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce-custom">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight shrink-0">
        {isVehicleReporting ? 'מוני הכלי עודכנו בהצלחה!' : 'הדיווח נקלט בהצלחה!'}
      </h2>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 w-full max-w-sm mb-4 shadow-2xl shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-col gap-2 mb-3 relative z-10">
          <div className="text-3xl font-black text-white tracking-tighter drop-shadow-md">
            <span className="text-slate-500 text-sm ml-2 font-bold opacity-50">
              {isVehicleReporting ? 'צדיק:' : 'מס"ד:'}
            </span>
            {extinguisher.serialNumber}
          </div>
          {extinguisher.materialNumber && (
            <div className="text-xl font-black text-orange-400 tracking-tighter drop-shadow-sm">
              <span className="text-orange-400/50 text-xs ml-2 font-bold opacity-40">מק"ט:</span>
              {extinguisher.materialNumber}
            </div>
          )}
        </div>

        {extinguisher.counters && extinguisher.counters.length > 0 && (
          <div className="border-t border-white/10 pt-3 relative z-10">
            <p className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-widest opacity-60">נתונים שנשלחו ל-SAP:</p>
            <div className="grid grid-cols-1 gap-1.5">
              {extinguisher.counters.map((c, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 flex justify-between items-center px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] font-black text-slate-500 uppercase opacity-70">{c.type}</span>
                  <span className="text-base font-black text-emerald-400 tabular-nums">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onFinish}
        className="w-full py-4 bg-orange-500 text-white rounded-3xl text-xl font-black active:scale-95 shadow-xl shadow-orange-500/20 transition-all border-b-4 border-orange-700 hover:bg-orange-400 shrink-0"
      >
        חזור למסך הראשי
      </button>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default SuccessScreen;
