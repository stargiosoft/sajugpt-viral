'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { MoneyTimelineProfile } from '@/types/money-timeline';
import InsightCard from './InsightCard';
import TimelineChart, { GoldenEraCard } from './TimelineChart';
import MoneyStyleCard from './MoneyStyleCard';
import { MONEY_COLORS as C, FADE_UP } from '@/constants/moneyTimelineTheme';

interface Props {
  profile: MoneyTimelineProfile;
}

const MoneyResultCard = forwardRef<HTMLDivElement, Props>(({ profile }, ref) => {
  return (
    <motion.div
      ref={ref}
      className="transform-gpu flex flex-col"
      style={{
        backgroundColor: C.cardBgGradient,
        borderRadius: '24px',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(124, 92, 252, 0.16)',
      }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={FADE_UP}>
        <MoneyStyleCard moneyStyle={profile.moneyStyle} />
      </motion.div>
      <div style={{ height: '10px' }} />
      <motion.div variants={FADE_UP}>
        <InsightCard overallScore={profile.overallScore} summaryLine={profile.summaryLine} bestAgeLabel={profile.bestPeriod.ageLabel} />
      </motion.div>
      <div style={{ borderTop: '1px dashed rgb(229, 227, 249)' }} />
      <motion.div variants={FADE_UP}>
        <TimelineChart periods={profile.periods} />
      </motion.div>
      <div style={{ borderTop: '1px dashed rgb(229, 227, 249)' }} />
      <motion.div variants={FADE_UP}>
        <GoldenEraCard bestPeriod={profile.bestPeriod} />
      </motion.div>
    </motion.div>
  );
});

MoneyResultCard.displayName = 'MoneyResultCard';

export default MoneyResultCard;
