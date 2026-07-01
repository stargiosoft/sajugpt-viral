import type { TestCategory } from '@/types/testCatalog';

export interface CategoryMeta {
  key: TestCategory;
  label: string;
  emoji: string;
}

// 기존 4종 카테고리(love/analysis/money/sim) 그대로 재사용
export const CATEGORIES: CategoryMeta[] = [
  { key: 'love', label: '연애', emoji: '❤️' },
  { key: 'analysis', label: '분석', emoji: '🔍' },
  { key: 'money', label: '재물', emoji: '💰' },
  { key: 'sim', label: '시뮬레이션', emoji: '🎮' },
];
