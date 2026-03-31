'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { ScoreTable, FinalizeDatingResultResponse } from '@/types/dating';
import { DATING_CHARACTERS, getScoreLabel, getPercentileBadge } from '@/constants/dating-characters';
import { saveImage, copyToClipboard, shareKakao } from '@/lib/share';
import { trackShare, trackSajuGPTClick } from '@/lib/analytics';

interface Props {
  characterId: string;
  scoreTable: ScoreTable;
  success: boolean;
  finalResult: FinalizeDatingResultResponse | null;
  earlyExitTurn?: number;
  attemptNumber: number;
  resultId: string;
  onRetry: (sameCharacter: boolean) => void;
}

// ── 점수 바 컬러 ──
const SCORE_COLORS: Record<string, { bar: string; bg: string }> = {
  charm:        { bar: '#e89bab', bg: '#FFF0F4' },
  conversation: { bar: '#7A38D8', bg: '#EDE5F7' },
  sense:        { bar: '#4488FF', bg: '#E8F0FF' },
  addiction:    { bar: '#F59E0B', bg: '#FFF5E0' },
};

const SCORE_ICONS: Record<string, string> = {
  charm: '💗',
  conversation: '💬',
  sense: '✨',
  addiction: '🔥',
};

// ── 점수 바 ──
function ScoreBar({ scoreKey, label, score, isLowest, delay }: {
  scoreKey: string; label: string; score: number; isLowest: boolean; delay: number;
}) {
  const percent = (score / 10) * 100;
  const colors = SCORE_COLORS[scoreKey] ?? { bar: '#7A38D8', bg: '#EDE5F7' };
  const icon = SCORE_ICONS[scoreKey] ?? '●';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center"
      style={{ gap: '10px' }}
    >
      <div className="flex items-center flex-shrink-0" style={{ width: '68px', gap: '6px' }}>
        <span style={{ fontSize: '13px', color: isLowest ? '#D4627A' : '#848484', lineHeight: 1 }}>
          {icon}
        </span>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '13px',
          fontWeight: isLowest ? 600 : 500,
          lineHeight: '20px',
          letterSpacing: '-0.3px',
          color: isLowest ? '#D4627A' : '#525252',
        }}>
          {label}
        </span>
      </div>
      <div
        className="flex-1 overflow-hidden"
        style={{ height: '8px', borderRadius: '9999px', backgroundColor: colors.bg }}
      >
        <motion.div
          className="h-full"
          style={{
            backgroundColor: isLowest ? '#D4627A' : colors.bar,
            borderRadius: '9999px',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, delay: delay + 0.15, ease: 'easeOut' }}
        />
      </div>
      <span className="flex-shrink-0" style={{
        fontFamily: 'Pretendard Variable, sans-serif',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '-0.42px',
        color: isLowest ? '#D4627A' : '#151515',
        width: '32px',
        textAlign: 'right',
      }}>
        {score}
      </span>
    </motion.div>
  );
}

// ── 원형 점수 링 ──
function ScoreRing({ score, color }: { score: number; color: string }) {
  const circumference = 2 * Math.PI * 50;
  const strokeDash = ((score / 10) * 100 / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: '120px', height: '120px' }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#EDE5F7" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="50" fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${strokeDash} ${circumference - strokeDash}` }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '32px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color,
          lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          color: '#b7b7b7',
          marginTop: '2px',
        }}>
          / 10
        </span>
      </div>
    </div>
  );
}

// ── 디자인 시스템 버튼 ──
function DSButton({ children, variant, onClick, href }: {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  href?: string;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      height: '56px',
      borderRadius: '16px',
      backgroundColor: '#7A38D8',
      border: 'none',
      color: '#ffffff',
      fontWeight: 500,
    },
    secondary: {
      height: '56px',
      borderRadius: '16px',
      backgroundColor: '#F7F2FA',
      border: 'none',
      color: '#7A38D8',
      fontWeight: 500,
    },
    ghost: {
      height: '56px',
      borderRadius: '16px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#848484',
      fontWeight: 500,
    },
  };
  const style = styles[variant];

  const baseStyle: React.CSSProperties = {
    ...style,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Pretendard Variable, sans-serif',
    fontSize: '16px',
    lineHeight: '25px',
    letterSpacing: '-0.32px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
    textDecoration: 'none',
  };

  if (href) {
    return (
      <a href={href} style={baseStyle}
        onPointerDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.99)'; }}
        onPointerLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; }}
        onPointerUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; }}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} style={baseStyle}
      onPointerDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.99)';
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#5E28AB';
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = '';
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#7A38D8';
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = '';
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#7A38D8';
      }}
    >
      {children}
    </button>
  );
}

