import { supabase } from './supabase';

export type TestStatField = 'play' | 'share';

export async function incrementTestStat(testId: string, field: TestStatField) {
  await supabase.rpc('increment_test_stat', { p_test_id: testId, p_field: field });
}

export async function fetchTestStats(): Promise<Record<string, { play: number; share: number }>> {
  const { data, error } = await supabase.from('test_stats').select('test_id, play_count, share_count');
  if (error || !data) return {};

  return data.reduce<Record<string, { play: number; share: number }>>((acc, row) => {
    acc[row.test_id] = { play: row.play_count, share: row.share_count };
    return acc;
  }, {});
}

// 홈 화면 표기 규칙: 1만 이상은 "15.2만" 형태, 미만은 "8,400" 형태
export function formatStatCount(n: number): string {
  if (n >= 10000) {
    const value = Math.round((n / 10000) * 10) / 10;
    return `${value}만`;
  }
  return n.toLocaleString('ko-KR');
}
