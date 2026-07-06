'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';

interface Props {
  onStart: () => void;
}

const SHARE_TEXT = '🔥 색기 배틀 — 당신의 사주에 발정 난 남자는 몇 명?\n얼굴 가리고, 사주만으로 AI 짐승남을 홀려보세요';

/** 지정된 지연 후 0에서 목표값까지 이징을 태워 올라가는 카운트업 — 지연은 부모 motion 진입 애니메이션과 맞춰 등장과 동시에 체감되게 함 */
function useCountUp(target: number, duration = 1600, delay = 400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    let cancelled = false;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}

/** 카운트업 렌더링을 별도 컴포넌트로 분리 — 매 프레임 setState가 부모(전체 랜딩) 리렌더로 번지면
 *  같은 시점에 도는 말풍선 float 애니메이션이 끊겨 보이므로, 재렌더 범위를 숫자 자신으로만 격리 */
function CountUpNumber({ target, duration, delay }: { target: number; duration?: number; delay?: number }) {
  const value = useCountUp(target, duration, delay);
  return <>{value.toLocaleString()}</>;
}

export default function OnboardingLanding({ onStart }: Props) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);


  const handleCopy = useCallback(async () => {
    const origin = window.location.origin;
    const ok = await copyToClipboard(`${SHARE_TEXT}\n👉 ${origin}/sexy-battle`);
    if (ok) {
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('sexy_battle_share_test_clipboard');
      trackShare('sexy_battle', 'clipboard');
    }
  }, []);

  const handleKakaoShare = useCallback(() => {
    const origin = window.location.origin;
    const ok = shareKakao({
      title: '색기 배틀 — 페로몬 등급 판정',
      description: '얼굴 가리고, 사주만으로 AI 짐승남을 홀려보세요',
      imageUrl: `${origin}/home/thumbnails/sexy-battle.jpg`,
      link: `${origin}/sexy-battle`,
      buttonText: '나도 해보기',
    });
    if (ok) {
      trackEvent('sexy_battle_share_test_kakao');
      trackShare('sexy_battle', 'kakao');
    } else {
      handleCopy();
    }
  }, [handleCopy]);

  const handleXShare = useCallback(() => {
    const origin = window.location.origin;
    const text = encodeURIComponent(SHARE_TEXT);
    const url = encodeURIComponent(`${origin}/sexy-battle`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    trackEvent('sexy_battle_share_test_x');
    trackShare('sexy_battle', 'x');
  }, []);

  return (
    <div className="flex flex-col items-center" style={{ minHeight: '100%', backgroundColor: '#0d0d0d' }}>
      {/* ── 상단 썸네일 (영상) ── */}
      <motion.video
        src="/home/thumbnails/sexy-battle.mp4"
        poster="/home/thumbnails/sexy-battle.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full"
        style={{ aspectRatio: '3 / 2', objectFit: 'cover', display: 'block' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* ── 말풍선 서브카피 ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ position: 'relative', marginTop: '48px' }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '14px',
            height: '14px',
            backgroundColor: '#1E1E22',
            borderRadius: '3px',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-block',
            backgroundColor: '#1E1E22',
            borderRadius: '18px',
            padding: '14px 20px 15.5px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          <p style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
            사주로 짐승남 홀리기
          </p>
        </div>
      </motion.div>

      {/* ── 시작하기 버튼 — 배경만 스케일 애니메이션, 텍스트는 별도 레이어라 위치 고정 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '28px 20px 0' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div style={{ position: 'relative', height: '60px' }}>
          <motion.div
            onClick={onStart}
            className="transform-gpu"
            whileHover={{ filter: 'brightness(1.08)' }}
            whileTap={{ filter: 'brightness(0.92)', scale: 0.995 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #FF4438 0%, #E0201A 100%)',
              cursor: 'pointer',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '-0.34px',
              pointerEvents: 'none',
            }}
          >
            시작하기
          </div>
        </div>
      </motion.div>

      {/* ── 참여자수 + 테스트 공유하기 ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ padding: '0 20px', marginTop: '64px', marginBottom: '36px' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex flex-col items-center" style={{ gap: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.26px' }}>참여자수</span>
          <span style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
            <CountUpNumber target={142847} />
          </span>
        </div>

        <div className="flex flex-col items-center" style={{ gap: '4px', marginTop: '38px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.26px' }}>공유하기</span>
          <span style={{ fontSize: '30px', fontWeight: 800, color: '#FF5B4D', letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
            18,204
          </span>
        </div>

        <div className="flex items-center" style={{ gap: '16px', marginTop: '16px' }}>
          <motion.button
            type="button"
            aria-label="카카오톡으로 공유"
            onClick={handleKakaoShare}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="transform-gpu"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FEE500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C6.477 3 2 6.68 2 11.2c0 2.9 1.85 5.44 4.63 6.9-.2.75-.73 2.7-.84 3.12-.13.5.18.5.38.36.16-.11 2.53-1.72 3.56-2.42.7.1 1.44.15 2.27.15 5.523 0 10-3.68 10-8.2S17.523 3 12 3z"
                fill="#191600"
              />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            aria-label="X에 공유"
            onClick={handleXShare}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="transform-gpu"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M13.6 10.6 20.9 2h-1.7l-6.3 7.5L7.8 2H2l7.7 11.2L2 22h1.7l6.7-8 5.4 8H22l-8-11.4Zm-2.4 2.8-.8-1.1L4 3.3h2.6l5 7.2.8 1.1 6.6 9.4h-2.6l-5.2-7.6Z"
                fill="#ffffff"
              />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            aria-label="링크 복사"
            onClick={handleCopy}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="transform-gpu"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: copied ? 'rgba(255,91,77,0.18)' : 'rgba(255,255,255,0.06)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#FF5B4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.button>
        </div>
        {copied && (
          <p style={{ fontSize: '12px', color: '#FF5B4D', fontWeight: 600, marginTop: '12px' }}>
            링크가 복사됐어요!
          </p>
        )}
      </motion.div>

      {/* ── Disclaimer ── */}
      <p
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          padding: '0 28px 132px',
          lineHeight: '1.5',
        }}
      >
        본 테스트는 재미로 보는 콘텐츠이며,
        <br />
        실제 운세·심리 진단이 아닙니다.
      </p>
    </div>
  );
}