// ── 메인 컴포넌트 ──
export default function DatingResult({
  characterId,
  scoreTable,
  success,
  finalResult,
  earlyExitTurn,
  attemptNumber,
  resultId,
  onRetry,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const character = DATING_CHARACTERS.find(c => c.id === characterId);
  const charName = character?.name ?? '캐릭터';
  const badge = finalResult ? getPercentileBadge(finalResult.percentile, finalResult.totalCount) : null;
  const accentColor = success ? '#e89bab' : '#D4627A';

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dating-sim/${resultId}` : '';

  const handleSaveImage = async () => {
    if (cardRef.current) {
      await saveImage(cardRef.current, `데이트시뮬_${charName}_결과.png`);
      trackShare('dating', 'image_save', resultId);
    }
  };
  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    trackShare('dating', 'clipboard', resultId);
    alert('링크가 복사되었습니다!');
  };
  const handleShareKakao = () => {
    const ok = shareKakao({
      title: `${charName}한테 ${scoreTable.total}점 받았대ㅋㅋ`,
      description: finalResult
        ? `${finalResult.totalCount.toLocaleString()}명 중 ${finalResult.userRank.toLocaleString()}등. 너는 몇 점 받을 수 있어?`
        : '너는 몇 점 받을 수 있어?',
      link: shareUrl,
      buttonText: '나도 도전하기',
    });
    if (ok) trackShare('dating', 'kakao', resultId);
  };

  const scoreKeys = ['charm', 'conversation', 'sense', 'addiction'] as const;

  return (
    <div className="bg-white relative min-h-screen w-full flex justify-center">
      <div className="w-full max-w-[440px] relative" style={{ backgroundColor: '#ffffff' }}>

        {/* ─── 성공/실패 헤더 ─── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
          style={{ padding: '40px 20px 20px' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
            style={{ fontSize: '44px', marginBottom: '12px' }}
          >
            {success ? '🎉' : '💔'}
          </motion.div>
          <h2 style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: '32.5px',
            letterSpacing: '-0.22px',
            color: accentColor,
          }}>
            {success ? '데이트 승낙!' : '데이트 거절...'}
          </h2>
          {earlyExitTurn && (
            <p style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '-0.3px',
              color: '#D4627A',
              marginTop: '4px',
            }}>
              {earlyExitTurn}턴 만에 조기 종료됨
            </p>
          )}
          {attemptNumber > 1 && (
            <p style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '-0.24px',
              color: '#b7b7b7',
              marginTop: '4px',
            }}>
              {attemptNumber}번째 도전
            </p>
          )}
        </motion.div>

        {/* ─── 결과 카드 (캡처 대상) ─── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div
            ref={cardRef}
            className="overflow-hidden"
            style={{
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* 캐릭터 헤더 */}
            <div
              className="flex items-center"
              style={{
                padding: '16px 20px',
                gap: '12px',
                background: success
                  ? 'linear-gradient(135deg, #c87d94 0%, #e89bab 100%)'
                  : 'linear-gradient(135deg, #B5546A 0%, #D4627A 100%)',
              }}
            >
              <div
                className="overflow-hidden flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '9999px',
                  border: '2px solid rgba(255,255,255,0.4)',
                }}
              >
                <img
                  src={character?.thumbnail ?? ''} alt={charName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '22px',
                  letterSpacing: '-0.32px',
                  color: '#ffffff',
                }}>
                  {charName}의 채점표
                </p>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  letterSpacing: '-0.24px',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  {character?.archetype}
                </p>
              </div>
            </div>

            {/* 점수 바 */}
            <div className="flex flex-col" style={{ padding: '20px 20px 16px', gap: '12px' }}>
              {scoreKeys.map((key, i) => (
                <ScoreBar
                  key={key}
                  scoreKey={key}
                  label={getScoreLabel(key)}
                  score={scoreTable[key]}
                  isLowest={scoreTable.lowestKey === key}
                  delay={0.08 * i}
                />
              ))}
            </div>

            {/* 구분선 */}
            <div style={{ margin: '0 20px', height: '1px', backgroundColor: '#f3f3f3' }} />

            {/* 총점 원형 링 */}
            <div className="flex flex-col items-center" style={{ padding: '24px 20px' }}>
              <ScoreRing score={scoreTable.total} color={accentColor} />

              {finalResult && finalResult.totalCount >= 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col items-center"
                  style={{ marginTop: '16px', gap: '4px' }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    letterSpacing: '-0.42px',
                    color: '#6d6d6d',
                  }}>
                    전체 도전자{' '}
                    <span style={{ fontWeight: 700, color: '#151515' }}>
                      {finalResult.totalCount.toLocaleString()}명
                    </span>
                    {' '}중{' '}
                    <span style={{ fontWeight: 700, color: accentColor }}>
                      {finalResult.userRank.toLocaleString()}등
                    </span>
                  </p>
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '-0.24px',
                    color: '#b7b7b7',
                  }}>
                    상위 {finalResult.percentile}%
                  </p>
                  {badge && (
                    <span style={{
                      marginTop: '4px',
                      padding: '4px 14px',
                      borderRadius: '4px',
                      backgroundColor: `${badge.color}14`,
                      border: `1px solid ${badge.color}28`,
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '-0.24px',
                      color: badge.color,
                    }}>
                      {badge.label}
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* 팩폭 한줄 */}
            {finalResult?.verdict.oneLineVerdict && (
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  backgroundColor: '#FFF5F7',
                  border: '1px solid #f5dde2',
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    letterSpacing: '-0.45px',
                    color: '#9E4A5E',
                  }}>
                    &ldquo;{finalResult.verdict.oneLineVerdict}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* 워터마크 */}
            <p style={{
              textAlign: 'center',
              paddingBottom: '16px',
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              color: '#d0d0d0',
            }}>
              sajugpt-viral.vercel.app
            </p>
          </div>
        </div>

        {/* ─── 사주 분석 카드 ─── */}
        {finalResult?.verdict.sajuAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ padding: '0 20px 16px' }}
          >
            <div style={{
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
            }}>
              <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#7A38D8' }}>✦</span>
                <h3 style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  letterSpacing: '-0.45px',
                  color: '#151515',
                }}>
                  사주가 말하는 당신의 연애 약점
                </h3>
              </div>

              <p style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                letterSpacing: '-0.42px',
                color: '#6d6d6d',
                marginBottom: '12px',
              }}>
                {finalResult.verdict.sajuAnalysis}
              </p>

              {finalResult.verdict.patterns.length > 0 && (
                <div className="flex flex-col" style={{ gap: '6px', marginBottom: '12px' }}>
                  {finalResult.verdict.patterns.map((p, i) => (
                    <div key={i} className="flex items-start" style={{ gap: '8px' }}>
                      <span style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '12px',
                        color: '#7A38D8',
                        marginTop: '3px',
                        flexShrink: 0,
                      }}>→</span>
                      <p style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '13px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        letterSpacing: '-0.3px',
                        color: '#848484',
                      }}>{p}</p>
                    </div>
                  ))}
                </div>
              )}

              {finalResult.sameIlganCount > 0 && (
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '16px',
                  backgroundColor: '#FAF8FC',
                }}>
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '-0.3px',
                    color: '#7A38D8',
                  }}>
                    같은 사주 유저 평균: {finalResult.sameIlganAvg}점 / 당신: {scoreTable.total}점
                    {scoreTable.total < finalResult.sameIlganAvg ? ' (평균 이하)' : ' (평균 이상)'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── 공유 버튼 (디자인 시스템 2버튼 변형) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          style={{ padding: '0 20px 12px' }}
        >
          <div className="flex" style={{ gap: '12px' }}>
            <button
              onClick={handleShareKakao}
              className="flex-1 flex items-center justify-center cursor-pointer"
              style={{
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#FEE500',
                border: 'none',
                gap: '8px',
                transition: 'transform 0.1s ease',
              }}
              onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)'; }}
              onPointerLeave={(e) => { e.currentTarget.style.transform = ''; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.58 1 1 3.87 1 7.38c0 2.23 1.48 4.18 3.72 5.3-.16.58-.58 2.1-.67 2.43-.1.4.15.4.31.29.13-.08 2.03-1.38 2.86-1.94.57.08 1.16.12 1.78.12 4.42 0 8-2.87 8-6.38S13.42 1 9 1z" fill="#3C1E1E"/>
              </svg>
              <span style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '-0.32px',
                color: '#3C1E1E',
              }}>카카오톡</span>
            </button>
            <button
              onClick={handleSaveImage}
              className="flex-1 flex items-center justify-center cursor-pointer"
              style={{
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#F7F2FA',
                border: 'none',
                gap: '8px',
                transition: 'transform 0.1s ease',
              }}
              onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)'; }}
              onPointerLeave={(e) => { e.currentTarget.style.transform = ''; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M8 10L5 7M8 10l3-3M3 14h10" stroke="#7A38D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '-0.32px',
                color: '#7A38D8',
              }}>이미지 저장</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#f3f3f3',
                border: 'none',
                flexShrink: 0,
                transition: 'transform 0.1s ease',
              }}
              onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)'; }}
              onPointerLeave={(e) => { e.currentTarget.style.transform = ''; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="#6d6d6d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </motion.div>

        {/* ─── CTA 버튼들 (디자인 시스템 패턴) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col"
          style={{ padding: '0 20px 12px', gap: '8px' }}
        >
          <DSButton variant="primary" onClick={() => onRetry(false)}>
            다른 캐릭터도 도전하기
          </DSButton>
          <DSButton variant="secondary" onClick={() => onRetry(true)}>
            같은 캐릭터 재도전
          </DSButton>
          <DSButton variant="ghost" href="/">
            다른 테스트도 해보기
          </DSButton>
        </motion.div>

        {/* ─── 챗봇 전환 CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ padding: '0 20px 40px' }}
        >
          <div style={{
            borderRadius: '24px',
            backgroundColor: '#F7F2FA',
            border: '1px solid #EDE5F7',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 20px 12px' }}>
              <p style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                letterSpacing: '-0.42px',
                color: '#525252',
              }}>
                {success
                  ? `${charName}: "인정할게. 네 사주에서 느껴지는 이 에너지는 진짜야."`
                  : `${charName}: "아쉽다. 근데 네 운세 흐름은 나쁘지 않아. 방향만 잡으면 달라질 수 있어."`
                }
              </p>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <DSButton
                variant="primary"
                href="https://www.sajugpt.co.kr/"
                onClick={() => trackSajuGPTClick('dating', resultId)}
              >
                {charName}에게 직접 물어보기 →
              </DSButton>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
