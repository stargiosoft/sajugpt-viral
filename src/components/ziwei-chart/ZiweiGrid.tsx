// src/components/ziwei-chart/ZiweiGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';

interface Props {
  chartData?: any;
}

const JIJI_LIST = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const PALACE_ORDER_DISPLAY = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
const PALACE_NAMES = ['명궁', '형제', '부처', '자녀', '재백', '질액', '천이', '노복', '관록', '전택', '복덕', '부모'];

const GRID_AREAS: Record<string, string> = {
  '巳': '1 / 1 / 2 / 2', '午': '1 / 2 / 2 / 3', '未': '1 / 3 / 2 / 4', '申': '1 / 4 / 2 / 5',
  '酉': '2 / 4 / 3 / 5', '戌': '3 / 4 / 4 / 5', '亥': '4 / 4 / 5 / 5', '子': '4 / 3 / 5 / 4',
  '丑': '4 / 2 / 5 / 3', '寅': '4 / 1 / 5 / 2', '卯': '3 / 1 / 4 / 2', '辰': '2 / 1 / 3 / 2'
};

const FOUR_HWA_TABLE: Record<string, string[]> = {
  '甲': ['염정', '파군', '무곡', '태양'], '乙': ['천기', '천량', '자미', '태음'],
  '丙': ['천동', '천기', '문창', '염정'], '丁': ['태음', '천동', '천기', '거문'],
  '戊': ['탐랑', '태음', '우필', '천기'], '己': ['무곡', '탐랑', '천량', '문곡'],
  '庚': ['태양', '무곡', '태음', '천동'], '辛': ['거문', '태양', '문곡', '문창'],
  '壬': ['천량', '자미', '좌보', '무곡'], '癸': ['파군', '거문', '태음', '탐랑'],
};

// 동적 궁위 맵핑 헬퍼
function getDynamicPalaces(baseJiJi: string): Record<string, string> {
  const idx = JIJI_LIST.indexOf(baseJiJi);
  const layout: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const branchIdx = (idx - i + 12) % 12;
    layout[JIJI_LIST[branchIdx]] = PALACE_NAMES[i];
  }
  return layout;
}

