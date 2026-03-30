'use client';

import { motion, type Variants } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { RelationshipStatus } from '@/types/stock';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';
import { RELATIONSHIP_STATUSES } from '@/constants/stock';

interface Props {
  birthDate: string;
  setBirthDate: (v: string) => void;
  birthTime: string;
  setBirthTime: (v: string) => void;
  unknownTime: boolean;
  onUnknownTimeToggle: () => void;
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
  setBirthTime,
  unknownTime,
  onUnknownTimeToggle,
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
        maxWidth: '440px',
        margin: '0 auto',
        minHeight: '100dvh',
        backgroundColor: '#0a0a14',
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
        <p
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#7A38D8',
            letterSpacing: '-0.3px',
            marginBottom: '8px',
          }}
        >
          사주증권 리서치센터
        </p>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.6px',
            lineHeight: '34px',
            marginBottom: '8px',
          }}
        >
          연애 시장 내 값어치는?
        </h1>
        <p
          style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#888888',
            letterSpacing: '-0.3px',
            lineHeight: '22px',
          }}
        >
          사주증권 리서치센터가 당신의 연애 주가를 조회합니다
        </p>
      </motion.div>

      {/* Birth Date */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '20px' }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#cccccc',
            letterSpacing: '-0.3px',
            marginBottom: '8px',
          }}
        >
          생년월일
        </p>
        <div className="stock-input-wrapper">
          <BirthInput value={birthDate} onChange={setBirthDate} />
        </div>
      </motion.div>

      {/* Gender */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '20px' }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#cccccc',
            letterSpacing: '-0.3px',
            marginBottom: '8px',
          }}
        >
          성별
        </p>
        <GenderSelect value={gender} onChange={setGender} />
      </motion.div>

      {/* Birth Time */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{ marginBottom: '20px' }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#cccccc',
            letterSpacing: '-0.3px',
            marginBottom: '8px',
          }}
        >
          태어난 시간
        </p>
        <BirthTimeInput
          value={birthTime}
          onChange={setBirthTime}
          unknownTime={unknownTime}
          onUnknownTimeToggle={onUnknownTimeToggle}
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
            fontSize: '14px',
            fontWeight: 600,
            color: '#cccccc',
            letterSpacing: '-0.3px',
            marginBottom: '8px',
          }}
        >
          연애 상태
        </p>
        <div
          className="overflow-hidden isolate"
          style={{ backgroundColor: '#1a1a2e', borderRadius: '16px', padding: '8px' }}
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
                    color: relationshipStatus === status.id ? '#ffffff' : '#666666',
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
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#ef4444', lineHeight: '20px' }}>
            {error}
          </p>
        </motion.div>
      )}

      {/* Fixed Bottom CTA */}
      <div
        className="fixed left-0 right-0"
        style={{
          bottom: 0,
          zIndex: 50,
          padding: '12px 20px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          backgroundColor: 'rgba(10, 10, 20, 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <motion.button
            type="button"
            onClick={onSubmit}
            disabled={!isFormValid || submitting}
            whileTap={isFormValid && !submitting ? { scale: 0.97 } : {}}
            className="w-full"
            style={{
              height: '56px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: isFormValid && !submitting ? '#7A38D8' : '#2a2a3e',
              color: isFormValid && !submitting ? '#ffffff' : '#555555',
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '-0.4px',
              cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s, color 0.2s',
            }}
          >
            {submitting ? '조회 중...' : '시세 조회'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
