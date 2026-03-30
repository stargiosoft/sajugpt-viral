# 세션 인계 문서 — 사주 법정 구현

> **작성일**: 2026-03-30 | **최종 업데이트**: 2026-03-30 | **상태**: Phase 1 구현 완료 (랜딩 리디자인 진행 중)

---

## 진행 상황 요약

| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 1 | PRD 기술 구체화 | ✅ 완료 | 7개 기술 섹션 추가 (T1~T8) |
| 2 | 타입 + 상수 정의 | ✅ 완료 | `types/court.ts`, `constants/court.ts` |
| 3 | DB 마이그레이션 | ✅ 완료 + 배포 | `003_create_saju_courts.sql` → Supabase MCP로 적용 완료 |
| 4 | Edge Function | ✅ 완료 + 배포 | `analyze-saju-court/index.ts` → Supabase MCP로 배포 완료 |
| 5 | 프론트엔드 컴포넌트 | ✅ 완료 | 8개 컴포넌트 (아래 목록) |
| 6 | 페이지 라우팅 + OG 메타 | ✅ 완료 | `/court` (정적 OG) |
| 7 | ViralHub 메뉴 연결 | ✅ 완료 | `ready: true`, `tag: 'NEW'` |
| 8 | 빌드 + 배포 | ✅ 완료 | GitHub push → Vercel 자동 배포 |
| 9 | 캐릭터 이미지 교체 | ✅ 완료 | 5장 모두 새 이미지로 교체 (400x400 webp, 11~14KB) |
| 10 | 랜딩 리디자인 (v3) | 🔄 진행 중 | 소환장 + 죄목 롤링 + 검사/변호사 공방 프리뷰 |

---

## 전체 파일 목록

### PRD
| 파일 | 설명 |
|------|------|
| `★sub docs/PRD/PRD_SAJU_COURT.md` | 기획 + 기술 구체화 (T1~T8 섹션 포함) |

### 백엔드
| 파일 | 설명 |
|------|------|
| `supabase/migrations/003_create_saju_courts.sql` | DB 테이블 (30개 컬럼 + 인덱스 2개 + RLS + 월간 랭킹 뷰) |
| `supabase/functions/analyze-saju-court/index.ts` | Edge Function (10단계 파이프라인, Gemini 3회 병렬 호출) |

### 프론트엔드 — 타입/상수
| 파일 | 설명 |
|------|------|
| `src/types/court.ts` | CrimeId, CourtResult, CourtStep, SentenceGrade 등 전체 타입 |
| `src/constants/court.ts` | 죄목 10종 (선택지 포함), 기간 5종, 형량 등급, 공범 4종, 로딩 메시지, 유틸 함수 |

### 프론트엔드 — 컴포넌트 (8개)
| 파일 | 설명 |
|------|------|
| `src/components/court/SajuCourtClient.tsx` | 메인 상태머신 (11상태: landing→input→analyzing→indictment→trial_1~4→verdict→accomplice→conversion) + 죄목 롤링 컴포넌트 |
| `src/components/court/CourtAnalyzing.tsx` | "긴급 체포 영장 발부 중..." 로딩 연출 (4단계 메시지) |
| `src/components/court/IndictmentCard.tsx` | 기소장 카드 (9:16, toPng 캡처, forwardRef) — 죄목+형량+현상금+검사vs변호사+석방일블러 |
| `src/components/court/TrialScreen.tsx` | 4턴 재판 인터랙션 — 검사/변호사 말풍선 + 유저 선택지 + 기간 수집 |
| `src/components/court/VerdictCard.tsx` | 판결문 카드 (9:16, toPng 캡처) — 유죄+형량+석방일(대형활자)+석방조건 |
| `src/components/court/AccompliceScreen.tsx` | 공범 지목 (4가지 선택 + 카카오톡/네이티브 공유) |
| `src/components/court/CourtShareButtons.tsx` | 공유 (네이티브 share / 클립보드 / 이미지 저장) |
| `src/components/court/CourtAnalyzing.tsx` | 법정 전용 로딩 화면 |

### 프론트엔드 — 페이지
| 파일 | 설명 |
|------|------|
| `src/app/court/page.tsx` | `/court` 메인 (정적 OG) |

### 이미지
| 파일 | 설명 |
|------|------|
| `public/characters/*.webp` | 5장 모두 교체 완료 (윤태산, 서휘윤, 도해결, 기지문, 최설계) |

---

## 핵심 아키텍처

### Edge Function 처리 흐름
```
1. 입력 검증 (birthday, gender)
2. Stargio 사주 API 호출 (3회 재시도)
3. excludeKeys 경량화 (8개 필드 제거)
4. extractHighlights() — 십성 10종 카운트 + 발달십성 5종 + 신살 + 일주
5. determineCrime() — 10가지 죄목 중 최고 점수 1개 선택
6. calculateCharmScore() — 매력 점수 0~7
7. calculateBaseSentence() — 기본형(1) + 매력가중 (기간은 프론트에서 추가)
8. calculateReleaseDate() — 규칙 기반 석방 시점
9. Gemini 3회 병렬 호출 (검사 기소발언 + 변호사 최후변론 + 석방 근거)
10. DB 저장 + 응답
```

