'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { trackEvent, trackSajuGPTClick, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
  resultId?: string;
}

const BANNER_IMAGES = [
  '/ads/sajugpt-banner-baekbal-witch-v2.webp',
  '/ads/sajugpt-banner-app-1.webp',
  '/ads/sajugpt-banner-kim-taeyang-v2.webp',
  '/ads/sajugpt-banner-namgi-tarot-v2.webp',
  '/ads/sajugpt-banner-app-2.webp',
];

const EXTENDED_IMAGES = [BANNER_IMAGES[BANNER_IMAGES.length - 1], ...BANNER_IMAGES, BANNER_IMAGES[0]];

const ROTATE_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

const WEB_URL = 'https://www.sajugpt.co.kr/';

export default function SajuGPTBanner({ featureType, resultId }: Props) {
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
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
    setIsDragging(true);
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
    setIsDragging(false);
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
      className="relative block w-full overflow-hidden"
      style={{
        aspectRatio: '1800 / 450',
        borderRadius: '20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
      }}
    >
      <div
        onTransitionEnd={handleTrackTransitionEnd}
        className="absolute top-0 left-0 flex h-full will-change-transform"
        style={{
          width: `${EXTENDED_IMAGES.length * 100}%`,
          transform: `translate3d(calc(${-trackIndex * (100 / EXTENDED_IMAGES.length)}% + ${dragOffsetPx}px), 0, 0)`,
          transition: isDragging || !transitionEnabled ? 'none' : 'transform 0.45s ease-in-out',
        }}
      >
        {EXTENDED_IMAGES.map((src, i) => {
          const isCurrent = i === trackIndex;
          const isNeighbor = Math.abs(i - trackIndex) === 1;
          return (
            <div key={`${src}-${i}`} className="relative h-full shrink-0" style={{ width: `${100 / EXTENDED_IMAGES.length}%` }}>
              <img
                src={src}
                alt="사주GPT로 더 알아보기"
                draggable={false}
                loading={isCurrent || isNeighbor ? 'eager' : 'lazy'}
                fetchPriority={isCurrent ? 'high' : 'auto'}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          );
        })}
      </div>
    </Link>
  );
}