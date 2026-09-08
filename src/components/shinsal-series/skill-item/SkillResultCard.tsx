'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import OutlineBoxButton from '@/components/OutlineBoxButton';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import ResultFooterSections from '@/components/ResultFooterSections';

import type { SkillAnalysisResult } from '@/types/shinsal-series/skill-item';
import { SKILL_ITEM_COLORS as C } from '@/constants/shinsalItemTheme';

interface Props {
  result: SkillAnalysisResult;
  onShare: () => void;
  onRestart?: () => void;
  onSaveImage?: () => void;
  savingImage?: boolean;
}

interface ShinsalProfile {
  id: string;
  shinsal: string;
  name: string;
  keyword: string;
  statText?: string;
  iconUrl: string;
  description: string;
}

const PRETENDARD_FONT = "'Pretendard Variable', Pretendard, sans-serif";
const TITLE_FONT = "'JejuStoneWall', sans-serif";
const SAJUGPT_URL = 'https://sajugpt.app';

// 결과페이지 간격
const RESULT_GAPS = {
  imageToActions: '16px',
  actionsToShare: '16px',
};

// 신살별 포인트 컬러
const SHINSAL_ACCENTS: Record<
  string,
  {
    iconBg: string;
    badgeBg: string;
    badgeText: string;
    border: string;
  }
> = {
  도화살: {
    iconBg: 'bg-pink-50',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-600',
    border: 'border-pink-200',
  },
  역마살: {
    iconBg: 'bg-sky-50',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-600',
    border: 'border-sky-200',
  },
  장성살: {
    iconBg: 'bg-amber-50',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-600',
    border: 'border-amber-200',
  },
  화개살: {
    iconBg: 'bg-violet-50',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-600',
    border: 'border-violet-200',
  },
  망신살: {
    iconBg: 'bg-fuchsia-50',
    badgeBg: 'bg-fuchsia-50',
    badgeText: 'text-fuchsia-600',
    border: 'border-fuchsia-200',
  },
  겁살: {
    iconBg: 'bg-red-50',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
    border: 'border-red-200',
  },
  재살: {
    iconBg: 'bg-indigo-50',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  천살: {
    iconBg: 'bg-cyan-50',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-600',
    border: 'border-cyan-200',
  },
  지살: {
    iconBg: 'bg-teal-50',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-600',
    border: 'border-teal-200',
  },
  반안살: {
    iconBg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  월살: {
    iconBg: 'bg-blue-50',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-600',
    border: 'border-blue-200',
  },
  육해살: {
    iconBg: 'bg-purple-50',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-600',
    border: 'border-purple-200',
  },
};

const DEFAULT_ACCENT = {
  iconBg: 'bg-purple-50',
  badgeBg: 'bg-purple-50',
  badgeText: 'text-purple-600',
  border: 'border-purple-200',
};

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
} as const;

function SkillCharacter({
  avatar,
}: {
  avatar?: {
    name?: string;
    imageUrl?: string;
  };
}) {
  if (!avatar?.imageUrl) return null;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-28 h-28 rounded-full overflow-hidden border-2 shadow-sm"
        style={{
          borderColor: 'rgba(139, 95, 199, 0.25)',
          boxShadow: '0 8px 30px rgba(139, 95, 199, 0.12)',
        }}
      >
        <Image
          src={avatar.imageUrl}
          alt={avatar.name ?? '띠 아바타'}
          fill
          sizes="112px"
          className="object-cover"
          priority
        />
      </div>

      {avatar.name && (
        <span
          className="mt-3 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: 'rgba(139, 95, 199, 0.08)',
            border: '1px solid rgba(139, 95, 199, 0.16)',
            color: C.accent,
          }}
        >
          {avatar.name}띠
        </span>
      )}
    </div>
  );
}

const SkillResultCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      result,
      onRestart,
      onSaveImage,
      savingImage,
    },
    ref
  ) => {
    const acquiredProfiles: ShinsalProfile[] = (
      (
        result as SkillAnalysisResult & {
          acquiredProfiles?: ShinsalProfile[];
        }
      ).acquiredProfiles ?? []
    ).slice(0, 5);

    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : '';

    const shareUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : '';

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: 'easeOut',
        }}
        style={{
          padding: '12px 8px 48px',
          fontFamily: PRETENDARD_FONT,
          color: C.textPrimary,
        }}
      >
        
        <div ref={ref}>
          <div
            style={{
              position: 'relative',
              backgroundColor: C.cardBg,
              borderRadius: '28px',
              padding: '24px 20px 20px',
              border: `1px solid ${C.border}`,
              boxShadow:
                '0 16px 40px rgba(139, 95, 199, 0.10)',
              overflow: 'hidden',
              fontFamily: PRETENDARD_FONT,
            }}
          >
            {/* 1. 결과 타이틀 헤더 */}
            <div
              style={{
                textAlign: 'center',
                paddingBottom: '16px',
                marginTop: '20px',
              }}
            >
              <h2
                style={{
                  fontFamily: TITLE_FONT,
                  fontSize: '26px',
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.3,
                  letterSpacing: '-0.5px',
                  wordBreak: 'keep-all',
                }}
              >
                당신의 신살 종류는 !!
                <br />
              </h2>

              <p
                className="mt-2 text-sm leading-relaxed"
                style={{
                  color: C.textSecondary,
                }}
              >
                당신에게는 이런 신살 기운이 함께하고 있어요
              </p>
            </div>

            {/* 2. 띠 캐릭터 */}
            <div className="relative flex flex-col items-center pt-2 pb-6">
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl"
                style={{
                  backgroundColor:
                    'rgba(139, 95, 199, 0.08)',
                }}
              />

              <div className="relative z-10">
                <SkillCharacter avatar={result?.avatar} />
              </div>
            </div>

            {/* 3. 메인 콘텐츠 패널 (상세 신살 목록) */}
            <div
              style={{
                position: 'relative',
                backgroundColor: C.panelBg,
                borderRadius: '24px',
                padding: '20px 20px 18px',
                marginBottom: '14px',
                border: `1px solid ${C.border}`,
                fontFamily: PRETENDARD_FONT,
              }}
            >
              {/* 신살 개수 요약 */}
              <div
                className="flex items-center justify-between pb-3 mb-3"
                style={{
                  borderBottom:
                    '1px solid rgba(126, 87, 168, 0.10)',
                }}
              >
                <div className="flex flex-col">
                  <span
                    className="text-[11px] mb-0.5"
                    style={{
                      color: C.textTertiary,
                    }}
                  >
                    내가 가진 신살
                  </span>

                  <span
                    className="text-sm font-bold"
                    style={{
                      color: C.textPrimary,
                    }}
                  >
                    {acquiredProfiles.length}가지
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {acquiredProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          'rgba(139, 95, 199, 0.07)',
                        border:
                          '1px solid rgba(139, 95, 199, 0.14)',
                      }}
                    >
                      <div className="relative w-5 h-5">
                        <Image
                          src={profile.iconUrl}
                          alt={profile.shinsal}
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 신살별 상세 분석 카드 목록 */}
              <div className="flex flex-col gap-3">
                {acquiredProfiles.map((profile, index) => {
                  const accent =
                    SHINSAL_ACCENTS[profile.shinsal] ??
                    DEFAULT_ACCENT;

                  return (
                    <motion.div
                      key={profile.id}
                      variants={FADE_UP}
                      initial="hidden"
                      animate="visible"
                      transition={{
                        delay: index * 0.07,
                      }}
                      className={`relative overflow-hidden rounded-2xl border ${accent.border} bg-white`}
                    >
                      <div
                        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl ${accent.iconBg}`}
                      />

                      <div className="relative p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`shrink-0 w-14 h-14 rounded-2xl ${accent.iconBg} border ${accent.border} flex items-center justify-center`}
                          >
                            <div className="relative w-10 h-10">
                              <Image
                                src={profile.iconUrl}
                                alt={profile.shinsal}
                                fill
                                sizes="40px"
                                className="object-contain"
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-base font-extrabold"
                                style={{
                                  color: C.textPrimary,
                                }}
                              >
                                {profile.shinsal}
                              </span>

                              <span
                                className="text-[10px]"
                                style={{
                                  color: C.textTertiary,
                                }}
                              >
                                #{String(index + 1).padStart(2, '0')}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md ${accent.badgeBg} ${accent.badgeText} text-[11px] font-semibold`}
                            >
                              {profile.keyword}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p
                            className="text-sm leading-relaxed"
                            style={{
                              color: C.textSecondary,
                            }}
                          >
                            {profile.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 하단 감성 문구 */}
            <div
              style={{
                textAlign: 'center',
                padding: '6px 10px 2px',
                fontSize: '13px',
                fontWeight: 500,
                color: C.accent,
                letterSpacing: '-0.5px',
                lineHeight: 1.4,
                fontFamily: PRETENDARD_FONT,
              }}
            >
              🔮 사주GPT에서 나의 운명과 12신살 확인하기
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: RESULT_GAPS.imageToActions,
          }}
        >
          <OutlineBoxButton
            href={SAJUGPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            color={C.accent}
            background={C.cardBg}
            border={`1.5px solid ${C.accent}`}
            height="50px"
            borderRadius="18px"
            fontSize="15px"
            fontWeight={700}
          >
            <span
              style={{
                fontFamily: PRETENDARD_FONT,
                letterSpacing: '-0.4px',
                color: C.accent,
              }}
            >
              사주GPT에서 운세 상담하기
            </span>
          </OutlineBoxButton>
        </div>

        <div
          style={{
            marginTop: '8px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <div onClick={onRestart} style={{ flex: 1, cursor: 'pointer' }}>
            <PressableButton
              onClick={onRestart}
              label="다시하기"
              style={{
                width: '100%',
                height: '54px',
              }}
              bgStyle={{
                backgroundColor: 'rgba(139, 95, 199, 0.08)',
                borderRadius: '18px',
                border: `1.5px solid ${C.accent}`,
              }}
              hoverBackground="rgba(139, 95, 199, 0.14)"
              textStyle={{
                color: C.accent,
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: PRETENDARD_FONT,
                letterSpacing: '-0.4px',
                paddingTop: '2px',
              }}
            />
          </div>

          <div onClick={onSaveImage} style={{ flex: 2, cursor: 'pointer' }}>
            <PressableButton
              onClick={onSaveImage}
              label={savingImage ? '저장 중...' : '이미지 저장하기'}
              style={{
                width: '100%',
                height: '54px',
              }}
              bgStyle={{
                backgroundColor: C.accent,
                borderRadius: '18px',
                border: `1.5px solid ${C.accentHover || C.accent}`,
              }}
              hoverBackground={C.accentHover}
              textStyle={{
                color: C.textOnAccent,
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: PRETENDARD_FONT,
                letterSpacing: '-0.4px',
                paddingTop: '2px',
              }}
            />
          </div>
        </div>

        <div
          className="rounded-2xl p-2"
          style={{
            marginTop: RESULT_GAPS.actionsToShare,
            textAlign: 'center',
            border: `1.5px solid ${C.border}`,
            backgroundColor: C.cardBg,
          }}
        >
          <ShareRow
            shareContent={{
              featureType: 'shinsal_skill',
              resultId: result?.resultId ?? '',
              title: '✨ 나의 12신살 결과',
              description:
                '나에게는 어떤 신살 기운이 함께하고 있는지 확인해보세요!',
              shareUrl,
              imageUrl: origin
                ? `${origin}/shinsal/og-share.jpg`
                : '/shinsal/og-share.jpg',
              testId: 'shinsal-skill',
            }}
            copyColor={C.accent}
            copyHoverColor={C.accentHover}
            copyIconColor={C.textOnAccent}
          />
        </div>

        <div
          style={{
            marginBottom: '120px',
          }}
        >
          <ResultFooterSections
            excludeId="shinsal-skill"
            titleStyle={{
              fontFamily: PRETENDARD_FONT,
              fontSize: '16px',
              fontWeight: 700,
              color: C.textPrimary,
              letterSpacing: '-0.3px',
              paddingLeft: '2px',
            }}
            cardBg={C.cardBg}
            cardTitleColor={C.textPrimary}
            featureType="shinsal_skill"
            resultId={result?.resultId ?? ''}
            storageKey="shinsal_skill_liked_comments"
            placeholder="어떤 신살이 나오셨나요?"
            themeColor={C.accent}
            inputBg={C.cardBg}
            disabledBg="#F3EEF7"
            emptyStateColor={C.textTertiary}
            metaColor={C.textTertiary}
            heartIdleColor="#B8ADBF"
            moreButtonFontSize="12.5px"
            moreButtonHoverBg="rgba(139, 95, 199, 0.10)"
            submitButtonHoverBg={C.accentHover}
          />
        </div>
      </motion.div>
    );
  }
);

SkillResultCard.displayName = 'SkillResultCard';

export default SkillResultCard;