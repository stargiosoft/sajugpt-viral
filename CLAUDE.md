# CLAUDE.md - 사주GPT 바이럴 프로젝트 개발 규칙

> **이 파일은 Claude Code가 개발할 때 항상 참조하는 규칙입니다.**

---

## 프로젝트 개요

- **서비스**: 사주GPT 바이럴 마케팅 "색기 배틀" | **URL**: https://sajugpt-viral.vercel.app
- **GitHub**: https://github.com/stargiosoft/sajugpt-viral
- **목적**: 사주 기반 페로몬 등급 진단 → 결과 카드 공유 → 바이럴 루프 → AI 챗봇 전환
- **PRD**: `C:\Users\gksru\사주GPT_바이럴\★sub docs\PRD`

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| AI | Gemini 2.5 Flash (판정문 생성) |
| 사주 API | Stargio StargioSaju (SAJU_API_KEY) |
| 이미지 캡처 | html-to-image (toPng) |
| 애니메이션 | framer-motion |
| 배포 | Vercel |

**주요 통계**: 컴포넌트 10개 | Edge Function 1개 | 페이지 3개 | 캐릭터 5명

---

## 개발 원칙

- **나다운세와 독립된 프로젝트** — 빌드/배포/DB 완전 분리
- **비회원 전용** — 인증 없음 (persistSession: false)
- **모바일 퍼스트** — 440px 제한, 하단 고정 CTA
- **바이럴 최적화** — 동적 OG 메타태그 (Next.js SSR), 공유 링크 프리뷰
- **디자인 시스템**: `C:\Users\gksru\사주GPT_바이럴\★key docs\★DESIGN_SYSTEM★.md` 참조 필수

---

## 핵심 규칙 (Critical Rules)

### 1. 스타일링
- **Tailwind CSS 레이아웃 + inline style 타이포/색상** — 나다운세 동일 패턴
- **폰트 클래스 사용 금지**: `text-*`, `font-*`, `leading-*` → inline style
- **HEX 색상 inline style**: `bg-[#7A38D8]` ❌ → `style={{ backgroundColor: '#7A38D8' }}` ✅
- **브랜드 퍼플**: `#7A38D8` (primary), `#6B2FC2` (dark), `#F7F2FA` (light)
- **iOS Safari**: `overflow-hidden` + `border-radius` → `transform-gpu` 필수

### 2. TypeScript
- 모든 파일 TypeScript 필수 | `any` 타입 금지

### 3. Next.js App Router
- 서버 컴포넌트: `src/app/` 내 `page.tsx`, `layout.tsx`
- 클라이언트 컴포넌트: `'use client'` 디렉티브 필수 (hooks, framer-motion 사용 시)
- 환경변수: `NEXT_PUBLIC_` 접두어 (클라이언트), `process.env` (서버)
- 동적 OG: `generateMetadata()` in `/sexy-battle/[battleId]/page.tsx`

### 4. Supabase

| 항목 | 값 |
|------|---|
| Project ID | `tdrmvbsmxcewwaeuoqdx` |
| 환경변수 | `NEXT_PUBLIC_SUPABASE_PROJECT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

- 하드코딩 금지 — 환경변수 사용 필수

### 5. Edge Function

- **함수**: `analyze-sexy-battle` (Deno runtime)
- **배포**: `npx supabase functions deploy analyze-sexy-battle --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx`
- **CORS**: `supabase/functions/server/cors.ts` 사용 필수
- **Secrets**: `SAJU_API_KEY`, `GOOGLE_API_KEY` (Gemini용)

### 6. 사주 API 호출 (중요!)
- Edge Function에서 서버 직접 호출 (`SAJU_API_KEY` + 브라우저 헤더 흉내)
- 재시도 3회 (1초, 2초 간격) | 프론트엔드 직접 호출 금지
- excludeKeys 8개로 경량화 (월운보기, 본사주, 대운 등)
- 점수 산출: `calculateSexyScore()` — PRD 공식 기반

### 7. 보안
- 시크릿 하드코딩 금지 | 에러 메시지 일반화 | 입력값 서버 재검증
- **디버그 응답은 배포 전 반드시 제거**

---

## 파일 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃 (Pretendard, OG 메타)
│   ├── page.tsx            # / → /sexy-battle 리다이렉트
│   ├── globals.css         # Tailwind v4 @theme inline
│   └── sexy-battle/
│       ├── page.tsx        # 메인 (정적 OG)
│       └── [battleId]/
│           └── page.tsx    # 배틀별 동적 OG (SSR)
├── components/             # 클라이언트 컴포넌트 (10개)
│   ├── SexyBattleClient.tsx  # 메인 상태머신 (input→analyzing→result)
│   ├── BirthInput.tsx        # YYYY-MM-DD 자동포맷 (나다운세 패턴)
│   ├── GenderSelect.tsx      # 슬라이딩 인디케이터 토글
│   ├── BirthTimeInput.tsx    # 4자리→오전/오후 자동변환
│   ├── AnalyzingScreen.tsx   # 분석 중 애니메이션
│   ├── ResultCard.tsx        # 9:16 결과 카드 (toPng 캡처)
│   ├── ChatBubble.tsx        # 단톡방/DM 연출
│   ├── CharacterAvatar.tsx   # 캐릭터 원형 아바타
│   ├── GradeBadge.tsx        # 등급 배지 (SSS~CUT)
│   ├── ShareButtons.tsx      # 공유 (클립보드, 이미지, 네이티브)
│   └── CutScene.tsx          # 입구컷(0명) 반전 연출
├── constants/              # characters.ts, grades.ts
├── types/                  # battle.ts
└── lib/                    # supabase, fetchWithRetry, env, share, analytics

supabase/
├── functions/
│   ├── server/cors.ts              # CORS 유틸
│   └── analyze-sexy-battle/index.ts # 핵심 Edge Function
└── migrations/
    └── 001_create_sexy_battles.sql  # DB 스키마

public/characters/          # 캐릭터 webp 5장
```

---

## Phase 구분

- **Phase 1 (현재)**: 1인 진단 + 결과 카드 + 공유
- **Phase 2 (추후)**: 배틀 수락 + VS 카드 + 챗봇 전환 CTA — DB 스키마는 Phase 1에서 설계 완료

## 개발 체크리스트

- 독립적인 비동기 작업은 순차 `await` 대신 `Promise.all`로 병렬 실행
- 새 컴포넌트 만들기 전 기존 `src/components/` 인벤토리 확인 — 중복 생성 방지
- 개발/프로덕션 환경 플래그 체계화 — 디버그 코드가 프로덕션에 노출되지 않도록
- 이 CLAUDE.md는 200줄 이하로 유지

## Git 커밋 규칙

`<type>: <description>` — types: feat, fix, docs, style, refactor, test, chore
