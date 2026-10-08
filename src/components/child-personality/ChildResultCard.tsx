'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

import type {
  ChildPersonalityResult,
} from '@/types/child-personality';

interface Props {
  result: ChildPersonalityResult;
  imageUrl?: string;
}

/* =========================================================
 * 화면용 fallback
 * ======================================================= */

const FALLBACK = {
  title: '우리 아이만의 타고난 성향',
  subtitle: '사주 구조 기반 해석',

  personalityDescription:
    '사주 전체의 오행과 십성 관계를 바탕으로 여러 성향이 함께 나타나는 구조예요.',

  personalityKeywords: [
    '자기만의 성향',
    '관찰',
    '성장',
  ],

  studyTitle: '아이의 관심을 따라가는 학습',
  studyDescription:
    '아이의 관심이 생기는 순간을 관찰하고 그 관심사를 학습과 연결해주는 방식이 좋아요.',

  praiseQuote:
    '“네가 스스로 생각하고 선택한 과정이 정말 멋져.”',

  praiseDescription:
    '결과만 칭찬하기보다 아이가 생각하고 시도한 과정을 구체적으로 칭찬해주세요.',

  stressDescription:
    '아이의 반응이 강하게 나타나는 순간에는 행동만 바로잡기보다 무엇 때문에 그런 반응이 나왔는지 먼저 살펴보는 것이 좋아요.',

  stressParentTip:
    '아이의 감정과 상황을 먼저 이해한 뒤 행동을 함께 조절해주세요.',

  activities: [
    '관심사를 활용한 자유 놀이',
    '관찰·체험 활동',
    '부모와 함께하는 만들기',
  ],

  parentMessage:
    '사주는 아이를 정해진 성격으로 규정하기보다 아이를 이해하는 하나의 관점으로 활용하는 것이 좋아요.',
};

/* =========================================================
 * 안전한 문자열 처리
 * ======================================================= */

function text(
  value: unknown,
  fallback: string,
  name: string,
  missing: string[],
): string {
  if (
    typeof value === 'string' &&
    value.trim().length > 0
  ) {
    return value;
  }

  missing.push(name);

  return fallback;
}

/* =========================================================
 * 안전한 배열 처리
 * ======================================================= */

function list(
  value: unknown,
  fallback: string[],
  name: string,
  missing: string[],
): string[] {
  let targetValue = value;

  if (typeof value === 'string' && value.trim().length > 0) {
      if (value.includes(',')) {
        targetValue = value.split(',').map((s) => s.trim());
      } else if (value.includes('·')) {
        targetValue = value.split('·').map((s) => s.trim());
      } else {
        targetValue = [value];
      }
    }

  if (Array.isArray(targetValue) && targetValue.length === 1 && typeof targetValue[0] === 'string') {
    const singleVal = targetValue[0];
    if (singleVal.includes(',')) {
      targetValue = singleVal.split(',').map((s) => s.trim());
    }
  }

  if (Array.isArray(targetValue)) {
    const items = targetValue.filter(
      (item): item is string =>
        typeof item === 'string' &&
        item.trim().length > 0,
    );

    const unique = Array.from(
      new Set(items),
    );

    if (unique.length > 0) {
      return unique;
    }
  }

  missing.push(name);

  return fallback;
}

