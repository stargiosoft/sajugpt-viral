'use client';

import { motion } from 'framer-motion';
import type { CharacterRecommendation } from '@/types/dating';

interface Props {
  recommendations: CharacterRecommendation[];
  onSelect: (characterId: string) => void;
  submitting: boolean;
}

const RANK_LABELS = ['최고 궁합', '좋은 궁합', '도전적 궁합'];

export default function CharacterRecommendation_({ recommendations, onSelect, submitting }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col"
      style={{
        minHeight: '100dvh',
        padding: '48px 20px 40px',
        background: 'linear-gradient(180deg, #0f0a1a 0%, #1a1038 40%, #251545 70%, #1a1038 100%)',
      }}
    >
      {/* 헤더 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#A99BC4', letterSpacing: '3px', marginBottom: '8px' }}>
          MATCH RESULT
        </p>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
          당신과 궁합이 좋은 3명
        </h2>
        <p style={{ fontSize: '14px', color: '#8B7BA8' }}>
          데이트할 상대를 선택하세요
        </p>
      </div>

      {/* 캐릭터 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {recommendations.map((rec, i) => (
          <motion.button
            key={rec.characterId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => !submitting && onSelect(rec.characterId)}
            disabled={submitting}
            className="w-full text-left cursor-pointer active:scale-[0.98] disabled:opacity-50"
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1.5px solid rgba(122, 56, 216, 0.35)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.15s',
            }}
          >
            {/* 상단: 아바타 + 이름/아키타입 + 화살표 */}
            <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
              <div
                className="shrink-0 rounded-full overflow-hidden transform-gpu"
                style={{
                  width: '52px',
                  height: '52px',
                  border: '2px solid rgba(122, 56, 216, 0.4)',
                }}
              >
                <img
                  src={rec.imagePath}
                  alt={rec.characterName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>
                    {rec.characterName}
                  </span>
                  <span style={{ fontSize: '12px', color: '#8B7BA8' }}>
                    {rec.archetype}
                  </span>
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#fff',
                    background: i === 0
                      ? 'linear-gradient(135deg, #7A38D8, #A855F7)'
                      : i === 1
                        ? 'rgba(122, 56, 216, 0.4)'
                        : 'rgba(75, 61, 100, 0.6)',
                  }}
                >
                  {RANK_LABELS[i] ?? RANK_LABELS[2]}
                </span>
              </div>

              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(122, 56, 216, 0.15)',
                  color: '#A855F7',
                  fontSize: '14px',
                }}
              >
                ›
              </div>
            </div>

            {/* 궁합 바 + 성공률 */}
            <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#A99BC4', whiteSpace: 'nowrap' }}>
                궁합
              </span>
              <div
                className="flex-1"
                style={{ height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  style={{
                    width: `${rec.compatibility}%`,
                    height: '100%',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg, #7A38D8, #A855F7)',
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#A855F7', minWidth: '36px', textAlign: 'right' }}>
                {rec.compatibility}%
              </span>
              <span style={{ fontSize: '11px', color: '#6B5C85', whiteSpace: 'nowrap', marginLeft: '4px' }}>
                성공률 {rec.successRate}%
              </span>
            </div>

            {/* 첫인상 대사 */}
            <p
              className="truncate"
              style={{ fontSize: '13px', lineHeight: '18px', color: '#9B8FB8', fontStyle: 'italic' }}
            >
              &ldquo;{rec.firstImpression}&rdquo;
            </p>
          </motion.button>
        ))}
      </div>

      {/* 하단 안내 */}
      <p className="text-center" style={{ marginTop: '20px', fontSize: '12px', color: '#6B5C85' }}>
        궁합이 낮을수록 데이트 난이도가 올라갑니다
      </p>
    </motion.div>
  );
}
