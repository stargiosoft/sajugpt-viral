'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { ScoreTable, FinalizeDatingResultResponse } from '@/types/dating';
import { DATING_CHARACTERS, getScoreLabel, getPercentileBadge } from '@/constants/dating-characters';
import { saveImage, copyToClipboard, shareKakao } from '@/lib/share';

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

function ScoreBar({ label, score, isLowest }: { label: string; score: number; isLowest: boolean }) {
  const percent = (score / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-14 text-right flex-shrink-0"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          color: '#6d6d6d',
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: '#EDE5F7' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isLowest ? '#FF6B6B' : '#7A38D8' }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
      <span
        className="w-12 flex-shrink-0 flex items-center gap-1"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: isLowest ? '#FF6B6B' : '#1a1a1a',
        }}
      >
        {score}/10
        {isLowest && (
          <span style={{ fontSize: '10px', color: '#FF6B6B' }}>←</span>
        )}
      </span>
    </div>
  );
}

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
  const badge = finalResult ? getPercentileBadge(finalResult.percentile) : null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dating-sim/${resultId}`
    : '';

  const handleSaveImage = async () => {
    if (cardRef.current) {
      await saveImage(cardRef.current, `데이트시뮬_${charName}_결과.png`);
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    alert('링크가 복사되었습니다!');
  };

  const handleShareKakao = () => {
    shareKakao({
      title: `${charName}한테 ${scoreTable.total}점 받았대ㅋㅋ`,
      description: finalResult
        ? `${finalResult.totalCount}명 중 ${finalResult.userRank}등. 너는 몇 점 받을 수 있어?`
        : '너는 몇 점 받을 수 있어?',
      link: shareUrl,
      buttonText: '나도 도전하기',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col px-6 pt-8 pb-8 overflow-y-auto"
    >
      {/* 성공/실패 헤더 */}
      <div className="text-center mb-6">
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>
          {success ? '🎉' : '💔'}
        </div>
        <h2
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '30px',
            color: success ? '#7A38D8' : '#FF4444',
          }}
        >
          {success ? '데이트 승낙!' : '데이트 거절...'}
        </h2>
        {earlyExitTurn && (
          <p
            className="mt-1"
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '13px',
              color: '#FF6B6B',
            }}
          >
            {earlyExitTurn}턴 만에 조기 종료됨
          </p>
        )}
        {attemptNumber > 1 && (
          <p
            className="mt-1"
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '12px',
              color: '#b0b0b0',
            }}
          >
            {attemptNumber}번째 도전
          </p>
        )}
      </div>

      {/* ─── 결과 카드 (캡처 대상) ─── */}
      <div
        ref={cardRef}
        className="rounded-3xl p-6 mb-6"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px rgba(122, 56, 216, 0.10)',
        }}
      >
        {/* 캐릭터 이름 + 채점표 */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
            style={{ backgroundColor: '#EDE5F7' }}
          >
            <img
              src={character?.thumbnail ?? ''}
              alt={charName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#1a1a1a',
            }}
          >
            {charName}의 채점표
          </span>
        </div>

        {/* 점수 바 4개 */}
        <div className="flex flex-col gap-3 mb-5">
          {(['charm', 'conversation', 'sense', 'addiction'] as const).map(key => (
            <ScoreBar
              key={key}
              label={getScoreLabel(key)}
              score={scoreTable[key]}
              isLowest={scoreTable.lowestKey === key}
            />
          ))}
        </div>

        {/* 총점 */}
        <div
          className="text-center py-4 rounded-xl mb-4"
          style={{ backgroundColor: '#FAF8FC' }}
        >
          <span
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '32px',
              fontWeight: 700,
              color: '#7A38D8',
            }}
          >
            {scoreTable.total}
          </span>
          <span
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#848484',
            }}
          >
            {' '}/ 10
          </span>
        </div>

        {/* 등수 */}
        {finalResult && (
          <div className="text-center mb-4">
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#6d6d6d',
              }}
            >
              전체 도전자{' '}
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>
                {finalResult.totalCount.toLocaleString()}명
              </span>{' '}
              중{' '}
              <span style={{ fontWeight: 600, color: '#7A38D8' }}>
                {finalResult.userRank.toLocaleString()}등
              </span>
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#848484',
              }}
            >
              상위 {finalResult.percentile}%
            </p>
            {badge && (
              <span
                className="inline-block mt-2 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: badge.color + '18',
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: badge.color,
                }}
              >
                {badge.label}
              </span>
            )}
          </div>
        )}

        {/* 팩폭 코멘트 */}
        {finalResult?.verdict.oneLineVerdict && (
          <div
            className="rounded-xl p-4 mt-4"
            style={{ backgroundColor: '#F7F2FA' }}
          >
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                color: '#4a4a4a',
              }}
            >
              &ldquo;{finalResult.verdict.oneLineVerdict}&rdquo;
            </p>
          </div>
        )}

        {/* 워터마크 */}
        <p
          className="text-center mt-4"
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            color: '#d0d0d0',
          }}
        >
          sajugpt-viral.vercel.app
        </p>
      </div>

      {/* ─── 사주 분석 카드 ─── */}
      {finalResult?.verdict.sajuAnalysis && (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              color: '#1a1a1a',
            }}
          >
            사주가 말하는 당신의 연애 약점
          </h3>
          <p
            className="mb-3"
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '22px',
              color: '#6d6d6d',
            }}
          >
            {finalResult.verdict.sajuAnalysis}
          </p>

          {finalResult.verdict.patterns.length > 0 && (
            <div className="flex flex-col gap-1 mb-3">
              {finalResult.verdict.patterns.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#848484',
                  }}
                >
                  → {p}
                </p>
              ))}
            </div>
          )}

          {finalResult.sameIlganCount > 0 && (
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#7A38D8',
              }}
            >
              같은 사주 유저 평균: {finalResult.sameIlganAvg}점 / 당신: {scoreTable.total}점
              {scoreTable.total < finalResult.sameIlganAvg ? ' (평균 이하)' : ' (평균 이상)'}
            </p>
          )}
        </div>
      )}

      {/* ─── 공유 버튼 ─── */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleShareKakao}
          className="flex-1 rounded-xl py-3 active:scale-[0.98]"
          style={{
            backgroundColor: '#FEE500',
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#3C1E1E',
            transition: 'transform 0.1s',
          }}
        >
          카카오톡 공유
        </button>
        <button
          onClick={handleSaveImage}
          className="flex-1 rounded-xl py-3 active:scale-[0.98]"
          style={{
            backgroundColor: '#EDE5F7',
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#7A38D8',
            transition: 'transform 0.1s',
          }}
        >
          이미지 저장
        </button>
        <button
          onClick={handleCopyLink}
          className="rounded-xl py-3 px-4 active:scale-[0.98]"
          style={{
            backgroundColor: '#f0f0f0',
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6d6d6d',
            transition: 'transform 0.1s',
          }}
        >
          링크
        </button>
      </div>

      {/* ─── CTA 버튼들 ─── */}
      <div className="flex flex-col gap-3 mb-4">
        <button
          onClick={() => onRetry(true)}
          className="w-full rounded-xl py-3.5 active:scale-[0.98]"
          style={{
            backgroundColor: '#7A38D8',
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            color: '#ffffff',
            transition: 'transform 0.1s',
          }}
        >
          {success ? '다른 캐릭터도 도전하기' : '재도전하기'}
        </button>

        <button
          onClick={() => onRetry(false)}
          className="w-full rounded-xl py-3.5 active:scale-[0.98]"
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #EDE5F7',
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            color: '#7A38D8',
            transition: 'transform 0.1s',
          }}
        >
          {success ? '같은 캐릭터 재도전' : '다른 캐릭터에게 도전'}
        </button>
      </div>

      {/* 챗봇 전환 CTA */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: '#F7F2FA',
          border: '1px solid #EDE5F7',
        }}
      >
        <p
          className="mb-3"
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: '#6d6d6d',
          }}
        >
          {success
            ? `${charName}: "인정할게. 네 사주에서 느껴지는 이 에너지는 진짜야."`
            : `${charName}: "아쉽다. 근데 네 운세 흐름 자체는 나쁘지 않아. 방향만 잡으면 달라질 수 있어."`
          }
        </p>
        <button
          onClick={() => {
            // 챗봇 전환 (향후 구현)
            alert('챗봇 기능은 준비 중입니다!');
          }}
          className="w-full rounded-xl py-3 active:scale-[0.98]"
          style={{
            backgroundColor: '#7A38D8',
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            transition: 'transform 0.1s',
          }}
        >
          {charName}에게 직접 물어보기 →
        </button>
      </div>
    </motion.div>
  );
}