function normalize(
  raw: ChildPersonalityResult | undefined | null,
) {
  const missing: string[] = [];
  const meta = raw?.meta as {
    sourceKeywords?: string[];
    dayMaster?: string;
    dominantElement?: string;
    dominantTenStar?: string;
    strength?: string;
  } | undefined;

  const keywordsFromMeta =
    Array.isArray(meta?.sourceKeywords)
      ? meta.sourceKeywords
      : [];

  const generatedKeywords = [
    meta?.dayMaster
      ? `${meta.dayMaster}일간`
      : undefined,

    meta?.dominantElement
      ? `${meta.dominantElement} 기운`
      : undefined,

    meta?.dominantTenStar
      ? meta.dominantTenStar
      : undefined,

    meta?.strength
      ? meta.strength
      : undefined,
  ].filter(
    (value): value is string =>
      typeof value === 'string' &&
      value.trim().length > 0,
  );

  const keywords =
    keywordsFromMeta.length > 0
      ? keywordsFromMeta
      : generatedKeywords;

  let studyTitle =
    FALLBACK.studyTitle;

  const studyText =
    typeof raw?.study === 'string'
      ? raw.study
      : '';

  if (
    studyText.includes('표현') ||
    studyText.includes('말하기') ||
    studyText.includes('발표')
  ) {
    studyTitle = '표현하면서 배우는 학습';
  } else if (
    studyText.includes('직접') ||
    studyText.includes('체험')
  ) {
    studyTitle = '직접 해보며 배우는 학습';
  } else if (
    studyText.includes('집중') ||
    studyText.includes('파고')
  ) {
    studyTitle = '깊이 파고드는 학습';
  } else if (
    studyText.includes('루틴') ||
    studyText.includes('순서')
  ) {
    studyTitle = '안정적인 루틴형 학습';
  }

  const praiseText =
    typeof raw?.praise === 'string'
      ? raw.praise
      : '';

  const stressText =
    typeof raw?.stress === 'string'
      ? raw.stress
      : '';

  const parentTip =
    stressText.includes('선택') ||
    stressText.includes('통제')
      ? '선택할 수 있는 범위를 정해주고 그 안에서 직접 결정하게 해보세요.'
      : stressText.includes('변화')
        ? '새로운 일정이나 환경이 있다면 미리 알려주는 것이 도움이 될 수 있어요.'
        : stressText.includes('간섭')
          ? '아이에게 필요한 시간을 조금 주고 스스로 마무리할 수 있게 기다려주세요.'
          : '행동을 바로 판단하기보다 먼저 아이의 상황과 감정을 살펴봐주세요.';

  const result = {
    title: text(
      raw?.title,
      FALLBACK.title,
      'title',
      missing,
    ),

    subtitle: text(
      raw?.subtitle,
      FALLBACK.subtitle,
      'subtitle',
      missing,
    ),

    personality: {
      description: text(
        raw?.personality,
        FALLBACK.personalityDescription,
        'personality',
        missing,
      ),

      keywords:
        keywords.length > 0
          ? Array.from(new Set(keywords))
          : FALLBACK.personalityKeywords,
    },

    study: {
      title: studyTitle,

      description: text(
        raw?.study,
        FALLBACK.studyDescription,
        'study',
        missing,
      ),
    },

    praise: {
      quote: text(
        praiseText,
        FALLBACK.praiseQuote,
        'praise',
        missing,
      ),

      description:
        '결과만 칭찬하기보다 아이가 생각하고 시도한 과정을 구체적으로 칭찬해주세요.',
    },

    stress: {
      description: text(
        stressText,
        FALLBACK.stressDescription,
        'stress',
        missing,
      ),

      parentTip:
        stressText.trim().length > 0
          ? parentTip
          : FALLBACK.stressParentTip,
    },

    activities: list(
      raw?.activities,
      FALLBACK.activities,
      'activities',
      missing,
    ),

    parentMessage: text(
      raw?.parentMessage,
      FALLBACK.parentMessage,
      'parentMessage',
      missing,
    ),
  };

  return {
    result,
    missing,
  };
}

/* =========================================================
 * Component
 * ======================================================= */

const ChildResultCard = forwardRef<
  HTMLDivElement,
  Props
