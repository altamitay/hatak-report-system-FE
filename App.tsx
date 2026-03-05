
import React, { useState } from 'react';
import { FlowStep, ActionType, Extinguisher, BatchStats, CounterValue, AnomalyDetail, LastAction } from './types';
import TriggerScreen from './components/TriggerScreen';
import IdentifyScreen from './components/IdentifyScreen';
import DataEntryScreen from './components/DataEntryScreen';
import SuccessScreen from './components/SuccessScreen';
import AuditScreen from './components/AuditScreen';
import AuditSummaryScreen from './components/AuditSummaryScreen';
import NextVehicleScreen from './components/NextVehicleScreen';
import BatchSummaryScreen from './components/BatchSummaryScreen';
import DisassembleReasonScreen from './components/DisassembleReasonScreen';

// Each vehicle now has exactly one extinguisher as per user requirement
const VEHICLE_EXTINGUISHERS: Extinguisher[] = [
  { id: '1', name: 'מטף ראשי', serialNumber: '12345', materialNumber: 'M-100', status: null, counters: [], requiredCounters: ['שע"מ', 'ק"מ'], locationStatus: 'current_vehicle' },
];

const INVENTORY_EXTINGUISHERS: Extinguisher[] = [
  { id: '101', name: 'מטף אבקה 6 ק"ג', serialNumber: 'S-9901', materialNumber: 'MAT-662', counters: [], requiredCounters: [], locationStatus: 'unit_stock' },
  { id: '102', name: 'מטף אבקה 6 ק"ג', serialNumber: 'S-9902', materialNumber: 'MAT-662', counters: [], requiredCounters: [], locationStatus: 'unit_stock' },
  { id: '103', name: 'מטף הלון 2.5 ק"ג', serialNumber: 'H-4410', materialNumber: 'MAT-884', counters: [], requiredCounters: [], locationStatus: 'unit_stock' },
  { id: '104', name: 'מטף הלון 2.5 ק"ג', serialNumber: 'H-4411', materialNumber: 'MAT-884', counters: [], requiredCounters: [], locationStatus: 'unit_stock' },
];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>(FlowStep.TRIGGER);
  const [action, setAction] = useState<ActionType | null>(null);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<Extinguisher | null>(null);
  const [disassembleReason, setDisassembleReason] = useState<string | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState('123456');

  const [auditList, setAuditList] = useState<Extinguisher[]>(VEHICLE_EXTINGUISHERS);
  const [batchStats, setBatchStats] = useState<BatchStats>({
    vehiclesCount: 0,
    extinguishersChecked: 0,
    anomaliesFound: 0,
    vehiclesList: [],
    anomaliesList: []
  });
  const [storageLocation, setStorageLocation] = useState('A102');
  const [lastAction, setLastAction] = useState<LastAction | null>({
    type: 'דווחה החלפה',
    timestamp: '05/03/2026, 11:20',
    details: {
      oldSerial: '12345',
      newSerial: 'S-12345',
      newMaterial: 'MAT-505'
    }
  });

  const handleActionSelect = (type: ActionType) => {
    setAction(type);
    if (type === ActionType.AUDIT) {
      setAuditList(VEHICLE_EXTINGUISHERS.map(e => ({ ...e, status: null, actualSerialNumber: '', actualMaterialNumber: '' })));
      setCurrentStep(FlowStep.AUDIT_CHECK);
    } else if (type === ActionType.COUNTER_REPORTING) {
      setSelectedExtinguisher({
        id: 'vehicle-meters',
        name: 'מוני כלי',
        serialNumber: currentVehicleId,
        requiredCounters: ['שע"מ', 'ק"מ']
      });
      setCurrentStep(FlowStep.DATA_ENTRY);
    } else {
      setCurrentStep(FlowStep.IDENTIFY);
    }
  };

  const handleExtinguisherSelect = (ext: Extinguisher) => {
    setSelectedExtinguisher(ext);
    if (action === ActionType.DISASSEMBLE) {
      setCurrentStep(FlowStep.DISASSEMBLE_REASON);
    } else {
      setCurrentStep(FlowStep.DATA_ENTRY);
    }
  };

  const handleReasonSelect = (reason: string, destination: string) => {
    setDisassembleReason(reason);
    // Optionally store destination if needed for summary, for now we just proceed
    setCurrentStep(FlowStep.DATA_ENTRY);
  };

  const handleAuditFinish = () => {
    setCurrentStep(FlowStep.AUDIT_SUMMARY);
  };

  const handleAuditFinalSubmit = (counters: CounterValue[]) => {
    const anomalies = auditList.filter(e => e.status === 'anomaly');
    const newAnomalyDetails: AnomalyDetail[] = anomalies.map(e => ({
      vehicleId: currentVehicleId,
      oldSerial: e.serialNumber,
      newSerial: e.actualSerialNumber || '---',
      newMaterial: e.actualMaterialNumber,
      itemName: e.name
    }));

    setBatchStats(prev => ({
      vehiclesCount: prev.vehiclesCount + 1,
      extinguishersChecked: prev.extinguishersChecked + auditList.length,
      anomaliesFound: prev.anomaliesFound + anomalies.length,
      vehiclesList: [...prev.vehiclesList, currentVehicleId],
      anomaliesList: [...prev.anomaliesList, ...newAnomalyDetails]
    }));
    // Fix: Using FlowStep.NEXT_VEHICLE as defined in types.ts instead of FlowStep.NEXT_VE_INPUT
    setCurrentStep(FlowStep.NEXT_VEHICLE);
  };

  const handleNewVehicle = (newId: string) => {
    setCurrentVehicleId(newId);
    setAuditList(VEHICLE_EXTINGUISHERS.map(e => ({ ...e, status: null, actualSerialNumber: '', actualMaterialNumber: '' })));
    setCurrentStep(FlowStep.AUDIT_CHECK);
  };

  const handleReset = () => {
    setAction(null);
    setSelectedExtinguisher(null);
    setDisassembleReason(null);
    setBatchStats({
      vehiclesCount: 0,
      extinguishersChecked: 0,
      anomaliesFound: 0,
      vehiclesList: [],
      anomaliesList: []
    });
    setCurrentStep(FlowStep.TRIGGER);
  };

  const renderStep = () => {
    switch (currentStep) {
      case FlowStep.TRIGGER:
        return (
          <TriggerScreen
            onSelect={handleActionSelect}
            installedHatak={VEHICLE_EXTINGUISHERS[0]}
            storageLocation={storageLocation}
            lastAction={lastAction}
          />
        );
      case FlowStep.IDENTIFY:
        return (
          <IdentifyScreen
            extinguishers={VEHICLE_EXTINGUISHERS}
            inventory={INVENTORY_EXTINGUISHERS}
            onSelect={handleExtinguisherSelect}
            onBack={handleReset}
            actionType={action}
            storageLocation={storageLocation}
          />
        );
      case FlowStep.DISASSEMBLE_REASON:
        return (
          <DisassembleReasonScreen
            extinguisher={selectedExtinguisher}
            onSelect={handleReasonSelect}
            onBack={() => setCurrentStep(FlowStep.IDENTIFY)}
          />
        );
      case FlowStep.DATA_ENTRY:
        return (
          <DataEntryScreen
            onConfirm={(counters: CounterValue[]) => {
              if (selectedExtinguisher) {
                setSelectedExtinguisher({ ...selectedExtinguisher, counters });
              } else if (action === ActionType.COUNTER_REPORTING) {
                setSelectedExtinguisher({
                  id: 'vehicle-meters',
                  name: 'מוני כלי',
                  serialNumber: currentVehicleId,
                  counters
                });
              }
              setCurrentStep(FlowStep.SUCCESS);
            }}
            onBack={() => {
              if (action === ActionType.DISASSEMBLE) {
                setCurrentStep(FlowStep.DISASSEMBLE_REASON);
              } else if (action === ActionType.COUNTER_REPORTING) {
                handleReset();
              } else {
                setCurrentStep(FlowStep.IDENTIFY);
              }
            }}
            extinguisher={selectedExtinguisher}
            reason={disassembleReason}
          />
        );
      case FlowStep.AUDIT_CHECK:
        return (
          <AuditScreen
            items={auditList}
            setItems={setAuditList}
            onFinish={handleAuditFinish}
            onBack={handleReset}
            vehicleId={currentVehicleId}
            storageLocation={storageLocation}
          />
        );
      case FlowStep.AUDIT_SUMMARY:
        return (
          <AuditSummaryScreen
            items={auditList}
            onConfirm={handleAuditFinalSubmit}
            onBack={() => setCurrentStep(FlowStep.AUDIT_CHECK)}
          />
        );
      // Fix: Updated from FlowStep.NEXT_VE_INPUT to FlowStep.NEXT_VEHICLE
      case FlowStep.NEXT_VEHICLE:
        return (
          <NextVehicleScreen
            onNext={handleNewVehicle}
            onFinishBatch={() => setCurrentStep(FlowStep.BATCH_SUMMARY)}
          />
        );
      case FlowStep.BATCH_SUMMARY:
        return <BatchSummaryScreen stats={batchStats} onFinish={handleReset} />;
      case FlowStep.SUCCESS:
        return (
          <SuccessScreen
            extinguisher={selectedExtinguisher}
            onFinish={handleReset}
          />
        );
      default:
        return <TriggerScreen onSelect={handleActionSelect} />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0F172A] text-slate-100 overflow-hidden font-['Assistant'] relative">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full"></div>
      </div>

      <header className="px-6 py-2 flex justify-between items-center border-b border-white/10 bg-white/5 backdrop-blur-xl shrink-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black opacity-70 leading-none">ניהול אמצעי כיבוי</h1>
          <p className="text-lg font-black text-white tracking-tight">צ': {currentVehicleId}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-left">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">טכנאי מורשה</p>
            <p className="text-sm font-black">אלכס ב.</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center backdrop-blur-md shadow-lg shadow-orange-500/10">
            <span className="text-sm font-black text-orange-500">א"ב</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide relative p-2 md:p-6 z-10">
        {renderStep()}
      </main>

      {currentStep !== FlowStep.TRIGGER && (
        <div className="px-6 pb-2 flex gap-2 shrink-0">
          {(action === ActionType.DISASSEMBLE ? [1, 2, 3, 4] : action === ActionType.COUNTER_REPORTING ? [1, 2] : [1, 2, 3]).map((stepIdx) => {
            let isActive = false;
            if (action === ActionType.DISASSEMBLE) {
              if (stepIdx === 1) isActive = currentStep === FlowStep.IDENTIFY;
              if (stepIdx === 2) isActive = currentStep === FlowStep.DISASSEMBLE_REASON;
              if (stepIdx === 3) isActive = currentStep === FlowStep.DATA_ENTRY;
              if (stepIdx === 4) isActive = currentStep === FlowStep.SUCCESS;
            } else if (action === ActionType.COUNTER_REPORTING) {
              if (stepIdx === 1) isActive = currentStep === FlowStep.DATA_ENTRY;
              if (stepIdx === 2) isActive = currentStep === FlowStep.SUCCESS;
              // Only 2 steps for counter reporting
            } else {
              if (stepIdx === 1) {
                isActive = currentStep === FlowStep.IDENTIFY || currentStep === FlowStep.AUDIT_CHECK;
              } else if (stepIdx === 2) {
                isActive = currentStep === FlowStep.DATA_ENTRY ||
                  currentStep === FlowStep.AUDIT_SUMMARY ||
                  currentStep === FlowStep.NEXT_VEHICLE;
              } else if (stepIdx === 3) {
                isActive = currentStep === FlowStep.SUCCESS || currentStep === FlowStep.BATCH_SUMMARY;
              }
            }

            return (
              <div
                key={stepIdx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-slate-800'
                  }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
