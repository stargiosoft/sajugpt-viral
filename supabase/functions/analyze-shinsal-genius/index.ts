import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en-US;q=0.7',
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

// 1. 지지 조합 체크 헬퍼
function hasJiJiCombination(jijiList: string[], combinations: string[][]) {
  return combinations.some(combo => 
    jijiList.includes(combo[0]) && jijiList.includes(combo[1])
  );
}

// 2. 정확한 십성(10신) 계산 엔진 (글자 2개 카운팅용)
const getCharInfo = (c: string) => {
  const map: Record<string, {el: string, yy: string}> = {
    '甲': {el: 'wood', yy: '+'}, '乙': {el: 'wood', yy: '-'},
    '丙': {el: 'fire', yy: '+'}, '丁': {el: 'fire', yy: '-'},
    '戊': {el: 'earth', yy: '+'}, '己': {el: 'earth', yy: '-'},
    '庚': {el: 'metal', yy: '+'}, '辛': {el: 'metal', yy: '-'},
    '壬': {el: 'water', yy: '+'}, '癸': {el: 'water', yy: '-'},
    '寅': {el: 'wood', yy: '+'}, '卯': {el: 'wood', yy: '-'},
    '巳': {el: 'fire', yy: '+'}, '午': {el: 'fire', yy: '-'},
    '申': {el: 'metal', yy: '+'}, '酉': {el: 'metal', yy: '-'},
    '亥': {el: 'water', yy: '+'}, '子': {el: 'water', yy: '-'},
    '辰': {el: 'earth', yy: '+'}, '戌': {el: 'earth', yy: '+'},
    '丑': {el: 'earth', yy: '-'}, '未': {el: 'earth', yy: '-'}
  };
  return map[c];
};

const getSipsung = (dm: string, target: string) => {
  const dmInfo = getCharInfo(dm);
  const tInfo = getCharInfo(target);
  if (!dmInfo || !tInfo) return '비견';
  
  const sameYy = dmInfo.yy === tInfo.yy;
  const relMap: Record<string, Record<string, [string, string]>> = {
    'wood':  { 'wood': ['비견', '겁재'], 'fire': ['식신', '상관'], 'earth': ['편재', '정재'], 'metal': ['편관', '정관'], 'water': ['편인', '정인'] },
    'fire':  { 'fire': ['비견', '겁재'], 'earth': ['식신', '상관'], 'metal': ['편재', '정재'], 'water': ['편관', '정관'], 'wood': ['편인', '정인'] },
    'earth': { 'earth': ['비견', '겁재'], 'metal': ['식신', '상관'], 'water': ['편재', '정재'], 'wood': ['편관', '정관'], 'fire': ['편인', '정인'] },
    'metal': { 'metal': ['비견', '겁재'], 'water': ['식신', '상관'], 'wood': ['편재', '정재'], 'fire': ['편관', '정관'], 'earth': ['편인', '정인'] },
    'water': { 'water': ['비견', '겁재'], 'wood': ['식신', '상관'], 'fire': ['편재', '정재'], 'earth': ['편관', '정관'], 'metal': ['편인', '정인'] }
  };
  
  return relMap[dmInfo.el][tInfo.el][sameYy ? 0 : 1];
};

