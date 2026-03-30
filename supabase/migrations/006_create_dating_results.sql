-- 데이트 시뮬레이션 결과 테이블
CREATE TABLE dating_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 유저 입력
  birthday TEXT NOT NULL,
  birth_time TEXT DEFAULT '모름',
  gender TEXT NOT NULL,
  calendar_type TEXT DEFAULT 'solar',

  -- 사주 분석 결과
  ilgan TEXT,
  saju_indicators JSONB,
  recommendations JSONB,

  -- 시뮬레이션 결과
  character_id TEXT,
  conversation_tree JSONB,
  selected_choices JSONB,
  final_affection INT,
  success BOOLEAN,
  early_exit_turn INT,

  -- 점수
  score_charm NUMERIC,
  score_conversation NUMERIC,
  score_sense NUMERIC,
  score_addiction NUMERIC,
  total_score NUMERIC,

  -- 등수 (확정 시 스냅샷)
  user_rank INT,
  total_count INT,
  percentile NUMERIC,
  same_ilgan_avg NUMERIC,
  same_ilgan_count INT,

  -- Gemini 생성 콘텐츠
  verdict JSONB,

  -- 메타
  status TEXT DEFAULT 'analyzing',
  attempt_number INT DEFAULT 1,
  previous_result_id UUID REFERENCES dating_results(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- 추적
  utm_source TEXT,
  utm_medium TEXT,

  CONSTRAINT check_dating_status CHECK (
    status IN ('analyzing', 'conversation', 'completed')
  ),
  CONSTRAINT check_dating_gender CHECK (
    gender IN ('male', 'female')
  )
);

-- 등수 조회 성능 인덱스
CREATE INDEX idx_dating_results_character_score
  ON dating_results(character_id, total_score DESC)
  WHERE status = 'completed';

CREATE INDEX idx_dating_results_ilgan
  ON dating_results(ilgan, character_id)
  WHERE status = 'completed';

CREATE INDEX idx_dating_results_weekly
  ON dating_results(created_at DESC)
  WHERE status = 'completed';

CREATE INDEX idx_dating_results_created_at
  ON dating_results(created_at DESC);

-- RLS: 비회원 서비스이므로 anon 키 허용
ALTER TABLE dating_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert dating results"
  ON dating_results FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can read dating results"
  ON dating_results FOR SELECT TO anon USING (true);

CREATE POLICY "Anyone can update dating results"
  ON dating_results FOR UPDATE TO anon USING (true) WITH CHECK (true);
