/* =========================================================
 * 우리 아이 사용설명서
 *
 * Stargio 사주 API 구조 기반 분석
 *
 * 핵심 원칙
 * 1. Stargio API가 제공하는 명리 구조를 최우선으로 사용
 * 2. 일간(日干)을 기준으로 해석
 * 3. 발달오행은 API의 실제 값을 사용
 * 4. 발달십성은 API의 실제 값을 사용
 * 5. 신강신약은 API가 제공하면 그대로 사용
 * 6. 하나의 오행/십성만으로 성격을 확정하지 않음
 * 7. 명리학적 구조 → 콘텐츠용 현대 양육 문구로 변환
 *
 * ======================================================= */

export type Element = '목' | '화' | '토' | '금' | '수';

export type YinYang = '양' | '음';

export type TenStarGroup =
  | '비겁'
  | '식상'
  | '재성'
  | '관성'
  | '인성';

export type TenStar =
  | '비견'
  | '겁재'
  | '식신'
  | '상관'
  | '정재'
  | '편재'
  | '정관'
  | '편관'
  | '정인'
  | '편인';

export type Strength =
  | '신강'
  | '신약'
  | '중화'
  | undefined;

export interface ChildPersonalityResult {
  title: string;
  subtitle: string;

  personality: string;
  study: string;
  praise: string;
  stress: string;

  activities: string[];

  parentMessage: string;

  meta: {
    dayMaster?: string;
    dayMasterElement?: Element;
    dominantElement?: Element;
    dominantTenStar?: TenStar;
    strength?: Strength;
    elementCounts: Record<Element, number>;
    tenStarCounts: Record<TenStar, number>;
    tenStarGroups: Record<TenStarGroup, number>;
    monthBranch?: string;
    sourceKeywords: string[];
  };
}

/* =========================================================
 * 기본 명리 데이터
 * ======================================================= */

const STEM_INFO: Record<
  string,
  {
    korean: string;
    element: Element;
    yinYang: YinYang;
  }
> = {
  甲: { korean: '갑', element: '목', yinYang: '양' },
  乙: { korean: '을', element: '목', yinYang: '음' },

  丙: { korean: '병', element: '화', yinYang: '양' },
  丁: { korean: '정', element: '화', yinYang: '음' },

  戊: { korean: '무', element: '토', yinYang: '양' },
  己: { korean: '기', element: '토', yinYang: '음' },

  庚: { korean: '경', element: '금', yinYang: '양' },
  辛: { korean: '신', element: '금', yinYang: '음' },

  壬: { korean: '임', element: '수', yinYang: '양' },
  癸: { korean: '계', element: '수', yinYang: '음' },

  갑: { korean: '갑', element: '목', yinYang: '양' },
  을: { korean: '을', element: '목', yinYang: '음' },

  병: { korean: '병', element: '화', yinYang: '양' },
  정: { korean: '정', element: '화', yinYang: '음' },

  무: { korean: '무', element: '토', yinYang: '양' },
  기: { korean: '기', element: '토', yinYang: '음' },

  경: { korean: '경', element: '금', yinYang: '양' },
  신: { korean: '신', element: '금', yinYang: '음' },

  임: { korean: '임', element: '수', yinYang: '양' },
  계: { korean: '계', element: '수', yinYang: '음' },
};

/* =========================================================
 * 지지
 * ======================================================= */

const BRANCH_INFO: Record<
  string,
  {
    korean: string;
    element: Element;
  }
> = {
  子: { korean: '자', element: '수' },
  丑: { korean: '축', element: '토' },
  寅: { korean: '인', element: '목' },
  卯: { korean: '묘', element: '목' },
  辰: { korean: '진', element: '토' },
  巳: { korean: '사', element: '화' },
  午: { korean: '오', element: '화' },
  未: { korean: '미', element: '토' },
  申: { korean: '신', element: '금' },
  酉: { korean: '유', element: '금' },
  戌: { korean: '술', element: '토' },
  亥: { korean: '해', element: '수' },

  자: { korean: '자', element: '수' },
  축: { korean: '축', element: '토' },
  인: { korean: '인', element: '목' },
  묘: { korean: '묘', element: '목' },
  진: { korean: '진', element: '토' },
  사: { korean: '사', element: '화' },
  오: { korean: '오', element: '화' },
  미: { korean: '미', element: '토' },
  신: { korean: '신', element: '금' },
  유: { korean: '유', element: '금' },
  술: { korean: '술', element: '토' },
  해: { korean: '해', element: '수' },
};

const ELEMENT_ORDER: Element[] = [
  '목',
  '화',
  '토',
  '금',
  '수',
];

const TEN_STAR_ORDER: TenStar[] = [
  '비견',
  '겁재',
  '식신',
  '상관',
  '정재',
  '편재',
  '정관',
  '편관',
  '정인',
  '편인',
];

