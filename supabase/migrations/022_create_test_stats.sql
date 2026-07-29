-- ============================================================
-- 022: test_stats — 홈 화면 테스트 카드/랭킹에 표시되는 플레이 수·공유 수
-- 실제 완료/공유 이벤트가 발생할 때마다 increment_test_stat RPC로만 증가시키고,
-- anon은 직접 UPDATE할 수 없다 (SECURITY DEFINER 함수를 통해서만 증가).
-- ============================================================

CREATE TABLE IF NOT EXISTS test_stats (
  test_id     text PRIMARY KEY,
  play_count  bigint NOT NULL DEFAULT 0,
  share_count bigint NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE test_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_test_stats"
  ON test_stats FOR SELECT
  TO anon
  USING (true);

CREATE OR REPLACE FUNCTION increment_test_stat(p_test_id text, p_field text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_field NOT IN ('play', 'share') THEN
    RAISE EXCEPTION 'invalid field: %', p_field;
  END IF;

  INSERT INTO test_stats (test_id, play_count, share_count)
  VALUES (
    p_test_id,
    CASE WHEN p_field = 'play' THEN 1 ELSE 0 END,
    CASE WHEN p_field = 'share' THEN 1 ELSE 0 END
  )
  ON CONFLICT (test_id) DO UPDATE SET
    play_count = test_stats.play_count + CASE WHEN p_field = 'play' THEN 1 ELSE 0 END,
    share_count = test_stats.share_count + CASE WHEN p_field = 'share' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION increment_test_stat(text, text) TO anon;

-- 홈 화면에 이미 노출 중이던 베이스라인 숫자로 시드 — 이후로는 실제 이용자 발생 이벤트만큼만 증가
INSERT INTO test_stats (test_id, play_count, share_count) VALUES
  ('ghost-tarot', 152000, 11000),
  ('romance-ghost-tarot', 8400, 940),
  ('deang-saju', 6700, 810),
  ('love-chat', 5200, 690),
  ('money-timeline', 3900, 510)
ON CONFLICT (test_id) DO NOTHING;
