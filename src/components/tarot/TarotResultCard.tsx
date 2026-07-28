'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import GhostSealButton from '@/components/ghost-tarot/GhostSealButton';
import GhostCTAButton from '@/components/ghost-tarot/GhostCTAButton';
import GhostCommentSection from '@/components/ghost-tarot/GhostCommentSection';
import RecommendSection from '@/components/RecommendSection';
import SajuGPTBanner from '@/components/SajuGPTBanner';
import type { CommentFeatureType } from '@/lib/ghost-tarot/comments';
import TarotShareRow from './TarotShareRow';
import Toast from '@/components/Toast';
import { saveImage, captureCardImage, isMobileDevice } from '@/lib/share';
import { trackSajuGPTClick } from '@/lib/analytics';
import { useIsDesktop, useIsNarrow, NARROW_BREAKPOINT } from '@/lib/ghost-tarot/useBreakpoint';
import type { TarotCardData, TarotConfig, TarotResult } from '@/types/tarot';

const PARCHMENT_INK = '#2a1f16';
const PARCHMENT_INK_DIM = '#6b5842';

const FLIP_DONE_MS = 2350;
const DOCK_DURATION_MS = 500;
const BG_FADE_DURATION_MS = 450;
const DOCK_START_MS = FLIP_DONE_MS;
const BG_FADE_START_MS = DOCK_START_MS + DOCK_DURATION_MS;
const REVEAL_DURATION_MS = BG_FADE_START_MS + BG_FADE_DURATION_MS;

function notchPath(w: number, h: number, inset: number, cr: number) {
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  return [
    `M ${x0 + cr} ${y0}`,
    `L ${x1 - cr} ${y0}`,
    `A ${cr} ${cr} 0 0 0 ${x1} ${y0 + cr}`,
    `L ${x1} ${y1 - cr}`,
    `A ${cr} ${cr} 0 0 0 ${x1 - cr} ${y1}`,
    `L ${x0 + cr} ${y1}`,
    `A ${cr} ${cr} 0 0 0 ${x0} ${y1 - cr}`,
    `L ${x0} ${y0 + cr}`,
    `A ${cr} ${cr} 0 0 0 ${x0 + cr} ${y0}`,
    'Z',
  ].join(' ');
}

interface Props {
  config: TarotConfig;
  card: TarotCardData;
  result: TarotResult | null;
  error?: boolean;
  onReset: () => void;
}

interface DockRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function TarotResultCard({ config, card, result, error, onReset }: Props) {
  const { palette, myungjoFont } = config.theme;
  const [revealing, setRevealing] = useState(!error);
  const [dockRect, setDockRect] = useState<DockRect | null>(null);
  const [bgFading, setBgFading] = useState(false);
  const dockTargetRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const blobPromiseRef = useRef<Promise<Blob> | null>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [appStoreUrl, setAppStoreUrl] = useState(config.copy.ctaAppUrlIOS);
  const isDesktop = useIsDesktop();
  const isNarrow = useIsNarrow();
  const notchBoxRef = useRef<HTMLDivElement>(null);
  const [notchSize, setNotchSize] = useState({ w: 300, h: 100 });
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveResetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const messageRef = useRef<HTMLHeadingElement>(null);
  const [messageWrapped, setMessageWrapped] = useState(false);

