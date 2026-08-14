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

    // 💡 버그 수정: Stargio 원본 배열은 [시주, 일주, 월주, 년주] 순서입니다.
    const pillars = stargioRaw.사주; 
    const allChars = pillars.join(''); 
    const jijiList = pillars.map((p: string) => p[1]); 

    // 화면(UI)에 매핑될 때 똑바로 그려지도록 순서를 재배치합니다.
    const sajuPillars = {
      time: pillars[0] || "",
      day: pillars[1] || "",
      month: pillars[2] || "",
      year: pillars[3] || ""
    };
    
    // 💡 대표님 요청 로직: 사주 8글자 내에서 식상, 편인 글자 수 직접 카운팅
    const dayMaster = sajuPillars.day[0]; // 일간(나)
    let siksangCount = 0;
    let pyeoninCount = 0;
    let dmSkipped = false;

    for (const char of allChars) {
      if (char === dayMaster && !dmSkipped) {
        dmSkipped = true; // 본인(일간) 글자는 십성 카운트에서 1회 제외
        continue;
      }
      const sipsung = getSipsung(dayMaster, char);
      if (sipsung === '식신' || sipsung === '상관') siksangCount++;
      if (sipsung === '편인') pyeoninCount++;
    }

    // 1~4. 기존 특수 신살 체크
    const gwimunCombos = [['子','酉'], ['丑','午'], ['寅','未'], ['卯','申'], ['辰','亥'], ['巳','戌']];
    const hasGwimun = hasJiJiCombination(jijiList, gwimunCombos);
    const hyeonchimChars = ['甲', '辛', '卯', '午', '申'];
    const hasHyeonchim = hyeonchimChars.some(char => allChars.includes(char));
    const wonjinCombos = [['子','未'], ['丑','午'], ['寅','酉'], ['卯','申'], ['辰','亥'], ['巳','戌']];
    const hasWonjin = hasJiJiCombination(jijiList, wonjinCombos);
    const gwaegangBaekhoPillars = ['戊戌', '庚辰', '庚戌', '壬辰', '甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'];
    const hasGwaegang = pillars.some((pillar: string) => gwaegangBaekhoPillars.includes(pillar));

    // 5~6. 분리된 식상 / 편인 발달 체크 (글자 수 기준)
    const hasSiksang = siksangCount >= 2;
    const hasPyeonin = pyeoninCount >= 1;

    // 💡 총 6가지 조건으로 분리 및 재정의
    const conditions = [
      { id: "gwimun", name: "귀문관살", exists: hasGwimun, keyword: "천재와 광기의 스위치", description: "남들이 보지 못하는 이면을 꿰뚫어 보는 소름 돋는 영감이 있습니다. 무언가에 꽂히면 폭발적인 몰입을 보여주지만, 감정 기복이 심해 스스로를 피곤하게 만들기도 합니다." },
      { id: "hyeonchim", name: "현침살", exists: hasHyeonchim, keyword: "뼈를 때리는 예리한 통찰력", description: "바늘처럼 날카로운 기운입니다. 팩트 폭력의 장인이며, 남들의 빈틈을 귀신같이 찾아냅니다. 예민한 감각 덕분에 전문적이고 정교한 분야에서 천재성을 발휘합니다." },
      { id: "wonjin", name: "원진살", exists: hasWonjin, keyword: "예술적 히스테리와 애증", description: "복잡 미묘한 감정선을 가지게 하는 기운입니다. 내면의 갈등이 크지만, 이것이 승화될 때 남들은 흉내 낼 수 없는 독특한 예술성과 매력으로 발현됩니다." },
      { id: "gwaegang", name: "괴강/백호대살", exists: hasGwaegang, keyword: "억압을 거부하는 폭발적 에너지", description: "남의 밑에 있기를 거부하는 강렬한 반골 기질입니다. 평소엔 얌전해 보여도 스위치가 눌리면 걷잡을 수 없는 에너지를 뿜어내며 판을 뒤집어 버립니다." },
      { id: "siksang", name: "식상 발달 (2개 이상)", exists: hasSiksang, keyword: "규범을 부수는 아웃라이어", description: "기존의 틀을 깨고 자기 생각을 거침없이 표현하는 기운입니다. 톡톡 튀는 아이디어와 억압을 거부하는 실행력으로 통제 불능의 똘끼를 발산합니다." },
      { id: "pyeonin", name: "편인 발달 (1개 이상)", exists: hasPyeonin, keyword: "집요한 오타쿠적 천재성", description: "남들이 관심 없는 마이너한 분야나 미지의 세계에 꽂히면 끝장을 보는 기질입니다. 독특하고 엉뚱한 상상력으로 자기만의 확실한 세계를 구축합니다." }
    ];

    // 조건이 6개로 늘어났으므로 점수 로직 조정 (활성화당 16~17점)
    const activeCount = conditions.filter(c => c.exists).length;
    const crazyScore = Math.min(100, Math.max(0, activeCount * 17 + 10));

    let summary = "평범함을 완벽하게 거부하는 맑은 광기의 소유자입니다.";
    if (crazyScore >= 75) summary = "세상이 당신을 이해하기엔 시기상조! 압도적인 똘끼와 천재성을 품고 있습니다.";
    else if (crazyScore <= 40) summary = "상식적이고 안정적인 기운이 강합니다. 숨겨진 작은 광기를 적절히 활용하세요.";

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