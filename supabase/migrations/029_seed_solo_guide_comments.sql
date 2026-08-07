-- 솔로 탈출 지침서 시드 댓글 20개 (oheng 027 패턴과 동일)
-- 결과 화면에는 오행 용어(재성/식상/관성/인성/비겁)나 점수·퍼센트가 노출되지 않으므로,
-- 댓글도 실제 결과 항목(제목/솔로인 이유/반전 매력/잘 맞는 사람/한 줄 처방) 기준으로만 작성한다.
INSERT INTO ghost_tarot_comments (content, client_id, feature_type, likes, created_at) VALUES
  ('일할 때만 눈빛 달라진다는 얘기 나왔는데 진짜 내 얘기라 인정...', 'seed', 'solo_guide', 24, now()),
  ('내가 솔로인 이유 보고 빵터짐 이거 완전 내 얘기잖아ㅋㅋㅋ', 'seed', 'solo_guide', 19, now() - interval '8 minutes'),
  ('내 유형 되게 콕 집어서 나온 줄 알았는데 진짜 소름일 정도로 맞음', 'seed', 'solo_guide', 13, now() - interval '17 minutes'),
  ('반전 매력 부분 보고 나도 몰랐던 내 모습 알게 됨', 'seed', 'solo_guide', 21, now() - interval '26 minutes'),
  ('친구랑 같이 했는데 둘 다 완전 다른 유형 나와서 웃겼어', 'seed', 'solo_guide', 10, now() - interval '35 minutes'),
  ('한 줄 처방 캡처해서 저장함 진짜 뼈 맞은 기분', 'seed', 'solo_guide', 27, now() - interval '47 minutes'),
  ('원칙주의자라는 말 나왔는데 너무 공감돼서 소름', 'seed', 'solo_guide', 9, now() - interval '58 minutes'),
  ('이거 하고 나서 내가 왜 항상 썸에서 끝났는지 알겠다ㅜㅜ', 'seed', 'solo_guide', 16, now() - interval '1 hour 9 minutes'),
  ('내 유형 이름 되게 특이하게 나왔는데 설명 보니까 완전 납득', 'seed', 'solo_guide', 8, now() - interval '1 hour 22 minutes'),
  ('잘 맞는 사람 항목 보니까 예전 연애 왜 힘들었는지 이해됨', 'seed', 'solo_guide', 14, now() - interval '1 hour 35 minutes'),
  ('배려심 얘기 나오니까 좀 뭉클했음 진짜 내 얘기 같아서', 'seed', 'solo_guide', 6, now() - interval '1 hour 50 minutes'),
  ('결과 카드 디자인 예뻐서 그냥 인스타에 올림', 'seed', 'solo_guide', 18, now() - interval '2 hours 5 minutes'),
  ('자기중심적이면서 원칙주의자라는 말 이거 완전 나야ㅋㅋ', 'seed', 'solo_guide', 11, now() - interval '2 hours 20 minutes'),
  ('사주GPT에서 더 자세히 보니까 훨씬 구체적으로 나와서 좋았어', 'seed', 'solo_guide', 15, now() - interval '2 hours 38 minutes'),
  ('결과 보는 재미가 있어서 계속 눌러보게 됨', 'seed', 'solo_guide', 7, now() - interval '2 hours 55 minutes'),
  ('이거 소개팅 앞두고 해봤는데 은근 도움 됨ㅋㅋ', 'seed', 'solo_guide', 12, now() - interval '3 hours 12 minutes'),
  ('특징 설명 완전 내 전 남친이었어 소름', 'seed', 'solo_guide', 20, now() - interval '3 hours 30 minutes'),
  ('내 유형 설명 디테일해서 놀랐다', 'seed', 'solo_guide', 5, now() - interval '3 hours 50 minutes'),
  ('이런 거 볼 때마다 사주가 진짜 은근 맞는 거 같음', 'seed', 'solo_guide', 17, now() - interval '4 hours 15 minutes'),
  ('처방 보고 진짜 연애를 우선순위로 좀 둬야겠다 느낌', 'seed', 'solo_guide', 23, now() - interval '4 hours 40 minutes');
