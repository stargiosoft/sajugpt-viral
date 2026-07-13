'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import GhostSealButton from './GhostSealButton';
import GhostShareRow from './GhostShareRow';
import PressableButton from '@/components/PressableButton';
import { saveImage } from '@/lib/share';
import { trackSajuGPTClick } from '@/lib/analytics';
import { GHOST_BRUSH_FONT, GHOST_MYUNGJO_FONT, GHOST_PALETTE } from '@/lib/ghost-tarot/theme';
import { GhostCardData, GhostResult } from '@/types/ghost-tarot';

// 파피루스(양피지) 배경 위에 얹는 글자용 색 — GHOST_PALETTE.ink/inkDim은
// 어두운 배경(#050403) 전용이라 밝은 종이 위에서는 대비가 안 나옴
const PARCHMENT_INK = '#2a1f16';
const PARCHMENT_INK_DIM = '#6b5842';

// 쫀득하게 커지며 한 번 두근(0~1.7s) → 뒤집힘(1.7~2.35s) → 실제 결과지 카드 위치로 도킹(2.35~2.85s)
// → 배경만 페이드아웃(2.85~3.3s)돼 이미 자리잡은 결과지가 자연스럽게 드러남
const FLIP_DONE_MS = 2350;
const DOCK_DURATION_MS = 500;
const BG_FADE_DURATION_MS = 450;
const DOCK_START_MS = FLIP_DONE_MS;
const BG_FADE_START_MS = DOCK_START_MS + DOCK_DURATION_MS;
const REVEAL_DURATION_MS = BG_FADE_START_MS + BG_FADE_DURATION_MS;

const IOS_APP_URL = 'https://apps.apple.com/us/app/fortune-gpt/id1547399137';
const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=kr.semaphore.sajugpt';

interface Props {
  card: GhostCardData;
  result: GhostResult | null;
  error?: boolean;
  onReset: () => void;
}

interface DockRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function GhostResultCard({ card, result, error, onReset }: Props) {
  const [revealing, setRevealing] = useState(!error);
  const [dockRect, setDockRect] = useState<DockRect | null>(null);
  const [bgFading, setBgFading] = useState(false);
  const dockTargetRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [appStoreUrl, setAppStoreUrl] = useState(IOS_APP_URL);
  const [isDesktop, setIsDesktop] = useState(false);
  // 웹에서 요약 박스가 프레임 기준 항상 정확히 16px 여백을 갖도록 fitScale 축소를 역산한 px 값
  // (fitScale은 fitRef 자기 중심으로 축소되기 때문에, % 마진만으로는 축소된 카드에서 여백이 커짐)
  const [desktopBoxMargin, setDesktopBoxMargin] = useState<{ marginLeftPx: number; widthPx: number } | null>(null);

