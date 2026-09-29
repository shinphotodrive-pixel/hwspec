import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200/90 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-teal-800 text-white flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="font-bold text-stone-800">
              지능형 교통 감시 시스템 하드웨어 사양 및 전력 분석 플랫폼
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-teal-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              12.8V / 24V 독립형 전원 최적화
            </span>
            <span>&bull;</span>
            <span>라즈베리 파이 4B/5 에지 AI 지원</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400">
          <p>&copy; 2026 Intelligent Traffic Edge Computing Engineering. All Rights Reserved.</p>
          <p className="mt-1 sm:mt-0 font-mono">Build v2.4.0 &middot; React 19 + Recharts + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};
