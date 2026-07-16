-- ============================================================
-- 013: ghost_tarot_comments — 좋아요/싫어요 다시 누르면 취소(감소) 가능하도록 RPC 추가
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_ghost_tarot_comment_likes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE ghost_tarot_comments SET likes = GREATEST(likes - 1, 0) WHERE id = comment_id AND is_deleted = false;
$$;

GRANT EXECUTE ON FUNCTION decrement_ghost_tarot_comment_likes(uuid) TO anon;

CREATE OR REPLACE FUNCTION decrement_ghost_tarot_comment_dislikes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE ghost_tarot_comments SET dislikes = GREATEST(dislikes - 1, 0) WHERE id = comment_id AND is_deleted = false;
$$;

GRANT EXECUTE ON FUNCTION decrement_ghost_tarot_comment_dislikes(uuid) TO anon;
