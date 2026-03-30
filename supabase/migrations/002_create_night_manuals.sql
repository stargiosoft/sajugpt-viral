CREATE TABLE night_manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 입력
  birthday TEXT NOT NULL,
  birth_time TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),

  -- 체질
  constitution_type TEXT NOT NULL,
  stats JSONB NOT NULL,
  total_charm INTEGER NOT NULL,
  do_hwa_sal BOOLEAN DEFAULT false,
  hong_yeom_sal BOOLEAN DEFAULT false,

  -- 시종 선택 (프론트에서 PATCH로 업데이트)
  selected_servant TEXT,
  compatibility_grade TEXT,

  -- 전체 결과 payload
  result JSONB NOT NULL,

  -- 유입 추적
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 공유 링크 조회용 인덱스
CREATE INDEX idx_night_manuals_created ON night_manuals (created_at DESC);

-- RLS: 비회원이므로 anon으로 SELECT/INSERT/UPDATE 허용
ALTER TABLE night_manuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "night_manuals_select" ON night_manuals
  FOR SELECT USING (true);

CREATE POLICY "night_manuals_insert" ON night_manuals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "night_manuals_update" ON night_manuals
  FOR UPDATE USING (true)
  WITH CHECK (true);
