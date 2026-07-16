-- ============================================================
-- 012: ghost_tarot_comments — 답글(단일 depth) + 좋아요/싫어요 지원
-- ============================================================

ALTER TABLE ghost_tarot_comments
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES ghost_tarot_comments(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS dislikes integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_ghost_tarot_comments_parent_id ON ghost_tarot_comments (parent_id);

-- 싫어요 증가 (좋아요와 동일한 SECURITY DEFINER RPC 패턴)
CREATE OR REPLACE FUNCTION increment_ghost_tarot_comment_dislikes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE ghost_tarot_comments SET dislikes = dislikes + 1 WHERE id = comment_id AND is_deleted = false;
$$;

GRANT EXECUTE ON FUNCTION increment_ghost_tarot_comment_dislikes(uuid) TO anon;
