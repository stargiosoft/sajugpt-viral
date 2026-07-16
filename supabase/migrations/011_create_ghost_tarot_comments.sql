-- ============================================================
-- 011: ghost_tarot_comments — 귀신타로 결과 페이지 익명 댓글 (전체 공유 게시판)
-- ============================================================

CREATE TABLE IF NOT EXISTS ghost_tarot_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content     text NOT NULL,
  client_id   text NOT NULL,          -- 브라우저 localStorage 기반 익명 식별자 (좋아요 중복/쿨다운 체크용)
  likes       integer NOT NULL DEFAULT 0,
  reports     integer NOT NULL DEFAULT 0,
  is_deleted  boolean NOT NULL DEFAULT false,  -- 관리자 소프트 삭제용 (anon은 수정 불가, service_role로만 갱신)
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT check_content_length CHECK (
    char_length(content) <= 100 AND char_length(trim(content)) > 0
  )
);

CREATE INDEX IF NOT EXISTS idx_ghost_tarot_comments_created_at ON ghost_tarot_comments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ghost_tarot_comments_likes ON ghost_tarot_comments (likes DESC);

-- RLS
ALTER TABLE ghost_tarot_comments ENABLE ROW LEVEL SECURITY;

-- anon SELECT: 삭제되지 않은 댓글만 노출
CREATE POLICY "anon_select_ghost_tarot_comments"
  ON ghost_tarot_comments FOR SELECT
  TO anon
  USING (is_deleted = false);

-- anon INSERT: 내용 길이 제약만 서버에서 재검증 (프론트 검증 우회 방지)
CREATE POLICY "anon_insert_ghost_tarot_comments"
  ON ghost_tarot_comments FOR INSERT
  TO anon
  WITH CHECK (
    char_length(content) <= 100 AND char_length(trim(content)) > 0
  );

-- anon UPDATE/DELETE 정책 없음 — 좋아요/신고는 아래 RPC로만, 삭제는 service_role(관리자)로만 가능

-- 좋아요 증가 (RPC — anon이 임의 컬럼을 직접 UPDATE하지 못하도록 함수로만 허용)
CREATE OR REPLACE FUNCTION increment_ghost_tarot_comment_likes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE ghost_tarot_comments SET likes = likes + 1 WHERE id = comment_id AND is_deleted = false;
$$;

GRANT EXECUTE ON FUNCTION increment_ghost_tarot_comment_likes(uuid) TO anon;

-- 신고 증가
CREATE OR REPLACE FUNCTION report_ghost_tarot_comment(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE ghost_tarot_comments SET reports = reports + 1 WHERE id = comment_id AND is_deleted = false;
$$;

GRANT EXECUTE ON FUNCTION report_ghost_tarot_comment(uuid) TO anon;

-- ============================================================
-- 초기 시드 데이터 — 신규 방문자에게도 활성화된 커뮤니티처럼 보이도록
-- ============================================================
INSERT INTO ghost_tarot_comments (content, client_id, likes, created_at) VALUES
  ('이거 은근 재밌다.', 'seed', 2, now()),
  ('생각보다 정확해서 놀람.', 'seed', 5, now() - interval '10 minutes'),
  ('다시 해보고 싶다.', 'seed', 1, now() - interval '30 minutes'),
  ('친구랑 같이 해봤는데 결과가 다르네ㅋㅋ', 'seed', 8, now() - interval '5 minutes'),
  ('무서운데 계속 보게 된다.', 'seed', 4, now() - interval '45 minutes'),
  ('생각보다 잘 맞네.', 'seed', 12, now() - interval '17 minutes'),
  ('나만 이렇게 나온 거 아니지?', 'seed', 3, now() - interval '1 hour'),
  ('진짜 신기하네.', 'seed', 6, now() - interval '2 hours'),
  ('소름이다...', 'seed', 15, now() - interval '3 hours'),
  ('공유했더니 친구도 해봤대.', 'seed', 7, now() - interval '6 hours');
