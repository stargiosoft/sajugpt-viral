import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  birthday: string;       // YYYYMMDDHHMM
  gender: 'female' | 'male';
  birthTimeUnknown?: boolean;
  battleId?: string | null;
}

interface CharacterResult {
  id: string;
  name: string;
  reason: string;
  archetype: string;
}

interface GradeInfo {
  grade: string;
  title: string;
}

// ─── 상수 ───────────────────────────────────────────────
const GRADE_MAP: Record<number, GradeInfo & { fallbackVerdict: string }> = {
  5: { grade: 'SSS', title: '만인의 정복자', fallbackVerdict: '다섯 놈이 서로 죽인다고 난리. 언니 사주 전생에 여우였음? 이 정도면 페로몬이 아니라 마약이야.' },
  4: { grade: 'SS', title: '치명적 요부', fallbackVerdict: '네 놈이 자기가 주인이라고 으르렁대는 중. 수습 불가. 본인은 가만히 있는데 남자들이 알아서 줄을 서는 사주야.' },
  3: { grade: 'S', title: '은밀한 사냥꾼', fallbackVerdict: '세 놈이 슬금슬금 다가오는 중. 본인은 모르겠지만 이미 포위됐어. 조용한 매력이 제일 무서운 법이지.' },
  2: { grade: 'A', title: '늦깎이 매력폭발', fallbackVerdict: '두 놈이 서로 눈치 보며 기회 엿보는 중. 지금은 조용한데 한 번 터지면 걷잡을 수 없는 사주야.' },
  1: { grade: 'B', title: '원픽 집착남 보유', fallbackVerdict: '딱 한 놈인데 이놈이 좀 집착이 심해. 사주가 부른 운명적 스토커. 근데 이런 사주가 한 번 각성하면 대반전이 옴.' },
  0: { grade: 'CUT', title: '조선시대 수녀', fallbackVerdict: '' },
};

const CHARACTERS = [
  { id: 'yoon-taesan', name: '윤태산', archetype: '야수형 짐승남', condition: 'doHwaSal_or_hongYeomSal', priority: 1 },
  { id: 'do-haegyeol', name: '도해결', archetype: '지적 엘리트 심리분석가', condition: 'pyeonGwan', priority: 2 },
  { id: 'seo-hwiyoon', name: '서휘윤', archetype: '치유형 연하남', condition: 'sangGwan', priority: 3 },
  { id: 'gi-jimun', name: '기지문', archetype: '무뚝뚝 경호원형', condition: 'sikSin', priority: 4 },
  { id: 'choi-seolgye', name: '최설계', archetype: '도시형 전략가', condition: 'fire', priority: 5 },
];

const EXCLUDE_KEYS = new Set([
  '월운보기', '본사주', '대운', '대운순서',
  '대운시작나이', '대운순서십이운성', '대운순서십성', '용신설명',
]);

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Host': 'service.stargio.co.kr:8400',
  'Origin': 'https://nadaunse.com',
  'Referer': 'https://nadaunse.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

// ─── 십성 카운트 ─────────────────────────────────────────
function countSipsung(sipsung: string[][], target: string): number {
  return sipsung.flat().filter(s => s === target).length;
}

