'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { ScoreTable, FinalizeDatingResultResponse } from '@/types/dating';
import { DATING_CHARACTERS, getScoreLabel, getPercentileBadge } from '@/constants/dating-characters';
import { saveImage } from '@/lib/share';
import { trackShare, trackSajuGPTClick } from '@/lib/analytics';
import ShareButton from '@/components/ShareButton';
import TextLinkButton from '@/components/TextLinkButton';
import PressableButton from '@/components/PressableButton';

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

// ── 데이트 시뮬레이션 라이트 컬러 토큰 ──
const COLOR_BG = '#ffffff';
const COLOR_CARD = '#ffffff';
const COLOR_BOX = '#F2F2F5';
const COLOR_BOX_LIGHT = '#E7E7EB';
const COLOR_TEXT_PRIMARY = '#151515';
const COLOR_TEXT_SECONDARY = '#6E6E72';
const COLOR_TEXT_BRIGHT = '#4B4B4F';

// ── 캐릭터 헤더 배경 하트 패턴 ──
const HEART_PATTERN_BG = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><path fill='white' fill-opacity='0.16' d='M20 30s-8-5.2-8-11.2c0-3.4 2.6-5.8 5.8-5.8 1.8 0 3.5.9 4.5 2.3 1-1.4 2.7-2.3 4.5-2.3 3.2 0 5.8 2.4 5.8 5.8C32.6 24.8 20 30 20 30z'/></svg>"
)}")`;

// ── 점수 바 컬러 (4개 각각 다른 색상, 트랙 배경은 통일) ──
const SCORE_COLORS: Record<string, { bar: string; track: string }> = {
  charm:        { bar: '#FF5C93', track: COLOR_BOX_LIGHT },
  conversation: { bar: '#5C7AFF', track: COLOR_BOX_LIGHT },
  sense:        { bar: '#1FC0B3', track: COLOR_BOX_LIGHT },
  addiction:    { bar: '#FF5252', track: COLOR_BOX_LIGHT },
};

