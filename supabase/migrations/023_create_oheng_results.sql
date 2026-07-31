-- 오행 처방전 결과 테이블 (공유 링크 지원용)
CREATE TABLE oheng_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  distribution JSONB NOT NULL,
  dominant_element TEXT NOT NULL,
  dominant_ratio NUMERIC NOT NULL,
  weak_element TEXT NOT NULL,
  weak_ratio NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')
);

CREATE INDEX idx_oheng_results_created_at ON oheng_results(created_at DESC);

ALTER TABLE oheng_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read oheng results"
ON oheng_results
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert oheng results"
ON oheng_results
FOR INSERT
WITH CHECK (true);
