# 세션 인계 문서 — 데이트 시뮬레이션 구현

> **작성일**: 2026-03-30 | **최종 업데이트**: 2026-03-30 | **상태**: Phase 1 구현 완료 (배포 전)

---

## 진행 상황 요약

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | PRD 기술 구체화 | ✅ 완료 | 궁합 공식, 대화 트리 구조, 4차원 점수 산출, Gemini 프롬프트 등 |
| 2 | 타입 + 상수 정의 | ✅ 완료 | `types/dating.ts`, `constants/dating-characters.ts` |
| 3 | DB 마이그레이션 | ✅ 완료 | `006_create_dating_results.sql` — **미배포 (Supabase에 적용 필요)** |
| 4 | Edge Function 1 (분석) | ✅ 완료 | `analyze-dating-sim` — **미배포** |
| 5 | Edge Function 2 (대화 생성) | ✅ 완료 | `generate-dating-conversation` — **미배포** |
| 6 | Edge Function 3 (결과 확정) | ✅ 완료 | `finalize-dating-result` — **미배포** |
| 7 | 프론트엔드 메인 + 페이지 | ✅ 완료 | `DatingSimClient.tsx` + page.tsx 2개 |
| 8 | 프론트엔드 입력/추천 | ✅ 완료 | 4개 컴포넌트 |
| 9 | 프론트엔드 대화 시뮬레이션 | ✅ 완료 | `DatingConversation.tsx` (핵심) |
| 10 | 프론트엔드 결과/공유 | ✅ 완료 | `DatingResult.tsx` (채점표+등수+팩폭+공유) |
| 11 | ViralHub 메뉴 연결 | ✅ 완료 | `ready: true`, `tag: 'NEW'` |
| 12 | 랜딩 페이지 차별화 | ✅ 완료 | 실시간 대화 프리뷰 (타이핑 + 선택지 순환 애니메이션) |
| 13 | 빌드 검증 | ✅ 완료 | `npx next build` 성공 |
| 14 | DB 배포 | ❌ 미완료 | Supabase에 SQL 실행 필요 |
| 15 | Edge Function 배포 | ❌ 미완료 | 3개 함수 deploy 필요 |
| 16 | Git 커밋 + Vercel 배포 | ❌ 미완료 | |

---

## 전체 파일 목록

### PRD
| 파일 | 설명 |
|------|------|
| `★sub docs/PRD/PRD_DATING_SIMULATION.md` | 기획 + 기술 구체화 완전판 (궁합 공식, Gemini 프롬프트, DB 스키마, 컴포넌트 아키텍처) |

### 백엔드
| 파일 | 설명 |
|------|------|
| `supabase/migrations/006_create_dating_results.sql` | DB 테이블 (27개 컬럼 + 인덱스 4개 + RLS 3정책) |
| `supabase/functions/analyze-dating-sim/index.ts` | Edge Function 1: 사주 API → 궁합 계산 → 캐릭터 3명 추천 |
| `supabase/functions/generate-dating-conversation/index.ts` | Edge Function 2: Gemini로 5턴 대화 트리 일괄 생성 |
| `supabase/functions/finalize-dating-result/index.ts` | Edge Function 3: 등수 계산 + Gemini 팩폭 생성 + DB 확정 |

### 프론트엔드 — 타입/상수
| 파일 | 설명 |
|------|------|
| `src/types/dating.ts` | ~20개 인터페이스 (SajuIndicators, ConversationTree, ScoreTable, DatingStep 등) |
| `src/constants/dating-characters.ts` | 5캐릭터 데이팅 프로필, 궁합 공식, 일간 매핑 10간, 퍼센타일 뱃지, 조기종료 임계값 |

### 프론트엔드 — 컴포넌트 (7개)
| 파일 | 설명 |
|------|------|
| `src/components/dating-sim/DatingSimClient.tsx` | 메인 상태머신 (8단계: landing→input→analyzing→recommendation→preparing→conversation→calculating→result) |
| `src/components/dating-sim/DatingLanding.tsx` | 차별화 랜딩 — 실시간 대화 프리뷰 (타이핑 애니메이션 + 선택지 자동 순환 + 채점표 프리뷰) |
| `src/components/dating-sim/DatingInput.tsx` | 입력 폼 (BirthInput + GenderSelect + BirthTimeInput 재사용) |
| `src/components/dating-sim/DatingAnalyzing.tsx` | 로딩 화면 (3단계 메시지: 분석/준비/계산) |
| `src/components/dating-sim/CharacterRecommendation.tsx` | 캐릭터 3명 추천 카드 (궁합%, 성공률, 첫인상 대사) |
| `src/components/dating-sim/DatingConversation.tsx` | 5턴 대화 진행 — 호감도 게이지 + 선택지 3개 + 캐릭터 반응 + 조기 종료 |
| `src/components/dating-sim/DatingResult.tsx` | 결과 카드 — 채점표(4차원 점수 바) + 등수 + 퍼센타일 뱃지 + 사주 팩폭 + 공유 + CTA |

