declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

type Branch =
  | '子' | '丑' | '寅' | '卯' | '辰' | '巳'
  | '午' | '未' | '申' | '酉' | '戌' | '亥';

type ShinsalName =
  | '지살' | '도화살' | '월살' | '망신살' | '장성살' | '반안살'
  | '역마살' | '육해살' | '화개살' | '겁살' | '재살' | '천살';

interface AvatarInfo {
  id: string;
  name: string;
  animal: string;
  imageUrl: string;
}

interface ShinsalProfile {
  id: string;
  shinsal: ShinsalName;
  name: string;
  keyword: string;
  statText: string;
  iconUrl: string;
  description: string;
}

const AVATAR_MAP: Record<Branch, AvatarInfo> = {
  '子': { id: 'rat', name: '지혜로운 쥐', animal: '쥐', imageUrl: '/shinsal-series/images/avatars/rat.jpg' },
  '丑': { id: 'ox', name: '성실한 소', animal: '소', imageUrl: '/shinsal-series/images/avatars/ox.jpg' },
  '寅': { id: 'tiger', name: '용맹한 호랑이', animal: '호랑이', imageUrl: '/shinsal-series/images/avatars/tiger.jpg' },
  '卯': { id: 'rabbit', name: '기민한 토끼', animal: '토끼', imageUrl: '/shinsal-series/images/avatars/rabbit.jpg' },
  '辰': { id: 'dragon', name: '신비로운 용', animal: '용', imageUrl: '/shinsal-series/images/avatars/dragon.jpg' },
  '巳': { id: 'snake', name: '통찰력 있는 뱀', animal: '뱀', imageUrl: '/shinsal-series/images/avatars/snake.jpg' },
  '午': { id: 'horse', name: '열정적인 말', animal: '말', imageUrl: '/shinsal-series/images/avatars/horse.jpg' },
  '未': { id: 'sheep', name: '온유한 양', animal: '양', imageUrl: '/shinsal-series/images/avatars/sheep.jpg' },
  '申': { id: 'monkey', name: '재주 많은 원숭이', animal: '원숭이', imageUrl: '/shinsal-series/images/avatars/monkey.jpg' },
  '酉': { id: 'rooster', name: '부지런한 닭', animal: '닭', imageUrl: '/shinsal-series/images/avatars/rooster.jpg' },
  '戌': { id: 'dog', name: '충직한 개', animal: '개', imageUrl: '/shinsal-series/images/avatars/dog.png' },
  '亥': { id: 'pig', name: '풍요로운 돼지', animal: '돼지', imageUrl: '/shinsal-series/images/avatars/pig.png' },
};

