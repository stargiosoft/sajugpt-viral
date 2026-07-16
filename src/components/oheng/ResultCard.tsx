'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import ScrollFrame from './ScrollFrame';
import ShareButtons from './ShareButtons';
import { AnimalIllustration } from './icons';
import type { OhengPrescription } from '@/types/oheng';

export default function ResultCard({ result, onRestart }: { result: OhengPrescription; onRestart: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#F3E7C9' });
      const link = document.createElement('a');
      link.download = `내오행처방전_${result.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // 저장 실패는 조용히 무시 (브라우저 권한 등)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', padding: '40px 20px 48px', backgroundColor: '#F3E7C9' }}>
      <div ref={cardRef} style={{ backgroundColor: '#F3E7C9', padding: '4px' }}>
        <p style={{ textAlign: 'center', fontSize: '15px', color: '#6B5B3A', marginBottom: '10px' }}>
          {result.name}에게 필요한 기운은..
        </p>

        <ScrollFrame>
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '999px',
                border: '1.5px solid #2B2013',
                fontSize: '13px',
                fontWeight: 700,
                color: '#2B2013',
                marginBottom: '14px',
              }}
            >
              {result.element}
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#2B2013', marginBottom: '18px' }}>
              {result.animal}
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '16px',
                  backgroundColor: '#EFE2C1',
                  border: '1.5px solid #2B2013',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AnimalIllustration animal={result.animal} size={150} />
              </div>
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#3B2E1A' }}>
              {result.narration}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <Chip label="부족한 기운" value={result.element} />
              <Chip label="필요한 음식" value={result.food} />
              <Chip label="행운의 컬러" value={result.color} />
            </div>
          </div>
        </ScrollFrame>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#8A5A2B', marginTop: '10px' }}>
          ↑ 꾹 눌러 이미지를 저장해 주세요 ↑
        </p>
      </div>

      <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          onClick={handleSaveImage}
          style={{
            width: '100%',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: '#2B2013',
            color: '#F3E7C9',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {saving ? '저장 중...' : '이미지 저장하기'}
        </button>
        <button
          type="button"
          onClick={onRestart}
          style={{
            width: '100%',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            color: '#2B2013',
            fontSize: '15px',
            fontWeight: 600,
            border: '1.5px solid #2B2013',
            cursor: 'pointer',
          }}
        >
          다시 해보기
        </button>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#2B2013', marginBottom: '14px' }}>결과 공유하기</p>
        <ShareButtons shareText={`나에게 필요한 기운은 ${result.element}, 수호동물은 ${result.animal}! 너도 확인해봐`} />
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#FBF3E1',
        border: '1px solid #D9C79E',
        borderRadius: '16px',
        padding: '8px 6px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '10.5px', color: '#8A5A2B', marginBottom: '3px' }}>{label}</p>
      <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#2B2013' }}>{value}</p>
    </div>
  );
}
