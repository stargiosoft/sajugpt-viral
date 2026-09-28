import { SPOUSE_BRANCH_DATA, ELEMENT_EMOJI } from '@/data/future-spouse/spouse';
import type { SpouseFormInput, SpouseResult } from '@/types/spouse';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function getSajuData(input: SpouseFormInput) {
  const functionUrl = `${SUPABASE_URL}/functions/v1/analyze-future-spouse`;

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      person: {
        gender: input.gender,
        birthday: input.birthday,
        birthTime: input.birthTimeUnknown ? '모름' : input.birthTime || '모름',
        birthTimeUnknown: input.birthTimeUnknown,
      },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Edge Function HTTP Error:', response.status, errorText);
    throw new Error('사주 데이터를 가져오는 중 오류가 발생했습니다.');
  }

  const data = await response.json();

  if (!data?.success) {
    throw new Error(data?.error || '사주 분석 응답 실패');
  }

  return {
    sajuRawData: data.sajuRawData,
    resultId: data.resultId,
  };
}

export function parseFutureSpouseResult(stargioData: any, gender: 'male' | 'female'): SpouseResult {
  let dayBranch = '丑';
  if (Array.isArray(stargioData?.사주) && stargioData.사주.length >= 2) {
    const dayPillar = stargioData.사주[1];
    if (dayPillar && dayPillar.length >= 2) {
      dayBranch = dayPillar.charAt(1);
    }
  }

  const baseInfo = SPOUSE_BRANCH_DATA[dayBranch] || SPOUSE_BRANCH_DATA['丑'];

  const wood = stargioData?.발달오행?.木 || 0;
  const fire = stargioData?.발달오행?.火 || 0;
  const earth = stargioData?.발달오행?.土 || 0;
  const metal = stargioData?.발달오행?.金 || 0;
  const water = stargioData?.발달오행?.水 || 0;

  let careerCategory = '기획·교육·연구·전문직 계열';
  if (metal >= 30) careerCategory = '전문 기술·IT·금융·분석 직군';
  else if (fire >= 25) careerCategory = '미디어·콘텐츠·기획·마케팅 계열';
  else if (wood >= 25) careerCategory = '기획·교육·연구·전문직 계열';
  else if (water >= 25) careerCategory = '무역·유통·서비스·창의 직군';
  else if (earth >= 25) careerCategory = '부동산·공공기관·경영 관리 분야';

  const elementIcon = ELEMENT_EMOJI[baseInfo.element] || '🌳';
  const career = `${careerCategory} ${elementIcon}`;

  const yukhab = stargioData?.대운?.현재?.육합 || stargioData?.본사주?.육합;
  const samhab = stargioData?.대운?.현재?.삼합 || stargioData?.본사주?.삼합;
  const wonjin = stargioData?.대운?.현재?.원진귀문;

  let relationship = '처음에는 친구처럼 편하게 시작하지만 시간이 지날수록 깊어지는 관계';
  if (samhab) {
    relationship = '공통의 목표와 가치관을 바탕으로 함께 성장하고 발전하는 든든한 관계';
  } else if (yukhab) {
    relationship = '첫눈에 서로에게 강하게 끌리며 깊은 유대감을 형성하는 관계';
  } else if (wonjin) {
    relationship = '서로에게 깊이 몰입하며 애정과 신경이 번갈아 작용하는 뜨거운 관계';
  }

  const gwanCount = stargioData?.발달십성?.관성 || 0;
  const jaeCount = stargioData?.발달십성?.재성 || 0;
  const sikSangCount = stargioData?.발달십성?.식상 || 0;

  let meeting = '지인의 소개나 평소 자주 찾던 편안한 일상 공간에서의 인연';
  if ((gender === 'female' && gwanCount >= 20) || (gender === 'male' && jaeCount >= 20)) {
    meeting = '직장, 공적인 모임, 또는 프로젝트나 학업을 수행하는 공간에서의 만남';
  } else if (sikSangCount >= 25) {
    meeting = '취미 모임, 동호회, 여행지나 즐거운 프라이빗 모임에서의 만남';
  }

  return {
    summary: baseInfo.summary,
    personality: baseInfo.personality,
    career,
    appearance: baseInfo.appearance,
    relationship,
    meeting,
  };
}