const SHINSAL_PROFILES: Record<ShinsalName, ShinsalProfile> = {
  '도화살': {
    id: 'dohwasal',
    shinsal: '도화살',
    name: '두근두근 하트핀',
    keyword: '매력 · 존재감',
    statText: '매력 ★★★★★',
    iconUrl: '/shinsal-series/images/items/nyeonsal.png',
    description: '사람들의 시선을 끌거나 주변에서 존재감을 드러내는 편이에요. 사람들과 어울릴 때 자신의 매력을 자연스럽게 보여주는 성향이 나타나기 쉬워요.',
  },
  '역마살': {
    id: 'yeokmasal',
    shinsal: '역마살',
    name: '부릉부릉 스쿠터',
    keyword: '변화 · 활동',
    statText: '활동력 ★★★★★',
    iconUrl: '/shinsal-series/images/items/yeokmasal.png',
    description: '한곳에 오래 머무르기보다 새로운 환경이나 변화를 경험하려는 성향이 있는 편이에요. 이동과 새로운 경험에서 활력을 얻기 쉬워요.',
  },
  '장성살': {
    id: 'jangseongsal',
    shinsal: '장성살',
    name: '대장님 왕관',
    keyword: '주도력 · 리더십',
    statText: '주도력 ★★★★☆',
    iconUrl: '/shinsal-series/images/items/jangseongsal.png',
    description: '자신의 생각과 기준을 분명하게 가지고 주도적으로 행동하는 편이에요. 상황을 이끌거나 책임을 맡았을 때 자신의 힘을 발휘하기 쉬워요.',
  },
  '화개살': {
    id: 'hwagaesal',
    shinsal: '화개살',
    name: '몽글몽글 요술봇',
    keyword: '감성 · 몰입',
    statText: '감성 ★★★★★',
    iconUrl: '/shinsal-series/images/items/hwagaesal.png',
    description: '자신만의 세계를 깊게 파고들거나 관심 있는 분야에 몰입하는 성향이 있는 편이에요. 감성적인 분야나 창작 활동에서도 자신의 개성을 드러내기 쉬워요.',
  },
  '망신살': {
    id: 'mangsinsal',
    shinsal: '망신살',
    name: '금빛 마이크',
    keyword: '표현 · 주목',
    statText: '표현력 ★★★★★',
    iconUrl: '/shinsal-series/images/items/mangsinsal.png',
    description: '자신의 생각이나 감정을 비교적 솔직하게 표현하는 편이에요. 사람들 앞에서 자신을 드러내거나 주목받는 상황에서도 적극적으로 행동하기 쉬워요.',
  },
  '겁살': {
    id: 'geobsal',
    shinsal: '겁살',
    name: '별사탕 미니망치',
    keyword: '돌파 · 승부',
    statText: '돌파력 ★★★★☆',
    iconUrl: '/shinsal-series/images/items/geobsal.png',
    description: '쉽게 물러서기보다 상황을 정면으로 돌파하려는 성향이 있는 편이에요. 경쟁이나 어려운 상황에서도 빠르게 결단하고 움직이려는 힘이 나타나기 쉬워요.',
  },
  '재살': {
    id: 'jaesal',
    shinsal: '재살',
    name: '뿡뿡 하트방패',
    keyword: '대응 · 긴장감',
    statText: '대응력 ★★★★☆',
    iconUrl: '/shinsal-series/images/items/jaesal.png',
    description: '예상하지 못한 상황에 민감하게 반응하고 위기 상황에 빠르게 대응하려는 성향이 있는 편이에요. 긴장되는 상황에서도 해결책을 찾으려는 힘이 나타나기 쉬워요.',
  },
  '천살': {
    id: 'cheonsal',
    shinsal: '천살',
    name: '찌릿찌릿 구름띠',
    keyword: '변수 · 적응',
    statText: '적응력 ★★★★★',
    iconUrl: '/shinsal-series/images/items/cheonsal.png',
    description: '계획대로 흘러가지 않는 상황에서도 변화에 맞춰 대응하려는 성향이 있는 편이에요. 예상 밖의 상황에서 오히려 빠르게 판단하는 모습을 보이기도 해요.',
  },
  '지살': {
    id: 'jisal',
    shinsal: '지살',
    name: '요리조리 나침반',
    keyword: '호기심 · 활동',
    statText: '활동력 ★★★★☆',
    iconUrl: '/shinsal-series/images/items/jisal.png',
    description: '새로운 것에 관심을 갖고 직접 경험해보려는 호기심이 있는 편이에요. 익숙한 환경에만 머무르기보다 새로운 사람이나 경험을 찾아 움직이기 쉬워요.',
  },
  '반안살': {
    id: 'banansal',
    shinsal: '반안살',
    name: '칭찬 가득 우체통',
    keyword: '관계 · 안정',
    statText: '친화력 ★★★★☆',
    iconUrl: '/shinsal-series/images/items/banansal.png',
    description: '주변 사람들과 원만한 관계를 만들고 자신이 가진 것을 안정적으로 발전시키려는 성향이 있는 편이에요. 사람들과의 관계에서 도움을 주고받는 흐름이 생기기 쉬워요.',
  },
  '월살': {
    id: 'weolsal',
    shinsal: '월살',
    name: '달빛 구슬',
    keyword: '감수성 · 섬세함',
    statText: '감수성 ★★★★★',
    iconUrl: '/shinsal-series/images/items/weolsal.png',
    description: '주변 분위기나 감정의 변화를 세심하게 느끼는 편이에요. 혼자 생각을 정리하는 시간을 중요하게 여기거나 감정적인 부분에 민감하게 반응하기 쉬워요.',
  },
  '육해살': {
    id: 'yukhaesal',
    shinsal: '육해살',
    name: '요리조리 돋보기',
    keyword: '관찰 · 눈치',
    statText: '관찰력 ★★★★☆',
    iconUrl: '/shinsal-series/images/items/yukhaesal.png',
    description: '주변의 작은 변화나 사람들의 반응을 빠르게 알아차리는 편이에요. 상황을 관찰하고 상대방의 의도를 파악하려는 성향이 나타나기 쉬워요.',
  },
};

const SHINSAL_ORDER: ShinsalName[] = [
  '겁살', '재살', '천살', '지살', '도화살', '월살',
  '망신살', '장성살', '반안살', '역마살', '육해살', '화개살',
];

const BRANCH_GROUP: Record<Branch, number> = {
  '申': 0, '子': 0, '辰': 0,
  '亥': 1, '卯': 1, '未': 1,
  '寅': 2, '午': 2, '戌': 2,
  '巳': 3, '酉': 3, '丑': 3,
};

const GROUP_START_BRANCH: Record<number, Branch> = {
  0: '巳',
  1: '申',
  2: '亥',
  3: '寅',
};

const ALL_BRANCHES: Branch[] = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Host': 'service.stargio.co.kr:8400',
  'Origin': 'https://nadaunse.com',
  'Referer': 'https://nadaunse.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
};