export default function ZiweiGrid({ chartData }: Props) {
  // 모드 상태: base(선천), daehan(대한), yunyeon(유년)
  const [viewMode, setViewMode] = useState<'base' | 'daehan' | 'yunyeon'>('base');
  
  // 선택된 대한 지지
  const [selectedDaehanJiJi, setSelectedDaehanJiJi] = useState<string | null>(null);
  
  // 선택된 유년 데이터 (년도 등)
  const [selectedYunyeon, setSelectedYunyeon] = useState<any>(null);

  if (!chartData || !chartData['선천명반_12궁']) return null;

  const gungData = chartData['선천명반_12궁'];
  const basicInfo = chartData['기본정보'];
  const saju = basicInfo['사주'];
  const luckInfo = chartData['행운_정보'] || { 대한_목록: [], 유년_목록: [] };
  const baseGan = saju['년']?.charAt(0) || '甲';

  // 1. 선천 명궁 지지 찾기
  let baseMyungGungJiJi = '子';
  for (const [jiji, data] of Object.entries(gungData)) {
    if ((data as any)['선천궁명'] === '명궁') baseMyungGungJiJi = jiji;
  }
  
  // 초기 세팅 (컴포넌트 로드 시)
  useEffect(() => {
    if (!selectedDaehanJiJi) setSelectedDaehanJiJi(baseMyungGungJiJi);
    if (!selectedYunyeon && luckInfo['유년_목록'].length > 0) setSelectedYunyeon(luckInfo['유년_목록'][0]);
  }, [baseMyungGungJiJi, luckInfo, selectedDaehanJiJi, selectedYunyeon]);

  // 현재 활성화된 궁위/데이터 세팅
  const activeJiJi = selectedDaehanJiJi || baseMyungGungJiJi;
  const activeData = gungData[activeJiJi];

  // 2. 동적 궁위 맵핑 (선천, 대한, 유년)
  const basePalaces = getDynamicPalaces(baseMyungGungJiJi);
  const daehanPalaces = getDynamicPalaces(activeJiJi);
  
  let yunyeonPalaces: Record<string, string> = {};
  if (selectedYunyeon) {
    const yJiJi = Object.keys(selectedYunyeon['십이궁_배치']).find(k => selectedYunyeon['십이궁_배치'][k] === '명궁') || '子';
    yunyeonPalaces = getDynamicPalaces(yJiJi);
  }

  // 3. 사화(선천/대한/유년) 맵핑 배열
  const baseSihwaStars = FOUR_HWA_TABLE[baseGan] || [];
  
  const daehanGan = gungData[activeJiJi]['궁위간지']?.charAt(0);
  const daehanSihwaStars = viewMode === 'daehan' || viewMode === 'yunyeon' ? (FOUR_HWA_TABLE[daehanGan] || []) : [];
  
  const yunyeonGan = selectedYunyeon ? selectedYunyeon['천간'] : null;
  const yunyeonSihwaStars = viewMode === 'yunyeon' && yunyeonGan ? (FOUR_HWA_TABLE[yunyeonGan] || []) : [];

  // 궁(차트 칸) 클릭 이벤트
  const handlePalaceClick = (jiji: string) => {
    if (viewMode === 'daehan') {
      setSelectedDaehanJiJi(jiji);
    }
  };

  // 유년 년도 클릭 이벤트
  const handleYunyeonSelect = (ynData: any) => {
    setSelectedYunyeon(ynData);
    setViewMode('yunyeon');
    
    // 유년이 속한 대한을 찾아 대한 지지도 맞춰줌
    const targetDaehan = luckInfo['대한_목록'].find((d: any) => d['연령대'][0] === ynData['소속대한_연령대']?.[0]);
    if (targetDaehan) {
      const dhJiJi = Object.keys(targetDaehan['십이궁_배치']).find(k => targetDaehan['십이궁_배치'][k] === '명궁');
      if (dhJiJi) setSelectedDaehanJiJi(dhJiJi);
    }
  };

  return (
    <div className="w-full max-w-[850px] mx-auto text-xs" style={{ fontFamily: "'Malgun Gothic', 'Dotum', sans-serif" }}>
      
      {/* ================================================================= */}
      {/* 1. 전문가용 4x4 명반 그리드 차트 */}
      {/* ================================================================= */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(4, minmax(140px, auto))',
          backgroundColor: '#000', border: '1px solid #000', gap: '1px'
        }}
      >
        {PALACE_ORDER_DISPLAY.map((jiji) => {
          const data = gungData[jiji];
          if (!data) return null;

          const baseName = basePalaces[jiji];
          const isShinGung = data['궁_속성']['신궁_포함여부'] === 'true';
          const ageRange = data['대한_연령대'];

          // 배경색 동적 지정
          let bgColor = '#FFFFFF';
          if (baseName === '명궁') bgColor = '#FEF08A'; 
          else if (baseName === '천이') bgColor = '#E0F2FE'; 
          else if (baseName === '관록') bgColor = '#DCFCE7'; 
          else if (baseName === '재백') bgColor = '#F3E8FF'; 
          
          if (viewMode === 'daehan' && activeJiJi === jiji) bgColor = '#FDE047'; 

          const mainStars = data['성요배치']['십사정성'] || [];
          const goodStars = data['성요배치']['보좌길성'] || [];
          const badStars = data['성요배치']['살성_및_형요'] || [];
          const shinsal = data['성요배치']['4대_십이신살'];
          const minorStars = [...(data['성요배치']['기타_잡성']['도화성'] || []), ...(data['성요배치']['기타_잡성']['제길성'] || []), ...(data['성요배치']['기타_잡성']['제흉성'] || []), ...(data['성요배치']['기타_잡성']['공망성계'] || [])];

          // 🌟 별자리 렌더링 (사화 뱃지 부착)
          const renderStar = (s: any, colorClass: string, isMain: boolean = false) => {
            const name = typeof s === 'string' ? s : s.명칭;
            const str = typeof s === 'string' ? '' : s.묘왕지;
            
            let baseBadge = '', dhBadge = '', ynBadge = '';
            if (baseSihwaStars[0] === name) baseBadge = '록';
            if (baseSihwaStars[1] === name) baseBadge = '권';
            if (baseSihwaStars[2] === name) baseBadge = '과';
            if (baseSihwaStars[3] === name) baseBadge = '기';

            if ((viewMode === 'daehan' || viewMode === 'yunyeon') && daehanSihwaStars.length > 0) {
              if (daehanSihwaStars[0] === name) dhBadge = '대록';
              if (daehanSihwaStars[1] === name) dhBadge = '대권';
              if (daehanSihwaStars[2] === name) dhBadge = '대과';
              if (daehanSihwaStars[3] === name) dhBadge = '대기';
            }

            if (viewMode === 'yunyeon' && yunyeonSihwaStars.length > 0) {
              if (yunyeonSihwaStars[0] === name) ynBadge = '년록';
              if (yunyeonSihwaStars[1] === name) ynBadge = '년권';
              if (yunyeonSihwaStars[2] === name) ynBadge = '년과';
              if (yunyeonSihwaStars[3] === name) ynBadge = '년기';
            }

            return (
              <div key={name} className="flex items-center gap-0.5 whitespace-nowrap mb-0.5">
                <span className={`${colorClass} ${isMain ? 'font-bold text-[13px]' : 'font-semibold text-[11px]'}`}>
                  {name}<span className="text-[10px] text-gray-500 font-normal ml-0.5">{str}</span>
                </span>
                {baseBadge && <span className="text-[10px] bg-blue-100 text-blue-800 px-0.5 rounded leading-none">{baseBadge}</span>}
                {dhBadge && <span className="text-[10px] bg-green-100 text-green-800 px-0.5 rounded leading-none">{dhBadge}</span>}
                {ynBadge && <span className="text-[10px] bg-orange-100 text-orange-800 px-0.5 rounded leading-none">{ynBadge}</span>}
              </div>
            );
          };

          return (
            <div 
              key={jiji} onClick={() => handlePalaceClick(jiji)}
              style={{
                gridArea: GRID_AREAS[jiji], backgroundColor: bgColor,
                position: 'relative', padding: '4px', cursor: viewMode === 'daehan' ? 'pointer' : 'default',
              }}
              className="flex flex-col justify-between hover:bg-yellow-50 transition-colors"
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-0 w-[65%]">
                  {mainStars.map((s: any) => renderStar(s, 'text-fuchsia-700', true))}
                  {goodStars.map((s: any) => renderStar(s, 'text-blue-600'))}
                  {badStars.map((s: any) => renderStar(s, 'text-red-600'))}
                  <div className="flex flex-wrap gap-x-1 mt-1 text-[10px] text-gray-700 font-medium leading-none">
                    {minorStars.map((s: string, i: number) => <span key={'min'+i}>{s}</span>)}
                  </div>
                </div>
                <div className="flex flex-col items-end text-right w-[35%] text-[10px] text-gray-500 leading-tight gap-0.5">
                  {shinsal['장전십이신']?.map((s: string, i: number) => <span key={'s1'+i}>{s}</span>)}
                  {shinsal['박사십이신']?.map((s: string, i: number) => <span key={'s2'+i}>{s}</span>)}
                  {shinsal['태세십이신']?.map((s: string, i: number) => <span key={'s3'+i}>{s}</span>)}
                </div>
              </div>

              {/* 하단 영역: 동적 궁위 이름 및 정보 표출 */}
              <div className="flex justify-between items-end w-full mt-2">
                <div className="flex flex-col font-bold text-[12px] tracking-tighter gap-0.5">
                  <div>
                    <span className={baseName === '명궁' ? 'text-red-600 bg-yellow-100' : 'text-blue-900'}>{baseName}</span>
                    {isShinGung && <span className="text-orange-600 ml-0.5">| 신</span>}
                  </div>
                  {(viewMode === 'daehan' || viewMode === 'yunyeon') && (
                    <div className="text-green-700 font-extrabold">{daehanPalaces[jiji]} (대)</div>
                  )}
                  {viewMode === 'yunyeon' && selectedYunyeon && (
                    <div className="text-orange-700 font-extrabold">{yunyeonPalaces[jiji]} (년)</div>
                  )}
                </div>

                <div className="flex flex-col items-end leading-none text-right gap-1">
                  <span className="text-[11px] text-red-600 font-bold">{data['궁위간지']}</span>
                  {ageRange && (
                    <span className="text-[11px] font-bold text-gray-800 bg-gray-100 px-1 rounded">
                      {ageRange[0]}~{ageRange[1]}세
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600">{shinsal['장생십이신']?.[0]}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 중앙 컨트롤 패널 */}
        <div
          style={{
            gridArea: '2 / 2 / 4 / 4', backgroundColor: '#F9FAFB',
            display: 'flex', flexDirection: 'column', padding: '12px', zIndex: 20
          }}
        >
          {/* 모드 선택 버튼 영역 */}
          <div className="flex gap-2 mb-3 justify-center border-b pb-2">
            <button 
              onClick={() => { setViewMode('base'); setSelectedJiJi(baseMyungGungJiJi); }}
              className={`px-3 py-1 text-[12px] font-bold rounded border ${viewMode === 'base' ? 'bg-blue-600 text-white border-blue-700 shadow-inner' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              선천명반
            </button>
            <button 
              onClick={() => { setViewMode('daehan'); setSelectedJiJi(baseMyungGungJiJi); }}
              className={`px-3 py-1 text-[12px] font-bold rounded border ${viewMode === 'daehan' ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              대한 선택
            </button>
            <button 
              onClick={() => { setViewMode('yunyeon'); }}
              className={`px-3 py-1 text-[12px] font-bold rounded border ${viewMode === 'yunyeon' ? 'bg-orange-500 text-white border-orange-600 shadow-inner' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              유년 선택
            </button>
          </div>
          
          <div className="flex justify-between items-start text-[11px] text-gray-700 px-2">
            <div>
              <p className="font-bold text-black mb-1">{basicInfo['성별']} / {basicInfo['나이']}세</p>
              <p>양력: {basicInfo['양력생일'].join('.')}</p>
              <p>음력: {basicInfo['음력생일'].slice(0,3).join('.')} ({basicInfo['음력생일'][3]})</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-800 mb-1">{basicInfo['오행국']} / {basicInfo['납음오행']}</p>
              <p>명주: {basicInfo['명주성']}, 신주: {basicInfo['신주성']}</p>
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-3">
            {[saju['시'], saju['일'], saju['월'], saju['년']].map((pillar, idx) => {
              if (!pillar) return null;
              const hanja = pillar.match(/\((.*?)\)/)?.[1] || pillar;
              const title = ['시주', '일주', '월주', '년주'][idx];
              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 mb-1">{title}</span>
                  <span className="text-lg font-bold text-gray-900">{hanja[0]}</span>
                  <span className="text-lg font-bold text-gray-900">{hanja[1]}</span>
                </div>
              );
            })}
          </div>

          {viewMode === 'daehan' && (
            <div className="mt-auto text-center font-bold text-[11px] text-green-600 bg-green-50 p-1 rounded animate-pulse">
              👆 12궁을 클릭하면 해당 대한(10년) 명반으로 변환됩니다.
            </div>
          )}
          {viewMode === 'yunyeon' && selectedYunyeon && (
            <div className="mt-auto text-center font-bold text-[11px] text-orange-600 bg-orange-50 p-1 rounded">
              📍 현재 선택된 유년: {selectedYunyeon['해당년도']}년 ({selectedYunyeon['나이']}세)
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. 하단 상세 데이터 테이블 영역 (모드에 따라 완벽 동기화) */}
      {/* ================================================================= */}
      <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-300">
        
        {/* ---------------------------------------------------- */}
        {/* [A] 선천 모드: 선택된 궁의 상세 데이터 표출 */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'base' && activeData && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-[15px] font-bold text-blue-800">
                [선천] {basePalaces[activeJiJi]} <span className="text-gray-500 font-normal">({activeJiJi}궁)</span> 상세 데이터
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
              <div className="bg-gray-50 p-2 rounded border">
                <span className="block text-gray-500 mb-1">궁위 간지</span>
                <span className="font-bold">{activeData['궁위간지']}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded border">
                <span className="block text-gray-500 mb-1">대한 연령대</span>
                <span className="font-bold">{activeData['대한_연령대']?.[0]} ~ {activeData['대한_연령대']?.[1]}세</span>
              </div>
              <div className="bg-gray-50 p-2 rounded border col-span-2">
                <span className="block text-gray-500 mb-1">삼방사정 (대궁/삼합궁)</span>
                <span className="font-bold">{activeData['삼방사정']['대궁']}궁 / {activeData['삼방사정']['삼합궁'].join(', ')}궁</span>
              </div>
            </div>

            <span className="block text-[12px] font-bold text-gray-800 mt-2 border-b pb-1">🚀 선천 궁간비성 (이 궁에서 파생되는 사화)</span>
            <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 p-1.5 text-green-700">화록</th>
                  <th className="border border-gray-200 p-1.5 text-blue-700">화권</th>
                  <th className="border border-gray-200 p-1.5 text-purple-700">화과</th>
                  <th className="border border-gray-200 p-1.5 text-red-700">화기</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2 bg-green-50">
                    <span className="font-bold">{activeData['궁간비성']['화록']['성요']}</span> <span className="text-gray-500 text-[10px]">({activeData['궁간비성']['화록']['화입궁']}궁)</span>
                  </td>
                  <td className="border border-gray-200 p-2 bg-blue-50">
                    <span className="font-bold">{activeData['궁간비성']['화권']['성요']}</span> <span className="text-gray-500 text-[10px]">({activeData['궁간비성']['화권']['화입궁']}궁)</span>
                  </td>
                  <td className="border border-gray-200 p-2 bg-purple-50">
                    <span className="font-bold">{activeData['궁간비성']['화과']['성요']}</span> <span className="text-gray-500 text-[10px]">({activeData['궁간비성']['화과']['화입궁']}궁)</span>
                  </td>
                  <td className="border border-gray-200 p-2 bg-red-50 text-red-600 font-bold">
                    {activeData['궁간비성']['화기']['성요']} <span className="text-red-400 text-[10px]">({activeData['궁간비성']['화기']['화입궁']}궁)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* [B] 대한 모드: 해당 대운을 지배하는 사화와 소속 유년 표출 */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'daehan' && activeData && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-[15px] font-bold text-green-800">
                [대한] {activeData['대한_연령대']?.[0]} ~ {activeData['대한_연령대']?.[1]}세 대운 분석
              </h3>
              <span className="text-xs text-gray-500">대한 명궁: {activeJiJi}궁 ({basePalaces[activeJiJi]})</span>
            </div>

            <div>
              <span className="block text-[12px] font-bold text-gray-800 mb-1">🎯 대한 사화 (현재 10년을 지배하는 기운 / 천간: {daehanGan})</span>
              <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 p-1.5 text-green-700">대록</th>
                    <th className="border border-gray-200 p-1.5 text-blue-700">대권</th>
                    <th className="border border-gray-200 p-1.5 text-purple-700">대과</th>
                    <th className="border border-gray-200 p-1.5 text-red-700">대기</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold bg-green-50">{activeData['궁간비성']['화록']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeData['궁간비성']['화록']['화입궁']}궁)</span></td>
                    <td className="border border-gray-200 p-2 font-bold bg-blue-50">{activeData['궁간비성']['화권']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeData['궁간비성']['화권']['화입궁']}궁)</span></td>
                    <td className="border border-gray-200 p-2 font-bold bg-purple-50">{activeData['궁간비성']['화과']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeData['궁간비성']['화과']['화입궁']}궁)</span></td>
                    <td className="border border-gray-200 p-2 font-bold text-red-600 bg-red-50">{activeData['궁간비성']['화기']['성요']} <span className="text-red-400 font-normal text-[10px]">({activeData['궁간비성']['화기']['화입궁']}궁)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 이 대한에 속하는 유년 리스트 (클릭 시 유년 모드로 전환) */}
            <div>
              <span className="block text-[12px] font-bold text-gray-800 mb-1">🗓️ 속해있는 유년(1년 운) 리스트 (클릭하면 유년 명반으로 전환됩니다)</span>
              <div className="flex flex-wrap gap-2">
                {luckInfo['유년_목록']
                  .filter((yn: any) => activeData['대한_연령대']?.[0] <= yn['나이'] && yn['나이'] <= activeData['대한_연령대']?.[1])
                  .map((yn: any, idx: number) => (
                    <button
                      key={idx} onClick={() => handleYunyeonSelect(yn)}
                      className="px-3 py-1.5 border border-orange-200 bg-orange-50 text-orange-800 rounded hover:bg-orange-500 hover:text-white transition-colors text-[11px] font-bold"
                    >
                      {yn['해당년도']}년 ({yn['나이']}세)
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* [C] 유년 모드: 선택된 1년의 사화 동향 집중 분석 */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'yunyeon' && selectedYunyeon && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-[15px] font-bold text-orange-700">
                [유년] {selectedYunyeon['해당년도']}년 ({selectedYunyeon['나이']}세) 운세 분석
              </h3>
              <span className="text-xs text-gray-500">
                유년 명궁: {Object.keys(selectedYunyeon['십이궁_배치']).find(k => selectedYunyeon['십이궁_배치'][k] === '명궁')}궁 
              </span>
            </div>

            <div>
              <span className="block text-[12px] font-bold text-gray-800 mb-1">✨ 유년 사화 (올해 1년을 지배하는 발생 기운 / 천간: {selectedYunyeon['천간']})</span>
              <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 p-1.5 text-green-700">년록</th>
                    <th className="border border-gray-200 p-1.5 text-blue-700">년권</th>
                    <th className="border border-gray-200 p-1.5 text-purple-700">년과</th>
                    <th className="border border-gray-200 p-1.5 text-red-700">년기 (주의!)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold bg-green-50">{selectedYunyeon['유년사화']['화록']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화록']['화입궁']}궁)</span></td>
                    <td className="border border-gray-200 p-2 font-bold bg-blue-50">{selectedYunyeon['유년사화']['화권']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화권']['화입궁']}궁)</span></td>
                    <td className="border border-gray-200 p-2 font-bold bg-purple-50">{selectedYunyeon['유년사화']['화과']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화과']['화입궁']}궁)</span></td>
                    <td className="border border-gray-200 p-2 font-bold text-red-600 bg-red-50">{selectedYunyeon['유년사화']['화기']['성요']} <span className="text-red-400 font-normal text-[10px]">({selectedYunyeon['유년사화']['화기']['화입궁']}궁)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 다른 유년도 바로가기 */}
            <div>
              <span className="block text-[11px] text-gray-500 mb-1">다른 연도 보기</span>
              <div className="flex flex-wrap gap-1">
                {luckInfo['유년_목록'].map((yn: any, idx: number) => (
                  <button
                    key={idx} onClick={() => handleYunyeonSelect(yn)}
                    className={`px-2 py-1 border text-[10px] rounded ${yn['해당년도'] === selectedYunyeon['해당년도'] ? 'bg-orange-500 text-white border-orange-600 font-bold' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                  >
                    {yn['해당년도']}년
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}