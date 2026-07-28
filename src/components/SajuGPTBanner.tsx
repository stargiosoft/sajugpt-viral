'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { trackEvent, trackSajuGPTClick, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
  resultId?: string;
}

// 크리에이티브 3장을 /public/ads/sajugpt-banner-1~3.png 로 교체하면 5개 테스트 전체에 동일하게 반영됨
const BANNER_IMAGES = [
  '/ads/sajugpt-banner-1.png',
  '/ads/sajugpt-banner-2.png',
  '/ads/sajugpt-banner-3.png',
];

// 양 끝에 클론 슬라이드를 붙여, 마지막→처음으로 넘어갈 때도 역방향으로 되감기지 않고 항상 좌→우로 흐르게 함.
// trackIndex 0 = 마지막 이미지의 클론, 1..N = 실제 이미지, N+1 = 첫 이미지의 클론 (HeroBanner와 동일 패턴)
const EXTENDED_IMAGES = [BANNER_IMAGES[BANNER_IMAGES.length - 1], ...BANNER_IMAGES, BANNER_IMAGES[0]];

const ROTATE_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

const WEB_URL = 'https://www.sajugpt.co.kr/';

// 결과 화면 하단(댓글 위)에 공통으로 붙는 사주GPT 광고 배너 — 5개 테스트 전체가 동일한 이미지·클릭 대상을 공유
export default function SajuGPTBanner({ featureType, resultId }: Props) {
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const draggingRef = useRef(false);
  const dragRef = useRef({ pointerId: null as number | null, startX: 0, moved: false });
  const containerRef = useRef<HTMLAnchorElement>(null);

  const index = (trackIndex - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      if (draggingRef.current) return;
      setTrackIndex((i) => i + 1);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  // 클론 위치에 도달한 뒤 트랜지션 없이 실제 이미지 위치로 순간 이동시켜 끊김 없이 이어지게 함
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => setTransitionEnabled(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  const handleTrackTransitionEnd = useCallback(() => {
    if (trackIndex === 0) {
      setTransitionEnabled(false);
      setTrackIndex(BANNER_IMAGES.length);
    } else if (trackIndex === BANNER_IMAGES.length + 1) {
      setTransitionEnabled(false);
      setTrackIndex(1);
    }
  }, [trackIndex]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, moved: false };
    draggingRef.current = true;
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) dragRef.current.moved = true;
    setDragOffsetPx(dx);
  };

  const endDrag = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (dragRef.current.pointerId !== null && containerRef.current?.hasPointerCapture?.(dragRef.current.pointerId)) {
      containerRef.current.releasePointerCapture(dragRef.current.pointerId);
    }
    const dx = e.clientX - dragRef.current.startX;
    setDragOffsetPx(0);
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      setTrackIndex((i) => i + (dx < 0 ? 1 : -1));
    }
  };

  const handleClick = (e: ReactMouseEvent) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      return;
    }
    trackEvent('sajugpt_banner_click', { featureType, bannerIndex: index });
    trackSajuGPTClick(featureType, resultId);
  };

  return (
    <Link
      ref={containerRef}
      href={WEB_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDragStart={(e) => e.preventDefault()}
      className="relative block w-full transform-gpu"
      style={{ aspectRatio: '1800 / 450', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', touchAction: 'pan-y', userSelect: 'none' }}
    >
      <div
        onTransitionEnd={handleTrackTransitionEnd}
        className="absolute inset-0 flex h-full"
        style={{
          width: `${EXTENDED_IMAGES.length * 100}%`,
          transform: `translateX(calc(${-trackIndex * (100 / EXTENDED_IMAGES.length)}% + ${dragOffsetPx}px))`,
          transition: transitionEnabled ? 'transform 0.45s ease-in-out' : 'none',
        }}
      >
        {EXTENDED_IMAGES.map((src, i) => (
          <div key={`${src}-${i}`} className="h-full shrink-0" style={{ width: `${100 / EXTENDED_IMAGES.length}%` }}>
            <img
              src={src}
              alt="사주GPT로 더 알아보기"
              draggable={false}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </Link>
  );
}
