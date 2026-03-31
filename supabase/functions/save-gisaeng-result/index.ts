import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface SeonbiState {
  loyalty: number;
  suspicion: number;
  alive: boolean;
}

interface RoundResult {
  round: number;
  choiceId: string;
  success: boolean;
}

interface RequestBody {
  resultId: string;
  simulationResult: {
    rounds: RoundResult[];
    finalSeonbi: {
      kwonryeok: SeonbiState;
      romantic: SeonbiState;
      jealousy: SeonbiState;
    };
    tier: string;
    tierLabel: string;
    monthlySalary: number;
    modernValue: number;
    totalCharmAfter: number;
  };
}

// ─── 폴백 ───────────────────────────────────────────────
const FALLBACK_TIER_NARRATIVES: Record<string, string> = {
  S: '세 남자를 동시에 돌리면서 한 명도 잃지 않은 전설. 조선이 기억할 이름이다.',
  A: '위태롭게 줄타기했지만 결국 살아남았다. 한양 기방가에 네 이름이 오르내린다.',
  B: '한 명을 놓쳤지만, 남은 둘이면 충분하다. 기방에서 중간은 가는 기생.',
  C: '한 명만 남겼다. 순정인지 무능인지는 역사가 판단할 것이다.',
  D: '세 명 다 떠났다. 기방 주인이 네 짐을 싸놨다. 내일부터 출근하지 마라.',
};

const FALLBACK_COMMENTS: Record<string, { alive: string; dead: string }> = {
  kwonryeok: { alive: '월향 없이는 못 산다.', dead: '기방 문턱도 밟지 않겠다고 선언했다.' },
  romantic: { alive: '시 100편을 바쳤으나 부족하다 느꼈다.', dead: '붓을 꺾고 한양을 떠났다.' },
  jealousy: { alive: '담을 넘다 허리를 다쳤다.', dead: '칼을 뽑았다가 그냥 갔다.' },
};

// ─── Gemini 결산 서사 생성 ───────────────────────────────
async function generateSettlement(
  tier: string,
  finalSeonbi: Record<string, SeonbiState>,
  monthlySalary: number,
  modernValue: number,
  gisaengName: string,
  gisaengType: string,
): Promise<{ finalNarrative: string; seonbiComments: Record<string, string> }> {
  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    return getFallback(tier, finalSeonbi);
  }

  const seonbiStates = Object.entries(finalSeonbi)
    .map(([key, s]) => {
      const names: Record<string, string> = { kwonryeok: '김도윤', romantic: '박서진', jealousy: '이준혁' };
      const types: Record<string, string> = { kwonryeok: '권력형', romantic: '로맨틱형', jealousy: '질투형' };
      return `${names[key]}(${types[key]}): ♥${s.loyalty} 👁${s.suspicion} ${s.alive ? '생존' : '이탈'}`;
    })
    .join('\n');

  const aliveSeonbiCount = Object.values(finalSeonbi).filter(s => s.alive).length;
  const modernStr = modernValue >= 10000
    ? `약 ${(modernValue / 10000).toLocaleString()}만원`
    : `${modernValue.toLocaleString()}원`;

  const prompt = `당신은 조선시대 기방 역사서 저자입니다.

## 시뮬레이션 결과
- 기생 이름: ${gisaengName}
- 기생 유형: ${gisaengType}
- 최종 티어: ${tier}
- 생존 선비: ${aliveSeonbiCount}명
- 선비별 상태:
${seonbiStates}
- 월 급여: ${monthlySalary}냥 (현대 ${modernStr})

## 생성할 것 (JSON으로 출력)
{
  "finalNarrative": "1문장, 티어에 맞는 역사서 톤",
  "kwonryeok": "김도윤 1문장 코멘트",
  "romantic": "박서진 1문장 코멘트",
  "jealousy": "이준혁 1문장 코멘트"
}

## 규칙
- "~다" 체 사용 (서술체)
- 선비 이름(김도윤/박서진/이준혁)을 직접 사용
- 생존 선비: 숭배/집착 톤 + 충성도 기반
- 이탈 선비: 미련/원망 톤 + 의심도 기반
- D티어: 코멘트가 웃겨야 함 (자조적 유머 = 공유 동기)
- S티어 서사: "전설", "역사"급 → "조선이 기억할 이름이다" 수준
- 마크다운/이모지 금지
- JSON만 출력.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return getFallback(tier, finalSeonbi);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        finalNarrative: cleanText(parsed.finalNarrative) || FALLBACK_TIER_NARRATIVES[tier] || '',
        seonbiComments: {
          kwonryeok: cleanText(parsed.kwonryeok) || getFallbackComment('kwonryeok', finalSeonbi.kwonryeok),
          romantic: cleanText(parsed.romantic) || getFallbackComment('romantic', finalSeonbi.romantic),
          jealousy: cleanText(parsed.jealousy) || getFallbackComment('jealousy', finalSeonbi.jealousy),
        },
      };
    }
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
  }

  return getFallback(tier, finalSeonbi);
}

function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/[*#_`]/g, '').replace(/\n{2,}/g, ' ').trim();
}

function getFallbackComment(key: string, state: SeonbiState): string {
  const fb = FALLBACK_COMMENTS[key];
  return state.alive ? fb.alive : fb.dead;
}

function getFallback(tier: string, finalSeonbi: Record<string, SeonbiState>) {
  return {
    finalNarrative: FALLBACK_TIER_NARRATIVES[tier] || '',
    seonbiComments: {
      kwonryeok: getFallbackComment('kwonryeok', finalSeonbi.kwonryeok),
      romantic: getFallbackComment('romantic', finalSeonbi.romantic),
      jealousy: getFallbackComment('jealousy', finalSeonbi.jealousy),
    },
  };
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { resultId, simulationResult } = body;

    if (!resultId || !simulationResult) {
      return errorResponse(req, 'resultId와 simulationResult는 필수입니다.', 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 기존 레코드에서 기생 이름/유형 조회
    const { data: existing } = await supabase
      .from('gisaeng_results')
      .select('gisaeng_name, gisaeng_type')
      .eq('id', resultId)
      .single();

    const gisaengName = existing?.gisaeng_name ?? '';
    const gisaengType = existing?.gisaeng_type ?? '';

    // Gemini 결산 서사 생성
    const { finalNarrative, seonbiComments } = await generateSettlement(
      simulationResult.tier,
      simulationResult.finalSeonbi,
      simulationResult.monthlySalary,
      simulationResult.modernValue,
      gisaengName,
      gisaengType,
    );

    // DB 업데이트
    const { error: updateError } = await supabase
      .from('gisaeng_results')
      .update({
        simulation_result: simulationResult,
        final_tier: simulationResult.tier,
        monthly_salary: simulationResult.monthlySalary,
        modern_value: simulationResult.modernValue,
        final_narrative: finalNarrative,
        seonbi_comments: seonbiComments,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', resultId);

    if (updateError) {
      console.error('DB 업데이트 실패:', updateError);
    }

    return jsonResponse(req, {
      success: true,
      finalNarrative,
      seonbiComments,
    });

  } catch (err) {
    console.error('save-gisaeng-result 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