/** 신살 계산 유틸리티 */
function calculateShinsal(yearBranch: Branch, targetBranch: Branch): ShinsalName {
  const group = BRANCH_GROUP[yearBranch];
  const startBranch = GROUP_START_BRANCH[group];

  const startIndex = ALL_BRANCHES.indexOf(startBranch);
  const targetIndex = ALL_BRANCHES.indexOf(targetBranch);

  const diff = (targetIndex - startIndex + 12) % 12;
  return SHINSAL_ORDER[diff];
}

/** 생년월일시 문자열 정제 */
function parseApiBirthday(birthDate: string | number, birthTime?: string): string {
  const cleanDate = String(birthDate).replace(/[^0-9]/g, '');
  let apiBirthday = cleanDate;

  if (birthTime && birthTime !== 'unknown' && birthTime !== '모름') {
    const match = String(birthTime).match(/(오전|오후)?\s*(\d{1,2}):(\d{2})/);
    if (match) {
      let hour = parseInt(match[2], 10);
      const minute = match[3];

      if (match[1] === '오후' && hour < 12) hour += 12;
      if (match[1] === '오전' && hour === 12) hour = 0;

      apiBirthday = cleanDate + String(hour).padStart(2, '0') + minute;
    }
  }

  return apiBirthday.padEnd(12, '0');
}

/** Stargio API 연동  */
async function fetchStargioSaju(url: string): Promise<any> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { method: 'GET', headers: BROWSER_HEADERS });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status} | 서버응답: ${errText}`);
      }

      const rawText = await response.text();
      const data = JSON.parse(rawText);

      if (data && Object.keys(data).length > 0) {
        return data;
      }
    } catch (err) {
      lastError = err;
      if (attempt === 3) throw lastError;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Main Server
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { birthDate, birthTime, gender, calendarType = 'solar' } = body;

    if (!birthDate || !gender) {
      throw new Error('생년월일과 성별은 필수 입력 항목입니다.');
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      throw new Error('서버 설정 오류: SAJU_API_KEY가 존재하지 않습니다.');
    }

    // 1. 요청 파라미터 정제
    const apiGender = gender === 'male' ? 'male' : 'female';
    const apiBirthday = parseApiBirthday(birthDate, birthTime);
    const isLunar = calendarType === 'lunar';

    // 2. 외부 API 호출
    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=${isLunar}&gender=${apiGender}&apiKey=${sajuApiKey}`;
    const stargioRaw = await fetchStargioSaju(sajuApiUrl);

    if (!stargioRaw || !stargioRaw.사주) {
      throw new Error('Stargio API에서 사주 데이터를 가져오지 못했습니다.');
    }

    // 3. 사주 기둥 데이터 추출
    const pillars = stargioRaw.사주;
    const sajuPillars = {
      time: pillars[0] || '',
      day: pillars[1] || '',
      month: pillars[2] || '',
      year: pillars[3] || '',
    };

    const yearBranch = (sajuPillars.year[1] || '子') as Branch;
    const pillarBranches = {
      time: sajuPillars.time ? (sajuPillars.time[1] as Branch) : null,
      day: sajuPillars.day ? (sajuPillars.day[1] as Branch) : null,
      month: sajuPillars.month ? (sajuPillars.month[1] as Branch) : null,
      year: sajuPillars.year ? (sajuPillars.year[1] as Branch) : null,
    };

    // 4. 기둥별 신살 계산
    const shinsalByPillar = {
      time: pillarBranches.time ? calculateShinsal(yearBranch, pillarBranches.time) : null,
      day: pillarBranches.day ? calculateShinsal(yearBranch, pillarBranches.day) : null,
      month: pillarBranches.month ? calculateShinsal(yearBranch, pillarBranches.month) : null,
      year: pillarBranches.year ? calculateShinsal(yearBranch, pillarBranches.year) : null,
    };

    // 5. 보유 신살 취합
    const acquiredShinsalSet = new Set<ShinsalName>();
    Object.values(shinsalByPillar).forEach((shinsal) => {
      if (shinsal) acquiredShinsalSet.add(shinsal);
    });

    const acquiredShinsals = Array.from(acquiredShinsalSet);
    const acquiredProfiles = acquiredShinsals
      .map((shinsal) => SHINSAL_PROFILES[shinsal])
      .filter(Boolean);

    const result = {
      resultId: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      input: { gender, birthDate, birthTime, calendarType },
      saju: sajuPillars,
      yearBranch,
      avatar: AVATAR_MAP[yearBranch] || AVATAR_MAP['巳'],
      acquiredShinsals,
      shinsalByPillar,
      acquiredProfiles,
      mainShinsals: acquiredProfiles,
      allProfiles: Object.values(SHINSAL_PROFILES),
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('최종 에러:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
      }),
      {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});