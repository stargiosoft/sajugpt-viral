'use client';

import { motion } from 'framer-motion';
import useIsNarrow from '@/hooks/useIsNarrow';
// TypeScript 형식 정의를 위해 SVGProps 임포트
import { SVGProps } from 'react';

const COLOR = {
  text: '#684a3c', 
  primary: '#f9a15d',
  secondary: '#fecea4', 
  bg: '#fff7e6',      
  border: '#da664e',  
  pink: '#fca5a5',     
  green: '#bbf7d0',    
  blue: '#bfdbfe', 
};

// 이미지 속 작은 소품들을 SVG 컴포넌트로 정의
const SmallArt = ({ type }: { type: 'heart' | 'star' | 'clover' | 'bag_handle' }) => {
  // TypeScript 에러 수정: 형식을 명시적으로 지정
  const commonProp: SVGProps<SVGPathElement> = {
    stroke: COLOR.text,
    strokeWidth: 1.5,
    fill: 'none',
    strokeLinecap: 'round', 
    strokeLinejoin: 'round'
  };
  switch (type) {
    case 'heart':
      return <svg viewBox="0 0 24 24" className="w-full h-full"><path {...commonProp} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={COLOR.pink} /></svg>;
    case 'star':
      return <svg viewBox="0 0 24 24" className="w-full h-full"><path {...commonProp} d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" fill={COLOR.primary} /></svg>;
    case 'clover':
      return <svg viewBox="0 0 24 24" className="w-full h-full"><path {...commonProp} d="M12 2C8.68 2 6 4.68 6 8.01 6 11.34 8.68 14 12 14c3.32 0 6-2.66 6-5.99C18 4.68 15.32 2 12 2zM12 14v8h0" /></svg>; // 단순화된 클로버
    case 'bag_handle':
      return <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M7 6c0-2.2 1.8-4 4-4s4 1.8 4 4v2H7V6z" fill="none" stroke={COLOR.text} strokeWidth="2.5" /></svg>;
  }
};

