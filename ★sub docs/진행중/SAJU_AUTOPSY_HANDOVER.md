# 세션 인계 문서 — 사주 부검실 Phase 1 구현

> **작성일**: 2026-03-27 | **최종 업데이트**: 2026-03-30 | **상태**: Phase 1 구현 완료 + 배포 완료

---

## 진행 상황 요약

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | DB 마이그레이션 | ✅ 완료 + 배포 | `002_create_saju_autopsies.sql` → Supabase push 완료 |
| 2 | 타입 + 상수 정의 | ✅ 완료 | `types/autopsy.ts`, `constants/autopsy.ts` |
| 3 | Edge Function | ✅ 완료 + 배포 | `analyze-saju-autopsy/index.ts` → Supabase deploy 완료 |
| 4 | 프론트엔드 컴포넌트 | ✅ 완료 | 입력 4개 + AutopsyClient + AutopsyCard + DeathCertificate + AutopsyShareButtons |
| 5 | 페이지 라우팅 + OG 메타 | ✅ 완료 | `/autopsy` (정적), `/autopsy/[autopsyId]` (동적 SSR) |
| 6 | 빌드 + 배포 | ✅ 완료 | GitHub push → Vercel 자동 배포 |
| 7 | 바이럴 허브 페이지 | ✅ 완료 | `/` → 7개 기능 리스트 (ViralHub.tsx) |
| 8 | 랜딩 페이지 디자인 | ✅ 완료 | taste-skill 기준 리디자인 (감정 스토리텔링 중심) |

---

## 전체 파일 목록

### 백엔드

| 파일 | 설명 |
|------|------|
| `supabase/migrations/002_create_saju_autopsies.sql` | DB 테이블 스키마 (22개 컬럼 + 인덱스 3개 + RLS) |
| `supabase/functions/analyze-saju-autopsy/index.ts` | Edge Function (10단계 파이프라인) |

### 프론트엔드 — 타입/상수

| 파일 | 설명 |
|------|------|
| `src/types/autopsy.ts` | AutopsyResult, SajuHighlights, AutopsyStep 등 전체 타입 |
| `src/constants/autopsy.ts` | 사인 5종, 기간 4종, 검시관 2종, 사망 원인 10종, 등급 5종, 예후, 로딩 메시지 |

### 프론트엔드 — 컴포넌트 (8/8 완료)

| 파일 | 설명 |
|------|------|
| `src/components/autopsy/AutopsyClient.tsx` | 메인 상태머신 (landing→input→analyzing→card1→card2→card3→result) |
| `src/components/autopsy/CauseOfDeathSelect.tsx` | 사인(死因) 5개 선택 UI |
| `src/components/autopsy/DurationSelect.tsx` | 사귄 기간 4개 선택 (칩 버튼) |
| `src/components/autopsy/CoronerSelect.tsx` | 검시관 선택 — 원형 캐릭터 사진 + 분노형/치유형 |
| `src/components/autopsy/AnalyzingAutopsy.tsx` | "검시관 출동 중..." 로딩 연출 |
| `src/components/autopsy/AutopsyCard.tsx` | 3장 카드 공통 레이아웃 (스와이프 트랜지션) |
| `src/components/autopsy/DeathCertificate.tsx` | 사망진단서 카드 (toPng 캡처, forwardRef, sajugpt.co.kr 링크) |
| `src/components/autopsy/AutopsyShareButtons.tsx` | 부검 전용 공유 버튼 ("너도 전남친 부검해봐") |

### 프론트엔드 — 페이지

| 파일 | 설명 |
|------|------|
| `src/app/page.tsx` | `/` → 바이럴 허브 리스트 (ViralHub.tsx) |
| `src/app/autopsy/page.tsx` | `/autopsy` 메인 (정적 OG) |
| `src/app/autopsy/[autopsyId]/page.tsx` | `/autopsy/[autopsyId]` 동적 OG SSR |
| `src/components/ViralHub.tsx` | 7개 바이럴 기능 리스트 페이지 |

---

## 기본값 설정

| 항목 | 값 | 이유 |
|------|-----|------|
| 성별 | `female` (여성) | 부검 대상 = 전남친이 주 타겟이지만, 입력하는 사람이 여성 |
| 태어난 시간 | 모르겠어요 해제 (입력 가능) | 시간 모르면 직접 체크하도록 |
| 검시관 | 미선택 (사용자 선택 필수) | 분노형 vs 치유형 선택이 핵심 경험 |

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

## Phase 2 — 미구현 (추후)

1. 영안실 뷰 + 안치하기 기능 + 다른 부검 결과 열람
2. 전전남친 리플레이 플로우 개선
3. 캐릭터 챗봇 전환 CTA 연동
4. 카카오톡 JS SDK 공유
5. OG 이미지 동적 생성

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
