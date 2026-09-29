import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { ComponentItem, ComponentCategory } from '../types';
import { Cpu, Camera, Battery, Plus, AlertCircle, Edit3, Trash2 } from 'lucide-react';

interface ComponentExplorerProps {
  components: ComponentItem[];
  onUpdateComponent: (updated: ComponentItem) => void;
  onAddComponent: (newComp: ComponentItem) => void;
  onDeleteComponent: (id: string) => void;
}

export const ComponentExplorer: React.FC<ComponentExplorerProps> = ({
  components,
  onUpdateComponent,
  onAddComponent,
  onDeleteComponent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingComponent, setEditingComponent] = useState<ComponentItem | null>(null);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState<boolean>(false);

  // Filtered components
  const filteredComponents = selectedCategory === 'all'
    ? components
    : components.filter((c) => c.category === selectedCategory);

  // Prepare chart data
  const chartData = components.map((c) => ({
    name: c.nameKo.split('(')[0].trim(),
    fullName: c.nameKo,
    idle: c.idlePower,
    active: c.activePower,
    peak: c.peakPower || c.activePower,
    category: c.category
  }));

  const categoryIcons: Record<ComponentCategory, React.ReactNode> = {
    compute: <Cpu className="w-4 h-4 text-indigo-600" />,
    optics: <Camera className="w-4 h-4 text-amber-600" />,
    power: <Battery className="w-4 h-4 text-teal-600" />
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComponent) {
      onUpdateComponent(editingComponent);
      setEditingComponent(null);
    }
  };

  return (
    <section id="specs" className="space-y-6">
      <div className="border-b border-stone-200/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-teal-700 rounded-sm inline-block"></span>
              1. 구성품별 상세 하드웨어 사양 및 전력 비교
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              핵심 하드웨어 7대 요소의 동작 전압, 대기(Idle) 및 운용(Active) 소비전력 프로파일을 분석합니다.
            </p>
          </div>

          <button
            onClick={() => setIsAddingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>장치 추가 / 사용자정의</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recharts Grouped Horizontal Bar Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
              구성품별 소비전력 비교 (W)
            </h4>
            <span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              단위: Watt(W)
            </span>
          </div>

          <p className="text-xs text-stone-500">
            * IR 플래시의 운용 전력은 평균값(20W) 기준이며, 펄스 순간 <strong>600W</strong> 피크 전력은 별도로 시뮬레이션합니다.
          </p>

          {/* Chart Container */}
          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  unit="W"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  width={90}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-stone-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg border border-stone-800">
                          <p className="font-bold text-amber-300">{data.fullName}</p>
                          <div className="flex justify-between gap-4">
                            <span className="text-teal-300">대기 전력:</span>
                            <span className="font-mono font-bold">{data.idle} W</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-amber-300">운용 평균:</span>
                            <span className="font-mono font-bold">{data.active} W</span>
                          </div>
                          {data.peak > data.active && (
                            <div className="flex justify-between gap-4 border-t border-stone-700 pt-1">
                              <span className="text-rose-400">순간 피크:</span>
                              <span className="font-mono font-bold text-rose-400">{data.peak} W</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="idle"
                  name="대기 전력 (Idle W)"
                  fill="#0f766e"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="active"
                  name="운용 전력 (Active W)"
                  fill="#d97706"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Technical Insights Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              핵심 전력 엔지니어링 관전 포인트:
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed">
              <li>
                <strong>메인 제어기(RPi):</strong> CPU 100% OCR 연산 시 7.6W까지 3배 폭증. 불필요 Wi-Fi/BT/HDMI 차단 시 상시 0.6W 절감.
              </li>
              <li>
                <strong>IR 플래시:</strong> 운용 시 20W 평균으로 전체 가동 전력의 약 60%를 점유하며, 펄스 순간 600W 맥동 발생.
              </li>
              <li>
                <strong>LTE 모뎀:</strong> Sleep 모드(eDRX) 시 0.003W로 떨어지나 통신 버스트 순간 2.0A 피크 전류를 배출.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Component Cards List & Filter Tabs */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {[
                { id: 'all', label: '전체 보기' },
                { id: 'compute', label: '제어 & 통신' },
                { id: 'optics', label: '카메라 & 조명' },
                { id: 'power', label: '전력 & 열관리' },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`btn-cat-${tab.id}`}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-stone-500 font-mono">
              {filteredComponents.length}개 장치 항목
            </span>
          </div>

          {/* Cards Scroll Container */}
          <div className="space-y-3.5 max-h-[540px] overflow-y-auto pr-1">
            {filteredComponents.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/70 hover:bg-white hover:border-teal-300 hover:shadow-xs transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      {categoryIcons[item.category]}
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900 text-sm">{item.nameKo}</h5>
                      <span className="text-[11px] text-stone-500 font-mono">{item.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                      {item.voltage}
                    </span>
                    <button
                      onClick={() => setEditingComponent(item)}
                      title="전력 수치 수정"
                      className="p-1 text-stone-400 hover:text-stone-700 rounded transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {item.isCustom && (
                      <button
                        onClick={() => onDeleteComponent(item.id)}
                        title="삭제"
                        className="p-1 text-rose-400 hover:text-rose-600 rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {item.specs}
                </p>

                {/* Technical Metric Strips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/70 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-stone-500">대기: </span>
                      <strong className="text-teal-800 font-mono">{item.idlePower.toFixed(2)} W</strong>
                    </div>
                    <div>
                      <span className="text-stone-500">운용: </span>
                      <strong className="text-amber-700 font-mono">{item.activePower.toFixed(1)} W</strong>
                    </div>
                    {item.peakPower && item.peakPower > item.activePower && (
                      <div>
                        <span className="text-stone-500">순간피크: </span>
                        <strong className="text-rose-700 font-mono">{item.peakPower} W</strong>
                      </div>
                    )}
                  </div>
                  {item.currentA && (
                    <span className="text-[11px] text-stone-500 font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                      {item.currentA}
                    </span>
                  )}
                </div>

                {/* Engineering Note */}
                <div className="text-[11px] text-stone-700 bg-white/90 p-2.5 rounded-lg border border-stone-200/80 flex items-start gap-2">
                  <span className="text-amber-600 shrink-0 mt-0.5">💡</span>
                  <span className="leading-relaxed">{item.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Component Modal */}
      {editingComponent && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              구성품 사양 및 소모전력 조정
            </h4>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">장치명</label>
                <input
                  type="text"
                  value={editingComponent.nameKo}
                  onChange={(e) =>
                    setEditingComponent({ ...editingComponent, nameKo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-teal-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">대기 전력 (Idle W)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingComponent.idlePower}
                    onChange={(e) =>
                      setEditingComponent({
                        ...editingComponent,
                        idlePower: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">운용 전력 (Active W)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editingComponent.activePower}
                    onChange={(e) =>
                      setEditingComponent({
                        ...editingComponent,
                        activePower: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-teal-700 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">기술 상세 규격</label>
                <input
                  type="text"
                  value={editingComponent.specs}
                  onChange={(e) =>
                    setEditingComponent({ ...editingComponent, specs: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">엔지니어링 유의사항</label>
                <textarea
                  rows={2}
                  value={editingComponent.notes}
                  onChange={(e) =>
                    setEditingComponent({ ...editingComponent, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingComponent(null)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-800 text-white font-bold hover:bg-teal-900"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Component Modal */}
      {isAddingModalOpen && (
        <CustomComponentModal
          onClose={() => setIsAddingModalOpen(false)}
          onAdd={(newComp) => {
            onAddComponent(newComp);
            setIsAddingModalOpen(false);
          }}
        />
      )}
    </section>
  );
};

interface CustomComponentModalProps {
  onClose: () => void;
  onAdd: (newComp: ComponentItem) => void;
}

const CustomComponentModal: React.FC<CustomComponentModalProps> = ({ onClose, onAdd }) => {
  const [nameKo, setNameKo] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('compute');
  const [idlePower, setIdlePower] = useState(0.5);
  const [activePower, setActivePower] = useState(3.0);
  const [voltage, setVoltage] = useState('DC 12V');
  const [specs, setSpecs] = useState('추가 센서 모듈 (LiDAR/Radar 등)');
  const [notes, setNotes] = useState('독립 전원 제어 적용');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKo.trim()) return;

    const newComp: ComponentItem = {
      id: 'custom_' + Date.now(),
      category,
      name: nameKo,
      nameKo,
      specs,
      idlePower,
      activePower,
      voltage,
      operatingVoltageV: 12,
      notes,
      criticality: 'medium',
      isCustom: true
    };
    onAdd(newComp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-xl space-y-4">
        <h4 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
          신규 하드웨어 장치 추가
        </h4>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">장치명 (한글)</label>
            <input
              type="text"
              required
              placeholder="예: 24GHz 레이더 속도 감지기"
              value={nameKo}
              onChange={(e) => setNameKo(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-stone-700 block mb-1">분류</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComponentCategory)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            >
              <option value="compute">제어 & 통신 (Compute)</option>
              <option value="optics">카메라 & 조명 (Optics)</option>
              <option value="power">전력 & 열관리 (Power)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">대기 전력 (W)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={idlePower}
                onChange={(e) => setIdlePower(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">운용 전력 (W)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={activePower}
                onChange={(e) => setActivePower(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-stone-700 block mb-1">동작 전압 규격</label>
            <input
              type="text"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-teal-800 text-white font-bold hover:bg-teal-900"
            >
              장치 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
