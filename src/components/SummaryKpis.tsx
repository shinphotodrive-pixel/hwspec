import React from 'react';
import { ShieldCheck, BatteryCharging, Zap, Gauge, Info, AlertTriangle } from 'lucide-react';

interface SummaryKpisProps {
  totalIdleW: number;
  totalActiveW: number;
  peakW: number;
  batteryAh: number;
  batteryWh: number;
  autonomyDays: number;
  dutyCycle: number;
}

export const SummaryKpis: React.FC<SummaryKpisProps> = ({
  totalIdleW,
  totalActiveW,
  peakW,
  batteryAh,
  batteryWh,
  autonomyDays,
  dutyCycle,
}) => {
  return (
    <section id="summary" className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
        {/* Banner header */}
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            24시간 야외 무인 독립형 / 에지 컴퓨팅 운용 기준
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            독립형 지능형 교통 감시 시스템 하드웨어 & 전력 프로파일
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            태양광 및 배터리 기반 야외 환경에서 24시간 중단 없이 가동되는 지능형 교통 감시 시스템의 
            7대 핵심 구성품 규격, 대기(Idle)와 운용(Active) 소비전력, 야간 IR 플래시의 <strong>600W 순간 피크 전력</strong>, 
            그리고 라즈베리 파이 저전압 리셋(Brownout)을 방지하기 위한 <strong>전압 강하(Voltage Sag) 완충 기술</strong>을 종합 분석합니다.
          </p>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* 1. Idle Power */}
          <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-5 hover:border-teal-300 transition-all">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">시스템 대기 전력 (Idle)</span>
              <Gauge className="w-4 h-4 text-teal-700" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-stone-900 tracking-tight" id="kpi-idle-power">
                {totalIdleW.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-stone-500">W</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-teal-800 font-semibold">24시간 기저 부하</span>
              <span className="text-stone-500 font-mono">{(totalIdleW * 24).toFixed(1)} Wh/일</span>
            </div>
          </div>

          {/* 2. Active Power */}
          <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">운용 평균 전력 (Active)</span>
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-700 tracking-tight" id="kpi-active-power">
                {totalActiveW.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-amber-700">W</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-amber-800 font-semibold">차량 인지 & IR 점등 시</span>
              <span className="text-stone-500 font-mono">Duty {dutyCycle}%</span>
            </div>
          </div>

          {/* 3. Peak Pulse */}
          <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-5 hover:border-rose-300 transition-all">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">IR 플래시 피크 전력</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-rose-700 tracking-tight" id="kpi-peak-power">
                {peakW}
              </span>
              <span className="text-sm font-bold text-rose-700">W</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-rose-800 font-semibold">0.1~1.6ms 초단기 맥동</span>
              <span className="text-stone-500 font-mono">24V 25A 펄스</span>
            </div>
          </div>

          {/* 4. Battery Recommendation */}
          <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-5 hover:border-teal-300 transition-all">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">권장 {autonomyDays}일 자립 배터리</span>
              <BatteryCharging className="w-4 h-4 text-teal-700" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-teal-800 tracking-tight" id="kpi-battery-capacity">
                {batteryAh.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-teal-800">Ah</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-teal-800 font-semibold">LiFePO4 12.8V (80% DoD)</span>
              <span className="text-stone-500 font-mono">{batteryWh.toFixed(0)} Wh</span>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="font-semibold text-stone-800">전력 계통 설계 가이드라인 준수:</span>
            <span>IR 전원선 24V 독립 레일 격리, 10,000µF 알루미늄 캐패시터 버퍼, CPU 65°C 방열팬 히스테리시스 제어</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-stone-500">
            <span>설계 전압: 12.8V / 24V</span>
            <span>&bull;</span>
            <span>리셋 임계선: 4.75V</span>
          </div>
        </div>
      </div>
    </section>
  );
};