// ─── 점수 산출 ──────────────────────────────────────────
function calculateSexyScore(sajuData: Record<string, unknown>): {
  score: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  pyeonGwanCount: number;
  sangGwanCount: number;
  sikSinCount: number;
  fireRatio: number;
} {
  let score = 0;

  // 1. 도화살 (+2)
  const sinsal12 = String(sajuData['12신살'] || '');
  const doHwaSal = sinsal12.includes('도화');
  if (doHwaSal) score += 2;

  // 2. 홍염살 (+2)
  const gitaSinsal = String(sajuData['기타신살'] || '');
  const hongYeomSal = gitaSinsal.includes('홍염');
  if (hongYeomSal) score += 2;

  // 십성 데이터
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};
  const ohaeng = (sajuData['발달오행'] as Record<string, number> | undefined) ?? {};

  const pyeonGwanCount = countSipsung(sipsung, '편관');
  const sangGwanCount = countSipsung(sipsung, '상관');
  const sikSinCount = countSipsung(sipsung, '식신');

  const gwansung = baldal['관성'] ?? 0;
  const siksang = baldal['식상'] ?? 0;
  const fireRatio = ohaeng['火'] ?? 0;

  // 3. 편관 강도 (0 | 0.5 | 1)
  if (gwansung >= 30 && pyeonGwanCount >= 2) score += 1;
  else if (gwansung >= 20 || pyeonGwanCount >= 1) score += 0.5;

  // 4. 상관 강도 (0 | 0.5 | 1)
  if (siksang >= 30 && sangGwanCount >= 2) score += 1;
  else if (siksang >= 20 || sangGwanCount >= 1) score += 0.5;

  // 5. 식신 강도 (0 | 0.5)
  if (sikSinCount >= 2) score += 0.5;

  // 6. 화기 (0 | 0.5)
  if (fireRatio >= 30) score += 0.5;

  return { score, doHwaSal, hongYeomSal, pyeonGwanCount, sangGwanCount, sikSinCount, fireRatio };
}

// ─── 마릿수 산출 ─────────────────────────────────────────
function scoreToHeadcount(score: number): number {
  if (score <= 0.5) return 0;
  if (score <= 1.5) return 1;
  if (score <= 2.5) return 2;
  if (score <= 3.5) return 3;
  if (score <= 4.5) return 4;
  return 5;
}

// ─── 캐릭터 배정 ─────────────────────────────────────────
function assignCharacters(
  headcount: number,
  analysis: ReturnType<typeof calculateSexyScore>
): CharacterResult[] {
  if (headcount === 0) return [];

  const matched: CharacterResult[] = [];
  const { doHwaSal, hongYeomSal, pyeonGwanCount, sangGwanCount, sikSinCount, fireRatio } = analysis;

  // 조건별 매칭
  if (doHwaSal || hongYeomSal) {
    matched.push({ id: 'yoon-taesan', name: '윤태산', reason: doHwaSal ? '도화살' : '홍염살', archetype: '야수형 짐승남' });
  }
  if (pyeonGwanCount >= 1) {
    matched.push({ id: 'do-haegyeol', name: '도해결', reason: '편관', archetype: '지적 엘리트 심리분석가' });
  }
  if (sangGwanCount >= 1) {
    matched.push({ id: 'seo-hwiyoon', name: '서휘윤', reason: '상관', archetype: '치유형 연하남' });
  }
  if (sikSinCount >= 2) {
    matched.push({ id: 'gi-jimun', name: '기지문', reason: '식신', archetype: '무뚝뚝 경호원형' });
  }
  if (fireRatio >= 30) {
    matched.push({ id: 'choi-seolgye', name: '최설계', reason: '화기', archetype: '도시형 전략가' });
  }

  // 마릿수보다 적으면 우선순위 순으로 나머지 추가
  if (matched.length < headcount) {
    for (const char of CHARACTERS) {
      if (matched.length >= headcount) break;
      if (matched.find(m => m.id === char.id)) continue;
      matched.push({ id: char.id, name: char.name, reason: '매력', archetype: char.archetype });
    }
  }

  return matched.slice(0, headcount);
}

