# 세션 인계 문서 — 주가 조작단 Phase 1 구현

> **작성일**: 2026-03-30 | **상태**: Phase 1 구현 완료 + 배포 완료

---

## 진행 상황 요약

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | PRD 구체화 | ✅ 완료 | 기술 명세 8항목 추가 (상태머신, Edge Function, DB, Gemini 프롬프트, M&A 로직 등) |
| 2 | DB 마이그레이션 | ✅ 완료 + 배포 | `005_create_saju_stocks.sql` → Supabase apply_migration 완료 |
| 3 | 타입 + 상수 정의 | ✅ 완료 | `types/stock.ts`, `constants/stock.ts` |
| 4 | Edge Function | ✅ 완료 + 배포 | `analyze-saju-stock/index.ts` → `supabase functions deploy` 완료 |
| 5 | 프론트엔드 컴포넌트 | ✅ 완료 | 랜딩 + 입력 + 리포트 + 턴제 + 계획서 + 결과 (9개) |
| 6 | 페이지 라우팅 + OG 메타 | ✅ 완료 | `/stock` (정적), `/stock/[stockId]` (동적 SSR) |
| 7 | 빌드 + 배포 | ✅ 완료 | GitHub push → Vercel 자동 배포 |
| 8 | 바이럴 허브 활성화 | ✅ 완료 | ViralHub.tsx에서 "준비 중" → 활성 링크 (NEW 태그) |
| 9 | 랜딩페이지 | ✅ 완료 | 증권 HTS 터미널 테마 (틱커, 블러 가격, 경고 배너) |
| 10 | M&A Edge Function | ❌ 미구현 | Phase 2: `analyze-stock-ma` — DB 테이블은 생성 완료 |
| 11 | M&A 프론트엔드 | ❌ 미구현 | Phase 2: StockMaInput + StockMaCard 컴포넌트 |
| 12 | 실사용 테스트 + 디버깅 | ⏳ 필요 | Edge Function 실제 응답 검증, Gemini 토론 품질 확인 |

---

## 전체 파일 목록

### 문서

| 파일 | 설명 |
|------|------|
| `★sub docs/PRD/PRD_SAJU_STOCK.md` | 구체화된 PRD (기술 명세 포함) |
| `★sub docs/PRD/히스토리/PRD_SAJU_STOCK.md` | PRD 구체화 이전 버전 백업 |

### 백엔드

| 파일 | 설명 |
|------|------|
| `supabase/migrations/005_create_saju_stocks.sql` | `saju_stocks` + `stock_ma_analyses` 테이블 |
| `supabase/functions/analyze-saju-stock/index.ts` | 핵심 Edge Function (사주API → 가격계산 → Gemini 토론 → DB저장) |

### 프론트엔드 — 타입/상수

| 파일 | 설명 |
|------|------|
| `src/types/stock.ts` | StockStep(11단계), StockAnalysisResult, TurnData, UserChoices 등 |
| `src/constants/stock.ts` | 조작단원 3명, 연애상태 3종, 투자의견 5종, 가격등급 5종, 적정가등급 3종, 로딩메시지 |

### 프론트엔드 — 컴포넌트 (9/9 완료)

| 파일 | 설명 |
|------|------|
| `src/components/stock/StockClient.tsx` | 메인 상태머신 (landing→input→analyzing→report→briefing→turn1~4→plan→result) |
| `src/components/stock/StockLanding.tsx` | 증권 HTS 터미널 랜딩 (틱커테이프, 블러가격, 경고배너, 조작단원 대기) |
| `src/components/stock/StockInput.tsx` | 입력 폼 (성별+생년월일+시간+양음력+연애상태). 다크 HTS 테마 |
| `src/components/stock/StockAnalyzing.tsx` | 터미널 스타일 로딩 연출 (순차 메시지, 초록 터미널 텍스트) |
| `src/components/stock/StockReportCard.tsx` | 종목 리포트 카드 (forwardRef, toPng 캡처, SVG 차트, 투자의견 뱃지) |
| `src/components/stock/StockBriefing.tsx` | "긴급 소집" 연출 (빨간 경고, 3캐릭터 순차 입장) |
| `src/components/stock/StockTurn.tsx` | 턴제 토론 UI (채팅 버블 + 3지선다 선택) |
| `src/components/stock/StockPlanCard.tsx` | 작전 계획서 카드 (forwardRef, 3단계 로드맵, 3단계 잠금) |
| `src/components/stock/StockResult.tsx` | 결과 + 공유 + CTA (3캐릭터 전환 버튼) |

### 프론트엔드 — 페이지

| 파일 | 설명 |
|------|------|
| `src/app/stock/page.tsx` | `/stock` 메인 (정적 OG) |
| `src/app/stock/[stockId]/page.tsx` | `/stock/[stockId]` 동적 OG SSR (generateMetadata) |

---

## 아키텍처

### 상태 머신 플로우

```
landing → input → analyzing → report → briefing → turn1 → turn2 → turn3 → turn4 → plan → result
  ↑                                                                                         ↓
  └─────────────────────────────────── handleReset ─────────────────────────────────────────┘
```

