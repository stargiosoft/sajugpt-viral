'use client';

import React, { forwardRef, useMemo, useState, useRef } from 'react';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Page1Info {
  title?: string;
  group: string;
  jobs: string[];
  description?: string;
}

interface Page2Info {
  title?: string;
  element: string;
  industries: string[];
}

interface JobDnaResultCardProps {
  page1?: Page1Info | null;
  page2?: Page2Info | null;
}

const SIPSEONG_UI: Record<string, { title: string; description: string; color: string; image: string }> = {
  비겁: { title: '개척ㆍ주도형', description: '남이 그려준 길보다, 스스로 판단해서<br />밀고 나가는 쪽에서 결과가 잘 납니다.', color: '#b45309', image: '/job-dna/images/bigyeob-v2.png' },
  식상: { title: '창작ㆍ생산형', description: '머릿속 아이디어를 실제로 만들어보고<br />손에 잡히는 결과물로 바꾸는 데 강합니다.', color: '#be123c', image: '/job-dna/images/siksang-v2.png' },
  재성: { title: '성과ㆍ비즈니스형', description: '주어진 자원을 어떻게든<br />성과로 연결하는 감각이 있습니다.', color: '#b45309', image: '/job-dna/images/jaeseong-v2.png' },
  관성: { title: '관리ㆍ리딩형', description: '책임을 맡아서 사람과 일정을 정리해<br />굴러가게 만드는 역할에 맞습니다.', color: '#1d4ed8', image: '/job-dna/images/gwanseong-v2.png' },
  인성: { title: '분석ㆍ전문형', description: '깊이 파고들어 이해한 뒤<br />전문성으로 승부를 보는 쪽입니다.', color: '#4338ca', image: '/job-dna/images/inseong-v2.png' },
};

const OHAENG_UI: Record<string, { title: string; description: string; icon: string; color: string }> = {
  木: { title: '성장ㆍ확장 산업', description: '사람과 조직이 커나가는 흐름 안에 있을 때 잘 맞습니다.', icon: '🌱', color: '#15803d' },
  火: { title: '미디어ㆍ대중 산업', description: '사람들 앞에 아이디어를 내보이고 반응을 이끌어내는 일이 잘 맞습니다.', icon: '🔥', color: '#be123c' },
  土: { title: '기반ㆍ운영 산업', description: '현실적인 토대를 다지고 시스템을 안정적으로 돌리는 쪽입니다.', icon: '⛰️', color: '#b45309' },
  金: { title: '기술ㆍ정밀 산업', description: '정확함과 체계가 중요한, 전문성이 곧 무기가 되는 환경입니다.', icon: '⚙️', color: '#334155' },
  水: { title: '정보ㆍ글로벌 산업', description: '정보와 사람이 빠르게 오가고 연결되는 환경에서 힘을 발휘합니다.', icon: '🌊', color: '#0369a1' },
};

const renderFormattedTitle = (titleText: string) => {
  const parts = titleText.split(/[ㆍ•]/);
  if (parts.length === 1) return titleText;

  return (
    <>
      {parts[0]}
      <span className="inline-block w-1 h-1 rounded-full bg-current mx-1 align-middle" />
      {parts[1]}
    </>
  );
};