### 프론트엔드 — 페이지
| 파일 | 설명 |
|------|------|
| `src/app/dating-sim/page.tsx` | `/dating-sim` 메인 (정적 OG) |
| `src/app/dating-sim/[resultId]/page.tsx` | `/dating-sim/{resultId}` 결과 공유 (동적 OG — SSR로 점수/등수 메타 생성) |

---

## 핵심 아키텍처

### Edge Function 처리 흐름 (3개 분리)

```
[analyze-dating-sim] — 사주 분석 + 캐릭터 추천 (3~5초)
  1. Stargio 사주 API 호출 (3회 재시도, excludeKeys 8개)
  2. extractSajuIndicators() — 12개 지표 추출
  3. 일간(日干) 추출 → 10간 매핑
  4. calculateCompatibility() × 5캐릭터 → 상위 3명 추천
  5. 실시간 성공률 DB 조회
  6. DB 레코드 생성 (status: 'analyzing')
     ↓
[generate-dating-conversation] — 대화 트리 생성 (5~8초)
  1. getSuccessThreshold() — 궁합 기반 성공 임계값
  2. Gemini 2.5 Flash 1회 호출 → 5턴 대화 트리 JSON
  3. DB 업데이트 (status: 'conversation')
     ↓
[프론트엔드에서 대화 진행 — 점수 로컬 계산]
     ↓
[finalize-dating-result] — 결과 확정 (2~4초)
  1. DB 업데이트 (선택 히스토리, 점수, 성공 여부)
  2. 등수 계산 (같은 캐릭터 기준, SQL COUNT + GT)
  3. 같은 일간 평균 조회
  4. Gemini 팩폭 생성 1회 호출
  5. DB 최종 업데이트 (status: 'completed')
```

### 프론트엔드 상태 머신

```
landing → input → analyzing → recommendation → preparing → conversation → calculating → result
                                                                              ↑                    |
                                                                              └── retry ──────────┘
```

### 4차원 점수 산출 (프론트엔드)

```
1. 5턴 선택지의 scoreImpact 누적 (charm/conversation/sense/addiction)
2. 정규화: (raw + 10) / 28 × 9 + 1 → 1~10 스케일
3. 캐릭터별 가중 평균으로 총점 산출
   - 윤태산: charm 0.35, addiction 0.30 (매력+중독성 중시)
   - 도해결: conversation 0.35, sense 0.30 (대화력+센스 중시)
   - 서휘윤: conversation 0.30, charm 0.25 (대화력+매력 중시)
   - 기지문: addiction 0.35, charm 0.30 (중독성+매력 중시)
   - 최설계: sense 0.35, conversation 0.25 (센스+대화력 중시)
```

### 궁합 점수 산출

```typescript
calculateCompatibility(characterId, sajuIndicators)
  = base(30~40) + 조건별 bonus(10~25) → cap 100

예: 윤태산 = base(30) + doHwaSal(+25) + hongYeomSal(+15) + siksang≥25(+15) + fire≥30(+15)
```

### 호감도 시스템

```
초기값 = 궁합 점수 / 5 (0~20)
매 턴: affection += choice.affectionDelta (-10 ~ +20)
클램핑: 0~100
성공 판정: affection >= successThreshold (50~85, 궁합 기반)
조기 종료: affection <= 10 → 즉시 결과
```

---

## 랜딩 페이지 차별화 포인트

### 다른 기능 vs 데이트 시뮬레이션

