import { ghostTarotConfig } from './ghost-tarot.config';
import { romanceTarotConfig } from './romance-tarot.config';
import type { TarotConfig } from '@/types/tarot';

export const TAROT_CONFIGS: Record<string, TarotConfig> = {
  [ghostTarotConfig.slug]: ghostTarotConfig,
  [romanceTarotConfig.slug]: romanceTarotConfig,
};

// 서버 컴포넌트(page.tsx)는 config 객체(함수 포함)를 클라이언트 컴포넌트에 prop으로
// 직접 넘길 수 없어서(RSC 직렬화 제약) slug 문자열만 건네고, 클라이언트 쪽에서 이 함수로 조회한다.
export function getTarotConfig(slug: string): TarotConfig {
  const config = TAROT_CONFIGS[slug];
  if (!config) throw new Error(`Unknown tarot config: ${slug}`);
  return config;
}