const TEN_STAR_GROUP: Record<
  TenStar,
  TenStarGroup
> = {
  비견: '비겁',
  겁재: '비겁',
  식신: '식상',
  상관: '식상',
  정재: '재성',
  편재: '재성',
  정관: '관성',
  편관: '관성',
  정인: '인성',
  편인: '인성',
};

/* =========================================================
 * API 값 정규화
 * ======================================================= */

function normalizeElement(
  value: unknown,
): Element | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const text = value
    .replace(/\s/g, '')
    .replace(/[()]/g, '');

  if (
    text.includes('목') ||
    text.includes('木')
  ) {
    return '목';
  }

  if (
    text.includes('화') ||
    text.includes('火')
  ) {
    return '화';
  }

  if (
    text.includes('토') ||
    text.includes('土')
  ) {
    return '토';
  }

  if (
    text.includes('금') ||
    text.includes('金')
  ) {
    return '금';
  }

  if (
    text.includes('수') ||
    text.includes('水')
  ) {
    return '수';
  }

  return undefined;
}

function normalizeTenStar(
  value: unknown,
): TenStar | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value
    .replace(/\s/g, '');

  const aliases: Record<
    string,
    TenStar
  > = {
    비견: '비견',
    겁재: '겁재',
    식신: '식신',
    상관: '상관',
    정재: '정재',
    正財: '정재',
    편재: '편재',
    정관: '정관',
    편관: '편관',
    정인: '정인',
    편인: '편인',
  };

  return aliases[normalized];
}

function normalizeStrength(
  value: unknown,
): Strength {
  if (typeof value !== 'string') {
    return undefined;
  }

  const text = value.replace(/\s/g, '');

  if (text.includes('신강')) {
    return '신강';
  }

  if (text.includes('신약')) {
    return '신약';
  }

  if (text.includes('중화')) {
    return '중화';
  }

  return undefined;
}

/* =========================================================
 * API의 발달오행 추출
 * ======================================================= */

function extractElementCounts(
  data: Record<string, any>,
): Record<Element, number> {
  const result: Record<Element, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  const source =
    data['발달오행'];

  if (
    source &&
    typeof source === 'object' &&
    !Array.isArray(source)
  ) {
    for (const [key, rawValue] of Object.entries(
      source,
    )) {
      const element =
        normalizeElement(key);

      if (!element) continue;

      const value = Number(rawValue);

      if (!Number.isFinite(value)) {
        continue;
      }

      result[element] = value;
    }
  }

  /*
   * 혹시 API가 다른 이름으로 제공하는 경우
   * 최소한의 fallback만 허용한다.
   */
  if (
    Object.values(result).every(
      (value) => value === 0,
    )
  ) {
    const candidates = [
      data['오행'],
      data['오행분포'],
      data['오행분포도'],
    ];

    for (const candidate of candidates) {
      if (
        !candidate ||
        typeof candidate !== 'object' ||
        Array.isArray(candidate)
      ) {
        continue;
      }

      for (const [key, rawValue] of Object.entries(
        candidate,
      )) {
        const element =
          normalizeElement(key);

        if (!element) continue;

        const value = Number(rawValue);

        if (Number.isFinite(value)) {
          result[element] = value;
        }
      }

      if (
        Object.values(result).some(
          (value) => value > 0,
        )
      ) {
        break;
      }
    }
  }

  return result;
}

/* =========================================================
 * API의 발달십성 추출
 * ======================================================= */

function extractTenStarCounts(
  data: Record<string, any>,
): Record<TenStar, number> {
  const result: Record<TenStar, number> = {
    비견: 0,
    겁재: 0,

    식신: 0,
    상관: 0,

    정재: 0,
    편재: 0,

    정관: 0,
    편관: 0,

    정인: 0,
    편인: 0,
  };

  const source =
    data['발달십성'];

  if (
    source &&
    typeof source === 'object' &&
    !Array.isArray(source)
  ) {
    for (const [key, rawValue] of Object.entries(
      source,
    )) {
      const tenStar =
        normalizeTenStar(key);

      if (!tenStar) continue;

      const value = Number(rawValue);

      if (!Number.isFinite(value)) {
        continue;
      }

      result[tenStar] = value;
    }
  }

  return result;
}

/* =========================================================
 * 십성 그룹
 * ======================================================= */

function getTenStarGroups(
  counts: Record<TenStar, number>,
): Record<TenStarGroup, number> {
  const result: Record<
    TenStarGroup,
    number
  > = {
    비겁: 0,
    식상: 0,
    재성: 0,
    관성: 0,
    인성: 0,
  };

  for (const star of TEN_STAR_ORDER) {
    result[
      TEN_STAR_GROUP[star]
    ] += counts[star] ?? 0;
  }

  return result;
}

