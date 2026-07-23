'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import loveChatBubble from '@/lottie/love-chat-bubble.json';
import TestTopNav from '@/components/TestTopNav';
import Landing from './Landing';
import Question from './Question';
import KakaoResultHeader from './KakaoResultHeader';
import ResultCard from './ResultCard';
import ShareView from './ShareView';
import CommentBoard from './CommentBoard';
import { QUESTIONS } from '@/data/questions';
import { matchCharacter } from '@/lib/matcher';
import type { Answers, Choice, LoveChatCharacter } from '@/types/love-chat';

type Step = 'landing' | 'quiz' | 'analyzing' | 'result';

interface Props {
  sharedCharacter?: LoveChatCharacter;
}

export default function LoveChatClient({ sharedCharacter }: Props) {
  const [step, setStep] = useState<Step>(sharedCharacter ? 'result' : 'landing');
  const [answers, setAnswers] = useState<Answers>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [character, setCharacter] = useState<LoveChatCharacter | null>(sharedCharacter ?? null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const currentQuestion = QUESTIONS[questionIndex];

  useEffect(() => {
    if (step !== 'analyzing') return;
    const timer = setTimeout(() => {
      const result = matchCharacter(answers);
      setCharacter(result.character);
      setStep('result');
    }, 1400);
    return () => clearTimeout(timer);
  }, [step, answers]);

  const handleStart = useCallback(() => {
    setStep('quiz');
    setQuestionIndex(0);
    setAnswers({});
  }, []);

  const handleAnswer = useCallback((choice: Choice) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
    if (questionIndex + 1 < QUESTIONS.length) {
      setDirection(1);
      setQuestionIndex(prev => prev + 1);
    } else {
      setStep('analyzing');
    }
  }, [currentQuestion, questionIndex]);

  const handleReset = useCallback(() => {
    setAnswers({});
    setQuestionIndex(0);
    setCharacter(null);
    setStep('landing');
  }, []);

  const handleQuizBack = useCallback(() => {
    if (questionIndex === 0) {
      handleReset();
    } else {
      setDirection(-1);
      setQuestionIndex(prev => prev - 1);
    }
  }, [questionIndex, handleReset]);

  const analyzingMessages = useMemo(
    () => ['카톡 습관을 분석하는 중...', '연락 패턴을 비교하는 중...', '가장 닮은 캐릭터를 찾는 중...'],
    []
  );

  return (
    <div style={{ background: '#F5F8FD', minHeight: '100dvh', fontFamily: "'Ongeulip Minmi', sans-serif", fontWeight: 500 }}>
      <div className="w-full" style={{ maxWidth: '768px', margin: '0 auto', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {step === 'landing' && <Landing key="landing" onStart={handleStart} />}

          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <TestTopNav bgColor="rgb(245, 248, 253)" logoColor="#1C2333" />
              <KakaoResultHeader onBack={handleQuizBack} />
              <div style={{ minHeight: '100dvh', background: '#D1E0F5', padding: '24px 16px 32px' }}>
                <div className="flex" style={{ gap: '4px', marginBottom: '8px' }}>
                  {QUESTIONS.map((_, i) => {
                    const segment = i + 1;
                    const filled = segment <= questionIndex + 1;
                    return (
                      <div
                        key={segment}
                        style={{ flex: 1, height: '8px', borderRadius: '999px', background: '#FFFFFF', overflow: 'hidden' }}
                      >
                        {filled && (
                          <motion.div
                            initial={segment === questionIndex + 1 ? { scaleX: 0 } : false}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{ height: '100%', width: '100%', borderRadius: '999px', background: '#3D6FE0', transformOrigin: 'left' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <p
                  style={{
                    width: `calc((100% - ${(QUESTIONS.length - 1) * 4}px) / ${QUESTIONS.length})`,
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#3D6FE0',
                    textAlign: 'center',
                    marginTop: '2px',
                    marginBottom: '22px',
                  }}
                >
                  {questionIndex + 1} / {QUESTIONS.length}
                </p>

                <AnimatePresence mode="wait" custom={direction}>
                  <Question key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} direction={direction} />
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnalyzingScreen
                messages={analyzingMessages}
                animationData={loveChatBubble}
                messageColor="#333333"
                messageFontSize="21px"
                minHeight="100dvh"
              />
            </motion.div>
          )}

          {step === 'result' && character && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.9 }}
              style={{ minHeight: '100dvh', background: '#D1E0F5' }}
            >
              <TestTopNav bgColor="rgb(245, 248, 253)" logoColor="#1C2333" />
              <KakaoResultHeader onBack={handleReset} />
              <div style={{ padding: '0px' }}>
                <ResultCard ref={cardRef} character={character} />
                <div style={{ marginTop: '16px', padding: '0 16px' }}>
                  <ShareView character={character} cardRef={cardRef} onReset={handleReset} />
                </div>
                <div style={{ marginTop: '16px', padding: '0 16px 80px' }}>
                  <CommentBoard />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
