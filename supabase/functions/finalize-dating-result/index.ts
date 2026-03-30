import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  resultId: string;
  characterId: string;
  selectedChoices: Array<{
    turnNumber: number;
    choiceId: string;
    choiceType: 'bold' | 'witty' | 'safe';
  }>;
  finalAffection: number;
  scoreTable: {
    charm: number;
    conversation: number;
    sense: number;
    addiction: number;
    total: number;
    lowestKey: string;
  };
  success: boolean;
  earlyExitTurn?: number;
}

// ─── 캐릭터 이름/말투 매핑 ──────────────────────────────
const CHARACTER_NAMES: Record<string, string> = {
  'yoon-taesan': '윤태산',
  'do-haegyeol': '도해결',
  'seo-hwiyoon': '서휘윤',
  'gi-jimun': '기지문',
  'choi-seolgye': '최설계',
};

const CHARACTER_SPEECH: Record<string, string> = {
  'yoon-taesan': '반말, 도발적, 짧은 문장',
  'do-haegyeol': '존댓말, 논리적, 분석적',
  'seo-hwiyoon': '존댓말, 따뜻함, 밝은 톤',
  'gi-jimun': '최소한의 단어, 무뚝뚝',
  'choi-seolgye': '비즈니스 톤, 은유적',
};

const SCORE_LABEL: Record<string, string> = {
  charm: '매력도',
  conversation: '대화력',
  sense: '센스',
  addiction: '중독성',
};

// ─── 퍼센타일 뱃지 ───────────────────────────────────────
function getBadgeType(percentile: number): string {
  if (percentile <= 1) return '전설의 작업남/녀';
  if (percentile <= 5) return '타고난 연애 천재';
  if (percentile <= 10) return '희귀한 재능';
  if (percentile <= 30) return '평균 이상';
  if (percentile <= 50) return '노력형';
  if (percentile >= 90) return '읽씹 전문가';
  return '수련이 필요합니다';
}