/* =========================================================
 * 대표 오행
 *
 * Stargio의 발달오행에서 가장 높은 값을 사용한다.
 *
 * 단, 동률에 가까운 경우 특정 오행 하나를
 * 절대적인 성격값으로 취급하지 않는다.
 * ======================================================= */

function getDominantElement(
  counts: Record<Element, number>,
): Element | undefined {
  const sorted = [
    ...ELEMENT_ORDER,
  ].sort(
    (a, b) =>
      counts[b] - counts[a],
  );

  const first = sorted[0];

  if (
    !first ||
    counts[first] <= 0
  ) {
    return undefined;
  }

  return first;
}

/* =========================================================
 * 대표 십성
 * ======================================================= */

function getDominantTenStar(
  counts: Record<TenStar, number>,
): TenStar | undefined {
  const sorted = [
    ...TEN_STAR_ORDER,
  ].sort(
    (a, b) =>
      counts[b] - counts[a],
  );

  const first = sorted[0];
  const second = sorted[1];

  if (
    !first ||
    counts[first] <= 0
  ) {
    return undefined;
  }

  if (
    second &&
    counts[first] -
      counts[second] <
      0.4
  ) {
    return undefined;
  }

  return first;
}

/* =========================================================
 * 일간 / 일주
 * ======================================================= */

function normalizeStem(
  value: unknown,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const text = value.trim();

  for (const key of Object.keys(
    STEM_INFO,
  )) {
    if (text.includes(key)) {
      return key;
    }
  }

  return undefined;
}

function normalizeBranch(
  value: unknown,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const text = value.trim();

  for (const key of Object.keys(
    BRANCH_INFO,
  )) {
    if (text.includes(key)) {
      return key;
    }
  }

  return undefined;
}

function getDayMaster(
  data: Record<string, any>,
): string | undefined {
  const candidates = [
    data['일간'],
    data['日干'],
    data['dayMaster'],
    data['day_master'],
  ];

  for (const candidate of candidates) {
    const stem =
      normalizeStem(candidate);

    if (stem) {
      return stem;
    }
  }

  /*
   * API가 일주 형태로 제공하는 경우
   */
  const dayPillarCandidates = [
    data['일주'],
    data['日柱'],
    data['dayPillar'],
    data['day_pillar'],
  ];

  for (const candidate of dayPillarCandidates) {
    const stem =
      normalizeStem(candidate);

    if (stem) {
      return stem;
    }
  }

  return undefined;
}

/* =========================================================
 * 월지
 * ======================================================= */

function getMonthBranch(
  data: Record<string, any>,
): string | undefined {
  const candidates = [
    data['월지'],
    data['月支'],
    data['monthBranch'],
    data['month_branch'],
  ];

  for (const candidate of candidates) {
    const branch =
      normalizeBranch(candidate);

    if (branch) {
      return branch;
    }
  }

  const monthPillarCandidates = [
    data['월주'],
    data['月柱'],
    data['monthPillar'],
    data['month_pillar'],
  ];

  for (const candidate of monthPillarCandidates) {
    const branch =
      normalizeBranch(candidate);

    if (branch) {
      return branch;
    }
  }

  return undefined;
}

/* =========================================================
 * 일간 오행
 * ======================================================= */

function getDayMasterElement(
  dayMaster?: string,
): Element | undefined {
  if (!dayMaster) {
    return undefined;
  }

  return STEM_INFO[
    dayMaster
  ]?.element;
}

/* =========================================================
 * 신강신약
 *
 * API가 직접 제공한 값을 최우선으로 사용한다.
 *
 * API에 값이 없다면 계산하지 않는다.
 *
 * 이유:
 * 신강/신약은 단순 오행 개수나 십성 개수만으로
 * 재계산하면 실제 명리 판단과 차이가 커질 수 있기 때문이다.
 * ======================================================= */

function getStrength(
  data: Record<string, any>,
): Strength {
  const candidates = [
    data['신강신약'],
    data['사주강약'],
    data['강약'],
    data['신강약'],
    data['신강'],
    data['신약'],
  ];

  for (const candidate of candidates) {
    const strength =
      normalizeStrength(candidate);

    if (strength) {
      return strength;
    }
  }

  return undefined;
}

/* =========================================================
 * 성향 점수
 * ======================================================= */

interface TraitScores {
  탐구성: number;
  표현성: number;
  창의성: number;
  관찰력: number;
  독립성: number;
  사회성: number;
  실행력: number;
  안정감: number;
  책임감: number;
  집중력: number;
  적응력: number;
}

function createTraitScores(): TraitScores {
  return {
    탐구성: 0,
    표현성: 0,
    창의성: 0,
    관찰력: 0,
    독립성: 0,
    사회성: 0,
    실행력: 0,
    안정감: 0,
    책임감: 0,
    집중력: 0,
    적응력: 0,
  };
}