  // 메시지가 2줄 이상으로 꺾일 때만 폰트를 살짝 줄여서 한 줄일 때의 큼직한 임팩트는 그대로 유지
  useEffect(() => {
    const el = messageRef.current;
    if (!el || !result?.message) return;
    setMessageWrapped(false);
    const raf = requestAnimationFrame(() => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setMessageWrapped(el.scrollHeight > lineHeight * 1.5);
    });
    return () => cancelAnimationFrame(raf);
  }, [result?.message, isDesktop, isNarrow]);

  const showSavedState = () => {
    setSaveState('saved');
    clearTimeout(saveResetTimerRef.current);
    saveResetTimerRef.current = setTimeout(() => setSaveState('idle'), 2500);
  };

  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) {
      setAppStoreUrl(config.copy.ctaAppUrlAndroid);
    }
  }, [config.copy.ctaAppUrlAndroid]);

  useEffect(() => {
    if (error) {
      setRevealing(false);
      return;
    }

    const dockTimer = setTimeout(() => {
      const el = dockTargetRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setDockRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    }, DOCK_START_MS);

    const fadeTimer = setTimeout(() => setBgFading(true), BG_FADE_START_MS);
    const hideTimer = setTimeout(() => setRevealing(false), REVEAL_DURATION_MS);

    return () => {
      clearTimeout(dockTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [error]);

  const startOrGetCapture = (el: HTMLElement): Promise<Blob> => {
    if (!blobPromiseRef.current) {
      blobPromiseRef.current = captureCardImage(el).catch((err) => {
        blobPromiseRef.current = null;
        throw err;
      });
    }
    return blobPromiseRef.current;
  };

  useEffect(() => {
    if (error || revealing || !result || !captureRef.current) return;
    startOrGetCapture(captureRef.current).catch(() => {});
  }, [error, revealing, result]);

  useEffect(() => {
    const el = fitRef.current;
    if (!el || !result) return;
    const outer = el.parentElement;
    if (!outer) return;

    const recompute = () => {
      const raw = el.scrollHeight;
      const avail = outer.clientHeight - (window.innerWidth <= NARROW_BREAKPOINT ? 16 : 0);
      const scale = raw > avail ? Math.max(avail / raw, 0.5) : 1;
      setFitScale(scale);
    };

    setFitScale(1);
    const frame = requestAnimationFrame(recompute);
    window.addEventListener('resize', recompute);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', recompute);
    };
  }, [result, error]);

  useEffect(() => {
    const el = notchBoxRef.current;
    if (!el) return;
    const update = () => setNotchSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [result, error]);

  const cardName = result?.card_name || card.card_name || '이름 없는 존재';
  const resultTitle = result?.title || '';
  const frontImage = card.front_image && card.front_image.trim() !== '' ? card.front_image : null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${config.slug}`;
  const shareText = config.copy.shareText(cardName, resultTitle);

  const handleSaveImage = async () => {
    if (!captureRef.current || saveState === 'saving') return;
    const filename = `${cardName}${config.copy.filenameSuffix}`;
    setSaveState('saving');

    let blob: Blob;
    try {
      blob = await startOrGetCapture(captureRef.current);
    } catch {
      setSaveState('idle');
      setSaveError('이미지 저장에 실패했어요. 다시 시도해주세요.');
      setTimeout(() => setSaveError(null), 2500);
      return;
    }

    if (isMobileDevice() && navigator.share) {
      try {
        const file = new File([blob], filename, { type: 'image/png' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          showSavedState();
          return;
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setSaveState('idle');
          return;
        }
      }
    }

    try {
      await saveImage(captureRef.current, filename, blob);
      showSavedState();
    } catch {
      setSaveState('idle');
      setSaveError('이미지 저장에 실패했어요. 다시 시도해주세요.');
      setTimeout(() => setSaveError(null), 2500);
    }
  };

  const cardNameMatch = cardName.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  const cardNameMain = cardNameMatch ? cardNameMatch[1] : cardName;
  const cardNameSub = cardNameMatch ? cardNameMatch[2] : null;

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '0px 16px 140px',
        background: palette.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        ref={captureRef}
        className="w-full max-w-[440px] md:max-w-[600px]"
        style={{
          position: 'relative',
          aspectRatio: '863 / 1823',
          ...(isDesktop ? {} : { width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16 }),
        }}
      >
        <Image src={isDesktop ? config.assets.resultBg : config.assets.resultBgMobile} alt="" fill priority className="object-contain" />

        <div
          style={{
            position: 'absolute',
            top: '14.8%',
            left: isDesktop ? '15.3%' : '9.2%',
            width: isDesktop ? '69.3%' : '81.6%',
            height: '80.3%',
            overflow: 'hidden',
            transform: `translateY(${isDesktop ? 44 : 4}px)`,
          }}
        >
          <div
            ref={fitRef}
            className="flex flex-col items-center text-center"
            style={{ transform: `scale(${fitScale})`, transformOrigin: 'top center' }}
          >
          <div
            ref={dockTargetRef}
            style={{
              width: isDesktop ? 'calc(42% + 36px)' : (isNarrow ? 'calc(42% + 12px)' : 'calc(42% - 12px)'),
              marginTop: 20,
              aspectRatio: '2 / 3',
              position: 'relative',
              filter: 'drop-shadow(0 6px 14px rgba(59,38,20,.55))',
              flexShrink: 0,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: '-4%', background: '#f7f2e8', borderRadius: 12 }} />

              {frontImage ? (
                <Image src={frontImage} alt={cardName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-black/20 border flex items-center justify-center text-[10px]" style={{ position: 'relative', borderColor: 'rgba(138,109,59,.4)', color: PARCHMENT_INK_DIM }}>
                  형상을 불러오는 중...
                </div>
              )}
            </div>
          </div>

          <h1
            style={{
              marginTop: isDesktop ? 'calc(7% - 6px)' : 'calc(7% + 0px)',
              fontFamily: myungjoFont,
              fontSize: isDesktop ? 22 : (isNarrow ? 17 : 18),
              lineHeight: 1.2,
              color: PARCHMENT_INK,
              WebkitTextStroke: isDesktop ? `1.4px ${PARCHMENT_INK}` : `1px ${PARCHMENT_INK}`,
              textShadow: '0 1px 3px rgba(247,242,232,0.55)',
              flexShrink: 0,
              letterSpacing: '3px',
              textRendering: 'optimizeLegibility',
              transform: 'translateZ(0)',
            }}
          >
            {cardNameMain}
          </h1>
          {cardNameSub && (
            <span
              style={{
                display: 'block',
                marginTop: isDesktop ? 'calc(1.6% + 0px)' : (isNarrow ? 5 : 3),
                fontFamily: myungjoFont,
                fontSize: isDesktop ? 12.5 : 12,
                color: '#584E44',
                WebkitTextStroke: '0.2px #584E44',
                flexShrink: 0,
                letterSpacing: '0.8px',
                textRendering: 'optimizeLegibility',
                transform: 'translateZ(0)',
              }}
            >
              ({cardNameSub})
            </span>
          )}

          {result && !error && config.copy.badgeLabel && (
            <>
              <div className="flex items-center justify-center" style={{ marginTop: isDesktop ? 'calc(5% + 16px)' : (isNarrow ? 'calc(5% + 8px)' : 'calc(5% + 12px)'), gap: 8, width: '74%', flexShrink: 0 }}>
                <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent 0%, ${PARCHMENT_INK_DIM} 100%)`, opacity: 0.4 }} />
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    backgroundColor: PARCHMENT_INK_DIM,
                    opacity: 0.7,
                    WebkitMaskImage: `url(${config.assets.chineseKnot})`,
                    maskImage: `url(${config.assets.chineseKnot})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
                <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${PARCHMENT_INK_DIM} 0%, transparent 100%)`, opacity: 0.4 }} />
              </div>

              <div className="flex items-center justify-center" style={{ marginTop: isDesktop ? 'calc(5% + 14px)' : (isNarrow ? 'calc(5% + 6px)' : 'calc(5% + 10px)'), flexShrink: 0 }}>
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: myungjoFont,
                    fontSize: isDesktop ? 14.5 : (isNarrow ? 12 : 13),
                    fontWeight: 600,
                    color: '#FCF9EF',
                    WebkitTextStroke: '0px #FCF9EF',
                    letterSpacing: '-0.5px',
                    padding: isDesktop ? '11.5px 46px 10px' : '9.5px 46px 8px',
                  }}
                >
                  {config.assets.badgeBrush && (
                    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, display: 'flex' }}>
                      <div style={{ width: 34, flexShrink: 0, backgroundImage: `url(${config.assets.badgeBrush})`, backgroundSize: '1114.48% 100%', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' }} />
                      <div style={{ flex: 1, backgroundImage: `url(${config.assets.badgeBrush})`, backgroundSize: '121.87% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
                      <div style={{ width: 34, flexShrink: 0, backgroundImage: `url(${config.assets.badgeBrush})`, backgroundSize: '1114.48% 100%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }} />
                    </div>
                  )}
                  <span
                    style={{
                      position: 'relative',
                      textRendering: 'optimizeLegibility',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {config.copy.badgeLabel(resultTitle)}
                  </span>
                </span>
              </div>
            </>
          )}

          {error ? (
            <div style={{ marginTop: '6%' }}>
              <p style={{ color: palette.red, fontSize: 'clamp(11px, 2.6vw, 13px)' }}>기록을 불러오지 못했습니다.</p>
            </div>
          ) : !result ? (
            <p className="animate-pulse" style={{ marginTop: '6%', color: PARCHMENT_INK_DIM, fontSize: 'clamp(11px, 2.6vw, 13px)' }}>
              어둠 속의 존재가 기록을 전하고 있습니다...
            </p>
          ) : (
            <div style={{ marginTop: isDesktop ? 14 : 16, width: '100%' }}>
              <h2
                ref={messageRef}
                style={{
                  marginTop: 0,
                  fontFamily: myungjoFont,
                  fontSize: (isDesktop ? 30 : (isNarrow ? 21 : 26)) * (messageWrapped ? 0.88 : 1),
                  lineHeight: 1.6,
                  color: PARCHMENT_INK,
                  WebkitTextStroke: isDesktop ? `1.6px ${PARCHMENT_INK}` : `1.3px ${PARCHMENT_INK}`,
                  textShadow: '0 1px 3px rgba(247,242,232,0.55)',
                  letterSpacing: '-0.5px',
                  width: 'auto',
                  marginLeft: 12,
                  marginRight: 12,
                  textRendering: 'optimizeLegibility',
                  transform: 'translateZ(0)',
                }}
              >
                <span
                  className="[&_*]:!text-inherit"
                  dangerouslySetInnerHTML={{ __html: result?.message || '' }}
                />
              </h2>

              <div className="flex items-center justify-center" style={{ marginTop: isDesktop ? 'calc(4% + 10px)' : 'calc(4% + 6px)', width: '74%', flexShrink: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                <span style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent 0%, ${PARCHMENT_INK_DIM} 50%, transparent 100%)`, opacity: 0.4 }} />
              </div>

              <div
                ref={notchBoxRef}
                style={{
                  position: 'relative',
                  marginTop: isDesktop ? 'calc(6% + 12px)' : 'calc(6% + 8px)',
                  width: isDesktop ? 'calc(100% - 32px)' : (isNarrow ? 'calc(100% + 4px)' : 'calc(100% - 36px)'),
                  marginLeft: isDesktop ? 16 : (isNarrow ? -2 : 18),
                  marginRight: isDesktop ? 16 : (isNarrow ? -2 : 18),
                  padding: isDesktop ? 'calc(4% + 12px) 4%' : 'calc(4% + 10px) calc(4% + 10px)',
                  filter: 'drop-shadow(0 3px 8px rgba(20,14,8,0.16))',
                }}
              >
                <svg
                  aria-hidden
                  viewBox={`0 0 ${notchSize.w} ${notchSize.h}`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                  <defs>
                    <radialGradient id="tarot-notch-fill" cx="38%" cy="32%" r="85%">
                      <stop offset="0%" stopColor="rgba(96,74,48,0.015)" />
                      <stop offset="50%" stopColor="rgba(84,64,42,0.04)" />
                      <stop offset="80%" stopColor="rgba(74,56,36,0.07)" />
                      <stop offset="100%" stopColor="rgba(64,48,30,0.1)" />
                    </radialGradient>
                    <radialGradient id="tarot-notch-stain" cx="78%" cy="82%" r="65%">
                      <stop offset="0%" stopColor="rgba(60,44,26,0.08)" />
                      <stop offset="55%" stopColor="rgba(60,44,26,0.025)" />
                      <stop offset="100%" stopColor="rgba(60,44,26,0)" />
                    </radialGradient>
                    <linearGradient id="tarot-notch-stroke-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(96,74,48,0.36)" />
                      <stop offset="16%" stopColor="rgba(96,74,48,0.12)" />
                      <stop offset="32%" stopColor="rgba(96,74,48,0.32)" />
                      <stop offset="50%" stopColor="rgba(96,74,48,0.1)" />
                      <stop offset="68%" stopColor="rgba(96,74,48,0.3)" />
                      <stop offset="84%" stopColor="rgba(96,74,48,0.11)" />
                      <stop offset="100%" stopColor="rgba(96,74,48,0.32)" />
                    </linearGradient>
                    <linearGradient id="tarot-notch-stroke-inner" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(96,74,48,0.22)" />
                      <stop offset="20%" stopColor="rgba(96,74,48,0.06)" />
                      <stop offset="38%" stopColor="rgba(96,74,48,0.2)" />
                      <stop offset="56%" stopColor="rgba(96,74,48,0.05)" />
                      <stop offset="74%" stopColor="rgba(96,74,48,0.18)" />
                      <stop offset="100%" stopColor="rgba(64,52,38,0.1)" />
                    </linearGradient>
                  </defs>
                  <path d={notchPath(notchSize.w, notchSize.h, 3, 14)} fill="url(#tarot-notch-fill)" stroke="url(#tarot-notch-stroke-outer)" strokeWidth={isDesktop ? 0.8 : 1} />
                  <path d={notchPath(notchSize.w, notchSize.h, 3, 14)} fill="url(#tarot-notch-stain)" />
                  <path d={notchPath(notchSize.w, notchSize.h, 9, 11)} fill="none" stroke="url(#tarot-notch-stroke-inner)" strokeWidth={0.65} />
                </svg>
                <p
                  className="[&_*]:!text-inherit"
                  style={{
                    position: 'relative',
                    fontFamily: myungjoFont,
                    fontSize: isDesktop ? 14.5 : 13,
                    fontWeight: 600,
                    lineHeight: 1.75,
                    color: PARCHMENT_INK,
                    WebkitTextStroke: isDesktop ? `0.2px ${PARCHMENT_INK}` : `0.1px ${PARCHMENT_INK}`,
                    letterSpacing: isDesktop ? '-0.5px' : '-0.3px',
                    marginTop: isDesktop ? 0 : 2,
                  }}
                  dangerouslySetInnerHTML={{ __html: result?.summary || '' }}
                />
              </div>
            </div>
          )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {revealing && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: bgFading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: BG_FADE_DURATION_MS / 1000, ease: 'easeInOut' }}
            className={dockRect ? '' : 'flex items-center justify-center'}
            style={{ position: 'fixed', inset: 0, background: palette.bg, zIndex: 10 }}
          >
            <motion.div
              layout
              transition={{ layout: { duration: DOCK_DURATION_MS / 1000, ease: 'easeInOut' } }}
              style={
                dockRect
                  ? { position: 'fixed', top: dockRect.top, left: dockRect.left, width: dockRect.width, height: dockRect.height }
                  : { width: '46%', maxWidth: 220, aspectRatio: '2 / 3', position: 'relative', perspective: 800 }
              }
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.3, 0.9, 0.4], scale: [0.6, 0.9, 1.5, 1.9] }}
                transition={{ duration: 2.1, times: [0, 0.5, 0.8, 1], ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: '10%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${palette.red}, transparent 70%)`,
                  filter: 'blur(24px)',
                  zIndex: -1,
                }}
              />

              <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0, 0.7, 0.5, 0], rotate: [0, 0, 90, 160, 220], scale: [0.8, 0.8, 1.2, 1.5, 1.8] }}
                transition={{ duration: 2.35, times: [0, 0.72, 0.85, 0.94, 1], ease: 'easeOut' }}
                style={{ position: 'absolute', inset: '-35%', zIndex: 1, pointerEvents: 'none' }}
              >
                <div style={{ position: 'absolute', top: '8%', left: '15%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(179,39,58,.5), transparent 70%)', filter: 'blur(16px)' }} />
                <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,33,48,.45), transparent 70%)', filter: 'blur(18px)' }} />
                <div style={{ position: 'absolute', top: '42%', left: '-8%', width: '42%', height: '42%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(60,15,22,.4), transparent 70%)', filter: 'blur(14px)' }} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 1, 1, 1],
                  scale: [0.3, 1.08, 0.98, 1],
                }}
                transition={{ duration: 1.7, times: [0, 0.45, 0.75, 1], ease: ['easeOut', 'easeInOut', 'easeInOut'] }}
                style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
              >
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 180 }}
                  transition={{ delay: 1.7, duration: 0.65, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 12,
                      overflow: 'hidden',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <Image src={config.assets.backImage} alt="" fill className="object-cover" />
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: '-4%', background: '#f7f2e8', borderRadius: 12 }} />
                    {frontImage && <Image src={frontImage} alt={cardName} fill className="object-cover" />}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: revealing && !bgFading ? 0 : 1, y: revealing && !bgFading ? 10 : 0 }}
        transition={{ duration: BG_FADE_DURATION_MS / 1000 }}
        className="w-full max-w-[440px] md:max-w-[600px]"
        style={{ marginTop: 0 }}
      >
        {error ? (
          <GhostSealButton variant="secondary" onClick={onReset}>
            다시 선택하기
          </GhostSealButton>
        ) : (
          <>
            <div style={{ marginTop: 22 }}>
              <TarotShareRow config={config} shareText={shareText} shareLink={shareUrl} resultId={result?.id} variant="boxed" />
            </div>

            <div style={{ marginTop: 28 }}>
            <GhostCTAButton
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSajuGPTClick(config.featureType, result?.id)}
              label={
                <span className="flex items-center justify-center" style={{ gap: 8 }}>
                  {config.copy.ctaLabel} <span style={{ position: 'relative', top: isDesktop ? '-0.5px' : '0px', fontFamily: 'Pretendard', fontSize: isDesktop ? '13.5px' : (isNarrow ? '12.5px' : '13.5px'), fontWeight: 700 }}>(사주<span style={{ fontSize: isDesktop ? '14px' : (isNarrow ? '13px' : '14px') }}>GPT</span>)</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="#f5ebe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              }
              bgStyle={{ backgroundColor: 'rgb(179,47,23)', borderRadius: 12 }}
              shineColor="rgba(150,39,20,0.55)"
            />
            </div>

            <div style={{ marginTop: 12 }}>
                <GhostCTAButton
                  onClick={handleSaveImage}
                  disabled={saveState === 'saving'}
                  label={
                    saveState === 'saved' ? (
                      <span className="flex items-center justify-center" style={{ gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="#f5ebe0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        저장됨
                      </span>
                    ) : saveState === 'saving' ? (
                      <span className="flex items-center justify-center" style={{ gap: 8 }}>
                        <motion.svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        >
                          <circle cx="12" cy="12" r="9" stroke="#f5ebe0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 100" opacity={0.9} />
                        </motion.svg>
                        저장 중...
                      </span>
                    ) : (
                      '이미지 저장하기'
                    )
                  }
                  bgStyle={{
                    backgroundColor: saveState === 'saved' ? 'rgba(179,47,23,0.18)' : 'transparent',
                    border: '1.5px solid rgb(179,47,23)',
                    borderRadius: 12,
                  }}
                  hoverBackground="rgba(179,47,23,0.18)"
                />
            </div>

            {(config.slug === 'ghost-tarot' || config.slug === 'romance-ghost-tarot') && (
              <div style={{ marginTop: 44 }}>
                <RecommendSection
                  excludeId={config.slug}
                  titleStyle={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 16, fontWeight: 700, color: palette.ink, letterSpacing: '-0.8px', paddingLeft: '2px' }}
                  cardBg="rgb(19,19,19)"
                  cardTitleColor="#d5d5d5"
                />
                <div style={{ marginTop: 20 }}>
                  <SajuGPTBanner featureType={config.featureType} resultId={result?.id} />
                </div>
                <div style={{ marginTop: 36 }}>
                  <GhostCommentSection featureType={config.featureType as CommentFeatureType} />
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      <Toast message={saveError} />
    </div>
  );
}