// ── 세로 게이지 바 (주가조작단 로드맵 스타일) ──
function ScoreGaugeColumn({ scoreKey, label, score, delay }: {
  scoreKey: string; label: string; score: number; delay: number;
}) {
  const percent = (score / 10) * 100;
  const colors = SCORE_COLORS[scoreKey] ?? { bar: '#FF4D8D', track: '#EFEFF1' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center"
      style={{ width: '56px' }}
    >
      <div
        className="flex items-end w-full"
        style={{ height: '96px', borderRadius: '14px', backgroundColor: colors.track, overflow: 'hidden' }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percent}%` }}
          transition={{ duration: 0.7, delay: delay + 0.15, ease: 'easeOut' }}
          style={{ width: '100%', borderRadius: '14px', backgroundColor: colors.bar }}
        />
      </div>

      <span style={{
        fontFamily: 'Pretendard Variable, sans-serif',
        fontSize: '17px',
        fontWeight: 800,
        letterSpacing: '-0.3px',
        color: COLOR_TEXT_PRIMARY,
        marginTop: '12px',
      }}>
        {score}
      </span>

      <span style={{
        fontFamily: 'Pretendard Variable, sans-serif',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '-0.24px',
        color: COLOR_TEXT_SECONDARY,
        marginTop: '1px',
        textAlign: 'center',
      }}>
        {label}
      </span>
    </motion.div>
  );
}

// ── 총점 원형 프로그레스 ──
function ScoreGaugeRing({ score, color }: { score: number; color: string }) {
  const percent = (score / 10) * 100;
  const size = 108;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={COLOR_BOX_LIGHT} strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="flex flex-col items-center justify-center" style={{ position: 'absolute', inset: 0 }}>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '26px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color,
          lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: COLOR_TEXT_SECONDARY,
          marginTop: '2px',
        }}>
          / 10
        </span>
      </div>
    </div>
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
  const accentColor = success ? '#E0357A' : '#B33951';
  const sameIlganDelta = finalResult ? scoreTable.total - finalResult.sameIlganAvg : 0;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dating-sim/${resultId}` : '';

  const handleSaveImage = async () => {
    if (cardRef.current) {
      await saveImage(cardRef.current, `데이트시뮬_${charName}_결과.png`);
      trackShare('dating', 'image_save', resultId);
    }
  };

  const scoreKeys = ['charm', 'conversation', 'sense', 'addiction'] as const;

  return (
    <div className="relative min-h-screen w-full flex justify-center" style={{ backgroundColor: COLOR_BG }}>
      <div className="w-full max-w-[768px] relative">

        {/* ─── 성공/실패 헤더 ─── */}
        {attemptNumber > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
            style={{ padding: '24px 12px 0' }}
          >
            <p style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '-0.24px',
              color: COLOR_TEXT_SECONDARY,
            }}>
              {attemptNumber}번째 도전
            </p>
          </motion.div>
        )}

        {/* ─── 결과 카드 (캡처 대상) ─── */}
        <div style={{ padding: '0 12px 20px' }}>
          <div
            ref={cardRef}
            className="overflow-hidden"
            style={{
              borderRadius: '24px',
              backgroundColor: COLOR_CARD,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* 캐릭터 헤더 — 결과 상태 + 채점표 타이틀 통합 */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden flex flex-col items-center"
              style={{
                padding: '32px 20px 24px',
                background: success
                  ? 'linear-gradient(135deg, #FF8FBD 0%, #FF4F97 100%)'
                  : 'linear-gradient(135deg, #A8566E 0%, #8F3E56 100%)',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: HEART_PATTERN_BG,
                backgroundSize: '40px 40px',
                backgroundRepeat: 'repeat',
                pointerEvents: 'none',
              }} />
              <h2 style={{
                position: 'relative',
                fontFamily: 'Jalnan, sans-serif',
                fontSize: '33px',
                fontWeight: 400,
                letterSpacing: '-0.52px',
                color: '#ffffff',
                WebkitTextStroke: `10px ${accentColor}`,
                paintOrder: 'stroke fill',
              }}>
                {success ? '데이트 승낙!' : '데이트 거절...'}
              </h2>
              <p style={{
                position: 'relative',
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '-0.26px',
                color: '#ffffff',
                marginTop: '2px',
              }}>
                {charName}의 채점표 · {character?.archetype}
              </p>
              {earlyExitTurn && (
                <p style={{
                  position: 'relative',
                  marginTop: '4px',
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '-0.24px',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  {earlyExitTurn}턴 만에 조기 종료됨
                </p>
              )}
            </motion.div>

            {/* ─── 그룹 1: 성적표 (종합 점수 + 항목별 점수 + 사주 유저 평균) ─── */}
            <div style={{ padding: '20px 20px 12px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: COLOR_BOX, overflow: 'hidden' }}>

                {/* 종합 점수 — 정보(좌) + 원형 프로그레스(우) / 모바일은 그래프 위·텍스트 아래로 스택 */}
                <div className="flex flex-col-reverse items-center md:flex-row md:items-start" style={{ gap: '24px' }}>
                  <div className="flex flex-col items-start w-full md:w-auto" style={{ gap: '14px' }}>
                    <p style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '-0.45px',
                      color: COLOR_TEXT_PRIMARY,
                    }}>
                      종합 점수
                    </p>

                    {finalResult && finalResult.totalCount >= 10 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col items-start"
                        style={{ gap: '10px' }}
                      >
                        <p style={{
                          fontFamily: 'Pretendard Variable, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500,
                          lineHeight: '19px',
                          letterSpacing: '-0.24px',
                          color: COLOR_TEXT_SECONDARY,
                        }}>
                          전체 {finalResult.totalCount.toLocaleString()}명 중{' '}
                          <span style={{ fontWeight: 800, color: COLOR_TEXT_PRIMARY }}>
                            {finalResult.userRank.toLocaleString()}등
                          </span>
                          {' '}· 상위 {finalResult.percentile}%
                        </p>
                        {badge && (
                          <span className="inline-flex items-center" style={{
                            gap: '6px',
                            padding: '6px 14px 6px 10px',
                            borderRadius: '9999px',
                            backgroundColor: `${badge.color}1a`,
                            border: `1px solid ${badge.color}40`,
                          }}>
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '9999px',
                              backgroundColor: badge.color,
                              flexShrink: 0,
                            }} />
                            <span style={{
                              fontFamily: 'Pretendard Variable, sans-serif',
                              fontSize: '12px',
                              fontWeight: 700,
                              letterSpacing: '-0.24px',
                              color: badge.color,
                            }}>
                              {badge.label}
                            </span>
                          </span>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-center md:flex-1">
                    <ScoreGaugeRing score={scoreTable.total} color={SCORE_COLORS.charm.bar} />
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', margin: '20px 0' }} />

                {/* 항목별 점수 — 정보(좌) + 점수 바(우), 항상 가로 배치 */}
                <div className="flex items-start" style={{ gap: '24px' }}>
                  <div className="flex flex-col items-start" style={{ gap: '14px' }}>
                    <p style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '-0.45px',
                      color: COLOR_TEXT_PRIMARY,
                    }}>
                      항목별 점수
                    </p>

                    {finalResult && finalResult.sameIlganCount > 0 && (
                      <div className="flex flex-col items-start" style={{ gap: '8px' }}>
                        <p style={{
                          fontFamily: 'Pretendard Variable, sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '-0.24px',
                          color: COLOR_TEXT_SECONDARY,
                        }}>
                          같은 사주 유저 평균({finalResult.sameIlganAvg}점) 대비
                        </p>
                        <span className="inline-flex items-center" style={{
                          gap: '6px',
                          padding: '6px 14px 6px 10px',
                          borderRadius: '9999px',
                          backgroundColor: sameIlganDelta >= 0 ? '#E0357A1a' : COLOR_BOX_LIGHT,
                          fontFamily: 'Pretendard Variable, sans-serif',
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '-0.24px',
                          color: sameIlganDelta >= 0 ? '#E0357A' : COLOR_TEXT_SECONDARY,
                          whiteSpace: 'nowrap',
                        }}>
                          <svg
                            width="10" height="10" viewBox="0 0 24 24" fill="none"
                            style={{ transform: sameIlganDelta >= 0 ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                          >
                            <path fill={sameIlganDelta >= 0 ? '#E0357A' : COLOR_TEXT_SECONDARY} d="M4.88891 7C4.52939 7 4.20527 7.24364 4.06769 7.61732C3.93011 7.99099 4.00616 8.42111 4.26037 8.70711L11.3715 16.7071C11.7186 17.0976 12.2814 17.0976 12.6285 16.7071L19.7396 8.70711C19.9938 8.42111 20.0699 7.99099 19.9323 7.61732C19.7947 7.24364 19.4706 7 19.1111 7H4.88891Z" />
                          </svg>
                          {Math.abs(sameIlganDelta).toFixed(1)}점 {sameIlganDelta >= 0 ? '높아요' : '낮아요'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center" style={{ gap: '12px', flex: 1 }}>
                    {scoreKeys.map((key, i) => (
                      <ScoreGaugeColumn
                        key={key}
                        scoreKey={key}
                        label={getScoreLabel(key)}
                        score={scoreTable[key]}
                        delay={0.08 * i}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── 그룹 2: 설명 (사주 분석) ─── */}
            {finalResult?.verdict.sajuAnalysis && (
              <div style={{ padding: '0 20px 12px' }}>
                <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: COLOR_BOX }}>
                  <h3 style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    letterSpacing: '-0.45px',
                    color: COLOR_TEXT_PRIMARY,
                    marginTop: '6px',
                    marginBottom: '8px',
                  }}>
                    사주가 말하는 당신의 연애 약점
                  </h3>

                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: '29px',
                    letterSpacing: '-0.42px',
                    color: '#6E6E72',
                  }}>
                    {finalResult.verdict.sajuAnalysis}
                  </p>
                </div>
              </div>
            )}

            {/* ─── 그룹 3: 윤태산이 말하길 (팩폭 + 턴별 코멘트 + 전환 대사 + CTA, 화자 통일) ─── */}
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: COLOR_BOX }}>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '-0.45px',
                  color: COLOR_TEXT_PRIMARY,
                }}>
                  {charName}이 말하길
                </p>

                {/* 채팅방 스타일 — 아바타 옆에 말풍선 묶음 */}
                <div className="flex items-start" style={{ gap: '8px', marginTop: '16px', marginBottom: '28px', paddingLeft: '4px' }}>
                  <div
                    className="overflow-hidden flex-shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '9999px',
                    }}
                  >
                    <img
                      src={character?.thumbnail ?? ''} alt={charName}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  <div className="flex flex-col items-start" style={{ gap: '8px', flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '-0.24px',
                      color: accentColor,
                      marginBottom: '2px',
                    }}>
                      {charName}
                    </p>

                    {finalResult?.verdict.oneLineVerdict && (
                      <div style={{
                        padding: '10px 16px',
                        borderRadius: '4px 16px 16px 16px',
                        backgroundColor: COLOR_CARD,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        maxWidth: '92%',
                      }}>
                        <p style={{
                          fontFamily: 'Pretendard Variable, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          lineHeight: '22px',
                          letterSpacing: '-0.42px',
                          color: COLOR_TEXT_PRIMARY,
                        }}>
                          &ldquo;{finalResult.verdict.oneLineVerdict}&rdquo;
                        </p>
                      </div>
                    )}

                    {finalResult?.verdict.patterns.map((p, i) => (
                      <div key={i} style={{
                        padding: '10px 16px',
                        borderRadius: '16px',
                        backgroundColor: COLOR_CARD,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        maxWidth: '92%',
                      }}>
                        <p style={{
                          fontFamily: 'Pretendard Variable, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500,
                          lineHeight: '19px',
                          letterSpacing: '-0.24px',
                          color: COLOR_TEXT_BRIGHT,
                        }}>{p}</p>
                      </div>
                    ))}

                    <div style={{
                      padding: '10px 16px',
                      borderRadius: '16px',
                      backgroundColor: COLOR_CARD,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      maxWidth: '92%',
                    }}>
                      <p style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        lineHeight: '19px',
                        letterSpacing: '-0.3px',
                        color: COLOR_TEXT_BRIGHT,
                      }}>
                        {success
                          ? '"인정할게. 네 사주에서 느껴지는 이 에너지는 진짜야."'
                          : '"아쉽다. 근데 네 운세 흐름은 나쁘지 않아. 방향만 잡으면 달라질 수 있어."'
                        }
                      </p>
                    </div>

                    <p style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '10px',
                      fontWeight: 500,
                      color: COLOR_TEXT_SECONDARY,
                      marginTop: '2px',
                    }}>
                      방금 전
                    </p>
                  </div>
                </div>

                <PressableButton
                  href="https://www.sajugpt.co.kr/"
                  onClick={() => trackSajuGPTClick('dating', resultId)}
                  label={`${charName}에게 직접 물어보기 →`}
                  style={{ width: '100%' }}
                  bgStyle={{ backgroundColor: '#FF4D8D', borderRadius: '16px' }}
                  hoverBackground="#FF6FA0"
                  textStyle={{ color: '#ffffff' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── 액션 버튼들 (주가조작단 결과 페이지 패턴: 공유 팝오버 CTA → 이미지 저장 → 텍스트 링크) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col"
          style={{ padding: '0 12px 12px', gap: '8px' }}
        >
          <ShareButton
            featureType="dating"
            resultId={resultId}
            title={`${charName}한테 ${scoreTable.total}점 받았대ㅋㅋ`}
            description={finalResult
              ? `${finalResult.totalCount.toLocaleString()}명 중 ${finalResult.userRank.toLocaleString()}등. 너는 몇 점 받을 수 있어?`
              : '너는 몇 점 받을 수 있어?'}
            shareUrl={shareUrl}
            imageUrl={typeof window !== 'undefined' ? `${window.location.origin}/home/thumbnails/dating-sim.jpg` : undefined}
            label="친구도 데이트 시키기"
            activeBackground="#FFF0F5"
            textColor="#FF4D8D"
            hoverBackground="#FFE0EB"
            style={{ borderRadius: '16px' }}
          />
          <PressableButton
            onClick={handleSaveImage}
            label="이미지 저장"
            style={{ height: '56px' }}
            bgStyle={{ backgroundColor: '#FFF0F5', borderRadius: '16px' }}
            hoverBackground="#FFE0EB"
            textStyle={{ color: '#FF4D8D' }}
          />
          <TextLinkButton href="/" color="#848484" layoutStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '56px' }}>
            다른 테스트도 해보기
          </TextLinkButton>
        </motion.div>

      </div>
    </div>
  );
}
