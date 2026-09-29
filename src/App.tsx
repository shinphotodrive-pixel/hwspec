import React, { useState, useMemo } from 'react';
import { ComponentItem, PowerBudgetSettings, SagSimulationSettings, SystemPreset } from './types';
import { INITIAL_COMPONENTS, SYSTEM_PRESETS } from './data/initialData';
import { Header } from './components/Header';
import { SummaryKpis } from './components/SummaryKpis';
import { ComponentExplorer } from './components/ComponentExplorer';
import { EnergyBudgetCalculator } from './components/EnergyBudgetCalculator';
import { VoltageSagSimulator } from './components/VoltageSagSimulator';
import { EngineeringDeepDive } from './components/EngineeringDeepDive';
import { SystemRecommendations } from './components/SystemRecommendations';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';

export default function App() {
  const [components, setComponents] = useState<ComponentItem[]>(INITIAL_COMPONENTS);
  const [activePresetId, setActivePresetId] = useState<string>('standard');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  const [budgetSettings, setBudgetSettings] = useState<PowerBudgetSettings>({
    dutyCyclePercent: 15,
    autonomyDays: 3,
    sunHours: 3.5,
    batteryChemistry: 'lifepo4',
    systemVoltage: 12.8,
    dodPercent: 80,
    solarLossFactor: 1.25,
  });

  const [sagSettings, setSagSettings] = useState<SagSimulationSettings>({
    capacitanceUf: 10000,
    wireLengthMeters: 2,
    wireGaugeAWG: 18,
    pulsePowerWatts: 600,
    pulseDurationMs: 1.6,
    busVoltage: 24,
  });

  // Calculate high-level system totals
  const totalIdleW = useMemo(() => {
    return components.reduce((acc, c) => acc + c.idlePower, 0);
  }, [components]);

  const totalActiveW = useMemo(() => {
    return components.reduce((acc, c) => acc + c.activePower, 0);
  }, [components]);

  const peakW = useMemo(() => {
    return Math.max(...components.map((c) => c.peakPower || c.activePower), 600);
  }, [components]);

  // Daily energy Wh calculation
  const activeHours = 24 * (budgetSettings.dutyCyclePercent / 100);
  const idleHours = 24 - activeHours;

  const totalDailyWh = useMemo(() => {
    return components.reduce((acc, c) => {
      return acc + (c.idlePower * idleHours) + (c.activePower * activeHours);
    }, 0);
  }, [components, activeHours, idleHours]);

  // Battery capacity calculation
  const requiredBatteryWh = useMemo(() => {
    const dod = budgetSettings.dodPercent / 100;
    return (totalDailyWh * budgetSettings.autonomyDays) / dod;
  }, [totalDailyWh, budgetSettings.autonomyDays, budgetSettings.dodPercent]);

  const requiredBatteryAh = useMemo(() => {
    return requiredBatteryWh / budgetSettings.systemVoltage;
  }, [requiredBatteryWh, budgetSettings.systemVoltage]);

  // Solar sizing calculation
  const requiredSolarWatts = useMemo(() => {
    return (totalDailyWh * budgetSettings.solarLossFactor) / budgetSettings.sunHours;
  }, [totalDailyWh, budgetSettings.solarLossFactor, budgetSettings.sunHours]);

  // Calculate estimated minimum 5V rail voltage
  const minRailVoltage = useMemo(() => {
    const busV = sagSettings.busVoltage;
    const peakCurrent = sagSettings.pulsePowerWatts / busV;
    const wireResistance = 0.021 * sagSettings.wireLengthMeters * 2;
    const rawDropBus = peakCurrent * (wireResistance + 0.015);
    const bufferMitigation = Math.min(
      0.92,
      (sagSettings.capacitanceUf / 10000) * 0.72 + (sagSettings.capacitanceUf / 20000) * 0.20
    );
    const max5VDrop = Math.min(1.15, (rawDropBus / busV) * 5.0 * 2.2);
    const actual5VDrop = max5VDrop * (1 - bufferMitigation);
    return Math.max(3.85, parseFloat((5.05 - actual5VDrop).toFixed(2)));
  }, [sagSettings]);

  // Preset switch handler
  const handleSelectPreset = (preset: SystemPreset) => {
    setActivePresetId(preset.id);
    setBudgetSettings((prev) => ({
      ...prev,
      dutyCyclePercent: preset.dutyCycle,
      autonomyDays: preset.autonomyDays,
      sunHours: preset.sunHours,
    }));
    setSagSettings((prev) => ({
      ...prev,
      capacitanceUf: preset.capacitanceUf,
    }));
  };

  // Component management
  const handleUpdateComponent = (updated: ComponentItem) => {
    setComponents((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAddComponent = (newComp: ComponentItem) => {
    setComponents((prev) => [...prev, newComp]);
  };

  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1e293b] font-sans antialiased selection:bg-teal-200 selection:text-teal-900">
      {/* Navigation Header */}
      <Header
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Intro & KPI Overview */}
        <SummaryKpis
          totalIdleW={totalIdleW}
          totalActiveW={totalActiveW}
          peakW={peakW}
          batteryAh={requiredBatteryAh}
          batteryWh={requiredBatteryWh}
          autonomyDays={budgetSettings.autonomyDays}
          dutyCycle={budgetSettings.dutyCyclePercent}
        />

        {/* Section 1: Detailed Component Specs & Recharts Bar Chart */}
        <ComponentExplorer
          components={components}
          onUpdateComponent={handleUpdateComponent}
          onAddComponent={handleAddComponent}
          onDeleteComponent={handleDeleteComponent}
        />

        {/* Section 2: Energy Budget & Battery Autonomy Calculator with Donut Chart */}
        <EnergyBudgetCalculator
          components={components}
          settings={budgetSettings}
          onUpdateSettings={setBudgetSettings}
        />

        {/* Section 3: Voltage Sag Transient Simulator with Recharts Line Chart */}
        <VoltageSagSimulator
          settings={sagSettings}
          onUpdateSettings={setSagSettings}
        />

        {/* Section 4: Engineering Deep Dive (Thermal, Fan, Software Optimization) */}
        <EngineeringDeepDive />

        {/* Section 5: System Recommendations & Deployment Readiness Checklist */}
        <SystemRecommendations />
      </main>

      {/* Export Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        components={components}
        budgetSettings={budgetSettings}
        sagSettings={sagSettings}
        totalDailyWh={totalDailyWh}
        requiredBatteryAh={requiredBatteryAh}
        requiredSolarWatts={requiredSolarWatts}
        minRailVoltage={minRailVoltage}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
