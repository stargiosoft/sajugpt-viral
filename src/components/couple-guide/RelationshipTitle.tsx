'use client';

import { motion } from 'framer-motion';
import { COUPLE_COLORS as C, FADE_UP } from '@/constants/coupleGuideTheme';

interface Props {
  title: string;
  subtitle: string;
  // hashtags를 선택적 속성으로 변경
  hashtags?: string[]; 
}

// 매개변수에서 기본값 []을 지정합니다.
export default function RelationshipTitle({ title, subtitle, hashtags = [] }: Props) {
  return (
    <motion.div
      variants={FADE_UP as any}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center"
      style={{ textAlign: 'center', padding: '4px 12px' }}
    >
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{title}</h2>
      <p style={{ marginTop: '6px', fontSize: '14px', color: C.textTertiary }}>{subtitle}</p>

      {/* 이제 안전합니다 */}
      {hashtags.length > 0 && (
        <div
          style={{
            marginTop: '14px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {hashtags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: C.primary,
                backgroundColor: C.primaryDim,
                borderRadius: '999px',
                padding: '6px 12px',
              }}
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}