import React from 'react';
import { Zap, Activity, Download, Sliders, Cpu, Sun, ShieldAlert, CheckSquare } from 'lucide-react';
import { SystemPreset } from '../types';
import { SYSTEM_PRESETS } from '../data/initialData';

interface HeaderProps {
  activePresetId: string;
  onSelectPreset: (preset: SystemPreset) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePresetId,
  onSelectPreset,
  onOpenReport,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/95 backdrop-blur border-b border-stone-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                  지능형 교통 감시 시스템
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
                  Edge AI HW & Power Analysis
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                하드웨어 사양 &middot; 소모전력 프로파일 &middot; 자립일수 시뮬레이션
              </p>
            </div>
          </div>

          {/* Preset Selector & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Preset Selector */}
            <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 px-2 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                프리셋:
              </span>
              {SYSTEM_PRESETS.map((preset) => {
                const isActive = preset.id === activePresetId;
                return (
                  <button
                    key={preset.id}
                    id={`preset-btn-${preset.id}`}
                    onClick={() => onSelectPreset(preset)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-teal-800 shadow-xs border border-stone-200/60'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                    }`}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Spec Report Button */}
            <button
              id="header-export-report-btn"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>사양서 내보내기</span>
            </button>
          </div>
        </div>

        {/* Sub-nav quick anchor links */}
        <nav className="hidden md:flex space-x-6 border-t border-stone-100 py-2 text-xs font-medium text-stone-600">
          <a href="#summary" className="hover:text-teal-800 transition flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> 개요 & KPI
          </a>
          <a href="#specs" className="hover:text-teal-800 transition flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> 구성품 사양 & 전력
          </a>
          <a href="#calculator" className="hover:text-teal-800 transition flex items-center gap-1">
            <Sun className="w-3.5 h-3.5" /> 태양광&middot;배터리 계산기
          </a>
          <a href="#sag-sim" className="hover:text-teal-800 transition flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> 전압 강하(Sag) 시뮬레이션
          </a>
          <a href="#engineering" className="hover:text-teal-800 transition flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> 핵심 엔지니어링 이슈
          </a>
          <a href="#recommendations" className="hover:text-teal-800 transition flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5" /> 최적화 권고
          </a>
        </nav>
      </div>
    </header>
  );
};
