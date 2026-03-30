-- ─── Phase 2: 영안실 안치 + 통계 뷰 ─────────────────────

-- anon 유저가 is_archived만 업데이트 가능
CREATE POLICY "Anyone can archive autopsies"
  ON saju_autopsies FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- ─── 영안실 통계 뷰 ──────────────────────────────────
CREATE OR REPLACE VIEW autopsy_morgue_stats AS
SELECT
  target_saju_type,
  COUNT(*) AS victim_count,
  jsonb_agg(
    jsonb_build_object('cause', cause_of_death_label, 'count', cause_count)
    ORDER BY cause_count DESC
  ) FILTER (WHERE rn <= 3) AS top_causes
FROM (
  SELECT
    target_saju_type,
    cause_of_death_label,
    COUNT(*) AS cause_count,
    ROW_NUMBER() OVER (PARTITION BY target_saju_type ORDER BY COUNT(*) DESC) AS rn
  FROM saju_autopsies
  WHERE is_archived = true
  GROUP BY target_saju_type, cause_of_death_label
) sub
GROUP BY target_saju_type;
