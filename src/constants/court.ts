import type { CrimeId, PeriodInput, SentenceGrade, SentenceGradeId, AccompliceCrimeId, TrialChoice } from '@/types/court';

// ──── 죄목 정보 ────
export interface CrimeInfo {
  id: CrimeId;
  label: string;
  prosecutorLine: string;
  defenderLine: string;
  releaseCondition: string;
  trial1Choices: TrialChoice[];
  trial3Choices: TrialChoice[];
}

export const CRIMES: CrimeInfo[] = [
  {
    id: 'unrequited_3years',
    label: '짝사랑만 3년 죄',
    prosecutorLine: '3년이면 사랑이 아니라 습관입니다.',
    defenderLine: '3년을 버틴 건 습관이 아니라 진심입니다.',
    releaseCondition: '"나 같은 게"라고 하지 말 것. 이를 어길 시 추가 기소.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '그게 왜요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '거절당하면 그 사람도 불편할까봐' },
      { id: 1, text: '나 같은 게 고백하면 부담일까봐' },
      { id: 2, text: '말해서 달라질 게 없을 것 같아서' },
    ],
  },
  {
    id: 'never_confessed',
    label: '좋아한다는 말 못 한 죄',
    prosecutorLine: '고백 안 한 건 배려가 아니라 도망입니다.',
    defenderLine: '도망이 아닙니다. 그 사람의 일상을 지키고 싶었던 겁니다.',
    releaseCondition: '다음 기회에는 3초 안에 말할 것. 또 도망치면 가중처벌.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '그게 왜요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '거절이 무서워서' },
      { id: 1, text: '말하면 어색해질까봐' },
      { id: 2, text: '그냥… 옆에만 있어도 괜찮았어서' },
    ],
  },
  {
    id: 'solo_breakup',
    label: '혼자 이별한 죄',
    prosecutorLine: '시작도 전에 끝내놓고 상처받지 마세요.',
    defenderLine: '시작 전에 끝낸 건 상대를 아꼈기 때문입니다.',
    releaseCondition: '시작하기 전에 끝내지 말 것. 시작은 상대방도 할 권리가 있음.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '있긴 한데… 끝난 거나 마찬가지예요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '안 될 거 뻔해서 미리 정리한 거예요' },
      { id: 1, text: '상대가 나 안 좋아하는 거 느껴져서' },
      { id: 2, text: '상처받기 싫어서요' },
    ],
  },
  {
    id: 'self_deprecation',
    label: '"나 같은 게 뭐" 죄',
    prosecutorLine: '못생겨서 못 만나는 거 아닙니다. 못생겼다고 믿어서 못 만나는 겁니다.',
    defenderLine: '그 믿음을 만든 건 피고인이 아닙니다. 세상이 심어놓은 겁니다.',
    releaseCondition: '거울 대신 사주를 볼 것. 거울은 겉만 보여주지만 사주는 전부를 봄.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '있어봤자 뭐가 달라지나요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '나 같은 게 고백하면 민폐잖아요' },
      { id: 1, text: '좋아해도 어차피 안 될 거니까' },
      { id: 2, text: '솔직히… 자신이 없어서' },
    ],
  },
  {
    id: 'pretend_ok_after_ghosted',
    label: '읽씹당하고 괜찮은 척한 죄',
    prosecutorLine: '괜찮은 척이 제일 안 괜찮은 겁니다.',
    defenderLine: '괜찮은 척이라도 해야 버틸 수 있었던 겁니다.',
    releaseCondition: '괜찮지 않으면 괜찮지 않다고 말할 것. 침묵은 동의가 아님.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '있었는데 이제 아닌 것 같아요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '티 내면 짐이 될까봐' },
      { id: 1, text: '읽씹당해도 상처 안 받는 척해야 해서' },
      { id: 2, text: '괜찮은 척 안 하면 진짜 무너질까봐' },
    ],
  },
  {
    id: 'always_friendzoned',
    label: '맨날 친구로만 남은 죄',
    prosecutorLine: '좋은 사람 연기만 해서 친구가 된 겁니다.',
    defenderLine: '좋은 사람이 아니라 진짜 좋은 사람이었던 겁니다.',
    releaseCondition: '좋은 사람 그만하고 좋아하는 사람이 될 것. 착함은 전략이 아님.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '네, 근데 그냥 친구예요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '고백하면 이 관계마저 잃을까봐' },
      { id: 1, text: '좋아하는 티를 내는 법을 몰라서' },
      { id: 2, text: '옆에 있는 것만으로 충분하다고 생각해서' },
    ],
  },
  {
    id: 'mirror_sigh',
    label: '거울 보고 한숨 쉰 죄',
    prosecutorLine: '당신보다 못생긴 사람도 지금 연애하고 있습니다.',
    defenderLine: '거울이 보여주지 못하는 매력이 사주에는 있습니다.',
    releaseCondition: '한숨 대신 사주를 볼 것. 당신의 매력은 거울 밖에 있음.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '네, 근데 나는 자격이 없는 것 같아요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '외모에 자신이 없어서' },
      { id: 1, text: '좋아하는 사람 앞에 서면 위축돼서' },
      { id: 2, text: '나보다 나은 사람이 너무 많아서' },
    ],
  },
  {
    id: 'comparison_envy',
    label: '"쟤는 원래 이쁘니까" 죄',
    prosecutorLine: '그 사람도 거울 앞에서 한숨 쉽니다.',
    defenderLine: '비교한 건 눈이지, 마음이 아닙니다.',
    releaseCondition: '비교를 멈출 것. 당신의 사주에는 당신만의 매력이 있음.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '네' },
      { id: 2, text: '모르겠어요' },
    ],
    trial3Choices: [
      { id: 0, text: '나도 잘 모르겠는데 자꾸 비교하게 돼요' },
      { id: 1, text: '노력해도 안 되는 건 안 되는 거잖아요' },
      { id: 2, text: '그냥… 운이 없는 것 같아서' },
    ],
  },
  {
    id: 'drunk_confession_deleted',
    label: '취중고백 후 기억 삭제한 죄',
    prosecutorLine: '술이 한 말도 진심이었습니다.',
    defenderLine: '진심을 말하려면 술이 필요했던 거, 그게 용기입니다.',
    releaseCondition: '다음엔 맨정신에 말할 것. 술 없이도 용기는 나옴.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '있었는데 기억이 좀…' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '맨정신엔 절대 말 못 해서' },
      { id: 1, text: '술 먹고 한 말이라 없었던 일로 하고 싶어서' },
      { id: 2, text: '기억 삭제하는 게 서로를 위한 거라고 생각해서' },
    ],
  },
  {
    id: 'phone_checking',
    label: '연락 올까봐 폰만 본 죄',
    prosecutorLine: '그 사람도 지금 폰 보고 있을 수도 있습니다.',
    defenderLine: '기다린다는 건, 아직 포기 안 했다는 뜻입니다.',
    releaseCondition: '기다리지 말고 먼저 보낼 것. 상대방도 기다리고 있을 수 있음.',
    trial1Choices: [
      { id: 0, text: '…없는데요' },
      { id: 1, text: '아뇨, 그냥 폰 보는 거예요' },
      { id: 2, text: '네' },
    ],
    trial3Choices: [
      { id: 0, text: '먼저 연락하면 부담줄까봐' },
      { id: 1, text: '기다리는 게 편해서' },
      { id: 2, text: '연락 오면 그때 시작하려고' },
    ],
  },
];