function ClawMachineScene({ size = 240 }: { size?: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-between rounded-[44px] p-5 overflow-hidden shadow-[0_15px_30px_rgba(104,74,60,0.2)]"
      style={{
        width: size,
        height: size * 1.25,
        border: `6px solid ${COLOR.border}`,
        backgroundColor: COLOR.bg,
        fontFamily: 'GabiaSolmi, cursive, sans-serif',
      }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff');

        @font-face {
            font-family: 'GabiaSolmi';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff') format('woff');
            font-weight: normal;
            font-display: swap;
        }

        .hand-drawn-border {
          border: 1.5px solid #1e1409;
          border-radius: 8px;
        }

        @keyframes clawMove {
          0%   { transform: translate(0px, 0px); }
          12%  { transform: translate(0px, 0px); }
          28%  { transform: translate(0px, 65px); }
          42%  { transform: translate(0px, 65px); }
          58%  { transform: translate(0px, 0px); }
          72%  { transform: translate(65px, 0px); }
          82%  { transform: translate(65px, 20px); }
          90%  { transform: translate(65px, 0px); }
          100% { transform: translate(0px, 0px); }
        }
        .claw-assembly { animation: clawMove 8s ease-in-out infinite; }

        @keyframes prongLeft {
          0%, 12%  { transform: rotate(18deg); }
          28%, 78% { transform: rotate(4deg); }
          88%, 100%{ transform: rotate(18deg); }
        }
        @keyframes prongRight {
          0%, 12%  { transform: rotate(-18deg); }
          28%, 78% { transform: rotate(-4deg); }
          88%, 100%{ transform: rotate(-18deg); }
        }
        .prong-left  { animation: prongLeft 8s ease-in-out infinite; transform-origin: top right; }
        .prong-right { animation: prongRight 8s ease-in-out infinite; transform-origin: top left; }

        @keyframes heldCharacter {
          0%, 30%   { opacity: 0; transform: scale(0.6); }
          35%, 78%  { opacity: 1; transform: scale(1); }
          84%, 100% { opacity: 0; transform: scale(0.6); }
        }
        .held-character { animation: heldCharacter 8s ease-in-out infinite; }

        @keyframes pileBag {
          0%, 28%   { opacity: 1; }
          35%, 82%  { opacity: 0.15; transform: scale(0.9); }
          92%, 100% { opacity: 1; transform: scale(1); }
        }
        .pile-bag { animation: pileBag 8s ease-in-out infinite; transform-origin: center bottom;}
      `}</style>

      {/* 테두리 포인트: 하트와 별 */}
      <div className="absolute top-2 left-2 w-7 h-7 rotate-[-15deg]"><SmallArt type="star" /></div>
      <div className="absolute top-2 right-2 w-7 h-7 rotate-15"><SmallArt type="star" /></div>
      <div className="absolute bottom-2 left-2 w-7 h-7 rotate-10"><SmallArt type="heart" /></div>
      <div className="absolute bottom-2 right-2 w-7 h-7 rotate-[-10deg]"><SmallArt type="heart" /></div>

      {/* 1. 상단 타이틀 */}
      <div className="relative w-full text-center flex items-center justify-center pt-2 pb-1">
        <div className="relative z-10 p-2 bg-white rounded-full hand-drawn-border flex items-center gap-1.5 shadow-sm">
          <div className="w-3.5 h-3.5"><SmallArt type="star" /></div>
          <span className="text-[14px] font-black tracking-tight" style={{ color: COLOR.text }}>
            JOB DNA MACHINE
          </span>
          <div className="w-3.5 h-3.5"><SmallArt type="star" /></div>
        </div>
        {/* 말풍선 꼬리 */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-3.75 w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-t-10 border-t-white z-0" />      
    </div>

      {/* 2. 기계 내부 쇼케이스 */}
      <div className="relative w-full flex-1 mt-3 mb-3 rounded-4xl overflow-hidden shadow-inner" style={{ backgroundColor: COLOR.secondary }}>
        <div className="absolute top-2 left-2 right-2 h-4 flex items-center justify-center gap-1">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-orange-400 opacity-60" />)}
        </div>

        <div className="claw-assembly absolute top-3 left-6 z-20">
          <div className="w-1 h-8 mx-auto bg-slate-100 hand-drawn-border" />
          <div className="w-5 h-4 rounded-full mx-auto -mt-1 hand-drawn-border shadow-sm" style={{ backgroundColor: COLOR.text, opacity: 0.8 }} />
          <div className="flex items-start justify-center gap-0 -mt-0.5">
            <div className="prong-left w-3.5 h-7 border-[2.5px] border-amber-900 border-r-0 rounded-tl-full shadow-sm" />
            <div className="prong-right w-3.5 h-7 border-[2.5px] border-amber-900 border-l-0 rounded-tr-full shadow-sm" />
          </div>

          <div className="held-character absolute left-1/2 -translate-x-1/2 top-10 flex flex-col items-center">
            <div className="w-9 h-10 flex flex-col items-center gap-1 scale-110">
              <div className="w-6 h-6 rotate-10 hand-drawn-border flex items-center justify-center relative shadow-sm" style={{ backgroundColor: COLOR.primary, borderRadius: '5px 5px 0 0' }}>
                <div className="w-1 h-1 rounded-full bg-white opacity-80" />
                <div className="absolute -bottom-1 w-8 h-1.5 rounded-full hand-drawn-border" style={{ backgroundColor: COLOR.text, opacity: 0.8 }} />
              </div>
              <div className="w-8 h-8 rounded-full bg-cream hand-drawn-border flex items-center justify-center gap-0.5 p-1 relative shadow-inner" style={{ backgroundColor: COLOR.bg }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR.text }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR.text }} />
              </div>
            </div>
          </div>
        </div>

        {/* 바닥 캐릭터 더미 */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-1 z-10 px-1">
          <div className="pile-bag relative w-10 h-10 flex flex-col items-center">
            <div className="w-5 h-3 -mb-1 relative z-10"><SmallArt type="bag_handle" /></div>
            <div className="w-10 h-8 rounded-md hand-drawn-border p-1.5 relative shadow-sm" style={{ backgroundColor: COLOR.text, opacity: 0.8 }}>
              <div className="absolute -top-3 -right-2 w-5 h-5 flex flex-col items-center gap-0">
                <div className="w-4 h-4 rounded-full bg-white hand-drawn-border opacity-90 shadow-sm" style={{ border: `1.5px solid ${COLOR.primary}` }}/>
                <div className="w-1.5 h-3 -mt-1 hand-drawn-border" style={{ backgroundColor: COLOR.primary }} />
              </div>
              <div className="w-7 h-5 flex items-center justify-center gap-1 p-0.5 relative z-0">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR.bg }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR.bg }} />
              </div>
            </div>
          </div>
          {/* 다른 캡슐 캐릭터들 */}
          <div className="w-8 h-8 rounded-full bg-white hand-drawn-border opacity-90Shadow-sm" style={{ backgroundColor: COLOR.pink }} />
          <div className="w-8 h-8 rounded-full bg-white hand-drawn-border opacity-90Shadow-sm" style={{ backgroundColor: COLOR.green }} />
          <div className="w-8 h-8 rounded-full bg-white hand-drawn-border opacity-90Shadow-sm" style={{ backgroundColor: COLOR.blue }} />
        </div>

        {/* 하단 투입구 포인트 */}
        <div className="absolute bottom-0 right-0 w-10 h-9 rounded-tl-xl hand-drawn-border flex items-center justify-center z-10 shadow-sm" style={{ backgroundColor: COLOR.bg, borderColor: COLOR.primary }}>
          {/* Tailwind 경고 수정: rotate-[15deg] -> rotate-15 */}
          <div className="w-6 h-6 rotate-15"><SmallArt type="heart" /></div>
        </div>
      </div>

      {/* 3. 하단 조작부 */}
      <div className="w-full py-1.5 px-4 bg-white/40 backdrop-blur-sm rounded-[20px] hand-drawn-border flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-7 flex flex-col items-center">
            <div className="w-4 h-4 -mb-1 rotate-[-10deg]"><SmallArt type="star" /></div>
            <div className="w-1.5 h-5 hand-drawn-border" style={{ backgroundColor: COLOR.primary, opacity: 0.9 }} />
          </div>
          <span className="text-[12px] font-black" style={{ color: COLOR.text, opacity: 0.7 }}>START</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4"><SmallArt type="heart" /></div>
          <div className="w-4 h-4"><SmallArt type="star" /></div>
          <div className="w-4 h-4"><SmallArt type="heart" /></div>
        </div>
      </div>
    </div>
  );
}

export default function JobDnaAnalyzing() {
  const isNarrow = useIsNarrow();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="job-dna-analyzing-container flex flex-col items-center justify-center text-white min-h-[75vh] p-4"
      style={{ fontFamily: 'GabiaSolmi, cursive, sans-serif' }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff');

        @font-face {
            font-family: 'GabiaSolmi';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff') format('woff');
            font-weight: normal;
            font-display: swap;
        }

        .job-dna-analyzing-container {
          font-family: 'GabiaSolmi', cursive, sans-serif;
        }

        .hand-drawn-border-title {
          border: 2px solid #1e1409;
          border-radius: 12px;
        }
      `}</style>

      <div className="flex flex-col items-center text-center max-w-md w-full">
        <div className="mb-10">
          <ClawMachineScene size={isNarrow ? 200 : 230} />
        </div>

        <div className="relative w-full text-center flex items-center justify-center mb-6">
          <div className="relative z-10 p-3 bg-white hand-drawn-border-title flex items-center gap-1.5 shadow-md">
            <div className="w-7 h-7"><SmallArt type="star" /></div>
            <h3 className="font-black leading-snug tracking-tight" style={{ fontSize: isNarrow ? '24px' : '28px', color: COLOR.text }}>
              사주에 새겨진 직업 DNA
            </h3>
            <div className="w-7 h-7"><SmallArt type="star" /></div>
          </div>
          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-3.75 left-1/2 -translate-x-3.75 w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-t-15 border-t-white z-0" />
          </div>

        {/* 서브 문구 및 도트 라인 장식 (이미지 스타일) */}
        <div className="flex items-center gap-2 mb-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-200 opacity-80" />)}
          <p className="text-[20px] leading-relaxed font-black" style={{ color: COLOR.bg, textShadow: `1px 1px 0 ${COLOR.text}` }}>
            <span className="font-extrabold" style={{ color: COLOR.secondary }}>신중하게 골라내는 중...</span>
          </p>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-200 opacity-80" />)}
        </div>
        <p className="text-[14px] leading-relaxed font-bold opacity-80 px-5" style={{ color: COLOR.bg }}>
          나의 <span className="font-extrabold" style={{ color: COLOR.secondary }}>Saju Job DNA</span>를 분석하여 딱 맞는 직업 유형을 뽑고 있어요. 잠시만 기다려주세요!
        </p>

      </div>
    </motion.div>
  );
}