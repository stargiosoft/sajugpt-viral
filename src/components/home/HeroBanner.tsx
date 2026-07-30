'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SAJUGPT_URL } from '@/constants/links';

interface Slide {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
  external?: boolean;
}

// 비쥬얼 배너 5장 — 전부 이미지 자체에 타이틀/카피가 있어 앱이 덧씌우는 하단 텍스트는 비움
const SLIDES: Slide[] = [
  {
    id: 'sajugpt-baekbal-witch',
    title: '',
    category: '',
    image: '/home/hero-slides/baekbal-witch.jpg',
    href: SAJUGPT_URL,
    external: true,
  },
  {
    id: 'sajugpt-kim-taeyang',
    title: '',
    category: '',
    image: '/home/hero-slides/kim-taeyang.jpg',
    href: SAJUGPT_URL,
    external: true,
  },
  {
    id: 'sajugpt-luca',
    title: '',
    category: '',
    image: '/home/hero-slides/luca.jpg',
    href: SAJUGPT_URL,
    external: true,
  },
  {
    id: 'sajugpt-yujeong',
    title: '',
    category: '',
    image: '/home/hero-slides/yujeong-tarot.jpg',
    href: SAJUGPT_URL,
    external: true,
  },
  {
    id: 'sajugpt-love-chat',
    title: '',
    category: '',
    image: '/home/hero-slides/love-chat.jpg',
    href: SAJUGPT_URL,
    external: true,
  },
];

const AUTOPLAY_MS = 4500;

// 양 끝에 클론 슬라이드를 붙여 무한 롤링처럼 이어지게 하는 트랙 인덱스.
// trackIndex 0 = 마지막 슬라이드의 클론, 1..N = 실제 슬라이드, N+1 = 첫 슬라이드의 클론.
const EXTENDED_SLIDES: Slide[] = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0]];