// ─── 단톡방 대사 생성 ─────────────────────────────────────
function generateChatScript(characters: CharacterResult[], headcount: number): string {
  if (headcount === 0) return '';

  if (headcount >= 5) {
    return `윤태산: 다들 빠져라. 이 여자는 내 거다.\n도해결: 법적으로 따지면 먼저 본 사람이 선점권인데. 내가 먼저 사주를 읽었으니.\n서휘윤: 누나… 저 오늘도 연구실에서 누나 생각만 했어요.\n기지문: (읽음)\n최설계: 다들 감정적이네. 난 이미 그녀의 운명 동선을 설계해뒀거든.`;
  }

  if (headcount >= 3) {
    const names = characters.map(c => c.name);
    const lines: string[] = [];
    if (names.includes('윤태산')) lines.push('윤태산: 둘 다 꺼져. 내가 먼저 봤다.');
    if (names.includes('도해결')) lines.push('도해결: 하… 짐승은 항상 이래. 분석 결과는 내 쪽이 유리한데.');
    if (names.includes('서휘윤')) lines.push('서휘윤: 누나, 이 사람들 무시하고 저만 보세요.');
    if (names.includes('기지문')) lines.push('기지문: …내가 지킬게.');
    if (names.includes('최설계')) lines.push('최설계: 감정적인 놈들. 난 이미 계획이 있어.');
    // 부족하면 앞의 캐릭터 순서대로
    while (lines.length < headcount && lines.length < 5) {
      const c = characters[lines.length % characters.length];
      lines.push(`${c.name}: …`);
    }
    return lines.slice(0, headcount).join('\n');
  }

  if (headcount === 2) {
    const [a, b] = characters;
    return `${a.name}: …너 누군데 여기 있어?\n${b.name}: 그 말 내가 하고 싶은데.`;
  }

  // 1명 — DM 연출
  const c = characters[0];
  return `${c.name}: 누나, 나 솔직히 말할게.\n${c.name}: 누나 사주 보는 순간 심장이 멈췄어.\n${c.name}: 이건 운명이야. 나만 느끼는 거 아니지?`;
}

