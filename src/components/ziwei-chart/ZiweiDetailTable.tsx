'use client';

import React, { useState } from 'react';
import type { JSX } from 'react';
import { STAR_DICTIONARY } from '@/constants/ziweiStars';

const backgroundImageUrl = '/ziwei-chart/images/bg-night-sky.jpg';

/* =========================================================
 * 짝성 정의
 * ======================================================= */
const PAIRED_STARS = [
  ['자미', '천부'], ['자미', '천상'], ['천부', '천상'],
  ['태양', '태음'], ['문창', '문곡'], ['좌보', '우필'],
  ['경양', '타라'], ['화성', '영성'], ['천괴', '천월'],
  ['지공', '지겁'], ['삼태', '팔좌'], ['천곡', '천허'],
  ['용지', '봉각'], ['홍란', '천희'], ['고신', '과수'],
  ['은광', '천귀'], ['록존', '화록'], ['화록', '화권'],
  ['화록', '화과'], ['화권', '화과'], ['화록', '천마'],
  ['록존', '천마'],
];

/* =========================================================
 * 일반 사용자용 궁 라벨 & 기본 의미
 * ======================================================= */
const PALACE_USER_LABELS: Record<string, string> = {
  명궁: '나의 성향',
  형제궁: '형제·친구 관계',
  부부궁: '연애·배우자',
  자녀궁: '자녀·후배 관계',
  재백궁: '돈과 재물',
  질액궁: '컨디션·생활 리듬',
  천이궁: '이동·바깥 활동',
  노복궁: '사람·인맥',
  관록궁: '직업·커리어',
  전택궁: '집·생활 기반',
  복덕궁: '마음·휴식',
  부모궁: '부모·윗사람',
};

const PALACE_TITLES: Record<string, string> = {
  명궁: '내가 세상을 살아가는 기본 스타일',
  형제궁: '형제 및 가까운 동료와의 관계',
  부부궁: '연애 성향과 배우자와의 인연',
  자녀궁: '자녀 및 아래 사람과의 관계',
  재백궁: '재물을 다루고 벌어들이는 방식',
  질액궁: '건강 컨디션과 스트레스 관리',
  천이궁: '외부 활동과 새로운 환경에서의 모습',
  노복궁: '주변 지인 및 대인관계의 흐름',
  관록궁: '직업적 성취와 커리어 스타일',
  전택궁: '나만의 공간과 안정적인 생활 기반',
  복덕궁: '내면의 정서와 정신적인 여유',
  부모궁: '부모님 및 윗사람과의 인연',
};

const PALACE_MEANINGS: Record<string, string> = {
  명궁: '타고난 성향과 행동 방식, 내가 세상을 살아가는 기본 스타일',
  형제궁: '형제자매와 가까운 사람들, 친구 관계에서 나타나는 흐름',
  부부궁: '연애와 배우자, 가까운 관계에서 나타나는 모습',
  자녀궁: '자녀·후배와의 관계, 내가 무언가를 키워가는 방식',
  재백궁: '돈을 벌고 쓰고 관리하는 방식과 재물 흐름',
  질액궁: '생활 리듬과 몸과 마음의 컨디션을 살피는 영역',
  천이궁: '이동, 여행, 외부 활동, 낯선 환경에서의 모습',
  노복궁: '친구·동료·지인 등 주변 사람들과의 관계',
  관록궁: '직업, 커리어, 사회적 역할과 성취',
  전택궁: '집, 생활 기반, 안정감과 나만의 공간',
  복덕궁: '내면의 만족감, 휴식, 취향과 정신적인 여유',
  부모궁: '부모와 윗사람, 보호자 및 권위 있는 사람과의 관계',
};

/* =========================================================
 * 사화 사용자용 정보
 * ======================================================= */
const SIHUA_INFO: Record<string, { label: string; short: string; color: string }> = {
  화록: {
    label: '기회·풍요',
    short: '기회가 생기고 결과를 얻기 쉬운 흐름',
    color: 'emerald',
  },
  화권: {
    label: '주도권·영향력',
    short: '내가 주도하거나 영향력을 발휘하게 되는 흐름',
    color: 'blue',
  },
  화과: {
    label: '인정·평판',
    short: '실력이나 행동이 드러나고 좋은 평가로 연결되기 쉬운 흐름',
    color: 'purple',
  },
  화기: {
    label: '주의·집중',
    short: '신경을 많이 쓰거나 반복적으로 고민하게 될 수 있는 흐름',
    color: 'rose',
  },
};

/* =========================================================
 * Interface
 * ======================================================= */
