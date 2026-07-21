// 댕댕사주 전용 컬러 팔레트 — 디자인을 다시 손볼 때 이 파일의 값만 바꾸면
// src/components/deang-saju/* 전체에 반영됩니다. (개별 파일에 hex 하드코딩 금지)
export const DEANG_COLORS = {
  // 배경
  pageBg: '#FFFEFF', // 페이지 전체 배경
  cardBg: '#FFFFFF', // 흰 카드 배경
  cream: '#FFFBEA', // 옅은 크림 (안내 박스 배경, 타이틀 아웃라인)
  creamBorder: '#EDD98A', // 옅은 노랑 보더
  accentBg: '#FDE4B0', // 포인트 박스/라벨 배경 (댕댕 분석 카드, 궁합 라벨)
  titleBg: '#FBEAC0', // 견종 타이틀 박스 배경
  factOutline: '#ECD5A9', // 한 줄 팩폭 박스 아웃라인
  borderInk: '#060606', // 손그림 아웃라인 박스 라인 색상
  illustrationBg: '#FBF7F2', // 견종 일러스트 박스 배경
  cardFill: 'rgb(248, 241, 228)', // 페이지 배경보다 살짝 진한 카드 채움색 (일러스트/능력치/분석 박스)

  // 텍스트 / 포인트
  ink: '#14B375', // 메인 포인트 컬러 — 제목, 버튼, 보더, 포인트 텍스트
  inkSoft: '#14B375', // 보조 포인트 컬러 — 입력 필드 라벨 등
  bodyText: '#14B375', // 본문 텍스트
  mutedText: '#14B375', // 흐린 보조 텍스트 / 캡션
  faintText: '#14B375', // placeholder 등 가장 옅은 텍스트

  // 댕댕 능력치 바
  statBarFill: '#75b57a', // 능력치 바 채움 (그린)
  statBarTrack: '#edf2ed', // 능력치 바 트랙(빈 영역)

  // 댓글 섹션 (박스 없이 페이지 노란 배경 위에 바로 올라가는 전용 팔레트)
  comment: {
    accent: '#58B889',
    text: '#000000',
    dim: 'rgb(101, 101, 101)',
    dimStrong: 'rgb(52, 52, 52)',
    faint: 'rgb(205, 205, 205)',
    inputBg: 'rgb(245, 245, 245)',
    placeholder: 'rgb(165, 165, 165)',
    sendDisabledBg: '#eeeeee',
    inputBorder: 'transparent',
  },
} as const;
