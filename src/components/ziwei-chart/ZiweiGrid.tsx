'use client';

import React, { useState, useEffect } from 'react';
import ZiweiDetailTable from './ZiweiDetailTable';

interface Props {
  chartData?: any;
}

const JIJI_LIST = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const PALACE_ORDER_CIRCLE = ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'];
const PALACE_NAMES = ['명궁', '형제', '부처', '자녀', '재백', '질액', '천이', '노복', '관록', '전택', '복덕', '부모'];

const FOUR_HWA_TABLE: Record<string, string[]> = {
  '甲': ['염정', '파군', '무곡', '태양'], '乙': ['천기', '천량', '자미', '태음'],
  '丙': ['천동', '천기', '문창', '염정'], '丁': ['태음', '천동', '천기', '거문'],
  '戊': ['탐랑', '태음', '우필', '천기'], '己': ['무곡', '탐랑', '천량', '문곡'],
  '庚': ['태양', '무곡', '태음', '천동'], '辛': ['거문', '태양', '문곡', '문창'],
  '壬': ['천량', '자미', '좌보', '무곡'], '癸': ['파군', '거문', '태음', '탐랑'],
};

const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop';

function getDynamicPalaces(baseJiJi: string): Record<string, string> {
  const idx = JIJI_LIST.indexOf(baseJiJi);
  const layout: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const branchIdx = (idx - i + 12) % 12;
    layout[JIJI_LIST[branchIdx]] = PALACE_NAMES[i];
  }
  return layout;
}

function extractGan(str: string): string {
  if (!str) return '甲';
  const match = str.match(/[甲乙丙丁戊己庚辛壬癸]/);
  if (match) return match[0];
  const krMatch = str.match(/[갑을병정무기경신임계]/);
  if (krMatch) {
    const krToHj: Record<string, string> = { '갑':'甲', '을':'乙', '병':'丙', '정':'丁', '무':'戊', '기':'己', '경':'庚', '신':'辛', '임':'壬', '계':'癸' };
    return krToHj[krMatch[0]];
  }
  return '甲';
}

function describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const start = polarToCartesian(x, y, outerRadius, endAngle);
  const end = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    'Z'
  ].join(' ');
}

