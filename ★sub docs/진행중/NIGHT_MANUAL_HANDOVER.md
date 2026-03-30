# 세션 인계 문서 — 밤(夜) 설명서 Phase 1 구현

> **작성일**: 2026-03-30 | **최종 업데이트**: 2026-03-30 | **상태**: Phase 1 구현 + 배포 완료

---

## 진행 상황 요약

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | PRD 구체화 | ✅ 완료 | 사주 API 실제 응답 기반 능력치 매핑, Gemini 프롬프트, Edge Function 스펙, DB 스키마, 컴포넌트 구조 |
| 2 | DB 마이그레이션 | ✅ 완료 + 배포 | `002_create_night_manuals.sql` → Supabase MCP로 apply 완료 |
| 3 | 타입 + 상수 정의 | ✅ 완료 | `types/night-manual.ts`, `constants/night-manual.ts` |
| 4 | Edge Function | ✅ 완료 + 배포 | `analyze-night-manual/index.ts` → Supabase deploy 완료 |
| 5 | 프론트엔드 컴포넌트 | ✅ 완료 | 8개 컴포넌트 (6 step 상태머신 + debate 3 sub-step) |
| 6 | 페이지 라우팅 + OG 메타 | ✅ 완료 | `/night-manual` (정적), `/night-manual/[nightManualId]` (동적 SSR) |
| 7 | 랜딩 페이지 리디자인 | ✅ 완료 | 한지 두루마리 + 촛불 골드 + 병풍 엿보기 컨셉 |
| 8 | 바이럴 허브 활성화 | ✅ 완료 | ViralHub.tsx에서 `ready: true` + NEW 태그 |
| 9 | Vercel 환경변수 | ✅ 완료 | `NEXT_PUBLIC_SUPABASE_*` 3개 Production에 추가 |
| 10 | 빌드 + 배포 | ✅ 완료 | GitHub push → Vercel 자동 배포 |

---

## 전체 파일 목록

### 백엔드

| 파일 | 설명 |
|------|------|
| `supabase/migrations/002_create_night_manuals.sql` | DB 테이블 (17개 컬럼 + 인덱스 + RLS) |
| `supabase/functions/analyze-night-manual/index.ts` | Edge Function (9단계 파이프라인) |

### 프론트엔드 — 타입/상수

| 파일 | 설명 |
|------|------|
| `src/types/night-manual.ts` | NightManualResult, NightStats, ConstitutionType, ServantType 등 |
| `src/constants/night-manual.ts` | 체질 6종, 시종 3명, 궁합 매트릭스, 한 줄 서사 19개, 탈락 반응, Phase 2 개입 반응 |

### 프론트엔드 — 컴포넌트 (8개)

| 파일 | 설명 |
|------|------|
| `src/components/night-manual/NightManualClient.tsx` | 메인 상태머신 (7 step) — landing→input→analyzing→constitution→debate→selection→result |
| `src/components/night-manual/NightLanding.tsx` | 랜딩 페이지 (한지+골드 컨셉, 블러 프리뷰, 시종 소개, 체질 프리뷰) |
| `src/components/night-manual/NightBirthInput.tsx` | 생년월일 입력 (기존 BirthInput/GenderSelect/BirthTimeInput 재사용) |
| `src/components/night-manual/NightAnalyzing.tsx` | 로딩 연출 ("밤의 장막이 내려오는 중...") |
| `src/components/night-manual/ConstitutionCard.tsx` | 체질 평가표 카드 (능력치 5종 바 + 신살 + 총 매혹력) — 1차 캡처 포인트 |
| `src/components/night-manual/DebatePhase.tsx` | 난상토론 3단계 (eavesdrop→intervene→proposals), 채팅 버블 UI |
| `src/components/night-manual/ServantSelection.tsx` | 시종 선택 (3명 카드 + 궁합 표시) |
| `src/components/night-manual/NightResultCard.tsx` | 결산 카드 (toPng 캡처) + 탈락 반응 + 공유 버튼 + 한 줄 서사 |

### 페이지 라우트

| 파일 | 설명 |
|------|------|
| `src/app/night-manual/page.tsx` | 메인 페이지 (정적 OG) |
| `src/app/night-manual/[nightManualId]/page.tsx` | 공유 페이지 (동적 OG, SSR — 체질명+매혹력+선택 시종 표시) |

---

## 핵심 아키텍처

### Edge Function 파이프라인 (analyze-night-manual)

```
1. 입력 검증 (birthday, gender)
2. Stargio Saju API 호출 (3회 재시도, 브라우저 헤더)
3. excludeKeys 경량화 (월운보기, 대운, 오주 등 제거)
4. calculateNightStats() → 능력치 5종 + 도화살/홍염살
5. assignConstitution() → 체질 유형 + 등급
6. Gemini 2.5 Flash 호출 (Phase 1 + Phase 3 대사 동시 생성, JSON 출력)
7. 하드코딩 데이터 조립 (Phase 2 반응, 탈락 대사, 체질 서사)
8. Supabase INSERT → nightManualId 발급
9. 응답 반환
```

### 능력치 산정 로직

사주 API 필드 → 5가지 능력치 매핑:

| 능력치 | Base | 투출 보너스 | 신살/운성 보너스 |
|--------|------|-----------|---------------|
| **감도** | 발달십성.인성 × 1.2 | 정인 +12, 편인 +10 | 도화살 +15, 음욕살 +12, 목욕 +10 |
| **지배력** | 발달십성.관성 × 1.2 | 편관 +12, 정관 +8, 겁재 +8 | 양인살 +15, 괴강살 +12, 제왕 +10 |
| **중독성** | (식상+재성) × 0.6 | 상관 +10, 편재 +8 | 홍염살 +18, 도화살 +10, 음욕살 +8 |
| **민감도** | 발달십성.식상 × 1.2 | 식신 +12, 정인 +8, 시너지 +8 | 화개살 +15, 음욕살 +8, 태 +6 |
| **지구력** | 발달십성.비겁 × 1.2 | 비견 +10, 겁재 +10, 편관 +6 | 건록 +15, 관대 +10, 제왕 +8, 극신강 +10 |

### 대사 생성 전략

| 구간 | 방식 | 이유 |
|------|------|------|
| Phase 1 (엿듣기 토론) | **Gemini 생성** | 능력치 숫자가 매번 다르므로 동적 대사 필요 |
| Phase 2 (개입 반응) | **하드코딩** | 3선택지 × 3시종 = 9개, 짧고 정형화 |
| Phase 3 (최종 제안) | **Gemini 생성** | 체질+능력치 기반 개인화 필요 |
| 탈락 반응 | **하드코딩** | 시종별 고정 (PRD 대사 그대로) |
| 한 줄 서사 | **하드코딩** | 체질 6 × 시종 3 = 19개 (PRD 전량) |

### 프론트 데이터 흐름

```
Edge Function 응답 (모든 대사 포함)
  ↓
NightManualClient (result state 보유)
  ├── ConstitutionCard: result.stats, constitution, narrative
  ├── DebatePhase: result.phase1Script, phase2Reactions, phase3Proposals
  │   └── 내부 sub-step: eavesdrop → intervene (선택) → proposals
  ├── ServantSelection: result.phase3Proposals + 궁합 계산 (프론트)
  │   └── 선택 시 supabase.update() 직접 호출 (추가 API 없음)
  └── NightResultCard: result + selectedServant → 궁합/한줄서사 프론트 계산
```

---

## DB 스키마

```sql
night_manuals (
  id UUID PK,
  birthday TEXT, birth_time TEXT, gender TEXT,
  constitution_type TEXT,     -- simhwa/noejeon/myohyang/seu/janggang/yonghwa
  stats JSONB,                -- { sensitivity, dominance, addiction, awareness, endurance }
  total_charm INTEGER,
  do_hwa_sal BOOLEAN, hong_yeom_sal BOOLEAN,
  selected_servant TEXT,      -- beast/poet/butler (프론트에서 PATCH)
  compatibility_grade TEXT,   -- S/A/B/C (프론트에서 PATCH)
  result JSONB,               -- 전체 payload
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
)
```

---

## Vercel 환경변수

이번 세션에서 추가한 Production 환경변수:

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (클라이언트) |
| `NEXT_PUBLIC_SUPABASE_PROJECT_ID` | Edge Function 호출용 project ID |

> 기존에는 `VITE_` 접두사만 있었음 (Next.js에서 인식 불가). `NEXT_PUBLIC_` 접두사 버전을 추가.

---

## 유저 수정사항 (세션 중)

- `NightManualClient.tsx`: sessionStorage 캐시 대신 `loadSelfSaju()` / `saveSelfSaju()` 사용으로 변경 (`@/lib/sajuCache` import)
- `NightLanding.tsx`: fadeUp easing에 `as const` 타입 어서션 추가 (framer-motion 타입 호환)
- `ViralHub.tsx`: 사주 법정 description 변경
- `.env.local`: 카카오 JS 키 추가 (`NEXT_PUBLIC_KAKAO_JS_KEY`)

---

## 미구현 / Phase 2 TODO

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| X플레어 CTA | 결산 카드 하단 → 선택한 시종 = X플레어 캐릭터 챗봇 전환 | Phase 2 |
| UTM 추적 저장 | DB에 utm_source/medium/campaign 실제 저장 | 낮음 |
| 카카오톡 공유 | 카카오 SDK 공유 버튼 | 중간 |
| Gemini fallback 보강 | 체질별 하드코딩 대사 세트 (현재는 1개 공통 fallback) | 중간 |
| 결산 카드 이미지 최적화 | 9:16 비율 세로 카드로 toPng 캡처 영역 조정 | 낮음 |
| 리플레이 유도 | "S궁합 시종은 누구였을까?" 힌트 표시 | 낮음 |
| OG 이미지 | 동적 OG 이미지 생성 (현재 텍스트만) | 중간 |

---

## 커밋 히스토리

| SHA | 내용 |
|-----|------|
| `b39ce3c` | feat: 밤(夜) 설명서 기능 구현 (15 files, 2957 insertions) |
| `322fbb1` | feat: 밤 설명서 ViralHub에서 활성화 |
| `2ce1e0b` | chore: trigger redeploy with NEXT_PUBLIC_SUPABASE env vars |
| `dfcae0d` | style: 밤 설명서 랜딩페이지 고퀄 리디자인 |

---

## PRD 위치

- **메인 PRD**: `★sub docs/PRD/PRD_NIGHT_MANUAL.md`
- **구현 상세**: 같은 파일 하단 "구현 상세 (Implementation Spec)" 섹션
  - Impl 1~8: Edge Function, Gemini 프롬프트, DB, 컴포넌트 구조, OG, 정적 데이터, 등급, excludeKeys

---

**최종 업데이트**: 2026-03-30
