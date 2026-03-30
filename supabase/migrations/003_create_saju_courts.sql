-- 사주 법정 테이블
CREATE TABLE saju_courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 유저 사주 정보
  birthday TEXT NOT NULL,
  birth_time TEXT,
  gender TEXT NOT NULL,

  -- 죄목
  crime_id TEXT NOT NULL,
  crime_label TEXT NOT NULL,

  -- 점수/형량
  charm_score NUMERIC NOT NULL,
  base_sentence INT NOT NULL,
  final_sentence INT,
  period_input TEXT,
  bounty INT,
  percentile INT,

  -- 석방
  release_year INT NOT NULL,
  release_month INT NOT NULL,
  release_condition TEXT NOT NULL,

  -- 고정 텍스트 (카드용)
  prosecutor_line TEXT NOT NULL,
  defender_line TEXT NOT NULL,

  -- AI 생성 텍스트
  prosecutor_opening TEXT,
  defender_closing TEXT,
  verdict_comment TEXT,
  release_rationale TEXT,

  -- 전체 결과 JSONB
  result JSONB NOT NULL,

  -- 공범
  accomplice_crime TEXT,
  accomplice_shared BOOLEAN DEFAULT false,

  -- 재판 진행
  trial_completed BOOLEAN DEFAULT false,

  -- 메타
  status TEXT DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  trial_completed_at TIMESTAMPTZ,

  -- 추적
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- 인덱스
CREATE INDEX idx_saju_courts_crime ON saju_courts(crime_id);
CREATE INDEX idx_saju_courts_created ON saju_courts(created_at);

-- RLS
ALTER TABLE saju_courts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read courts"
  ON saju_courts FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert courts"
  ON saju_courts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update courts"
  ON saju_courts FOR UPDATE
  USING (true);

-- 월간 죄목 랭킹 뷰
CREATE OR REPLACE VIEW court_crime_stats AS
SELECT
  crime_id,
  crime_label,
  COUNT(*) AS total_count,
  ROUND(AVG(COALESCE(final_sentence, base_sentence)), 1) AS avg_sentence,
  ROUND(AVG(bounty), 0) AS avg_bounty
FROM saju_courts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY crime_id, crime_label
ORDER BY total_count DESC;
