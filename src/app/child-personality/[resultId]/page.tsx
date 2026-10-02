import type { Metadata } from 'next';
import ChildPersonalityClient from '@/components/child-personality/ChildPersonalityClient';

export function generateMetadata(): Metadata {
  return {
    title: '우리 아이 사용설명서',
    description:
      '사주로 알아보는 우리 아이의 성향과 공부 스타일',
  };
}

export default function ChildPersonalityResultPage() {
  return (
    <ChildPersonalityClient />
  );
}