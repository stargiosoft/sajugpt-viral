import { supabase } from '@/lib/supabase';

export interface GhostComment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  reports: number;
  parent_id: string | null;
  created_at: string;
}

export type CommentSort = 'latest' | 'likes';

/** 귀신타로/연애귀신타로/댕댕사주 댓글을 한 테이블에서 분리해서 보관하는 기준 컬럼 */
export type CommentFeatureType = 'ghost_tarot' | 'romance_tarot' | 'deang_saju';

const SELECT_COLUMNS = 'id, content, likes, dislikes, reports, parent_id, created_at';

export async function fetchComments(sort: CommentSort, featureType: CommentFeatureType): Promise<GhostComment[]> {
  const { data, error } = await supabase
    .from('ghost_tarot_comments')
    .select(SELECT_COLUMNS)
    .eq('feature_type', featureType)
    .order(sort === 'likes' ? 'likes' : 'created_at', { ascending: false })
    .limit(500);

  if (error) throw error;
  return data ?? [];
}

export async function insertComment(
  content: string,
  clientId: string,
  featureType: CommentFeatureType,
  parentId?: string,
): Promise<GhostComment> {
  const { data, error } = await supabase
    .from('ghost_tarot_comments')
    .insert({ content, client_id: clientId, feature_type: featureType, parent_id: parentId ?? null })
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function likeComment(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_ghost_tarot_comment_likes', { comment_id: id });
  if (error) throw error;
}

export async function unlikeComment(id: string): Promise<void> {
  const { error } = await supabase.rpc('decrement_ghost_tarot_comment_likes', { comment_id: id });
  if (error) throw error;
}

export async function dislikeComment(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_ghost_tarot_comment_dislikes', { comment_id: id });
  if (error) throw error;
}

export async function undislikeComment(id: string): Promise<void> {
  const { error } = await supabase.rpc('decrement_ghost_tarot_comment_dislikes', { comment_id: id });
  if (error) throw error;
}