/* =========================================================
 * 십성 → 현대적 성향
 * ======================================================= */

function applyTenStarTraits(
  scores: TraitScores,
  counts: Record<TenStar, number>,
  groups: Record<TenStarGroup, number>,
) {
  scores.탐구성 +=
    groups.인성 * 1.0;

  scores.관찰력 +=
    groups.인성 * 0.7;

  scores.집중력 +=
    groups.인성 * 0.7;

  scores.탐구성 +=
    counts.편인 * 0.8;

  scores.창의성 +=
    counts.편인 * 0.5;

  scores.집중력 +=
    counts.정인 * 0.8;

  scores.안정감 +=
    counts.정인 * 0.4;

  scores.표현성 +=
    groups.식상 * 1.1;

  scores.실행력 +=
    groups.식상 * 0.8;

  scores.창의성 +=
    counts.상관 * 1.0;

  scores.표현성 +=
    counts.상관 * 0.8;

  scores.실행력 +=
    counts.식신 * 0.9;

  scores.안정감 +=
    counts.식신 * 0.3;

  scores.독립성 +=
    counts.비견 * 1.0;

  scores.실행력 +=
    counts.비견 * 0.5;

  scores.사회성 +=
    counts.겁재 * 0.9;

  scores.독립성 +=
    counts.겁재 * 0.5;

  scores.실행력 +=
    groups.재성 * 0.8;

  scores.적응력 +=
    counts.편재 * 0.8;

  scores.안정감 +=
    counts.정재 * 0.6;

  scores.책임감 +=
    groups.관성 * 1.0;

  scores.집중력 +=
    counts.편관 * 0.7;

  scores.안정감 +=
    counts.정관 * 0.7;
}


function applyDayMasterTraits(
  scores: TraitScores,
  element?: Element,
) {
  if (!element) {
    return;
  }

  switch (element) {
    case '목':
      scores.탐구성 += 0.4;
      scores.적응력 += 0.4;
      break;

    case '화':
      scores.표현성 += 0.5;
      scores.사회성 += 0.3;
      break;

    case '토':
      scores.안정감 += 0.5;
      scores.책임감 += 0.3;
      break;

    case '금':
      scores.관찰력 += 0.5;
      scores.집중력 += 0.5;
      break;

    case '수':
      scores.탐구성 += 0.5;
      scores.적응력 += 0.4;
      break;
  }
}

function applyElementTraits(
  scores: TraitScores,
  counts: Record<Element, number>,
) {
  const dominant =
    getDominantElement(counts);

  if (!dominant) {
    return;
  }

  switch (dominant) {
    case '목':
      scores.탐구성 += 0.4;
      scores.적응력 += 0.3;
      break;

    case '화':
      scores.표현성 += 0.4;
      scores.사회성 += 0.2;
      break;

    case '토':
      scores.안정감 += 0.4;
      break;

    case '금':
      scores.관찰력 += 0.4;
      scores.집중력 += 0.3;
      break;

    case '수':
      scores.탐구성 += 0.4;
      scores.적응력 += 0.3;
      break;
  }
}

/* =========================================================
 * 전체 성향 계산
 * ======================================================= */

function scoreTraits(
  dayMasterElement: Element | undefined,
  elementCounts: Record<Element, number>,
  tenStarCounts: Record<TenStar, number>,
  tenStarGroups: Record<TenStarGroup, number>,
): TraitScores {
  const scores =
    createTraitScores();

  applyTenStarTraits(
    scores,
    tenStarCounts,
    tenStarGroups,
  );

  applyDayMasterTraits(
    scores,
    dayMasterElement,
  );

  applyElementTraits(
    scores,
    elementCounts,
  );

  return scores;
}

/* =========================================================
 * 상위 성향
 * ======================================================= */

function getTopTraits(
  scores: TraitScores,
): string[] {
  return Object.entries(scores)
    .filter(([, value]) => value > 0)
    .sort(
      ([, a], [, b]) => b - a,
    )
    .slice(0, 4)
    .map(([key]) => key);
}

/* =========================================================
 * 성격
 * ======================================================= */