// 3. 신살별 세련된 메타데이터 정의
const CONDITION_META: Record<string, { name: string; keyword: string; description: string }> = {
  gwimun: {
    name: "귀문관살",
    keyword: "생각이 너무 많음",
    description: "남들은 그냥 지나치는 것도 혼자 의미를 찾아내는 타입. 하나에 꽂히면 끝까지 파고들고, 머릿속에서 온갖 시뮬레이션을 돌립니다. 통찰력과 과몰입 사이를 자유롭게 오가는 스타일."
  },
  hyeonchim: {
    name: "현침살",
    keyword: "말이 너무 정확함",
    description: "돌려 말하는 것보다 정확하게 말하는 걸 선호합니다. 본인은 솔직했을 뿐인데 상대방은 한동안 그 말을 생각하고 있을 수도 있습니다. 대신 예리함이 필요한 분야에서는 확실한 무기가 됩니다."
  },
  wonjin: {
    name: "원진살",
    keyword: "좋아하면서도 신경 쓰임",
    description: "감정이 단순하게 흘러가지 않는 타입. 좋아하면 좋아할수록 더 신경 쓰이고, 별일 아닌 것도 한 번 더 생각합니다. 복잡한 감정선이 오히려 독특한 감각과 창의력으로 이어지기도 합니다."
  },
  gwaegang: {
    name: "괴강/백호대살",
    keyword: "참다가 한 번에 터짐",
    description: "평소에는 차분해 보여도 자신만의 기준이 확실한 타입입니다. 선을 넘었다고 느끼는 순간 태도가 완전히 달라질 수 있습니다. 쉽게 휘둘리지 않는 강한 추진력이 특징입니다."
  },
  siksang: {
    name: "식상 발달 (2개 이상)",
    keyword: "원래 그런 거야가 제일 싫음",
    description: "정해진 답을 그대로 따르기보다 직접 해보고 판단하는 타입. 아이디어가 많고 표현 욕구도 강해서 가만히 있기보다 무언가를 계속 만들어내려고 합니다."
  },
  pyeonin: {
    name: "편인 발달 (1개 이상)",
    keyword: "마이너 세계 최고 권위자",
    description: "남들이 관심 없는 분야에도 혼자 꽂히면 끝까지 파고듭니다. 어느 순간 주변 사람들이 모르는 정보를 혼자 줄줄 알고 있는 경우가 많습니다. 혼자만의 세계가 확실한 타입입니다."
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { birthDate, birthTime, gender } = body;

    if (!birthDate || !gender) throw new Error('생년월일과 성별은 필수입니다.');

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) throw new Error('서버 설정 오류: 수파베이스에 SAJU_API_KEY가 없습니다.');

    const apiGender = gender === 'male' ? 'male' : 'female';
    
    // 생년월일 + 시간 12자리 변환
    const cleanBirthday = String(birthDate).replace(/[^0-9]/g, '');
    let apiBirthday = cleanBirthday;

    if (birthTime && birthTime !== '모름') {
      const match = String(birthTime).match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
      if (match) {
        let hour = parseInt(match[2], 10);
        if (match[1] === '오후' && hour < 12) hour += 12;
        if (match[1] === '오전' && hour === 12) hour = 0;
        apiBirthday = cleanBirthday + String(hour).padStart(2, '0') + match[3];
      }
    }
    if (apiBirthday.length < 12) apiBirthday = apiBirthday.padEnd(12, '0');

    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=false&gender=${apiGender}&apiKey=${sajuApiKey}`;
    
    let stargioRaw: any = null;
    let lastError = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status} | 서버응답: ${errText}`);
        }
        
        const rawText = await response.text();
        stargioRaw = JSON.parse(rawText);
        if (stargioRaw && Object.keys(stargioRaw).length > 0) break; 
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        if (attempt === 3) throw new Error(`[API 통신 에러] ${lastError}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!stargioRaw || !stargioRaw.사주) throw new Error("Stargio API에서 사주 데이터를 가져오지 못했습니다.");

    const pillars = stargioRaw.사주; 
    const allChars = pillars.join(''); 
    const jijiList = pillars.map((p: string) => p[1]); 

    const sajuPillars = {
      time: pillars[0] || "",
      day: pillars[1] || "",
      month: pillars[2] || "",
      year: pillars[3] || ""
    };
    
    // 사주 8글자 내에서 식상, 편인 글자 수 직접 카운팅
    const dayMaster = sajuPillars.day[0]; 
    let siksangCount = 0;
    let pyeoninCount = 0;
    let dmSkipped = false;

    for (const char of allChars) {
      if (char === dayMaster && !dmSkipped) {
        dmSkipped = true; 
        continue;
      }
      const sipsung = getSipsung(dayMaster, char);
      if (sipsung === '식신' || sipsung === '상관') siksangCount++;
      if (sipsung === '편인') pyeoninCount++;
    }

    // 신살 체크 로직
    const gwimunCombos = [['子','酉'], ['丑','午'], ['寅','未'], ['卯','申'], ['辰','亥'], ['巳','戌']];
    const hasGwimun = hasJiJiCombination(jijiList, gwimunCombos);
    const hyeonchimChars = ['甲', '辛', '卯', '午', '申'];
    const hasHyeonchim = hyeonchimChars.some(char => allChars.includes(char));
    const wonjinCombos = [['子','未'], ['丑','午'], ['寅','酉'], ['卯','申'], ['辰','亥'], ['巳','戌']];
    const hasWonjin = hasJiJiCombination(jijiList, wonjinCombos);
    const gwaegangBaekhoPillars = ['戊戌', '庚辰', '庚戌', '壬辰', '甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'];
    const hasGwaegang = pillars.some((pillar: string) => gwaegangBaekhoPillars.includes(pillar));

    const hasSiksang = siksangCount >= 2;
    const hasPyeonin = pyeoninCount >= 1;

    const conditionStatus: Record<string, boolean> = {
      gwimun: hasGwimun,
      hyeonchim: hasHyeonchim,
      wonjin: hasWonjin,
      gwaegang: hasGwaegang,
      siksang: hasSiksang,
      pyeonin: hasPyeonin,
    };

    // 6가지 조건 배열 생성
    const conditions = Object.entries(CONDITION_META).map(([id, meta]) => ({
      id,
      name: meta.name,
      exists: conditionStatus[id] ?? false,
      keyword: meta.keyword,
      description: meta.description
    }));

    // 점수 로직
    const activeCount = conditions.filter(c => c.exists).length;
    const crazyScore = Math.min(100, Math.max(0, activeCount * 17 + 10));

    let summary = "아직은 꽤 정상입니다. 근데 방심하진 마세요.";
    if (crazyScore >= 85) {
      summary = "정상인 코스프레 중인데 속은 이미 딴 세상입니다.";
    } else if (crazyScore >= 70) {
      summary = "남들과 다르다는 말, 한 번쯤은 들어봤을 사람입니다.";
    } else if (crazyScore >= 50) {
      summary = "평소엔 멀쩡한데 가끔 혼자 장르가 달라집니다.";
    }

    const result = {
      resultId: crypto.randomUUID(),
      saju: sajuPillars,
      crazyScore,
      summary,
      conditions
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("최종 에러:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : '알 수 없는 에러' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});