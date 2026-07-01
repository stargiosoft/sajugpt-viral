// 모아모아 홈 화면의 테스트 카탈로그 데이터 타입
// 실사용 Supabase 분석 데이터는 이번 스코프에서 연결하지 않으며,
// 참여자 수 / 신규 여부 / 인기 순위는 큐레이션된 정적 데이터로 관리한다.

export type TestCategory = 'love' | 'analysis' | 'money' | 'sim';

/** White / Gray 스케일 / 홈 화면 브랜드 오렌지만 사용하는 썸네일 컬러 토큰 */
export type TestColorTheme =
  | 'orange'
  | 'orangeDark'
  | 'orangeLight'
  | 'graphite'
  | 'slate'
  | 'mist';

export interface TestCatalogItem {
  id: string;
  title: string;
  description: string;
  href: string;
  emoji: string;
  /** 카드 썸네일 이미지 경로 (public/ 기준). 없으면 emoji + colorTheme 배경으로 대체 */
  imageSrc?: string;
  category: TestCategory;
  colorTheme: TestColorTheme;
  /** 예: "12.4만" — 참여자 수 표기 (뒤에 "명 참여" 등을 붙여 사용) */
  participantLabel: string;
  isNew: boolean;
  /** 1~3위인 경우에만 부여 (인기 테스트 정렬 순서 결정) */
  popularityRank?: 1 | 2 | 3;
  /** 에디터 추천 섹션 노출 여부 — 실시간 인기 순위(참여자 수 기준)와 겹치지 않도록 카테고리 다양성 기준으로 선정 */
  editorPick?: boolean;
  ready: boolean;
}
