-- ============================================================
-- 014: ghost_tarot_comments — 귀신타로/연애귀신타로 댓글을 feature_type으로 분리
-- ============================================================

ALTER TABLE ghost_tarot_comments
  ADD COLUMN IF NOT EXISTS feature_type text NOT NULL DEFAULT 'ghost_tarot';

ALTER TABLE ghost_tarot_comments
  ADD CONSTRAINT check_ghost_tarot_comments_feature_type
  CHECK (feature_type IN ('ghost_tarot', 'romance_tarot'));

CREATE INDEX IF NOT EXISTS idx_ghost_tarot_comments_feature_type ON ghost_tarot_comments (feature_type);

-- ============================================================
-- 연애귀신타로 전용 시드 댓글 10개
-- ============================================================
INSERT INTO ghost_tarot_comments (content, client_id, feature_type, likes, created_at) VALUES
  ('이거 은근 재밌다.', 'seed', 'romance_tarot', 3, now()),
  ('생각보다 정확해서 놀람.', 'seed', 'romance_tarot', 6, now() - interval '10 minutes'),
  ('다시 해보고 싶다.', 'seed', 'romance_tarot', 2, now() - interval '30 minutes'),
  ('친구랑 같이 해봤는데 결과가 다르네ㅋㅋ', 'seed', 'romance_tarot', 9, now() - interval '5 minutes'),
  ('무서운데 계속 보게 된다.', 'seed', 'romance_tarot', 5, now() - interval '45 minutes'),
  ('생각보다 잘 맞네.', 'seed', 'romance_tarot', 13, now() - interval '17 minutes'),
  ('나만 이렇게 나온 거 아니지?', 'seed', 'romance_tarot', 4, now() - interval '1 hour'),
  ('진짜 신기하네.', 'seed', 'romance_tarot', 7, now() - interval '2 hours'),
  ('소름이다...', 'seed', 'romance_tarot', 16, now() - interval '3 hours'),
  ('공유했더니 친구도 해봤대.', 'seed', 'romance_tarot', 8, now() - interval '6 hours');
