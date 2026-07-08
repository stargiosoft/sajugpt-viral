'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import CountUpNumber from '@/components/CountUpNumber';
import LandingCTAButton from '@/components/LandingCTAButton';

interface Props {
  onStart: () => void;
}

const SHARE_TEXT = '💘 5턴 안에 데이트 따낼 수 있어?\n사주 궁합 AI와 선택지 대화로 마음을 사로잡아보세요';

export default function DatingLanding({ onStart }: Props) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(async () => {
    const origin = window.location.origin;
    const ok = await copyToClipboard(`${SHARE_TEXT}\n👉 ${origin}/dating-sim`);
    if (ok) {
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('dating_sim_share_test_clipboard');
      trackShare('dating', 'clipboard');
    }
  }, []);

  const handleKakaoShare = useCallback(() => {
    const origin = window.location.origin;
    const ok = shareKakao({
      title: '5턴 안에 데이트 따낼 수 있어?',
      description: '사주 궁합 AI와 선택지 대화로 마음을 사로잡아보세요',
      imageUrl: `${origin}/home/thumbnails/dating-sim.jpg`,
      link: `${origin}/dating-sim`,
      buttonText: '나도 해보기',
    });
    if (ok) {
      trackEvent('dating_sim_share_test_kakao');
      trackShare('dating', 'kakao');
    } else {
      handleCopy();
    }
  }, [handleCopy]);

  const handleXShare = useCallback(() => {
    const origin = window.location.origin;
    const text = encodeURIComponent(SHARE_TEXT);
    const url = encodeURIComponent(`${origin}/dating-sim`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    trackEvent('dating_sim_share_test_x');
    trackShare('dating', 'x');
  }, []);

  return (
    <div className="flex flex-col items-center" style={{ minHeight: '100%', backgroundColor: '#ffffff' }}>
      {/* ── 상단 썸네일 ── */}
      <motion.img
        src="/home/thumbnails/dating-sim.jpg"
        alt="데이트 시뮬레이션"
        className="w-full"
        style={{ aspectRatio: '3 / 2', objectFit: 'cover', display: 'block' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* ── 헤드라인 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '44px 12px 0' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="flex justify-center" style={{ marginBottom: '10px' }}>
          <span
            className="inline-flex items-center"
            style={{
              padding: '4px 10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,77,141,0.12)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FF4D8D',
              letterSpacing: '-0.26px',
            }}
          >
            데이트 시뮬레이션
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a1a', textAlign: 'center', lineHeight: '1.7', letterSpacing: '-0.52px' }}>
          5턴 안에<br />데이트 따낼 수 있어?
        </h1>
      </motion.div>

      {/* ── 시작하기 버튼 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '36px 12px 0' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <LandingCTAButton onClick={onStart} label="도전하기" background="linear-gradient(135deg, #FF6FA5 0%, #FF4D8D 100%)" />
      </motion.div>

      {/* ── 참여자수 + 공유하기 ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ padding: '0 12px', marginTop: '44px', marginBottom: '36px' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex flex-col items-center" style={{ gap: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.26px' }}>참여자수</span>
          <span style={{ fontSize: '30px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
            <CountUpNumber target={12847} />
          </span>
        </div>

        <div className="flex flex-col items-center" style={{ gap: '4px', marginTop: '38px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.26px' }}>공유하기</span>
          <span style={{ fontSize: '30px', fontWeight: 800, color: '#FF4D8D', letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
            <CountUpNumber target={3921} />
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
              backgroundColor: '#F7F7F7',
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
                fill="#1a1a1a"
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
              backgroundColor: copied ? 'rgba(255,77,141,0.12)' : '#F7F7F7',
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
                <path d="M5 13l4 4L19 7" stroke="#FF4D8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke="rgba(0,0,0,0.55)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.button>
        </div>
        {copied && (
          <p style={{ fontSize: '12px', color: '#FF4D8D', fontWeight: 600, marginTop: '12px' }}>
            링크가 복사됐어요!
          </p>
        )}
      </motion.div>

      {/* ── Disclaimer ── */}
      <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '0 12px 40px', lineHeight: '1.5' }}>
        본 테스트는 재미로 보는 콘텐츠이며,
        <br />
        실제 운세·심리 진단이 아닙니다.
      </p>
    </div>
  );
}
