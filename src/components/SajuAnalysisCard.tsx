'use client';

import { motion } from 'framer-motion';
import type { BattleResult } from '@/types/battle';

interface Props {
  result: BattleResult;
}

export default function SajuAnalysisCard({ result }: Props) {
  const { verdict, sajuHighlights } = result;

  const tags: string[] = [];
  if (sajuHighlights.doHwaSal) tags.push('도화살 보유');
  if (sajuHighlights.hongYeomSal) tags.push('홍염살 보유');
  if (sajuHighlights.topSipsung) tags.push(`${sajuHighlights.topSipsung} 발달`);
  if (sajuHighlights.fireRatio >= 30) tags.push('화기 과다');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]"
      style={{
        borderRadius: '24px',
        backgroundColor: '#161616',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '20px',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center" style={{ marginBottom: '14px' }}>
        <h3 style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '15px',
          fontWeight: 700,
          lineHeight: '20px',
          letterSpacing: '-0.45px',
          color: '#ffffff',
          paddingLeft: '2px',
        }}>
          사주가 말하는 당신의 페로몬
        </h3>
      </div>

      {/* 사주 태그 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: '6px', marginBottom: '14px', paddingLeft: '2px' }}>
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '-0.24px',
                color: '#FF6B5E',
                backgroundColor: 'rgba(255,68,56,0.08)',
                borderRadius: '8px',
                padding: '4px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* AI 판정문 전체 */}
      <p style={{
        fontFamily: 'Pretendard Variable, sans-serif',
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '26px',
        letterSpacing: '-0.3px',
        color: 'rgba(255,255,255,0.85)',
        paddingLeft: '2px',
      }}>
        {verdict}
      </p>
    </motion.div>
  );
}
