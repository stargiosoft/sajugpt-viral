-- ─── 부검 결과 테이블 ─────────────────────────────────
CREATE TABLE saju_autopsies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 상대 (부검 대상) 사주 정보
  target_birthday TEXT NOT NULL,
  target_birth_time TEXT,
  target_gender TEXT NOT NULL,

  -- 입력 선택지
  cause_of_death_input TEXT NOT NULL,
  relationship_duration TEXT NOT NULL,
  coroner_id TEXT NOT NULL,

  -- 부검 결과
  cause_of_death TEXT NOT NULL,
  cause_of_death_label TEXT NOT NULL,
  discernment_grade TEXT NOT NULL,
  regret_probability NUMERIC NOT NULL,
  prognosis TEXT NOT NULL,

  -- Gemini 생성 텍스트
  card1_text TEXT NOT NULL,
  card2_text TEXT NOT NULL,
  card3_verdict TEXT NOT NULL,

  -- 전체 결과 JSONB
  result JSONB NOT NULL,

  -- 영안실 관련
  target_saju_type TEXT,
  is_archived BOOLEAN DEFAULT false,

  -- 메타
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 추적
  utm_source TEXT,
  utm_medium TEXT
);

CREATE INDEX idx_saju_autopsies_created_at ON saju_autopsies(created_at DESC);
CREATE INDEX idx_saju_autopsies_saju_type ON saju_autopsies(target_saju_type) WHERE is_archived = true;
CREATE INDEX idx_saju_autopsies_cause ON saju_autopsies(cause_of_death);

-- RLS
ALTER TABLE saju_autopsies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read autopsies"
  ON saju_autopsies FOR SELECT
  TO anon
  USING (true);
