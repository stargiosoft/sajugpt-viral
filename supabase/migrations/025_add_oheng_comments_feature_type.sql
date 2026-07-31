-- 오행 처방전을 공용 댓글(ghost_tarot_comments) feature_type 허용 목록에 추가
ALTER TABLE ghost_tarot_comments DROP CONSTRAINT check_ghost_tarot_comments_feature_type;
ALTER TABLE ghost_tarot_comments ADD CONSTRAINT check_ghost_tarot_comments_feature_type
  CHECK (feature_type IN ('ghost_tarot', 'romance_tarot', 'deang_saju', 'love_chat', 'red_flag', 'mental_worldcup', 'money_timeline', 'oheng'));
