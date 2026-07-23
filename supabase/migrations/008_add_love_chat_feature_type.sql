-- ============================================================
-- 008: love_chat 을 공용 댓글(ghost_tarot_comments) / 이벤트(viral_events)
-- feature_type 허용 목록에 추가
-- ============================================================

ALTER TABLE ghost_tarot_comments DROP CONSTRAINT check_ghost_tarot_comments_feature_type;
ALTER TABLE ghost_tarot_comments ADD CONSTRAINT check_ghost_tarot_comments_feature_type
  CHECK (feature_type IN ('ghost_tarot', 'romance_tarot', 'deang_saju', 'love_chat'));

ALTER TABLE viral_events DROP CONSTRAINT check_feature_type;
ALTER TABLE viral_events ADD CONSTRAINT check_feature_type
  CHECK (feature_type IN ('sexy_battle', 'saju_autopsy', 'saju_court', 'gisaeng', 'night_manual', 'dating', 'saju_stock', 'ghost_tarot', 'romance_tarot', 'deang_saju', 'love_chat'));
