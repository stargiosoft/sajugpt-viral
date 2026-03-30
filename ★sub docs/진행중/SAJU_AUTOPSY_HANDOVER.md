# 세션 인계 문서 — 사주 부검실 Phase 1 구현

> **작성일**: 2026-03-27 | **상태**: 구현 진행 중 (약 50% 완료)

---

## 진행 상황 요약

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | DB 마이그레이션 | ✅ 완료 | `002_create_saju_autopsies.sql` |
| 2 | 타입 + 상수 정의 | ✅ 완료 | `types/autopsy.ts`, `constants/autopsy.ts` |
| 3 | Edge Function | ✅ 완료 | `analyze-saju-autopsy/index.ts` |
| 4 | 프론트엔드 컴포넌트 | 🔧 진행 중 | 입력 컴포넌트 4개 완료, 나머지 4개 미구현 |
| 5 | 페이지 라우팅 + OG 메타 | ⬜ 미착수 | `/autopsy`, `/autopsy/[autopsyId]` |
| 6 | 빌드 + 배포 검증 | ⬜ 미착수 | next build + Edge Function deploy + DB migration push |

---

## 완료된 파일

### 백엔드

| 파일 | 설명 |
|------|------|
| `supabase/migrations/002_create_saju_autopsies.sql` | DB 테이블 스키마 (22개 컬럼 + 인덱스 3개 + RLS) |
| `supabase/functions/analyze-saju-autopsy/index.ts` | Edge Function 전체 (10단계 파이프라인) |

### 프론트엔드 — 타입/상수

| 파일 | 설명 |
|------|------|
| `src/types/autopsy.ts` | AutopsyResult, SajuHighlights, AutopsyStep 등 전체 타입 |
| `src/constants/autopsy.ts` | 사인 5종, 기간 4종, 검시관 2종, 사망 원인 10종, 등급 5종, 예후, 로딩 메시지 |

### 프론트엔드 — 컴포넌트 (완료 4/8)

| 파일 | 설명 |
|------|------|
| `src/components/autopsy/CauseOfDeathSelect.tsx` | ✅ 사인(死因) 5개 선택 UI (밸런스 게임 스타일) |
| `src/components/autopsy/DurationSelect.tsx` | ✅ 사귄 기간 4개 선택 (칩 버튼) |
| `src/components/autopsy/CoronerSelect.tsx` | ✅ 검시관 선택 — 윤태산(분노형) vs 서휘윤(치유형) |
| `src/components/autopsy/AnalyzingAutopsy.tsx` | ✅ "검시관 출동 중..." 로딩 연출 (펄싱 링 + 순차 텍스트) |

---

## 미구현 — 다음 세션에서 해야 할 것

### 4-1. 남은 컴포넌트 4개

| 컴포넌트 | 파일명 | 설명 |
|----------|--------|------|
| **AutopsyClient** | `autopsy/AutopsyClient.tsx` | 메인 상태머신 (landing→input→analyzing→card1→card2→card3→result). SexyBattleClient.tsx 패턴 참고. UTM 자동입력 + 폼 검증 + Edge Function 호출 + 3장 카드 스와이프 + 결과 화면 |
| **AutopsyCard** | `autopsy/AutopsyCard.tsx` | 3장 카드 공통 레이아웃. framer-motion AnimatePresence 슬라이드 트랜지션. card1(겉포장)/card2(해부)/card3(사망진단서) 공통 wrapper |
| **DeathCertificate** | `autopsy/DeathCertificate.tsx` | 사망진단서 카드 (toPng 캡처 대상). 9:16 비율. forwardRef. 사망 원인 + 등급 도장 + 후회 확률 + 예후 + 검시관 소견 + 워터마크. ResultCard.tsx 패턴 참고 |
| **AutopsyShareButtons** | `autopsy/AutopsyShareButtons.tsx` | 부검 전용 공유 버튼. ShareButtons.tsx 재사용하되 텍스트 변경: "🔬 너도 전남친 부검해봐" + 공유 텍스트: "나는 'OO 사망' 나왔는데 너는?" |

### 5. 페이지 라우팅

| 경로 | 파일 | 설명 |
|------|------|------|
| `/autopsy` | `src/app/autopsy/page.tsx` | 메인 입력 페이지 (정적 OG) |
| `/autopsy/[autopsyId]` | `src/app/autopsy/[autopsyId]/page.tsx` | 동적 OG SSR — generateMetadata()로 "안목 사망 판정 — F등급, 후회 확률 94.7%" |

> `/` 페이지의 리다이렉트 수정 불필요 — `/autopsy`는 독립 라우트.

### 6. 빌드 + 배포

