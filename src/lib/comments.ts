import { supabase } from '@/lib/supabase';
import type { FeatureType } from '@/lib/analytics';

// 여러 테스트가 공유하는 방명록형 댓글 테이블 (feature_type으로 구분) — 귀신타로에서 처음 만들어졌고
// deang_saju/love_chat도 같은 테이블을 재사용한다. RPC 이름은 ghost_tarot_ 접두어지만 comment_id만 받아 범용으로 동작한다.
const TABLE = 'ghost_tarot_comments';

export interface CommentEntry {
  id: string;
  content: string;
  client_id: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

export async function fetchComments(featureType: FeatureType, limit = 30): Promise<CommentEntry[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, content, client_id, likes, dislikes, created_at')
    .eq('feature_type', featureType)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

export async function postComment(featureType: FeatureType, content: string, clientId: string): Promise<CommentEntry | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ feature_type: featureType, content, client_id: clientId })
    .select('id, content, client_id, likes, dislikes, created_at')
    .single();

  if (error) return null;
  return data;
}

export async function likeComment(commentId: string): Promise<void> {
  await supabase.rpc('increment_ghost_tarot_comment_likes', { comment_id: commentId });
}

export async function unlikeComment(commentId: string): Promise<void> {
  await supabase.rpc('decrement_ghost_tarot_comment_likes', { comment_id: commentId });
}
