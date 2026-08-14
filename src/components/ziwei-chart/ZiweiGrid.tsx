'use client';

import { useState, useEffect } from 'react';
import ZiweiDetailTable from './ZiweiDetailTable';

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

  return (
    <div className="w-full max-w-[900px] mx-auto text-xs" style={{ fontFamily: "'Malgun Gothic', 'Dotum', sans-serif" }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridTemplateRows: 'repeat(4, minmax(145px, auto))', backgroundColor: '#000', border: '1px solid #000', gap: '1px' }}>
        {PALACE_ORDER_DISPLAY.map((jiji) => {
          const data = gungData[jiji];
          if (!data) return null;

          const baseName = basePalaces[jiji];
          const daehanName = daehanPalaces[jiji];
          const yunyeonName = yunyeonPalaces[jiji];
          const isShinGung = data['궁_속성']['신궁_포함여부'] === 'true';
          const ageRange = data['대한_연령대'];

          // 모드에 따른 삼방사정 동적 색상 반영
          let bgColor = '#FFFFFF';
          if (viewMode === 'base') {
            if (baseName === '명궁') bgColor = '#FEF08A';
            else if (baseName === '천이') bgColor = '#E0F2FE';
            else if (baseName === '관록') bgColor = '#DCFCE7';
            else if (baseName === '재백') bgColor = '#F3E8FF';
          } else if (viewMode === 'daehan') {
            if (daehanName === '명궁') bgColor = '#FDE047'; 
            else if (daehanName === '천이') bgColor = '#BAE6FD';
            else if (daehanName === '관록') bgColor = '#BBF7D0';
            else if (daehanName === '재백') bgColor = '#E9D5FF';
          } else if (viewMode === 'yunyeon') {
            if (yunyeonName === '명궁') bgColor = '#FDBA74'; 
            else if (yunyeonName === '천이') bgColor = '#FED7AA';
            else if (yunyeonName === '관록') bgColor = '#FEE2E2';
            else if (yunyeonName === '재백') bgColor = '#FFEDD5';
          }

          const mainStars = data['성요배치']['십사정성'] || [];
          const goodStars = data['성요배치']['보좌길성'] || [];
          const badStars = data['성요배치']['살성_및_형요'] || [];
          const shinsal = data['성요배치']['4대_십이신살'];
          const minorStars = [...(data['성요배치']['기타_잡성']['도화성'] || []), ...(data['성요배치']['기타_잡성']['제길성'] || []), ...(data['성요배치']['기타_잡성']['제흉성'] || []), ...(data['성요배치']['기타_잡성']['공망성계'] || [])];

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
              <div key={name} className="flex items-center whitespace-nowrap mb-0.5">
                <span className={`${colorClass} ${isMain ? 'font-bold text-[13px]' : 'font-semibold text-[11px]'}`}>
                  {name}<span className="text-[10px] text-gray-500 font-normal ml-0.5">{str}</span>
                </span>
                {baseBadge && <span className="text-[10px] bg-blue-600 text-white font-bold px-1 ml-1 rounded leading-none">{baseBadge}</span>}
                {dhBadge && <span className="text-[10px] bg-green-600 text-white font-bold px-1 ml-0.5 rounded leading-none">{dhBadge}</span>}
                {ynBadge && <span className="text-[10px] bg-orange-500 text-white font-bold px-1 ml-0.5 rounded leading-none">{ynBadge}</span>}
              </div>
            );
          };

          return (
            <div key={jiji} onClick={() => handlePalaceClick(jiji)} style={{ gridArea: GRID_AREAS[jiji], backgroundColor: bgColor, cursor: (viewMode === 'base' || viewMode === 'daehan') ? 'pointer' : 'default' }} className="relative flex flex-col justify-between p-1 hover:bg-gray-100 transition-colors">
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
              <div className="flex justify-between items-end w-full mt-2 border-t border-gray-200 pt-1">
                <div className="flex flex-col font-bold text-[12px] tracking-tighter gap-0.5">
                  {viewMode === 'base' ? (
                    <div className={baseName === '명궁' ? 'text-red-600 bg-yellow-100 px-0.5 text-[13px]' : 'text-blue-900 text-[13px]'}>
                      {baseName} {isShinGung && <span className="text-orange-600 ml-0.5">| 신궁</span>}
                    </div>
                  ) : viewMode === 'daehan' ? (
                    <>
                      <div className="text-green-700 font-extrabold text-[13px]">{daehanName} (대)</div>
                      <div className="text-gray-500 font-normal">선천 {baseName} {isShinGung && '| 신'}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-orange-700 font-extrabold text-[13px]">{yunyeonName} (년)</div>
                      <div className="text-gray-500 font-normal">선천 {baseName} {isShinGung && '| 신'}</div>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-end leading-none text-right gap-1">
                  <span className="text-[11px] text-red-600 font-bold">{data['궁위간지']}</span>
                  {(viewMode === 'daehan' || viewMode === 'yunyeon') && ageRange && (
                    <span className="text-[11px] font-bold text-gray-800 bg-gray-100 px-1 rounded">{ageRange[0]}~{ageRange[1]}세</span>
                  )}
                  <span className="text-[10px] text-gray-600">{shinsal['장생십이신']?.[0]}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex flex-col p-3 bg-gray-50 z-20" style={{ gridArea: '2 / 2 / 4 / 4' }}>
          <div className="flex gap-2 mb-3 justify-center border-b pb-2">
            <button onClick={() => { setViewMode('base'); setSelectedDaehanJiJi(baseMyungGungJiJi); }} className={`px-4 py-1.5 text-[13px] font-bold rounded border ${viewMode === 'base' ? 'bg-blue-600 text-white border-blue-700 shadow-inner' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>선천명반</button>
            <button onClick={() => { setViewMode('daehan'); setSelectedDaehanJiJi(baseMyungGungJiJi); }} className={`px-4 py-1.5 text-[13px] font-bold rounded border ${viewMode === 'daehan' ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>대한 선택</button>
            <button onClick={handleYunyeonModeClick} className={`px-4 py-1.5 text-[13px] font-bold rounded border ${viewMode === 'yunyeon' ? 'bg-orange-500 text-white border-orange-600 shadow-inner' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>유년 선택</button>
          </div>
          <div className="flex justify-between items-start text-[12px] text-gray-700 px-2">
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
          <div className="flex justify-center gap-6 mt-4">
            {[saju['시'], saju['일'], saju['월'], saju['년']].map((pillar, idx) => {
              if (!pillar) return null;
              const hanja = pillar.match(/\((.*?)\)/)?.[1] || pillar;
              const title = ['시주', '일주', '월주', '년주'][idx];
              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[11px] text-gray-500 mb-1">{title}</span>
                  <span className="text-lg font-bold text-gray-900 leading-tight">{hanja[0]}</span>
                  <span className="text-lg font-bold text-gray-900 leading-tight">{hanja[1]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-auto text-center font-bold text-[12px] text-blue-600 bg-blue-50 p-2 rounded">
            {viewMode === 'base' ? '👆 12궁을 클릭하여 선천 및 대한 명반을 분석하세요.' : viewMode === 'daehan' ? `📍 현재 선택된 대한: ${gungData[selectedDaehanJiJi || '子']['대한_연령대']?.[0]}~${gungData[selectedDaehanJiJi || '子']['대한_연령대']?.[1]}세` : `📍 현재 선택된 유년: ${selectedYunyeon?.['해당년도']}년`}
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
        onYunyeonSelect={(yn) => { setSelectedYunyeon(yn); setViewMode('yunyeon'); setSelectedDaehanJiJi(Object.keys(luckInfo['대한_목록'].find((d: any) => d['연령대'][0] === yn['소속대한_연령대']?.[0])?.['십이궁_배치'] || {}).find(k => luckInfo['대한_목록'].find((d: any) => d['연령대'][0] === yn['소속대한_연령대']?.[0])?.['십이궁_배치'][k] === '명궁') || '子'); }} 
        gungData={gungData}
        PALACE_NAMES={PALACE_NAMES}
        JIJI_LIST={JIJI_LIST}
      />
    </div>
  );
}