-- ============================================================
-- 011: viral_events에 romance_tarot feature_type 추가
-- ============================================================

ALTER TABLE viral_events DROP CONSTRAINT check_feature_type;
ALTER TABLE viral_events ADD CONSTRAINT check_feature_type CHECK (
  feature_type IN ('sexy_battle', 'saju_autopsy', 'saju_court', 'gisaeng', 'night_manual', 'dating', 'saju_stock', 'ghost_tarot', 'romance_tarot')
);
