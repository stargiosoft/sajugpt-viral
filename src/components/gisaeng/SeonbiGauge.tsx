'use client';

import { motion } from 'framer-motion';
import type { SeonbiState, SeonbiType } from '@/types/gisaeng';
import { SEONBI_INFO } from '@/constants/gisaeng';

interface Props {
  seonbi: Record<SeonbiType, SeonbiState>;
}

export default function SeonbiGauge({ seonbi }: Props) {
  const types: SeonbiType[] = ['kwonryeok', 'romantic', 'jealousy'];

  return (
    <div className="flex flex-col gap-3">
      {types.map(type => {
        const info = SEONBI_INFO[type];
        const state = seonbi[type];

        return (
          <div
            key={type}
            className="rounded-xl p-3"
            style={{
              backgroundColor: state.alive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              opacity: state.alive ? 1 : 0.4,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '16px' }}>{info.emoji}</span>
                <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                  {info.name}
                </span>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                  {info.title}
                </span>
              </div>
              {!state.alive && (
                <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>이탈</span>
              )}
            </div>

            {/* 충성도 */}
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ fontSize: '11px', width: '16px' }}>♥</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${state.loyalty}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: '#FF6B9D' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#FF6B9D', fontWeight: 600, width: '24px', textAlign: 'right' }}>
                {state.loyalty}
              </span>
            </div>

            {/* 의심도 */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '11px', width: '16px' }}>👁</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${state.suspicion}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: state.suspicion >= 70 ? '#EF4444' : '#F59E0B' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: state.suspicion >= 70 ? '#EF4444' : '#F59E0B', fontWeight: 600, width: '24px', textAlign: 'right' }}>
                {state.suspicion}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
