import { ghostTarotConfig } from './ghost-tarot.config';
import { romanceTarotConfig } from './romance-tarot.config';
import type { TarotConfig } from '@/types/tarot';

export const TAROT_CONFIGS: Record<string, TarotConfig> = {
  [ghostTarotConfig.slug]: ghostTarotConfig,
  [romanceTarotConfig.slug]: romanceTarotConfig,
};

export function getTarotConfig(slug: string): TarotConfig {
  const config = TAROT_CONFIGS[slug];
  if (!config) throw new Error(`Unknown tarot config: ${slug}`);
  return config;
}
