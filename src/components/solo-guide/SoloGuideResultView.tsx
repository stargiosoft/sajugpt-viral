'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TestTopNav from '@/components/TestTopNav';
import LandingCTAButton from '@/components/LandingCTAButton';
import SoloResult from './SoloResult';
import { loadSoloGuideResult } from '@/lib/soloGuide';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import type { SoloGuideResult } from '@/types/solo-guide';

type Status = 'loading' | 'found' | 'notFound';

// [resultId]/page.tsx의 클라이언트 자식 — localStorage에만 존재하는 결과를 읽는다 (사용자별 결과 저장 테이블 없음).
// 다른 기기에서 열었거나 브라우저 데이터가 지워진 경우 결과를 찾을 수 없으므로 안내 후 /solo-guide로 유도한다.
export default function SoloGuideResultView({ resultId }: { resultId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<SoloGuideResult | null>(null);

  useEffect(() => {
    const loaded = loadSoloGuideResult(resultId);
    if (loaded) {
      setResult(loaded);
      setStatus('found');
    } else {
      setStatus('notFound');
    }
  }, [resultId]);

  const handleRestart = () => {
    router.push('/solo-guide');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.frameBg, display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-110 md:max-w-150"
        style={{ minHeight: '100vh', backgroundColor: C.frameBg, position: 'relative', fontFamily: 'Cafe24 Dongdong, sans-serif' }}
      >
        <TestTopNav bgColor={C.frameBg} logoColor={C.text} xColor={C.text} />

        {status === 'loading' && (
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: C.textSecondary }}>결과를 불러오는 중...</p>
          </div>
        )}

        {status === 'found' && result && (
          <SoloResult result={result} onRestart={handleRestart} />
        )}

        {status === 'notFound' && (
          <div style={{ padding: '120px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>결과를 찾을 수 없어요</p>
            <p style={{ fontSize: '14px', color: C.textSecondary, marginBottom: '28px', lineHeight: 1.6 }}>
              다른 기기에서 열었거나 브라우저 데이터가 지워졌을 수 있어요.
            </p>
            <div style={{ width: '100%', maxWidth: '240px' }}>
              <LandingCTAButton
                onClick={handleRestart}
                label="다시 시작하기"
                background={C.primary}
                color={C.textOnPrimary}
                hoverBackground={C.primaryHover}
                height="52px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
