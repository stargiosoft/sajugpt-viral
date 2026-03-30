import type { ConstitutionType, ServantType, CompatibilityGrade, NightStats } from '@/types/night-manual';

// ─── 체질 유형 ─────────────────────────────────────────
export interface ConstitutionMeta {
  type: ConstitutionType;
  name: string;
  concept: string;
  narrative: string;
}

export const CONSTITUTIONS: Record<ConstitutionType, ConstitutionMeta> = {
  simhwa: {
    type: 'simhwa',
    name: '심화(心火)',
    concept: '불꽃형 — 한 번 붙으면 재가 될 때까지',
    narrative: '네 몸에 불이 붙는 데는 시간이 걸린다. 하지만 한 번 불이 붙으면 상대가 먼저 타버린다. 시종이 세 명이어도 부족할 수 있다. 네 사주에 앉은 도화살은 천천히 피어나는 종류다 — 그래서 더 위험하다.',
  },
  noejeon: {
    type: 'noejeon',
    name: '뇌전(雷電)',
    concept: '천둥형 — 내가 치면 상대가 울린다',
    narrative: '네가 원하는 건 부드러운 손길이 아니다. 네가 방 안에 들어서면 시종이 긴장한다. 무릎을 꿇는 것은 시종이지만, 진짜 무릎 꿇게 만드는 건 네 눈빛이다. 사주에 편관과 양인이 함께 있다. 지배하도록 태어난 체질.',
  },
  myohyang: {
    type: 'myohyang',
    name: '묘향(妙香)',
    concept: '향기형 — 떠나도 잊지 못하게 만든다',
    narrative: '네가 방을 나가면 향이 남는다. 시종이 빈 방에 들어와 네가 앉았던 자리 냄새를 맡는다. 한 번 네 곁에 있었던 사람은 평생 네 이름을 중얼거린다. 홍염살이 이것이다 — 떠나도 잊지 못하게 만드는 저주.',
  },
  seu: {
    type: 'seu',
    name: '세우(細雨)',
    concept: '이슬비형 — 가볍게 적시지만 속까지 젖는다',
    narrative: '센 비는 피할 수 있지만, 이슬비는 피할 수 없다. 네 손끝이 스치기만 해도 시종의 숨이 멈춘다. 강하게 조이지 않는데 풀려나지 못한다. 화개살이 감각을 예민하게 만들었다 — 상대의 몸이 원하는 것을 네가 먼저 안다.',
  },
  janggang: {
    type: 'janggang',
    name: '장강(長江)',
    concept: '강물형 — 끝이 보이지 않는 밤',
    narrative: '첫 번째 시종이 지쳐 물러났다. 두 번째 시종이 교대했다. 네 눈에는 아직 잠이 없다. 비견과 겁재가 체력을 두 배로 만들었다. 밤이 깊어져도 네 기운은 줄지 않는다. 아침이 와야 끝나는 게 아니라, 네가 끝내야 끝난다.',
  },
  yonghwa: {
    type: 'yonghwa',
    name: '용화(龍火)',
    concept: '용의 불꽃 — 모든 것을 삼키는 전설',
    narrative: '시종 세 명이 서로 눈치를 본다. 네 사주를 펼친 순간 기가 질렸다. 도화살, 홍염살, 양인이 한 사주에 모였다. 어디를 건드려도 반응하고, 한 번 맛보면 중독되고, 주도권은 절대 넘기지 않는다. 시종 셋이 달려들어도 네가 끝날 때까지 끝나지 않는다.',
  },
};

// ─── 시종 프로필 ────────────────────────────────────────
export interface ServantMeta {
  type: ServantType;
  name: string;
  emoji: string;
  label: string;
  personality: string;
}

export const SERVANTS: Record<ServantType, ServantMeta> = {
  beast: {
    type: 'beast',
    name: '강해',
    emoji: '\uD83D\uDD25',
    label: '야수형',
    personality: '직설적, 거침없음. 몸으로 증명하는 타입',
  },
  poet: {
    type: 'poet',
    name: '윤서',
    emoji: '\uD83C\uDFAD',
    label: '시인형',
    personality: '감성적, 말이 무기. 분위기를 만드는 타입',
  },
  butler: {
    type: 'butler',
    name: '도겸',
    emoji: '\uD83E\uDEC5',
    label: '집사형',
    personality: '절제된 매너, 완벽한 준비. 복종하는 타입',
  },
};

