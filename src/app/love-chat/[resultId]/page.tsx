import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LoveChatClient from '@/components/love-chat/LoveChatClient';
import { CHARACTERS, getCharacterById } from '@/data/characters';

interface Props {
  params: Promise<{ resultId: string }>;
}

export function generateStaticParams() {
  return CHARACTERS.map(character => ({ resultId: character.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;
  const character = getCharacterById(resultId);

  if (!character) {
    return { title: '카톡 연애도감 — 사주GPT' };
  }

  return {
    title: `💌 카톡 연애도감 — ${character.name}`,
    description: character.oneLiner,
    openGraph: {
      title: `나의 카톡 연애 캐릭터는 "${character.name}"`,
      description: character.oneLiner,
    },
  };
}

export default async function LoveChatResultPage({ params }: Props) {
  const { resultId } = await params;
  const character = getCharacterById(resultId);

  if (!character) {
    notFound();
  }

  return <LoveChatClient sharedCharacter={character} />;
}