const JobDnaResultCard = forwardRef<HTMLDivElement, JobDnaResultCardProps>(({ page1, page2 }, ref) => {
  const isNarrow = useIsNarrow();
  const [step, setStep] = useState<1 | 2>(1);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const sipseongInfo = useMemo(() => {
    if (!page1?.group) return null;
    const key = Object.keys(SIPSEONG_UI).find((name) => page1.group.includes(name));
    return key ? SIPSEONG_UI[key] : null;
  }, [page1?.group]);

  const ohaengInfo = useMemo(() => {
    if (!page2?.element) return null;
    const key = Object.keys(OHAENG_UI).find((name) => page2.element.includes(name));
    return key ? OHAENG_UI[key] : null;
  }, [page2?.element]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    touchEndX.current = clientX;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && step === 1 && page2) {
        setStep(2);
      } else if (diff < 0 && step === 2 && page1) {
        setStep(1);
      }
    } else {
      if (step === 1 && page2) setStep(2);
      else if (step === 2 && page1) setStep(1);
    }
  };

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div ref={ref} className="mx-auto w-full max-w-120 select-none p-2 flex flex-col items-center">
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff');

        @font-face {
            font-family: 'GabiaSolmi';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff') format('woff');
            font-weight: normal;
            font-display: swap;
        }

        .job-dna-card-container {
          font-family: 'GabiaSolmi', cursive, sans-serif;
        }

        .comic-title {
          color: #1e1409;
          -webkit-text-stroke: 0.6px #1e1409;
          text-shadow: 1.5px 1.5px 0 rgba(255,255,255,0.7);
        }
      `}</style>

      {/* 전체 카드 컨테이너 */}
      <div
        className="job-dna-card-container relative w-full overflow-hidden bg-no-repeat bg-center bg-cover shadow-xl cursor-grab active:cursor-grabbing touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        style={{
          backgroundImage: `url('${step === 1 ? '/job-dna/images/claw-bg.png' : '/job-dna/images/claw-bg2.png'}')`,
          aspectRatio: '4 / 5',
        }}
      >
        {/* ① 1페이지 타이틀 */}
        {step === 1 && page1 && (
          <div className="absolute left-[10%] right-[10%] top-[16%] flex items-center justify-center pointer-events-none" style={{ height: '13%' }}>
            <h3 className="comic-title text-center text-[27px] font-black leading-none tracking-[4px] px-1 flex items-center justify-center">
              {renderFormattedTitle(sipseongInfo?.title ?? page1.group)}
            </h3>
          </div>
        )}

        {/* ② 2페이지 타이틀 및 내용 영역 */}
        {step === 2 && page2 && (
          <>
            <div className="absolute left-[10%] right-[10%] top-[15%] flex items-center justify-center pointer-events-none" style={{ height: '13%' }}>
              <h3 className="comic-title text-center text-[26px] font-black leading-none tracking-[4px] px-1 flex items-center justify-center">
                {renderFormattedTitle(ohaengInfo?.title ?? page2.element)}
              </h3>
            </div>

            {/* ② 2페이지 설명 영역 (whitespace-normal과 break-keep 적용으로 잘림 방지 및 자연스러운 줄바꿈) */}
            <div className="absolute left-[10%] right-[10%] top-[31%] flex items-center justify-center text-center pointer-events-none">
              <div className="text-[12px] sm:text-[12.5px] font-bold leading-snug text-slate-800 px-1 whitespace-normal break-keep">
                {renderDescription(ohaengInfo?.description)}
              </div>
            </div>

            {/* ③ 2페이지 태그 영역 (글자가 길어질 경우를 대비해 폰트 크기를 반응형으로 조정) */}
            <div
              className="absolute left-[16%] right-[17%] top-[40%] grid grid-cols-2 pointer-events-none"
              style={{ height: '32%', columnGap: '9%', rowGap: '51%' }}
            >
              {page2.industries.slice(0, 6).map((industry, idx) => (
                <div key={idx} className="flex items-center justify-center text-center px-1">
                  <span className="truncate text-[16px] sm:text-[20px] font-black text-slate-900 w-full">#{industry}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ② 1페이지 전용 캐릭터 + 설명 영역 */}
        {step === 1 && page1 && (
          <div className="absolute left-[12%] right-[12%] top-[28%] flex flex-col items-center justify-between text-center pointer-events-none h-[25%]">
            <div className="h-27 w-27 relative flex items-center justify-center shrink-0">
              {sipseongInfo?.image && (
                <img
                  src={sipseongInfo.image}
                  alt={sipseongInfo.title}
                  className="h-full w-full object-contain drop-shadow-md"
                />
              )}
            </div>
            <div className="w-full flex items-center justify-center min-h-9.5">
              <div className="text-[17px] font-bold leading-snug text-slate-800 px-1">
                {renderDescription(page1.description || sipseongInfo?.description)}
              </div>
            </div>
          </div>
        )}

        {/* ③ 1페이지 전용 태그 영역 */}
        {step === 1 && (
          <div
            className="absolute left-[16%] right-[17%] top-[59.5%] grid grid-cols-2 pointer-events-none"
            style={{ height: '30%', columnGap: '9%', rowGap: '17%' }}
          >
            {page1 && page1.jobs.slice(0, 4).map((job, idx) => (
              <div key={idx} className="flex items-center justify-center text-center px-2">
                <span className="truncate text-[16px] font-black text-slate-900">#{job}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ④ 카드 이미지 바깥 하단 안내 문구 및 인디케이터 */}
      <div className="job-dna-card-container w-full mt-3 flex flex-col items-center gap-1.5">
        <p className="text-[12.5px] font-bold text-slate-700 tracking-tight">
          {step === 1 && page2 ? '옆으로 넘기면 산업 DNA 내용을 확인할 수 있어요!' : ''}
          {step === 2 && page1 ? '옆으로 넘기면 직무 DNA 내용을 확인할 수 있어요!' : ''}
          {(!page2 || !page1) ? '카드를 좌우로 밀어보세요.' : ''}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`h-2 rounded-full border border-slate-900 transition-all ${step === 1 ? 'w-5 bg-[#ffab00]' : 'w-2 bg-slate-300'}`} />
          <span className={`h-2 rounded-full border border-slate-900 transition-all ${step === 2 ? 'w-5 bg-[#ffab00]' : 'w-2 bg-slate-300'}`} />
        </div>
      </div>
    </div>
  );
});

JobDnaResultCard.displayName = 'JobDnaResultCard';

export default JobDnaResultCard;