// ─── 탈락 반응 (하드코딩) ───────────────────────────────
export const REJECTION_LINES: Record<ServantType, string> = {
  beast: '...알겠습니다. 하지만 마마, 그놈이 지치면 저를 부르십시오. 저는 밖에서 기다리겠습니다.',
  poet: '오늘 밤은 양보하겠습니다. 하지만 내일 밤, 마마의 베개 밑에 시 한 편을 놓아두겠습니다.',
  butler: '마마의 뜻이라면... (무릎 꿇으며) 대신 차와 과일은 제가 준비해놓겠습니다. 밤이 길 것 같으니.',
};

// ─── Phase 2 개입 반응 (하드코딩) ────────────────────────
export const INTERVENTION_REACTIONS = {
  listen: {
    beast: '야, 이놈아! 네가 지난번에 마마 앞에서 발이 떨리던 거 잊었냐?',
    poet: '강해, 네 주먹보다 내 혀가 마마를 더 잘 모신다. 너도 알잖아.',
    butler: '두 분... 마마께서 듣고 계실 수도 있습니다만... 아, 아닙니다. 저도 할 말은 있습니다.',
  },
  cough: {
    beast: '...! 마, 마마?! 아닙니다, 저희는 그냥... 업무 회의를...',
    poet: '(책을 뒤집어 들며) 시, 시를 읽고 있었습니다...',
    butler: '(즉시 무릎) 마마, 얼마나 들으셨습니까... 모든 것은 마마를 위한 것이었습니다.',
  },
  interrupt: {
    beast: '(즉시 무릎) 명하십시오, 마마. 목숨을 걸겠습니다.',
    poet: '(붓을 놓으며) 마마의 한 마디가 저의 만 마디보다 무겁습니다.',
    butler: '(이마가 바닥에 닿을 때까지) 불찰을 용서하십시오. 무엇이든 분부하십시오.',
  },
} as const;

// ─── 궁합 매트릭스 ─────────────────────────────────────
type StatKey = keyof NightStats;

export const COMPATIBILITY_MATRIX: Record<StatKey, Record<ServantType, { grade: CompatibilityGrade; label: string }>> = {
  sensitivity: { beast: { grade: 'B', label: '과하면 부담' }, poet: { grade: 'S', label: '감각 극대화' }, butler: { grade: 'A', label: '헌신적 케어' } },
  dominance:   { beast: { grade: 'A', label: '힘 대 힘 긴장' }, poet: { grade: 'B', label: '리드 충돌' }, butler: { grade: 'S', label: '완벽한 순종' } },
  addiction:   { beast: { grade: 'S', label: '밤새 중독 루프' }, poet: { grade: 'A', label: '서사적 중독' }, butler: { grade: 'A', label: '돌봄 중독' } },
  awareness:   { beast: { grade: 'C', label: '너무 거침' }, poet: { grade: 'S', label: '섬세한 터치' }, butler: { grade: 'A', label: '세심한 배려' } },
  endurance:   { beast: { grade: 'S', label: '체력 매치' }, poet: { grade: 'B', label: '시인이 먼저 지침' }, butler: { grade: 'A', label: '교대 서빙' } },
};

