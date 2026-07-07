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
        marginTop: '10px',
      }}>
        {score}
      </span>

      <span style={{
        fontFamily: 'Pretendard Variable, sans-serif',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '-0.24px',
        color: COLOR_TEXT_SECONDARY,
        marginTop: '4px',
        textAlign: 'center',
      }}>
        {label}
      </span>
    </motion.div>
  );
}

// ── 총점 바 게이지 ──
function ScoreGaugeBar({ score, color }: { score: number; color: string }) {
  const percent = (score / 10) * 100;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-baseline" style={{ marginBottom: '12px' }}>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '40px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color,
          lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '15px',
          fontWeight: 400,
          color: COLOR_TEXT_SECONDARY,
          marginLeft: '4px',
        }}>
          / 10
        </span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{ height: '12px', borderRadius: '9999px', backgroundColor: COLOR_BOX_LIGHT }}
      >
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #FFB3C6 0%, #FF4D8D 100%)',
            borderRadius: '9999px',
            boxShadow: '0 0 10px rgba(255, 77, 141, 0.45)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
          style={{ padding: '40px 20px 20px' }}
        >
          <h2 style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.56px',
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
              color: '#B33951',
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
              color: COLOR_TEXT_SECONDARY,
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
              backgroundColor: COLOR_CARD,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* 캐릭터 헤더 */}
            <div
              className="flex flex-col items-center"
              style={{
                padding: '16px 20px',
                gap: '8px',
                background: success
                  ? 'linear-gradient(135deg, #FF6FA5 0%, #E0357A 100%)'
                  : 'linear-gradient(135deg, #8F2A42 0%, #B33951 100%)',
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
              <div className="flex flex-col items-center">
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '22px',
                  letterSpacing: '-0.32px',
                  color: '#ffffff',
                  textAlign: 'center',
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
                  textAlign: 'center',
                }}>
                  {character?.archetype}
                </p>
              </div>
            </div>

            {/* 총점 바 게이지 + 순위 */}
            <div style={{ padding: '20px 20px 12px' }}>
              <div
                className="flex flex-col items-center"
                style={{ padding: '24px 20px', borderRadius: '16px', backgroundColor: COLOR_BOX }}
              >
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '-0.26px',
                  color: COLOR_TEXT_SECONDARY,
                  marginBottom: '12px',
                }}>
                  종합 점수
                </p>
                <ScoreGaugeBar score={scoreTable.total} color={accentColor} />

                {finalResult && finalResult.totalCount >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col items-center"
                    style={{ marginTop: '18px', gap: '6px' }}
                  >
                    <p style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      letterSpacing: '-0.42px',
                      color: COLOR_TEXT_BRIGHT,
                    }}>
                      전체 도전자{' '}
                      <span style={{ fontWeight: 800, color: COLOR_TEXT_PRIMARY }}>
                        {finalResult.totalCount.toLocaleString()}명
                      </span>
                      {' '}중{' '}
                      <span style={{ fontWeight: 800, fontSize: '16px', color: accentColor }}>
                        {finalResult.userRank.toLocaleString()}등
                      </span>
                    </p>
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <p style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        letterSpacing: '-0.24px',
                        color: COLOR_TEXT_SECONDARY,
                      }}>
                        상위 {finalResult.percentile}%
                      </p>
                      {badge && (
                        <span className="inline-flex items-center" style={{
                          gap: '6px',
                          padding: '6px 14px 6px 10px',
                          borderRadius: '9999px',
                          backgroundColor: `${badge.color}1a`,
                          border: `1px solid ${badge.color}40`,
                          boxShadow: `0 1px 4px ${badge.color}26`,
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
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 세부 점수 — 세로 게이지 바 */}
            <div style={{ padding: '0 20px 12px' }}>
              <div
                className="flex flex-col items-center"
                style={{ padding: '20px 16px 24px', borderRadius: '16px', backgroundColor: COLOR_BOX }}
              >
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '-0.26px',
                  color: COLOR_TEXT_SECONDARY,
                  marginBottom: '16px',
                }}>
                  항목별 점수
                </p>
                <div className="flex justify-center" style={{ gap: '16px' }}>
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

            {/* 팩폭 한줄 */}
            {finalResult?.verdict.oneLineVerdict && (
              <div style={{ padding: '0 20px 12px' }}>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  backgroundColor: COLOR_BOX,
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '24px',
                    letterSpacing: '-0.45px',
                    color: COLOR_TEXT_PRIMARY,
                  }}>
                    &ldquo;{finalResult.verdict.oneLineVerdict}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* 사주 분석 */}
            {finalResult?.verdict.sajuAnalysis && (
              <div style={{ padding: '0 20px 12px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: COLOR_BOX }}>
                  <h3 style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    letterSpacing: '-0.45px',
                    color: COLOR_TEXT_PRIMARY,
                    marginBottom: '12px',
                  }}>
                    사주가 말하는 당신의 연애 약점
                  </h3>

                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    letterSpacing: '-0.42px',
                    color: COLOR_TEXT_BRIGHT,
                    marginBottom: '14px',
                  }}>
                    {finalResult.verdict.sajuAnalysis}
                  </p>

                  {finalResult.verdict.patterns.length > 0 && (
                    <div className="flex flex-col" style={{ gap: '8px', marginBottom: '14px' }}>
                      {finalResult.verdict.patterns.map((p, i) => (
                        <div key={i} className="flex items-start" style={{ gap: '8px' }}>
                          <span style={{
                            fontFamily: 'Pretendard Variable, sans-serif',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#E0357A',
                            marginTop: '3px',
                            flexShrink: 0,
                          }}>→</span>
                          <p style={{
                            fontFamily: 'Pretendard Variable, sans-serif',
                            fontSize: '13px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            letterSpacing: '-0.3px',
                            color: COLOR_TEXT_BRIGHT,
                          }}>{p}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {finalResult.sameIlganCount > 0 && (
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '14px',
                      backgroundColor: COLOR_CARD,
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}>
                      <p style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '-0.24px',
                        color: COLOR_TEXT_BRIGHT,
                        marginBottom: '4px',
                      }}>
                        같은 사주 유저 평균 {finalResult.sameIlganAvg}점
                      </p>
                      <p style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '16px',
                        fontWeight: 800,
                        letterSpacing: '-0.3px',
                        color: '#E0357A',
                      }}>
                        당신 {scoreTable.total}점{' '}
                        <span style={{ fontSize: '13px', fontWeight: 600, color: COLOR_TEXT_SECONDARY }}>
                          {scoreTable.total < finalResult.sameIlganAvg ? '(평균 이하)' : '(평균 이상)'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 챗봇 전환 */}
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: COLOR_BOX }}>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '-0.24px',
                  color: accentColor,
                  textAlign: 'center',
                  marginBottom: '6px',
                }}>
                  {charName}
                </p>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '23px',
                  letterSpacing: '-0.42px',
                  color: COLOR_TEXT_PRIMARY,
                  textAlign: 'center',
                  marginBottom: '14px',
                }}>
                  {success
                    ? '"인정할게. 네 사주에서 느껴지는 이 에너지는 진짜야."'
                    : '"아쉽다. 근데 네 운세 흐름은 나쁘지 않아. 방향만 잡으면 달라질 수 있어."'
                  }
                </p>
                <PressableButton
                  href="https://www.sajugpt.co.kr/"
                  onClick={() => trackSajuGPTClick('dating', resultId)}
                  label={`${charName}에게 직접 물어보기 →`}
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
          style={{ padding: '0 20px 12px', gap: '8px' }}
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