function buildPersonality(
  traits: string[],
  dayMasterElement?: Element,
  dominantTenStar?: TenStar,
): string {
  const has = (
    trait: string,
  ) => traits.includes(trait);

  /*
   * 탐구 + 집중
   */
  if (
    has('탐구성') &&
    has('집중력')
  ) {
    return (
      '궁금한 것이 생기면 그냥 지나치기보다 ' +
      '스스로 살펴보고 알아가려는 성향이 나타날 수 있어요. ' +
      '관심이 생긴 분야에서는 한 가지에 깊이 몰입하는 모습도 보일 수 있어요.'
    );
  }

  /*
   * 표현 + 창의
   */
  if (
    has('표현성') &&
    has('창의성')
  ) {
    return (
      '자신이 생각한 것을 말이나 행동으로 표현하려는 성향이 나타날 수 있어요. ' +
      '정해진 방법 하나만 따라가기보다 자신만의 방법을 만들어보는 과정에서 ' +
      '장점이 잘 드러날 수 있어요.'
    );
  }

  /*
   * 독립 + 실행
   */
  if (
    has('독립성') &&
    has('실행력')
  ) {
    return (
      '스스로 해보고 싶은 것이 생기면 직접 움직여보려는 성향이 나타날 수 있어요. ' +
      '어른이 정해준 방법을 그대로 따르기보다 직접 경험하면서 배우는 과정이 잘 맞을 수 있어요.'
    );
  }

  /*
   * 안정 + 책임
   */
  if (
    has('안정감') &&
    has('책임감')
  ) {
    return (
      '익숙하고 안정적인 환경에서 자신의 힘을 차분하게 발휘하는 흐름이 나타날 수 있어요. ' +
      '맡은 일이나 약속을 중요하게 생각하는 모습도 보일 수 있어요.'
    );
  }

  /*
   * 관찰 + 집중
   */
  if (
    has('관찰력') &&
    has('집중력')
  ) {
    return (
      '주변을 먼저 살펴보고 자신이 이해한 뒤 움직이려는 성향이 나타날 수 있어요. ' +
      '낯선 환경에서도 충분히 관찰할 시간을 주면 자신의 방식으로 참여할 수 있어요.'
    );
  }

  /*
   * 대표 십성에 따른 보조 문구
   */
  if (
    dominantTenStar === '정인' ||
    dominantTenStar === '편인'
  ) {
    return (
      '새로운 정보를 받아들이고 자신이 이해한 방식으로 정리하려는 흐름이 나타날 수 있어요. ' +
      '관심 있는 주제를 충분히 탐색할 수 있을 때 자신의 장점이 잘 드러날 수 있어요.'
    );
  }

  if (
    dominantTenStar === '식신' ||
    dominantTenStar === '상관'
  ) {
    return (
      '자신이 가진 생각이나 능력을 밖으로 표현하려는 흐름이 나타날 수 있어요. ' +
      '직접 만들어보고 표현해보는 경험을 통해 자신감을 키워갈 수 있어요.'
    );
  }

  if (
    dominantTenStar === '비견' ||
    dominantTenStar === '겁재'
  ) {
    return (
      '자신만의 생각과 방식을 가지고 직접 해보려는 흐름이 나타날 수 있어요. ' +
      '또래와 함께하는 과정에서도 자기 의견을 표현하는 모습을 보일 수 있어요.'
    );
  }

  if (
    dominantTenStar === '정관' ||
    dominantTenStar === '편관'
  ) {
    return (
      '기준과 규칙을 이해하면 자신의 역할을 비교적 분명하게 받아들이는 흐름이 나타날 수 있어요. ' +
      '목표가 명확할 때 집중해서 움직이는 모습을 보일 수 있어요.'
    );
  }

  if (
    dominantTenStar === '정재' ||
    dominantTenStar === '편재'
  ) {
    return (
      '생각한 것을 실제 행동이나 결과로 연결하려는 흐름이 나타날 수 있어요. ' +
      '직접 경험하고 활용해보는 과정에서 자신의 강점을 발견할 수 있어요.'
    );
  }

  /*
   * 일간 오행 fallback
   */
  const elementText: Record<
    Element,
    string
  > = {
    목: '새싹처럼 끊임없이 호기심을 뻗치며 자기만의 영역을 신나게 넓혀가는 에너지',
    화: '따스하고 밝은 햇살처럼 주변을 환하게 밝히며 에너지를 거침없이 뿜어내는 에너지',
    토: '단단하고 든든한 대지처럼 차곡차곡 자신만의 내공과 힘을 쌓아가는 에너지',
    금: '반짝이는 보석처럼 자기만의 확실한 기준을 세우고 디테일한 부분까지 예리하게 살피는 에너지',
    수: '깊은 물처럼 속이 깊고 다채로운 호기심을 품은 채 유연하게 흡수하는 에너지',
  };

  if (dayMasterElement) {
    return (
      `${elementText[dayMasterElement]}를 듬뿍 품고 있는 구조예요. ` +
      '물론 아이의 진짜 매력은 이 오행 하나로 다 담을 수 없으니, 사주 전체가 어우러지는 입체적인 모습을 함께 지켜봐 주세요!'
    );
  }

  return (
    '사주 전체의 오행과 십성이 다채롭게 어우러져 있어, 어느 한쪽으로 규정할 수 없는 무궁무진한 매력을 가진 구조예요.'
  );
}

/* =========================================================
 * 학습 스타일
 * ======================================================= */

