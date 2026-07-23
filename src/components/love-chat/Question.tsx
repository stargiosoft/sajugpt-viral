'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Choice, Question as QuestionType } from '@/types/love-chat';

interface Props {
  question: QuestionType;
  onAnswer: (choice: Choice) => void;
  direction?: number;
}

const variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: -direction * 32 }),
};

export default function Question({ question, onAnswer, direction = 1 }: Props) {
  return (
    <motion.div
      key={question.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #E3EBFA',
          borderRadius: '20px',
          padding: '20px',
          paddingBottom: '36px',
          marginBottom: '100px',
        }}
      >
        <div className="flex flex-col items-center" style={{ marginBottom: '8px' }}>
          <Image
            src={question.sticker}
            alt=""
            width={340}
            height={340}
            style={{ flexShrink: 0, height: '180px', width: 'auto', maxWidth: '100%', objectFit: 'contain', marginBottom: '14px' }}
          />
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#1C2333',
              lineHeight: 1.2,
              letterSpacing: '-0.1px',
              textAlign: 'center',
              wordBreak: 'keep-all',
              maxWidth: '420px',
              textWrap: 'balance',
              whiteSpace: 'pre-line',
              fontFamily: "'Ongeulip Minmi', sans-serif",
            }}
          >
            {question.title}
          </h2>

          {question.message && (
            <div className="flex flex-col items-center" style={{ marginTop: '8px' }}>
              <div
                style={{
                  background: '#FEE500',
                  color: '#1C2333',
                  fontSize: '17px',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  whiteSpace: 'nowrap',
                  borderRadius: '4px 14px 14px 14px',
                  paddingTop: '7px',
                  paddingBottom: '5px',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                {question.message}
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1.5px dashed #D8E2F5', margin: '32px 0' }} />

        <div className="flex flex-col" style={{ gap: '4px' }}>
          {question.options.map(option => (
            <motion.button
              key={option.choice}
              type="button"
              onClick={() => onAnswer(option.choice)}
              whileTap={{ scale: 0.998 }}
              whileHover={{ background: '#EBF0FB' }}
              className="flex text-left items-start"
              style={{
                gap: '12px',
                background: '#F5F8FD',
                border: 'none',
                borderRadius: '16px',
                padding: '20px 16px',
                cursor: 'pointer',
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  flexShrink: 0,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#3D6FE0',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  paddingTop: option.choice === 'A' ? '1px' : '2px',
                  paddingLeft: option.choice === 'B' || option.choice === 'D' ? '2px' : '1px',
                }}
              >
                {option.choice}
              </span>
              <span style={{ fontSize: '17px', fontWeight: 500, color: '#26314D', lineHeight: 1.35, letterSpacing: '-0.1px' }}>
                {option.text}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
