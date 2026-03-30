'use client';

import { motion } from 'framer-motion';
import { CORONERS } from '@/constants/autopsy';
import type { CoronerId } from '@/types/autopsy';

interface Props {
  cardNumber: 1 | 2 | 3;
  title: string;
  text: string;
  coronerId: CoronerId;
  onNext: () => void;
  nextLabel?: string;
}

const CARD_TITLES: Record<number, string> = {
  1: '겉포장 분석',
  2: '해부 소견',
  3: '사망진단서 발급 준비',
};

const CARD_SUBTITLES: Record<number, string> = {
  1: '처음엔 괜찮았을 거야',
  2: '속을 열어보니까',
  3: '최종 판정',
};

export default function AutopsyCard({ cardNumber, title, text, coronerId, onNext, nextLabel }: Props) {
  const coroner = CORONERS.find(c => c.id === coronerId)!;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col"
      style={{ padding: '48px 20px 120px', minHeight: '100dvh' }}
    >
      {/* 카드 번호 */}
      <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#7A38D8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{cardNumber}</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#7A38D8', letterSpacing: '1px' }}>
          {CARD_TITLES[cardNumber]}
        </span>
      </div>

      {/* 제목 */}
      <h2 style={{
        fontSize: '24px',
        fontWeight: 800,
        color: '#222',
        marginBottom: '24px',
        letterSpacing: '-0.5px',
        lineHeight: '1.3',
      }}>
        {CARD_SUBTITLES[cardNumber]}
      </h2>

      {/* 카드 본문 */}
      <div style={{
        backgroundColor: '#F7F2FA',
        borderRadius: '16px',
        padding: '24px 20px',
        marginBottom: '24px',
        border: '1px solid #E8D5F5',
      }}>
        {/* 검시관 아바타 */}
        <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>{coroner.emoji}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#7A38D8' }}>
            {coroner.name} 검시관
          </span>
        </div>

        <p style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#333',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
        }}>
          {text}
        </p>
      </div>

      {/* 하단 버튼 */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10"
        style={{
          maxWidth: '440px',
          backgroundColor: '#fff',
          boxShadow: '0px -8px 16px 0px rgba(255,255,255,0.76)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ padding: '12px 20px' }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="transform-gpu"
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#7A38D8',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.32px',
            }}
          >
            {nextLabel ?? (cardNumber < 3 ? '다음' : '사망진단서 확인하기')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
