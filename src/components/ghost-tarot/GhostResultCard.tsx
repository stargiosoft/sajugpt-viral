'use client';

import { useState, type RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { saveImage, copyToClipboard } from '@/lib/share';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import { GhostResult } from '@/types/ghost-tarot';

interface Props {
  result: GhostResult;
  cardRef: RefObject<HTMLDivElement | null>;
  onReset: () => void;
}

export default function GhostResultCard({ result, cardRef, onReset }: Props) {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // 데이터가 유효하지 않을 때를 대비 기본값 가드
  const cardName = result?.card_name || '이름 없는 존재';
  const julyTitle = result?.july_title || '';
  const augustTitle = result?.august_title || '';
  const frontImage = result?.front_image && result.front_image.trim() !== '' ? result.front_image : null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/ghost-tarot/${result?.id || ''}`;

  const shareText = `
👻 ${cardName}
나에게 붙은 존재가 남긴 기록...
${julyTitle}
${augustTitle}
너에게 찾아온 귀신도 확인해봐
👉 ${shareUrl}
`;

  const nextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareText);
    if (ok) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleSaveImage = async () => {
    if (cardRef.current) {
      await saveImage(cardRef.current, `${cardName}_귀신타로.png`);
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardName}의 귀신 기록`,
          text: shareText,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const sceneVariants = {
    initial: {
      opacity: 0,
      y: 40,
      filter: 'blur(10px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0)',
      transition: { duration: 0.6 },
    },
    exit: {
      opacity: 0,
      y: -40,
      filter: 'blur(10px)',
      transition: { duration: 0.3 },
    },
  };

  const getTitleColor = (title: string) => {
    if (!title) return '#c084fc';
    if (title.includes('경고') || title.includes('🚨')) {
      return '#ef4444';
    }
    return '#c084fc';
  };

  const getShadowColor = (title: string) => {
    if (!title) return 'rgba(192,132,252,.6)';
    if (title.includes('경고') || title.includes('🚨')) {
      return 'rgba(239,68,68,.5)';
    }
    return 'rgba(192,132,252,.6)';
  };

  if (!result) {
    return <div className="text-white text-center p-10">존재의 기록을 불러오지 못했습니다.</div>;
  }

  return (
    <div
      onClick={nextStep}
      style={{
        minHeight: '100dvh',
        padding: '50px 16px 40px',
        background: 'radial-gradient(circle at top, #3b0764 0%, #10051c 40%, #020203 100%)',
        overflow: 'hidden',
        position: 'relative',
        cursor: step < 3 ? 'pointer' : 'default',
      }}
    >
      {/* 진행 바 */}
      <div
        className="flex gap-2"
        style={{
          position: 'absolute',
          top: 24,
          left: 20,
          right: 20,
        }}
      >
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 10,
              background: i <= step ? '#c084fc' : 'rgba(255,255,255,.15)',
              boxShadow: i <= step ? '0 0 10px #c084fc' : 'none',
            }}
          />
        ))}
      </div>

      <div ref={cardRef} className="flex justify-center">
        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <p style={{ fontSize: 11, letterSpacing: 6, color: '#c084fc', fontWeight: 800 }}>
                당신을 기다리던 운명과 마주하세요
              </p>

              <h1 style={{ marginTop: 15, fontSize: 32, fontWeight: 900, color: '#fff', textShadow: '0 0 30px #9333ea' }}>
                {cardName}
              </h1>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  marginTop: 35,
                  width: 220,
                  height: 330,
                  position: 'relative',
                  filter: 'drop-shadow(0 0 40px rgba(168,85,247,.8))',
                }}
              >
                {frontImage ? (
                  <Image src={frontImage} alt={cardName} fill priority className="rounded-2xl object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-950/40 rounded-2xl border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs">
                    형상을 불러오는 중...
                  </div>
                )}
              </motion.div>

              <p className="animate-pulse" style={{ marginTop: 40, color: '#c4b5fd', fontSize: 14 }}>
                ▼ 손끝으로 다음 기록을 확인하세요
              </p>
            </motion.div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center flex flex-col items-center"
            >
              <div style={{ width: 70, height: 105, position: 'relative', marginBottom: 25, filter: `drop-shadow(0 0 20px ${getShadowColor(julyTitle)})` }}>
                {frontImage && <Image src={frontImage} alt="" fill className="object-cover rounded-lg" />}
              </div>

              <span style={{ color: getTitleColor(julyTitle), fontWeight: 900, fontSize: 14, letterSpacing: 2 }}>
                {julyTitle}
              </span>

              <h2
                style={{ marginTop: 20, fontSize: 22, fontWeight: 900, lineHeight: 1.8, color: '#fff' }}
                dangerouslySetInnerHTML={{ __html: result.july_message || '' }}
              />

              <p style={{ marginTop: 20, maxWidth: 330, fontSize: 15, lineHeight: 1.9, color: '#c4b5d9' }}>
                {result.july_summary || ''}
              </p>

              <p className="animate-pulse" style={{ marginTop: 40, color: '#7c6f94' }}>
                다음 기록을 확인하세요 ▶
              </p>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center flex flex-col items-center"
            >
              <div style={{ width: 70, height: 105, position: 'relative', marginBottom: 25, filter: `drop-shadow(0 0 20px ${getShadowColor(augustTitle)})` }}>
                {frontImage && <Image src={frontImage} alt="" fill className="object-cover rounded-lg" />}
              </div>

              <span style={{ color: getTitleColor(augustTitle), fontWeight: 900, fontSize: 14, letterSpacing: 2 }}>
                {augustTitle}
              </span>

              <h2
                style={{ marginTop: 20, fontSize: 22, fontWeight: 900, lineHeight: 1.8, color: '#fff' }}
                dangerouslySetInnerHTML={{ __html: result.august_message || '' }}
              />

              <p style={{ marginTop: 20, maxWidth: 330, fontSize: 15, lineHeight: 1.9, color: '#c4b5d9' }}>
                {result.august_summary || ''}
              </p>

              <p className="animate-pulse" style={{ marginTop: 40, color: '#7c6f94' }}>
                마지막 비책을 확인하세요 ▶
              </p>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '32px 22px',
                  borderRadius: 22,
                  background: 'linear-gradient(145deg,#1c0a2d,#050208)',
                  border: '1px solid rgba(248,113,113,.5)',
                  boxShadow: '0 0 50px rgba(239,68,68,.35)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 11, letterSpacing: 5, color: '#f87171', fontWeight: 900 }}>
                  FINAL PROPHECY
                </p>

                <h3 style={{ marginTop: 18, fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.5 }}>
                  {result.solution_title || ''}
                </h3>

                <div style={{ marginTop: 20, padding: 18, borderRadius: 14, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
                  <p style={{ fontSize: 15, lineHeight: 1.9, color: '#ddd6fe', wordBreak: 'keep-all' }}>
                    {result.solution_message || ''}
                  </p>
                </div>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ marginTop: 28, color: '#fca5a5', fontSize: 13 }}
                >
                  🩸 이 기록은 아직 끝나지 않았습니다
                </motion.div>
              </div>

              {/* 공유 영역 */}
              <div className="flex flex-col gap-3" style={{ marginTop: 30 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareNative();
                  }}
                  style={{
                    width: '100%',
                    height: 54,
                    borderRadius: 16,
                    border: 'none',
                    background: 'linear-gradient(90deg,#581c87,#7c3aed)',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 800,
                    boxShadow: '0 0 30px rgba(124,58,237,.5)',
                  }}
                >
                  👁 내 귀신 기록 공유하기
                </button>

                <div className="flex gap-3">
                  {/* 💡 명시적 인자 타입을 제거하여 OutlineBoxButton 프롭 정의와 타입 호환이 자동으로 맞물리게 수정 */}
                  <OutlineBoxButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    className="flex-1"
                    background="#161224"
                    border="1px solid #34244f"
                    color="#ddd6fe"
                  >
                    {copied ? '복사됨!' : '🔗 기록 복사'}
                  </OutlineBoxButton>

                  <OutlineBoxButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveImage();
                    }}
                    className="flex-1"
                    background="#161224"
                    border="1px solid #34244f"
                    color="#ddd6fe"
                  >
                    💾 서찰 저장
                  </OutlineBoxButton>
                </div>

                <OutlineBoxButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onReset();
                  }}
                  height="44px"
                  border="1px solid #34244f"
                  color="#a78bfa"
                >
                  다른 존재 만나기
                </OutlineBoxButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}