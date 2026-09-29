import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ComponentItem, PowerBudgetSettings, BatteryChemistry } from '../types';
import { Sun, Battery, Sliders, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';

interface EnergyBudgetCalculatorProps {
  components: ComponentItem[];
  settings: PowerBudgetSettings;
  onUpdateSettings: (newSettings: PowerBudgetSettings) => void;
}

const COLORS = [
  '#0f766e', // Teal
  '#d97706', // Amber
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#e11d48', // Rose
  '#059669', // Emerald
  '#475569', // Slate
  '#ea580c'  // Orange
];

export const EnergyBudgetCalculator: React.FC<EnergyBudgetCalculatorProps> = ({
  components,
  settings,
  onUpdateSettings,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeHours = 24 * (settings.dutyCyclePercent / 100);
  const idleHours = 24 - activeHours;

  let idleSumWh = 0;
  let activeSumWh = 0;

  const componentBreakdown = components.map((comp) => {
    const idleWh = comp.idlePower * idleHours;
    const activeWh = comp.activePower * activeHours;
    const totalWh = idleWh + activeWh;

    idleSumWh += idleWh;
    activeSumWh += activeWh;

    return {
      name: comp.nameKo.split('(')[0].trim(),
      fullName: comp.nameKo,
      wh: parseFloat(totalWh.toFixed(2)),
      idleWh: parseFloat(idleWh.toFixed(2)),
      activeWh: parseFloat(activeWh.toFixed(2))
    };
  });

  const totalDailyWh = idleSumWh + activeSumWh;

  // Battery sizing calculation:
  // Required Wh = (Total Daily Wh * Autonomy Days) / DoD
  const dod = settings.dodPercent / 100;
  const requiredBatteryWh = (totalDailyWh * settings.autonomyDays) / dod;
  const requiredBatteryAh = requiredBatteryWh / settings.systemVoltage;

  // Solar sizing calculation:
  // Solar Wattage = (Total Daily Wh * Solar Loss Factor) / Sun Hours
  const requiredSolarWatts = (totalDailyWh * settings.solarLossFactor) / settings.sunHours;

  // Recommended commercial sizes
  const recommendedBatteryAh = Math.ceil(requiredBatteryAh / 10) * 10;
  const recommendedSolarW = Math.ceil(requiredSolarWatts / 20) * 20;

  const handleChemistryChange = (chem: BatteryChemistry) => {
    let newDod = 80;
    if (chem === 'nmc') newDod = 70;
    if (chem === 'lead_acid') newDod = 50;

    onUpdateSettings({
      ...settings,
      batteryChemistry: chem,
      dodPercent: newDod
    });
  };

  return (
    <section id="calculator" className="space-y-6">
      <div className="border-b border-stone-200/80 pb-4">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-amber-600 rounded-sm inline-block"></span>
          2. 독립형 태양광&middot;배터리 전력 예산 & 자립일수 시뮬레이터
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          현장의 단속 빈도(운용 시간 비율), 자립 목표 일수, 일조 시간을 조정하여 daily 에너지 소비량과 최소 배터리/태양광 용량을 실시간 산정합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              현장 운용 변수 설정
            </h4>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {showAdvanced ? '간편 설정' : '고급 옵션'}
            </button>
          </div>

          {/* Slider 1: Duty Cycle */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-bold text-stone-800">
                단속 운용 비율 (Duty Cycle)
              </label>
              <span className="font-bold text-amber-700 font-mono" id="val-duty-display">
                {settings.dutyCyclePercent}% ({activeHours.toFixed(1)}시간/일)
              </span>
            </div>
            <input
              type="range"
              id="slider-duty"
              min="1"
              max="50"
              step="1"
              value={settings.dutyCyclePercent}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  dutyCyclePercent: parseFloat(e.target.value)
                })
              }
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>1% (한적한 국도)</span>
              <span>15% (기본 설계)</span>
              <span>50% (고속도로 상습)</span>
            </div>
          </div>

          {/* Slider 2: Autonomy Days */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-bold text-stone-800">
                무일조 연속 자립일수 (Autonomy Days)
              </label>
              <span className="font-bold text-teal-800 font-mono" id="val-autonomy-display">
                {settings.autonomyDays} 일
              </span>
            </div>
            <input
              type="range"
              id="slider-autonomy"
              min="1"
              max="7"
              step="1"
              value={settings.autonomyDays}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  autonomyDays: parseInt(e.target.value, 10)
                })
              }
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>1일 (최소)</span>
              <span>3일 (공공 표준)</span>
              <span>7일 (동절기/장마)</span>
            </div>
          </div>

          {/* Slider 3: Sun Hours */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-bold text-stone-800">
                일평균 유효 일조 시간 (Peak Sun Hours)
              </label>
              <span className="font-bold text-stone-700 font-mono" id="val-sun-display">
                {settings.sunHours} 시간
              </span>
            </div>
            <input
              type="range"
              id="slider-sun"
              min="2.0"
              max="5.0"
              step="0.1"
              value={settings.sunHours}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  sunHours: parseFloat(e.target.value)
                })
              }
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
            />
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>2.0시간 (겨울 음지)</span>
              <span>3.5시간 (국내 평균)</span>
              <span>5.0시간 (봄/가을 양지)</span>
            </div>
          </div>

          {/* Advanced Options Accordion */}
          {showAdvanced && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
              <span className="font-bold text-stone-800 block">고급 배터리 및 시스템 파라미터</span>

              <div>
                <label className="text-stone-600 block mb-1 font-semibold">배터리 셀 종류</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'lifepo4', label: 'LiFePO4 (80% DoD)' },
                    { id: 'nmc', label: '삼원계 (70% DoD)' },
                    { id: 'lead_acid', label: '납축전지 (50% DoD)' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleChemistryChange(b.id as BatteryChemistry)}
                      className={`p-1.5 text-center rounded-lg border font-semibold text-[11px] transition ${
                        settings.batteryChemistry === b.id
                          ? 'bg-teal-800 text-white border-teal-800'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">시스템 버스 전압</label>
                  <select
                    value={settings.systemVoltage}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        systemVoltage: parseFloat(e.target.value)
                      })
                    }
                    className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                  >
                    <option value={12.8}>12.8V (단일 LiFePO4 4S)</option>
                    <option value={24.0}>24.0V (직렬 8S / 24V 버스)</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">태양광 종합 손실률</label>
                  <select
                    value={settings.solarLossFactor}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        solarLossFactor: parseFloat(e.target.value)
                      })
                    }
                    className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                  >
                    <option value={1.2}>20% 손실 (MPPT 고효율)</option>
                    <option value={1.25}>25% 손실 (일반 야외 환경)</option>
                    <option value={1.35}>35% 손실 (오염 및 먼지 심함)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-600 space-y-1.5">
            <div className="flex justify-between">
              <span>적용 배터리:</span>
              <span className="font-semibold text-stone-800">
                {settings.batteryChemistry === 'lifepo4'
                  ? '리튬인산철 (LiFePO4 12.8V)'
                  : settings.batteryChemistry === 'nmc'
                  ? 'NMC 삼원계 리튬'
                  : '산업용 납축전지 (AGM)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>권장 안전 방전심도 (DoD):</span>
              <span className="font-semibold text-stone-800">{settings.dodPercent}% 적용</span>
            </div>
            <div className="flex justify-between">
              <span>태양광 손실 계수:</span>
              <span className="font-semibold text-stone-800 font-mono">
                {(settings.solarLossFactor * 100 - 100).toFixed(0)}% 손실 보정
              </span>
            </div>
          </div>
        </div>

        {/* Right: Results & Recharts Donut Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
          <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-2 text-sm sm:text-base">
            일일 에너지 소비 및 전력 설비 산정 결과
          </h4>

          {/* 3 Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-4 text-center">
              <span className="text-xs font-bold text-teal-800 block mb-1">
                일일 총 에너지 소비
              </span>
              <span className="text-2xl sm:text-3xl font-black text-teal-900 font-mono" id="calc-daily-wh">
                {totalDailyWh.toFixed(1)} Wh
              </span>
              <span className="text-[11px] text-teal-700 block mt-1">
                대기 {idleSumWh.toFixed(1)}Wh / 운용 {activeSumWh.toFixed(1)}Wh
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
              <span className="text-xs font-bold text-amber-900 block mb-1">
                필요 배터리 용량
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-800 font-mono" id="calc-battery-ah">
                {requiredBatteryAh.toFixed(1)} Ah
              </span>
              <span className="text-[11px] text-amber-700 block mt-1">
                {requiredBatteryWh.toFixed(0)} Wh ({settings.systemVoltage}V 기준)
              </span>
            </div>

            <div className="bg-stone-100/90 border border-stone-300/80 rounded-xl p-4 text-center">
              <span className="text-xs font-bold text-stone-700 block mb-1">
                최소 태양광 패널
              </span>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono" id="calc-solar-w">
                {requiredSolarWatts.toFixed(1)} W
              </span>
              <span className="text-[11px] text-stone-600 block mt-1">
                권장 상용 규격: {recommendedSolarW}W 급
              </span>
            </div>
          </div>

          {/* Donut Chart: Component Energy Share */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-800">
                일일 구성품별 에너지 소비 비중 (Wh/일)
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                Duty {settings.dutyCyclePercent}% 반영
              </span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={componentBreakdown}
                    dataKey="wh"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {componentBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const percent = ((data.wh / totalDailyWh) * 100).toFixed(1);
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg border border-stone-800">
                            <p className="font-bold text-amber-300">{data.fullName}</p>
                            <div className="flex justify-between gap-4">
                              <span>일일 소비:</span>
                              <span className="font-mono font-bold">{data.wh} Wh/일</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span>전체 비중:</span>
                              <span className="font-mono font-bold text-teal-300">{percent}%</span>
                            </div>
                            <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-700">
                              대기 {data.idleWh}Wh + 운용 {data.activeWh}Wh
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommended Hardware Specification Kit */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/90 text-xs space-y-2">
            <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              현장 조달 권장 규격 (BOM 가이드):
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
              <div className="p-2 bg-white rounded border border-stone-200">
                <span className="text-stone-500 block text-[10px]">배터리 팩</span>
                <strong className="text-stone-900 font-mono">
                  {settings.systemVoltage}V {recommendedBatteryAh}Ah LiFePO4
                </strong>
                <p className="text-[10px] text-stone-500 mt-0.5">스마트 BMS 내장형 / 과방전 차단 지원</p>
              </div>
              <div className="p-2 bg-white rounded border border-stone-200">
                <span className="text-stone-500 block text-[10px]">태양광 모듈 & MPPT</span>
                <strong className="text-stone-900 font-mono">
                  {recommendedSolarW}W 단결정 패널 + 10A MPPT
                </strong>
                <p className="text-[10px] text-stone-500 mt-0.5">단결정 PERC 고효율 셀, 음영 손실 최소화</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