// ─── 한 줄 서사 ────────────────────────────────────────
export const ONE_LINER_MAP: Record<ConstitutionType, Record<ServantType, string>> = {
  simhwa: {
    beast: '두 개의 불이 만나면 재만 남는다. 하지만 그 밤은 눈부셨다.',
    poet: '불꽃에 바람이 불면 꺼지거나 번진다. 오늘 밤은 번졌다.',
    butler: '가장 강한 불은 가장 조용한 바람에 흔들린다.',
  },
  noejeon: {
    beast: '번개가 내리치자 폭풍이 대답했다. 밤새 천둥이 울렸다.',
    poet: '번개 아래 시인이 무릎을 꿇었다. 시는 완성되지 못했다.',
    butler: '번개가 대지를 때려도 대지는 갈라지지 않았다. 그래서 다시 때렸다.',
  },
  myohyang: {
    beast: '야수가 향을 쫓아 숲을 헤맸다. 향의 주인을 찾았을 때, 야수가 길들여졌다.',
    poet: '시인이 향을 시로 쓰려 했지만, 향이 먼저 시인을 취하게 만들었다.',
    butler: '집사는 향이 흩어지지 않도록 창문을 닫았다. 밤새 향에 갇혀 있었다.',
  },
  seu: {
    beast: '이슬비가 폭풍을 멈추게 했다. 야수가 처음으로 가만히 누웠다.',
    poet: '이슬비가 먹물을 번지게 했다. 시인의 시가 지워졌지만 더 아름다웠다.',
    butler: '집사가 우산을 폈지만, 이슬비는 우산 안에서 내렸다.',
  },
  janggang: {
    beast: '바위가 강물을 막으려 했다. 아침에 바위가 둥글어져 있었다.',
    poet: '시인이 배를 띄웠지만, 강물이 끝나지 않아 돌아오지 못했다.',
    butler: '집사가 둑을 쌓았다. 강물이 둑을 넘었다. 집사가 다시 쌓았다. 밤새 반복됐다.',
  },
  yonghwa: {
    beast: '용이 내려왔다. 시종 셋이 달려들었다. 아침에 시종 셋이 기절해 있었다.',
    poet: '용이 내려왔다. 시종 셋이 달려들었다. 아침에 시종 셋이 기절해 있었다.',
    butler: '용이 내려왔다. 시종 셋이 달려들었다. 아침에 시종 셋이 기절해 있었다.',
  },
};

// ─── 등급 산정 ─────────────────────────────────────────
export function getCharmGrade(totalCharm: number): CompatibilityGrade {
  if (totalCharm >= 350) return 'S';
  if (totalCharm >= 250) return 'A';
  if (totalCharm >= 150) return 'B';
  return 'C';
}

// ─── 최고 능력치 → 체질 배정 ────────────────────────────
export function getTopStatKey(stats: NightStats): keyof NightStats {
  const entries = Object.entries(stats) as [keyof NightStats, number][];
  entries.sort((a, b) => b[1] - a[1]);

  // 용화 조건: 3개 이상 80+ 동률
  const over80 = entries.filter(([, v]) => v >= 80);
  if (over80.length >= 3) return 'sensitivity'; // 용화는 별도 처리

  return entries[0][0];
}

export function assignConstitution(stats: NightStats): ConstitutionType {
  const entries = Object.entries(stats) as [keyof NightStats, number][];
  entries.sort((a, b) => b[1] - a[1]);

  // 용화 조건: 3개 이상 80+
  const over80 = entries.filter(([, v]) => v >= 80);
  if (over80.length >= 3) return 'yonghwa';

  const topKey = entries[0][0];
  const map: Record<keyof NightStats, ConstitutionType> = {
    sensitivity: 'simhwa',
    dominance: 'noejeon',
    addiction: 'myohyang',
    awareness: 'seu',
    endurance: 'janggang',
  };
  return map[topKey];
}

// ─── 능력치 라벨 ───────────────────────────────────────
export const STAT_LABELS: Record<keyof NightStats, string> = {
  sensitivity: '감도',
  dominance: '지배력',
  addiction: '중독성',
  awareness: '민감도',
  endurance: '지구력',
};

// ─── 궁합 계산 ─────────────────────────────────────────
export function getCompatibility(stats: NightStats, servant: ServantType): { grade: CompatibilityGrade; label: string } {
  const topKey = getTopStatKey(stats);
  // 용화 체질은 항상 S
  const entries = Object.entries(stats) as [keyof NightStats, number][];
  const over80 = entries.filter(([, v]) => v >= 80);
  if (over80.length >= 3) return { grade: 'S', label: '전설의 조합' };

  return COMPATIBILITY_MATRIX[topKey][servant];
}
