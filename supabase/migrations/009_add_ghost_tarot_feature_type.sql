-- ============================================================
-- 008: viral_events에 ghost_tarot feature_type / landing_visit event_type 추가
-- ============================================================

ALTER TABLE viral_events DROP CONSTRAINT check_feature_type;
ALTER TABLE viral_events ADD CONSTRAINT check_feature_type CHECK (
  feature_type IN ('sexy_battle', 'saju_autopsy', 'saju_court', 'gisaeng', 'night_manual', 'dating', 'saju_stock', 'ghost_tarot')
);

ALTER TABLE viral_events DROP CONSTRAINT check_event_type;
ALTER TABLE viral_events ADD CONSTRAINT check_event_type CHECK (
  event_type IN ('share_click', 'sajugpt_link_click', 'referral_visit', 'landing_visit')
);