### 프론트엔드 상태 머신
```
landing → input → analyzing → indictment → trial_1 → trial_2 → trial_3 → trial_4 → verdict → accomplice → conversion
```

### 형량 계산 (클라이언트)
```
최종형량 = baseSentence (Edge Function) + periodBonus (재판 중 기간 선택)
현상금 = 최종형량 × 500만원
퍼센타일 = 형량별 관대한 분포 (대부분 상위 30% 이내)
```

---

## 미완료 / 후속 작업

### 🔄 진행 중
| 작업 | 상태 | 설명 |
|------|------|------|
| 랜딩 리디자인 (v3) | 진행 중 | 소환장 컨셉으로 v3 작성 완료, 캐시 문제로 랜딩이 안 보이는 이슈 확인 필요 (시크릿 탭에서는 정상) |

### 📋 TODO (Phase 1 마무리)
| 작업 | 우선순위 | 설명 |
|------|---------|------|
| 랜딩 캐시 스킵 이슈 | 높음 | `loadSelfSaju()`에 이전 입력값이 있으면 landing 건너뛰고 input으로 직행 — 법정 처음 방문 시에도 랜딩을 보여줘야 함. 법정 전용 캐시 키 분리 또는 landing 스킵 조건 수정 필요 |
| 동적 OG (`/court/[courtId]`) | 중간 | 공범 지목 링크 프리뷰용 SSR 메타태그. 부검실 패턴 참조 |
| 재판 대사 유저 선택 반영 | 중간 | 현재 Gemini 변호사 최후변론이 사전 생성됨. trial_3 유저 선택을 반영하려면 trial_4에서 추가 Gemini 호출 또는 템플릿 분기 필요 |
| 재판 완료 시 DB 업데이트 | 낮음 | `trial_completed`, `final_sentence`, `period_input`, `bounty`, `percentile` 등을 서버에 PATCH |

### 📋 TODO (Phase 2)
| 작업 | 설명 |
|------|------|
| 석방 예정일 대운 연동 | excludeKeys에서 대운 필드 제거 → 대운 배열에서 합/충 해소 시점 계산 |
| 월간 죄목 랭킹 | `court_crime_stats` 뷰 활용 → 재방문 트리거 |
| "남의 사주로 기소장 뽑기" | 본인 결과 확인 후 → 친구/썸남 사주 입력 → 상대 기소장 생성 |

---

## 주요 설계 결정 & 근거

| 결정 | 근거 |
|------|------|
| Edge Function 1회 호출 + 형량은 클라이언트 | 기소장만 공유하고 떠나는 유저도 바이럴 가능. 재판 없이도 최소 바이럴 단위 확보 |
| 카드 문장 = 고정 템플릿, 재판 대사 = Gemini | 밈화될 문장은 품질 통제 (검사 팩폭/변호사 반박 10세트), 몰입 대사는 사주 맞춤화 |
| 석방 예정일 규칙 기반 (Phase 1) | 대운 필드 활성화 시 API 응답 크기 증가. MVP에서는 규칙 기반으로 충분 |
| 죄목 배정 점수 동점 시 배열 순서 우선 | 바이럴 임팩트 높은 죄목(짝사랑3년)이 상위 배치 |
| 퍼센타일 관대한 분포 | 낮은 숫자 → 공유 안 함. 대부분 상위 30% 이내로 설계 |

---

## 랜딩 리디자인 히스토리

| 버전 | 컨셉 | 문제점 |
|------|------|--------|
| v1 | 이모지 + 텍스트 + 버튼 | 너무 밋밋, 빈 공간 90% |
| v2 | 부검실 패턴 복제 (서류 카드 + 캐릭터 2열 + 칩 + 스텝) | 부검실과 구조 동일, 차별화 없음 |
| v3 (현재) | **소환장 컨셉** — 소환장 서류 히어로 + 검사 질문 대형 타이포 + 죄목 롤링 애니메이션 + 검사/변호사 대화 공방 + 역설 다크 카드 | 캐시 스킵 이슈로 확인 필요 |

### v3 차별화 포인트 (부검실 vs 법정)
| | 부검실 | 법정 |
|--|--------|------|
| 히어로 | 사망진단서 서류 1장 | 소환장 (기소 도장 + 검사 질문) |
| 동적 요소 | 없음 | 죄목 롤링 (2초마다 교체) |
| 캐릭터 | 2열 정보 카드 | 대화 공방 (팩폭 ↔ 반박 말풍선) |
| CTA | "부검 시작하기" | "출석하기" |

---

## Supabase 정보

| 항목 | 값 |
|------|---|
| Project ID | `tdrmvbsmxcewwaeuoqdx` |
| Edge Function | `analyze-saju-court` (v1, ACTIVE, no-verify-jwt) |
| DB 테이블 | `saju_courts` |
| DB 뷰 | `court_crime_stats` (월간 죄목 랭킹) |
| Secrets | `SAJU_API_KEY`, `GOOGLE_API_KEY` (기존과 동일) |

---

**최종 업데이트**: 2026-03-30
