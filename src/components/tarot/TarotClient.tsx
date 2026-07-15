'use client';

import { useCallback, useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

import TarotLanding from './TarotLanding';
import TarotCardSelection from './TarotCardSelection';
import TarotResultCard from './TarotResultCard';
import TestTopNav from '@/components/TestTopNav';
import { supabase } from '@/lib/supabase';
import { getTarotConfig } from '@/lib/tarot/configs';
import type { TarotCardData, TarotResult } from '@/types/tarot';

type Step = 'landing' | 'selection' | 'result';

interface Props {
  slug: string;
  resultId?: string;
}

export default function TarotClient({ slug, resultId }: Props) {
  const config = getTarotConfig(slug);
  const [step, setStep] = useState<Step>('landing');
  const [cards, setCards] = useState<TarotCardData[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);
  const [result, setResult] = useState<TarotResult | null>(null);
  const [resultError, setResultError] = useState(false);

  const searchParams = useSearchParams();
  const isModeOverride = Boolean(config.modeOverridePool) && searchParams.get('mode') === '5';

  const fetchCards = useCallback(async () => {
    setCardsLoading(true);
    let query = supabase
      .from(config.table)
      .select('id, card_name, front_image')
      .limit(15);
    if (config.cardPool) {
      query = query.in('id', config.cardPool);
    }
    const { data, error } = await query;

    if (error) {
      setCards(config.fallbackCards);
      setCardsLoading(false);
      return;
    }

    setCards(data ?? []);
    setCardsLoading(false);
  }, [config.table, config.fallbackCards, config.cardPool]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (!resultId) return;

    const fetchSharedResult = async () => {
      try {
        const { data, error } = await supabase
          .from(config.table)
          .select('*')
          .eq('id', resultId)
          .single();

        if (error) throw error;

        if (data) {
          setSelectedCard(data as TarotCardData);
          setResult({ ...(data as TarotCardData), ...config.toResultContent(data), created_at: data.created_at } as TarotResult);
          setStep('result');
        }
      } catch (err) {
        console.error('❌ 공유 결과 불러오기 실패:', err);
      }
    };

    fetchSharedResult();
  }, [resultId, config]);

  const handleCardSelect = useCallback(async (cardId: string) => {
    let targetCardId = cardId;
    let card = cards.find(item => item.id === targetCardId);

    // ?mode=5 레거시 A/B 훅 — modeOverridePool이 설정된 타로에서만 동작(예: 귀신타로)
    if (isModeOverride && config.modeOverridePool) {
      const totalPool = [...cards, ...config.fallbackCards];
      const filteredPool = totalPool.filter(item => config.modeOverridePool!.includes(item.id));
      const finalPool = filteredPool.filter((item, index, self) =>
        self.findIndex(t => t.id === item.id) === index
      );

      if (finalPool.length > 0) {
        const randomFakeCard = finalPool[Math.floor(Math.random() * finalPool.length)];
        targetCardId = randomFakeCard.id;
        card = randomFakeCard;
      }
    }

    if (!card) {
      console.error('선택 카드 없음');
      return;
    }

    setSelectedCard(card);
    setResult(null);
    setResultError(false);
    setStep('result');

    try {
      const { data, error } = await supabase
        .from(config.table)
        .select('*')
        .eq('id', targetCardId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setResultError(true);
        return;
      }

      setResult({ ...(data as TarotCardData), ...config.toResultContent(data), created_at: data.created_at } as TarotResult);
    } catch (e) {
      console.error('카드 조회 실패:', e);
      setResultError(true);
    }
  }, [cards, isModeOverride, config]);

  const handleReset = useCallback(() => {
    setSelectedCard(null);
    setResult(null);
    setResultError(false);
    setStep('landing');
  }, []);

  const handleBack = step === 'selection'
    ? () => setStep('landing')
    : step === 'result'
      ? handleReset
      : undefined;

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center" style={{ height: '100dvh', background: config.theme.palette.bg }}>
      <div className="w-full h-full flex flex-col max-w-[440px] md:max-w-[600px]">
        <div className="flex-1 overflow-auto">
          <TestTopNav bgColor="rgba(7, 5, 11, 0.55)" onBack={handleBack} />
          <AnimatePresence mode="wait">
            {step === 'landing' && (
              <TarotLanding key="landing" config={config} onStart={() => setStep('selection')} />
            )}
            {step === 'selection' && (
              <TarotCardSelection key="selection" config={config} cards={cards} loading={cardsLoading} onSelect={handleCardSelect} />
            )}
            {step === 'result' && selectedCard && (
              <TarotResultCard key="result" config={config} card={selectedCard} result={result} error={resultError} onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