// ─── Gemini 팩폭 생성 ───────────────────────────────────
async function generateVerdict(
  characterId: string,
  scoreTable: RequestBody['scoreTable'],
  success: boolean,
  ilgan: string,
  ilganDescription: string,
  choiceHistory: RequestBody['selectedChoices'],
  percentile: number,
): Promise<{
  oneLineVerdict: string;
  sajuAnalysis: string;
  patterns: string[];
  rankComment: string;
}> {
  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  const charName = CHARACTER_NAMES[characterId] ?? '캐릭터';
  const speechStyle = CHARACTER_SPEECH[characterId] ?? '자연스러운 톤';
  const lowestLabel = SCORE_LABEL[scoreTable.lowestKey] ?? scoreTable.lowestKey;

  // 선택 패턴 분석
  const choiceTypes = choiceHistory.map(c => c.choiceType);
  const boldCount = choiceTypes.filter(t => t === 'bold').length;
  const wittyCount = choiceTypes.filter(t => t === 'witty').length;
  const safeCount = choiceTypes.filter(t => t === 'safe').length;
  const choicePattern = `직진(${boldCount}), 위트(${wittyCount}), 안전(${safeCount})`;

  const fallback = {
    oneLineVerdict: success
      ? `${scoreTable.total}점... 인정할 수밖에. 근데 방심하면 다음엔 모를 걸.`
      : `${scoreTable.total}점... 현실에서도 이 점수면 2번째 만남은 없어.`,
    sajuAnalysis: `${ilgan} 특유의 연애 패턴이 시뮬레이션에서도 그대로 드러났습니다. ${lowestLabel}이(가) 가장 약한 부분이에요.`,
    patterns: ['선택에 일관성이 부족한 경향', '상대 반응을 충분히 읽지 않는 패턴'],
    rankComment: percentile <= 30
      ? '상위권이지만 아직 완벽하진 않아요.'
      : '같은 사주 유저 중에서도 아쉬운 편이에요.',
  };

  if (!geminiApiKey) return fallback;

  const prompt = `당신은 ${charName}입니다. 방금 데이트 시뮬레이션에서 상대를 평가합니다.
말투: ${speechStyle}

## 평가 결과
- 총점: ${scoreTable.total}/10 (${success ? '데이트 승낙' : '데이트 거절'})
- 매력도: ${scoreTable.charm}, 대화력: ${scoreTable.conversation}, 센스: ${scoreTable.sense}, 중독성: ${scoreTable.addiction}
- 최하 항목: ${lowestLabel} (${(scoreTable as Record<string, number>)[scoreTable.lowestKey]}점)
- 선택 패턴: ${choicePattern}
- 상위 퍼센타일: ${percentile}%

## 유저 사주
- 일간: ${ilganDescription ?? ilgan}

## 출력 (JSON만, 마크다운/코드블록 금지)
{"oneLineVerdict":"총점을 언급하며 현실 연애와 연결하는 팩폭 한 줄 (${charName} 말투, 30자 이내)","sajuAnalysis":"일간 성격 → 시뮬레이션 약점 연결 (사주 용어 최소화, 3~4문장)","patterns":["연애 습관 1 (구체적 턴 번호 언급)","연애 습관 2"],"rankComment":"${percentile <= 30 ? '상위권이지만 아쉬운 점 하나' : '하위권 자조적 팩폭'}"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini verdict error:', response.status);
      return fallback;
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

    const parsed = JSON.parse(text);
    return {
      oneLineVerdict: parsed.oneLineVerdict ?? fallback.oneLineVerdict,
      sajuAnalysis: parsed.sajuAnalysis ?? fallback.sajuAnalysis,
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns : fallback.patterns,
      rankComment: parsed.rankComment ?? fallback.rankComment,
    };
  } catch (err) {
    console.error('Gemini verdict 실패:', err);
    return fallback;
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { resultId, characterId, selectedChoices, finalAffection, scoreTable, success, earlyExitTurn } = body;

    if (!resultId || !characterId) {
      return errorResponse(req, 'resultId와 characterId는 필수입니다.', 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ─── 1. 현재 레코드 조회 (일간 정보 필요) ─────────
    const { data: currentRecord } = await supabase
      .from('dating_results')
      .select('ilgan, saju_indicators')
      .eq('id', resultId)
      .single();

    const ilgan = (currentRecord?.ilgan as string) ?? '';
    const sajuIndicators = currentRecord?.saju_indicators as Record<string, unknown> | null;

    // ─── 2. 점수/선택 저장 ────────────────────────────
    await supabase
      .from('dating_results')
      .update({
        selected_choices: selectedChoices,
        final_affection: finalAffection,
        success,
        early_exit_turn: earlyExitTurn ?? null,
        score_charm: scoreTable.charm,
        score_conversation: scoreTable.conversation,
        score_sense: scoreTable.sense,
        score_addiction: scoreTable.addiction,
        total_score: scoreTable.total,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', resultId);

    // ─── 3. 등수 계산 ────────────────────────────────
    // 같은 캐릭터 기준 등수
    const { data: rankData } = await supabase
      .rpc('get_dating_rank', {
        p_character_id: characterId,
        p_total_score: scoreTable.total,
      });

    // RPC가 없으면 직접 쿼리
    let userRank = 1;
    let totalCount = 1;

    if (rankData) {
      userRank = rankData.user_rank ?? 1;
      totalCount = rankData.total_count ?? 1;
    } else {
      // Fallback: 직접 카운트
      const { count: higherCount } = await supabase
        .from('dating_results')
        .select('*', { count: 'exact', head: true })
        .eq('character_id', characterId)
        .eq('status', 'completed')
        .gt('total_score', scoreTable.total);

      const { count: allCount } = await supabase
        .from('dating_results')
        .select('*', { count: 'exact', head: true })
        .eq('character_id', characterId)
        .eq('status', 'completed');

      userRank = (higherCount ?? 0) + 1;
      totalCount = allCount ?? 1;
    }

    const percentile = totalCount > 0 ? Math.round((userRank / totalCount) * 100) : 50;

    // ─── 4. 같은 일간 평균 ──────────────────────────
    const { data: ilganData } = await supabase
      .from('dating_results')
      .select('total_score')
      .eq('character_id', characterId)
      .eq('ilgan', ilgan)
      .eq('status', 'completed');

    let sameIlganAvg = scoreTable.total;
    let sameIlganCount = 0;

    if (ilganData && ilganData.length > 0) {
      sameIlganCount = ilganData.length;
      const sum = ilganData.reduce((acc, r) => acc + (r.total_score as number), 0);
      sameIlganAvg = Math.round((sum / sameIlganCount) * 10) / 10;
    }

    // ─── 5. Gemini 팩폭 생성 ─────────────────────────
    const ilganDescription = (sajuIndicators as Record<string, unknown>)?.ilgan
      ? `${ilgan}일간`
      : ilgan;

    const verdict = await generateVerdict(
      characterId,
      scoreTable,
      success,
      ilgan,
      ilganDescription,
      selectedChoices,
      percentile,
    );

    // ─── 6. DB 최종 업데이트 ─────────────────────────
    await supabase
      .from('dating_results')
      .update({
        user_rank: userRank,
        total_count: totalCount,
        percentile,
        same_ilgan_avg: sameIlganAvg,
        same_ilgan_count: sameIlganCount,
        verdict,
      })
      .eq('id', resultId);

    // ─── 7. 응답 ──────────────────────────────────────
    const badgeType = getBadgeType(percentile);

    return jsonResponse(req, {
      userRank,
      totalCount,
      percentile,
      badgeType,
      sameIlganAvg,
      sameIlganCount,
      verdict,
      shareUrl: `/dating-sim/${resultId}`,
    });

  } catch (err) {
    console.error('finalize-dating-result 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
