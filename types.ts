
// Fix: Removed broken 'armament' declaration and redundant FlowStep enum.
export enum FlowStep {
  TRIGGER = 'TRIGGER',
  IDENTIFY = 'IDENTIFY',
  DATA_ENTRY = 'DATA_ENTRY',
  SUCCESS = 'SUCCESS',
  AUDIT_CHECK = 'AUDIT_CHECK',
  AUDIT_SUMMARY = 'AUDIT_SUMMARY',
  DISASSEMBLE_REASON = 'DISASSEMBLE_REASON',
  NEXT_VEHICLE = 'NEXT_VE_INPUT',
  BATCH_SUMMARY = 'BATCH_SUMMARY',
  COUNTER_REPORTING = 'COUNTER_REPORTING',
  SYMBOL_AUDIT_LIST = 'SYMBOL_AUDIT_LIST'
}

export enum ActionType {
  DISASSEMBLE = 'DISASSEMBLE',
  ASSEMBLE = 'ASSEMBLE',
  SINGLE_VEHICLE_AUDIT = 'SINGLE_VEHICLE_AUDIT', // מיפוי כלי בודד
  SYMBOL_AUDIT = 'SYMBOL_AUDIT',                 // מיפוי סימול
  COUNTER_REPORTING = 'COUNTER_REPORTING'
}

export type CounterType = 'שע"מ' | 'ק"מ' | 'מייל';

export interface CounterValue {
  type: CounterType;
  value: string;
}

export type LocationStatus = 'current_vehicle' | 'other_vehicle' | 'unit_stock' | 'in_air';

export interface Extinguisher {
  id: string;
  name: string;
  serialNumber: string;
  materialNumber?: string;
  status?: 'ok' | 'anomaly' | null;
  actualSerialNumber?: string;
  actualMaterialNumber?: string;
  counters?: CounterValue[];
  requiredCounters?: CounterType[];
  isNew?: boolean;
  locationStatus?: LocationStatus;
  locationName?: string;
}

export interface AnomalyDetail {
  vehicleId: string;
  oldSerial: string;
  newSerial: string;
  oldMaterial?: string;
  newMaterial?: string;
  itemName: string;
}

export interface BatchStats {
  vehiclesCount: number;
  extinguishersChecked: number;
  anomaliesFound: number;
  vehiclesList: string[];
  anomaliesList: AnomalyDetail[];
}

export interface LastAction {
  type: string;
  timestamp: string;
  details?: {
    oldSerial?: string;
    newSerial?: string;
    newMaterial?: string;
  }
}
