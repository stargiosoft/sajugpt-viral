'use client';

import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import { trackEvent, trackSajuGPTClick } from '@/lib/analytics';
import { MONEY_COLORS as C, BODY_TEXT_STYLE } from '@/constants/moneyTimelineTheme';

interface Props {
  resultId: string;
}

export default function MoneyCTA({ resultId }: Props) {
  return (
    <div style={{ position: 'relative', borderRadius: '20px', padding: '2px', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '250%',
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, ease: 'linear', repeat: Infinity }}
          style={{
            width: '100%',
            height: '100%',
            background: `conic-gradient(from 0deg, transparent 0%, transparent 82%, ${C.gold} 92%, transparent 100%)`,
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          borderRadius: '18px',
          backgroundColor: C.panelBg,
          boxShadow: '0 8px 24px rgba(124, 92, 252, 0.16)',
          padding: '24px 20px',
          textAlign: 'center',
        }}
      >
      <div style={{ width: '82px', margin: '0 auto 14px' }}>
        <motion.img
          src="/money-timeline/piggy-bank.png"
          alt=""
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '82px', height: '82px', display: 'block' }}
        />
        <motion.div
          animate={{ scaleX: [1, 0.78, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '52px',
            height: '10px',
            margin: '2px auto 0',
            borderRadius: '50%',
            background: 'rgb(225, 225, 225)',
          }}
        />
      </div>
      <p style={{ ...BODY_TEXT_STYLE, marginBottom: '18px' }}>
        <span style={{ display: 'block' }}>재물운은 시작일 뿐이에요.</span>
        <span style={{ display: 'block', marginTop: '8px', fontSize: '16.5px', WebkitTextStroke: '0.4px rgb(33, 33, 33)' }}>내 사주 전체를 심층 분석 받아보세요</span>
      </p>
      <PressableButton
        href="https://www.sajugpt.co.kr/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent('money_timeline_cta_click');
          trackSajuGPTClick('money_timeline', resultId);
        }}
        label="사주GPT로 더 알아보기"
        style={{ height: '56px' }}
        bgStyle={{ backgroundColor: C.gold, borderRadius: '16px', border: 'none' }}
        hoverBackground={C.goldHover}
        textStyle={{ color: C.textOnGold, fontWeight: 500, fontSize: '16px', letterSpacing: '-0.32px', WebkitTextStroke: `0.5px ${C.textOnGold}` }}
      />
      </div>
    </div>
  );
}
