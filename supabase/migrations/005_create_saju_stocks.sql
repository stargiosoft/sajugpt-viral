-- ─── 주가 조작단 결과 테이블 ─────────────────────────

CREATE TABLE saju_stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 입력
  gender TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_time TEXT,
  calendar_type TEXT NOT NULL DEFAULT 'solar',
  relationship_status TEXT NOT NULL,

  -- 산출 결과
  current_price INTEGER NOT NULL,
  fair_value INTEGER NOT NULL,
  target_price INTEGER NOT NULL,
  undervalue_rate NUMERIC(5,2) NOT NULL,
  investment_opinion TEXT NOT NULL,
  surge_month TEXT,
  sector TEXT,
  price_grade TEXT NOT NULL,
  fair_value_grade TEXT NOT NULL,

  -- Gemini 생성
  analyst_comment TEXT NOT NULL,

  -- 전체 결과 JSONB (discussion_data, operation_plan, chart_data, saju_summary 포함)
  result JSONB NOT NULL,

  -- 유저 인터랙션
  user_choices JSONB,
  reached_step TEXT DEFAULT 'report',

  -- 메타
  share_count INTEGER DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

CREATE INDEX idx_saju_stocks_created ON saju_stocks(created_at DESC);

-- RLS (비회원 전용)
ALTER TABLE saju_stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert stocks" ON saju_stocks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can read stocks" ON saju_stocks FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can update stocks" ON saju_stocks FOR UPDATE TO anon USING (true);

-- ─── M&A 시너지 분석 테이블 ──────────────────────────

CREATE TABLE stock_ma_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 관계
  stock_id UUID NOT NULL REFERENCES saju_stocks(id),
  target_name TEXT,

  -- 상대 사주
  target_gender TEXT NOT NULL,
  target_birth_date TEXT NOT NULL,
  target_birth_time TEXT,
  target_calendar_type TEXT NOT NULL DEFAULT 'solar',

  -- 시너지 결과
  synergy INTEGER NOT NULL,
  synergy_grade TEXT NOT NULL,
  star_rating INTEGER NOT NULL,
  conflict_rate INTEGER NOT NULL,
  comment TEXT NOT NULL,
  investment_opinion TEXT NOT NULL,

  -- 전체 결과 JSONB
  result JSONB NOT NULL
);

CREATE INDEX idx_stock_ma_stock_id ON stock_ma_analyses(stock_id);

ALTER TABLE stock_ma_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert ma" ON stock_ma_analyses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can read ma" ON stock_ma_analyses FOR SELECT TO anon USING (true);
