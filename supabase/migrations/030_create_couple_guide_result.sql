-- 1. 테이블 생성 (존재하지 않을 경우)
CREATE TABLE IF NOT EXISTS public.couple_guide_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_title text NOT NULL,
  relationship_subtitle text NOT NULL,
  hashtags text[] NOT NULL DEFAULT '{}',
  telepathy_score integer NOT NULL CHECK (telepathy_score BETWEEN 0 AND 100),
  conflict_score integer NOT NULL CHECK (conflict_score BETWEEN 0 AND 100),
  min_score integer NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. 점수 범위 체크 제약 조건 추가
ALTER TABLE public.couple_guide_results
  DROP CONSTRAINT IF EXISTS couple_guide_results_score_range_chk;

ALTER TABLE public.couple_guide_results
  ADD CONSTRAINT couple_guide_results_score_range_chk
  CHECK (min_score <= max_score AND min_score >= 0 AND max_score <= 100);

-- 3. RLS(행 레벨 보안) 설정 및 정책 추가
ALTER TABLE public.couple_guide_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "couple_guide_results_select_public" ON public.couple_guide_results;
CREATE POLICY "couple_guide_results_select_public"
  ON public.couple_guide_results
  FOR SELECT
  USING (true);

-- 4. 성능 향상을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_couple_guide_results_score_range
  ON public.couple_guide_results (min_score, max_score);

-- 5. 기존 데이터 초기화 및 점수 구간별 시드 데이터 전체 적재
TRUNCATE public.couple_guide_results;

INSERT INTO public.couple_guide_results
  (relationship_title, relationship_subtitle, hashtags, telepathy_score, conflict_score, min_score, max_score)
VALUES
  ('영혼의 대칼코마니', '말하지 않아도 척하면 척!', ARRAY['텔레파시통함', '본모습그대로', '방구석직전'], 99, 20, 95, 100),
  ('찰떡궁합 커플', '설명이 필요 없는 완벽 케미', ARRAY['찰떡궁합', '무언의합'], 91, 15, 90, 94),
  ('말없이 다 아는 커플', '설명 안 해도 척척 맞는형', ARRAY['찰떡호흡', '무언의케미'], 88, 20, 85, 89),
  ('한몸 같은 커플', '취향부터 습관까지 닮은형', ARRAY['도플갱어케미', '싱크로율99'], 85, 18, 80, 84),
  ('탄탄대로 커플', '서로 좋은 영향을 주는 인연', ARRAY['탄탄대로', '서로윈윈'], 80, 25, 75, 79),
  ('티키타카 만렙 커플', '투닥거려도 결국 웃는형', ARRAY['티키타카', '애정싸움'], 70, 58, 70, 74),
  ('불꽃 튀는 라이벌 커플', '서로 자극하며 크는 성장형', ARRAY['성장케미', '자극제'], 66, 72, 65, 69),
  ('밀당 고수 커플', '적당한 긴장감이 활력인형', ARRAY['밀당장인', '긴장감케미'], 60, 45, 60, 64),
  ('작은 불씨 커플', '천천히 데워지는 온기형', ARRAY['잔잔한케미', '은근한다정함'], 62, 28, 50, 59),
  ('느긋한 동반자 커플', '싸울 일이 별로 없는 평화형', ARRAY['평화주의', '느긋케미'], 55, 12, 0, 49);