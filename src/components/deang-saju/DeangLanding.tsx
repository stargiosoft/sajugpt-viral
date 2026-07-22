'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import DeangShareRow from './DeangShareRow';
import DeangCommentSection from './DeangCommentSection';

interface Props {
  onStart: () => void;
}

export default function DeangLanding({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center"
      style={{ paddingBottom: '40px' }}
    >
      <div className="w-full" style={{ position: 'relative', aspectRatio: '1448 / 1086', boxSizing: 'border-box' }}>
        <Image
          src="/deang-saju/title-v6.png"
          alt="댕BTI — 사주로 보는 내 안의 강아지"
          fill
          priority
          sizes="(max-width: 440px) 100vw, (max-width: 768px) 440px, 600px"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="w-full flex flex-col items-center" style={{ padding: '28px 16px 0' }}>
        <div className="w-full">
          <PressableButton
            onClick={onStart}
            label={<span style={{ WebkitTextStroke: '0.3px #FFFFFF' }}>시작하기</span>}
            style={{ height: '54px' }}
            bgStyle={{ backgroundColor: '#58B889', borderRadius: '16px', border: 'none' }}
            hoverBackground="#4ba679"
            textStyle={{ color: '#FFFFFF', fontWeight: 500, fontSize: '17px', lineHeight: '24px', letterSpacing: '-0.32px' }}
          />
        </div>

        <div style={{ marginTop: '12px' }}>
          <DeangShareRow />
        </div>

        <div className="w-full" style={{ marginTop: '40px' }}>
          <DeangCommentSection />
        </div>
      </div>
    </motion.div>
  );
}
