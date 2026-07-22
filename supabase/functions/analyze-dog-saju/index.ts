import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 정의 ───────────────────────────────────────────
interface RequestBody {
  birthday: string;
  birthTime?: string;
  gender: 'female' | 'male';
  calendarType?: 'solar' | 'lunar';
  birthTimeUnknown?: boolean;
}

export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';

const CHEONGAN_TO_STEM: Record<string, HeavenlyStem> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계',
  '갑': '갑', '을': '을', '병': '병', '정': '정', '무': '무',
  '기': '기', '경': '경', '신': '신', '임': '임', '계': '계',
};

const STEM_TO_KEY: Record<HeavenlyStem, string> = {
  갑: 'gap', 을: 'eul', 병: 'byeong', 정: 'jeong', 무: 'mu',
  기: 'gi', 경: 'gyeong', 신: 'sin', 임: 'im', 계: 'gye',
};

const STEMS_LIST: HeavenlyStem[] = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// ─── STARGIO API 헤더 ─────────────────────────────────────
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

function mapDbToDeangBreed(raw: any) {
  if (!raw) return null;
  const stem = (raw.heavenly_stem || '갑') as HeavenlyStem;
  return {
    code: raw.code,
    key: STEM_TO_KEY[stem] || 'gap',
    stemName: stem,
    breedName: raw.name,
    title: raw.title,

    hashtags: raw.hashtags || [],
    baseStats: raw.abilities || { leadership: 0, affection: 0, perceptiveness: 0, independence: 0, attachment: 0 },
    temperament: raw.personality,
    socialStyle: raw.social_style,
    loveStyle: raw.love_style,
    workStyle: raw.work_style,
    quips: raw.quips || [],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, birthTime, gender, calendarType = 'solar', birthTimeUnknown } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수 입력 사항입니다.', 400);
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    let dayStem: HeavenlyStem | null = null;

    const cleanBirthday = birthday.replace(/[^0-9]/g, '');

    // ─── 1. Stargio API 호출 ──────────────────────────────
    if (sajuApiKey) {
      let apiBirthday = cleanBirthday;

      if (!birthTimeUnknown && birthTime && birthTime !== '모름') {
        const match = birthTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
        if (match) {
          let hour = parseInt(match[2], 10);
          if (match[1] === '오후' && hour < 12) hour += 12;
          if (match[1] === '오전' && hour === 12) hour = 0;
          apiBirthday = cleanBirthday + String(hour).padStart(2, '0') + match[3];
        }
      }

      if (apiBirthday.length < 12) {
        apiBirthday = apiBirthday.padEnd(12, '0');
      }

      const isLunar = calendarType === 'lunar';
      const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=${isLunar}&gender=${gender}&apiKey=${sajuApiKey}`;

      let sajuData: any = null;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const sajuResponse = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
          if (!sajuResponse.ok) throw new Error(`HTTP ${sajuResponse.status}`);
          const parsed = await sajuResponse.json();
          if (parsed && Object.keys(parsed).length > 0) {
            sajuData = parsed;
            break;
          }
        } catch (err) {
          console.error(`Stargio API 시도 ${attempt}/3 실패:`, err instanceof Error ? err.message : err);
          if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      }

      // ─── Stargio API 파싱 및 디버그 로그 출력 ────────────────
      if (sajuData) {
        let ilganChar: string | null = null;
        // 사주 배열 순서: [시주, 일주, 월주, 년주] -> index 1 이 일주 (예: "己丑")
        // 일간은 일주의 첫 글자 (예: "己丑" -> "己")
        if (Array.isArray(sajuData['사주']) && sajuData['사주'].length >= 2) {
          const dayPillar = sajuData['사주'][1];
          if (dayPillar && dayPillar.length > 0) {
            ilganChar = dayPillar.charAt(0);
          }
        }

        // 2순위: sajuData.천간점수도 동일하게 [시주, 일주, 월주, 년주] 순서 -> index 1 이 일간
        if (!ilganChar && Array.isArray(sajuData['천간점수']) && sajuData['천간점수'].length >= 2) {
          const dayStemTuple = sajuData['천간점수'][1];
          if (Array.isArray(dayStemTuple) && dayStemTuple.length > 0) {
            ilganChar = dayStemTuple[0];
          }
        }
        if (ilganChar && CHEONGAN_TO_STEM[ilganChar]) {
          dayStem = CHEONGAN_TO_STEM[ilganChar];
          console.log('[Stargio API] 매핑 성공된 내 일간:', dayStem);
        } else {
          console.warn('⚠️ [Stargio API] 일간 파싱 또는 한자 매핑 실패');
        }
        console.log('----------------------------------------');
      }
    }

    // ─── 2. Fallback 일간 ──────────────────────────────────
    if (!dayStem) {
      const dateNum = parseInt(cleanBirthday, 10) || 0;
      const stemIndex = Math.abs(dateNum) % 10;
      dayStem = STEMS_LIST[stemIndex];
    }

    // ─── 3. Supabase DB 캐릭터 조회 ────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: mainDog, error: dbError } = await supabase
      .from('dog_profiles')
      .select('*')
      .eq('heavenly_stem', dayStem)
      .single();

    if (dbError || !mainDog) {
      console.error(`dog_profiles 조회 오류 (일간: ${dayStem}):`, dbError);
      return errorResponse(req, '해당 일간에 일치하는 댕댕사주 캐릭터 정보를 찾을 수 없습니다.', 404);
    }

    let bestMatchDog = null;
    let worstMatchDog = null;

    if (mainDog.best_match) {
      const { data: bMatch } = await supabase.from('dog_profiles').select('*').eq('code', mainDog.best_match).maybeSingle();
      bestMatchDog = bMatch;
    }
    if (mainDog.worst_match) {
      const { data: wMatch } = await supabase.from('dog_profiles').select('*').eq('code', mainDog.worst_match).maybeSingle();
      worstMatchDog = wMatch;
    }

    const mainBreed = mapDbToDeangBreed(mainDog)!;
    const bestMatchBreed = mapDbToDeangBreed(bestMatchDog) || mainBreed;
    const worstMatchBreed = mapDbToDeangBreed(worstMatchDog) || mainBreed;

    const quip = mainDog.quips && mainDog.quips.length > 0
      ? mainDog.quips[Math.floor(Math.random() * mainDog.quips.length)]
      : mainDog.title;

    const profileData = {
      breed: mainBreed,
      stats: mainBreed.baseStats,
      bestMatch: bestMatchBreed,
      worstMatch: worstMatchBreed,
      quip: quip,
    };

    let resultId = crypto.randomUUID();
    try {
      const { data: resultInsert } = await supabase
        .from('deang_saju_results')
        .insert({
          dog_code: mainDog.code,
          profile: profileData,
        })
        .select('id')
        .maybeSingle();

      if (resultInsert) {
        resultId = resultInsert.id;
      }
    } catch (_e) {
      // ignore
    }

    return jsonResponse(req, {
      success: true,
      resultId,
      dayStem,
      dayStemKey: STEM_TO_KEY[dayStem] || 'gap',
      profile: profileData,
    });

  } catch (err: any) {
    console.error('analyze-dog-saju 처리 에러:', err);
    return errorResponse(req, err.message || '서버 오류가 발생했습니다.', 500);
  }
});