# 세션 2 인계 문서 — 색기 배틀 Phase 1 구현

> **작성일**: 2026-03-27 | **상태**: Phase 1 MVP + 온보딩/랜딩페이지 완성

---

## 세션 2에서 완료된 작업

### 온보딩 + 랜딩페이지 추가
- **`OnboardingLanding.tsx`** 신규 생성 — 다크 테마 랜딩페이지
  - 히어로 섹션: "당신의 사주에 발정 난 남자는 몇 명?"
  - 캐릭터 쇼케이스: 5명 아바타 (윤태산 중앙 골드 테두리 강조)
  - 진행 방식 3단계 설명
  - 등급 체계 미리보기 (SSS~CUT 6단계, FOMO 유발)
  - 소셜 프루프: "142,847명 진단 완료"
  - 면책 고지: "재미로 보는 콘텐츠" 명시
  - 하단 고정 CTA: "내 페로몬 등급 확인하기"
- **`Step` 타입 확장**: `'landing' | 'input' | 'analyzing' | 'result'`
- **플로우 로직**: 기본 → 랜딩 먼저 / UTM·battleId → 입력폼 직행 / 다시하기 → 랜딩 복귀

### Gemini 판정문 품질 개선
- **프롬프트 리팩토링**: 등급명 그대로 넣지 않도록 명시, 예시 2개 추가
- `temperature` 0.9 → 0.7 (안정적 출력)
- `maxOutputTokens` 200 → 400 (잘림 방지)
- **후처리 추가**: 마크다운/따옴표 제거, 미완성 문장 감지 (마지막 문자 검사)
- **폴백 강화**: 등급명(`title`) 대신 등급별 완성된 판정문(`fallbackVerdict`) 사용
  - Gemini 실패·짧은 응답·잘린 문장 → 자동 폴백

### UI/UX 개선
- **결과 카드 동적 높이**: `aspectRatio: '9/16'` → `minHeight: '600px'`으로 변경. 판정문 길이에 따라 카드 자동 확장
- **결과 페이지 흔들림 제거**: 진입 애니메이션 `y: 30` 제거, fade-in만 적용
- **워터마크 → 클릭 가능 링크**: `sajugpt.co` → `sajugpt.co.kr` (보라색, 굵게, 밑줄). 클릭 시 `https://www.sajugpt.co.kr/` 새 탭
- **"다시 해보기" 버튼 크기 통일**: 다른 CTA 버튼과 동일한 크기 (56px, borderRadius 16px, padding 0 20px)
- **입력값 sessionStorage 캐시**: 새로고침해도 입력값 유지. 캐시 있으면 랜딩 스킵. "다시하기" 시 캐시 삭제

---

## 세션 1에서 완료된 작업

### 프로젝트 세팅
- Vite SPA → **Next.js 16 App Router로 마이그레이션 완료** (바이럴 OG 메타태그 목적)
- React 19 + TypeScript + Tailwind v4 + framer-motion
- Git 초기화 + GitHub remote: `https://github.com/stargiosoft/sajugpt-viral.git`
- Vercel 배포: https://sajugpt-viral.vercel.app
- Supabase 프로젝트: `tdrmvbsmxcewwaeuoqdx`

### DB
- `sexy_battles` 테이블 생성 완료 (migration push 완료)
- RLS: anon 읽기 허용, 쓰기는 service role
- Phase 2 대비 acceptor 컬럼 미리 설계됨

### Edge Function: `analyze-sexy-battle`
- 배포 완료 (`--no-verify-jwt`)
- 파이프라인: Stargio API → excludeKeys 경량화 → `calculateSexyScore()` → 캐릭터 배정 → Gemini 판정문 (개선됨) → DB 저장

### Supabase Secrets
- `SAJU_API_KEY`: 등록 완료
- `GOOGLE_API_KEY`: 등록 완료

### Vercel 환경변수
- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록 완료