function buildStudy(
  traits: string[],
): string {
  const has = (
    trait: string,
  ) => traits.includes(trait);

  if (
    has('탐구성') &&
    has('집중력')
  ) {
    return (
      '관심이 생긴 주제를 충분히 파고들 수 있는 환경에서 몰입도가 높아질 수 있어요. ' +
      '처음부터 정답을 알려주기보다 스스로 질문을 만들고 답을 찾아보게 해보세요.'
    );
  }

  if (
    has('표현성') &&
    has('창의성')
  ) {
    return (
      '말하기, 만들기, 그리기, 발표처럼 배운 것을 직접 표현하는 방식과 잘 맞을 수 있어요. ' +
      '하나의 정답만 요구하기보다 여러 가지 답을 만들어보게 해보세요.'
    );
  }

  if (
    has('실행력') &&
    has('적응력')
  ) {
    return (
      '직접 해보면서 배우는 과정에서 이해가 빠를 수 있어요. ' +
      '설명만 길게 하기보다 작은 과제를 주고 직접 경험하게 해보는 방식이 잘 맞을 수 있어요.'
    );
  }

  if (
    has('안정감') &&
    has('집중력')
  ) {
    return (
      '일정한 순서와 익숙한 환경에서 차분하게 집중하기 좋을 수 있어요. ' +
      '학습 루틴을 일정하게 만들어주는 것이 도움이 될 수 있어요.'
    );
  }

  if (has('관찰력')) {
    return (
      '충분히 살펴보고 이해한 뒤 직접 해보는 학습 방식이 잘 맞을 수 있어요. ' +
      '새로운 내용을 바로 평가하기보다 아이가 스스로 관찰할 시간을 주세요.'
    );
  }

  return (
    '아이의 관심이 생기는 순간을 관찰하고 그 관심사를 학습과 연결해주는 방식이 좋아요. ' +
    '한 가지 방법만 고집하기보다 아이가 실제로 반응하는 학습 방식을 찾아보세요.'
  );
}

/* =========================================================
 * 칭찬
 * ======================================================= */

function buildPraise(
  traits: string[],
): string {
  const has = (
    trait: string,
  ) => traits.includes(trait);

  if (has('탐구성')) {
    return '“궁금한 걸 그냥 지나치지 않고 직접 알아보려고 한 게 정말 멋져.”';
  }

  if (has('표현성')) {
    return '“네가 생각한 걸 이렇게 잘 표현해줘서 정말 재미있어.”';
  }

  if (has('창의성')) {
    return '“다른 사람이 생각하지 못한 방법을 찾아냈네. 네 생각이 정말 재미있다.”';
  }

  if (has('실행력')) {
    return '“생각만 하지 않고 직접 해본 게 정말 멋져.”';
  }

  if (has('책임감')) {
    return '“맡은 일을 끝까지 해내려고 한 모습이 정말 멋졌어.”';
  }

  if (has('관찰력')) {
    return '“작은 것도 잘 살펴봤구나. 네가 발견한 걸 들려줘.”';
  }

  return '“네가 스스로 생각하고 선택한 과정이 정말 멋져.”';
}

/* =========================================================
 * 스트레스 / 양육 포인트
 * ======================================================= */

function buildStress(
  traits: string[],
): string {
  const has = (
    trait: string,
  ) => traits.includes(trait);

  if (
    has('집중력') &&
    has('탐구성')
  ) {
    return (
      '관심 있는 활동을 갑자기 중단하거나 지나치게 간섭하면 답답함을 느낄 수 있어요. ' +
      '무조건 빨리 끝내게 하기보다 마무리할 시간을 조금 주는 것이 좋아요.'
    );
  }

  if (
    has('표현성') &&
    has('창의성')
  ) {
    return (
      '자신의 생각을 표현할 기회가 지나치게 제한되면 답답함을 느낄 수 있어요. ' +
      '틀린 답을 고치기 전에 왜 그렇게 생각했는지 먼저 물어봐 주세요.'
    );
  }

  if (has('안정감')) {
    return (
      '갑작스러운 변화가 반복되면 부담을 느낄 수 있어요. ' +
      '새로운 일정이나 환경이 있다면 미리 알려주는 것이 도움이 될 수 있어요.'
    );
  }

  if (has('독립성')) {
    return (
      '스스로 하려는 상황에서 지나친 통제가 들어오면 반발할 수 있어요. ' +
      '선택할 수 있는 범위를 정해주고 그 안에서 직접 결정하게 해보세요.'
    );
  }

  if (has('책임감')) {
    return (
      '자신이 맡은 일을 잘해야 한다는 부담을 느끼지 않도록 결과만 평가하기보다 ' +
      '과정에서 노력한 부분을 함께 봐주는 것이 좋아요.'
    );
  }

  return (
    '아이의 반응이 강하게 나타나는 순간에는 행동만 바로잡기보다 ' +
    '무엇 때문에 그런 반응이 나왔는지 먼저 살펴보는 것이 좋아요.'
  );
}

