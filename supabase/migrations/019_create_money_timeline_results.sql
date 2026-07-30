-- ============================================================
-- 019: money_timeline_results — 내 돈복 그래프 결과 저장 + viral_events feature_type 추가
-- ============================================================

CREATE TABLE money_timeline_results (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_code          TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  gender              TEXT NOT NULL,
  birth_date          TEXT NOT NULL,
  birth_time          TEXT,
  calendar_type       TEXT NOT NULL DEFAULT 'solar',
  overall_score       SMALLINT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  best_period_label   TEXT NOT NULL,
  money_style_title   TEXT NOT NULL,
  result              JSONB NOT NULL,
  stargio_raw         JSONB NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')
);

CREATE INDEX idx_money_timeline_results_created_at ON money_timeline_results(created_at DESC);

ALTER TABLE money_timeline_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read money timeline results"
ON money_timeline_results
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert money timeline results"
ON money_timeline_results
FOR INSERT
WITH CHECK (true);

-- viral_events feature_type 허용 목록에 money_timeline 추가
ALTER TABLE viral_events DROP CONSTRAINT check_feature_type;
ALTER TABLE viral_events ADD CONSTRAINT check_feature_type
  CHECK (feature_type IN ('sexy_battle', 'saju_autopsy', 'saju_court', 'gisaeng', 'night_manual', 'dating', 'saju_stock', 'ghost_tarot', 'romance_tarot', 'deang_saju', 'love_chat', 'red_flag', 'mental_worldcup', 'money_timeline'));
