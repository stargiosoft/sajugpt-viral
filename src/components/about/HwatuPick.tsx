'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TEST_CATALOG } from '@/constants/testCatalog';
import { MOAMOA_ORANGE } from '@/constants/theme';
import type { TestCatalogItem } from '@/types/testCatalog';

const CARD_COUNT = 4;
// 뽑기 풀 — 홈에 실제로 노출 중이고 열려 있는 테스트만
const POOL = TEST_CATALOG.filter((item) => item.visibleOnHome && item.ready);
// 선택한 패가 뒤집혀 돌아오는 시간(ms) — 이 시간이 지난 뒤에 새 패를 섞어야 앞면이 미리 보이지 않는다
const FLIP_BACK_MS = 600;

function dealCards(): TestCatalogItem[] {
  const deck = [...POOL];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, CARD_COUNT);
}

// 앞·뒷면 공통 — 블랙 바탕에 흰 가는 선
const FACE_BG = '#0d0d0d';
const LINE = 'rgba(255, 255, 255, 0.28)';

// 엎어진 패 — 블랙 바탕·흰 가는 테두리 가운데 광필이 얼굴(흰 얼굴에 블랙 이목구비로 반전).
// 원본 캐릭터 PNG를 오리면 목깃·팔 선이 같이 걸려서, 원본 비율(머리 반지름 기준 눈·눈썹·콧수염 위치)을 재서 SVG로 직접 그렸다.
// [x, y, 크기 배율]
const BACK_SPARKLES: [number, number, number][] = [[49, 17, 0.8], [11, 68, 0.7]];

