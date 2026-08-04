CREATE TABLE solo_guide_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,         -- '3-1', '3-2', '3-3'
  content_key TEXT NOT NULL,     -- 'RE_IN', 'IN_BI', 'BI' 등 (A, B 결합 키)
  title TEXT NOT NULL,           -- 대표 연애 유형
  reason_solo TEXT NOT NULL,     -- 내가 솔로인 이유
  charm_point TEXT NOT NULL,     -- 나의 반전 매력 포인트
  compatibility TEXT NOT NULL,   -- 어떤 사람이랑 잘 맞을까?
  tip TEXT NOT NULL,             -- 솔로 탈출 한 줄 처방
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT unique_section_key UNIQUE (section, content_key)
);

-- 2. 조회가 가능하도록 RLS Policy 설정 (선택)
ALTER TABLE solo_guide_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.solo_guide_results 
FOR SELECT 
USING (true);