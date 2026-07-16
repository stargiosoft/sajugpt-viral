-- ============================================================
-- 015: ghost_tarot_comments — seed 댓글 문구 전면 교체 (마침표 제거 + 밈 톤)
-- ============================================================

DELETE FROM ghost_tarot_comments WHERE client_id = 'seed';

INSERT INTO ghost_tarot_comments (content, client_id, feature_type, likes, created_at) VALUES
  ('귀신이 나 볼까봐 냅다 공유함ㅋ', 'seed', 'ghost_tarot', 14, now()),
  ('이거 왜케 소름돋냐', 'seed', 'ghost_tarot', 8, now() - interval '10 minutes'),
  ('생각보다 정확해서 놀람', 'seed', 'ghost_tarot', 6, now() - interval '20 minutes'),
  ('친구랑 같이 해봤는데 결과가 다르네ㅋㅋ', 'seed', 'ghost_tarot', 9, now() - interval '35 minutes'),
  ('무서운데 계속 보게 됨', 'seed', 'ghost_tarot', 5, now() - interval '45 minutes'),
  ('이거 보고 바로 소금 뿌림', 'seed', 'ghost_tarot', 11, now() - interval '1 hour'),
  ('나만 이렇게 나온 거 아니지', 'seed', 'ghost_tarot', 4, now() - interval '1 hour 20 minutes'),
  ('와 진짜 신기하네', 'seed', 'ghost_tarot', 7, now() - interval '2 hours'),
  ('소름이다 진짜', 'seed', 'ghost_tarot', 16, now() - interval '3 hours'),
  ('공유 안하면 진짜 뭔일 날까봐 함', 'seed', 'ghost_tarot', 12, now() - interval '4 hours'),

  ('귀신이 나 볼까봐 냅다 공유함ㅋ', 'seed', 'romance_tarot', 13, now()),
  ('이거 은근 재밌다', 'seed', 'romance_tarot', 5, now() - interval '10 minutes'),
  ('생각보다 정확해서 놀람', 'seed', 'romance_tarot', 6, now() - interval '25 minutes'),
  ('친구랑 같이 해봤는데 결과가 다르네ㅋㅋ', 'seed', 'romance_tarot', 9, now() - interval '40 minutes'),
  ('무서운데 계속 보게 됨', 'seed', 'romance_tarot', 5, now() - interval '50 minutes'),
  ('이거 보고 그 사람한테 바로 연락함', 'seed', 'romance_tarot', 15, now() - interval '1 hour 10 minutes'),
  ('나만 이렇게 나온 거 아니지', 'seed', 'romance_tarot', 4, now() - interval '1 hour 30 minutes'),
  ('와 진짜 신기하네', 'seed', 'romance_tarot', 7, now() - interval '2 hours'),
  ('소름이다 진짜', 'seed', 'romance_tarot', 16, now() - interval '3 hours'),
  ('공유했더니 친구도 해봤대', 'seed', 'romance_tarot', 8, now() - interval '6 hours');
