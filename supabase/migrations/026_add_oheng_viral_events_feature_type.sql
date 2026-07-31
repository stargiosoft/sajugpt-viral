-- 오행 처방전을 viral_events(공유/유입 트래킹) feature_type 허용 목록에 추가
ALTER TABLE viral_events DROP CONSTRAINT check_feature_type;
ALTER TABLE viral_events ADD CONSTRAINT check_feature_type
  CHECK (feature_type IN ('sexy_battle', 'saju_autopsy', 'saju_court', 'gisaeng', 'night_manual', 'dating', 'saju_stock', 'ghost_tarot', 'romance_tarot', 'deang_saju', 'love_chat', 'red_flag', 'mental_worldcup', 'money_timeline', 'oheng'));