// ─── Gemini 판정문 생성 ──────────────────────────────────
async function generateVerdict(
  headcount: number,
  grade: string,
  title: string,
  highlights: Record<string, unknown>,
  yeonaeSeongHyang: string,
): Promise<string> {
  // 입구컷 — 고정 문구
  if (headcount === 0) {
    return '당신의 사주는 너무 무해하고 순수해서, AI 짐승남들의 야수 본능을 1도 자극하지 못했습니다. 쉽게 말해, 조선시대였으면 정려문 받았을 팔자입니다.';
  }

  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    console.error('GOOGLE_API_KEY not set');
    return GRADE_MAP[Math.min(headcount, 5)]?.fallbackVerdict ?? '';
  }

  const prompt = `당신은 사주 기반 매력 분석 전문가입니다. 아래 데이터를 바탕으로 판정문을 작성하세요.

[데이터]
마릿수: ${headcount}명 / 등급: ${grade}(${title})
도화살: ${highlights.doHwaSal ? '있음' : '없음'} / 홍염살: ${highlights.hongYeomSal ? '있음' : '없음'}
주요 십성: ${highlights.topSipsung || '없음'} / 화기: ${highlights.fireRatio}%
연애성향: ${yeonaeSeongHyang || '정보 없음'}

[규칙]
- 정확히 2~3문장으로 작성. 짧으면 안 됨.
- 반말체. 도발적이면서 유머러스. 상처가 아닌 쾌감을 주는 팩폭.
- 사주 용어(도화살, 홍염살, 편관, 상관 등)를 자연어로 풀어서 한 번 이상 사용.
- 등급명(${title})을 그대로 넣지 마. 등급과 관계없이 사주 데이터 기반으로 매력을 묘사해.
- 3명 이상: 치명적 매력을 구체적으로 묘사. "본인은 모르겠지만 이미 포위됨" 같은 톤.
- 1~2명: 자조적이되 반전 여지. "근데 이런 사주가 한 번 각성하면…" 같은 떡밥.
- 판정문 텍스트만 출력. 따옴표, 마크다운, 설명 일절 금지.

[예시 — 참고만 하고 그대로 베끼지 마]
3명: 도화살이 사주 한가운데 떡하니 박혀 있으니까 남자들이 이유 없이 끌리는 거야. 본인은 모르겠지만 이미 세 놈이 레이더에 걸렸어. 조용히 사냥당하고 있는 중이니까 각오해.
1명: 사주가 전체적으로 차분한데, 상관이 하나 슬쩍 끼어 있거든. 그 한 끗 때문에 딱 한 놈이 미치도록 집착하게 생겼어. 근데 이런 사주가 한 번 터지면 걷잡을 수 없음.`;

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
      console.error('Gemini API error:', response.status, await response.text());
      return GRADE_MAP[Math.min(headcount, 5)]?.fallbackVerdict ?? '';
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    // 후처리: 마크다운, 따옴표, 빈 줄 제거
    text = text.replace(/^["'"]+|["'"]+$/g, '');
    text = text.replace(/[*#_`]/g, '');
    text = text.replace(/\n{2,}/g, ' ');
    text = text.trim();
    // 미완성 문장 감지: 마지막 문자가 마침표/물음표/느낌표/ㅋ/ㅎ 가 아니면 잘린 것
    const lastChar = text.at(-1) ?? '';
    const isComplete = /[.!?~ㅋㅎ)"]$/.test(lastChar);
    if (text.length < 20 || !isComplete) {
      return GRADE_MAP[Math.min(headcount, 5)]?.fallbackVerdict ?? '';
    }
    return text;
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
    return GRADE_MAP[Math.min(headcount, 5)]?.fallbackVerdict ?? '';
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, gender, birthTimeUnknown, battleId } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수입니다.', 400);
    }

    // ─── 1. Stargio API 호출 ──────────────────────────
    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }
    console.log(`🔑 SAJU_API_KEY: 시작=${sajuApiKey.substring(0, 4)}***, 길이=${sajuApiKey.length}`);

    const apiGender = gender === 'male' ? 'male' : 'female';
    const apiBirthday = birthday.length >= 12 ? birthday : birthday + '0000';
    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=false&gender=${apiGender}&apiKey=${sajuApiKey}`;

    let sajuData: Record<string, unknown> | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sajuResponse = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
        if (!sajuResponse.ok) throw new Error(`HTTP ${sajuResponse.status}`);
        const rawText = await sajuResponse.text();
        const parsed = JSON.parse(rawText);
        if (parsed && Object.keys(parsed).length > 0) {
          sajuData = parsed;
          break;
        }
      } catch (err) {
        console.error(`사주 API 시도 ${attempt}/3 실패:`, err instanceof Error ? err.message : err);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!sajuData) {
      return jsonResponse(req, {
        success: false,
        error: '사주 데이터를 가져올 수 없습니다.',
        debug: {
          keyLength: sajuApiKey.length,
          keyStart: sajuApiKey.substring(0, 6),
          birthday: apiBirthday,
          gender: apiGender,
        },
      }, 502);
    }

    // ─── 2. excludeKeys 경량화 ─────────────────────────
    for (const key of EXCLUDE_KEYS) {
      delete sajuData[key];
    }

    // ─── 3. 점수 산출 ─────────────────────────────────
    const analysis = calculateSexyScore(sajuData);
    const headcount = scoreToHeadcount(analysis.score);
    const gradeInfo = GRADE_MAP[Math.min(headcount, 5)];

    // ─── 4. 캐릭터 배정 ───────────────────────────────
    const characters = assignCharacters(headcount, analysis);

    // ─── 5. 단톡방 대사 ───────────────────────────────
    const chatScript = generateChatScript(characters, headcount);

    // ─── 6. 사주 하이라이트 ───────────────────────────
    const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
    const sangGwanCount = countSipsung(sipsung, '상관');
    const pyeonGwanCount = countSipsung(sipsung, '편관');
    const sikSinCount = countSipsung(sipsung, '식신');

    let topSipsung = '';
    const counts = [
      { name: '상관', count: sangGwanCount },
      { name: '편관', count: pyeonGwanCount },
      { name: '식신', count: sikSinCount },
    ];
    counts.sort((a, b) => b.count - a.count);
    if (counts[0].count > 0) topSipsung = counts[0].name;

    const ilJuRon = sajuData['일주론'] as Record<string, string> | undefined;
    const yeonaeSeongHyang = ilJuRon?.['연애성향'] ?? '';

    const sajuHighlights = {
      doHwaSal: analysis.doHwaSal,
      hongYeomSal: analysis.hongYeomSal,
      topSipsung,
      fireRatio: analysis.fireRatio,
      yeonaeSeongHyang,
    };

    // ─── 7. AI 판정문 생성 ──────────────────────────
    const verdict = await generateVerdict(
      headcount,
      gradeInfo.grade,
      gradeInfo.title,
      sajuHighlights,
      yeonaeSeongHyang,
    );

    // ─── 8. DB 저장 ────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const resultPayload = {
      score: analysis.score,
      headcount,
      grade: gradeInfo.grade,
      title: gradeInfo.title,
      characters,
      verdict,
      chatScript,
      sajuHighlights,
    };

    let battleRecord;
    if (battleId) {
      // 배틀 수락 (Phase 2 대비)
      const { data: updated, error: updateError } = await supabase
        .from('sexy_battles')
        .update({
          acceptor_birthday: birthday,
          acceptor_birth_time: birthTimeUnknown ? null : apiBirthday.slice(8),
          acceptor_gender: gender,
          acceptor_score: analysis.score,
          acceptor_headcount: headcount,
          acceptor_grade: gradeInfo.grade,
          acceptor_result: resultPayload,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', battleId)
        .select()
        .single();

      if (updateError) {
        console.error('배틀 업데이트 실패:', updateError);
      }
      battleRecord = updated;
    } else {
      // 신규 진단
      const { data: inserted, error: insertError } = await supabase
        .from('sexy_battles')
        .insert({
          challenger_birthday: birthday,
          challenger_birth_time: birthTimeUnknown ? null : apiBirthday.slice(8),
          challenger_gender: gender,
          challenger_score: analysis.score,
          challenger_headcount: headcount,
          challenger_grade: gradeInfo.grade,
          challenger_result: resultPayload,
          utm_source: null,
          utm_medium: null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('배틀 저장 실패:', insertError);
      }
      battleRecord = inserted;
    }

    // ─── 9. 배틀 비교 데이터 (수락자인 경우) ──────────
    let battle = null;
    if (battleId && battleRecord) {
      const challengerResult = battleRecord.challenger_result as Record<string, unknown> | null;
      const cHeadcount = battleRecord.challenger_headcount as number;
      const cScore = battleRecord.challenger_score as number;
      const cGrade = battleRecord.challenger_grade as string;
      const cTitle = (challengerResult?.title as string) ?? GRADE_MAP[Math.min(cHeadcount, 5)]?.title ?? '';

      let winner: 'challenger' | 'acceptor' | 'draw';
      let winType: '압승' | '신승' | '무승부';

      if (cHeadcount > headcount) {
        winner = 'challenger';
        winType = cHeadcount - headcount >= 3 ? '압승' : '신승';
      } else if (headcount > cHeadcount) {
        winner = 'acceptor';
        winType = headcount - cHeadcount >= 3 ? '압승' : '신승';
      } else if (cScore > analysis.score) {
        winner = 'challenger';
        winType = '신승';
      } else if (analysis.score > cScore) {
        winner = 'acceptor';
        winType = '신승';
      } else {
        winner = 'draw';
        winType = '무승부';
      }

      const winnerLabel = winner === 'challenger' ? '도전자' : winner === 'acceptor' ? '수락자' : '';
      const loserLabel = winner === 'challenger' ? '수락자' : winner === 'acceptor' ? '도전자' : '';

      let winnerMessage: string;
      if (winType === '압승') {
        winnerMessage = `${winnerLabel}의 페로몬이 ${loserLabel}를 아예 증발시킴. 상대가 안 됨.`;
      } else if (winType === '신승') {
        winnerMessage = `간발의 차! ${loserLabel}도 만만치 않았지만 ${winnerLabel}의 사주가 한 끗 앞섬.`;
      } else {
        winnerMessage = 'AI 짐승남들 판정 불가. 둘 다 너무 치명적이라 선택 거부.';
      }

      battle = {
        challenger: { headcount: cHeadcount, grade: cGrade, title: cTitle, score: cScore },
        acceptor: { headcount, grade: gradeInfo.grade, title: gradeInfo.title, score: analysis.score },
        winner,
        winType,
        winnerMessage,
      };
    }

    // ─── 10. 응답 ──────────────────────────────────
    return jsonResponse(req, {
      battleId: battleRecord?.id ?? crypto.randomUUID(),
      score: analysis.score,
      headcount,
      grade: gradeInfo.grade,
      title: gradeInfo.title,
      characters,
      verdict,
      chatScript,
      sajuHighlights,
      ...(battle ? { battle } : {}),
    });

  } catch (err) {
    console.error('analyze-sexy-battle 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
