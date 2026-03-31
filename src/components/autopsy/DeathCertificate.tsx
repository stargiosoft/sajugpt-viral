'use client';

import { forwardRef } from 'react';
import type { AutopsyResult } from '@/types/autopsy';
import { CAUSES_OF_DEATH, DISCERNMENT_GRADES, CORONERS } from '@/constants/autopsy';
import { trackSajuGPTClick } from '@/lib/analytics';

interface Props {
  result: AutopsyResult;
}

const DeathCertificate = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const {
    causeOfDeath,
    causeOfDeathLabel,
    discernmentGrade,
    regretProbability,
    prognosis,
    card3Verdict,
    coronerId,
  } = result;

  const causeInfo = CAUSES_OF_DEATH[causeOfDeath];
  const gradeInfo = DISCERNMENT_GRADES[discernmentGrade];
  const coroner = CORONERS.find(c => c.id === coronerId)!;

  const certNumber = `제${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}호`;

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: '360px',
        minHeight: '600px',
        backgroundColor: '#FFFDF7',
        borderRadius: '16px',
        border: '2px solid #D4C5A0',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 워터마크 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-20deg)',
        fontSize: '120px',
        opacity: 0.04,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        🔬
      </div>

      {/* 헤더 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '28px', marginBottom: '4px' }}>🔬</span>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#A89B80', letterSpacing: '2px' }}>
          사주 부검실
        </p>
        <p style={{ fontSize: '18px', fontWeight: 800, color: '#333', marginTop: '4px' }}>
          연애 사망진단서
        </p>
        <p style={{ fontSize: '11px', color: '#A89B80', marginTop: '2px' }}>
          {certNumber}
        </p>
      </div>

      {/* 구분선 */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #D4C5A0, transparent)', marginBottom: '16px' }} />

      {/* 사망 원인 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '36px', marginBottom: '6px' }}>{causeInfo.emoji}</span>
        <p style={{ fontSize: '11px', color: '#999', fontWeight: 500 }}>사망 원인</p>
        <p style={{ fontSize: '22px', fontWeight: 800, color: '#333', marginTop: '2px' }}>
          {causeOfDeathLabel}
        </p>
      </div>

      {/* 등급 도장 */}
      <div className="flex justify-center" style={{ marginBottom: '16px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: `3px solid ${gradeInfo.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-8deg)',
        }}>
          <span style={{
            fontSize: '32px',
            fontWeight: 900,
            color: gradeInfo.color,
            fontFamily: 'serif',
          }}>
            {discernmentGrade}
          </span>
        </div>
      </div>

      {/* 수치 정보 */}
      <div className="flex flex-col gap-2" style={{ marginBottom: '16px' }}>
        <div className="flex justify-between items-center" style={{ padding: '8px 12px', backgroundColor: 'rgba(122,56,216,0.04)', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>매력 감별 능력</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: gradeInfo.color }}>
            {discernmentGrade}등급 — {gradeInfo.label}
          </span>
        </div>
        <div className="flex justify-between items-center" style={{ padding: '8px 12px', backgroundColor: 'rgba(122,56,216,0.04)', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>후회 확률</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#7A38D8' }}>
            {regretProbability}%
          </span>
        </div>
        <div className="flex justify-between items-center" style={{ padding: '8px 12px', backgroundColor: 'rgba(122,56,216,0.04)', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>다음 연애 예후</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>
            {prognosis}
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div style={{ height: '1px', backgroundColor: '#E8E0D0', marginBottom: '12px' }} />

      {/* 검시관 소견 */}
      <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
        <p style={{ fontSize: '11px', color: '#A89B80', fontWeight: 600, marginBottom: '6px' }}>
          검시관 소견
        </p>
        <p style={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#444',
          lineHeight: '1.6',
          fontStyle: 'italic',
        }}>
          &ldquo;{card3Verdict}&rdquo;
        </p>
        <p style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#7A38D8',
          marginTop: '8px',
          textAlign: 'right',
        }}>
          — {coroner.name} {coroner.emoji}
        </p>
      </div>

      {/* 하단 워터마크 */}
      <a
        href="https://sajugpt.co.kr"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSajuGPTClick('saju_autopsy')}
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#7A38D8',
          textAlign: 'center',
          marginTop: '12px',
          letterSpacing: '0.3px',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          display: 'block',
        }}
      >
        sajugpt.co.kr
      </a>
    </div>
  );
});

DeathCertificate.displayName = 'DeathCertificate';
export default DeathCertificate;