- `landing`: 증권 HTS 터미널 테마 랜딩 (캐시된 사주 있으면 스킵 → input)
- `report`: 종목 리포트 카드 → 1차 공유 포인트
- `briefing → turn1~4`: 3캐릭터 턴제 토론 (4턴, 턴1 선택에 따라 턴2 분기)
- `plan`: 작전 계획서 (3단계, 3단계 잠금)
- `result`: 공유 + 챗봇 CTA

### Edge Function 파이프라인

```
1. 입력 검증
2. Stargio 사주 API 호출 (재시도 3회)
3. excludeKeys 경량화
4. extractSajuHighlights() — 사주 원국 요소 추출 (도화살 개수, 공망 등)
5. 가격 계산 (deterministic):
   - calculateCurrentPrice(highlights, relationshipStatus)
   - calculateFairValue(highlights)
   - calculateTargetPrice(fairValue)
   - determineInvestmentOpinion()
   - generateChartData()
6. Gemini 2.5 Flash 호출 — 턴제 토론 전체 사전 생성
   - turn1 (공통) + turn2 (3분기) + turn3~4 (공통) = 6세트
   - 실패 시 폴백 대사 사용
7. 작전 계획서 구성
8. DB 저장 (saju_stocks)
9. JSON 응답 반환
```

### 턴제 토론 분기 구조

```
턴1 (공통 1세트)
  ├─ 유저 선택 A (강도현) → 턴2-A
  ├─ 유저 선택 B (윤서율) → 턴2-B
  └─ 유저 선택 C (차민혁) → 턴2-C
턴3 (공통) ← 핵심 원인 수렴
턴4 (공통) ← 작전 설계 + 목표 선택
```

프론트에서 클라이언트 사이드 턴 전환 (추가 API 호출 없음).

### 가격 산정 로직 요약

| 항목 | 공식 | 범위 |
|------|------|------|
| 현재가 | 5,000 + 연애상태 가산 - 억압 감소 + 모멘텀 가산 | 300~12,000원 |
| 적정가 | 10,000 + 매력 + 내면 + 역량 가산 | 12,000~35,000원 |
| 목표가 | 적정가 × (0.8~1.0) | 적정가의 80~100% |
| 저평가율 | (1 - 현재가/적정가) × 100 | 0~97% |

### 캐릭터 3명

| ID | 이름 | 포지션 | 색상 |
|----|------|--------|------|
| `kang` | 강도현 | 작전 본부장 (공격파) | `#DC2626` (빨강) |
| `yoon` | 윤서율 | 펀더멘털 분석가 (가치파) | `#2563EB` (파랑) |
| `cha` | 차민혁 | 차트 전략가 (타이밍파) | `#059669` (초록) |

---

## 주요 변경 사항 (사용자 수정 반영)

StockClient에 사용자가 아래 변경을 적용함:
- `loadSelfSaju()` / `saveSelfSaju()` 공통 캐시 연동 (`@/lib/sajuCache`)
- 캐시된 사주 정보가 있으면 landing 스킵 → input 직행
- 입력값 변경 시 자동 캐시 저장

---

## 알려진 이슈 / 확인 필요 사항

### Edge Function
- Gemini 토론 생성 품질 미검증 — 실제 사주 데이터로 테스트 필요
- Gemini 응답 JSON 파싱 실패 시 폴백 대사가 정상 작동하는지 확인 필요
- 폴백 대사의 턴2는 3분기 모두 동일한 내용 — Gemini 성공 시에만 분기 차이 발생

### 프론트엔드
- StockReportCard의 SVG 차트 → toPng 캡처 시 렌더링 확인 필요 (iOS Safari)
- 턴제 토론 스크롤 — 긴 대사 시 스크롤 가능한지 확인
- StockResult의 공유 버튼 → 실제 이미지 저장/클립보드 동작 확인

### 배포
- Supabase Secrets에 `SAJU_API_KEY`, `GOOGLE_API_KEY` 설정 확인
- Edge Function이 `--no-verify-jwt`로 배포됨 (비회원 전용 서비스)

---

## 다음 단계 (Phase 2)

| 우선순위 | 작업 | 설명 |
|---------|------|------|
| **P0** | 실사용 테스트 | 실제 생년월일로 전체 플로우 테스트, Gemini 토론 품질 확인 |
| **P0** | 디버깅 | Edge Function 로그 확인, 에러 핸들링 보완 |
| **P1** | M&A 시너지 분석 | `analyze-stock-ma` Edge Function + StockMaInput/StockMaCard 컴포넌트 |
| **P1** | 공유 링크 최적화 | `/stock/[stockId]` 페이지에서 결과 복원 (현재는 빈 페이지) |
| **P2** | 디자인 폴리싱 | 리포트 카드 디자인 세밀 조정, 턴제 토론 UX 개선 |
| **P2** | 재방문 트리거 | 급등 알림, 주간 시황 리포트 (PWA 푸시 or 이메일) |

---

## 빠른 시작 가이드

### 로컬 개발
```bash
cd /c/Users/gksru/사주GPT_바이럴
npx next dev
# http://localhost:3000/stock
```

### Edge Function 배포
```bash
npx supabase functions deploy analyze-saju-stock --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx
```

### DB 마이그레이션 (이미 완료)
```bash
# Supabase MCP의 apply_migration 도구 사용
# 또는 Supabase Dashboard > SQL Editor에서 직접 실행
```

### 관련 PRD
```
★sub docs/PRD/PRD_SAJU_STOCK.md
```

---

**최종 업데이트**: 2026-03-30