  // 프로젝트 공통 md: 브레이크포인트(768px)와 동일 기준으로 웹/모바일 판별
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 기기별로 앱스토어/플레이스토어로 자동 분기 (SSR 시점엔 navigator가 없어 iOS를 기본값으로 두고, 마운트 후 안드로이드면 교체)
  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) {
      setAppStoreUrl(ANDROID_APP_URL);
    }
  }, []);

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

  // 내용이 빈 종이 영역보다 길어지는 카드(글자수 긴 메시지/요약)를 위해 전체를 살짝 축소해서 항상 안에 들어오도록 함
  useEffect(() => {
    const el = fitRef.current;
    if (!el || !result) return;
    const outer = el.parentElement;
    if (!outer) return;

    const recompute = () => {
      const raw = el.scrollHeight;
      const avail = outer.clientHeight;
      const scale = raw > avail ? Math.max(avail / raw, 0.5) : 1;
      setFitScale(scale);

      // 웹 요약 박스가 프레임 기준 정확히 16px 여백을 갖도록, fitRef 자기 중심 축소(scale)를 역산
      const frameWidth = captureRef.current?.getBoundingClientRect().width;
      if (frameWidth) {
        const W = frameWidth * 0.74; // fitRef 레이아웃 폭(74% 인셋 컨테이너 기준)
        const insetLeft = frameWidth * 0.13;
        const desiredGap = 16;
        const targetX = -insetLeft + desiredGap;
        const marginLeftPx = W / 2 + (targetX - W / 2) / scale;
        const widthPx = (frameWidth - desiredGap * 2) / scale;
        setDesktopBoxMargin({ marginLeftPx, widthPx });
      }
    };

    setFitScale(1);
    const frame = requestAnimationFrame(recompute);
    window.addEventListener('resize', recompute);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', recompute);
    };
  }, [result, error]);

  const cardName = result?.card_name || card.card_name || '이름 없는 존재';
  const julyTitle = result?.july_title || '';
  const frontImage = card.front_image && card.front_image.trim() !== '' ? card.front_image : null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/ghost-tarot/${result?.id || ''}`;
  const shareText = `👻 ${cardName}\n나에게 붙은 존재가 남긴 기록...\n${julyTitle}\n너에게 찾아온 귀신도 확인해봐`;

  const handleSaveImage = async () => {
    if (captureRef.current) {
      await saveImage(captureRef.current, `${cardName}_귀신타로.png`);
    }
  };

  // "🚨 통장에 구멍난다" → "통장에 구멍난다" — 앞에 붙은 이모지만 제거
  const cleanJulyTitle = (title: string) =>
    title
      .replace(/^[^\p{L}\p{N}]+/u, '')
      .replace(/^7월\s*[:：]?\s*/, '')
      .trim();

  // "해원상생 (축제의 굿판)" → 메인 이름 / 괄호 부제 분리해서 크기 차등
  const cardNameMatch = cardName.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  const cardNameMain = cardNameMatch ? cardNameMatch[1] : cardName;
  const cardNameSub = cardNameMatch ? cardNameMatch[2] : null;

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '0px 16px 140px',
        background: GHOST_PALETTE.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 종이 액자 배경 — width 100%(최대 440/600px)로 브라우저 너비에 맞춰 줄어들고, aspectRatio가 고정돼 있어 안의 내용도 같이 축소됨 */}
      <div
        ref={captureRef}
        className="w-full max-w-[440px] md:max-w-[600px]"
        style={{ position: 'relative', aspectRatio: '864 / 1821' }}
      >
        <Image src="/ghost-tarot/result-bg.png" alt="" fill priority className="object-contain" />

        {/* 빈 종이 영역 안쪽에 결과 정보 배치 (퍼센트 기반이라 액자와 함께 스케일됨) — 리빌 연출 뒤에 이미 완성된 채로 드러남 */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(20% - 8px)',
            left: '13%',
            width: '74%',
            height: '64%',
            overflow: 'hidden',
          }}
        >
          {/* 내용이 긴 카드는 이 래퍼 전체를 축소해서 빈 종이 영역 안에 항상 들어오도록 함 */}
          <div
            ref={fitRef}
            className="flex flex-col items-center text-center"
            style={{ transform: `scale(${fitScale})`, transformOrigin: 'top center' }}
          >
          <div
            ref={dockTargetRef}
            style={{
              width: 'calc(42% + 40px)',
              marginTop: 20,
              aspectRatio: '2 / 3',
              position: 'relative',
              filter: 'drop-shadow(0 10px 24px rgba(0,0,0,.7))',
              flexShrink: 0,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* 흰색 매트 박스 — 카드 이미지 자체 라운딩과 별개로 카드와 세트로 보이는 배경 */}
            <div style={{ position: 'absolute', inset: '-4%', background: '#f7f2e8', borderRadius: 12 }} />

            {frontImage ? (
              <Image src={frontImage} alt={cardName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-black/20 border flex items-center justify-center text-[10px]" style={{ position: 'relative', borderColor: 'rgba(138,109,59,.4)', color: PARCHMENT_INK_DIM }}>
                형상을 불러오는 중...
              </div>
            )}
          </div>

          {/* 카드 이름 — 괄호 부제는 따로 작게 */}
          <h1
            style={{
              marginTop: 'calc(8% + 14px)',
              fontFamily: GHOST_MYUNGJO_FONT,
              fontSize: 23,
              lineHeight: 1.2,
              color: 'rgb(42, 31, 22)',
              WebkitTextStroke: '1px rgb(42, 31, 22)',
              flexShrink: 0,
              letterSpacing: '3px',
            }}
          >
            {cardNameMain}
          </h1>
          {cardNameSub && (
            <span
              style={{
                display: 'block',
                marginTop: 'calc(1.8% + 2px)',
                fontFamily: GHOST_MYUNGJO_FONT,
                fontSize: 12,
                color: 'rgb(82, 67, 54)',
                WebkitTextStroke: '0.5px rgb(82, 67, 54)',
                flexShrink: 0,
                letterSpacing: '-0.2px',
              }}
            >
              ({cardNameSub})
            </span>
          )}

          {result && !error && (
            <>
              {/* 장식 구분선 */}
              <div className="flex items-center justify-center" style={{ marginTop: 'calc(5% + 16px)', gap: 8, width: '60%', flexShrink: 0 }}>
                <span style={{ flex: 1, height: 1, background: PARCHMENT_INK_DIM, opacity: 0.4 }} />
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    backgroundColor: PARCHMENT_INK_DIM,
                    opacity: 0.7,
                    WebkitMaskImage: 'url(/ghost-tarot/chinese-knot.svg)',
                    maskImage: 'url(/ghost-tarot/chinese-knot.svg)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
                <span style={{ flex: 1, height: 1, background: PARCHMENT_INK_DIM, opacity: 0.4 }} />
              </div>

              {/* 7월 · 이번 달 테마 라벨 — 카드 위가 아니라 여기, 하나의 줄로 */}
              <div className="flex items-center justify-center" style={{ marginTop: 'calc(5% + 10px)', flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: GHOST_MYUNGJO_FONT,
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: 'rgb(146 22 0)',
                    WebkitTextStroke: '0.1px rgb(146 22 0)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  7월 · {cleanJulyTitle(julyTitle)}
                </span>
              </div>
            </>
          )}

          {error ? (
            <div style={{ marginTop: '6%' }}>
              <p style={{ color: GHOST_PALETTE.red, fontSize: 'clamp(11px, 2.6vw, 13px)' }}>기록을 불러오지 못했습니다.</p>
            </div>
          ) : !result ? (
            <p className="animate-pulse" style={{ marginTop: '6%', color: PARCHMENT_INK_DIM, fontSize: 'clamp(11px, 2.6vw, 13px)' }}>
              어둠 속의 존재가 기록을 전하고 있습니다...
            </p>
          ) : (
            <div style={{ marginTop: 'calc(4% + 2px)', width: '100%' }}>
              {/* [&_*]:!text-inherit — DB 컨텐츠에 남아있을 수 있는 옛 다크테마용 inline color를 강제로 덮어씀
                  메시지 두 줄을 같은 크기로 통일 — 첫줄만 키우면 두 줄이 서로 다른 요소처럼 끊겨 보임 */}
              <h2
                className="[&_*]:!text-inherit"
                style={{
                  marginTop: 2,
                  fontFamily: GHOST_MYUNGJO_FONT,
                  fontSize: isDesktop ? 34 : 30,
                  lineHeight: 1.65,
                  color: 'rgb(42, 31, 22)',
                  WebkitTextStroke: '1.8px rgb(42, 31, 22)',
                  letterSpacing: '-1.5px',
                  width: 'calc(135.135% + 16px)',
                  marginLeft: 'calc(-17.568% - 8px)',
                  marginRight: 'calc(-17.568% - 8px)',
                }}
                dangerouslySetInnerHTML={{ __html: result.july_message || '' }}
              />

              <div className="flex items-center justify-center" style={{ marginTop: 'calc(4% + 6px)', gap: 8, width: '60%', flexShrink: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                <span style={{ flex: 1, height: 1, background: PARCHMENT_INK_DIM, opacity: 0.4 }} />
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    backgroundColor: PARCHMENT_INK_DIM,
                    opacity: 0.7,
                    WebkitMaskImage: 'url(/ghost-tarot/chinese-knot.svg)',
                    maskImage: 'url(/ghost-tarot/chinese-knot.svg)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
                <span style={{ flex: 1, height: 1, background: PARCHMENT_INK_DIM, opacity: 0.4 }} />
              </div>

              <div
                style={{
                  marginTop: 'calc(6% + 12px)',
                  // 모바일은 프레임 끝까지 채움. 웹은 fitRef 자기 중심 축소(fitScale)를 감안해
                  // 실측 픽셀로 역산한 desktopBoxMargin을 써서 화면에 항상 정확히 16px 여백이 보이게 함
                  width: isDesktop && desktopBoxMargin ? `${desktopBoxMargin.widthPx}px` : '135.135%',
                  marginLeft: isDesktop && desktopBoxMargin ? `${desktopBoxMargin.marginLeftPx}px` : '-17.568%',
                  marginRight: isDesktop && desktopBoxMargin ? `${desktopBoxMargin.marginLeftPx}px` : '-17.568%',
                  background: 'rgb(0 0 0 / 50%)',
                  border: '1px solid rgb(151 138 125 / 27%)',
                  borderRadius: 12,
                  padding: 'calc(4% + 4px) 4%',
                }}
              >
                <p
                  className="[&_*]:!text-inherit"
                  style={{
                    fontFamily: GHOST_MYUNGJO_FONT,
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.95,
                    color: 'rgb(238, 221, 204)',
                    WebkitTextStroke: '0.2px rgb(238, 221, 204)',
                    letterSpacing: '-0.3px',
                  }}
                  dangerouslySetInnerHTML={{ __html: result.july_summary || '' }}
                />
              </div>
            </div>
          )}
          </div>
        </div>

      </div>

      {/* 리빌 연출 오버레이 — 액자(스크롤로 넘칠 수 있음)가 아니라 화면(뷰포트) 기준 position:fixed로 정중앙 고정.
          뽑은 카드가 커지며 두근거리다 뒤집히고(0~2.35s), 실제 결과지 카드 자리로 도킹(2.35~2.85s)한 뒤
          배경만 페이드아웃(2.85~3.3s)돼 이미 자리잡은 결과지가 자연스럽게 이어짐 */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: bgFading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: BG_FADE_DURATION_MS / 1000, ease: 'easeInOut' }}
            className={dockRect ? '' : 'flex items-center justify-center'}
            style={{ position: 'fixed', inset: 0, background: GHOST_PALETTE.bg, zIndex: 10 }}
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
              {/* 차오르는 영혼의 빛 — "결과를 알려줄 것"이라는 긴장감 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.3, 0.9, 0.4], scale: [0.6, 0.9, 1.5, 1.9] }}
                transition={{ duration: 2.1, times: [0, 0.5, 0.8, 1], ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: '10%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${GHOST_PALETTE.red}, transparent 70%)`,
                  filter: 'blur(24px)',
                  zIndex: -1,
                }}
              />

              {/* 휘몰아치는 연기 — 뒤집히는 순간(1.7~2.35s) 카드 주위로 소용돌이치듯 번짐 */}
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

              {/* 카드 본체 — 쫀득하게 커지며 한 번 천천히 두근(~0~1.7s) 뒤 뒤집힘(1.7~2.35s) */}
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
                  {/* 뒷면 */}
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
                    <Image src="/ghost-tarot/card-back.png" alt="" fill className="object-cover" />
                  </div>

                  {/* 앞면 */}
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

      {/* 액자 바깥 하단 — 공유 / 전환 CTA / 다시하기 */}
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
            <p style={{ textAlign: 'center', fontSize: 15, lineHeight: 1.85, color: 'rgb(202 186 172)', marginTop: 16, marginBottom: 8 }}>
              여기서 끝이 아닙니다.
              <br />
              <span style={{ color: 'rgb(179 47 23)', fontWeight: 700 }}>사주GPT</span>에서 이어지는 귀신타로를 확인하세요.
            </p>

            <div style={{ marginTop: 22 }}>
            <PressableButton
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSajuGPTClick('ghost_tarot', result?.id)}
              label={
                <span className="flex items-center justify-center" style={{ gap: 8 }}>
                  귀신타로 이어보기
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="#f5ebe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              }
              style={{ height: 52 }}
              bgStyle={{ backgroundColor: 'rgb(179,47,23)', borderRadius: 12 }}
              hoverBackground="rgb(148,36,17)"
              textStyle={{ fontFamily: GHOST_BRUSH_FONT, fontSize: 21, fontWeight: 400, color: '#f5ebe0', letterSpacing: '1px' }}
            />
            </div>

            <div className="flex" style={{ marginTop: 12, gap: 12 }}>
              <div style={{ flex: 1 }}>
                <PressableButton
                  onClick={onReset}
                  label="테스트 다시하기"
                  style={{ height: 52 }}
                  bgStyle={{ backgroundColor: 'transparent', border: '1.5px solid rgb(179,47,23)', borderRadius: 12 }}
                  hoverBackground="rgba(179,47,23,0.18)"
                  textStyle={{ fontFamily: GHOST_BRUSH_FONT, fontSize: 21, fontWeight: 400, color: '#f5ebe0', letterSpacing: '1px' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <PressableButton
                  onClick={handleSaveImage}
                  label="이미지 저장하기"
                  style={{ height: 52 }}
                  bgStyle={{ backgroundColor: 'transparent', border: '1.5px solid rgb(179,47,23)', borderRadius: 12 }}
                  hoverBackground="rgba(179,47,23,0.18)"
                  textStyle={{ fontFamily: GHOST_BRUSH_FONT, fontSize: 21, fontWeight: 400, color: '#f5ebe0', letterSpacing: '1px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <GhostShareRow shareText={shareText} shareLink={shareUrl} resultId={result?.id} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