// 엎어진 패(얼굴 면) 배경 — 화투 '광(光)' 패처럼: 좌상단에 光이 적힌 띠(리본) 표식, 아래에 光筆 이름표, 작은 반짝임 두 개
function CardBackdrop() {
  return (
    <svg viewBox="0 0 60 88" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 w-full h-full">
      <path d="M7 7H19V22L13 18.6L7 22Z" fill="#ffffff" opacity="0.92" />
      <text x="13" y="13.2" textAnchor="middle" dominantBaseline="central" fontSize="7.4" fontWeight="500" fill="#0d0d0d">光</text>
      <g stroke="#ffffff" strokeWidth="0.3" strokeLinecap="round" opacity="0.3">
        <path d="M10 78H20.5" />
        <path d="M39.5 78H50" />
      </g>
      <text x="30" y="78.2" textAnchor="middle" dominantBaseline="central" fontSize="4.6" fontWeight="500" letterSpacing="0.6" fill="#ffffff" opacity="0.8">光筆</text>
      {BACK_SPARKLES.map(([x, y, k]) => {
        const r = 1.8 * k;
        const m = 0.5 * k;
        return (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y - r}L${x + m} ${y - m}L${x + r} ${y}L${x + m} ${y + m}L${x} ${y + r}L${x - m} ${y + m}L${x - r} ${y}L${x - m} ${y - m}Z`}
            fill="#ffffff"
            opacity="0.45"
          />
        );
      })}
    </svg>
  );
}

// 뒤집힌 패(테스트 이미지 면) 배경 — 이미지 뒤에서 은은하게 번지는 빛과, 위아래로 이어지는 가는 선 + 작은 마름모.
// 엎어진 면과 달리 원·반짝임이 없고, 이미지에는 테두리를 두지 않는다.
function FaceBackdrop() {
  return (
    <svg viewBox="0 0 60 88" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="hw-face-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="44" r="30" fill="url(#hw-face-glow)" />
      <g stroke="#ffffff" strokeWidth="0.35" strokeLinecap="round" opacity="0.35">
        <path d="M30 17V28" />
        <path d="M30 60V71" />
      </g>
      <g fill="#ffffff" opacity="0.6">
        <path d="M30 11.2l1.6 2.3-1.6 2.3-1.6-2.3z" />
        <path d="M30 72.2l1.6 2.3-1.6 2.3-1.6-2.3z" />
      </g>
    </svg>
  );
}

function HwatuBack() {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ inset: '3px', borderRadius: '9px', border: `1px solid ${LINE}`, overflow: 'hidden' }}
    >
      <CardBackdrop />
      <svg viewBox="0 0 100 100" aria-hidden className="relative" style={{ width: '72%', height: 'auto', display: 'block' }}>
        {/* 얼굴은 흰색으로 채우고, 머리카락은 블랙 바탕 위의 흰 선, 눈·눈썹·콧수염·입은 블랙으로 반전 */}
        <circle cx="50" cy="56" r="34" fill="#ffffff" />
        <path d="M38 14.5L40.5 24M50 12.5V23.5M62 14.5L59.5 24" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <g stroke={FACE_BG} strokeLinecap="round" fill="none">
          <path d="M36 54.5H43M59 52.5H66" strokeWidth="2.6" />
          <path d="M49.5 78.5H56" strokeWidth="2.2" />
        </g>
        <g fill={FACE_BG}>
          <circle cx="41.3" cy="64" r="2.3" />
          <circle cx="61.5" cy="62.5" r="2.3" />
          <ellipse cx="45" cy="72.5" rx="6.6" ry="3.7" transform="rotate(-12 45 72.5)" />
          <ellipse cx="59" cy="71.5" rx="7" ry="3.9" transform="rotate(9 59 71.5)" />
          <ellipse cx="52.9" cy="84" rx="1.9" ry="3.4" />
        </g>
      </svg>
    </div>
  );
}

// 화투 패 뒤집기 — 엎어진 패 4장 중 한 장을 고르면 뒤집히면서 테스트 하나가 나온다
export default function HwatuPick() {
  const [dealt, setDealt] = useState<TestCatalogItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 서버 렌더와 어긋나지 않도록 패는 마운트 후에 섞는다 (그 전에는 뒷면만 보인다)
  useEffect(() => {
    setDealt(dealCards());
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleReset = useCallback(() => {
    setSelected(null);
    timerRef.current = setTimeout(() => setDealt(dealCards()), FLIP_BACK_MS);
  }, []);

  const picked = selected !== null ? dealt[selected] : null;

  return (
    <section>
      <style jsx global>{`
        .hwatu-flip-card {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }
        .hwatu-flip-card.flipped {
          transform: rotateY(180deg);
        }
        .hwatu-card-side {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .hwatu-result {
          animation: hwatu-result-in 0.35s ease-out;
        }
        @keyframes hwatu-result-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.3px', marginBottom: '8px' }}>
        오늘의 패 뽑기
      </h2>
      <p style={{ fontSize: '14px', color: '#66666C', letterSpacing: '-0.1px', lineHeight: 1.6 }}>
        마음에 드는 패를 한 장 골라 뒤집어보세요. 어떤 테스트가 나올까요?
      </p>

      <div className="grid grid-cols-4" style={{ gap: '8px', marginTop: '16px' }}>
        {Array.from({ length: CARD_COUNT }, (_, i) => {
          const item = dealt[i];
          const isPicked = selected === i;
          const isIdle = selected === null;
          return (
            <button
              key={i}
              type="button"
              disabled={!isIdle || !item}
              onClick={() => setSelected(i)}
              aria-label={`${i + 1}번째 패 뒤집기`}
              className={`perspective-distant select-none transition-all duration-300 ${isIdle ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'} ${isPicked ? '-translate-y-1' : ''}`}
              style={{
                padding: 0,
                background: 'none',
                border: 'none',
                aspectRatio: '3 / 4.4',
                filter: !isIdle && !isPicked ? 'brightness(0.5)' : 'none',
                scale: !isIdle && !isPicked ? '0.96' : '1',
              }}
            >
              <div className={`hwatu-flip-card relative w-full h-full ${isPicked ? 'flipped' : ''}`}>
                <div
                  className="hwatu-card-side absolute inset-0 overflow-hidden transform-gpu"
                  style={{ borderRadius: '12px', backgroundColor: FACE_BG }}
                >
                  <HwatuBack />
                </div>

                <div
                  className="hwatu-card-side absolute inset-0 overflow-hidden transform-gpu"
                  style={{ borderRadius: '12px', backgroundColor: FACE_BG, border: `1px solid ${LINE}`, transform: 'rotateY(180deg)' }}
                >
                  {/* 뒷면과 같은 이중 테두리 — 안쪽 프레임 안에 썸네일 창 + 제목 */}
                  <div
                    className="absolute flex flex-col"
                    style={{ inset: '3px', borderRadius: '9px', border: `1px solid ${LINE}`, padding: '4px', gap: '5px', justifyContent: 'center', overflow: 'hidden' }}
                  >
                    <FaceBackdrop />
                    {item && (
                      <>
                        <div
                          className="relative flex items-center justify-center overflow-hidden"
                          style={{ aspectRatio: '4 / 3', flexShrink: 0, borderRadius: '8px', backgroundColor: FACE_BG }}
                        >
                          {item.imageSrc ? (
                            <img src={item.imageSrc} alt="" className="w-full h-full" style={{ objectFit: 'contain' }} />
                          ) : (
                            <span style={{ fontSize: '24px', lineHeight: 1 }}>{item.emoji}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="hwatu-result" style={{ marginTop: '16px' }}>
          <div className="flex" style={{ gap: '12px' }}>
            {picked.imageSrc && (
              <img
                src={picked.imageSrc}
                alt=""
                style={{ width: '96px', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
              />
            )}
            <div className="min-w-0">
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.2px', lineHeight: 1.35, marginBottom: '4px' }}>
                {picked.title}
              </p>
              <p
                style={{
                  fontSize: '12.5px',
                  color: '#66666C',
                  letterSpacing: '-0.1px',
                  lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {picked.description}
              </p>
            </div>
          </div>

          <div className="flex" style={{ gap: '8px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center transition-colors hover:bg-[#F4F4F5]"
              style={{
                flex: '0 0 38%',
                padding: '12px 0',
                borderRadius: '12px',
                border: '1px solid #D9D9DC',
                backgroundColor: 'transparent',
                color: '#444',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '-0.2px',
              }}
            >
              다시 뽑기
            </button>
            <Link
              href={picked.href}
              className="flex items-center justify-center transition-opacity active:opacity-80"
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: '12px',
                backgroundColor: MOAMOA_ORANGE,
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '-0.2px',
                textDecoration: 'none',
              }}
            >
              이 테스트 해보기
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
