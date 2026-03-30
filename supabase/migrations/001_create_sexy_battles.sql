CREATE TABLE sexy_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 도전자 (먼저 진단한 사람)
  challenger_birthday TEXT NOT NULL,
  challenger_birth_time TEXT,
  challenger_gender TEXT NOT NULL,
  challenger_score NUMERIC NOT NULL,
  challenger_headcount INT NOT NULL,
  challenger_grade TEXT NOT NULL,
  challenger_result JSONB NOT NULL,
  -- 수락자 (초대받은 사람)
  acceptor_birthday TEXT,
  acceptor_birth_time TEXT,
  acceptor_gender TEXT,
  acceptor_score NUMERIC,
  acceptor_headcount INT,
  acceptor_grade TEXT,
  acceptor_result JSONB,
  -- 메타
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- 추적
  utm_source TEXT,
  utm_medium TEXT
);

CREATE INDEX idx_sexy_battles_created_at ON sexy_battles(created_at DESC);

-- RLS: anon 읽기 허용 (공유 링크 접근용), 쓰기는 service role만
ALTER TABLE sexy_battles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read battles"
  ON sexy_battles FOR SELECT
  TO anon
  USING (true);
