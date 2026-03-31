'use client';

import { forwardRef } from 'react';
import type { CourtResult, SentenceGrade } from '@/types/court';
import { trackSajuGPTClick } from '@/lib/analytics';

interface Props {
  result: CourtResult;
  sentence: number;
  bounty: number;
  percentile: number;
  sentenceGrade: SentenceGrade;
  judgeComment: string;
}

const VerdictCard = forwardRef<HTMLDivElement, Props>(
  ({ result, sentence, bounty, percentile, sentenceGrade, judgeComment }, ref) => {
    const now = new Date();
    const caseNumber = `제${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}호`;

    return (
      <div
        ref={ref}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
          borderRadius: '20px',
          padding: '32px 24px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          border: 'none',
        }}
      >
        {/* 헤더 */}
        <div className="flex flex-col items-center" style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#999', letterSpacing: '0.5px', marginBottom: '4px' }}>
            ⚖️ 사주 판결문
          </p>
          <p style={{ fontSize: '11px', color: '#666' }}>{caseNumber}</p>
        </div>

        {/* 죄목 + 유죄 */}
        <div
          className="flex flex-col items-center"
          style={{
            padding: '20px',
            margin: '0 -8px 20px',
            borderRadius: '12px',
            backgroundColor: 'rgba(122, 56, 216, 0.15)',
            border: '1px solid rgba(122, 56, 216, 0.3)',
          }}
        >
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
            {result.crimeLabel}
          </p>
          <div style={{
            padding: '4px 20px',
            borderRadius: '6px',
            backgroundColor: '#9B59F0',
          }}>
            <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>유죄</p>
          </div>
        </div>

        {/* 형량 + 현상금 + 퍼센타일 */}
        <div className="flex flex-col gap-2" style={{ marginBottom: '16px' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#aaa' }}>형량</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: sentenceGrade.borderColor }}>
              징역 {sentence}년
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#aaa' }}>현상금</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFD700' }}>
              {bounty.toLocaleString()}만원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#aaa' }}>전체 피고인</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ccc' }}>
              상위 {percentile}%
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 -8px 16px', padding: '0 8px' }} />

        {/* 가중사유 */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>가중사유</p>
          <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.5' }}>
            {result.sajuHighlights.doHwaSal && '도화살 보유 '}
            {result.sajuHighlights.hongYeomSal && '홍염살 보유 '}
            {result.charmScore >= 4 ? '+ 높은 매력 방치' :
             result.charmScore >= 2 ? '+ 매력 방치' :
             '+ 감정 억압'}
          </p>
        </div>

        {/* 판사 코멘트 */}
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: '14px', color: '#ddd', lineHeight: '1.5', fontStyle: 'italic', textAlign: 'center' }}>
            &ldquo;{judgeComment}&rdquo;
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 -8px 20px', padding: '0 8px' }} />

        {/* 석방 예정일 — 대형 활자 */}
        <div
          className="flex flex-col items-center"
          style={{
            padding: '20px',
            borderRadius: '14px',
            backgroundColor: 'rgba(122, 56, 216, 0.2)',
            border: '1px solid rgba(122, 56, 216, 0.4)',
            marginBottom: '16px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px', letterSpacing: '1px' }}>석방 예정일</p>
          <p style={{ fontSize: '32px', fontWeight: 900, color: '#7A38D8', letterSpacing: '2px' }}>
            {result.releaseDate.year}년 {result.releaseDate.month}월
          </p>
        </div>

        {/* 석방 조건 */}
        <div
          className="flex flex-col items-center"
          style={{
            padding: '14px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            marginBottom: '16px',
          }}
        >
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>석방 조건</p>
          <p style={{ fontSize: '14px', color: '#eee', lineHeight: '1.5', textAlign: 'center', fontWeight: 600 }}>
            {result.releaseCondition}
          </p>
        </div>

        {/* 워터마크 */}
        <a
          href="https://www.sajugpt.co.kr/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSajuGPTClick('saju_court')}
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 700,
            color: '#7A38D8',
            textAlign: 'center',
            marginTop: '12px',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          sajugpt.co.kr
        </a>
      </div>
    );
  }
);

VerdictCard.displayName = 'VerdictCard';
export default VerdictCard;
