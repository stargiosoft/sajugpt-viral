'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useRouter } from 'next/navigation';

const SAJUGPT_URL = 'https://www.sajugpt.co.kr/';

interface Slide {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
  external?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: 'sajugpt',
    title: '더 깊은 사주 분석이 궁금하다면?',
    category: 'AI',
    image: '/home/hero-slides/slide1.jpg',
    href: SAJUGPT_URL,
    external: true,
  },
  {
    id: 'sexy-battle',
    title: '나한테 꼬인 남자는 몇 명일까?',
    category: '연애',
    image: '/home/hero-slides/slide2.jpg',
    href: '/sexy-battle',
  },
  {
    id: 'court',
    title: '연애 못한 이유, 사주로 기소당하다',
    category: '연애',
    image: '/home/hero-slides/slide3.jpg',
    href: '/court',
  },
  {
    id: 'dating-sim',
    title: 'AI와 나누는 사주 궁합 데이트',
    category: '시뮬레이션',
    image: '/home/hero-slides/slide4.jpg',
    href: '/dating-sim',
  },
];

const AUTOPLAY_MS = 4500;
const TAP_THRESHOLD_PX = 8;
const SWIPE_THRESHOLD_PX = 50;

interface DragState {
  active: boolean;
  pointerId: number | null;
  startX: number;
  startY: number;
  lastX: number;
  direction: 'none' | 'horizontal' | 'vertical';
}

// 양 끝에 클론 슬라이드를 붙여 무한 롤링처럼 이어지게 하는 트랙 인덱스.
// trackIndex 0 = 마지막 슬라이드의 클론, 1..N = 실제 슬라이드, N+1 = 첫 슬라이드의 클론.
const EXTENDED_SLIDES: Slide[] = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0]];

// 스와이프/드래그로 넘길 수 있는 히어로 캐러셀 — 탭은 이동, 드래그는 슬라이드로 분리 처리
export default function HeroBanner() {
  const router = useRouter();
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    direction: 'none',
  });

  const index = (trackIndex - 1 + SLIDES.length) % SLIDES.length;

  useEffect(() => {
    if (paused || isDragging) return;
    const timer = setInterval(() => {
      setTrackIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, isDragging]);

  // 클론 위치에 도달한 뒤 전환 없이 실제 슬라이드 위치로 순간 이동시켜 끊김 없이 이어지게 한다.
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => setTransitionEnabled(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  const handleTrackTransitionEnd = useCallback(() => {
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

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      direction: 'none',
    };
    setIsDragging(true);
    setPaused(true);
  }, []);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.direction === 'none' && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      drag.direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
    }

    if (drag.direction === 'vertical') return;

    e.preventDefault();
    drag.lastX = e.clientX;
    setDragOffset(dx);
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const dx = drag.lastX - drag.startX;
    const wasVertical = drag.direction === 'vertical';
    drag.active = false;

    if (drag.pointerId !== null && containerRef.current?.hasPointerCapture?.(drag.pointerId)) {
      containerRef.current.releasePointerCapture(drag.pointerId);
    }

    setIsDragging(false);
    setDragOffset(0);

    if (!wasVertical) {
      if (Math.abs(dx) < TAP_THRESHOLD_PX) {
        navigateTo(slide);
      } else if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
        const dir = dx < 0 ? 1 : -1;
        setTrackIndex((i) => i + dir);
      }
      // 문턱값 사이의 애매한 드래그는 스냅백만 하고 아무 동작도 하지 않는다.
    }

    if (e.pointerType === 'touch') {
      setPaused(false);
    }
  }, [navigateTo, slide]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { if (!dragRef.current.active) setPaused(false); }}
      className="relative w-full shrink-0 overflow-hidden transform-gpu"
      style={{
        borderRadius: '20px',
        aspectRatio: '16 / 9',
        maxHeight: '410px',
        cursor: isDragging ? 'grabbing' : 'pointer',
        touchAction: 'pan-y',
        userSelect: 'none',
      }}
    >
      <div
        onTransitionEnd={handleTrackTransitionEnd}
        className="absolute inset-0 flex h-full"
        style={{
          width: `${EXTENDED_SLIDES.length * 100}%`,
          transform: `translateX(calc(${-trackIndex * (100 / EXTENDED_SLIDES.length)}% + ${dragOffset}px))`,
          transition: isDragging || !transitionEnabled ? 'none' : 'transform 600ms cubic-bezier(0.65, 0, 0.35, 1)',
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
            />
          </div>
        ))}
      </div>

      {/* 하단 텍스트 가독성용 그라디언트 */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.2) 42%, rgba(0,0,0,0) 65%)' }}
      />

      <div className="absolute" style={{ left: '22px', right: '80px', bottom: '20px' }}>
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
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{slide.category}</span>
      </div>

      <span
        className="absolute inline-flex items-center"
        style={{
          right: '18px',
          bottom: '20px',
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
              <span aria-hidden style={{ width: '1.5px', height: '10px', borderRadius: '1px', backgroundColor: '#ffffff' }} />
              <span aria-hidden style={{ width: '1.5px', height: '10px', borderRadius: '1px', backgroundColor: '#ffffff' }} />
            </span>
          )}
        </span>
        <span style={{ width: '1px', height: '10px', backgroundColor: 'rgba(255,255,255,0.28)', marginLeft: '2px', marginRight: '4px' }} />
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: '38px',
            padding: '7px 4px 7px 2px',
            boxSizing: 'content-box',
            fontSize: '12px',
            fontWeight: 700,
            color: '#ffffff',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {index + 1} / {SLIDES.length}
        </span>
      </span>
    </div>
  );
}
