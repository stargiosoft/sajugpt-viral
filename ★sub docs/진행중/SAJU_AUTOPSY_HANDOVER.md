# 세션 인계 문서 — 사주 부검실

> **작성일**: 2026-03-27 | **최종 업데이트**: 2026-03-30 | **상태**: Phase 2 구현 완료 (배포 대기)

---

## 진행 상황 요약

### Phase 1 (완료 + 배포)

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | DB 마이그레이션 | ✅ 배포 | `002_create_saju_autopsies.sql` |
| 2 | 타입 + 상수 정의 | ✅ 완료 | `types/autopsy.ts`, `constants/autopsy.ts` |
| 3 | Edge Function | ✅ 배포 | `analyze-saju-autopsy/index.ts` |
| 4 | 프론트엔드 컴포넌트 (8개) | ✅ 완료 | AutopsyClient + 입력 4개 + AutopsyCard + DeathCertificate + AutopsyShareButtons |
| 5 | 페이지 라우팅 + OG 메타 | ✅ 완료 | `/autopsy` (정적), `/autopsy/[autopsyId]` (동적 SSR) |
| 6 | 빌드 + 배포 | ✅ 완료 | GitHub push → Vercel 자동 배포 |
| 7 | 바이럴 허브 페이지 | ✅ 완료 | `/` → ViralHub.tsx |
| 8 | 랜딩 페이지 디자인 | ✅ 완료 | 감정 스토리텔링 중심 |

### Phase 2 (구현 완료, 배포 대기)

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | 영안실 뷰 + 안치하기 | ✅ 완료 | `MorgueView.tsx` + `003_autopsy_morgue_phase2.sql` (DB push 필요) |
| 2 | 전전남친 리플레이 개선 | ✅ 완료 | `handleReplay` — landing 스킵, input 직행 |
| 3 | 카카오톡 JS SDK 공유 | ✅ 완료 | `share.ts`에 `shareKakao()`, layout에 SDK 로드 |
| 4 | OG 이미지 동적 생성 | ✅ 완료 | `opengraph-image.tsx` (edge runtime, ImageResponse) |
| 5 | 공통 사주 캐시 시스템 | ✅ 완료 | `sajuCache.ts` — 전 기능 사주 정보 공유 |
| 6 | 입력 폼 UX 개선 | ✅ 완료 | "그 놈의 사주를 넣어봐" 헤더 + 상대 정보 안내 배너 + 필드 라벨 명확화 |
| 7 | 공유 버튼 정리 | ✅ 완료 | 카카오톡(메인) + 이미지 저장 + 링크 복사 |
| 8 | CTA 제거 + 다른 테스트 | ✅ 완료 | 챗봇 CTA 제거, "처음으로" → "다른 테스트 해보기" (`/`로 이동) |
| 9 | 성별 기본값 변경 | ✅ 완료 | `female` → `male` (부검 대상 = 전남친) |

---

## 전체 파일 목록

### 백엔드

| 파일 | 설명 |
|------|------|
| `supabase/migrations/002_create_saju_autopsies.sql` | DB 테이블 스키마 (22개 컬럼 + 인덱스 3개 + RLS SELECT) |
| `supabase/migrations/003_autopsy_morgue_phase2.sql` | UPDATE RLS 정책 + `autopsy_morgue_stats` 뷰 |
| `supabase/functions/analyze-saju-autopsy/index.ts` | Edge Function (10단계 파이프라인) |

### 프론트엔드 — 공통 유틸

| 파일 | 설명 |
|------|------|
| `src/lib/sajuCache.ts` | 공통 사주 캐시 — `saju_input_self` (본인, 6기능 공유) + `saju_input_target` (상대, 부검실 전용) |
| `src/lib/share.ts` | 이미지 캡처 + 클립보드 + `shareKakao()` (카카오 SDK 연동) |

### 프론트엔드 — 타입/상수

| 파일 | 설명 |
|------|------|
| `src/types/autopsy.ts` | AutopsyResult, AutopsyStep(`morgue` 포함), MorgueStats, MorgueAutopsy |
| `src/constants/autopsy.ts` | 사인 5종, 기간 4종, 검시관 2종, 사망 원인 10종, 등급 5종, 예후, 로딩 메시지 |

### 프론트엔드 — 컴포넌트 (9개)

| 파일 | 설명 |
|------|------|
| `src/components/autopsy/AutopsyClient.tsx` | 메인 상태머신 (landing→input→analyzing→card1→card2→card3→result→morgue) |
| `src/components/autopsy/CauseOfDeathSelect.tsx` | 사인(死因) 5개 선택 UI |
| `src/components/autopsy/DurationSelect.tsx` | 사귄 기간 4개 선택 (칩 버튼) |
| `src/components/autopsy/CoronerSelect.tsx` | 검시관 선택 — 원형 캐릭터 사진 + 분노형/치유형 |
| `src/components/autopsy/AnalyzingAutopsy.tsx` | "검시관 출동 중..." 로딩 연출 |
| `src/components/autopsy/AutopsyCard.tsx` | 3장 카드 공통 레이아웃 (스와이프 트랜지션) |
| `src/components/autopsy/DeathCertificate.tsx` | 사망진단서 카드 (toPng 캡처, forwardRef) |
| `src/components/autopsy/AutopsyShareButtons.tsx` | 카카오톡 공유 + 이미지 저장 + 링크 복사 |
| `src/components/autopsy/MorgueView.tsx` | 영안실 뷰 (피해자 수 + TOP 3 사망원인 + 다른 부검 결과) |

### 프론트엔드 — 페이지

