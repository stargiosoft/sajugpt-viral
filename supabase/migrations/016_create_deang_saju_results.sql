-- 1. Enum 타입 생성 (천간 및 견종 코드)
CREATE TYPE heavenly_stem AS ENUM (
  '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'
);

CREATE TYPE dog_code AS ENUM (
  'jindo',
  'pomeranian',
  'welsh_corgi',
  'papillon',
  'great_pyrenees',
  'shiba',
  'doberman',
  'maltese',
  'golden_retriever',
  'poodle'
);

-- 2. 견종 프로필 데이터 마스터 테이블 (DogProfile)
CREATE TABLE dog_profiles (
  code dog_code PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  heavenly_stem heavenly_stem UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  abilities JSONB NOT NULL DEFAULT '{ "leadership":0, "affection":0, "perceptiveness":0, "independence":0, "attachment":0 }',
  personality TEXT NOT NULL,
  social_style TEXT NOT NULL,
  love_style TEXT NOT NULL,
  work_style TEXT NOT NULL,
  best_match dog_code,
  worst_match dog_code,
  quips TEXT[] NOT NULL DEFAULT '{}', 
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul'), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')
);

ALTER TABLE dog_profiles
ADD CONSTRAINT fk_best_match
FOREIGN KEY (best_match)
REFERENCES dog_profiles(code);

ALTER TABLE dog_profiles
ADD CONSTRAINT fk_worst_match
FOREIGN KEY (worst_match)
REFERENCES dog_profiles(code);

-- 3. 사주 분석 결과 테이블 (DeangSajuResponse 매핑용) - 한국 시간 적용
CREATE TABLE deang_saju_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_code dog_code NOT NULL,
  profile JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')
);

-- 4. 성능 최적화를 위한 인덱스 설정
CREATE INDEX idx_deang_results_created_at ON deang_saju_results(created_at DESC);
CREATE INDEX idx_deang_results_dog_code ON deang_saju_results(dog_code);
CREATE INDEX idx_dog_profiles_stem ON dog_profiles(heavenly_stem);

-- 5. Row Level Security (RLS) 설정
ALTER TABLE dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deang_saju_results ENABLE ROW LEVEL SECURITY;

-- 누구나 프로필 및 결과 읽기 가능 (공유 페이지 지원용)
CREATE POLICY "Public can read dog profiles"
ON dog_profiles
FOR SELECT
USING (true);

CREATE POLICY "Public can read deang results"
ON deang_saju_results
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert deang results"
ON deang_saju_results
FOR INSERT
WITH CHECK (true);