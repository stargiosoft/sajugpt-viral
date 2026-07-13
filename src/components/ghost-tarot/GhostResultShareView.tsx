'use client';

import { useRouter } from 'next/navigation';

import GhostResultCard from './GhostResultCard';
import TestTopNav from '@/components/TestTopNav';
import type { GhostResult } from '@/types/ghost-tarot';

interface Props {
  result: GhostResult;
}

export default function GhostResultShareView({ result }: Props) {
  const router = useRouter();

  return (
    <>
      <TestTopNav bgColor="rgba(2, 2, 3, 0.55)" />
      <GhostResultCard
        card={{ id: result.id, card_name: result.card_name, front_image: result.front_image }}
        result={result}
        onReset={() => router.push('/ghost-tarot')}
      />
    </>
  );
}