### 프론트엔드 컴포넌트 (11개)
| 컴포넌트 | 상태 | 비고 |
|----------|------|------|
| `OnboardingLanding.tsx` | ✅ 완성 | 다크 테마 랜딩페이지 (세션 2 신규) |
| `SexyBattleClient.tsx` | ✅ 완성 | 메인 상태머신 (landing→input→analyzing→result) + sessionStorage 캐시 |
| `BirthInput.tsx` | ✅ 완성 | 나다운세 MansePage 패턴 (YYYY-MM-DD 자동포맷) |
| `GenderSelect.tsx` | ✅ 완성 | 슬라이딩 인디케이터 + 체크마크 |
| `BirthTimeInput.tsx` | ✅ 완성 | 4자리→오전/오후 자동변환 + 모르겠어요 토글 |
| `AnalyzingScreen.tsx` | ✅ 완성 | 펄싱 링 + 순차 텍스트 |
| `ResultCard.tsx` | ✅ 완성 | 동적 높이 카드 (toPng 캡처 대상) + sajugpt.co.kr 링크 |
| `ChatBubble.tsx` | ✅ 완성 | 단톡방/DM 연출 |
| `CharacterAvatar.tsx` | ✅ 완성 | 원형 아바타 |
| `GradeBadge.tsx` | ✅ 완성 | SSS~CUT 등급 배지 |
| `ShareButtons.tsx` | ✅ 완성 | 클립보드, 이미지 저장, 네이티브 공유 |
| `CutScene.tsx` | ✅ 완성 | 입구컷(0명) 윤태산 반전 연출 |

### 라우팅
| 경로 | 렌더링 | 용도 |
|------|--------|------|
| `/` | 정적 | → `/sexy-battle` 리다이렉트 |
| `/sexy-battle` | 정적 | 온보딩 랜딩 → 입력 → 결과 |
| `/sexy-battle/[battleId]` | SSR (동적) | 배틀별 동적 OG 메타태그 |

---

## 알려진 이슈

### 반드시 수정
1. **Edge Function 디버그 응답 제거** — `analyze-sexy-battle/index.ts`의 502 응답에 `debug` 필드가 남아있음. 프로덕션 배포 전 제거 필수
2. **구 Vite 파일 잔존** — `src/main.ts`, `src/counter.ts`, `src/style.css`, `src/assets/`, `vite.config.ts`, `index.html`이 빈 파일로 남아있음. 빌드에는 무해하나 정리 필요
3. **`src/_old_pages/`** — 구 Vite 라우터 페이지. 삭제 필요

### 확인 필요
4. **결과 카드 toPng 품질** — 모바일에서 실제 캡처 테스트 필요 (폰트 렌더링, 이미지 해상도). 동적 높이 변경으로 캡처 비율 재확인 필요
5. **카카오톡 공유** — Kakao JS SDK 미연동 (현재 클립보드 복사 + Web Share API만). Phase 2에서 추가 예정
6. **소셜 프루프 숫자** — 현재 하드코딩 (142,847명). 추후 실제 DB count 연동 또는 점진 증가 로직 필요

---

## Phase 2 TODO (추후)

- [ ] 챗봇 전환 CTA 구현 (승자/패자/입구컷별 분기, 현재 워터마크 링크만 sajugpt.co.kr로 연결)
- [ ] 배틀 수락 플로우 (`/sexy-battle/[battleId]`에서 상대방 입력 → VS 카드)
- [ ] 2인 비교 카드 컴포넌트 (`BattleVSCard.tsx`)
- [ ] 승패 판정 애니메이션
- [ ] OG 이미지 동적 생성 Edge Function (`og-sexy-battle`)
- [ ] 카카오톡 JS SDK 연동
- [ ] 이벤트 트래킹 GA4/Mixpanel 연동
- [ ] Sentry 에러 모니터링
- [ ] 소셜 프루프 실시간 카운트 연동

---

## 핵심 커맨드

```bash
# 개발
cd "/c/Users/gksru/사주GPT_바이럴"
npx next dev --port 3000

# 빌드
npx next build

# Edge Function 배포
npx supabase functions deploy analyze-sexy-battle --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx

# Vercel 배포
npx vercel deploy --prod

# Supabase Secrets
npx supabase secrets set "KEY=VALUE" --project-ref tdrmvbsmxcewwaeuoqdx
npx supabase secrets list --project-ref tdrmvbsmxcewwaeuoqdx
```

---

## 참조 문서

| 문서 | 경로 |
|------|------|
| 개발 규칙 | `CLAUDE.md` |
| 디자인 시스템 | `★key docs/★DESIGN_SYSTEM★.md` |
| PRD | `★sub docs/색기 배틀/PRD_SEXY_BATTLE.md` |
| 바이럴 전략 | `★key docs/VIRAL_STRATEGY.md` |
| 사주 API 경량화 | `나다운세 원본/src/docs/develop/통합 사주 api/SAJU_API_LIGHTWEIGHT.md` |
| 점수 산출 공식 | PRD 내 "사주 색기 분석 로직" 섹션 |
