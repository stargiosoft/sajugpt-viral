'use client';

import { forwardRef } from 'react';
import type { CourtResult, SentenceGrade } from '@/types/court';

interface Props {
  result: CourtResult;
  sentence: number;
  bounty: number;
  percentile: number;
  sentenceGrade: SentenceGrade;
}

const IndictmentCard = forwardRef<HTMLDivElement, Props>(
  ({ result, sentence, bounty, percentile, sentenceGrade }, ref) => {
    const now = new Date();
    const caseNumber = `제${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}호`;

    return (
      <div
        ref={ref}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '32px 24px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          border: `2px solid ${sentenceGrade.borderColor}`,
        }}
      >
        {/* 헤더 */}
        <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', color: '#999', letterSpacing: '2px', marginBottom: '4px' }}>
            ⚖️ 사주 법정 기소장
          </p>
          <p style={{ fontSize: '11px', color: '#666' }}>{caseNumber}</p>
        </div>

        {/* 죄목 */}
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
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: '1.3' }}>
            {result.crimeLabel}
          </p>
        </div>

        {/* 형량 + 현상금 + 퍼센타일 */}
        <div className="flex flex-col gap-2" style={{ marginBottom: '20px' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#aaa' }}>⚖️ 형량</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: sentenceGrade.borderColor }}>
              징역 {sentence}년
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#aaa' }}>💰 현상금</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFD700' }}>
              {bounty.toLocaleString()}만원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#aaa' }}>📊 전체 피고인</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ccc' }}>
              상위 {percentile}%
            </span>
          </div>
        </div>

        {/* 사유 */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>📋 사유</p>
          <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.5' }}>
            {result.sajuHighlights.doHwaSal && '도화살 보유 '}
            {result.sajuHighlights.hongYeomSal && '홍염살 보유 '}
            {result.charmScore >= 4 ? '+ 높은 매력 방치' :
             result.charmScore >= 2 ? '+ 매력 방치' :
             '+ 감정 억압'}
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0 -8px', padding: '0 8px' }} />

        {/* 검사 vs 변호사 */}
        <div className="flex flex-col gap-3" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderLeft: '3px solid #FF4444' }}>
            <p style={{ fontSize: '11px', color: '#FF4444', fontWeight: 600, marginBottom: '4px' }}>🔴 검사 윤태산</p>
            <p style={{ fontSize: '14px', color: '#eee', lineHeight: '1.5', fontWeight: 500 }}>
              &ldquo;{result.prosecutorLine}&rdquo;
            </p>
          </div>
          <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(68, 136, 255, 0.1)', borderLeft: '3px solid #4488FF' }}>
            <p style={{ fontSize: '11px', color: '#4488FF', fontWeight: 600, marginBottom: '4px' }}>🔵 변호사 서휘윤</p>
            <p style={{ fontSize: '14px', color: '#eee', lineHeight: '1.5', fontWeight: 500 }}>
              &ldquo;{result.defenderLine}&rdquo;
            </p>
          </div>
        </div>

        {/* 석방 예정일 블러 */}
        <div
          className="flex flex-col items-center"
          style={{
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            marginBottom: '8px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>석방 예정일</p>
          <p style={{ fontSize: '24px', fontWeight: 800, color: '#7A38D8', filter: 'blur(8px)', userSelect: 'none' }}>
            {result.releaseDate.year}년 {result.releaseDate.month}월
          </p>
          <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>재판 참여 시 공개</p>
        </div>

        {/* 워터마크 */}
        <p style={{ fontSize: '11px', color: '#555', textAlign: 'center', marginTop: '16px' }}>
          nadaunse.com/court
        </p>
      </div>
    );
  }
);

IndictmentCard.displayName = 'IndictmentCard';
export default IndictmentCard;
