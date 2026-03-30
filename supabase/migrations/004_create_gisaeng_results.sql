-- 기생 시뮬레이션 결과 테이블
CREATE TABLE gisaeng_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 입력 데이터
  birthday TEXT NOT NULL,
  birth_time TEXT,
  gender TEXT NOT NULL,
  calendar_type TEXT DEFAULT 'solar',

  -- 기생 카드 (1차 Edge Function 결과)
  gisaeng_name TEXT NOT NULL,
  gisaeng_type TEXT NOT NULL,
  tier_initial TEXT,
  stats JSONB NOT NULL,
  total_charm INT NOT NULL,
  do_hwa_sal BOOLEAN DEFAULT FALSE,
  hong_yeom_sal BOOLEAN DEFAULT FALSE,
  gisaeng_card_result JSONB NOT NULL,

  -- 시뮬레이션 결과 (2차 Edge Function에서 업데이트)
  simulation_result JSONB,
  final_tier TEXT,
  monthly_salary INT,
  modern_value INT,
  final_narrative TEXT,
  seonbi_comments JSONB,

  -- 사주 원본
  saju_highlights JSONB,

  -- 메타
  status TEXT DEFAULT 'card_generated',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- 추적
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  CONSTRAINT check_gisaeng_type CHECK (
    gisaeng_type IN ('haeeohwa', 'hongryeon', 'mukran', 'chunhyang', 'wolha', 'hwangjini')
  ),
  CONSTRAINT check_final_tier CHECK (
    final_tier IS NULL OR final_tier IN ('S', 'A', 'B', 'C', 'D')
  ),
  CONSTRAINT check_gisaeng_status CHECK (
    status IN ('card_generated', 'completed')
  )
);

CREATE INDEX idx_gisaeng_results_created_at ON gisaeng_results(created_at DESC);
CREATE INDEX idx_gisaeng_results_type ON gisaeng_results(gisaeng_type);
CREATE INDEX idx_gisaeng_results_tier ON gisaeng_results(final_tier);

-- RLS: 공유 링크용 읽기 허용
ALTER TABLE gisaeng_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gisaeng results"
  ON gisaeng_results FOR SELECT TO anon USING (true);
