import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  resultId: string;
  characterId: string;
  sajuIndicators: SajuIndicators;
  ilganDescription: string;
  compatibility: number;
  gender: 'male' | 'female';
}

interface SajuIndicators {
  ilgan: string;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  pyeonGwan: number;
  sangGwan: number;
  sikSin: number;
  fireRatio: number;
  gwansung: number;
  siksang: number;
  bigyeon: number;
  insung: number;
  jasung: number;
}

// ─── 캐릭터 프로필 (프롬프트용) ──────────────────────────
interface CharacterPromptProfile {
  name: string;
  archetype: string;
  speechPattern: string;
  likes: string;
  dislikes: string;
  personality: string;
  defaultThreshold: number;
}

const CHARACTER_PROFILES: Record<string, CharacterPromptProfile> = {
  'yoon-taesan': {
    name: '윤태산',
    archetype: '야수형 짐승남',
    speechPattern: '반말, 도발적, 짧은 문장 ("...흥", "재밌네", "...해봐")',
    likes: '대담한 직진, 당당함, 눈 마주침, 거침없는 태도',
    dislikes: '눈치 보기, 빈말, 과도한 칭찬, 소극적 태도',
    personality: '도발적이고 야수적인 매력의 남자. 관심 없는 척하지만 마음에 드는 상대에게는 은근히 관심을 보인다. 직진하는 상대에게 약하고, 눈치 보는 상대는 지루해한다.',
    defaultThreshold: 70,
  },
  'do-haegyeol': {
    name: '도해결',
    archetype: '지적 엘리트 심리분석가',
    speechPattern: '존댓말 베이스, 논리적, 분석적 ("데이터상으로는...", "흥미롭군요", "논리적이시네요")',
    likes: '논리적 대화, 독립적 태도, 지적 유머, 자기주관',
    dislikes: '감정적 호소, 의존적 태도, 무지, 논리 없는 주장',
    personality: '냉철한 지적 엘리트. 모든 것을 분석하고 데이터로 판단한다. 논리적으로 대화하는 상대에게 호감을 느끼고, 감정에만 호소하는 상대는 피곤해한다.',
    defaultThreshold: 65,
  },
  'seo-hwiyoon': {
    name: '서휘윤',
    archetype: '치유형 연하남',
    speechPattern: '존댓말, 따뜻함, 밝은 톤 ("~요!", "진짜요?!", "좋아요!", "헤헤")',
    likes: '솔직함, 배려, 일상적 관심, 자연스러운 대화',
    dislikes: '건방짐, 무관심, 냉소, 거만한 태도',
    personality: '따뜻하고 밝은 연하남. 상대의 이야기에 진심으로 관심을 가지고 공감한다. 솔직하고 편안한 대화를 좋아하고, 가식이나 냉소적 태도에 상처받는다.',
    defaultThreshold: 55,
  },
  'gi-jimun': {
    name: '기지문',
    archetype: '무뚝뚝 경호원형',
    speechPattern: '최소한의 단어, 무뚝뚝 ("...그래", "됐어", "...알겠어", "...")',
    likes: '행동으로 보여주는 성의, 묵묵한 태도, 진정성, 가식 없음',
    dislikes: '말만 많은 태도, 가식, 과장, 허세',
    personality: '과묵하고 듬직한 경호원 타입. 말보다 행동을 중시하고, 진정성 있는 사람에게만 마음을 연다. 말이 많거나 가식적인 사람은 무시한다.',
    defaultThreshold: 65,
  },
  'choi-seolgye': {
    name: '최설계',
    archetype: '도시형 전략가',
    speechPattern: '비즈니스 톤, 은유적 ("투자 대비 수익률이...", "포트폴리오를 보면", "전략적으로 접근하면")',
    likes: '전략적 사고, 야망, 위트 있는 말장난, 자신감',
    dislikes: '무계획, 수동적 태도, 진부함, 노력 없는 기대',
    personality: '모든 것을 전략과 투자의 관점에서 바라보는 도시형 남자. 연애도 포트폴리오처럼 분석한다. 위트 있고 야심찬 상대에게 끌리며, 무계획적이거나 수동적인 사람은 가치를 못 느낀다.',
    defaultThreshold: 70,
  },
};