>(({ result: rawResult, imageUrl }, ref) => {
  const {
    result,
    missing,
  } = normalize(rawResult);

  if (
    process.env.NODE_ENV === 'development' &&
    missing.length > 0
  ) {
    console.warn(
      '[ChildResultCard] fallback 사용 필드:',
      missing,
    );
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        style={{
          width: '100%',
          maxWidth: '430px',
          margin: '0 auto',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          borderRadius: '28px',
          background:
            'linear-gradient(180deg, #FFFFFF 0%, #FFFBF7 100%)',
          border: '1.5px solid #F3E8DC',
          boxShadow:
            '0 16px 40px rgba(120, 85, 55, 0.08)',
          color: '#38302A',
          fontFamily: "'Pretendard', sans-serif",
        }}
      >
        {/* =====================================================
         * Header
         * =================================================== */}

        <div
          style={{
            padding: '30px 24px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '5px 12px',
              borderRadius: '99px',
              background: '#FDF3EC',
              color: '#D47642',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              marginBottom: '10px',
              fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif",
            }}
          >
            우리 아이 성향 분석 결과
          </div>

          {imageUrl && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '6px 0 12px',
              }}
            >
              <img
                src={imageUrl}
                alt="성향 분석 캐릭터"
                style={{
                  width: '80px',
                  height: '80px',
                }}
              />
            </div>
          )}

          <h2
            style={{
              margin: '4px 0 6px',
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '-0.6px',
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
              fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif",
            }}
          >
            {result.title}
          </h2>

          <p
            style={{
              margin: 0,
              color: '#8C7E74',
              fontSize: '12px',
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
            }}
          >
            {result.subtitle}
          </p>
        </div>

        {/* =====================================================
         * Personality
         * =================================================== */}

        <section
          style={{
            margin: '0 16px',
            padding: '20px',
            borderRadius: '20px',
            background: '#FFFDF9',
            border: '1px solid #F0E4D8',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 900,
              color: '#B56536',
              marginBottom: '8px',
              letterSpacing: '-0.3px',
            }}
          >
            🌱 기본 성향 분석
          </div>

          <p
            style={{
              margin: 0,
              color: '#594F48',
              fontSize: '13px',
              lineHeight: 1.6,
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
            }}
          >
            {result.personality.description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginTop: '14px',
              flexWrap: 'wrap',
            }}
          >
            {result.personality.keywords.map(
              (keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '999px',
                    background: '#FCEFE4',
                    color: '#C46231',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  #{keyword}
                </span>
              ),
            )}
          </div>
        </section>

        {/* =====================================================
         * Study / Praise
         * =================================================== */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            padding: '12px 16px 0',
          }}
        >
          {/* Study */}

          <section
            style={{
              padding: '18px 14px',
              borderRadius: '18px',
              background: '#F6F3FC',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#7C63A8',
                marginBottom: '6px',
              }}
            >
              ✏️ 학습 스타일
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 900,
                lineHeight: 1.35,
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
                color: '#3E344A',
              }}
            >
              {result.study.title}
            </div>

            <p
              style={{
                margin: '6px 0 0',
                color: '#70647C',
                fontSize: '11px',
                lineHeight: 1.5,
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
              }}
            >
              {result.study.description}
            </p>
          </section>

          {/* Praise */}

          <section
            style={{
              padding: '18px 14px',
              borderRadius: '18px',
              background: '#FAF2F2',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#B06464',
                marginBottom: '6px',
              }}
            >
              👍 맞춤 칭찬법
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 900,
                lineHeight: 1.4,
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
                color: '#4A3737',
              }}
            >
              {result.praise.quote}
            </div>

            <p
              style={{
                margin: '6px 0 0',
                color: '#7D6464',
                fontSize: '11px',
                lineHeight: 1.5,
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
              }}
            >
              {result.praise.description}
            </p>
          </section>
        </div>

        {/* =====================================================
         * Stress
         * =================================================== */}

        <section
          style={{
            margin: '10px 16px 0',
            padding: '18px',
            borderRadius: '18px',
            background: '#F1F6FB',
            border: '1px solid #E2ECF5',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 900,
              color: '#537A9E',
            }}
          >
            ❤️ 마음이 지칠 때
          </div>

          <p
            style={{
              margin: '6px 0 0',
              color: '#515B66',
              fontSize: '12px',
              lineHeight: 1.55,
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
            }}
          >
            {result.stress.description}
          </p>

          <div
            style={{
              marginTop: '10px',
              padding: '10px 12px',
              borderRadius: '12px',
              background: '#FFFFFF',
              color: '#48627A',
              fontSize: '11px',
              fontWeight: 700,
              lineHeight: 1.5,
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
              border: '1px solid #E4EDF5',
            }}
          >
            {result.stress.parentTip}
          </div>
        </section>

        {/* =====================================================
         * Activities
         * =================================================== */}

        <section
          style={{
            margin: '10px 16px 0',
            padding: '18px',
            borderRadius: '18px',
            background: '#F2F7F0',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 900,
              color: '#628A5B',
              marginBottom: '10px',
            }}
          >
            ⚽️ 추천 활동
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
            }}
          >
            {result.activities.map(
              (activity, index) => {
                const isLastOdd =
                  result.activities.length % 2 !== 0 &&
                  index === result.activities.length - 1;

                return (
                  <div
                    key={`${activity}-${index}`}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      textAlign: 'center',
                      color: '#566650',
                      fontSize: '11px',
                      fontWeight: 700,
                      wordBreak: 'keep-all',
                      overflowWrap: 'anywhere',
                      border: '1px solid #E5EFE2',
                      ...(isLastOdd
                        ? {
                            gridColumn: 'span 2',
                            maxWidth: '70%',
                            margin: '0 auto',
                            width: '100%',
                          }
                        : {}),
                    }}
                  >
                    {activity}
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* =====================================================
         * Parent Message
         * =================================================== */}

        <section
          style={{
            margin: '10px 16px 16px',
            padding: '20px 18px',
            borderRadius: '18px',
            background: '#3A322B',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: '#D9B59E',
              fontWeight: 800,
              marginBottom: '8px',
              letterSpacing: '0.3px',
            }}
          >
            💌 부모님께 드리는 글
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              lineHeight: 1.6,
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
              whiteSpace: 'pre-line',
              color: '#F4EFEB',
            }}
          >
            {result.parentMessage}
          </div>
        </section>

        {/* =====================================================
         * Footer
         * =================================================== */}

        <div
          style={{
            paddingBottom: '18px',
            textAlign: 'center',
            color: '#A89B90',
            fontSize: '9px',
          }}
        >
          사주 데이터를 바탕으로 가볍고 따뜻하게 읽는 콘텐츠입니다.
        </div>
      </motion.div>
    </>
  );
});

ChildResultCard.displayName = 'ChildResultCard';

export default ChildResultCard;