1. **DB 마이그레이션 push**: `npx supabase db push --project-ref tdrmvbsmxcewwaeuoqdx`
2. **Edge Function 배포**: `npx supabase functions deploy analyze-saju-autopsy --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx`
3. **빌드 확인**: `npx next build` (에러 없이 통과)
4. **Vercel 배포**: `npx vercel deploy --prod` 또는 git push → 자동 배포
5. **실 테스트**: 브라우저에서 `/autopsy` 접속 → 사주 입력 → 3장 카드 → 사망진단서 확인

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

## 기존 컴포넌트 재사용 가이드

AutopsyClient에서 **그대로 import해서 쓸 수 있는** 기존 컴포넌트:

| 컴포넌트 | 용도 |
|----------|------|
| `BirthInput` | 생년월일 YYYY-MM-DD 입력 (숫자 키패드) |
| `GenderSelect` | 성별 선택 (슬라이딩 인디케이터) — 부검실은 기본값 "남성" |
| `BirthTimeInput` | 태어난 시간 4자리 입력 + 모르겠어요 토글 |
| `CharacterAvatar` | 검시관 아바타 (ResultCard 내 사용) |

재사용 가능한 **lib**:

| 모듈 | 함수 |
|------|------|
| `lib/fetchWithRetry` | `callEdgeFunction<AutopsyResult>('analyze-saju-autopsy', {...})` |
| `lib/analytics` | `parseUTM()`, `trackEvent()` |
| `lib/share` | `captureCardImage()`, `saveImage()`, `copyToClipboard()`, `shareNative()` — 텍스트만 부검용으로 변경 |

---

## 핵심 패턴 (SexyBattleClient 참고)

```typescript
// 1. 24시간 형식 변환 함수 그대로 복사
function convertTo24Hour(time: string): string { ... }

// 2. 상태 관리
const [step, setStep] = useState<AutopsyStep>('landing');
const [birthDate, setBirthDate] = useState('');
const [birthTime, setBirthTime] = useState('');
const [unknownTime, setUnknownTime] = useState(true);
const [gender, setGender] = useState<Gender>('male');  // 부검은 기본 남성
const [causeInput, setCauseInput] = useState<CauseOfDeathInput | null>(null);
const [duration, setDuration] = useState<RelationshipDuration | null>(null);
const [coronerId, setCoronerId] = useState<CoronerId | null>(null);
const [result, setResult] = useState<AutopsyResult | null>(null);

// 3. 폼 검증 — 기존 + 추가 필드 3개 체크
const isFormValid = useCallback(() => {
  // birthDate 8자리 + causeInput + duration + coronerId 모두 선택됨
}, [...]);

// 4. 제출 — 최소 2.5초 딜레이 + Edge Function 호출
const handleSubmit = async () => {
  setStep('analyzing');
  const minDelay = new Promise(r => setTimeout(r, 2500));
  const [data] = await Promise.all([
    callEdgeFunction<AutopsyResult>('analyze-saju-autopsy', { ... }),
    minDelay,
  ]);
  setResult(data);
  setStep('card1');  // 색기 배틀과 다르게 card1부터 시작
};

// 5. 카드 스와이프
// card1 → "다음" → card2 → "다음" → card3 → "결과 보기" → result
```

---

## 디자인 참고

- **카드 배경**: 사망진단서 느낌 — 밝은 크림/아이보리 배경 + 검은 테두리 + 도장 요소
- **색기 배틀과 다른 점**: 색기 배틀은 다크 그라데이션, 부검실은 서류/의료 톤
- **브랜드 색상**: `#7A38D8` (primary), `#F7F2FA` (light) — 동일
- **등급 도장 색상**: F=`#DC2626`, D=`#EA580C`, C=`#CA8A04`, B=`#2563EB`, A=`#7A38D8`
- **9:16 비율**: DeathCertificate 카드 (toPng 캡처)

---

## 참조 문서

| 문서 | 경로 |
|------|------|
| PRD (구체화 완료) | `★sub docs/PRD/PRD_SAJU_AUTOPSY.md` |
| 바이럴 전략서 | `★key docs/VIRAL_STRATEGY.md` |
| 개발 규칙 | `CLAUDE.md` |
| 디자인 시스템 | `★key docs/★DESIGN_SYSTEM★.md` |
| 색기 배틀 인계서 | `★sub docs/진행중/SEXY_BATTLE_HANDOVER.md` |

---

## 핵심 커맨드

```bash
cd "/c/Users/gksru/사주GPT_바이럴"

# 개발
npx next dev --port 3000

# 빌드
npx next build

# DB 마이그레이션
npx supabase db push --project-ref tdrmvbsmxcewwaeuoqdx

# Edge Function 배포
npx supabase functions deploy analyze-saju-autopsy --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx

# Supabase Secrets (이미 등록됨 — SAJU_API_KEY, GOOGLE_API_KEY)
npx supabase secrets list --project-ref tdrmvbsmxcewwaeuoqdx
```
