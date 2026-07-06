'use client';

import { motion, type Variants } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { RelationshipStatus } from '@/types/stock';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import StickyCTAButton from '@/components/StickyCTAButton';
import { RELATIONSHIP_STATUSES } from '@/constants/stock';

interface Props {
  birthDate: string;
  setBirthDate: (v: string) => void;
  birthTime: string;
  unknownTime: boolean;
  onTimeSelect: (displayTime: string, isUnknown: boolean) => void;
  gender: Gender;
  setGender: (v: Gender) => void;
  relationshipStatus: RelationshipStatus;
  setRelationshipStatus: (v: RelationshipStatus) => void;
  isFormValid: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function StockInput({
  birthDate,
  setBirthDate,
  birthTime,
  unknownTime,
  onTimeSelect,
  gender,
  setGender,
  relationshipStatus,
  setRelationshipStatus,
  isFormValid,
  submitting,
  error,
  onSubmit,
}: Props) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        padding: '0 20px',
        paddingBottom: '100px',
      }}
    >
      {/* Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ paddingTop: '48px', marginBottom: '36px' }}
      >
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.6px',
            lineHeight: '34px',
            marginBottom: '8px',
          }}
        >
          연애 시장에서 내 몸값은?
        </h1>
        <p
          style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#888888',
            letterSpacing: '-0.3px',
            lineHeight: '22px',
            paddingLeft: '2px',
          }}
        >
          사주로 분석한 당신의 연애 주가를 확인해 보세요.
        </p>
      </motion.div>

      {/* Gender */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '36px' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
            marginBottom: '8px',
          }}
        >
          성별
        </p>
        <GenderSelect value={gender} onChange={setGender} accentColor="#7A38D8" bgColor="rgba(255,255,255,0.06)" unselectedColor="rgba(255,255,255,0.28)" />
      </motion.div>

      {/* Birth Date */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '36px' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
            marginBottom: '8px',
          }}
        >
          생년월일
        </p>
        <BirthInput
          value={birthDate}
          onChange={setBirthDate}
          onEnter={onSubmit}
          accentColor="#7A38D8"
          bgColor="rgba(255,255,255,0.06)"
          textColor="#ffffff"
          borderColor="transparent"
          errorColor="#F04452"
          errorGap="8px"
          errorOverlay
          errorFontSize="12px"
          errorIconSize={14}
        />
      </motion.div>

      {/* Birth Time */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '36px' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
            marginBottom: '8px',
          }}
        >
          태어난 시간
        </p>
        <TimeSelectSheet
          value={birthTime}
          unknownTime={unknownTime}
          onSelect={onTimeSelect}
          accentColor="#B794F6"
        />
      </motion.div>

      {/* Relationship Status */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '24px' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
            marginBottom: '8px',
          }}
        >
          연애 상태
        </p>
        <div
          className="overflow-hidden isolate"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '8px' }}
        >
          <div className="flex gap-2">
            {RELATIONSHIP_STATUSES.map((status) => (
              <button
                key={status.id}
                type="button"
                onClick={() => setRelationshipStatus(status.id)}
                className="flex-1 flex items-center justify-center relative"
                style={{
                  height: '48px',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {relationshipStatus === status.id && (
                  <motion.div
                    layoutId="stock-relationship-indicator"
                    className="absolute inset-0"
                    style={{
                      backgroundColor: '#7A38D8',
                      borderRadius: '12px',
                      boxShadow: '0px 2px 7px 0px rgba(122, 56, 216, 0.3)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className="relative z-[1]"
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.45px',
                    color: relationshipStatus === status.id ? '#ffffff' : 'rgba(255,255,255,0.28)',
                    transition: 'color 0.2s',
                  }}
                >
                  {status.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1 items-center"
          style={{
            marginTop: '24px',
            borderRadius: '10px',
            padding: '12px 16px',
            backgroundColor: 'rgba(240,68,82,0.12)',
            border: '1px solid rgba(240,68,82,0.3)',
          }}
        >
          <p style={{ color: '#FF8A80', fontSize: '13px' }}>
            {error}
          </p>
        </motion.div>
      )}

      {/* Fixed Bottom CTA */}
      <StickyCTAButton
        isValid={isFormValid && !submitting}
        onClick={onSubmit}
        label={submitting ? '조회 중...' : '내 주가 보기'}
        containerBackground="#191F28"
        activeBackground="#7A38D8"
        inactiveBackground="rgba(255,255,255,0.08)"
        inactiveTextColor="rgba(255,255,255,0.35)"
        fontWeight={700}
        lineHeight="22px"
        letterSpacing="-0.4px"
      />
    </div>
  );
}
