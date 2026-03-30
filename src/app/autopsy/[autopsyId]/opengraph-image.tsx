import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const alt = '사주 부검실 — 연애 사망진단서';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const GRADE_COLORS: Record<string, string> = {
  F: '#DC2626',
  D: '#EA580C',
  C: '#CA8A04',
  B: '#2563EB',
  A: '#7A38D8',
};

export default async function Image({ params }: { params: Promise<{ autopsyId: string }> }) {
  const { autopsyId } = await params;

  let causeLabel = '사망 원인 불명';
  let grade = 'F';
  let probability = 0;
  let coronerName = '검시관';
  let verdict = '';

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data } = await supabase
      .from('saju_autopsies')
      .select('cause_of_death_label, discernment_grade, regret_probability, coroner_id, card3_verdict')
      .eq('id', autopsyId)
      .single();

    if (data) {
      causeLabel = data.cause_of_death_label;
      grade = data.discernment_grade;
      probability = data.regret_probability;
      coronerName = data.coroner_id === 'yoon-taesan' ? '윤태산' : '서휘윤';
      verdict = data.card3_verdict?.slice(0, 60) ?? '';
    }
  } catch {
    // fallback to defaults
  }

  const gradeColor = GRADE_COLORS[grade] ?? '#DC2626';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFDF7',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', color: '#C4B896', fontWeight: 500, letterSpacing: '2px' }}>
              사주 부검실
            </span>
            <span style={{ fontSize: '32px', color: '#151515', fontWeight: 800, marginTop: '4px' }}>
              연애 사망진단서
            </span>
          </div>
          {/* 등급 도장 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: `4px solid ${gradeColor}`,
              transform: 'rotate(-12deg)',
              opacity: 0.8,
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: 900, color: gradeColor }}>
              {grade}
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ display: 'flex', height: '2px', background: 'linear-gradient(90deg, #E8E0D0, transparent)', marginBottom: '32px' }} />

        {/* 사망 원인 */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#FAF8FC',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', color: '#848484', fontWeight: 500, marginBottom: '8px' }}>사망 원인</span>
            <span style={{ fontSize: '42px', color: '#151515', fontWeight: 800 }}>{causeLabel}</span>
          </div>
        </div>

        {/* 수치 행 */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: '#f9f9f9',
              borderRadius: '16px',
              padding: '22px 28px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#848484', fontWeight: 500, marginBottom: '6px' }}>매력 감별</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, color: gradeColor }}>{grade}</span>
              <span style={{ fontSize: '20px', fontWeight: 600, color: gradeColor }}>등급</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: '#f9f9f9',
              borderRadius: '16px',
              padding: '22px 28px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#848484', fontWeight: 500, marginBottom: '6px' }}>후회 확률</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#7A38D8' }}>{probability}</span>
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#7A38D8' }}>%</span>
            </div>
          </div>
        </div>

        {/* 소견 + 검시관 */}
        <div style={{ display: 'flex', borderTop: '2px dashed #E8E0D0', paddingTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {verdict && (
              <span style={{ fontSize: '20px', color: '#525252', fontWeight: 500, fontStyle: 'italic', lineHeight: '30px', marginBottom: '8px' }}>
                &ldquo;{verdict}{verdict.length >= 60 ? '...' : ''}&rdquo;
              </span>
            )}
            <span style={{ fontSize: '18px', color: '#7A38D8', fontWeight: 700 }}>
              — {coronerName} 검시관
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
