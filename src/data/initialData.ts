import { ComponentItem, SystemPreset } from '../types';

export const INITIAL_COMPONENTS: ComponentItem[] = [
  {
    id: 'rpi',
    category: 'compute',
    name: 'Main Controller (Raspberry Pi 4B / 5)',
    nameKo: '메인 제어 장치 (Raspberry Pi 4B / 5)',
    specs: 'Quad-core ARM Cortex-A72/A76, 2~8GB LPDDR4, USB 3.0, Gigabit Ethernet',
    idlePower: 3.0,
    activePower: 7.6,
    peakPower: 12.0,
    voltage: 'DC 5V / 3A–5A (USB-C)',
    operatingVoltageV: 5.0,
    currentA: '대기 0.6A / 운용 1.5A / 피크 2.4A',
    notes: 'Soft-Off 시 0.3W~1.7W 소비. CPU 100% 가동 시 전력 3배 급증. Wi-Fi/HDMI 비활성화 시 0.6W 절감 가능.',
    criticality: 'high'
  },
  {
    id: 'lte',
    category: 'compute',
    name: 'Wireless Modem (LTE Cat 4 - EC25)',
    nameKo: '무선 통신 모듈 (LTE Modem - EC25)',
    specs: 'LTE Cat 4, DL 150Mbps / UL 50Mbps, 3GPP Rel-11, USB/mPCIe 인터페이스',
    idlePower: 0.08,
    activePower: 2.5,
    peakPower: 7.6,
    voltage: 'DC 3.3V – 4.3V (3.8V Typ)',
    operatingVoltageV: 3.8,
    currentA: 'Sleep 21mA / 통신시 650mA / 송신 버스트 피크 2.0A',
    notes: 'Sleep 모드 시 0.003W. 데이터 송수신 순간 3.8V 라인에서 최대 2.0A 피크 전류 발생. 1000µF 탄탈 커패시터 권장.',
    criticality: 'high'
  },
  {
    id: 'solar',
    category: 'power',
    name: 'Solar MPPT Charge Controller',
    nameKo: '전력 관리 제어기 (태양광 컨트롤러)',
    specs: 'MPPT / PWM 제어, 배터리 충방전 및 역전류 보호, 12V/24V 자동 감지',
    idlePower: 0.5,
    activePower: 0.8,
    peakPower: 1.2,
    voltage: 'DC 12V / 24V Auto',
    operatingVoltageV: 12.8,
    currentA: '자체 대기전류 10~20mA',
    notes: '자체 소비전력 10~20mA 수준으로 극소. MPPT 고효율 알고리즘으로 95% 이상 에너지 변환 보장.',
    criticality: 'medium'
  },
  {
    id: 'camera',
    category: 'optics',
    name: 'Image Sensor (AR0234 Global Shutter)',
    nameKo: '영상 수집 센서 (AR0234 Global Shutter)',
    specs: '2MP ON Semi AR0234 CMOS, Global Shutter, 1080p @ 60fps, MIPI/USB 3.0',
    idlePower: 0.2,
    activePower: 1.0,
    peakPower: 1.4,
    voltage: 'DC 5V (USB Bus)',
    operatingVoltageV: 5.0,
    currentA: '대기 40mA / 영상 스트리밍 200mA',
    notes: '고속 주행 차량의 번호판 롤링 셔터 젤로 왜곡 완벽 제거. 트리거 모드 시 대기 전력 0.2W로 억제.',
    criticality: 'high'
  },
  {
    id: 'ir_flash',
    category: 'optics',
    name: 'Night Vision IR Strobe (High-Power LED)',
    nameKo: '야간 단속용 IR 플래시 (적외선 조명)',
    specs: 'NIR 850nm/740nm High Power Array, Strobe Pulse Trigger (0.1~1.6ms)',
    idlePower: 0.2,
    activePower: 20.0,
    peakPower: 600.0,
    voltage: 'DC 12V / 24V (24V 권장)',
    operatingVoltageV: 24.0,
    currentA: '평균 0.8A~1.3A / 펄스 피크 순간 25.0A (at 24V: ~6.6A+ bus strain)',
    notes: '노출(0.1~1.6ms) 순간 펄스 최대 600W 피크 전력 발생! 전원 버스 4.75V 붕괴(Brownout) 방지를 위해 10,000µF 버퍼 필수.',
    criticality: 'high'
  },
  {
    id: 'led_188',
    category: 'compute',
    name: 'Status Display (LED 188 3-Digit Module)',
    nameKo: '상태 표시 디스플레이 (LED 188 모듈)',
    specs: '3-Digit 7-Segment LED Display, 현장 시스템 에러 코드 및 배터리 전압 시각화',
    idlePower: 0.05,
    activePower: 0.6,
    peakPower: 0.8,
    voltage: 'DC 5V / 12V',
    operatingVoltageV: 5.0,
    currentA: '전체 점등 120mA / 절전 점등 10mA',
    notes: '현장 기사 점검 시 오류 코드 및 전압 상태 표시. 점검 완료 후 1분 뒤 자동 소등(Auto Dim/Off)으로 대기 전력 최소화.',
    criticality: 'low'
  },
  {
    id: 'fan',
    category: 'power',
    name: 'Thermal Cooling (DC Brushless Fan)',
    nameKo: '열 관리 장치 (DC 방열팬)',
    specs: '40mm–80mm Brushless DC Fan, Dual Ball Bearing, PWM/GPIO 히스테리시스 제어',
    idlePower: 0.0,
    activePower: 0.8,
    peakPower: 1.2,
    voltage: 'DC 5V / 12V',
    operatingVoltageV: 12.0,
    currentA: '정지 0A / 가동 시 65mA',
    notes: 'CPU 65°C 초과 시 기동, 55°C 이하 시 완전 차단. 상시 회전 시 일일 28.8Wh 낭비 방지.',
    criticality: 'medium'
  }
];

export const SYSTEM_PRESETS: SystemPreset[] = [
  {
    id: 'standard',
    name: '표준 국도 단속 시스템',
    description: '일반적인 왕복 2~4차로 국도 단속. 일일 약 3.6시간(15%) 단속 활동 기준.',
    dutyCycle: 15,
    autonomyDays: 3,
    sunHours: 3.5,
    capacitanceUf: 10000
  },
  {
    id: 'highway',
    name: '고속도로 / 고밀도 상습 구간',
    description: '차량 통행량이 매우 많아 연속적인 차량 검지 및 IR 플래시 발광이 잦은 구간.',
    dutyCycle: 35,
    autonomyDays: 4,
    sunHours: 3.2,
    capacitanceUf: 15000
  },
  {
    id: 'rural_eco',
    name: '외곽 산간 / 극저전력 독립형',
    description: '통행량이 적고 겨울철 일조량이 부족하여 대기 전력과 자립일수를 최우선하는 환경.',
    dutyCycle: 5,
    autonomyDays: 5,
    sunHours: 2.8,
    capacitanceUf: 10000
  }
];
