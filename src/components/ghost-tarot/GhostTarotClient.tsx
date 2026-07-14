'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { AnimatePresence } from 'framer-motion';

import GhostLanding from './GhostLanding';
import CardSelection from './CardSelection';
import GhostResultCard from './GhostResultCard';
import TestTopNav from '@/components/TestTopNav';
import { supabase } from '@/lib/supabase';
import { GHOST_PALETTE } from '@/lib/ghost-tarot/theme';
import type { GhostCardData, GhostResult } from '@/types/ghost-tarot';

const FALLBACK_GHOST_CARDS: GhostCardData[] = [
  { id: '04d178fa-712d-4007-80a2-43a7d9bcb433', card_name: '업신 (숨겨진 조력자)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/30_Eopsin.webp' },
  { id: '2f461c81-e47f-4e04-a018-6ce0b6d1d735', card_name: '창귀 (호랑이의 앞잡이)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/08_Changgwi.webp' },
  { id: '3164e13f-74c3-4b93-9b89-f9bccde68644', card_name: '강림도령 (降臨都令)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/01_Ganglim.webp' },
  { id: '5a4cfc5e-7e62-488c-86de-ab870a72a321', card_name: '해원상생 (축제의 굿판)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/36_Sangsaeng.webp' },
  { id: '7108a8c7-0074-4974-b86c-b3492ea7b878', card_name: '당산나무 (절대 안전 구역)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/26_Dangsan.webp' },
  { id: '819edd7e-8c08-48ed-9a31-d579d8828594', card_name: '환생꽃 (새로운 피어남)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/31_RebirthFlower.webp' },
  { id: 'a670073e-f949-491c-ab8d-a2a4fb197795', card_name: '손각시 (집착의 굴레)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/09_Songaksi.webp' },
  { id: 'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6', card_name: '악귀 (원한의 형상)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/07_Akgwi.webp' },
  { id: 'e10f5ea5-ccdc-4cbc-9afb-c03fa5452fdf', card_name: '도깨비 (어둠의 브로커)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/06_Dokkaebi.webp' },
  { id: 'f79b6cec-4829-47df-9aa7-84a41312f69c', card_name: '생명수 (바리공주의 약수)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/25_LifeWater.webp' }
];

type Step = 'landing' | 'selection' | 'result';

interface Props {
  resultId?: string;
}

export default function GhostTarotClient({ resultId }: Props) {
  const [step, setStep] = useState<Step>('landing');
  const [cards, setCards] = useState<GhostCardData[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<GhostCardData | null>(null);
  const [result, setResult] = useState<GhostResult | null>(null);
  const [resultError, setResultError] = useState(false);

  const fetchCards = async () => {
  const { data, error } = await supabase
    .from('ghost_tarot_results')
    .select(`
      id,
      card_name,
      front_image
    `)
    .limit(10);

  if (error) {
    setCards(FALLBACK_GHOST_CARDS);
    setCardsLoading(false);
    return;
  }

  setCards(data ?? []);
  setCardsLoading(false);
};

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (!resultId) return;

    const fetchSharedResult = async () => {
      try {
        const { data, error } = await supabase
          .from('ghost_tarot_results')
          .select('*')
          .eq('id', resultId)
          .single();

        if (error) throw error;

        if (data) {
          setSelectedCard(data as GhostCardData);
          setResult(data as GhostResult);
          setStep('result');
        }
      } catch (err) {
        console.error('❌ 공유 결과 불러오기 실패:', err);
      }
    };

    fetchSharedResult();
  }, [resultId]);

  const handleCardSelect = useCallback(async (cardId: string) => {
    const card = cards.find(item => item.id === cardId);

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
        .from('ghost_tarot_results')
        .select('*')
        .eq('id', cardId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setResultError(true);
        return;
      }

      setResult(data as GhostResult);
    } catch (e) {
      console.error('귀신 카드 조회 실패:', e);
      setResultError(true);
    }
  }, [cards]);

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
    <div className="fixed top-0 left-0 right-0 flex justify-center" style={{ height: '100dvh', background: GHOST_PALETTE.bg }}>
      <div className="w-full h-full flex flex-col max-w-[440px] md:max-w-[600px]">
        <div className="flex-1 overflow-auto">
          <TestTopNav bgColor="rgba(7, 5, 11, 0.55)" onBack={handleBack} />
          <AnimatePresence mode="wait">
            {step === 'landing' && (
              <GhostLanding key="landing" onStart={() => setStep('selection')} />
            )}
            {step === 'selection' && (
              <CardSelection key="selection" cards={cards} loading={cardsLoading} onSelect={handleCardSelect} />
            )}
            {step === 'result' && selectedCard && (
              <GhostResultCard key="result" card={selectedCard} result={result} error={resultError} onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}