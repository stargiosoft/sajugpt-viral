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
  const [viewMode, setViewMode] = useState<'base' | 'daehan'>('base');
  const [selectedJiJi, setSelectedJiJi] = useState<string | null>(null);

  if (!chartData || !chartData['선천명반_12궁']) return null;

  const gungData = chartData['선천명반_12궁'];
  const basicInfo = chartData['기본정보'];
  const saju = basicInfo['사주'];
  const luckInfo = chartData['행운_정보'];
  const baseGan = saju['년']?.charAt(0) || '甲';

  // 1. 선천 명궁 찾기 및 초기 세팅
  let baseMyungGungJiJi = '子';
  for (const [jiji, data] of Object.entries(gungData)) {
    if ((data as any)['선천궁명'] === '명궁') baseMyungGungJiJi = jiji;
  }
  
  // 최초 렌더링 시 명궁을 기본 선택값으로 지정
  useEffect(() => {
    if (!selectedJiJi) setSelectedJiJi(baseMyungGungJiJi);
  }, [baseMyungGungJiJi, selectedJiJi]);

  const activeJiJi = selectedJiJi || baseMyungGungJiJi;
  const activeData = gungData[activeJiJi];

  // 2. 선천 및 동적 궁위 맵핑
  const basePalaces = getDynamicPalaces(baseMyungGungJiJi);
  const dynamicPalaces = viewMode === 'daehan' ? getDynamicPalaces(activeJiJi) : basePalaces;

  // 3. 사화(선천/대한) 맵핑 배열
  const baseSihwaStars = FOUR_HWA_TABLE[baseGan] || [];
  const daehanGan = viewMode === 'daehan' ? gungData[activeJiJi]['궁위간지']?.charAt(0) : null;
  const daehanSihwaStars = daehanGan ? FOUR_HWA_TABLE[daehanGan] : [];

  const handlePalaceClick = (jiji: string) => {
    setSelectedJiJi(jiji);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto text-xs" style={{ fontFamily: "'Malgun Gothic', 'Dotum', sans-serif" }}>
      
      {/* ================================================================= */}
      {/* 1. 전문가용 4x4 명반 그리드 차트 */}
      {/* ================================================================= */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(4, minmax(130px, auto))',
          backgroundColor: '#000', border: '1px solid #000', gap: '1px'
        }}
      >
        {PALACE_ORDER_DISPLAY.map((jiji) => {
          const data = gungData[jiji];
          if (!data) return null;

          const baseName = basePalaces[jiji];
          const dynamicName = dynamicPalaces[jiji];
          const isShinGung = data['궁_속성']['신궁_포함여부'] === 'true';
          const ageRange = data['대한_연령대'];

          // 배경색 동적 지정
          let bgColor = '#FFFFFF';
          if (baseName === '명궁') bgColor = '#FEF08A'; 
          else if (baseName === '천이') bgColor = '#E0F2FE'; 
          else if (baseName === '관록') bgColor = '#DCFCE7'; 
          else if (baseName === '재백') bgColor = '#F3E8FF'; 
          
          // 선택된 궁위 하이라이트 (선천이든 대한이든 클릭한 칸 강조)
          if (activeJiJi === jiji) bgColor = viewMode === 'daehan' ? '#FDE047' : '#FDE68A';

          const mainStars = data['성요배치']['십사정성'] || [];
          const goodStars = data['성요배치']['보좌길성'] || [];
          const badStars = data['성요배치']['살성_및_형요'] || [];
          const shinsal = data['성요배치']['4대_십이신살'];
          const minorStars = [...(data['성요배치']['기타_잡성']['도화성'] || []), ...(data['성요배치']['기타_잡성']['제길성'] || []), ...(data['성요배치']['기타_잡성']['제흉성'] || []), ...(data['성요배치']['기타_잡성']['공망성계'] || [])];

          const renderStar = (s: any, colorClass: string, isMain: boolean = false) => {
            const name = typeof s === 'string' ? s : s.명칭;
            const str = typeof s === 'string' ? '' : s.묘왕지;
            
            let baseSihwaBadge = '';
            if (baseSihwaStars[0] === name) baseSihwaBadge = '록';
            if (baseSihwaStars[1] === name) baseSihwaBadge = '권';
            if (baseSihwaStars[2] === name) baseSihwaBadge = '과';
            if (baseSihwaStars[3] === name) baseSihwaBadge = '기';

            let dhSihwaBadge = '';
            if (viewMode === 'daehan' && daehanSihwaStars.length > 0) {
              if (daehanSihwaStars[0] === name) dhSihwaBadge = '대록';
              if (daehanSihwaStars[1] === name) dhSihwaBadge = '대권';
              if (daehanSihwaStars[2] === name) dhSihwaBadge = '대과';
              if (daehanSihwaStars[3] === name) dhSihwaBadge = '대기';
            }

            return (
              <div key={name} className="flex items-center gap-0.5 whitespace-nowrap">
                <span className={`${colorClass} ${isMain ? 'font-bold text-[13px]' : 'font-semibold text-[11px]'}`}>
                  {name}<span className="text-[10px] text-gray-500 font-normal ml-0.5">{str}</span>
                </span>
                {baseSihwaBadge && <span className="text-[10px] bg-blue-100 text-blue-800 px-0.5 rounded leading-none">{baseSihwaBadge}</span>}
                {dhSihwaBadge && <span className="text-[10px] bg-red-100 text-red-800 px-0.5 rounded leading-none">{dhSihwaBadge}</span>}
              </div>
            );
          };

          return (
            <div 
              key={jiji} onClick={() => handlePalaceClick(jiji)}
              style={{
                gridArea: GRID_AREAS[jiji], backgroundColor: bgColor,
                position: 'relative', padding: '4px', cursor: 'pointer',
              }}
              className="flex flex-col justify-between hover:bg-yellow-50 transition-colors"
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-0.5 w-[65%]">
                  {mainStars.map((s: any) => renderStar(s, 'text-fuchsia-700', true))}
                  {goodStars.map((s: any) => renderStar(s, 'text-blue-600'))}
                  {badStars.map((s: any) => renderStar(s, 'text-red-600'))}
                  <div className="flex flex-wrap gap-x-1 mt-1 text-[10px] text-gray-700 font-medium">
                    {minorStars.map((s: string, i: number) => <span key={'min'+i}>{s}</span>)}
                  </div>
                </div>
                <div className="flex flex-col items-end text-right w-[35%] text-[10px] text-gray-500 leading-tight gap-0.5">
                  {shinsal['장전십이신']?.map((s: string, i: number) => <span key={'s1'+i}>{s}</span>)}
                  {shinsal['박사십이신']?.map((s: string, i: number) => <span key={'s2'+i}>{s}</span>)}
                  {shinsal['태세십이신']?.map((s: string, i: number) => <span key={'s3'+i}>{s}</span>)}
                </div>
              </div>

              <div className="flex justify-between items-end w-full mt-2">
                <div className="flex flex-col font-bold text-[12px] tracking-tighter">
                  <div>
                    <span className={baseName === '명궁' ? 'text-red-600 bg-yellow-100' : 'text-blue-900'}>{baseName}</span>
                    {isShinGung && <span className="text-orange-600 ml-0.5">| 신</span>}
                  </div>
                  {viewMode === 'daehan' && (
                    <div className="text-green-700 mt-0.5 font-extrabold">{dynamicName}</div>
                  )}
                </div>
                <div className="flex flex-col items-end leading-none text-right">
                  <span className="text-[11px] text-red-600 font-bold">{data['궁위간지']}</span>
                  {ageRange && (
                    <span className="text-[11px] font-bold text-gray-800 mt-1">
                      {ageRange[0]}~{ageRange[1]}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600 mt-0.5">{shinsal['장생십이신']?.[0]}</span>
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
          <div className="flex gap-2 mb-3 justify-center border-b pb-2">
            <button 
              onClick={() => { setViewMode('base'); setSelectedJiJi(baseMyungGungJiJi); }}
              className={`px-3 py-1 text-[13px] font-bold rounded border ${viewMode === 'base' ? 'bg-blue-600 text-white border-blue-700 shadow-inner' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              선천 명반 상세 보기
            </button>
            <button 
              onClick={() => { setViewMode('daehan'); setSelectedJiJi(baseMyungGungJiJi); }}
              className={`px-3 py-1 text-[13px] font-bold rounded border ${viewMode === 'daehan' ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              대한/유년 운세 보기
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
              <p>명주: {basicInfo['명주성']}</p>
              <p>신주: {basicInfo['신주성']}</p>
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-4">
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

          <div className="mt-auto text-center font-bold text-[11px] text-red-500 animate-pulse">
            👆 12궁을 클릭하시면 아래에 상세 표가 나타납니다.
          </div>
        </div>
      </div>


      {/* ================================================================= */}
      {/* 2. 하단 다이내믹 데이터 테이블 영역 (클릭 및 모드에 따라 100% 동적 변경) */}
      {/* ================================================================= */}
      {activeData && (
        <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-300">
          
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              <span className={viewMode === 'base' ? 'text-blue-700' : 'text-green-700'}>
                [{viewMode === 'base' ? '선천 분석' : '대한 분석'}]
              </span> 
              {' '}{basePalaces[activeJiJi]} 
              <span className="text-sm text-gray-500 font-normal ml-2">
                ({activeJiJi}궁 / 간지: {activeData['궁위간지']} / {activeData['대한_연령대']?.[0]}~{activeData['대한_연령대']?.[1]}세)
              </span>
            </h3>
            {activeData['궁_속성']['공궁_여부'] === 'true' && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-[11px] rounded font-bold">공궁(空宮)</span>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* [A] 선천명반 모드일 때 보여줄 아주 상세한 데이터 표 */}
          {/* ---------------------------------------------------- */}
          {viewMode === 'base' && (
            <div className="flex flex-col gap-4">
              
              {/* 1) 성요 및 신살 상세 표 */}
              <table className="w-full text-left text-[13px] border-collapse border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border border-gray-200 p-2 w-[20%]">분류</th>
                    <th className="border border-gray-200 p-2 w-[40%]">배치된 성요 및 신살</th>
                    <th className="border border-gray-200 p-2 w-[40%]">묘왕리함 및 비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold text-fuchsia-800 bg-fuchsia-50">14정성 (주성)</td>
                    <td className="border border-gray-200 p-2 font-bold">
                      {activeData['성요배치']['십사정성']?.map((s: any) => s.명칭).join(', ') || '-'}
                    </td>
                    <td className="border border-gray-200 p-2 text-gray-600">
                      {activeData['성요배치']['십사정성']?.map((s: any) => `${s.명칭}(${s.묘왕지})`).join(', ') || '대궁에서 별을 빌려옵니다 (차성안궁)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold text-blue-700 bg-blue-50">보좌길성</td>
                    <td className="border border-gray-200 p-2">
                      {activeData['성요배치']['보좌길성']?.map((s: any) => s.명칭).join(', ') || '-'}
                    </td>
                    <td className="border border-gray-200 p-2 text-gray-600">
                      {activeData['성요배치']['보좌길성']?.map((s: any) => `${s.명칭}${s.묘왕지 ? `(${s.묘왕지})` : ''}`).join(', ') || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold text-red-700 bg-red-50">살성 및 형요</td>
                    <td className="border border-gray-200 p-2 text-red-600">
                      {activeData['성요배치']['살성_및_형요']?.map((s: any) => s.명칭).join(', ') || '-'}
                    </td>
                    <td className="border border-gray-200 p-2 text-gray-600">
                      {activeData['성요배치']['살성_및_형요']?.map((s: any) => `${s.명칭}${s.묘왕지 ? `(${s.묘왕지})` : ''}`).join(', ') || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold text-gray-700 bg-gray-50">기타 잡성</td>
                    <td className="border border-gray-200 p-2 col-span-2" colSpan={2}>
                      <div className="flex flex-col gap-1">
                        <span className="text-pink-600">도화성: {activeData['성요배치']['기타_잡성']['도화성']?.join(', ') || '-'}</span>
                        <span className="text-green-700">제길성: {activeData['성요배치']['기타_잡성']['제길성']?.join(', ') || '-'}</span>
                        <span className="text-orange-700">제흉성: {activeData['성요배치']['기타_잡성']['제흉성']?.join(', ') || '-'}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 font-bold text-gray-700 bg-gray-50">4대 신살</td>
                    <td className="border border-gray-200 p-2 col-span-2" colSpan={2}>
                      <span className="text-gray-600">
                        {activeData['성요배치']['4대_십이신살']['장전십이신']?.[0]} / {activeData['성요배치']['4대_십이신살']['태세십이신']?.[0]} / {activeData['성요배치']['4대_십이신살']['박사십이신']?.[0]} / 장생: {activeData['성요배치']['4대_십이신살']['장생십이신']?.[0]}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 2) 궁간비성 (이 궁에서 날아가는 선천 사화 표) */}
              <div className="mt-2">
                <span className="block text-[13px] font-bold text-gray-800 mb-2">🚀 궁간비성 (현재 궁 {activeData['궁위간지']}에서 촉발되는 사화의 이동)</span>
                <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 p-2 text-green-700">화록 (발생/이익)</th>
                      <th className="border border-gray-200 p-2 text-blue-700">화권 (권위/지배)</th>
                      <th className="border border-gray-200 p-2 text-purple-700">화과 (명예/학문)</th>
                      <th className="border border-gray-200 p-2 text-red-700">화기 (결과/집착)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-2 bg-green-50">
                        <span className="font-bold block">{activeData['궁간비성']['화록']['성요']}</span>
                        <span className="text-gray-500 mt-1 block">▶ {activeData['궁간비성']['화록']['화입궁']}궁 ({basePalaces[activeData['궁간비성']['화록']['화입궁']]})</span>
                      </td>
                      <td className="border border-gray-200 p-2 bg-blue-50">
                        <span className="font-bold block">{activeData['궁간비성']['화권']['성요']}</span>
                        <span className="text-gray-500 mt-1 block">▶ {activeData['궁간비성']['화권']['화입궁']}궁 ({basePalaces[activeData['궁간비성']['화권']['화입궁']]})</span>
                      </td>
                      <td className="border border-gray-200 p-2 bg-purple-50">
                        <span className="font-bold block">{activeData['궁간비성']['화과']['성요']}</span>
                        <span className="text-gray-500 mt-1 block">▶ {activeData['궁간비성']['화과']['화입궁']}궁 ({basePalaces[activeData['궁간비성']['화과']['화입궁']]})</span>
                      </td>
                      <td className="border border-gray-200 p-2 bg-red-50">
                        <span className="font-bold block text-red-600">{activeData['궁간비성']['화기']['성요']}</span>
                        <span className="text-red-500 mt-1 block font-bold">▶ {activeData['궁간비성']['화기']['화입궁']}궁 ({basePalaces[activeData['궁간비성']['화기']['화입궁']]})</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* [B] 대한/유년 모드일 때 보여줄 운세 동향 표 */}
          {/* ---------------------------------------------------- */}
          {viewMode === 'daehan' && (
            <div className="flex flex-col gap-4">
              
              {/* 1) 대한 사화 표 */}
              <div>
                <span className="block text-[13px] font-bold text-gray-800 mb-2">🎯 대한 사화 (현재 {activeData['대한_연령대']?.[0]}~{activeData['대한_연령대']?.[1]}세 대운을 지배하는 기운)</span>
                <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 p-2 text-green-700">대록 (발생/이익)</th>
                      <th className="border border-gray-200 p-2 text-blue-700">대권 (권위/지배)</th>
                      <th className="border border-gray-200 p-2 text-purple-700">대과 (명예/학문)</th>
                      <th className="border border-gray-200 p-2 text-red-700">대기 (결과/집착)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-2 font-bold bg-green-50">{activeData['궁간비성']['화록']['성요']} <span className="text-gray-500 font-normal">({activeData['궁간비성']['화록']['화입궁']}궁)</span></td>
                      <td className="border border-gray-200 p-2 font-bold bg-blue-50">{activeData['궁간비성']['화권']['성요']} <span className="text-gray-500 font-normal">({activeData['궁간비성']['화권']['화입궁']}궁)</span></td>
                      <td className="border border-gray-200 p-2 font-bold bg-purple-50">{activeData['궁간비성']['화과']['성요']} <span className="text-gray-500 font-normal">({activeData['궁간비성']['화과']['화입궁']}궁)</span></td>
                      <td className="border border-gray-200 p-2 font-bold text-red-600 bg-red-50">{activeData['궁간비성']['화기']['성요']} <span className="text-red-500 font-normal">({activeData['궁간비성']['화기']['화입궁']}궁)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2) 유년 10년치 상세 리스트 표 */}
              <div>
                <span className="block text-[13px] font-bold text-gray-800 mb-2">🗓️ 해당 대한에 속하는 유년 (1년 운) 사화 흐름 10년 치</span>
                <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="border border-gray-200 p-2 w-[15%]">연도(나이)</th>
                      <th className="border border-gray-200 p-2 w-[15%]">선천/대한궁</th>
                      <th className="border border-gray-200 p-2 text-green-700">화록</th>
                      <th className="border border-gray-200 p-2 text-blue-700">화권</th>
                      <th className="border border-gray-200 p-2 text-purple-700">화과</th>
                      <th className="border border-gray-200 p-2 text-red-700">화기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {luckInfo['유년_목록']
                      .filter((yn: any) => activeData['대한_연령대']?.[0] <= yn['나이'] && yn['나이'] <= activeData['대한_연령대']?.[1])
                      .map((yn: any, idx: number) => {
                        // 해당 유년이 위치한 궁의 지지
                        const gungJiji = Object.keys(yn['십이궁_배치']).find(k => yn['십이궁_배치'][k] === '명궁') || '';
                        const saHwa = yn['유년사화'];
                        return (
                          <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                            <td className="border-r border-gray-200 p-2 font-bold text-gray-800">{yn['해당년도']} <br/><span className="text-[10px] text-gray-500 font-normal">({yn['나이']}세)</span></td>
                            <td className="border-r border-gray-200 p-2 text-gray-700 font-semibold">{basePalaces[gungJiji]}<br/><span className="text-[10px] text-gray-400 font-normal">({gungJiji}궁)</span></td>
                            <td className="p-2 border-r border-gray-200">{saHwa['화록']['성요']} <span className="text-[10px] text-gray-400 block">({saHwa['화록']['화입궁']})</span></td>
                            <td className="p-2 border-r border-gray-200">{saHwa['화권']['성요']} <span className="text-[10px] text-gray-400 block">({saHwa['화권']['화입궁']})</span></td>
                            <td className="p-2 border-r border-gray-200">{saHwa['화과']['성요']} <span className="text-[10px] text-gray-400 block">({saHwa['화과']['화입궁']})</span></td>
                            <td className="p-2 text-red-600 font-bold">{saHwa['화기']['성요']} <span className="text-[10px] text-red-400 font-normal block">({saHwa['화기']['화입궁']})</span></td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}