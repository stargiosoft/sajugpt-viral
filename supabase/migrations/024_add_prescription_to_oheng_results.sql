-- 오행 처방전 결과 화면에 필요한 파생 텍스트(진단/처방)를 통째로 저장해
-- 공유 링크 재조회 시 재계산 없이 그대로 렌더링할 수 있도록 함
ALTER TABLE oheng_results ADD COLUMN prescription JSONB NOT NULL DEFAULT '{}'::jsonb;
