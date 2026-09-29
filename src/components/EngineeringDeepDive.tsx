import React, { useState } from 'react';
import { Thermometer, Cpu, Radio, Power, Check, AlertCircle, Sparkles } from 'lucide-react';

export const EngineeringDeepDive: React.FC = () => {
  const [fanMode, setFanMode] = useState<'always_on' | 'hysteresis'>('hysteresis');
  const [softwareChecks, setSoftwareChecks] = useState<{ [key: string]: boolean }>({
    hdmi: true,
    wifi_bt: true,
    lte_psm: true,
    led_blanking: true,
    pmic_eeprom: true
  });

  const toggleCheck = (id: string) => {
    setSoftwareChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateSavedWatts = () => {
    let saved = 0;
    if (softwareChecks.hdmi) saved += 0.20;
    if (softwareChecks.wifi_bt) saved += 0.55;
    if (softwareChecks.lte_psm) saved += 0.25;
    if (softwareChecks.led_blanking) saved += 0.05;
    if (softwareChecks.pmic_eeprom) saved += 1.20;
    return saved;
  };

  const fanDailyWh = fanMode === 'always_on' ? 0.8 * 24 : 0.8 * 4.8; // hysteresis runs ~20% of the day

  return (
    <section id="engineering" className="space-y-6">
      <div className="border-b border-stone-200/80 pb-4">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-teal-800 rounded-sm inline-block"></span>
          4. 현장 엔지니어링 딥다이브: 발열&middot;팬 전력 제어 및 소프트웨어 최적화
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          야외 밀폐 함체 내 열 쓰로틀링 방지와 대기전력 극소화를 위한 하드웨어-소프트웨어 통합 제어 기법을 분석합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Module 1: Thermal vs Fan Trade-off */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                  열 쓰로틀링(80&deg;C) vs 방열팬 전력 트레이드오프
                </h4>
                <span className="text-xs text-stone-500">라즈베리 파이 밀폐 방수 함체 내부 온도 제어</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            하절기 직사광선 환경에서 야외 밀폐 함체 내부는 <strong>60&deg;C</strong> 이상 상승합니다. 
            라즈베리 파이 CPU 온도가 <strong>80&deg;C</strong>에 도달하면 클럭 쓰로틀링(1.8GHz &rarr; 600MHz)이 발생하여 번호판 OCR 연산 프레임이 누락됩니다.
          </p>

          {/* Interactive Fan Mode Switcher */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-800 block">방열팬 구동 방식 선택 비교</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFanMode('always_on')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  fanMode === 'always_on'
                    ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-100'
                    : 'bg-white/60 border-stone-200 hover:bg-white text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">상시 연속 회전</span>
                  {fanMode === 'always_on' && <span className="text-amber-600 text-xs">선택됨</span>}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">24시간 고정 구동 (단순 5V 직결)</p>
                <div className="mt-2 text-xs font-mono font-bold text-rose-600">
                  일일 19.2 Wh 소모
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFanMode('hysteresis')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  fanMode === 'hysteresis'
                    ? 'bg-white border-teal-600 shadow-xs ring-2 ring-teal-100'
                    : 'bg-white/60 border-stone-200 hover:bg-white text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">GPIO 히스테리시스 제어</span>
                  {fanMode === 'hysteresis' && <span className="text-teal-700 text-xs font-bold">권장</span>}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">65&deg;C ON / 55&deg;C OFF (MOSFET)</p>
                <div className="mt-2 text-xs font-mono font-bold text-teal-800">
                  일일 3.8 Wh 소모 (80% 절감)
                </div>
              </button>
            </div>

            {/* Savings Callout */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-950 flex items-center justify-between">
              <span>히스테리시스 적용 시 절감 에너지:</span>
              <strong className="font-mono text-teal-900">
                {(19.2 - fanDailyWh).toFixed(1)} Wh/일 절약 (배터리 1.2Ah 분량)
              </strong>
            </div>
          </div>

          <div className="text-xs text-stone-600 space-y-1.5 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
            <span className="font-bold text-stone-800 block">하드웨어 구현 회로 가이드:</span>
            <p>
              &bull; <strong>스위칭 소자:</strong> 2N7002 또는 BSS138 N-채널 로직 레벨 MOSFET 사용.
            </p>
            <p>
              &bull; <strong>역기전력 방지:</strong> 팬 인덕턴스로 인한 GPIO 파손 방지를 위해 1N4007 플라이백 다이오드 병렬 장착.
            </p>
            <p>
              &bull; <strong>데몬 스크립트:</strong> Linux systemd 서비스로 10초 주기 CPU 온도 폴링.
            </p>
          </div>
        </div>

        {/* Module 2: Software Power Minimization Checklist */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-800">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                  대기 전력 극소화 소프트웨어 기법
                </h4>
                <span className="text-xs text-stone-500">라즈베리 파이 OS & LTE 모뎀 커널 최적화</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-500 block">실시간 절감 합계</span>
              <span className="text-xs font-mono font-bold text-teal-800">
                -{calculateSavedWatts().toFixed(2)} W
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            리눅스 커널 수준에서 불필요한 컨트롤러 회로를 차단하면 24시간 동안 배터리가 낭비되는 기저 부하를 3.0W 이하로 낮출 수 있습니다.
          </p>

          {/* Interactive Checkbox List */}
          <div className="space-y-2.5">
            {[
              {
                id: 'hdmi',
                title: 'HDMI 디스플레이 출력 칩셋 강제 전원 차단',
                desc: '야외 무인 운용 시 불필요한 HDMI PHY 전원을 끄고 영상 신호 비활성화',
                code: '/usr/bin/tvservice -o (또는 hdmi_blanking=2)',
                saving: '0.20 W 절감'
              },
              {
                id: 'wifi_bt',
                title: '온보드 Wi-Fi 및 Bluetooth 모듈 완전 차단',
                desc: 'config.txt 오버레이 적용으로 무선 RF 칩셋의 유휴 전력 누설 원천 차단',
                code: 'dtoverlay=disable-wifi / dtoverlay=disable-bt',
                saving: '0.55 W 절감'
              },
              {
                id: 'lte_psm',
                title: 'LTE 모뎀 eDRX 및 절전 모드(PSM) 활성화',
                desc: '미송신 대기 상태 시 베이스밴드 프로세서를 딥슬립으로 전환',
                code: 'AT+CPSMS=1 / AT+CEDRXS=1 / 대기전류 21mA → 1.1mA',
                saving: '0.25 W 절감'
              },
              {
                id: 'led_blanking',
                title: '기판 ACT / PWR LED 인디케이터 소등',
                desc: '야간 발열 및 미세 전류 절감 및 야생 조류/해충 접근 방지',
                code: 'echo 0 > /sys/class/leds/led0/brightness',
                saving: '0.05 W 절감'
              },
              {
                id: 'pmic_eeprom',
                title: 'RPi 5 PMIC 전원 셧다운 EEPROM 옵션 적용',
                desc: '파이 5의 Soft-Off 유휴 전력(1.7W)을 0.01W로 억제하는 EEPROM 설정',
                code: 'POWER_OFF_ON_HALT=1 (WAKE_ON_GPIO=0)',
                saving: '1.20 W 절감'
              }
            ].map((opt) => {
              const isChecked = softwareChecks[opt.id];
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleCheck(opt.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                    isChecked
                      ? 'bg-stone-50 border-teal-300'
                      : 'bg-white border-stone-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isChecked ? 'bg-teal-800 text-white' : 'border border-stone-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-stone-900">{opt.title}</h5>
                      <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        {opt.saving}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">{opt.desc}</p>
                    <code className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded inline-block mt-1">
                      {opt.code}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center justify-between">
            <span className="font-semibold">소프트웨어 최적화 일일 누적 절감량:</span>
            <span className="font-mono font-bold text-indigo-900">
              {(calculateSavedWatts() * 24).toFixed(1)} Wh/일 절감
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
