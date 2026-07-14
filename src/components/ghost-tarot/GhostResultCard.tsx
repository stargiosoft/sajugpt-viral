'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import GhostSealButton from './GhostSealButton';
import GhostShareRow from './GhostShareRow';
import PressableButton from '@/components/PressableButton';
import Toast from '@/components/Toast';
import { saveImage, captureCardImage, isMobileDevice } from '@/lib/share';
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

// 요약 박스 모서리를 안쪽으로 오목하게 파낸(concave notch) 패스 — 실제 박스 px 크기(w,h) 기준으로 그려서
// 가로로 긴 박스에도 모서리 원호가 찌그러지지 않고 항상 정원으로 유지됨
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
  // 320px급 좁은 화면(아이폰 SE 등) 전용 분기 — isDesktop(768px 기준)과 별개
  const [isNarrow, setIsNarrow] = useState(false);
  const notchBoxRef = useRef<HTMLDivElement>(null);
  const [notchSize, setNotchSize] = useState({ w: 300, h: 100 });
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveResetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 저장 성공 시 "✓ 저장됨"으로 2.5초간 표시한 뒤 원래 상태로 복귀
  const showSavedState = () => {
    setSaveState('saved');
    clearTimeout(saveResetTimerRef.current);
    saveResetTimerRef.current = setTimeout(() => setSaveState('idle'), 2500);
  };

  // 프로젝트 공통 md: 브레이크포인트(768px)와 동일 기준으로 웹/모바일 판별
  useEffect(() => {
    const update = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsNarrow(window.innerWidth <= 360);
    };
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
      // 320px급 좁은 화면은 줄바꿈이 늘어 꽉 채운 스케일이 되기 쉬워 바닥에 붙어 보임 — 여유 16px 확보
      const avail = outer.clientHeight - (window.innerWidth <= 360 ? 16 : 0);
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

  // 요약 박스의 실제 렌더 px 크기를 측정 — notchPath가 이 크기를 그대로 써서 모서리 원호가 찌그러지지 않게 함
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
  const julyTitle = result?.july_title || '';
  const frontImage = card.front_image && card.front_image.trim() !== '' ? card.front_image : null;

  // 공유 링크는 내 결과 페이지가 아니라 첫 시작 화면으로 — 받은 사람이 직접 뽑아보게 유도
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/ghost-tarot`;
  const shareText = `👻 ${cardName}\n나에게 붙은 존재가 남긴 기록...\n${julyTitle}\n너에게 찾아온 귀신도 확인해봐`;

  // 모바일은 <a download>가 사진앱에 바로 저장되지 않고 파일앱/새 탭으로 빠지므로
  // Web Share API로 "사진에 저장" 옵션이 있는 네이티브 공유 시트를 띄움 (지원 안 하거나 취소되면 다운로드로 폴백)
  const handleSaveImage = async () => {
    if (!captureRef.current || saveState === 'saving') return;
    const filename = `${cardName}_귀신타로.png`;
    setSaveState('saving');

    if (isMobileDevice() && navigator.share) {
      try {
        const blob = await captureCardImage(captureRef.current);
        const file = new File([blob], filename, { type: 'image/png' });
        await navigator.share({ files: [file] });
        showSavedState();
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // 사용자가 공유 시트를 취소함 — 실패가 아니므로 다운로드로 폴백하지 않고 그대로 원상태 복귀
          setSaveState('idle');
          return;
        }
        /* 파일 공유 미지원 등 진짜 실패 — 아래 다운로드로 폴백 */
      }
    }

    try {
      await saveImage(captureRef.current, filename);
      showSavedState();
    } catch {
      setSaveState('idle');
      setSaveError('이미지 저장에 실패했어요. 다시 시도해주세요.');
      setTimeout(() => setSaveError(null), 2500);
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
        style={{
          position: 'relative',
          aspectRatio: '863 / 1823',
          // 모바일만 부모의 좌우 16px 패딩을 상쇄해 이미지가 화면 끝까지 닿게 함 (버튼 영역 패딩은 그대로 유지)
          ...(isDesktop ? {} : { width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16 }),
        }}
      >
        <Image src={isDesktop ? '/ghost-tarot/result-bg.png' : '/ghost-tarot/result-bg-mobile.png'} alt="" fill priority className="object-contain" />

        {/* 빈 종이 영역 안쪽에 결과 정보 배치 (퍼센트 기반이라 액자와 함께 스케일됨) — 리빌 연출 뒤에 이미 완성된 채로 드러남
            모바일 전용 배경(result-bg-mobile.png)의 종이 폭 실측값 기준으로 좌우 인셋 계산 */}
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
          {/* 내용이 긴 카드는 이 래퍼 전체를 축소해서 빈 종이 영역 안에 항상 들어오도록 함 */}
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
          </div>

          {/* 카드 이름 — 괄호 부제는 따로 작게
              모바일(iOS Safari)에서 -webkit-text-stroke가 조상(fitRef)의 transform: scale()에 딸려
              한 비트맵으로 합성되면 스트로크 안티앨리어싱이 깨져 거칠어 보임 →
              translateZ(0)로 별도 레이어로 분리해 자체 해상도로 다시 래스터라이즈되게 함
              (font-smoothing: antialiased는 저장 이미지 대비 브라우저 스트로크가 과하게 쨍해 보이는
              원인이라 제외 — 기본값이 더 부드러움) */}
          <h1
            style={{
              marginTop: isDesktop ? 'calc(7% - 6px)' : 'calc(7% + 0px)',
              fontFamily: GHOST_MYUNGJO_FONT,
              fontSize: isDesktop ? 22 : (isNarrow ? 17 : 18),
              lineHeight: 1.2,
              color: 'rgb(42, 31, 22)',
              WebkitTextStroke: isDesktop ? '1.4px rgb(42, 31, 22)' : '1px rgb(42, 31, 22)',
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
                fontFamily: GHOST_MYUNGJO_FONT,
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

          {result && !error && (
            <>
              {/* 장식 구분선 */}
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
                <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${PARCHMENT_INK_DIM} 0%, transparent 100%)`, opacity: 0.4 }} />
              </div>

              {/* 7월 · 이번 달 테마 라벨 — 붓으로 슥 칠한 자국(SVG 거친 가장자리) 위에 얹음.
                  이미지 대신 SVG feTurbulence로 만들어서 텍스트 길이가 바뀌어도 항상 자연스럽게 늘어남 */}
              <div className="flex items-center justify-center" style={{ marginTop: isDesktop ? 'calc(5% + 14px)' : (isNarrow ? 'calc(5% + 6px)' : 'calc(5% + 10px)'), flexShrink: 0 }}>
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: GHOST_MYUNGJO_FONT,
                    fontSize: isDesktop ? 14.5 : (isNarrow ? 12 : 13),
                    fontWeight: 600,
                    color: '#FCF9EF',
                    WebkitTextStroke: '0px #FCF9EF',
                    letterSpacing: '-0.5px',
                    padding: isDesktop ? '11.5px 46px 10px' : '9.5px 46px 8px',
                  }}
                >
                  {/* 실제 붓터치 텍스처 에셋을 좌/중/우 3분할 background-image로 얹음 — 좌우 붓 갈라진 끝단(캡)은
                      원본 픽셀 비율 그대로 고정되고 가운데만 늘어남. border-image 대신 background-image를 쓴 이유는
                      "이미지 저장하기"(html-to-image)가 border-image를 캡처하지 못해 저장된 이미지에서 배경이 빠지기 때문 */}
                  <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, display: 'flex' }}>
                    <div style={{ width: 34, flexShrink: 0, backgroundImage: 'url(/ghost-tarot/july-badge-brush.webp)', backgroundSize: '1114.48% 100%', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' }} />
                    <div style={{ flex: 1, backgroundImage: 'url(/ghost-tarot/july-badge-brush.webp)', backgroundSize: '121.87% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
                    <div style={{ width: 34, flexShrink: 0, backgroundImage: 'url(/ghost-tarot/july-badge-brush.webp)', backgroundSize: '1114.48% 100%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }} />
                  </div>
                  <span
                    style={{
                      position: 'relative',
                      textRendering: 'optimizeLegibility',
                      transform: 'translateZ(0)',
                    }}
                  >
                    7월 · {cleanJulyTitle(julyTitle)}
                  </span>
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
            <div style={{ marginTop: isDesktop ? 14 : 16, width: '100%' }}>
              {/* 메시지 두 줄을 같은 크기로 통일 — 첫줄만 키우면 두 줄이 서로 다른 요소처럼 끊겨 보임 */}
              <h2
                style={{
                  marginTop: 0,
                  fontFamily: GHOST_MYUNGJO_FONT,
                  fontSize: isDesktop ? 30 : (isNarrow ? 21 : 26),
                  lineHeight: isDesktop ? 1.6 : 1.6,
                  color: 'rgb(42, 31, 22)',
                  WebkitTextStroke: isDesktop ? '1.6px rgb(42, 31, 22)' : '1.3px rgb(42, 31, 22)',
                  textShadow: '0 1px 3px rgba(247,242,232,0.55)',
                  // 기존 모바일(390px대) -1.5px는 데스크탑(-0.5px)의 3배로 과도하게 좁아서
                  // 두꺼운 스트로크와 맞물려 글자끼리 겹쳐 보였음 — 데스크탑/320px대와 동일하게 통일
                  letterSpacing: '-0.5px',
                  // 좌우 12px 여백만 두고 나머지는 꽉 채움
                  width: 'auto',
                  marginLeft: 12,
                  marginRight: 12,
                  textRendering: 'optimizeLegibility',
                  transform: 'translateZ(0)',
                }}
              >
                <span
                  className="[&_*]:!text-inherit"
                  dangerouslySetInnerHTML={{ __html: result?.july_message || '' }}
                />
              </h2>

              <div className="flex items-center justify-center" style={{ marginTop: isDesktop ? 'calc(4% + 10px)' : 'calc(4% + 6px)', width: '74%', flexShrink: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                <span style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent 0%, ${PARCHMENT_INK_DIM} 50%, transparent 100%)`, opacity: 0.4 }} />
              </div>

              {/* 결과 요약 박스 — 모서리가 안쪽으로 둥글게 파인 이중 테두리 종이 카드 느낌 */}
              <div
                ref={notchBoxRef}
                style={{
                  position: 'relative',
                  marginTop: isDesktop ? 'calc(6% + 12px)' : 'calc(6% + 8px)',
                  // 웹은 종이 좌우 끝에서 16px 여백 — fitRef 자체가 이미 종이 폭과 같으므로
                  // bleed용 음수 마진(-16.446%) 없이 100% 기준으로 직접 계산해야 실제로 인셋이 생김
                  // 모바일은 콘텐츠 영역(fitRef) 기준 좌우 여백 (종이 배경에 안 닿게 폭 축소)
                  // 320px급은 박스 너비 +16px(여백 -8px씩), 390px급 이상은 -16px(여백 +8px씩)
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
                    {/* 중심에서 가장자리로 갈수록 짙어지는 비대칭 그라데이션 — 낡은 종이가 고르지 않게 바랜 느낌 */}
                    <radialGradient id="ghost-notch-fill" cx="38%" cy="32%" r="85%">
                      <stop offset="0%" stopColor="rgba(96,74,48,0.015)" />
                      <stop offset="50%" stopColor="rgba(84,64,42,0.04)" />
                      <stop offset="80%" stopColor="rgba(74,56,36,0.07)" />
                      <stop offset="100%" stopColor="rgba(64,48,30,0.1)" />
                    </radialGradient>
                    {/* 반대쪽 모서리에 덧대는 얼룩 — 한쪽만 바랜 느낌을 깨서 고르지 않게 헤진 느낌 강조 */}
                    <radialGradient id="ghost-notch-stain" cx="78%" cy="82%" r="65%">
                      <stop offset="0%" stopColor="rgba(60,44,26,0.08)" />
                      <stop offset="55%" stopColor="rgba(60,44,26,0.025)" />
                      <stop offset="100%" stopColor="rgba(60,44,26,0)" />
                    </radialGradient>
                    {/* 테두리 선도 균일하지 않게 — 진하다 옅어지길 반복해 실이 헤진 듯한 느낌 */}
                    <linearGradient id="ghost-notch-stroke-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(96,74,48,0.36)" />
                      <stop offset="16%" stopColor="rgba(96,74,48,0.12)" />
                      <stop offset="32%" stopColor="rgba(96,74,48,0.32)" />
                      <stop offset="50%" stopColor="rgba(96,74,48,0.1)" />
                      <stop offset="68%" stopColor="rgba(96,74,48,0.3)" />
                      <stop offset="84%" stopColor="rgba(96,74,48,0.11)" />
                      <stop offset="100%" stopColor="rgba(96,74,48,0.32)" />
                    </linearGradient>
                    <linearGradient id="ghost-notch-stroke-inner" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(96,74,48,0.22)" />
                      <stop offset="20%" stopColor="rgba(96,74,48,0.06)" />
                      <stop offset="38%" stopColor="rgba(96,74,48,0.2)" />
                      <stop offset="56%" stopColor="rgba(96,74,48,0.05)" />
                      <stop offset="74%" stopColor="rgba(96,74,48,0.18)" />
                      <stop offset="100%" stopColor="rgba(64,52,38,0.1)" />
                    </linearGradient>
                  </defs>
                  <path d={notchPath(notchSize.w, notchSize.h, 3, 14)} fill="url(#ghost-notch-fill)" stroke="url(#ghost-notch-stroke-outer)" strokeWidth={isDesktop ? 0.8 : 1} />
                  <path d={notchPath(notchSize.w, notchSize.h, 3, 14)} fill="url(#ghost-notch-stain)" />
                  <path d={notchPath(notchSize.w, notchSize.h, 9, 11)} fill="none" stroke="url(#ghost-notch-stroke-inner)" strokeWidth={0.65} />
                </svg>
                <p
                  className="[&_*]:!text-inherit"
                  style={{
                    position: 'relative',
                    fontFamily: GHOST_MYUNGJO_FONT,
                    fontSize: isDesktop ? 14.5 : (isNarrow ? 13 : 13),
                    fontWeight: 600,
                    lineHeight: isDesktop ? 1.75 : 1.75,
                    color: 'rgb(42, 31, 22)',
                    WebkitTextStroke: isDesktop ? '0.2px rgb(42, 31, 22)' : (isNarrow ? '0.1px rgb(42, 31, 22)' : '0.1px rgb(42, 31, 22)'),
                    letterSpacing: isDesktop ? '-0.5px' : '-0.3px',
                    marginTop: isDesktop ? 0 : 2,
                  }}
                  dangerouslySetInnerHTML={{ __html: result?.july_summary || '' }}
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
            <div style={{ marginTop: 22 }}>
            <PressableButton
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSajuGPTClick('ghost_tarot', result?.id)}
              label={
                <span className="flex items-center justify-center" style={{ gap: 8 }}>
                  귀신타로 이어보기 <span style={{ position: 'relative', top: isDesktop ? '-0.5px' : '0px', fontFamily: 'Pretendard', fontSize: isDesktop ? '13.5px' : (isNarrow ? '12.5px' : '13.5px'), fontWeight: 700 }}>(사주<span style={{ fontSize: isDesktop ? '14px' : (isNarrow ? '13px' : '14px') }}>GPT</span>)</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="#f5ebe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              }
              style={{ height: isDesktop ? 52 : (isNarrow ? 48 : 52) }}
              bgStyle={{ backgroundColor: 'rgb(179,47,23)', borderRadius: 12 }}
              shineColor="rgba(150,39,20,0.55)"
              textStyle={{ fontFamily: GHOST_BRUSH_FONT, fontSize: isDesktop ? 21 : (isNarrow ? 20 : 21), fontWeight: 400, color: '#f5ebe0', letterSpacing: '1px' }}
            />
            </div>

            <div style={{ marginTop: 12 }}>
                <PressableButton
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
                  style={{ height: isDesktop ? 52 : (isNarrow ? 48 : 52) }}
                  bgStyle={{
                    backgroundColor: saveState === 'saved' ? 'rgba(179,47,23,0.18)' : 'transparent',
                    border: '1.5px solid rgb(179,47,23)',
                    borderRadius: 12,
                  }}
                  hoverBackground="rgba(179,47,23,0.18)"
                  textStyle={{ fontFamily: GHOST_BRUSH_FONT, fontSize: isDesktop ? 21 : (isNarrow ? 20 : 21), fontWeight: 400, color: '#f5ebe0', letterSpacing: '1px' }}
                />
            </div>

            <div style={{ marginTop: 28 }}>
              <GhostShareRow shareText={shareText} shareLink={shareUrl} resultId={result?.id} />
            </div>
          </>
        )}
      </motion.div>

      <Toast message={saveError} />
    </div>
  );
}