export function getCrimeInfo(crimeId: CrimeId): CrimeInfo {
  return CRIMES.find(c => c.id === crimeId) ?? CRIMES[3]; // fallback: 나같은게뭐
}

// ──── 기간 선택지 ────
export interface PeriodOption {
  id: PeriodInput;
  label: string;
  bonus: number;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'under_6m', label: '6개월 미만', bonus: 0 },
  { id: '6m_1y', label: '6개월 ~ 1년', bonus: 1 },
  { id: '1y_3y', label: '1년 ~ 3년', bonus: 2 },
  { id: '3y_5y', label: '3년 ~ 5년', bonus: 4 },
  { id: 'over_5y', label: '5년 이상', bonus: 7 },
];

export function getPeriodBonus(periodId: PeriodInput): number {
  return PERIOD_OPTIONS.find(p => p.id === periodId)?.bonus ?? 0;
}

// ──── 형량 등급 ────
export function getSentenceGrade(sentence: number): SentenceGrade {
  if (sentence >= 13) return { grade: 'extreme', label: '극형', borderColor: '#FFD700' };
  if (sentence >= 8) return { grade: 'felony', label: '강력범', borderColor: '#FFD700' };
  if (sentence >= 4) return { grade: 'serious', label: '중범죄', borderColor: '#C0C0C0' };
  return { grade: 'minor', label: '경범죄', borderColor: '#8B7355' };
}

export function calculateBounty(sentence: number): number {
  return sentence * 500;
}

export function calculatePercentile(sentence: number): number {
  if (sentence >= 13) return 3;
  if (sentence >= 10) return 7;
  if (sentence >= 8) return 10;
  if (sentence >= 6) return 20;
  if (sentence >= 4) return 30;
  if (sentence >= 2) return 50;
  return 70;
}

// ──── 판사 코멘트 ────
export function getJudgeComment(gradeId: SentenceGradeId): string {
  const comments: Record<SentenceGradeId, string> = {
    minor: '초범이니 봐드립니다.',
    serious: '반성의 기미가 보이지 않습니다.',
    felony: '사주가 이렇게 아까운데 이게 말이 됩니까.',
    extreme: '도화살에 매력을 이 정도 썩히다니. 사주 모독죄 추가 기소.',
  };
  return comments[gradeId];
}

// ──── 공범 선택지 ────
export interface AccompliceOption {
  id: AccompliceCrimeId;
  label: string;
  subtext: string;
}

export const ACCOMPLICE_OPTIONS: AccompliceOption[] = [
  { id: 'no_blind_date', label: '소개팅 한 번 안 시켜준 죄', subtext: '인맥 그렇게 넓으면서 왜 나한테는 안 써?' },
  { id: 'just_watched', label: '옆에서 구경만 한 죄', subtext: '내가 썸 타는 거 알면서 왜 가만히 있었어?' },
  { id: 'why_no_bf', label: '"넌 왜 남친이 없어" 상해죄', subtext: '물어볼 거면 남자를 데려오든가' },
  { id: 'solo_advisor', label: '본인도 솔로면서 조언한 죄', subtext: '너도 못 하면서 나한테 "그냥 말해"는 뭐야' },
];

// ──── 로딩 메시지 ────
export const ANALYZING_MESSAGES = [
  '사건 접수 중...',
  '검사 윤태산 출석...',
  '변호사 서휘윤 출석...',
  '피고인의 사주 원국 분석 중... ⚖️',
];
