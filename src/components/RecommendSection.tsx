'use client';

import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TEST_CATALOG } from '@/constants/testCatalog';
import { trackEvent } from '@/lib/analytics';

// money-timeline(내 돈복 테스트)은 아직 API 연결 전이라 추천 목록에서 임시로 제외
const ALL_IDS = ['ghost-tarot', 'romance-ghost-tarot', 'deang-saju', 'love-chat'];
const GAP_PX = 6;
// 모바일은 2.5개만 보여서 오른쪽 카드가 살짝 잘려 "더 있다"는 게 드러나고, 데스크탑은 기존대로 4개 꽉 차게
const DRAG_CLICK_THRESHOLD_PX = 6;

interface RecommendSectionProps {
  /** 현재 페이지 자신의 testCatalog id — 추천 목록에서 제외됨 */
  excludeId: string;
  titleText?: string;
  /** 섹션 타이틀 폰트 — 테스트마다 다른 브랜드 폰트를 그대로 사용 (카드 하단 소제목은 항상 Pretendard 고정) */
  titleStyle: CSSProperties;
  /** 이미지 로드 전 카드 배경색 */
  cardBg?: string;
  /** 카드 하단 소제목 색상 — 페이지 배경(다크/라이트)에 맞춰 별도로 지정, titleStyle.color와 무관 */
  cardTitleColor: string;
}

// 결과 화면 하단(댓글 위)에 공통으로 붙는 "다른 테스트 추천" 가로 드래그 스크롤 — 카드 4개가 한 화면에 꽉 차고,
// 항목이 늘어나면 자연스럽게 드래그로 넘길 수 있도록 폭을 퍼센트 calc로 고정
export default function RecommendSection({ excludeId, titleText = '추천 테스트', titleStyle, cardBg = '#FFFFFF', cardTitleColor }: RecommendSectionProps) {
  const items = ALL_IDS.filter((id) => id !== excludeId)
    .map((id) => TEST_CATALOG.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => !!item);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, pointerId: null as number | null, startX: 0, startScrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    // 터치는 브라우저 네이티브 스크롤에 맡긴다 — JS로 scrollLeft를 같이 건드리면 네이티브 관성 스크롤과
    // 충돌해서 뚝뚝 끊기므로, 마우스 드래그(데스크탑)에서만 커스텀 드래그를 사용
    if (!scroller || e.pointerType !== 'mouse' || e.button !== 0) return;
    dragRef.current = { active: true, pointerId: e.pointerId, startX: e.clientX, startScrollLeft: scroller.scrollLeft, moved: false };
    setIsDragging(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag.active || !scroller) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > DRAG_CLICK_THRESHOLD_PX) drag.moved = true;
    scroller.scrollLeft = drag.startScrollLeft - dx;
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (drag.pointerId !== null && scrollerRef.current?.hasPointerCapture?.(drag.pointerId)) {
      scrollerRef.current.releasePointerCapture(drag.pointerId);
    }
    setIsDragging(false);
  };

  const handleCardClick = (e: ReactMouseEvent, targetId: string) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      return;
    }
    trackEvent('recommend_card_click', { from: excludeId, to: targetId });
  };

  return (
    <div style={{ paddingBottom: '24px' }}>
      <p style={{ marginBottom: '8px', ...titleStyle }}>{titleText}</p>
      <div
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex overflow-x-auto"
        style={{
          gap: `${GAP_PX}px`,
          paddingLeft: '2px',
          paddingRight: '2px',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-x',
          userSelect: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          // mandatory는 터치 드래그 도중에도 스냅을 강제해서 특히 역방향 스와이프에서 버벅임 유발 — proximity로 완화
          scrollSnapType: isDragging ? 'none' : 'x proximity',
        }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={(e) => handleCardClick(e, item.id)}
            onDragStart={(e) => e.preventDefault()}
            className="flex flex-col shrink-0 w-[calc((100%-12px)/2.5)] md:w-[calc((100%-18px)/3.5)]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <motion.div
              whileTap={{ scale: 0.998 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full aspect-[4/3] transform-gpu"
              style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: cardBg, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            >
              {item.imageSrc && (
                <motion.img
                  src={item.imageSrc}
                  alt=""
                  draggable={false}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 1.1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="w-full h-full transform-gpu"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </motion.div>
            <p
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: '12.5px',
                fontWeight: 600,
                color: cardTitleColor,
                letterSpacing: '-0.2px',
                lineHeight: 1.3,
                marginTop: '10px',
                paddingLeft: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