| 파일 | 설명 |
|------|------|
| `src/app/autopsy/page.tsx` | `/autopsy` 메인 (정적 OG) |
| `src/app/autopsy/[autopsyId]/page.tsx` | `/autopsy/[autopsyId]` 동적 OG SSR |
| `src/app/autopsy/[autopsyId]/opengraph-image.tsx` | 동적 OG 이미지 생성 (사망진단서 요약, edge runtime) |

---

## 기본값 설정

| 항목 | 값 | 이유 |
|------|-----|------|
| 성별 | `male` (남성) | 부검 대상 = 전남친이 주 타겟 |
| 태어난 시간 | 모르겠어요 해제 (입력 가능) | 시간 모르면 직접 체크하도록 |
| 검시관 | 미선택 (사용자 선택 필수) | 분노형 vs 치유형 선택이 핵심 경험 |

---

## 입력 폼 UX

- **헤더**: "그 놈의 사주를 넣어봐" + "너를 못 알아본 전남친/전여친의 생년월일을 입력하세요"
- **안내 배너**: ⚠️ "본인이 아닌 **상대방(전남친/전여친)**의 정보를 입력하세요" (노란색)
- **필드 라벨**: "그 놈의 성별", "그 놈의 생년월일", "그 놈이 태어난 시간"
- **캐시**: `saju_input_target` (상대 사주 전용, 본인 사주와 별도)

---

## 결과 화면 버튼 구성

1. **카카오톡 공유** (노란색, 메인) — "친구한테 보내기"
2. **이미지 저장 + 링크 복사** (보조 행)
3. **영안실 안치** — "🏥 영안실에 안치하기" → `is_archived=true` 후 morgue 스텝 이동
4. **전전남친 리플레이** — input 직행 (landing 스킵)
5. **다른 테스트 해보기** — `/` (허브 리스트) 이동

---

## 공통 사주 캐시 시스템 (`sajuCache.ts`)

| 키 | 용도 | 적용 기능 |
|----|------|----------|
| `saju_input_self` | 본인 사주 | 색기 배틀, 사주 법정, 기생 시뮬, 밤 설명서, 주가 조작단 |
| `saju_input_target` | 상대 사주 | 부검실 |

- 어떤 기능에서든 사주 입력하면 다른 기능에서 자동 복원
- 캐시 있으면 landing 스킵 → input 직행

---

## Edge Function 핵심 로직 요약

```
요청 → Stargio Saju API 호출 (3회 재시도)
     → extractSajuHighlights() — 십성 9종 카운트 + 발달 5종 + 신살 + 일주
     → determineCauseOfDeath() — 사인×사주 교차 (linkedInputs 보너스 +10)
     → calculateDiscernmentGrade() — 정인·식신·정관 → F~A (F+D=70%+ 목표)
     → calculateRegretProbability() — 70% 기반 가감 (61.3~99.8%)
     → generatePrognosis() — 사망 원인별 랜덤 예후
     → generateAutopsyCards() — Gemini 2.5 Flash JSON 3장 카드 일괄 생성
     → DB 저장 → 응답
```

---

## 버그 수정 이력

| 날짜 | 내용 |
|------|------|
| 2026-03-30 | BirthInput `peer-focus:hidden` + `color:transparent` 조합으로 입력 시 텍스트 사라지는 버그 수정 |
| 2026-03-30 | favicon.ico 404 → layout.tsx에 `icons: { icon: '/favicon.svg' }` 추가 |
| 2026-03-30 | CoronerSelect 이모지 → 원형 캐릭터 사진(thumbnail)으로 교체 |
| 2026-03-30 | DeathCertificate 워터마크 → sajugpt.co.kr 하이퍼링크로 변경 |

---

## 배포 전 필수 작업

1. **Supabase DB 마이그레이션**: `npx supabase db push` (003 마이그레이션 — UPDATE RLS + 뷰)
2. **Vercel 환경변수**: `NEXT_PUBLIC_KAKAO_JS_KEY=da0e07cca0c104a3b59f79a24911587c` 추가
3. **카카오 개발자 콘솔**: sajugpt-viral.vercel.app 도메인을 플랫폼에 등록

---

## Phase 3 — 미구현 (추후)

1. 영안실 업데이트 알림 (피해자 N명 돌파)
2. 월간 부검 통계 리포트
3. 시즌 한정 부검 이벤트
4. 신규 검시관 캐릭터 추가
5. 챗봇 전환 CTA (sajugpt.co.kr 캐릭터 챗봇 완성 후)

---

## 핵심 커맨드

```bash
cd "/c/Users/gksru/사주GPT_바이럴"

# 개발
npx next dev --port 3000

# 빌드
npx next build

# DB 마이그레이션 (link 먼저 필요)
npx supabase link --project-ref tdrmvbsmxcewwaeuoqdx
npx supabase db push

# Edge Function 배포
npx supabase functions deploy analyze-saju-autopsy --no-verify-jwt

# GitHub push → Vercel 자동 배포
git add -A && git commit -m "..." && git push
```

---

## 참조 문서

| 문서 | 경로 |
|------|------|
| PRD (구체화 완료) | `★sub docs/PRD/PRD_SAJU_AUTOPSY.md` |
| 바이럴 전략서 | `★key docs/VIRAL_STRATEGY.md` |
| 개발 규칙 | `CLAUDE.md` |
| 디자인 시스템 | `★key docs/★DESIGN_SYSTEM★.md` |
| 색기 배틀 인계서 | `★sub docs/진행중/SEXY_BATTLE_HANDOVER.md` |
