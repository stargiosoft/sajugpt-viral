'use client';

import { motion } from 'framer-motion';
import type { CharacterRecommendation } from '@/types/dating';

interface Props {
  recommendations: CharacterRecommendation[];
  onSelect: (characterId: string) => void;
  submitting: boolean;
}

const RANK_LABELS = ['최고 궁합', '좋은 궁합', '도전적 궁합'];
const RANK_BADGE_BG = ['transparent', 'transparent', 'transparent'];
const RANK_BADGE_COLOR = ['#FF4D8D', '#FF4D8D', '#767676'];
const RANK_BADGE_BORDER = ['1px solid #FF4D8D', '1px solid rgba(255, 77, 141, 0.4)', '1px solid #D4D4D4'];
const PERCENT_COLOR = ['#FF4D8D', '#FF4D8D', '#767676'];

export default function CharacterRecommendation_({ recommendations, onSelect, submitting }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col"
      style={{ minHeight: '100dvh', padding: '48px 12px 40px', backgroundColor: '#ffffff' }}
    >
      {/* 헤더 */}
      <div className="flex flex-col items-start" style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '28px',
          fontWeight: 800,
          color: '#151515',
          marginBottom: '8px',
          textAlign: 'left',
          letterSpacing: '-0.56px',
        }}>
          당신과 궁합이 좋은 3명
        </h2>
        <p style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '15px',
          color: '#666',
          fontWeight: 500,
          textAlign: 'left',
          lineHeight: '1.6',
          letterSpacing: '-0.45px',
          paddingLeft: '1px',
        }}>
          카드를 눌러 데이트할 상대를 선택하세요
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
            className="group relative w-full text-left cursor-pointer bg-white border border-[#F2F2F2] hover:bg-[#ffedf3] hover:border-[#FFA9C7] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-[#F2F2F2] transform-gpu transition-colors duration-150"
            style={{
              paddingTop: '24px',
              paddingBottom: '24px',
              paddingLeft: '28px',
              paddingRight: '32px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
              isolation: 'isolate',
            }}
          >
            <span
              aria-hidden
              className="inline-flex items-center justify-center shrink-0"
              style={{
                position: 'absolute',
                top: '50%',
                right: '22px',
                transform: 'translateY(-50%)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)' }}>
                <path
                  fill="#b0b0b0"
                  d="m 15.970695,3.001955 a 1.0000999,1.0000999 0 0 0 -0.6875,0.30274 l -7.9902299,7.98828 a 1.0000999,1.0000999 0 0 0 0,1.41406 l 7.9902299,7.98828 a 1.0000999,1.0000999 0 1 0 1.41407,-1.41406 l -7.2832099,-7.28125 7.2832099,-7.28125 a 1.0000999,1.0000999 0 0 0 -0.72657,-1.7168 z"
                />
              </svg>
            </span>

            {/* 아바타 + 텍스트 열 (이름 → 버블 → 뱃지/%/성공률) */}
            <div className="flex items-start gap-3" style={{ paddingRight: '26px' }}>
              <div
                className="shrink-0 rounded-full overflow-hidden"
                style={{ width: '42px', height: '42px' }}
              >
                <img
                  src={rec.imagePath}
                  alt={rec.characterName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#151515', paddingLeft: '2px' }}>
                    {rec.characterName}
                  </span>
                  <span className="truncate" style={{ fontSize: '12px', fontWeight: 600, color: '#848484', position: 'relative', top: '-0.5px' }}>
                    {rec.archetype}
                  </span>
                </div>

                <div
                  className="bg-[#F5F5F5] group-hover:bg-white transition-colors duration-150"
                  style={{
                    marginTop: '6px',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    width: 'fit-content',
                    maxWidth: '100%',
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', color: '#444444', wordBreak: 'keep-all' }}>
                    {rec.firstImpression}
                  </p>
                </div>

                <div className="flex items-baseline" style={{ marginTop: '20px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 'fit-content',
                      paddingTop: '4px',
                      paddingBottom: '3px',
                      paddingLeft: '7px',
                      paddingRight: '6px',
                      borderRadius: '9px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: RANK_BADGE_COLOR[i] ?? RANK_BADGE_COLOR[2],
                      backgroundColor: RANK_BADGE_BG[i] ?? RANK_BADGE_BG[2],
                      border: RANK_BADGE_BORDER[i] ?? RANK_BADGE_BORDER[2],
                      position: 'relative',
                      top: '2px',
                    }}
                  >
                    {RANK_LABELS[i] ?? RANK_LABELS[2]}
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: PERCENT_COLOR[i] ?? PERCENT_COLOR[2], letterSpacing: '-0.4px', position: 'relative', top: '4px', paddingTop: '2px', marginLeft: '8px' }}>
                    {rec.compatibility}%
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#848484', whiteSpace: 'nowrap', position: 'relative', top: '2px', marginLeft: '5px', paddingTop: '1px' }}>
                    성공률 {rec.successRate}%
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 하단 안내 */}
      <p className="text-center" style={{ marginTop: '32px', fontSize: '13px', fontWeight: 500, color: '#999999' }}>
        궁합이 낮을수록 데이트 난이도가 올라갑니다
      </p>
    </motion.div>
  );
}