/* =========================================================
 * 활동 추천
 * ======================================================= */

function buildActivities(
  traits: string[],
): string[] {
  const activities: string[] = [];
  const has = (trait: string) => traits.includes(trait);

  // 1. 성향별 매칭 활동 수집
  if (has('탐구성')) {
    activities.push('과학 실험·관찰 놀이');
  }
  if (has('창의성')) {
    activities.push('그림·만들기·스토리 만들기');
  }
  if (has('표현성')) {
    activities.push('역할극·발표·말하기 놀이');
  }
  if (has('집중력')) {
    activities.push('퍼즐·블록·보드게임');
  }
  if (has('실행력')) {
    activities.push('요리·DIY·체험 활동');
  }
  if (has('사회성')) {
    activities.push('친구와 함께하는 협동 놀이');
  }
  if (has('적응력')) {
    activities.push('새로운 장소 탐방·여행 놀이');
  }
  if (has('안정감')) {
    activities.push('독서·그리기·식물 키우기');
  }

  // 2. 매칭된 활동이 3개 미만인 경우, 기본 추천 활동을 추가로 채워넣음
  const fallbackPool = [
    '아이의 관심사를 활용한 자유 놀이',
    '관찰·체험 중심 활동',
    '부모와 함께하는 만들기 활동',
    '자연 속 야외 활동',
    '자유로운 드로잉 및 오감 놀이'
  ];

  for (const fallbackItem of fallbackPool) {
    if (activities.length >= 3) break;
    if (!activities.includes(fallbackItem)) {
      activities.push(fallbackItem);
    }
  }

  // 최대 4개까지만 깔끔하게 잘라서 반환
  return activities.slice(0, 4);
}
/* =========================================================
 * 부모 메시지
 * ======================================================= */

function buildParentMessage(
  traits: string[],
): string {
  const has = (
    trait: string,
  ) => traits.includes(trait);

  if (
    has('독립성') &&
    has('실행력')
  ) {
    return (
      '이 아이에게는 대신 해주는 것보다 스스로 해볼 수 있는 기회가 중요해요. ' +
      '조금 느리더라도 직접 선택하고 실패하고 다시 해보는 경험을 충분히 만들어주세요.'
    );
  }

  if (
    has('탐구성') &&
    has('집중력')
  ) {
    return (
      '아이의 질문을 귀찮은 것으로 생각하지 말고 성장의 신호로 봐주세요. ' +
      '모든 답을 바로 알려주기보다 함께 찾아보는 과정이 아이의 힘을 키워줄 수 있어요.'
    );
  }

  if (
    has('표현성') &&
    has('창의성')
  ) {
    return (
      '아이의 엉뚱한 생각을 바로 고치기보다 먼저 들어주세요. ' +
      '자신의 생각을 안전하게 표현할 수 있다는 경험이 아이의 창의성과 자신감을 키워줄 수 있어요.'
    );
  }

  if (has('안정감')) {
    return
      '빠르게 변화시키기보다 아이가 편안하게 적응할 수 있는 속도를 존중해주세요. ' +
      '작은 변화도 충분히 경험하고 익숙해질 시간을 주는 것이 좋아요.'
  }

  return `사주는 아이를 정해진 성격으로 규정하기 위한 것이 아니라,
    아이를 이해하는 하나의 관점으로 활용하는 것이 좋아요.
    결과보다 실제 아이의 모습을 함께 관찰해 주세요.`;
}


/* =========================================================
 * 제목
 * ======================================================= */

function buildTitle(
  traits: string[],
  dominantElement?: Element,
): string {
  const has = (
    trait: string,
  ) => traits.includes(trait);

  if (
    has('탐구성') &&
    has('집중력')
  ) {
    return '궁금한 건 끝까지 파고드는 아이';
  }

  if (
    has('표현성') &&
    has('창의성')
  ) {
    return '생각을 재미있게 표현하는 아이';
  }

  if (
    has('독립성') &&
    has('실행력')
  ) {
    return '스스로 해보며 배우는 아이';
  }

  if (
    has('안정감') &&
    has('책임감')
  ) {
    return '차분하게 자기 힘을 쌓는 아이';
  }

  if (has('관찰력')) {
    return '작은 것도 놓치지 않는 아이';
  }

  if (has('적응력')) {
    return '새로운 것을 빠르게 받아들이는 아이';
  }

  const elementTitle: Record<
    Element,
    string
  > = {
    목: '자라면서 가능성을 넓혀가는 아이',
    화: '자신의 빛을 표현하는 아이',
    토: '차분하게 자기 힘을 쌓는 아이',
    금: '섬세하게 세상을 바라보는 아이',
    수: '궁금한 세상을 탐험하는 아이',
  };

  if (dominantElement) {
    return elementTitle[
      dominantElement
    ];
  }

  return '우리 아이만의 타고난 성향';
}