// ─── 사주 특성 텍스트 ────────────────────────────────────
function getSajuTraits(saju: SajuIndicators): string {
  const traits: string[] = [];
  if (saju.doHwaSal) traits.push('도화살 보유 (타고난 매력)');
  if (saju.hongYeomSal) traits.push('홍염살 보유 (강렬한 이성 에너지)');
  if (saju.gwansung >= 25) traits.push(`관성 발달 (${saju.gwansung}%)`);
  if (saju.siksang >= 25) traits.push(`식상 발달 (${saju.siksang}%)`);
  if (saju.insung >= 25) traits.push(`인성 발달 (${saju.insung}%)`);
  if (saju.jasung >= 25) traits.push(`재성 발달 (${saju.jasung}%)`);
  if (saju.bigyeon >= 30) traits.push(`비겁 발달 (${saju.bigyeon}%)`);
  if (saju.fireRatio >= 25) traits.push(`화기 강함 (${saju.fireRatio}%)`);
  if (traits.length === 0) traits.push('특별한 돌출 지표 없음 (균형형)');
  return traits.join(', ');
}

// ─── 성공 임계값 ─────────────────────────────────────────
function getSuccessThreshold(profile: CharacterPromptProfile, compatibility: number): number {
  if (compatibility >= 80) return Math.max(50, profile.defaultThreshold - 15);
  if (compatibility >= 60) return Math.max(55, profile.defaultThreshold - 5);
  if (compatibility >= 40) return profile.defaultThreshold;
  return Math.min(85, profile.defaultThreshold + 10);
}

