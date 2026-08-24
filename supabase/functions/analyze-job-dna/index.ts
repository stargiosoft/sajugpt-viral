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

interface Page1Result {
  title: string;      // "PAGE 1. 십성(十星)으로 보는 직무 형태"
  group: string;  
  groupKey: string;  
  score: number;     
  jobs: string[]; 
}

interface Page2Result {
  title: string;      // "PAGE 2. 오행(五行)으로 보는 산업 분야"
  element: string;   
  elementKey: string;
  score: number;    
  industries: string[];
}

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

// ─── PAGE 1. 십성(十星) → 직무 형태 매핑 ───
const SIPSEONG_JOB_MAP: Record<string, { label: string; jobs: string[] }> = {
  '비겁': { label: '비겁(比劫)', jobs: ['독립 창업', '리더십/팀 운영', '경쟁 전략 수립', '자기주도'] },
  '식상': { label: '식상(食傷)', jobs: ['서비스 기획', 'IT 개발', '문제 해결', '크리에이티브'] },
  '재성': { label: '재성(財星)', jobs: ['데이터 분석', '투자·재무', '비즈니스 개발', '유통·물류'] },
  '관성': { label: '관성(官星)', jobs: ['조직 관리', '인증/보안', '행정/공직', '감사/품질관리'] },
  '인성': { label: '인성(印星)', jobs: ['연구/기획', '전문직', '교육/컨설팅', '학문 탐구'] },
};

// ─── PAGE 2. 오행(五行) → 산업 분야 매핑 ───
const OHAENG_INDUSTRY_MAP: Record<string, { label: string; color: string; industries: string[] }> = {
  '木': { label: '목(木)', color: '#2E8B57', industries: ['교육&인적 자원', '출판/미디어', '패션&디자인', '문화/예술', '스타트업&신사업기획', '바이오/헬스케어'] },
  '火': { label: '화(火)', color: '#FF6B6B', industries: ['IT/소프트웨어', '방송/미디어', '광고/마케팅', '예술디자인', '패션뷰티', '엔터테인먼트'] },
  '土': { label: '토(土)', color: '#D97706', industries: ['부동산', '건설', '농업&식품', '유통', '공공&인프라', '중개&플랫폼'] },
  '金': { label: '금(金)', color: '#64748B', industries: ['금융&투자', '법률', '제조업', '첨단 기술&기계', '의료&바이오', '보석/정밀'] },
  '水': { label: '수(水)', color: '#1D3557', industries: ['무역/물류', '통신/IT서비스', '유통업', '컨설팅', '심리상담', '글로벌 비즈니스', '학술/연구'] },
};

// ─── 유틸: 점수 객체에서 최댓값 항목 찾기 ─────────────────────
function getDominantEntry(counts: Record<string, number> | undefined | null): { key: string; value: number } | null {
  if (!counts) return null;
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  return entries.reduce((max, cur) => (cur[1] > max.value ? { key: cur[0], value: cur[1] } : max), { key: entries[0][0], value: entries[0][1] });
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
    const cleanBirthday = birthday.replace(/[^0-9]/g, '');

    let sajuData: any = null;
    let page1: Page1Result | null = null;
    let page2: Page2Result | null = null;
    let siliSummary = '';

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

      // ─── 2. 십성/오행 기반 직업 DNA 분석 ────────────────────
      if (sajuData) {
        console.log('🔍 [Stargio Raw Data]:', JSON.stringify(sajuData, null, 2));

        // PAGE 1. 십성(十星)으로 보는 직무 형태 (How)
        const dominantSipseong = getDominantEntry(sajuData['발달십성']);
        if (dominantSipseong) {
          const info = SIPSEONG_JOB_MAP[dominantSipseong.key];
          if (info) {
            page1 = {
              title: 'PAGE 1. 십성(十星)으로 보는 직무 형태 (How: 어떻게 일하는가)',
              group: info.label,
              groupKey: dominantSipseong.key,
              score: dominantSipseong.value,
              jobs: info.jobs,
            };
          }
        }

        // PAGE 2. 오행(五行)으로 보는 산업 분야 (Where)
        const dominantOhaeng = getDominantEntry(sajuData['발달오행']);
        if (dominantOhaeng) {
          const info = OHAENG_INDUSTRY_MAP[dominantOhaeng.key];
          if (info) {
            page2 = {
              title: 'PAGE 2. 오행(五行)으로 보는 산업 분야 (Where: 어디서 일하는가)',
              element: info.label,
              elementKey: dominantOhaeng.key,
              score: dominantOhaeng.value,
              industries: info.industries,
            };
          }
        }
      }
    }

    // ─── 3. Supabase 연동 및 결과 저장 ───────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const resultPayload = {
      gender,
      birthday: cleanBirthday,
      page1,
      page2,
      siliSummary,
    };

    let resultId = crypto.randomUUID();
    try {
      const { data: resultInsert } = await supabase
        .from('viral_saju_results')
        .insert({
          payload: resultPayload,
        })
        .select('id')
        .maybeSingle();

      if (resultInsert) {
        resultId = resultInsert.id;
      }
    } catch (_e) {
      // 테이블이 아직 없다면 에러 무시하고 기본 UUID 사용
    }

    // ─── 4. 프론트엔드로 응답 반환 ────────────────────────
    return jsonResponse(req, {
      success: true,
      resultId,
      data: {
        page1,
        page2,
        siliSummary,
      },
    });

  } catch (err: any) {
    console.error('직업 DNA 분석 API 처리 에러:', err);
    return errorResponse(req, err.message || '서버 오류가 발생했습니다.', 500);
  }
});