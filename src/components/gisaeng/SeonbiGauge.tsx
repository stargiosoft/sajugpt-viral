'use client';

import { motion } from 'framer-motion';
import type { SeonbiState, SeonbiType } from '@/types/gisaeng';
import { SEONBI_INFO } from '@/constants/gisaeng';

const C = {
  ink: '#1A1715',
  inkSoft: '#3D3530',
  inkMuted: '#6B5F56',
  inkFaint: '#A69A8E',
  vermillion: '#B8423A',
  gold: '#C9A96E',
  border: '#DDD5C8',
};

// 선비별 한자 + 악센트 컬러
const SEONBI_ACCENT: Record<SeonbiType, { hanja: string; color: string }> = {
  kwonryeok: { hanja: '權', color: '#C9A96E' },
  romantic:  { hanja: '情', color: '#B8423A' },
  jealousy:  { hanja: '怒', color: '#3D3530' },
};

interface Props {
  seonbi: Record<SeonbiType, SeonbiState>;
}

export default function SeonbiGauge({ seonbi }: Props) {
  const types: SeonbiType[] = ['kwonryeok', 'romantic', 'jealousy'];

  return (
    <div className="flex flex-col gap-3" style={{ marginBottom: '8px' }}>
      {types.map(type => {
        const info = SEONBI_INFO[type];
        const state = seonbi[type];
        const accent = SEONBI_ACCENT[type];

        return (
          <div
            key={type}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${C.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              opacity: state.alive ? 1 : 0.35,
            }}
          >
            {/* 헤더 — 한자 도장 + 이름 + 상태 */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '12px 14px',
                borderBottom: `1px solid ${C.border}`,
                backgroundColor: '#FDFCFA',
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={info.thumbnail}
                  alt={info.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${accent.color}`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p style={{ fontSize: '14px', color: C.ink, fontWeight: 700, letterSpacing: '-0.28px' }}>
                    {info.name}
                  </p>
                  <p style={{ fontSize: '11px', color: C.inkFaint, letterSpacing: '-0.22px' }}>
                    {info.title}
                  </p>
                </div>
              </div>
              {!state.alive && (
                <span
                  className="px-2 py-0.5 rounded"
                  style={{ fontSize: '11px', color: C.vermillion, fontWeight: 700, backgroundColor: `${C.vermillion}12` }}
                >
                  이탈
                </span>
              )}
            </div>

            {/* 게이지 바 */}
            <div style={{ padding: '12px 14px' }}>
              {/* 충성도 */}
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '11px', color: C.inkMuted, fontWeight: 600, width: '28px', flexShrink: 0 }}>충성</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0EBE4' }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${state.loyalty}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(90deg, ${C.vermillion}, #D4685F)` }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: C.vermillion, fontWeight: 700, width: '26px', textAlign: 'right' }}>
                  {state.loyalty}
                </span>
              </div>

              {/* 의심도 */}
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '11px', color: C.inkMuted, fontWeight: 600, width: '28px', flexShrink: 0 }}>의심</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0EBE4' }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${state.suspicion}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ backgroundColor: state.suspicion >= 70 ? C.vermillion : C.gold }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: state.suspicion >= 70 ? C.vermillion : C.gold, fontWeight: 700, width: '26px', textAlign: 'right' }}>
                  {state.suspicion}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