// ─── Gemini 대화 트리 생성 ───────────────────────────────
async function generateConversationTree(
  profile: CharacterPromptProfile,
  saju: SajuIndicators,
  ilganDescription: string,
  compatibility: number,
  gender: string,
  successThreshold: number,
): Promise<unknown> {
  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) throw new Error('GOOGLE_API_KEY not set');

  const genderLabel = gender === 'female' ? '여성' : '남성';

  const prompt = `당신은 데이트 시뮬레이션의 대화 트리를 설계하는 작가입니다.

## 캐릭터 정보
- 이름: ${profile.name}
- 아키타입: ${profile.archetype}
- 성격: ${profile.personality}
- 말투: ${profile.speechPattern}
- 호감 포인트: ${profile.likes}
- 비호감 포인트: ${profile.dislikes}

## 유저 사주 정보
- 일간: ${ilganDescription}
- 주요 특성: ${getSajuTraits(saju)}
- 궁합 점수: ${compatibility}점/100점
- 성별: ${genderLabel}

## 규칙
1. 5턴의 데이트 대화를 JSON으로 생성하세요.
2. 각 턴은 situation(상황 설명, 15자 이내), characterLine(캐릭터 대사, 50자 이내), choices(3개), characterReactions(choiceId별 캐릭터 반응 대사, 각 50자 이내)로 구성됩니다.
3. 선택지 3개는 반드시 bold(직진형), witty(위트형), safe(안전형) type으로 구분하세요.
4. ${profile.name}은(는) "${profile.likes}"에 높은 호감, "${profile.dislikes}"에 감점합니다. 이에 맞는 선택지가 높은 affectionDelta를 받아야 합니다.
5. 유저의 사주 성향(${ilganDescription})이 반영된 선택지를 자연스럽게 포함하세요.
6. affectionDelta 범위:
   - 캐릭터가 좋아하는 유형의 선택: +12 ~ +20
   - 무난한 선택: +3 ~ +8
   - 캐릭터가 싫어하는 유형의 선택: -10 ~ -3
7. 턴별 상황 전개:
   - 1턴: 첫 만남 (카페 도착)
   - 2턴: 가벼운 대화 (취미/관심사)
   - 3턴: 분위기 전환 (깊어지는 대화 or 돌발 상황)
   - 4턴: 핵심 질문 (가치관/연애관)
   - 5턴: 결정적 순간 (데이트 제안)
8. 대사는 20대~30대 한국어 구어체. ${profile.speechPattern}을 정확히 따르세요.
9. scoreImpact는 각 항목 -2 ~ +3 범위:
   - charm: 매력도, conversation: 대화력, sense: 센스, addiction: 중독성
   - bold 선택이 캐릭터 취향과 맞으면 charm+2 addiction+2
   - witty 선택이 맞으면 sense+3 conversation+1
   - safe 선택이 맞으면 conversation+1
   - 어긋나면 해당 항목 -1~-2
10. choice id 형식: "t{턴번호}_c{선택번호}" (예: "t1_c1")
11. 선택지 텍스트는 유저의 대사이므로 30자 이내, 자연스러운 대화체로 작성하세요.

## 출력
아래 JSON만 출력하세요. 마크다운, 설명, 코드블록 없이 순수 JSON만.

{"turns":[{"turnNumber":1,"situation":"카페에서 첫 만남","characterLine":"캐릭터 대사","choices":[{"id":"t1_c1","text":"선택지 텍스트","type":"bold","affectionDelta":15,"scoreImpact":{"charm":2,"conversation":0,"sense":1,"addiction":2}},{"id":"t1_c2","text":"선택지","type":"witty","affectionDelta":10,"scoreImpact":{"charm":1,"conversation":1,"sense":3,"addiction":0}},{"id":"t1_c3","text":"선택지","type":"safe","affectionDelta":5,"scoreImpact":{"charm":0,"conversation":1,"sense":0,"addiction":0}}],"characterReactions":{"t1_c1":"반응1","t1_c2":"반응2","t1_c3":"반응3"}}]}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini API error:', response.status, errText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

  // JSON 파싱 (코드블록 제거)
  text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

  const parsed = JSON.parse(text);

  // 검증: turns 배열이 있고 5개인지
  if (!parsed.turns || !Array.isArray(parsed.turns) || parsed.turns.length < 5) {
    throw new Error('대화 트리 형식 오류: turns 부족');
  }

  return { ...parsed, successThreshold };
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { resultId, characterId, sajuIndicators, ilganDescription, compatibility, gender } = body;

    if (!resultId || !characterId) {
      return errorResponse(req, 'resultId와 characterId는 필수입니다.', 400);
    }

    const profile = CHARACTER_PROFILES[characterId];
    if (!profile) {
      return errorResponse(req, '존재하지 않는 캐릭터입니다.', 400);
    }

    // ─── 1. 성공 임계값 계산 ──────────────────────────
    const successThreshold = getSuccessThreshold(profile, compatibility);

    // ─── 2. Gemini로 대화 트리 생성 ──────────────────
    let conversationTree: unknown;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        conversationTree = await generateConversationTree(
          profile,
          sajuIndicators,
          ilganDescription,
          compatibility,
          gender,
          successThreshold,
        );
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`대화 생성 시도 ${attempt}/2 실패:`, lastError.message);
        if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
      }
    }

    if (!conversationTree) {
      return errorResponse(req, `대화 생성 실패: ${lastError?.message}`, 502);
    }

    // ─── 3. DB 업데이트 ──────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase
      .from('dating_results')
      .update({
        character_id: characterId,
        conversation_tree: conversationTree,
        status: 'conversation',
      })
      .eq('id', resultId);

    // ─── 4. 응답 ──────────────────────────────────────
    return jsonResponse(req, { conversationTree });

  } catch (err) {
    console.error('generate-dating-conversation 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
