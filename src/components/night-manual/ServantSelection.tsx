'use client';

import { motion } from 'framer-motion';
import type { NightManualResult, ServantType } from '@/types/night-manual';
import { SERVANTS, getCompatibility } from '@/constants/night-manual';

interface Props {
  result: NightManualResult;
  onSelect: (servant: ServantType) => void;
}

const SERVANT_COLORS: Record<ServantType, string> = {
  beast: '#ff6b6b',
  poet: '#6bb5ff',
  butler: '#7ce08a',
};

const SERVANT_THUMBNAILS: Record<ServantType, string> = {
  beast: '/characters/yoon-taesan.webp',
  poet: '/characters/seo-hwiyoon.webp',
  butler: '/characters/choi-seolgye.webp',
};

export default function ServantSelection({ result, onSelect }: Props) {
  const servantTypes: ServantType[] = ['beast', 'poet', 'butler'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '40px 24px 40px', minHeight: '100dvh' }}
    >
      <div className="text-center" style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', color: '#8b7aaa', letterSpacing: '2px' }}>
          선택의 시간
        </p>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f0e6ff', marginTop: '8px' }}>
          오늘 밤, 누가 마마를 모시겠는가
        </h2>
        <p style={{ fontSize: '13px', color: '#6b6080', marginTop: '8px' }}>
          시종들이 마마의 선택을 기다립니다
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {servantTypes.map((type, i) => {
          const servant = SERVANTS[type];
          const compatibility = getCompatibility(result.stats, type);
          const color = SERVANT_COLORS[type];
          const proposal = result.phase3Proposals[type];
          // 제안의 마지막 문장만 추출
          const lastSentence = proposal.split(/[.!?]/).filter(Boolean).pop()?.trim() ?? proposal;

          return (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(type)}
              className="w-full text-left"
              style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: '#1e1a2e',
                border: `1px solid ${color}33`,
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <div className="flex items-center gap-2">
                  <div
                    className="overflow-hidden transform-gpu shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      border: `2px solid ${color}40`,
                    }}
                  >
                    <img
                      src={SERVANT_THUMBNAILS[type]}
                      alt={servant.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: 700, color }}>{servant.name}</span>
                  <span style={{ fontSize: '12px', color: '#6b6080' }}>{servant.label}</span>
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: compatibility.grade === 'S' ? '#FFD700' : compatibility.grade === 'A' ? '#7A38D8' : '#6b6080',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(122, 56, 216, 0.1)',
                  }}
                >
                  궁합 {compatibility.grade}
                </span>
              </div>

              <p style={{
                fontSize: '13px',
                color: '#9990ad',
                lineHeight: '1.6',
                wordBreak: 'keep-all',
                marginBottom: '8px',
              }}>
                "{lastSentence}"
              </p>

              <p style={{ fontSize: '11px', color: '#6b6080' }}>
                {compatibility.label}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