export default function ZiweiGrid({ chartData }: Props) {
  const [viewMode, setViewMode] = useState<'base' | 'daehan' | 'yunyeon'>('base');
  const [selectedDaehanJiJi, setSelectedDaehanJiJi] = useState<string | null>(null);
  const [selectedYunyeon, setSelectedYunyeon] = useState<any>(null);

  if (!chartData || !chartData['선천명반_12궁']) return null;

  const gungData = chartData['선천명반_12궁'];
  const basicInfo = chartData['기본정보'];
  const saju = basicInfo['사주'];
  const luckInfo = chartData['행운_정보'] || { 대한_목록: [], 유년_목록: [] };
  const baseGan = extractGan(saju['년']);

  let baseMyungGungJiJi = '子';
  for (const [jiji, data] of Object.entries(gungData)) {
    if ((data as any)['선천궁명'] === '명궁') baseMyungGungJiJi = jiji;
  }

  useEffect(() => {
    if (!selectedDaehanJiJi) setSelectedDaehanJiJi(baseMyungGungJiJi);
    if (!selectedYunyeon && luckInfo['유년_목록'].length > 0) setSelectedYunyeon(luckInfo['유년_목록'][0]);
  }, [baseMyungGungJiJi, luckInfo, selectedDaehanJiJi, selectedYunyeon]);

  const activeJiJi = selectedDaehanJiJi || baseMyungGungJiJi;
  const activeDaehanData = luckInfo['대한_목록'].find((d: any) => Object.keys(d['십이궁_배치']).find(k => d['십이궁_배치'][k] === '명궁') === activeJiJi);

  const basePalaces = getDynamicPalaces(baseMyungGungJiJi);
  const daehanPalaces = getDynamicPalaces(activeJiJi);
  
  let yunyeonPalaces: Record<string, string> = {};
  if (selectedYunyeon) {
    const yJiJi = Object.keys(selectedYunyeon['십이궁_배치']).find(k => selectedYunyeon['십이궁_배치'][k] === '명궁') || '子';
    yunyeonPalaces = getDynamicPalaces(yJiJi);
  }

  const baseSihwaStars = FOUR_HWA_TABLE[baseGan] || [];
  const daehanGan = extractGan(gungData[activeJiJi]['궁위간지']);
  const daehanSihwaStars = viewMode === 'daehan' || viewMode === 'yunyeon' ? (FOUR_HWA_TABLE[daehanGan] || []) : [];
  const yunyeonGan = selectedYunyeon ? extractGan(selectedYunyeon['천간']) : null;
  const yunyeonSihwaStars = viewMode === 'yunyeon' && yunyeonGan ? (FOUR_HWA_TABLE[yunyeonGan] || []) : [];

  const handlePalaceClick = (jiji: string) => {
    if (viewMode === 'base' || viewMode === 'daehan') {
      setSelectedDaehanJiJi(jiji);
    }
  };

  const handleYunyeonModeClick = () => {
    if (viewMode === 'base') {
      alert('대한을 먼저 선택해주세요.');
      return;
    }
    setViewMode('yunyeon');
  };

  const SIZE = 850;
  const CENTER = SIZE / 2;
  const OUTER_RADIUS = 412;
  const INNER_RADIUS = 252; 

  return (
    <div className="w-full max-w-220 mx-auto text-xs p-2 sm:p-6 bg-[#08090C] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#2A241A]" style={{ fontFamily: "'JoseonGulim', sans-serif" }}>
      <div className="relative isolate w-full aspect-square flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-black">
        
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105" 
          style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />

        {/* SVG 차트 레이어 */}
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full absolute inset-0 z-0">
          <defs>
            <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6C687" />
              <stop offset="50%" stopColor="#B58E3D" />
              <stop offset="100%" stopColor="#7D5E1E" />
            </linearGradient>
          </defs>

          {/* 천문도 궤도 링 장식 */}
          <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 8} fill="none" stroke="url(#goldGlow)" strokeWidth="1" opacity="0.35" />
          <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 2} fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.6" />
          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 2} fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.5" />
          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 8} fill="none" stroke="url(#goldGlow)" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.3" />

          {/* 12궁 부채꼴 섹션 */}
          {PALACE_ORDER_CIRCLE.map((jiji, idx) => {
            const startAngle = idx * 30 - 15;
            const endAngle = startAngle + 30;
            const data = gungData[jiji];
            if (!data) return null;

            const baseName = basePalaces[jiji];
            const daehanName = daehanPalaces[jiji];
            const yunyeonName = yunyeonPalaces[jiji];
            const activeName = viewMode === 'base' ? baseName : viewMode === 'daehan' ? daehanName : yunyeonName;

            let fillColor = 'rgba(10, 12, 19, 0.75)';
            let strokeColor = '#221E18';

            if (activeName === '명궁') { fillColor = 'rgba(34, 21, 19, 0.85)'; strokeColor = '#E5B84B'; }
            else if (activeName === '천이') { fillColor = 'rgba(13, 30, 32, 0.85)'; strokeColor = '#2DD4BF'; }
            else if (activeName === '관록') { fillColor = 'rgba(23, 19, 36, 0.85)'; strokeColor = '#C084FC'; }
            else if (activeName === '재백') { fillColor = 'rgba(30, 27, 16, 0.85)'; strokeColor = '#F59E0B'; }

            const pathData = describeArc(CENTER, CENTER, INNER_RADIUS, OUTER_RADIUS, startAngle, endAngle);
            const isSelected = selectedDaehanJiJi === jiji && (viewMode === 'base' || viewMode === 'daehan');

            return (
              <path
                key={jiji}
                d={pathData}
                fill={fillColor}
                stroke={isSelected ? '#F5D061' : strokeColor}
                strokeWidth={isSelected ? '2.5' : '1'}
                className="transition-all duration-300 hover:fill-opacity-90 cursor-pointer"
                onClick={() => handlePalaceClick(jiji)}
              />
            );
          })}
        </svg>

        {/* 12궁 정보 콘텐츠 층 */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {PALACE_ORDER_CIRCLE.map((jiji, idx) => {
            const angle = idx * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const midRadius = (INNER_RADIUS + OUTER_RADIUS) / 2;
            const x = CENTER + midRadius * Math.cos(rad);
            const y = CENTER + midRadius * Math.sin(rad);

            const data = gungData[jiji];
            if (!data) return null;

            const baseName = basePalaces[jiji];
            const daehanName = daehanPalaces[jiji];
            const yunyeonName = yunyeonPalaces[jiji];
            const mainStars = data['성요배치']['십사정성'] || [];
            const goodStars = data['성요배치']['보좌길성'] || [];
            const badStars = data['성요배치']['살성_및_형요'] || [];

            const isSelected = selectedDaehanJiJi === jiji && (viewMode === 'base' || viewMode === 'daehan');

            return (
              <div
                key={'content-' + jiji}
                className={`absolute pointer-events-auto flex flex-col items-center justify-between text-center p-0.5 sm:p-1.5 w-[16%] h-[15%] max-w-27.5 max-h-26.25 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 overflow-hidden ${isSelected ? 'scale-105' : 'hover:scale-102'}`}
                style={{ left: `${(x / SIZE) * 100}%`, top: `${(y / SIZE) * 100}%` }}
                onClick={() => handlePalaceClick(jiji)}
              >
                {/* 상단 궁 명칭 & 지지 */}
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 border-b border-[#D4AF37]/20 pb-0.5 w-full">
                  <span className="font-bold text-[9px] sm:text-[11px] md:text-[12px] text-[#F3D082] tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate">
                    {viewMode === 'base' ? baseName : viewMode === 'daehan' ? daehanName : yunyeonName}
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-[#B58E3D] font-mono shrink-0">
                    ({data['궁위간지']})
                  </span>
                </div>

                {/* 중앙 주요 별(성요) 영역 */}
                <div className="flex flex-col items-center justify-center gap-0.5 my-auto w-full px-0.5">
                  {/* 주성 (십사정성) */}
                  <div className="flex flex-wrap justify-center gap-x-0.5 sm:gap-x-1 w-full">
                    {mainStars.length > 0 ? (
                      mainStars.map((s: any) => (
                        <span key={s.명칭 || s} className="font-bold text-[8.5px] sm:text-[10px] md:text-[11px] text-[#FFF3D1] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-nowrap">
                          {s.명칭 || s}
                        </span>
                      ))
                    ) : (
                      /* 공궁(별이 없을 경우) 표시 */
                      <span className="text-[8px] sm:text-[9.5px] text-[#71717A] italic opacity-75 font-sans">(공궁)</span>
                    )}
                  </div>

                  {/* 길성 & 살성 */}
                  <div className="flex flex-wrap justify-center gap-x-0.5 sm:gap-x-1 gap-y-0.5 text-[7px] sm:text-[8.5px] md:text-[9px] leading-tight mt-0.5 w-full">
                    {goodStars.map((s: any) => (
                      <span key={s.명칭 || s} className="text-[#34D399] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap">{s.명칭 || s}</span>
                    ))}
                    {badStars.map((s: any) => (
                      <span key={s.명칭 || s} className="text-[#F87171] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap">{s.명칭 || s}</span>
                    ))}
                  </div>
                </div>

                {/* 하단 대한 연령대 */}
                {data['대한_연령대'] && (
                  <span className="text-[7px] sm:text-[8px] md:text-[8.5px] text-[#A1A1AA] bg-[#121319]/90 px-1 sm:px-1.5 py-0.2 rounded-full border border-[#27272A] font-mono shadow-sm shrink-0 whitespace-nowrap">
                    {data['대한_연령대'][0]}~{data['대한_연령대'][1]}세
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 중앙 중궁 (Central Hub) */}
        <div 
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#08090E]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-2 sm:p-4 text-center overflow-hidden"
          style={{ 
            width: `${((INNER_RADIUS * 2) / SIZE) * 100 - 2}%`, 
            height: `${((INNER_RADIUS * 2) / SIZE) * 100 - 2}%` 
          }}
        >
          {/* 세그먼트 탭 버튼 */}
          <div className="flex bg-[#12141D]/90 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-[#2A2D3D] mb-1 sm:mb-2.5">
            <button 
              onClick={() => { setViewMode('base'); setSelectedDaehanJiJi(baseMyungGungJiJi); }} 
              className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[8.5px] sm:text-[10.5px] font-medium rounded-md sm:rounded-lg transition-all ${viewMode === 'base' ? 'bg-linear-to-r from-[#D4AF37] to-[#AA822A] text-[#08090E] font-bold shadow-md' : 'text-[#8E93A4] hover:text-white'}`}
            >
              선천
            </button>
            <button 
              onClick={() => { setViewMode('daehan'); setSelectedDaehanJiJi(baseMyungGungJiJi); }} 
              className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[8.5px] sm:text-[10.5px] font-medium rounded-md sm:rounded-lg transition-all ${viewMode === 'daehan' ? 'bg-linear-to-r from-[#10B981] to-[#059669] text-white font-bold shadow-md' : 'text-[#8E93A4] hover:text-white'}`}
            >
              대한
            </button>
            <button 
              onClick={handleYunyeonModeClick} 
              className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[8.5px] sm:text-[10.5px] font-medium rounded-md sm:rounded-lg transition-all ${viewMode === 'yunyeon' ? 'bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold shadow-md' : 'text-[#8E93A4] hover:text-white'}`}
            >
              유년
            </button>
          </div>

          {/* 기본 프로필 정보 */}
          <div className="flex justify-between items-center w-[90%] text-[8.5px] sm:text-[11px] text-[#E4E4E7] border-b border-[#27272A] pb-1 sm:pb-2 my-0.5">
            <div className="text-left leading-tight">
              <p className="font-bold text-[#F3C66B] text-[10px] sm:text-[13px]">{basicInfo['성별']} / {basicInfo['나이']}세</p>
              <p className="text-[7.5px] sm:text-[9.5px] text-[#8E93A4] font-mono">양력 {basicInfo['양력생일'].join('.')}</p>
            </div>
            <div className="text-right leading-tight">
              <p className="font-bold text-[#E5B84B] text-[9.5px] sm:text-[12px]">{basicInfo['오행국']}</p>
              <p className="text-[7.5px] sm:text-[9.5px] text-[#8E93A4]">
                명주 <span className="text-[#F3C66B] font-semibold">{basicInfo['명주성']}</span> · 신주 <span className="text-[#F3C66B] font-semibold">{basicInfo['신주성']}</span>
              </p>
            </div>
          </div>

          {/* 사주 4주 */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 my-1 sm:my-2 w-[90%]">
            {[saju['시'], saju['일'], saju['월'], saju['년']].map((p, i) => {
              const h = p?.match(/\((.*?)\)/)?.[1] || p;
              const title = ['시', '일', '월', '년'][i];
              return (
                <div key={i} className="flex flex-col items-center bg-[#11131C]/90 py-0.5 sm:py-1 px-0.5 rounded sm:rounded-lg border border-[#232636]">
                  <span className="text-[7px] sm:text-[8.5px] text-[#71717A] mb-0.5">{title}</span>
                  <span className="text-[9.5px] sm:text-[12px] font-bold text-[#F3C66B] leading-none mb-0.5">{h?.[0]}</span>
                  <span className="text-[9.5px] sm:text-[12px] font-bold text-[#F3C66B] leading-none">{h?.[1]}</span>
                </div>
              );
            })}
          </div>

          {/* 상태 안내 태그 */}
          <div className="mt-0.5 text-center text-[7.5px] sm:text-[9.5px] text-[#E5C158] bg-[#1A160E]/90 border border-[#54411C] px-2 sm:px-3 py-0.5 rounded-full shadow-inner truncate max-w-[95%]">
            {viewMode === 'base' ? '궁을 선택하여 운세를 탐색하세요.' : viewMode === 'daehan' ? `대한: ${gungData[selectedDaehanJiJi || '子']['대한_연령대']?.[0]}~${gungData[selectedDaehanJiJi || '子']['대한_연령대']?.[1]}세` : `유년: ${selectedYunyeon?.['해당년도']}년`}
          </div>
        </div>
      </div>

      <ZiweiDetailTable 
        viewMode={viewMode} 
        activeDaehanData={activeDaehanData}
        baseSihwaStars={baseSihwaStars}
        daehanSihwaStars={daehanSihwaStars}
        yunyeonSihwaStars={yunyeonSihwaStars}
        daehanGan={daehanGan} 
        basePalaces={basePalaces}
        daehanPalaces={daehanPalaces}
        yunyeonPalaces={yunyeonPalaces}
        luckInfo={luckInfo} 
        selectedYunyeon={selectedYunyeon} 
        onYunyeonSelect={(yn: any) => { 
          setSelectedYunyeon(yn); 
          setViewMode('yunyeon'); 
          setSelectedDaehanJiJi(Object.keys(luckInfo['대한_목록'].find((d: any) => d['연령대'][0] === yn['소속대한_연령대']?.[0])?.['십이궁_배치'] || {}).find(k => luckInfo['대한_목록'].find((d: any) => d['연령대'][0] === yn['소속대한_연령대']?.[0])?.['십이궁_배치'][k] === '명궁') || '子'); 
        }} 
        gungData={gungData}
        PALACE_NAMES={PALACE_NAMES}
        JIJI_LIST={JIJI_LIST}
      />
    </div>
  );
}