| 요소 | 기존 6개 공통 | 데이트 시뮬레이션 |
|------|-------------|-----------------|
| 핵심 비주얼 | 캐릭터 아바타 나열 + 등급 리스트 | **실시간 대화 프리뷰** (타이핑 + 선택지 순환) |
| 인터랙션 | 없음 (정적 정보) | 3개 대화 자동 순환 (무한 루프) |
| 결과 미리보기 | 등급/티어 리스트 | **채점표 프리뷰** (4차원 점수 바 + 팩폭) |
| 진행방식 아이콘 | 이모지 | 넘버링 (01/02/03) |
| 액센트 컬러 | 보라/금/빨강 | **로즈 핑크 (#e89bab)** |

### 대화 프리뷰 동작

```
1. 캐릭터 대사 한 글자씩 타이핑 (45ms 간격)
2. 타이핑 완료 400ms 후 → 선택지 3개 슬라이드인
3. 2.2초 후 자동으로 랜덤 선택
4. 0.5초 후 캐릭터 반응 표시
5. 3초 후 다음 캐릭터 대화로 전환 (3개 순환)
```

---

## 미완료 / 후속 작업

### ❌ 배포 필수 (Phase 1 완료 조건)

| 작업 | 명령어 | 비고 |
|------|--------|------|
| DB 마이그레이션 적용 | Supabase 대시보드 SQL Editor에서 `006_create_dating_results.sql` 실행 | |
| Edge Function 1 배포 | `npx supabase functions deploy analyze-dating-sim --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx` | |
| Edge Function 2 배포 | `npx supabase functions deploy generate-dating-conversation --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx` | |
| Edge Function 3 배포 | `npx supabase functions deploy finalize-dating-result --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx` | |
| Git 커밋 + push | staging 브랜치 → Vercel 자동 배포 | |

### 📋 TODO (Phase 1 마무리)

| 작업 | 우선순위 | 설명 |
|------|---------|------|
| Gemini JSON 파싱 실패 핸들링 | 높음 | `generate-dating-conversation`에서 Gemini가 잘못된 JSON을 반환할 경우 폴백 대화 트리 필요 |
| 등수 계산 RPC 생성 | 중간 | `get_dating_rank` RPC 함수가 없으므로 현재 fallback 쿼리(COUNT) 사용 중. RPC 추가하면 성능 개선 |
| 재도전 시 DB 연결 | 중간 | `attempt_number`, `previous_result_id` 필드 활용하여 재도전 히스토리 연결 |
| 읽씹 랭킹 보드 | 낮음 | `LeaderboardSection` 컴포넌트 미구현. DB 쿼리는 PRD에 정의됨 |

### 📋 TODO (Phase 2)

| 작업 | 설명 |
|------|------|
| 친구 도전장 (2인 배틀) | 결과 공유 → 친구 도전 → 2인 비교 카드 자동 생성 |
| 캐릭터 뒷담 | 5턴 후 추천 3캐릭터가 유저에 대해 대화하는 장면 공개 |
| 턴별 스트리밍 전환 | Gemini 1회 일괄 → 턴별 호출로 전환 (응답 자연스러움 개선) |
| 챗봇 전환 CTA 연결 | `/chat/{characterId}?birthday=...&gender=...` 페이지 구현 |
| 난이도 모드 | 이지(서휘윤 28%) → 하드(최설계 10%) → 지옥(숨겨진 캐릭터) |

---

## 주요 설계 결정 & 근거

| 결정 | 근거 |
|------|------|
| Edge Function 3개 분리 (분석/대화/결과) | 기생 시뮬 패턴 따름. 단계별 독립 실행 + 실패 격리 |
| 대화 트리 Gemini 1회 일괄 생성 | 턴별 5회 호출 대비 비용 80% 절감 + 일관성 보장. 응답 시간 5~8초 허용 |
| 4차원 점수 프론트엔드 계산 | 대화 트리에 affectionDelta/scoreImpact 포함 → 서버 재호출 불필요 |
| 호감도 게이지 비공개 | 정확한 수치 대신 시각적 힌트만 → "얼마나 호감을 샀을까?" 긴장감 유지 |
| 캐릭터별 가중치 차별화 | 윤태산은 매력+중독성, 도해결은 대화력+센스 → 같은 선택도 캐릭터마다 다른 점수 |
| 조기 종료 (호감도 ≤ 10) | "1턴 만에 차임" → 읽씹 랭킹 보드 콘텐츠 + 재도전 유도 |
| 로즈 핑크 (#e89bab) 액센트 | 다른 기능(보라/금/빨강) 대비 "연애/데이트" 톤 차별화 |

---

## Supabase 정보

| 항목 | 값 |
|------|---|
| Project ID | `tdrmvbsmxcewwaeuoqdx` |
| Edge Functions | `analyze-dating-sim`, `generate-dating-conversation`, `finalize-dating-result` (모두 **미배포**) |
| DB 테이블 | `dating_results` (**미생성** — SQL 실행 필요) |
| Secrets | `SAJU_API_KEY`, `GOOGLE_API_KEY` (기존과 동일, 추가 설정 불필요) |

---

**최종 업데이트**: 2026-03-30