interface DetailProps {
  viewMode: 'base' | 'daehan' | 'yunyeon';
  activeDaehanData: any;
  baseSihwaStars: string[];
  daehanSihwaStars: string[];
  yunyeonSihwaStars: string[];
  daehanGan: string;
  basePalaces: Record<string, string>;
  daehanPalaces: Record<string, string>;
  yunyeonPalaces: Record<string, string>;
  luckInfo: any;
  selectedYunyeon: any;
  onYunyeonSelect: (yn: any) => void;
  gungData: any;
  PALACE_NAMES: string[];
  JIJI_LIST: string[];
  
  // 하단 공유/액션 버튼 관련
  resultId?: string;
  sajuGptUrl?: string;
  shareUrl?: string;
  origin?: string;
  cardRef?: any;
  saving?: boolean;
  onRestart?: () => void;
  handleSave?: (ref: any) => void;
  trackSajuGPTClick?: (type: string, id?: string) => void;
  OutlineBoxButton?: any;
  PressableButton?: any;
  ShareRow?: any;
  ResultFooterSections?: any;
  content?: { title?: string; tip?: string };
}

export default function ZiweiDetailTable({
  viewMode,
  activeDaehanData,
  baseSihwaStars,
  daehanSihwaStars,
  yunyeonSihwaStars,
  daehanGan,
  basePalaces,
  daehanPalaces,
  yunyeonPalaces,
  luckInfo,
  selectedYunyeon,
  onYunyeonSelect,
  gungData,
  PALACE_NAMES,
  JIJI_LIST,
  
  // 하단 액션 props
  resultId = 'ziwei_result',
  sajuGptUrl = 'https://sajugpt.app',
  shareUrl = typeof window !== 'undefined' ? window.location.href : '',
  origin = typeof window !== 'undefined' ? window.location.origin : '',
  cardRef,
  saving = false,
  onRestart = () => window.location.reload(),
  handleSave = () => {},
  trackSajuGPTClick = () => {},
  OutlineBoxButton,
  PressableButton,
  ShareRow,
  ResultFooterSections,
  content = { title: '자미두수 12궁 분석', tip: '나의 자미두수 명반과 12궁 운세를 확인해보세요.' },
}: DetailProps) {
  const [showAllDetails, setShowAllDetails] = useState(false);

  const currentPalaces =
    viewMode === 'base'
      ? basePalaces
      : viewMode === 'daehan'
        ? daehanPalaces
        : yunyeonPalaces;

  const currentSihwaStars =
    viewMode === 'base'
      ? baseSihwaStars
      : viewMode === 'daehan'
        ? daehanSihwaStars
        : yunyeonSihwaStars;

  const modeTitle = viewMode === 'base' ? '선천' : viewMode === 'daehan' ? '대한' : '유년';
  const modeColor =
    viewMode === 'base'
      ? 'text-blue-400'
      : viewMode === 'daehan'
        ? 'text-emerald-400'
        : 'text-amber-400';

  const modeDescription =
    viewMode === 'base'
      ? '태어날 때부터 가지고 있는 기본 성향과 삶의 방향'
      : viewMode === 'daehan'
        ? '현재 속한 10년 동안 특히 활성화되는 영역과 흐름'
        : '선택한 연도에 집중적으로 움직이는 영역과 흐름';

  /* ---------------------------------------------------------
   * Helper Functions
   * ------------------------------------------------------- */
  const getStarsForJiji = (pos: string) => {
    if (!gungData?.[pos]) return [];
    const g = gungData[pos];

    const stars = [
      ...(g['성요배치']?.['십사정성'] || []),
      ...(g['성요배치']?.['보좌길성'] || []),
      ...(g['성요배치']?.['살성_및_형요'] || []),
      ...(g['성요배치']?.['기타_잡성']?.['도화성'] || []),
      ...(g['성요배치']?.['기타_잡성']?.['공망성계'] || []),
      ...(g['성요배치']?.['기타_잡성']?.['제길성'] || []),
      ...(g['성요배치']?.['기타_잡성']?.['제흉성'] || []),
      ...(g['성요배치']?.['기타_잡성']?.['백관조공성'] || []),
    ].map((s: any) => (typeof s === 'string' ? s : s?.명칭));

    return stars.filter(Boolean);
  };

  const getSihwaAtJiji = (jiji: string) => {
    const stars = getStarsForJiji(jiji);
    if (!currentSihwaStars?.length) return [];
    const result: string[] = [];
    const labels = ['화록', '화권', '화과', '화기'];

    currentSihwaStars.forEach((star, index) => {
      if (star && stars.includes(star)) {
        result.push(labels[index]);
      }
    });

    return result;
  };

  const getSihwaTargetPalace = (sihwaIndex: number) => {
    const star = currentSihwaStars?.[sihwaIndex];
    if (!star) return null;

    const jiji = JIJI_LIST.find((pos) => getStarsForJiji(pos).includes(star));
    if (!jiji) return null;

    return { jiji, palace: currentPalaces[jiji], star };
  };

  const rankPairs = (jiji: string) => {
    const idx = JIJI_LIST.indexOf(jiji);
    if (idx < 0) return [];

    const opp = JIJI_LIST[(idx + 6) % 12];
    const tri1 = JIJI_LIST[(idx + 4) % 12];
    const tri2 = JIJI_LIST[(idx + 8) % 12];
    const left = JIJI_LIST[(idx + 1) % 12];
    const right = JIJI_LIST[(idx + 11) % 12];

    const sBase = getStarsForJiji(jiji);
    const sOpp = getStarsForJiji(opp);
    const sTri1 = getStarsForJiji(tri1);
    const sTri2 = getStarsForJiji(tri2);
    const sLeft = getStarsForJiji(left);
    const sRight = getStarsForJiji(right);

    const has = (arr: string[], target: string) => arr.includes(target);
    const results: { pair: string; rank: number; desc: string }[] = [];

    PAIRED_STARS.forEach(([A, B]) => {
      const aBase = has(sBase, A);
      const bBase = has(sBase, B);
      const aOpp = has(sOpp, A);
      const bOpp = has(sOpp, B);
      const aTri = has(sTri1, A) || has(sTri2, A);
      const bTri = has(sTri1, B) || has(sTri2, B);

      let rank = 0;
      let desc = '';

      if (aBase && bBase) {
        rank = 1;
        desc = `동궁 (한 궁에 동시 존재)`;
      } else if (aOpp && bOpp) {
        rank = 2;
        desc = `대조 (대궁 ${opp}궁에서 동시 대조)`;
      } else if ((aBase && bOpp) || (bBase && aOpp)) {
        rank = 3;
        desc = `마주함 (본궁과 대궁 ${opp}궁에서 마주함)`;
      } else if (
        (has(sTri1, A) && has(sTri2, B)) ||
        (has(sTri1, B) && has(sTri2, A)) ||
        (aTri && bTri && A !== B)
      ) {
        rank = 4;
        desc = `삼방 회조 (삼합궁에서 회조)`;
      } else if (
        (has(sLeft, A) && has(sRight, B)) ||
        (has(sLeft, B) && has(sRight, A))
      ) {
        rank = 5;
        desc = `협궁 (좌우 ${left}, ${right}궁에서 강력히 협함)`;
      } else if ((aBase && bTri) || (bBase && aTri)) {
        rank = 6;
        desc = `하나 본궁, 하나 삼방 회조`;
      } else if ((aOpp && bTri) || (bOpp && aTri)) {
        rank = 7;
        desc = `하나 대궁, 하나 삼방 회조`;
      }

      if (rank > 0) {
        results.push({ pair: `${A}•${B}`, rank, desc });
      }
    });

    return results.sort((a, b) => a.rank - b.rank);
  };

  /* ---------------------------------------------------------
   * 모드별 해석 가공 함수
   * ------------------------------------------------------- */
  const getModeInterpretation = (palaceName: string, jiji: string) => {
    const baseName = basePalaces[jiji];
    const userLabel = PALACE_USER_LABELS[palaceName] || PALACE_USER_LABELS[baseName] || palaceName;
    const baseTitle = PALACE_TITLES[palaceName] || PALACE_TITLES[baseName] || `${userLabel}의 주요 흐름`;
    
    const meaning =
      PALACE_MEANINGS[baseName] ||
      PALACE_MEANINGS[palaceName] ||
      '이 영역에서 나타나는 삶의 흐름';

    const stars = getStarsForJiji(jiji);
    const majorStars = stars
      .filter((star) => STAR_DICTIONARY[star]?.분류 === '14정성')
      .slice(0, 3);
    const sihwa = getSihwaAtJiji(jiji);

    if (viewMode === 'base') {
      const majorDescriptions = majorStars
        .map((star) => STAR_DICTIONARY[star]?.쉬운설명)
        .filter(Boolean);

      return {
        eyebrow: '태어날 때부터 가지고 있는 기본 성향',
        title: baseTitle,
        description:
          majorDescriptions.length > 0 ? majorDescriptions.join(' · ') : meaning,
        highlight:
          sihwa.length > 0
            ? `선천적으로 ${sihwa.join(', ')}의 성향이 함께 강조됩니다.`
            : '이 영역의 기본적인 성향과 특징을 중심으로 볼 수 있습니다.',
        tags: majorStars,
      };
    }

    if (viewMode === 'daehan') {
      const sihwaText = sihwa.map((type) => `${type} ${SIHUA_INFO[type].label}`).join(' · ');

      return {
        eyebrow: '현재 속한 10년 동안 활성화되는 영역',
        title: `이번 대한의 ${userLabel}`,
        description:
          sihwa.length > 0
            ? sihwaText
            : `${meaning}와 관련된 일이 10년의 흐름 속에서 부각될 수 있습니다.`,
        highlight:
          sihwa.length > 0
            ? sihwa.map((type) => SIHUA_INFO[type].short).join(' ')
            : '선천적인 성향 자체보다, 이 10년 동안 이 영역에서 어떤 사건과 경험이 활성화되는지를 중심으로 봅니다.',
        tags: sihwa,
      };
    }

    const yearText = selectedYunyeon?.['해당년도']
      ? `${selectedYunyeon['해당년도']}년`
      : '선택한 연도';

    const sihwaText = sihwa.map((type) => `${type} ${SIHUA_INFO[type].label}`).join(' · ');

    return {
      eyebrow: `${yearText}에 집중되는 단기 흐름`,
      title: `${yearText} ${userLabel}의 변화`,
      description:
        sihwa.length > 0
          ? sihwaText
          : `${meaning}와 관련된 일이 해당 연도의 흐름에서 주목될 수 있습니다.`,
      highlight:
        sihwa.length > 0
          ? sihwa.map((type) => SIHUA_INFO[type].short).join(' ')
          : '10년의 큰 흐름보다 해당 연도에 실제로 어떤 영역이 움직이는지를 중심으로 봅니다.',
      tags: sihwa,
    };
  };

  /* ---------------------------------------------------------
   * Sub-components & Render Helpers
   * ------------------------------------------------------- */
  const renderCategorizedStars = (data: any) => {
    if (!data) return null;
    const categorizedList: any[] = [];

    const addStars = (stars: any[], defaultCategory: string) => {
      if (!stars) return;
      stars.forEach((starObj) => {
        const sName = typeof starObj === 'string' ? starObj : starObj?.명칭;
        const sStr = typeof starObj === 'string' ? '' : starObj?.묘왕지;
        if (!sName) return;

        const dictInfo = STAR_DICTIONARY[sName] || {
          분류: defaultCategory,
          오행: '-',
          특성: '특성 데이터 없음',
          쉬운설명: '추가 해석 데이터가 없습니다.',
        };

        categorizedList.push({ sName, sStr, ...dictInfo });
      });
    };

    addStars(data['성요배치']?.['십사정성'], '14정성');
    addStars(data['성요배치']?.['보좌길성'], '보좌/육길성');
    addStars(data['성요배치']?.['살성_및_형요'], '육살/형요성');

    const minor = data['성요배치']?.['기타_잡성'];
    if (minor) {
      addStars(minor['도화성'], '도화성');
      addStars(minor['공망성계'], '공망성');
      addStars(minor['제길성'], '잡성(길)');
      addStars(minor['제흉성'], '잡성(흉)');
    }

    if (categorizedList.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="border border-slate-700/50 p-3 text-center text-slate-400 text-xs">
            배치된 주요 성요가 없는 공궁입니다.
          </td>
        </tr>
      );
    }

    return categorizedList.map((star: any, idx: number) => {
      const tags = star.특성 ? star.특성.split(',').map((t: string) => t.trim()) : [];

      return (
        <tr key={idx} className="hover:bg-slate-800/50 transition-colors border-b border-slate-700/50">
          <td className="border-r border-slate-700/50 p-2 text-center text-slate-400 font-medium text-[11px] whitespace-nowrap">
            {star.분류}
          </td>
          <td className="border-r border-slate-700/50 p-2 text-center font-bold text-slate-200 text-xs whitespace-nowrap">
            {star.sName}
            {star.sStr && (
              <span className="ml-1 text-[10px] text-rose-400 font-normal">({star.sStr})</span>
            )}
          </td>
          <td className="border-r border-slate-700/50 p-2 text-center text-xs text-slate-400 font-semibold whitespace-nowrap">
            {star.오행}
          </td>
          <td className="p-2">
            <div className="flex flex-wrap gap-1 items-center">
              {tags.map((tag: string, tIdx: number) => (
                <span
                  key={tIdx}
                  className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-md font-medium border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </td>
        </tr>
      );
    });
  };

  /* 사화 카드 렌더링 */
  const renderSihwaCard = (type: string, target: any, labelPrefix: string) => {
    if (!target) return null;
    const info = SIHUA_INFO[type];

    const styleMap: Record<string, { bg: string; border: string; badge: string; text: string }> = {
      화록: {
        bg: 'bg-emerald-950/50 hover:bg-emerald-950/70',
        border: 'border-emerald-500/40',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        text: 'text-emerald-400',
      },
      화권: {
        bg: 'bg-blue-950/50 hover:bg-blue-950/70',
        border: 'border-blue-500/20 text-blue-300 border-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        text: 'text-blue-400',
      },
      화과: {
        bg: 'bg-purple-950/50 hover:bg-purple-950/70',
        border: 'border-purple-500/20 text-purple-300 border-purple-500/30',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        text: 'text-purple-400',
      },
      화기: {
        bg: 'bg-rose-950/50 hover:bg-rose-950/70',
        border: 'border-rose-500/40',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        text: 'text-rose-400',
      },
    };

    const style = styleMap[type] || styleMap['화록'];

    return (
      <div className={`p-3.5 rounded-xl border backdrop-blur-xs transition-colors ${style.bg} ${style.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}>
            {labelPrefix} {type}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">{info.label}</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-base font-extrabold ${style.text}`}>{target.star}</span>
          <span className="text-xs font-bold text-slate-200">→ {target.palace}</span>
        </div>

        <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed opacity-90">
          {info.short}
        </p>
      </div>
    );
  };

  const currentSihwaTargets = [
    getSihwaTargetPalace(0),
    getSihwaTargetPalace(1),
    getSihwaTargetPalace(2),
    getSihwaTargetPalace(3),
  ];

  /* =========================================================
   * Main JSX
   * ======================================================= */
  return (
    <div
      className="relative min-h-screen w-full p-4 sm:p-6 text-slate-100"
      style={{
        fontFamily: "'ChosunIlboMyungjo', serif",
        backgroundImage: `url("${encodeURI(backgroundImageUrl)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* webfont 가시성 및 렌더링 설정 */}
      <style jsx global>{`
        @font-face {
          font-family: 'ChosunIlboMyungjo';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      {/* 신비롭고 화사한 그래디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-purple-950/20 to-indigo-950/40 backdrop-blur-xs pointer-events-none" />

      {/* 메인 콘텐츠 컨테이너 */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* 1. 모드 헤더 */}
        <div className="bg-slate-900/50 border border-white/15 p-4 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                <span className={modeColor}>[{modeTitle}]</span> 12궁 정밀 분석
              </h2>
              <p className="text-xs text-indigo-200/80 mt-1">{modeDescription}</p>
            </div>

            <button
              onClick={() => setShowAllDetails(!showAllDetails)}
              className="shrink-0 text-xs px-3.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-100 border border-indigo-400/30 font-semibold rounded-xl transition-all cursor-pointer backdrop-blur-md shadow-sm hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]"
            >
              {showAllDetails ? '전체 접기 ▴' : '전문가 표 전체 펼치기 ▾'}
            </button>
          </div>
        </div>

        {/* 2. 대한 핵심 정보 */}
        {viewMode === 'daehan' && activeDaehanData && (
          <div className="bg-slate-900/50 border border-emerald-500/25 p-4.5 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_0_rgba(16,185,129,0.15)]">
            <div className="mb-3.5">
              <span className="block text-sm font-extrabold text-white drop-shadow-sm">
                🎯 이번 10년의 핵심 흐름
              </span>
              <span className="block text-xs text-emerald-300 font-medium mt-1">
                대한 천간 {daehanGan} · {activeDaehanData['연령대']?.[0]} ~{' '}
                {activeDaehanData['연령대']?.[1]}세
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {renderSihwaCard('화록', currentSihwaTargets[0], '대')}
              {renderSihwaCard('화권', currentSihwaTargets[1], '대')}
              {renderSihwaCard('화과', currentSihwaTargets[2], '대')}
              {renderSihwaCard('화기', currentSihwaTargets[3], '대')}
            </div>

            {luckInfo?.['유년_목록'] && activeDaehanData?.['연령대'] && (
              <div className="mt-4 border-t border-white/10 pt-3">
                <span className="block text-xs font-bold text-slate-200 mb-2">
                  🗓️ 이 대한 안의 연도 선택
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {luckInfo['유년_목록']
                    .filter(
                      (yn: any) =>
                        activeDaehanData['연령대'][0] <= yn['나이'] &&
                        yn['나이'] <= activeDaehanData['연령대'][1]
                    )
                    .map((yn: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => onYunyeonSelect(yn)}
                        className="px-2.5 py-1 bg-slate-800/60 border border-indigo-400/20 text-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 rounded-lg transition-all text-xs font-medium cursor-pointer backdrop-blur-sm"
                      >
                        {yn['해당년도']}년
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. 유년 핵심 정보 */}
        {viewMode === 'yunyeon' && selectedYunyeon && (
          <div className="bg-slate-900/50 border border-amber-500/25 p-4.5 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_0_rgba(245,158,11,0.15)]">
            <div className="mb-3.5">
              <span className="block text-sm font-extrabold text-white drop-shadow-sm">
                ✨ {selectedYunyeon['해당년도']}년 핵심 흐름
              </span>
              <span className="block text-xs text-amber-300 font-medium mt-1">
                유년 천간 {selectedYunyeon['천간']}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {renderSihwaCard('화록', currentSihwaTargets[0], '년')}
              {renderSihwaCard('화권', currentSihwaTargets[1], '년')}
              {renderSihwaCard('화과', currentSihwaTargets[2], '년')}
              {renderSihwaCard('화기', currentSihwaTargets[3], '년')}
            </div>
          </div>
        )}

        {/* 4. 관점 안내 */}
        <div
          className={`rounded-2xl border border-l-4 p-4 bg-slate-900/50 backdrop-blur-xl shadow-md transition-all ${
            viewMode === 'base'
              ? 'border-white/15 border-l-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.15)]'
              : viewMode === 'daehan'
                ? 'border-white/15 border-l-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                : 'border-white/15 border-l-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                viewMode === 'base'
                  ? 'bg-blue-500/20 text-blue-200 border border-blue-400/40'
                  : viewMode === 'daehan'
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                    : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
              }`}
            >
              {viewMode === 'base' ? '🌱 선천' : viewMode === 'daehan' ? '🧭 대한' : '📅 유년'}
            </span>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {viewMode === 'base'
                ? '"나는 원래 어떤 사람인가?"'
                : viewMode === 'daehan'
                  ? '"이 10년에는 무엇이 중요해지는가?"'
                  : '"이 해에는 어디가 움직이는가?"'}
            </h4>
          </div>

          <p className="text-xs leading-relaxed text-slate-200 font-normal pl-0.5">
            {viewMode === 'base'
              ? '태어날 때부터 가지고 있는 성향을 중심으로 봅니다. 별의 배치와 선천적인 사화가 각 영역에 어떤 기본적인 특징을 만드는지 확인합니다.'
              : viewMode === 'daehan'
                ? '선천적인 성향을 다시 설명하는 것이 아니라, 현재 10년 동안 어떤 궁이 활성화되고 어떤 사화가 그 영역에 영향을 주는지를 중심으로 봅니다.'
                : '선천이나 대한의 큰 구조를 반복하기보다, 선택한 연도의 사화가 어느 영역에 들어오며 무엇에 집중하게 되는지를 중심으로 봅니다.'}
          </p>
        </div>

        {/* 5. 12궁 리스트 */}
        <div className="space-y-3">
          {PALACE_NAMES.map((palaceName) => {
            const jiji =
              Object.keys(currentPalaces).find((k) => currentPalaces[k] === palaceName) || '子';
            const data = gungData?.[jiji];
            if (!data) return null;

            const baseName = basePalaces[jiji];
            const userLabel = PALACE_USER_LABELS[palaceName] || palaceName;
            const interpretation = getModeInterpretation(palaceName, jiji);
            const biseong = data['궁간비성'];
            const pairResults = rankPairs(jiji);
            const sihwaAtJiji = getSihwaAtJiji(jiji);
            const stars = getStarsForJiji(jiji);
            const majorStars = stars
              .filter((star) => STAR_DICTIONARY[star]?.분류 === '14정성')
              .slice(0, 3);

            return (
              <details
                key={jiji}
                open={showAllDetails}
                className="group border border-white/10 rounded-2xl bg-slate-900/45 backdrop-blur-xl overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-purple-400/30 hover:shadow-[0_4px_25px_rgba(168,85,247,0.15)]"
              >
                {/* 궁 Header */}
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-900/30 hover:bg-indigo-950/30 transition-colors select-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-purple-300 group-open:rotate-90 transition-transform duration-200 text-[10px]">
                      ▶
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${modeColor} font-extrabold text-xs sm:text-sm drop-shadow-sm`}>
                          [{modeTitle}]
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-white">{userLabel}</span>

                        {sihwaAtJiji.length > 0 && (
                          <div className="flex gap-1">
                            {sihwaAtJiji.map((type) => (
                              <span
                                key={type}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-md ${
                                  type === '화록'
                                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                    : type === '화권'
                                      ? 'bg-blue-500/25 text-blue-200 border border-blue-400/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                      : type === '화과'
                                        ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                                        : 'bg-rose-500/25 text-rose-200 border border-rose-400/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                                }`}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-indigo-200/60 mt-0.5">
                        {palaceName} · {jiji}궁
                        {viewMode !== 'base' && <> · 선천 {baseName}</>}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-purple-200/70 font-medium group-open:hidden shrink-0 bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-400/20">
                    상세보기
                  </span>
                </summary>

                {/* 궁 Body */}
                <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/20 space-y-3">
                  {/* 통합 분석 카드 */}
                  <div className="rounded-xl border border-indigo-400/20 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-sm">
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-tight text-purple-200 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                          {interpretation.eyebrow}
                        </span>

                        {interpretation.tags && interpretation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {interpretation.tags.map((tag: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 bg-indigo-950/50 text-indigo-200 font-bold text-[10px] rounded-md border border-indigo-400/20"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-white pt-0.5 drop-shadow-sm">
                        "{interpretation.title}"
                      </h3>

                      <div className="text-xs font-semibold text-indigo-100">
                        {interpretation.description}
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-300">
                        {interpretation.highlight}
                      </p>
                    </div>

                    <div className="border-t border-white/5" />

                    {/* LEVEL 2 분석 근거 */}
                    <div className="p-3.5 bg-indigo-950/30 space-y-2">
                      <div className="text-[11px] font-bold text-indigo-200 flex items-center gap-1.5">
                        <span className="text-xs">🔍</span>
                        <span>왜 이런 해석이 나왔나요? (분석 근거)</span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        이 영역에는 주요 정성인{' '}
                        <strong className="text-purple-200 font-bold bg-purple-900/50 px-1.5 py-0.5 rounded border border-purple-400/30">
                          {majorStars.length > 0 ? majorStars.join(', ') : '기본 성요'}
                        </strong>
                        가 배치되어 있으며, 주변 궁 간섭에서 약{' '}
                        <span className="font-semibold text-purple-300">{pairResults.length}개</span>
                        의 주요 짝성 조합이 영향을 주고 있습니다.
                      </p>

                      {majorStars.length > 0 && (
                        <div className="pt-1.5 space-y-1.5">
                          {majorStars.map((star) => (
                            <div
                              key={star}
                              className="text-[11px] text-slate-200 flex gap-1.5 items-start bg-slate-900/50 p-2 rounded-lg border border-white/10"
                            >
                              <span className="px-1.5 py-0.5 bg-purple-950/80 border border-purple-400/30 rounded text-[10px] font-bold text-purple-200 shrink-0">
                                {star}
                              </span>
                              <span className="leading-relaxed text-slate-300">
                                {STAR_DICTIONARY[star]?.쉬운설명 || '핵심 특성이 반영되어 있습니다.'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LEVEL 3 전문가용 정밀 분석 표 */}
                  <details className="border border-white/10 rounded-xl bg-slate-900/40 group/expert overflow-hidden font-['ChosunIlboMyungjo',serif]">
                    <summary className="cursor-pointer px-3.5 py-2.5 text-[11px] font-bold text-purple-200 hover:bg-purple-950/30 flex items-center justify-between select-none transition-colors">
                      <span>📊 [전문가용] {palaceName} 정밀 분석 표 보기</span>
                      <span className="text-[10px] text-purple-300 group-open/expert:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>

                    <div className="p-3 space-y-3 border-t border-white/10 bg-slate-950/40">
                      {/* 짝성 크로스체크 */}
                      <div className="p-2.5 bg-indigo-950/20 border border-indigo-400/20 rounded-lg text-[11px]">
                        <span className="font-bold text-indigo-200 block mb-1.5">
                          🔍 짝성 크로스체크 (주변 궁 간섭)
                        </span>
                        {pairResults.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {pairResults.map((r, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-slate-200">
                                <span className="px-1.5 py-0.5 bg-purple-950/60 text-purple-200 font-bold rounded text-[10px] border border-purple-400/30 whitespace-nowrap">
                                  {r.pair}
                                </span>
                                <span className="truncate">{r.desc}</span>
                                <span className="px-1 py-0.2 bg-slate-800/60 text-slate-300 text-[9px] rounded font-semibold whitespace-nowrap ml-auto border border-white/5">
                                  {r.rank}순위
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            주변 궁의 주요 짝성 간섭이 없습니다.
                          </span>
                        )}
                      </div>

                      {/* 성요 배치 테이블 */}
                      <div className="overflow-x-auto border border-white/10 rounded-lg bg-slate-900/60">
                        <table className="w-full text-left text-xs border-collapse min-w-[480px]">
                          <thead className="bg-slate-950/60 text-indigo-200 font-bold border-b border-white/10">
                            <tr>
                              <th className="p-2 text-center w-[15%]">분류</th>
                              <th className="p-2 text-center w-[20%]">성요(묘왕지)</th>
                              <th className="p-2 text-center w-[12%]">오행</th>
                              <th className="p-2 text-left w-[53%]">핵심 특성 태그</th>
                            </tr>
                          </thead>
                          <tbody>{renderCategorizedStars(data)}</tbody>
                        </table>
                      </div>

                      {/* 궁간비성 */}
                      {biseong && (
                        <div className="p-2.5 bg-indigo-950/20 border border-indigo-400/20 rounded-lg text-[11px]">
                          <span className="font-bold text-indigo-200 block mb-1.5">
                            🎯 궁간비성
                            {biseong['천간'] ? ` (천간: ${biseong['천간']})` : ''}
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {[
                              ['화록', 'emerald'],
                              ['화권', 'blue'],
                              ['화과', 'purple'],
                              ['화기', 'rose'],
                            ].map(([type, color]) => {
                              const item = biseong[type];
                              if (!item) return null;

                              return (
                                <div
                                  key={type}
                                  className={`p-1.5 rounded border flex items-center justify-between ${
                                    color === 'emerald'
                                      ? 'bg-emerald-950/30 border-emerald-400/30 text-emerald-200'
                                      : color === 'blue'
                                        ? 'bg-blue-950/30 border-blue-400/30 text-blue-200'
                                        : color === 'purple'
                                          ? 'bg-purple-950/30 border-purple-400/30 text-purple-200'
                                          : 'bg-rose-950/30 border-rose-400/30 text-rose-200'
                                  }`}
                                >
                                  <span className="font-bold">
                                    {type}: {item['성요']}
                                  </span>
                                  <span className="text-[10px] opacity-80">
                                    → {item['화입궁']}궁
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </details>
            );
          })}
        </div>

      {/* =========================================================
         * 6. 하단 사주GPT / 공유 / 댓글 버튼 영역
         * ======================================================= */}
        <div className="pt-6 space-y-4">
          {/* 사주GPT & 다시하기 버튼 영역 (양옆 배치) */}
          <div className="flex gap-2 items-center">
            {/* 사주GPT 버튼 */}
            <div className="flex-1">
              {OutlineBoxButton ? (
                <OutlineBoxButton
                  href={sajuGptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSajuGPTClick('ziwei_guide', resultId)}
                  color="#f472b6"
                  background="#ffffff"
                  border="1.5px solid #f472b6"
                  height="54px"
                  borderRadius="18px"
                  fontSize="15px"
                  fontWeight={700}
                  style={{ width: '100%' }}
                >
                  사주GPT에서 상담하기
                </OutlineBoxButton>
              ) : (
                <a
                  href={sajuGptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSajuGPTClick('ziwei_guide', resultId)}
                  className="flex items-center justify-center w-full h-[54px] bg-white text-rose-500 border-2 border-rose-400 font-bold text-[15px] rounded-[18px] shadow-md hover:bg-rose-50 transition-all text-center cursor-pointer"
                >
                  사주GPT에서 상담하기
                </a>
              )}
            </div>

            {/* 다시하기 버튼 */}
            <div className="flex-1">
              {PressableButton ? (
                <PressableButton
                  onClick={onRestart}
                  label="다시하기"
                  style={{ width: '100%', height: '54px' }}
                  bgStyle={{ backgroundColor: 'rgb(255, 229, 237)', borderRadius: '18px' }}
                  hoverBackground="rgba(252, 181, 209, 0.64)"
                  textStyle={{ color: 'rgb(248, 71, 132)', fontSize: '15px', fontWeight: 600, paddingTop: '2px' }}
                />
              ) : (
                <button
                  onClick={onRestart}
                  className="w-full h-[54px] bg-rose-100/90 text-rose-500 font-semibold text-[15px] rounded-[18px] hover:bg-rose-200 transition-all cursor-pointer"
                >
                  다시하기
                </button>
              )}
            </div>
          </div>

          {/* 공유 영역 */}
          <div className="text-center pt-2">
            {ShareRow ? (
              <ShareRow
                shareContent={{
                  featureType: 'ziwei_guide',
                  resultId: resultId,
                  title: ` ${content.title}`,
                  description: content.tip,
                  shareUrl,
                  imageUrl: origin ? `${origin}/ziwei/og-share.jpg` : '/ziwei/og-share.jpg',
                  testId: 'ziwei-guide',
                }}
                copyColor="#ec4899"
                copyHoverColor="#db2777"
                copyIconColor="#ffffff"
                onCopy={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('링크가 복사되었습니다!');
                  } catch (err) {
                    console.error('복사 실패:', err);
                  }
                }}
              />
            ) : (
              /* ShareRow가 없을 때 아이콘/버튼 클릭 시 바로 복사 */
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('링크가 클립보드에 복사되었습니다!');
                  } catch (err) {
                    // 구형 브라우저 fallback 처리
                    const textArea = document.createElement('textarea');
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('링크가 복사되었습니다!');
                  }
                }}
                className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900/60 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <span>🔗</span>
                <span>공유하기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}