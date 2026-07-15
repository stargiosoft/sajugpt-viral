'use client';

import { useRouter } from 'next/navigation';

import TarotResultCard from './TarotResultCard';
import TestTopNav from '@/components/TestTopNav';
import { getTarotConfig } from '@/lib/tarot/configs';
import type { TarotResult } from '@/types/tarot';

interface Props {
  slug: string;
  result: TarotResult;
}

export default function TarotResultShareView({ slug, result }: Props) {
  const config = getTarotConfig(slug);
  const router = useRouter();

  return (
    <>
      <TestTopNav bgColor="rgba(2, 2, 3, 0.55)" />
      <TarotResultCard
        config={config}
        card={{ id: result.id, card_name: result.card_name, front_image: result.front_image }}
        result={result}
        onReset={() => router.push(`/${config.slug}`)}
      />
    </>
  );
}
