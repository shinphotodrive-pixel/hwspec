import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, CheckSquare, Zap, Battery, Sparkles, Layers } from 'lucide-react';

export const SystemRecommendations: React.FC = () => {
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    rail_split: true,
    cap_bank: true,
    star_ground: true,
    hysteresis_fan: true,
    boot_clean: true,
    lte_psm: true,
    mppt_match: true,
    bms_protect: true,
  });

  const toggleItem = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <section id="recommendations" className="space-y-6">
      <div className="border-b border-stone-200/80 pb-4">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-teal-800 rounded-sm inline-block"></span>
          5. 종합 시스템 최적화 권고 및 현장 설치 체크리스트
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          실제 야외 현장 설치 및 하드웨어 결선 시 필수로 준수해야 할 3대 핵심 아키텍처 원칙과 점검 체크리스트입니다.
        </p>
      </div>

      {/* 3 Core Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 hover:border-teal-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg">
            1
          </div>
          <h4 className="font-bold text-stone-900 text-base">
            전원 레일 물리적 분리 및 완충
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            IR 플래시 전용 DC-DC 컨버터 라인과 라즈베리 파이/카메라 전용 <strong>Buck Regulator(5V/5A)</strong> 라인을 물리적으로 완전히 분리하고, 
            IR 드라이버 입력단에 <strong>10,000&micro;F 이상</strong>의 대용량 알루미늄 솔리드 캐패시터를 병렬 배치합니다.
          </p>
          <div className="pt-2 border-t border-stone-100 text-[11px] font-semibold text-teal-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Brownout 리셋(4.75V) 100% 차단
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 hover:border-amber-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
            2
          </div>
          <h4 className="font-bold text-stone-900 text-base">
            상시 대기 전력 3.0W 이하 달성
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            라즈베리 파이 불필요 칩셋(Wi-Fi/BT/HDMI) 비활성화, LTE 모뎀 PSM/eDRX 모드, 
            방열팬 <strong>GPIO 온도 히스테리시스 제어(65&deg;C ON / 55&deg;C OFF)</strong>를 통합 적용하여 24시간 누적 정적 전력 소모를 3.0W 이하로 억제합니다.
          </p>
          <div className="pt-2 border-t border-stone-100 text-[11px] font-semibold text-amber-800 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            24시간 기저 부하 72Wh 이하 유지
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 hover:border-teal-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center font-black text-lg">
            3
          </div>
          <h4 className="font-bold text-stone-900 text-base">
            3일 자립형 배터리 & 태양광 매칭
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            장마철 및 혹한기 동절기 악천후 속에서도 3일간 연속 무인 동작을 보장하기 위해 
            최소 <strong>12.8V 60Ah급 LiFePO4 배터리</strong>(80% DoD)와 일조 3.5시간 기준 <strong>100W급 이상의 MPPT 태양광 패널</strong>을 장착합니다.
          </p>
          <div className="pt-2 border-t border-stone-100 text-[11px] font-semibold text-stone-700 flex items-center gap-1">
            <Battery className="w-3.5 h-3.5" />
            연간 가동률 99.8% 달성
          </div>
        </div>
      </div>

      {/* Interactive Deployment Readiness Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-800" />
              현장 구축 전 엔지니어링 체크리스트 (Deployment Readiness)
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              실제 현장 납품 및 개통 전 모든 항목의 하드웨어/소프트웨어 설정 여부를 검증하세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              달성률: {progressPercent}% ({completedCount}/{totalCount})
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-700 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {[
            {
              id: 'rail_split',
              title: '전원 레일 물리적 분리 (Star Ground)',
              desc: 'IR 플래시와 RPi 전원 배선이 배터리 단자에서 개별 분기되었는가'
            },
            {
              id: 'cap_bank',
              title: '10,000µF 디커플링 캐패시터 보드 장착',
              desc: 'IR 조명 드라이버 인입단에 저-ESR 캐패시터 뱅크가 직결되었는가'
            },
            {
              id: 'star_ground',
              title: '어스 접지 및 서지 프로텍터(SPD) 결선',
              desc: '야외 낙뢰 및 유도 서지 방지를 위해 함체 단독 접지가 100Ω 이하인가'
            },
            {
              id: 'hysteresis_fan',
              title: 'GPIO 히스테리시스 팬 드라이버 작동 테스트',
              desc: 'CPU 65°C 도달 시 팬이 기동하고 55°C에서 정상 정지하는가'
            },
            {
              id: 'boot_clean',
              title: 'config.txt 불필요 칩셋(Wi-Fi/BT/HDMI) 비활성화',
              desc: '무선 RF 모듈 및 비디오 칩셋 유휴 전력이 완벽 차단되었는가'
            },
            {
              id: 'lte_psm',
              title: 'LTE 모뎀 절전 모드(PSM / eDRX) AT 명령 설정',
              desc: '대기 시 모뎀 소비 전류가 1.5mA 이하로 강하하는지 실측 완료'
            },
            {
              id: 'mppt_match',
              title: '태양광 MPPT 컨트롤러 배터리 화학 설정',
              desc: 'LiFePO4 4S 만충(14.4V) 및 저전압 차단(11.2V) 파라미터 저장 확인'
            },
            {
              id: 'bms_protect',
              title: '배터리 팩 저온 충전 방지 센서 부착',
              desc: '영하 0°C 이하 저온에서 리튬 이온 덴드라이트 방지를 위한 충전 차단'
            }
          ].map((item) => {
            const isChecked = checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-teal-50/40 border-teal-200 text-stone-900'
                    : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isChecked
                      ? 'bg-teal-800 text-white'
                      : 'border border-stone-300 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h5 className="font-bold text-xs">{item.title}</h5>
                  <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
