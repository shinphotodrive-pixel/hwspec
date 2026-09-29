export type ComponentCategory = 'compute' | 'optics' | 'power';

export interface ComponentItem {
  id: string;
  category: ComponentCategory;
  name: string;
  nameKo: string;
  specs: string;
  idlePower: number; // Watts
  activePower: number; // Watts
  peakPower?: number; // Watts
  voltage: string;
  operatingVoltageV: number;
  currentA?: string;
  notes: string;
  criticality: 'high' | 'medium' | 'low';
  isCustom?: boolean;
}

export type BatteryChemistry = 'lifepo4' | 'nmc' | 'lead_acid';

export interface PowerBudgetSettings {
  dutyCyclePercent: number; // 1 ~ 50%
  autonomyDays: number; // 1 ~ 7 days
  sunHours: number; // 2.0 ~ 5.0 hours
  batteryChemistry: BatteryChemistry;
  systemVoltage: number; // 12.8V or 24V
  dodPercent: number; // 80% for LiFePO4, 70% for NMC, 50% for Lead Acid
  solarLossFactor: number; // 1.25 (20% loss)
}

export interface SagSimulationSettings {
  capacitanceUf: number; // 0 to 20000 uF
  wireLengthMeters: number; // 1 to 10m
  wireGaugeAWG: 16 | 18 | 20 | 22;
  pulsePowerWatts: number; // 600W
  pulseDurationMs: number; // 1.6ms
  busVoltage: 12.8 | 24;
}

export interface SystemPreset {
  id: string;
  name: string;
  description: string;
  dutyCycle: number;
  autonomyDays: number;
  sunHours: number;
  capacitanceUf: number;
}
