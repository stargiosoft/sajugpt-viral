'use client';

import DatingResult from '@/components/dating-sim/DatingResult';
import type { ScoreTable, FinalizeDatingResultResponse } from '@/types/dating';

// 개발용 미리보기 — 전체 플레이 없이 결과 화면 디자인만 확인
const MOCK_SCORE_TABLE: ScoreTable = {
  charm: 8,
  conversation: 6.3,
  sense: 9.6,
  addiction: 6.7,
  total: 7.7,
  lowestKey: 'conversation',
};

const MOCK_FINAL_RESULT: FinalizeDatingResultResponse = {
  userRank: 128,
  totalCount: 1042,
  percentile: 12,
  badgeType: 'above_average',
  sameIlganAvg: 7.1,
  sameIlganCount: 340,
  verdict: {
    oneLineVerdict: '7.7점? 현실에선 어림없지.',
    sajuAnalysis: '갑목? 나무처럼 고집 세고 자기주장 강하네. 그래서 대화가 힘들었나? 남 얘긴 안 듣고 자기 할 말만 하는 스타일. 좀 맞춰주는 법도 배워야지.',
    patterns: ['턴3, 넌 위트라고 생각했겠지만 그냥 드립이었어.', '턴5, 안전빵만 찾네. 모험은 없어?'],
    rankComment: '',
  },
  shareUrl: '',
};

export default function DatingSimPreviewPage() {
  return (
    <DatingResult
      characterId="yoon-taesan"
      scoreTable={MOCK_SCORE_TABLE}
      success={true}
      finalResult={MOCK_FINAL_RESULT}
      attemptNumber={1}
      resultId="preview"
      onRetry={() => {}}
    />
  );
}
