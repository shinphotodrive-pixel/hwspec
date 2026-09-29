import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SagSimulationSettings } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Zap, Sliders, CheckCircle2 } from 'lucide-react';

interface VoltageSagSimulatorProps {
  settings: SagSimulationSettings;
  onUpdateSettings: (newSettings: SagSimulationSettings) => void;
}

export const VoltageSagSimulator: React.FC<VoltageSagSimulatorProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [wireGauge, setWireGauge] = useState<16 | 18 | 20>(settings.wireGaugeAWG as 16 | 18 | 20);
  const [wireLengthM, setWireLengthM] = useState<number>(settings.wireLengthMeters || 2);
  const [busVoltage, setBusVoltage] = useState<12.8 | 24>(settings.busVoltage || 24);

  // Wire resistance calculation (Ohms per meter for AWG)
  const awgResistanceMap = {
    16: 0.0132, // 13.2 mOhm/m
    18: 0.0210, // 21.0 mOhm/m
    20: 0.0333  // 33.3 mOhm/m
  };

  const wireResistance = awgResistanceMap[wireGauge] * wireLengthM * 2; // round trip (positive + ground)
  const batteryEsr = busVoltage === 24 ? 0.015 : 0.025; // Ohms
  const totalSourceImpedance = wireResistance + batteryEsr;

  // Peak current during 600W pulse: I = P / V
  const peakCurrent = settings.pulsePowerWatts / busVoltage;

  // Unmitigated voltage drop on DC bus = I * R
  const rawDropBus = peakCurrent * totalSourceImpedance;

  // Decoupling capacitance damping ratio (0 to 20000 uF)
  // Higher capacitance provides the transient charge Q = C * dV, shielding the 5V buck regulator
  const bufferMitigation = Math.min(0.92, (settings.capacitanceUf / 10000) * 0.72 + (settings.capacitanceUf / 20000) * 0.20);

  // Nominal 5V rail
  const nominal5V = 5.05;
  const max5VDrop = Math.min(1.15, (rawDropBus / busVoltage) * 5.0 * 2.2);
  const actual5VDrop = max5VDrop * (1 - bufferMitigation);

  // Minimum voltage hit during the pulse
  const minRailVoltage = Math.max(3.85, parseFloat((nominal5V - actual5VDrop).toFixed(2)));

  // Generate transient simulation curve points (0ms to 3.0ms)
  const timeSteps = [
    { t: 0.0, label: '0.0ms' },
    { t: 0.2, label: '0.2ms' },
    { t: 0.4, label: '0.4ms' },
    { t: 0.7, label: '0.7ms' },
    { t: 1.0, label: '1.0ms' },
    { t: 1.3, label: '1.3ms' },
    { t: 1.6, label: '1.6ms' }, // pulse ends here
    { t: 1.9, label: '1.9ms' },
    { t: 2.3, label: '2.3ms' },
    { t: 2.7, label: '2.7ms' },
    { t: 3.0, label: '3.0ms' },
  ];

  const chartData = timeSteps.map(({ t, label }) => {
    let v = nominal5V;
    if (t <= 0.1) {
      v = nominal5V;
    } else if (t <= 1.6) {
      // During pulse: sudden sag shaped by RC discharge
      const progress = (t - 0.1) / 1.5;
      v = nominal5V - actual5VDrop * (0.85 + 0.15 * Math.sin(progress * Math.PI));
    } else {
      // Post pulse: recovery
      const recFactor = Math.min(1, (t - 1.6) / 1.0);
      v = minRailVoltage + (nominal5V - minRailVoltage) * Math.pow(recFactor, 0.7);
    }

    return {
      time: label,
      voltage: parseFloat(v.toFixed(2)),
      threshold: 4.75,
      nominal: 5.0
    };
  });

  const resetThreshold = 4.75;
  const isBrownout = minRailVoltage < resetThreshold;
  const isWarning = minRailVoltage >= resetThreshold && minRailVoltage < 4.88;

  const setCapacitance = (val: number) => {
    onUpdateSettings({ ...settings, capacitanceUf: val });
  };

  return (
    <section id="sag-sim" className="space-y-6">
      <div className="border-b border-stone-200/80 pb-4">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-rose-600 rounded-sm inline-block"></span>
          3. 전력 계통 핵심 엔지니어링: IR 플래시 전압 강하(Voltage Sag) 시뮬레이터
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          야간 단속 IR 플래시 발광 순간(600W, 1.6ms 펄스) 발생하는 급격한 맥동 전류와 선로 저항에 따른 전압 강하를 시뮬레이션하고, 대용량 디커플링 콘덴서의 완충 효과를 검증합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Simulator Controls & Line Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-600" />
                IR 플래시 펄스 발광 시 5V 공급 전압 과도 응답 시뮬레이션
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                펄스 조건: 600W, 1.6ms 폭 &middot; 피크 전류: {peakCurrent.toFixed(1)}A (at {busVoltage}V)
              </p>
            </div>
          </div>

          {/* Capacitance Interactive Slider with Quick Presets */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-stone-800">
                디커플링 캐패시터 보드 용량 (Decoupling Capacitor)
              </label>
              <span className="font-bold text-teal-800 font-mono text-base" id="val-cap-display">
                {settings.capacitanceUf.toLocaleString()} &micro;F
              </span>
            </div>

            <input
              type="range"
              id="slider-cap"
              min="0"
              max="20000"
              step="1000"
              value={settings.capacitanceUf}
              onChange={(e) => setCapacitance(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-stone-500 font-semibold">규격 프리셋:</span>
              <div className="flex gap-1.5">
                {[
                  { uf: 0, label: '0 µF (미설치)' },
                  { uf: 4700, label: '4,700 µF' },
                  { uf: 10000, label: '10,000 µF (권장)' },
                  { uf: 20000, label: '20,000 µF (최적)' }
                ].map((preset) => (
                  <button
                    key={preset.uf}
                    type="button"
                    onClick={() => setCapacitance(preset.uf)}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition ${
                      settings.capacitanceUf === preset.uf
                        ? 'bg-teal-800 text-white shadow-2xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Circuit Variables */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="font-semibold text-stone-700 block mb-1">배선 전선 규격</label>
              <select
                value={wireGauge}
                onChange={(e) => setWireGauge(parseInt(e.target.value, 10) as 16 | 18 | 20)}
                className="w-full p-1.5 bg-white border border-stone-300 rounded font-mono text-xs"
              >
                <option value={16}>AWG 16 (저저항 13.2mΩ/m)</option>
                <option value={18}>AWG 18 (일반 21.0mΩ/m)</option>
                <option value={20}>AWG 20 (고저항 33.3mΩ/m)</option>
              </select>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="font-semibold text-stone-700 block mb-1">배선 길이 (편도)</label>
              <select
                value={wireLengthM}
                onChange={(e) => setWireLengthM(parseFloat(e.target.value))}
                className="w-full p-1.5 bg-white border border-stone-300 rounded font-mono text-xs"
              >
                <option value={1}>1.0 m (컨트롤함 내부)</option>
                <option value={2}>2.0 m (폴대 상단 배선)</option>
                <option value={4}>4.0 m (장거리 외곽 배선)</option>
              </select>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="font-semibold text-stone-700 block mb-1">IR 전원 버스</label>
              <select
                value={busVoltage}
                onChange={(e) => setBusVoltage(parseFloat(e.target.value) as 12.8 | 24)}
                className="w-full p-1.5 bg-white border border-stone-300 rounded font-mono text-xs"
              >
                <option value={24}>24.0 V (권장 - 25A 펄스)</option>
                <option value={12.8}>12.8 V (주의 - 47A 펄스)</option>
              </select>
            </div>
          </div>

          {/* Recharts Line Chart: Voltage Transient Curve */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-800">5V 전원 레일 실측 전압 변화 곡선</span>
              <span className="font-mono text-stone-500">최저 도달 전압: {minRailVoltage.toFixed(2)}V</span>
            </div>

            <div className="h-[300px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[3.8, 5.2]}
                    unit="V"
                    tick={{ fontSize: 11, fill: '#334155' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg">
                            <p className="font-bold text-amber-300">{data.time}</p>
                            <div className="flex justify-between gap-4">
                              <span>5V 레일 전압:</span>
                              <span className="font-mono font-bold text-teal-300">{data.voltage} V</span>
                            </div>
                            <div className="flex justify-between gap-4 text-rose-400">
                              <span>리셋 임계선:</span>
                              <span className="font-mono font-bold">4.75 V</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <ReferenceLine
                    y={4.75}
                    stroke="#e11d48"
                    strokeDasharray="4 4"
                    label={{
                      value: 'RPi 리셋 임계치 (4.75V)',
                      fill: '#e11d48',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    name="5V 레일 실측 전압 (V)"
                    stroke="#0f766e"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#0f766e' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Risk Warning Banner */}
          <div
            id="sag-risk-banner"
            className={`p-4 rounded-xl border transition-all text-xs flex items-center space-x-3.5 ${
              isBrownout
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-teal-50 border-teal-300 text-teal-950'
            }`}
          >
            <div className="text-2xl shrink-0">
              {isBrownout ? '🚨' : isWarning ? '⚠️' : '✅'}
            </div>
            <div className="space-y-0.5">
              <h5 className="font-bold text-sm">
                {isBrownout
                  ? `치명적 위험: 저전압 리셋 발생! (최저 ${minRailVoltage.toFixed(2)}V < 4.75V)`
                  : isWarning
                  ? `주의 상태: 전압 마진 부족 (최저 ${minRailVoltage.toFixed(2)}V)`
                  : `안전 상태: 시스템 안정 동작 확인 (최저 ${minRailVoltage.toFixed(2)}V)`}
              </h5>
              <p className="text-stone-700 leading-relaxed">
                {isBrownout
                  ? `순간 600W 펄스로 인해 5V 레일이 라즈베리 파이 리셋 임계치(4.75V) 이하로 붕괴되었습니다. 캐패시터를 10,000µF 이상으로 증설하고 IR 배선을 24V 분리 레일로 구성해야 합니다.`
                  : isWarning
                  ? `전압이 4.75V 이상을 유지하여 리셋은 면했으나 전압 여유율이 부족합니다. 연속 단속 시 PMIC 언더볼티지 경고가 발생할 수 있으니 10,000µF 이상을 권장합니다.`
                  : `10,000µF 이상의 대용량 디커플링 캐패시터가 IR 플래시의 600W 과도 펄스 전류를 안정적으로 흡수/방출하여 5V 버스 전압이 4.88V 이상으로 안전하게 보존됩니다.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Technical Explanation & Physical Circuit Guidelines */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                1. IR 600W 맥동 전류와 옴의 법칙 (V = I &times; R)
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              차량 검지 순간 IR 조명은 <strong>0.1ms ~ 1.6ms</strong> 동안 최대 <strong>600W</strong>의 스트로브 펄스를 방출합니다. 
              24V 기준 <strong>25A</strong>(배선 저항 고려 시 버스에 6.6A~25A 급)의 순간 전류가 유입되며, 
              배선 저항({(wireResistance * 1000).toFixed(1)}m&Omega;)과 배터리 내부 임피던스로 인해 버스 전압이 급강하합니다.
            </p>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 font-medium">
              🚨 <strong>브라운아웃(Brownout) 위험:</strong> 라즈베리 파이 4/5의 PMIC는 입력 전압이 <strong>4.75V</strong> 이하로 떨어지면 안전을 위해 즉시 강제 리셋을 단행합니다. 단속 영상이 유실되고 SD카드 파일 시스템이 손상될 수 있습니다.
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-teal-100 rounded-lg text-teal-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                2. 디커플링 캐패시터(Decoupling Capacitor) 원리
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              배터리에서 전하가 도달하기까지 걸리는 선로 인덕턴스(L)와 저항(R) 지연을 극복하기 위해, 
              <strong>IR 드라이버 입력 직전 단에 10,000&micro;F</strong> 이상의 저-ESR 고용량 전해/폴리머 캐패시터 뱅크를 병렬 배치합니다.
            </p>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside bg-stone-50 p-2.5 rounded-lg">
              <li>펄스 상승 시: 캐패시터가 즉각 저장 전하(Q=CV)를 방출하여 전압 유지</li>
              <li>펄스 종료 후: 다음 셔터 펄스까지 천천히 재충전 완료 (수십 ms)</li>
              <li>권장 부품: 35V 2,200µF x 5개 병렬 (저-ESR 알루미늄 솔리드)</li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-700">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                3. 전원 레일 물리적 분리 (Star Topology)
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              가장 근본적인 하드웨어 설계 해법은 <strong>스타 토폴로지(Star Ground & Power)</strong> 배선입니다. 
              배터리 단자에서 라즈베리 파이 전용 DC-DC 강압기(12/24V &rarr; 5V/5A) 라인과 IR 플래시 전용 라인을 독립적인 물리 케이블로 분리하여 상호 노이즈 간섭을 원천 차단합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
