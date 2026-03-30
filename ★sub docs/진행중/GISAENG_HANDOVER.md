# 기생 시뮬레이션 인계 문서

> **작성일**: 2026-03-30 | **상태**: Phase 1 MVP 완성 + 랜딩페이지 리디자인 + 배포 완료

---

## 완료된 작업

### PRD 구체화
- `★sub docs/PRD/PRD_GISAENG_TEST.md`에 **기술 구현 명세 13개 섹션 추가** (T-1 ~ T-13)
- 아키텍처 (2단계 서버 호출 + 클라이언트 로컬 시뮬), Edge Function 설계, Gemini 프롬프트, DB 스키마, URL/OG, 상태 머신, 에셋, 타입, 컴포넌트 구조, 에러 처리 등

### DB
- `gisaeng_results` 테이블 생성 완료 (Supabase MCP `apply_migration`)
- 컬럼: 기생 카드 데이터(JSONB) + 시뮬 결과(JSONB) + 최종 티어/급여 + 사주 하이라이트
- RLS: anon 읽기 허용
- 인덱스: `created_at DESC`, `gisaeng_type`, `final_tier`
- 2단계 업데이트 패턴: `card_generated` → `completed`

### Edge Function 2개
| 함수 | 역할 | 배포 상태 |
|------|------|----------|
| `analyze-gisaeng` | 사주 API → 능력치 5종 산출 → 기생 유형 배정 → 선비 게이지 → Gemini 서사 → DB insert | ✅ 배포됨 |
| `save-gisaeng-result` | 시뮬 결과 수신 → Gemini 결산 서사 → DB update | ✅ 배포됨 |

- CORS: 기존 `server/cors.ts` 공유
- Secrets: `SAJU_API_KEY`, `GOOGLE_API_KEY` (기존 등록분 공유)
- Gemini: `gemini-2.5-flash`, JSON 출력 + 후처리 + 폴백 텍스트

### 프론트엔드

#### 타입/상수/로직
| 파일 | 내용 |
|------|------|
| `src/types/gisaeng.ts` | 전체 타입 (GisaengStep 9단계, Stats, Seonbi, Round, Simulation 등) |
| `src/constants/gisaeng.ts` | 기생 유형 6종, 선비 3명, 라운드 1~3 선택지, 티어 정보, 오행 상성, 폴백 서사 |
| `src/lib/gisaengSimulation.ts` | judgeChoice, applyEffects, judgeTier, calculateSalary 등 클라이언트 로직 |

#### 컴포넌트 (src/components/gisaeng/)
| 컴포넌트 | 역할 |
|----------|------|
| `GisaengClient.tsx` | 메인 상태머신 — 9단계 (landing→input→analyzing→card→r1→r2→r3→calculating→result) |
| `GisaengLanding.tsx` | **한지+먹 아이덴티티 랜딩** — 크림 배경, 주칠 CTA, 선비 카드, 티어 프리뷰 |
| `GisaengAnalyzing.tsx` | "기방 문 여는 중..." 로딩 (analyzing/calculating 공용) |
| `GisaengCalculating.tsx` | 결산 중 로딩 (Analyzing 래퍼) |
| `GisaengCardView.tsx` | 기생 능력치 카드 — 유형별 그라디언트, StatBar 5개, 살 태그 |
| `StatBar.tsx` | 능력치 바 애니메이션 |
| `SeonbiGauge.tsx` | 선비 3명 ♥충성도/👁의심도 실시간 게이지 |
| `RoundScreen.tsx` | 라운드 공통 — 상황 설명 + 선택지 3개 + 성공/실패 판정 + 게이지 업데이트 |
| `GisaengResultCard.tsx` | 최종 결산 카드 (forwardRef, toPng 캡처 대상) |
| `GisaengShareButtons.tsx` | 공유 (네이티브/링크복사/이미지저장) |
| `GisaengCTA.tsx` | 유료 전환 — 선비 유형별 CTA 카피 + D티어 전용 |

#### 페이지
| 경로 | 역할 |
|------|------|
| `/gisaeng` | 정적 OG + GisaengClient |
| `/gisaeng/[resultId]` | 동적 OG (SSR generateMetadata) + GisaengClient |

#### ViralHub 연동
- `ViralHub.tsx`에서 기생 시뮬 항목: `href: '/gisaeng'`, `ready: true`, `tag: 'NEW'`
- 주가조작단 변경도 같이 섞여 있으므로 아직 커밋 안 됨 (unstaged 상태)

### 랜딩페이지 리디자인
- 기존 다크 퍼플 템플릿에서 **완전 분리**
- 한지 크림 배경 `#F5F0E8` + 먹색 텍스트 `#1A1715` + 주칠 크림슨 CTA `#B8423A`
- 한자 장식 (解語花, 壹貳參肆), 선비 캐릭터 카드, 티어 프리뷰
- SVG 한지 텍스처 + 먹 브러시 디바이더
- 도발 카피 다크 카드 ("S티어 월 830냥ㅋㅋ")

### 배포
- Git push → Vercel 자동 배포 완료
- DB 마이그레이션: Supabase MCP `apply_migration` 완료
- Edge Function 2개: `supabase functions deploy` 완료

