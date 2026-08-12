'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TestTopNav from '@/components/TestTopNav';
import LandingCTAButton from '@/components/LandingCTAButton';
import LoveSpotResult from './LoveSpotResult';
import { loadLoveSpotResult } from '@/lib/loveSpot'; 
import { LOVE_SPOT_COLORS as C } from '@/constants/loveSpotTheme';
import type { LoveSpotResult as LoveSpotResultData } from '@/types/love-spot'; 

type Status = 'loading' | 'found' | 'notFound';

export default function LoveSpotResultView({ resultId }: { resultId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<LoveSpotResultData | null>(null);

  useEffect(() => {
    const loaded = loadLoveSpotResult(resultId);
    if (loaded) {
      setResult(loaded);
      setStatus('found');
    } else {
      setStatus('notFound');
    }
  }, [resultId]);

  const handleRestart = () => {
    router.push('/love-spot');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: C.frameBg,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        className="w-full max-w-110 md:max-w-150"
        style={{
          minHeight: '100vh',
          backgroundColor: C.frameBg,
          position: 'relative',
          fontFamily: 'var(--font-do-hyeon), "Do Hyeon", sans-serif',
          backgroundImage: 'url(/love-spot/heart-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <TestTopNav bgColor="transparent" logoColor={C.text} xColor={C.text} />

        {status === 'loading' && (
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: C.textSecondary, fontWeight: 400 }}>
              결과를 불러오는 중...
            </p>
          </div>
        )}

        {status === 'found' && result && (
          <LoveSpotResult result={result} onRestart={handleRestart} />
        )}

        {status === 'notFound' && (
          <div
            style={{
              padding: '120px 20px 80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
            <p
              style={{
                fontSize: '20px',
                color: C.text,
                marginBottom: '8px',
              }}
            >
              결과를 찾을 수 없어요
            </p>
            <p
              style={{
                fontSize: '15px',
                color: C.textSecondary,
                marginBottom: '28px',
                lineHeight: 1.5,
              }}
            >
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