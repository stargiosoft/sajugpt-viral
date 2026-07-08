'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import LandingCTAButton from '@/components/LandingCTAButton';

interface Props {
  onStart: () => void;
}

const SHARE_TEXT = '🌙 은밀한 기록 유출 — 시종들이 마마를 두고 벌인 은밀한 토론\n사주 기반 체질 진단받고, 병풍 뒤에서 쟁탈전을 엿들어보세요';

// seed 기반 결정론적 난수 — SSR/CSR 하이드레이션 불일치 없이 별마다 고정된 위치/속도를 부여
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 화면 전체에 흩뿌려진 별 — 은은한 명멸(twinkle) + 아주 느린 표류(drift)로만 움직임을 줌, 낙하 없음
const STARS = Array.from({ length: 70 }, (_, i) => ({
  top: seededRandom(i * 12.9898) * 100,
  left: seededRandom(i * 78.233) * 100,
  size: 1 + seededRandom(i * 37.719) * 1.6,
  opacity: 0.3 + seededRandom(i * 93.989) * 0.5,
  duration: 2.5 + seededRandom(i * 15.731) * 3,
  delay: seededRandom(i * 45.164) * 4,
  driftX: (seededRandom(i * 61.417) - 0.5) * 20,
  driftY: (seededRandom(i * 27.183) - 0.5) * 20,
  driftDuration: 12 + seededRandom(i * 51.982) * 10,
}));

// 은하수처럼 은은하게 번지는 성운 광원 — 아주 느린 밝기 호흡으로만 움직임을 줌
const NEBULA = [
  { top: '2%', left: '-15%', width: '80%', height: '38%', color: 'rgba(96,150,210,0.26)', blur: 70 },
  { top: '16%', right: '-18%', width: '70%', height: '32%', color: 'rgba(140,120,210,0.20)', blur: 80 },
  { top: '45%', left: '-10%', width: '60%', height: '28%', color: 'rgba(120,165,215,0.16)', blur: 90 },
  { bottom: '-6%', right: '-12%', width: '65%', height: '32%', color: 'rgba(70,115,175,0.22)', blur: 75 },
];

interface StarSpec {
  top: number; left: number; size: number; opacity: number;
  duration: number; delay: number; driftX: number; driftY: number; driftDuration: number;
}

function Star({ s }: { s: StarSpec }) {
  return (
    <motion.div
      animate={{
        opacity: [s.opacity * 0.25, s.opacity, s.opacity * 0.25],
        x: [0, s.driftX, 0],
        y: [0, s.driftY, 0],
      }}
      transition={{
        opacity: { duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' },
        x: { duration: s.driftDuration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: s.driftDuration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        top: `${s.top}%`,
        left: `${s.left}%`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        borderRadius: '50%',
        backgroundColor: '#eaf2ff',
        boxShadow: `0 0 ${s.size * 2.5}px rgba(255,255,255,0.6)`,
      }}
    />
  );
}

function StarField() {
  return (
    <div
      className="absolute top-0 overflow-hidden pointer-events-none"
      aria-hidden
      style={{ left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '100%' }}
    >
      {NEBULA.map((c, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9 + i * 2, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: c.top,
            left: 'left' in c ? c.left : undefined,
            right: 'right' in c ? c.right : undefined,
            bottom: 'bottom' in c ? c.bottom : undefined,
            width: c.width,
            height: c.height,
            background: `radial-gradient(ellipse, ${c.color} 0%, transparent 70%)`,
            filter: `blur(${c.blur}px)`,
          }}
        />
      ))}
      {STARS.map((s, i) => <Star key={i} s={s} />)}
    </div>
  );
}

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

function CountUpNumber({ target, duration, delay }: { target: number; duration?: number; delay?: number }) {
  const value = useCountUp(target, duration, delay);
  return <>{value.toLocaleString()}</>;
}

export default function NightLanding({ onStart }: Props) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(async () => {
    const origin = window.location.origin;
    const ok = await copyToClipboard(`${SHARE_TEXT}\n👉 ${origin}/night-manual`);
    if (ok) {
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('night_manual_share_test_clipboard');
      trackShare('night_manual', 'clipboard');
    }
  }, []);

  const handleKakaoShare = useCallback(() => {
    const origin = window.location.origin;
    const ok = shareKakao({
      title: '은밀한 기록 유출 — 사주 기반 체질 진단',
      description: '시종들이 마마를 두고 벌인 은밀한 토론을 엿들어보세요',
      imageUrl: `${origin}/home/thumbnails/night-manual.jpg`,
      link: `${origin}/night-manual`,
      buttonText: '나도 해보기',
    });
    if (ok) {
      trackEvent('night_manual_share_test_kakao');
      trackShare('night_manual', 'kakao');
    } else {
      handleCopy();
    }
  }, [handleCopy]);

  const handleXShare = useCallback(() => {
    const origin = window.location.origin;
    const text = encodeURIComponent(SHARE_TEXT);
    const url = encodeURIComponent(`${origin}/night-manual`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    trackEvent('night_manual_share_test_x');
    trackShare('night_manual', 'x');
  }, []);

  return (
    <div className="relative flex flex-col items-center" style={{ minHeight: '100%' }}>
      <StarField />

      {/* ── 상단 썸네일 ── */}
      <motion.img
        src="/home/thumbnails/night-manual.jpg"
        alt="은밀한 기록 유출"
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
            backgroundColor: '#0f1a29',
            borderRadius: '3px',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-block',
            backgroundColor: '#0f1a29',
            borderRadius: '18px',
            padding: '14px 20px 15.5px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          <p style={{ fontSize: '14.5px', fontWeight: 700, color: '#eaf2ff', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
            사주로 시종 마음 훔치기
          </p>
        </div>
      </motion.div>

      {/* ── 시작하기 버튼 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '28px 12px 0' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <LandingCTAButton onClick={onStart} label="병풍 뒤에서 엿듣기" background="linear-gradient(135deg, #5FAEE8 0%, #3A7EC0 100%)" />
      </motion.div>

      {/* ── 참여자수 + 테스트 공유하기 ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ padding: '0 12px', marginTop: '64px', marginBottom: '36px' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex flex-col items-center" style={{ gap: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(234,242,255,0.45)', letterSpacing: '-0.26px' }}>참여자수</span>
          <span style={{ fontSize: '30px', fontWeight: 800, color: '#eaf2ff', letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
            <CountUpNumber target={98432} />
          </span>
        </div>

        <div className="flex flex-col items-center" style={{ gap: '4px', marginTop: '38px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(234,242,255,0.45)', letterSpacing: '-0.26px' }}>공유하기</span>
          <span style={{ fontSize: '30px', fontWeight: 800, color: '#4A9EE0', letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
            11,560
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
              backgroundColor: 'rgba(234,242,255,0.06)',
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
              backgroundColor: copied ? 'rgba(74,158,224,0.18)' : 'rgba(234,242,255,0.06)',
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
                <path d="M5 13l4 4L19 7" stroke="#4A9EE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke="rgba(234,242,255,0.75)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.button>
        </div>
        {copied && (
          <p style={{ fontSize: '12px', color: '#4A9EE0', fontWeight: 600, marginTop: '12px' }}>
            링크가 복사됐어요!
          </p>
        )}
      </motion.div>

      {/* ── Disclaimer ── */}
      <p
        style={{
          fontSize: '11px',
          color: 'rgba(234,242,255,0.25)',
          textAlign: 'center',
          padding: '0 12px 132px',
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
