'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CREW_MEMBERS, CREW_ORDER } from '@/constants/stock';

interface Props {
  onStart: () => void;
}

// ─── 틱커 종목 데이터 ────────────────────────────────
const TICKER_ITEMS = [
  { name: '도화살관련', price: 18200, change: +4.3 },
  { name: '정관안정', price: 9800, change: -1.2 },
  { name: '편인과다', price: 1200, change: -12.8 },
  { name: '식신성장', price: 14500, change: +2.7 },
  { name: '편관테마', price: 6300, change: +0.8 },
  { name: '홍염살', price: 22100, change: +6.1 },
  { name: '공망주의', price: 450, change: -18.3 },
  { name: '비견균형', price: 11700, change: +1.4 },
];

// ─── 틱커 테이프 ─────────────────────────────────────
function TickerTape() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // 2배로 복제해서 무한 루프 효과

  return (
    <div className="overflow-hidden" style={{
      borderBottom: '1px solid #1a1a2e',
      height: '32px',
    }}>
      <motion.div
        className="flex items-center gap-6"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ height: '32px', whiteSpace: 'nowrap' }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#666',
              letterSpacing: '-0.22px',
            }}>
              {item.name}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
              color: item.change > 0 ? '#ef4444' : '#3b82f6',
              letterSpacing: '0px',
            }}>
              {item.price.toLocaleString()}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
              color: item.change > 0 ? '#ef4444' : '#3b82f6',
            }}>
              {item.change > 0 ? '▲' : '▼'}{Math.abs(item.change)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── 블러 가격 카운터 ─────────────────────────────────
function BlurredPriceCounter() {
  const [scrambledPrice, setScrambledPrice] = useState('???,???');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const digits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      setScrambledPrice(`${digits[0]}${digits[1]},${digits[2]}${digits[3]}${digits[4]}`);
    }, 80);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex items-baseline gap-1">
      <span style={{
        fontSize: '52px',
        fontWeight: 800,
        fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
        color: '#fff',
        letterSpacing: '-2px',
        lineHeight: '56px',
        filter: 'blur(6px)',
        userSelect: 'none',
      }}>
        {scrambledPrice}
      </span>
      <span style={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#555',
        letterSpacing: '-0.4px',
      }}>
        원
      </span>
    </div>
  );
}

