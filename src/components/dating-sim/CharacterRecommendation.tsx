'use client';

import { motion } from 'framer-motion';
import type { CharacterRecommendation } from '@/types/dating';

interface Props {
  recommendations: CharacterRecommendation[];
  onSelect: (characterId: string) => void;
  submitting: boolean;
}

export default function CharacterRecommendation_({ recommendations, onSelect, submitting }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8"
    >
      <h2
        className="mb-2"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '-0.4px',
          color: '#1a1a1a',
        }}
      >
        당신과 궁합이 좋은 3명
      </h2>
      <p
        className="mb-6"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#848484',
        }}
      >
        데이트할 캐릭터를 선택하세요
      </p>

      <div className="flex flex-col gap-4">
        {recommendations.map((rec, i) => (
          <motion.button
            key={rec.characterId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => !submitting && onSelect(rec.characterId)}
            disabled={submitting}
            className="w-full rounded-2xl p-5 text-left active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(122, 56, 216, 0.08)',
              transition: 'transform 0.1s',
            }}
          >
            <div className="flex items-center gap-4">
              {/* 캐릭터 아바타 */}
              <div
                className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                style={{ backgroundColor: '#EDE5F7' }}
              >
                <img
                  src={rec.imagePath}
                  alt={rec.characterName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* 이름 + 아키타입 */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1a1a1a',
                    }}
                  >
                    {rec.characterName}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#848484',
                    }}
                  >
                    {rec.archetype}
                  </span>
                </div>

                {/* 궁합 + 성공률 */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#7A38D8',
                    }}
                  >
                    궁합 {rec.compatibility}%
                  </span>
                  <span
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#b0b0b0',
                    }}
                  >
                    성공률 {rec.successRate}%
                  </span>
                </div>

                {/* 첫인상 대사 */}
                <p
                  className="truncate"
                  style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    color: '#6d6d6d',
                  }}
                >
                  &ldquo;{rec.firstImpression}&rdquo;
                </p>
              </div>

              {/* 화살표 */}
              <div
                className="flex-shrink-0"
                style={{ color: '#b0b0b0', fontSize: '18px' }}
              >
                &rsaquo;
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