/* =========================================================
 * 분석 메인
 * ======================================================= */

export function analyzeChild(
  data: Record<string, any>,
): ChildPersonalityResult {
  /*
   * -------------------------------------------------------
   * 1. Stargio API에서 실제로 제공한 오행
   * -------------------------------------------------------
   */
  const elementCounts =
    extractElementCounts(data);

  /*
   * -------------------------------------------------------
   * 2. Stargio API에서 실제로 제공한 십성
   * -------------------------------------------------------
   */
  const tenStarCounts =
    extractTenStarCounts(data);

  /*
   * -------------------------------------------------------
   * 3. 십성 그룹
   * -------------------------------------------------------
   */
  const tenStarGroups =
    getTenStarGroups(
      tenStarCounts,
    );

  /*
   * -------------------------------------------------------
   * 4. 일간
   * -------------------------------------------------------
   *
   * API가 직접 제공하는 값을 우선.
   */
  const dayMaster =
    getDayMaster(data);

  const dayMasterElement =
    getDayMasterElement(
      dayMaster,
    );

  /*
   * -------------------------------------------------------
   * 5. 월지
   * -------------------------------------------------------
   */
  const monthBranch =
    getMonthBranch(data);

  /*
   * -------------------------------------------------------
   * 6. 신강/신약
   * -------------------------------------------------------
   *
   * API가 제공하는 값만 사용한다.
   */
  const strength =
    getStrength(data);

  /*
   * -------------------------------------------------------
   * 7. 대표 오행
   * -------------------------------------------------------
   */
  const dominantElement =
    getDominantElement(
      elementCounts,
    );

  /*
   * -------------------------------------------------------
   * 8. 대표 십성
   * -------------------------------------------------------
   */
  const dominantTenStar =
    getDominantTenStar(
      tenStarCounts,
    );

  /*
   * -------------------------------------------------------
   * 9. 명리 구조 → 콘텐츠 성향
   * -------------------------------------------------------
   */
  const traits =
    scoreTraits(
      dayMasterElement,
      elementCounts,
      tenStarCounts,
      tenStarGroups,
    );

  const topTraits =
    getTopTraits(traits);

  /*
   * -------------------------------------------------------
   * 10. 콘텐츠 생성
   * -------------------------------------------------------
   */

  const personality =
    buildPersonality(
      topTraits,
      dayMasterElement,
      dominantTenStar,
    );

  const study =
    buildStudy(topTraits);

  const praise =
    buildPraise(topTraits);

  const stress =
    buildStress(topTraits);

  const activities =
    buildActivities(topTraits);

  const parentMessage =
    buildParentMessage(
      topTraits,
    );

  const title =
    buildTitle(
      topTraits,
      dominantElement,
    );

  /*
   * -------------------------------------------------------
   * 11. 결과 카드 subtitle
   * -------------------------------------------------------
   */

  const subtitleParts: string[] =
    [];

  if (dayMasterElement) {
    subtitleParts.push(
      `${dayMasterElement} 일간`,
    );
  }

  if (dominantElement) {
    subtitleParts.push(
      `${dominantElement} 기운`,
    );
  }

  if (dominantTenStar) {
    subtitleParts.push(
      dominantTenStar,
    );
  }

  if (strength) {
    subtitleParts.push(
      strength,
    );
  }

  /*
   * -------------------------------------------------------
   * 12. 실제 분석 근거
   * -------------------------------------------------------
   */

  const sourceKeywords: string[] =
    [];

  if (dayMaster) {
    const info =
      STEM_INFO[dayMaster];

    if (info) {
      sourceKeywords.push(
        `${info.korean}일간`,
      );
    }
  }

  if (dominantElement) {
    sourceKeywords.push(
      `${dominantElement} 기운`,
    );
  }

  if (dominantTenStar) {
    sourceKeywords.push(
      dominantTenStar,
    );
  }

  if (strength) {
    sourceKeywords.push(
      strength,
    );
  }

  if (monthBranch) {
    const branchInfo =
      BRANCH_INFO[
        monthBranch
      ];

    if (branchInfo) {
      sourceKeywords.push(
        `${branchInfo.korean}월지`,
      );
    }
  }

  /*
   * -------------------------------------------------------
   * 최종 결과
   * -------------------------------------------------------
   */

  return {
    title,

    subtitle:
      subtitleParts.length > 0
        ? subtitleParts.join(' · ')
        : '사주 구조 기반 해석',

    personality,
    study,
    praise,
    stress,
    activities,
    parentMessage,
    meta: {
      dayMaster,
      dayMasterElement,
      dominantElement,
      dominantTenStar,
      strength,
      elementCounts,
      tenStarCounts,
      tenStarGroups,
      monthBranch,
      sourceKeywords,
    },
  };
}