// ─── 깜빡이는 인디케이터 ──────────────────────────────
function BlinkingDot({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────

const sectionEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

export default function StockLanding({ onStart }: Props) {
  return (
    <div className="flex flex-col" style={{
      minHeight: '100dvh',
      backgroundColor: '#0a0a14',
    }}>
      {/* ─── 틱커 테이프 ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <TickerTape />
      </motion.div>

      {/* ─── 메인 콘텐츠 ─── */}
      <div className="flex-1 flex flex-col" style={{
        padding: '0 20px',
        paddingBottom: '120px',
      }}>

        {/* 상단 여백 */}
        <div style={{ height: '40px' }} />

        {/* ─── 시스템 상태 바 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: sectionEase }}
          className="flex items-center gap-2"
          style={{ marginBottom: '28px' }}
        >
          <BlinkingDot color="#ef4444" />
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
            color: '#ef4444',
            letterSpacing: '0.5px',
          }}>
            LIVE
          </span>
          <div style={{ width: '1px', height: '10px', backgroundColor: '#2a2a3e' }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 400,
            color: '#555',
            letterSpacing: '-0.22px',
          }}>
            사주증권 리서치센터
          </span>
        </motion.div>

        {/* ─── 헤드라인 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: sectionEase }}
          style={{ marginBottom: '12px' }}
        >
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#f0f0f0',
            lineHeight: '40px',
            letterSpacing: '-0.56px',
          }}>
            당신의 연애 주가가<br />
            <span style={{ color: '#ef4444' }}>폭락</span>하고 있습니다
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: sectionEase }}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#777',
            lineHeight: '22px',
            letterSpacing: '-0.42px',
            marginBottom: '36px',
          }}
        >
          사주 원국을 분석해 연애 시세를 조회합니다.<br />
          조작단이 주가 상승 작전을 짜드립니다.
        </motion.p>

        {/* ─── 종목 리포트 미리보기 (블러) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: sectionEase }}
          className="relative transform-gpu"
          style={{
            borderRadius: '16px',
            border: '1px solid #1e1e30',
            backgroundColor: '#0f0f1e',
            padding: '24px 20px',
            marginBottom: '32px',
            overflow: 'hidden',
          }}
        >
          {/* 배경 그리드 패턴 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(122,56,216,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(122,56,216,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />

          <div className="relative">
            {/* 헤더 */}
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <div className="flex items-center gap-2">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: '#7A38D8',
                }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#666',
                  letterSpacing: '-0.24px',
                }}>
                  종목 리포트
                </span>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 500,
                fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
                color: '#444',
              }}>
                섹터: ???
              </span>
            </div>

            {/* 현재가 (블러) */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 400,
                color: '#555',
                letterSpacing: '-0.22px',
              }}>
                당신의 현재가
              </span>
              <BlurredPriceCounter />
            </div>

            {/* 적정가 + 저평가율 */}
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <div className="flex items-center gap-1">
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#555' }}>적정가</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
                  color: '#888',
                  filter: 'blur(4px)',
                  userSelect: 'none',
                }}>
                  ??,???원
                </span>
              </div>
              <div style={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
                  color: '#ef4444',
                }}>
                  ▼??% 저평가
                </span>
              </div>
            </div>

            {/* 미니 차트 (SVG, 정적 패턴) */}
            <div style={{ marginBottom: '16px' }}>
              <svg width="100%" height="48" viewBox="0 0 300 48" preserveAspectRatio="none" style={{ opacity: 0.4 }}>
                <defs>
                  <linearGradient id="chartGradLanding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7A38D8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7A38D8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,30 C30,28 50,32 80,26 C110,20 130,35 160,38 C190,41 210,24 240,18 C260,14 280,8 300,4"
                  fill="none"
                  stroke="#7A38D8"
                  strokeWidth="1.5"
                />
                <path
                  d="M0,30 C30,28 50,32 80,26 C110,20 130,35 160,38 C190,41 210,24 240,18 C260,14 280,8 300,4 L300,48 L0,48 Z"
                  fill="url(#chartGradLanding)"
                />
              </svg>
            </div>

            {/* 투자의견 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#555',
                }}>
                  투자의견
                </span>
                <div style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(122, 56, 216, 0.15)',
                  filter: 'blur(3px)',
                  userSelect: 'none',
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#7A38D8',
                  }}>
                    ??? ???
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 400,
                color: '#444',
              }}>
                생년월일 입력 시 공개
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── 경고 배너 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: sectionEase }}
          className="flex items-center gap-3 transform-gpu"
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            padding: '14px 16px',
            marginBottom: '32px',
          }}
        >
          <BlinkingDot color="#ef4444" />
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#ef4444',
            lineHeight: '18px',
            letterSpacing: '-0.26px',
          }}>
            관리종목 지정 위험 — 시세 조회가 필요합니다
          </span>
        </motion.div>

        {/* ─── 조작단원 소개 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6, ease: sectionEase }}
          style={{ marginBottom: '24px' }}
        >
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#555',
            letterSpacing: '-0.24px',
          }}>
            주가 조작단 대기 중
          </span>
        </motion.div>

        <div className="flex flex-col gap-3">
          {CREW_ORDER.map((id, index) => {
            const crew = CREW_MEMBERS[id];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.12, duration: 0.5, ease: sectionEase }}
                className="flex items-center gap-3 transform-gpu"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #1e1e30',
                  backgroundColor: '#0f0f1e',
                  padding: '14px 16px',
                }}
              >
                {/* 왼쪽 컬러 바 */}
                <div style={{
                  width: '3px',
                  height: '32px',
                  borderRadius: '2px',
                  backgroundColor: crew.color,
                  flexShrink: 0,
                }} />

                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#e0e0e0',
                      letterSpacing: '-0.28px',
                    }}>
                      {crew.name}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      color: crew.color,
                      letterSpacing: '-0.22px',
                    }}>
                      {crew.faction}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#666',
                    letterSpacing: '-0.24px',
                    lineHeight: '16px',
                  }}>
                    &ldquo;{crew.philosophy}&rdquo;
                  </p>
                </div>

                {/* 상태 표시 */}
                <div className="flex items-center gap-1 shrink-0">
                  <BlinkingDot color={crew.color} />
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
                    color: '#555',
                  }}>
                    대기
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── 하단 CTA ─── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '440px',
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(transparent, #0a0a14 30%)',
        pointerEvents: 'auto',
      }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.5, ease: sectionEase }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: '#7A38D8',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.32px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(122, 56, 216, 0.35)',
          }}
        >
          내 시세 조회하기
        </motion.button>
      </div>
    </div>
  );
}