// 자동재생 히어로 배너 — 스와이프 없이 탭으로만 이동 (드래그 트랙 동기화 버그로 제거)
export default function HeroBanner() {
  const router = useRouter();
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hoverTooltip, setHoverTooltip] = useState(false);
  const [overIndicator, setOverIndicator] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const isAnimatingRef = useRef(false);

  const index = (trackIndex - 1 + SLIDES.length) % SLIDES.length;

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setTrackIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused]);

  // 클론 위치에 도달한 뒤 전환 없이 실제 슬라이드 위치로 순간 이동시켜 끊김 없이 이어지게 한다.
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => setTransitionEnabled(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  const handleTrackTransitionEnd = useCallback(() => {
    isAnimatingRef.current = false;
    if (trackIndex === 0) {
      setTransitionEnabled(false);
      setTrackIndex(SLIDES.length);
    } else if (trackIndex === SLIDES.length + 1) {
      setTransitionEnabled(false);
      setTrackIndex(1);
    }
  }, [trackIndex]);

  const slide = SLIDES[index];

  const navigateTo = useCallback((target: Slide) => {
    if (target.external) {
      window.open(target.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(target.href);
    }
  }, [router]);

  // 배너 진입 시 한 번만 getBoundingClientRect()로 좌표 기준을 캐싱 — 매 mousemove마다
  // 레이아웃을 다시 읽지 않도록 (호버 중엔 배너 위치/크기가 바뀌지 않으므로 안전)
  const tooltipRectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    tooltipRectRef.current = e.currentTarget.getBoundingClientRect();
    setPaused(true);
    setHoverTooltip(true);
  }, []);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = tooltipRectRef.current;
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      onClick={() => navigateTo(slide)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => { setPaused(false); setHoverTooltip(false); setOverIndicator(false); }}
      onMouseMove={handleMouseMove}
      className="relative w-full shrink-0 overflow-hidden transform-gpu"
      style={{
        borderRadius: '20px',
        aspectRatio: '16 / 9',
        maxHeight: '410px',
        cursor: 'pointer',
      }}
    >
      {hoverTooltip && !overIndicator && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y + 14}px`,
            zIndex: 50,
            pointerEvents: 'none',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: '6px',
            paddingTop: '2px',
            paddingLeft: '6px',
            paddingBottom: '1px',
            paddingRight: '4px',
            border: '1px solid #E5E5E5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          사주GPT 이동
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      <div
        onTransitionEnd={handleTrackTransitionEnd}
        className="absolute inset-0 flex h-full"
        style={{
          width: `${EXTENDED_SLIDES.length * 100}%`,
          transform: `translate3d(${-trackIndex * (100 / EXTENDED_SLIDES.length)}%, 0, 0)`,
          transition: !transitionEnabled ? 'none' : 'transform 600ms cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        {EXTENDED_SLIDES.map((s, i) => (
          <div key={`${s.id}-${i}`} className="h-full shrink-0" style={{ width: `${100 / EXTENDED_SLIDES.length}%` }}>
            <img
              src={s.image}
              alt=""
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
              loading="eager"
              decoding="async"
              fetchPriority={i <= 2 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>

      {/* 하단 오버레이 — 그라디언트/타이틀/로고/인디케이터를 absolute 레이어 하나로 묶고,
          내부 배치는 전부 flex(justify-between/gap)로 처리 — 각 요소를 개별 left/right/bottom
          px로 흩어놓지 않아 폰트 렌더링 차이에 흔들리지 않는다. */}
      <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: '16px 14px 14px 18px' }}>
        {slide.title && (
          <>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.2) 42%, rgba(0,0,0,0) 65%)' }}
            />
            <div style={{ marginBottom: '14px' }}>
              <p
                className="hero-banner-title"
                style={{
                  fontSize: 'var(--hero-title-size)',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.4px',
                  lineHeight: '1.3',
                  marginBottom: '7px',
                }}
              >
                {slide.title}
              </p>
              <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1, color: 'rgba(255,255,255,0.8)' }}>{slide.category}</span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <span
            role="img"
            aria-label="사주GPT"
            className="hero-banner-logo"
            style={{
              display: 'inline-block',
              height: 'var(--hero-logo-height)',
              width: 'var(--hero-logo-width)',
              backgroundColor: '#ffffff',
              WebkitMaskImage: 'url(/sajugpt-logo.svg)',
              maskImage: 'url(/sajugpt-logo.svg)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskPosition: 'left center',
            }}
          />

          <span
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => { e.stopPropagation(); setOverIndicator(true); }}
            onMouseLeave={(e) => { e.stopPropagation(); setOverIndicator(false); }}
            onMouseMove={(e) => e.stopPropagation()}
            className="flex items-center shrink-0"
            style={{
              backgroundColor: 'rgba(30,30,30,0.55)',
              borderRadius: '999px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              paddingLeft: '2px',
              paddingRight: '3px',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{ width: '26px', height: '28px', paddingLeft: '2px', boxSizing: 'content-box' }}
            >
              {paused ? (
                <span
                  aria-hidden
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: '8px solid #ffffff',
                    borderRadius: '2px',
                    marginLeft: '1px',
                  }}
                />
              ) : (
                <span className="flex items-center" style={{ gap: '3px' }}>
                  <span aria-hidden style={{ width: '3px', height: '10px', borderRadius: '1px', backgroundColor: '#ffffff' }} />
                  <span aria-hidden style={{ width: '3px', height: '10px', borderRadius: '1px', backgroundColor: '#ffffff' }} />
                </span>
              )}
            </span>
            <span style={{ width: '1.5px', height: '8px', backgroundColor: 'rgba(255,255,255,0.18)', marginLeft: '2px', marginRight: '4px' }} />
            <span
              className="flex items-center justify-center shrink-0"
              style={{
                width: '38px',
                padding: '7px 4px 7px 2px',
                boxSizing: 'content-box',
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: 1,
                color: '#ffffff',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {index + 1} / {SLIDES.length}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