---

## 현재 프로젝트 상태

### 라이브 URL
- 메인: https://sajugpt-viral.vercel.app/gisaeng
- 공유: https://sajugpt-viral.vercel.app/gisaeng/[resultId]

### Git 상태
- 브랜치: `master` (단일)
- 최신 커밋: `2b4707b style: 기생 시뮬 랜딩페이지 한지+먹 아이덴티티 리디자인`
- unstaged 변경 다수 (다른 기능 작업물) — 기생 시뮬과 무관

### Supabase
- Project: `tdrmvbsmxcewwaeuoqdx`
- 테이블: `gisaeng_results` (생성 완료)
- Edge Functions: `analyze-gisaeng`, `save-gisaeng-result` (배포 완료)

---

## 알려진 이슈 & TODO

### 에셋 부재
- 기생 유형 6종 + 선비 3명 = **이미지 9장 미제작**
- 현재 이모지+그라디언트 원형으로 대체 중 (`GisaengCardView`, `SeonbiGauge`)
- 에셋 완성 시 `public/characters/gisaeng/` 디렉토리에 배치 → 컴포넌트 prop으로 교체

### 시뮬레이션 밸런스
- 능력치 산출 공식이 PRD 기반이지만, 실제 사주 데이터 분포와 매칭되는지 검증 필요
- 특정 사주에서 능력치가 극단적(전부 20대 or 전부 90대)일 수 있음
- 라운드 선택지 threshold가 너무 높으면 대부분 실패 → D티어 과다 발생 가능

### 라운드 2 동적 분기
- 현재: 👁 가장 높은 선비 1명만 의심 이벤트 발동
- 전원 이탈 시 → 바로 결산 (라운드 스킵)
- 라운드 1에서 이탈자가 나올 경우 라운드 2 선택지가 맞지 않을 수 있음 (엣지 케이스)

### 뒤로가기 처리
- 라운드 중 브라우저 뒤로가기 시 시뮬 데이터 소실
- 기생 카드는 DB에 저장되어 있으므로 resultId로 재시작 가능하나 **미구현**
- MVP에서는 허용 (시뮬 재시작 유도)

### CTA 연동
- "이 선비와 대화하기" 클릭 시 현재 `trackEvent`만 발생
- 실제 X플레어 캐릭터 챗봇 URL 연결 미구현 (Phase 2)
- D티어 "운명 상담받기"도 동일

### OG 이미지
- 텍스트 기반 OG만 구현 (title + description)
- OG 이미지 (opengraph-image.tsx) 미구현 → 카카오톡 프리뷰에 썸네일 없음

---

## 파일 인벤토리

```
src/
├── types/gisaeng.ts                    # 타입 전체
├── constants/gisaeng.ts                # 상수 (유형, 선비, 라운드, 티어, 폴백)
├── lib/gisaengSimulation.ts            # 시뮬 로직 (판정, 게이지, 급여)
├── app/gisaeng/
│   ├── page.tsx                        # 정적 OG 메인
│   └── [resultId]/page.tsx             # 동적 OG 공유
└── components/gisaeng/
    ├── GisaengClient.tsx               # 메인 상태머신
    ├── GisaengLanding.tsx              # 한지+먹 랜딩
    ├── GisaengAnalyzing.tsx            # 분석 중 로딩
    ├── GisaengCalculating.tsx          # 결산 중 로딩
    ├── GisaengCardView.tsx             # 기생 능력치 카드
    ├── StatBar.tsx                     # 능력치 바
    ├── SeonbiGauge.tsx                 # 선비 게이지
    ├── RoundScreen.tsx                 # 라운드 공통
    ├── GisaengResultCard.tsx           # 결산 카드 (toPng)
    ├── GisaengShareButtons.tsx         # 공유
    └── GisaengCTA.tsx                  # 유료 전환

supabase/
├── functions/
│   ├── analyze-gisaeng/index.ts        # 1차: 기생 카드 생성
│   └── save-gisaeng-result/index.ts    # 2차: 결산 저장
└── migrations/
    └── 004_create_gisaeng_results.sql  # DB 스키마
```

---

## 핵심 아키텍처 결정 사항

1. **시뮬 3라운드는 클라이언트 로컬 처리** — 능력치 vs 기준값 단순 비교이므로 서버 왕복 불필요. 치트 가능하나 비경쟁 콘텐츠이므로 무관.

2. **Edge Function 2개 분리** — 기생 카드 생성 시점에 DB 저장 → 시뮬 시작 전 공유 링크 즉시 사용 가능 (1차). 시뮬 완료 후 결산 결과 업데이트 (2차).

3. **Gemini JSON 출력** — 색기배틀(텍스트 출력)과 달리 JSON 응답으로 기생 이름+서사+평가를 한 번에 받음. 파싱 실패 시 폴백.

4. **한지+먹 랜딩 디자인** — 기존 4개 바이럴 기능 모두 다크 퍼플 동일 템플릿 → 기생 시뮬만 조선시대 비주얼 아이덴티티로 차별화.

---

**최종 업데이트**: 2026-03-30
