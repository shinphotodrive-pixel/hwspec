import React, { useState } from 'react';
import { ComponentItem, PowerBudgetSettings, SagSimulationSettings } from '../types';
import { Download, Copy, Printer, Check, X, FileText, ShieldCheck } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentItem[];
  budgetSettings: PowerBudgetSettings;
  sagSettings: SagSimulationSettings;
  totalDailyWh: number;
  requiredBatteryAh: number;
  requiredSolarWatts: number;
  minRailVoltage: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  components,
  budgetSettings,
  sagSettings,
  totalDailyWh,
  requiredBatteryAh,
  requiredSolarWatts,
  minRailVoltage,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const reportText = `[지능형 교통 감시 시스템 하드웨어 사양 및 전력 분석 보고서]
작성일: ${new Date().toLocaleDateString('ko-KR')}
시스템 공칭 전압: ${budgetSettings.systemVoltage}V
배터리 셀 종류: ${budgetSettings.batteryChemistry === 'lifepo4' ? 'LiFePO4 (80% DoD)' : 'NMC'}
무일조 자립일수: ${budgetSettings.autonomyDays}일
단속 운용 듀티 사이클: ${budgetSettings.dutyCyclePercent}% (${(24 * budgetSettings.dutyCyclePercent / 100).toFixed(1)}시간/일)
일평균 유효 일조 시간: ${budgetSettings.sunHours}시간

[전력 예산 산정 결과]
- 일일 총 에너지 소비량: ${totalDailyWh.toFixed(1)} Wh/일
- 필요 최소 배터리 용량: ${requiredBatteryAh.toFixed(1)} Ah (${(totalDailyWh * budgetSettings.autonomyDays / (budgetSettings.dodPercent / 100)).toFixed(0)} Wh)
- 권장 배터리 규격: ${budgetSettings.systemVoltage}V ${Math.ceil(requiredBatteryAh / 10) * 10}Ah LiFePO4 BMS 내장형
- 필요 최소 태양광 패널: ${requiredSolarWatts.toFixed(1)} W
- 권장 태양광 규격: ${Math.ceil(requiredSolarWatts / 20) * 20}W 단결정 패널 + 10A MPPT 제어기

[IR 600W 펄스 전압 강하 시뮬레이션]
- 디커플링 캐패시터 용량: ${sagSettings.capacitanceUf.toLocaleString()} µF
- 5V 레일 최저 도달 전압: ${minRailVoltage.toFixed(2)} V (리셋 임계치 4.75V 대비 ${minRailVoltage >= 4.75 ? '안전' : '위험'})

[구성품 목록]
${components.map((c, i) => `${i + 1}. ${c.nameKo} | 전압: ${c.voltage} | 대기: ${c.idlePower}W | 운용: ${c.activePower}W`).join('\n')}
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const data = {
      title: '지능형 교통 감시 시스템 하드웨어 및 전력 분석 보고서',
      generatedAt: new Date().toISOString(),
      budgetSettings,
      sagSettings,
      summary: {
        totalDailyWh,
        requiredBatteryAh,
        recommendedBatteryAh: Math.ceil(requiredBatteryAh / 10) * 10,
        requiredSolarWatts,
        recommendedSolarWatts: Math.ceil(requiredSolarWatts / 20) * 20,
        minRailVoltage,
        isSafe: minRailVoltage >= 4.75
      },
      components
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic_camera_power_spec_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                지능형 교통 감시 시스템 종합 사양서 및 전력 분석서
              </h3>
              <p className="text-xs text-teal-200">
                현장 조달 및 엔지니어링 납품용 기술 사양 리포트
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-teal-200 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-stone-700 font-sans">
          {/* Section 1: Executive KPI Grid */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <h5 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              핵심 전력 및 설비 산정 요약
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                <span className="text-stone-500 block text-[10px]">일일 총 소비량</span>
                <strong className="text-stone-900 text-sm font-mono">{totalDailyWh.toFixed(1)} Wh</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                <span className="text-stone-500 block text-[10px]">권장 배터리 ({budgetSettings.autonomyDays}일 자립)</span>
                <strong className="text-amber-800 text-sm font-mono">
                  {budgetSettings.systemVoltage}V {Math.ceil(requiredBatteryAh / 10) * 10}Ah
                </strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                <span className="text-stone-500 block text-[10px]">권장 태양광 패널</span>
                <strong className="text-teal-800 text-sm font-mono">
                  {Math.ceil(requiredSolarWatts / 20) * 20}W MPPT
                </strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                <span className="text-stone-500 block text-[10px]">5V 레일 최저 전압</span>
                <strong
                  className={`text-sm font-mono ${
                    minRailVoltage >= 4.75 ? 'text-teal-800' : 'text-rose-700'
                  }`}
                >
                  {minRailVoltage.toFixed(2)} V ({minRailVoltage >= 4.75 ? '안전' : '위험'})
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2: Component BOM Table */}
          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 text-sm">
              구성품별 하드웨어 사양 및 소모전력 내역
            </h5>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">구성품명</th>
                    <th className="p-2.5">동작 전압</th>
                    <th className="p-2.5 text-right">대기 (W)</th>
                    <th className="p-2.5 text-right">운용 (W)</th>
                    <th className="p-2.5">특기 사항</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono text-[11px]">
                  {components.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="p-2.5 font-sans font-medium text-stone-900">{c.nameKo}</td>
                      <td className="p-2.5 text-stone-600">{c.voltage}</td>
                      <td className="p-2.5 text-right text-teal-800 font-bold">{c.idlePower.toFixed(2)}</td>
                      <td className="p-2.5 text-right text-amber-700 font-bold">{c.activePower.toFixed(1)}</td>
                      <td className="p-2.5 font-sans text-stone-500 text-[10px] truncate max-w-xs">{c.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Engineering Installation Guidelines */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1.5 text-teal-950 text-xs">
            <h6 className="font-bold">설계 승인 엔지니어링 서명 규격:</h6>
            <ul className="list-disc list-inside space-y-1 text-stone-700">
              <li>IR 스트로브 전원선 24V 버스 분리 및 10,000µF 디커플링 버퍼 설치 확인 완료.</li>
              <li>라즈베리 파이 OS 커널 Wi-Fi/BT/HDMI 전원 차단 스크립트 탑재 확인.</li>
              <li>CPU 65°C 방열팬 N-MOSFET 히스테리시스 제어 회로 탑재 확인.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료!' : '텍스트 복사'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" />
              <span>JSON 내보내기</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
