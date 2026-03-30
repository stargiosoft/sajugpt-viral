# 바이럴 기능 요구사항 정의서 (PRD)

## 프로젝트 개요

- **기능명**: 사주 부검실 — "EX의 연애 사망진단서"
- **바이럴 공식**: [법의학 부검/검시 A] + [사주 기반 전 연인 해부 B] = "이런 건 처음이다"
- **라우트**: `/autopsy`, `/autopsy/[autopsyId]`
- **Edge Function**: `analyze-saju-autopsy`
- **DB 테이블**: `saju_autopsies` + `autopsy_morgue_stats` (뷰)
- **검시관 캐릭터**: 윤태산 (분노형), 서휘윤 (치유형) — 사용자가 선택
- **바이럴 기능 간단 요약**: 사용자가 자신을 차버린/무시한 상대의 생년월일을 입력하면, 캐릭터가 검시관 역할로 그 사람의 사주를 단계별로 해부한다. "왜 이 사람이 널 못 알아봤는지"를 사주 프레임으로 부검하여 **사망진단서 카드** 1장을 발급한다. 윤태산은 "이 사주 봐, 식상이 이 모양이면 겉만 보는 놈이야. 이런 놈이 널 놓친 거지"로 분노형 부검, 서휘윤은 "이 분의 사주는 본질을 읽는 눈이 부족한 구조예요"로 치유형 부검을 진행한다. 사망진단서에 **"판정: 안목 사망", "후회 확률 94.7%"** 같은 등급·숫자가 붙어 자조이자 반격으로 공유된다. "윤태산이 내 전남친 사주 보고 안목 없다고 깜ㅋㅋ" — 이 한 줄이 같은 경험을 가진 여성 커뮤니티에서 전남친 부검 릴레이를 일으킨다. 부검 후 "영안실 안치" 선택 시 같은 사주 유형에게 당한 다른 여성들의 부검 결과를 볼 수 있어 "나만 당한 게 아니구나" 동질감이 재방문 사유가 된다.

---

## 바이럴 루프

### 바이럴을 일으키는 구조

1. **입력**: 상대 생년월일 + 사귄 기간 + "사인(死因)" 선택 + 검시관 선택(3초, 가입 불필요) → "검시관 출동 중..." 로딩 연출
2. **3장 카드 시퀀스**: 겉포장 분석 → 해부 소견 → 사망진단서. 스와이프할 때마다 한 겹씩 벗겨지는 구조 → **몰입 + 기대감 빌드업**
3. **사망진단서 카드**: 사망 원인 + 등급 + 후회 확률 + 검시관 소견이 담긴 카드 1장 → **바이럴 핵심**
4. **영안실 안치**: 같은 사주 유형 피해자 수 + 다른 부검 결과 열람 → **커뮤니티 + 재방문**
5. **캐릭터 리플레이**: 같은 상대를 다른 캐릭터(분노형/치유형)로 재부검 → 2회 플레이 + 비교 캡처
6. **전환**: "이 사주 유형에게 안 당하는 법" → 캐릭터 챗봇 1:1 유료 상담

### 유발 감정

| 감정 | 메커니즘 |
|------|---------|
| **공감 + 분노 (Hook)** | "사인" 선택지가 실제 경험 반영 — 고르는 순간 감정 올라옴 |
| **통쾌함 (Catharsis)** | 검시관이 상대의 사주를 까면서 "이 놈이 문제였지 네가 부족한 게 아냐" |
| **위로 + 자존감 회복 (Relief)** | "당신의 깊이를 알아볼 그릇이 안 됐던 거예요" |
| **자조적 유머 (Share)** | "안목 사망으로 사망 판정ㅋㅋ 후회 확률 97.2%래" → 웃기면서도 시원 |
| **동질감 (Community)** | "이 사주 유형에게 피해 입은 사람: 847명" → 나만 당한 게 아님 |
| **비교 (Envy)** | 사망 원인·등급 비교 → "너 전남친은 뭐로 나왔어?" |

### 논란 설계

- **부검 컨셉 자체가 논란의 엔진**: "전남친 사주를 부검한다고?" → "잔인하다" vs "시원하다" 갈림
- **사망 원인 명칭이 밈**: "안목 사망", "감정 불감증", "깊이 공포증" → 이름만으로 공유·비교 발생
- **캐릭터 톤이 논쟁 유발**: 윤태산의 "이런 놈 때문에 울었다고? 화난다 진짜" vs "이건 좀 과격한데"
- **스윗 스팟**: 상대를 까되 실명/개인정보 없이 사주 유형만 다룸 → 공격적이면서도 안전
- **서휘윤이 안전장치**: 까는 건 윤태산, 위로는 서휘윤 → 상처로 끝나지 않음

---

## 사용자 스토리

**As** (누가): 능력 있는데 외모로 저평가받거나, 자기보다 못한 사람에게 거절·무시당한 경험이 있는 2030 여성 유저는

**Want to** (무엇을 원한다): 나를 차버린/무시한 상대의 생년월일을 넣어서 "왜 이 사람이 날 못 알아봤는지"를 사주로 해부당하는 걸 보고, 사망진단서 카드를 친구들과 공유하며 "너 전남친도 넣어봐" 대화를 하기를 원한다.

**So that** (어떤 목적/가치를 위해): "내가 부족한 게 아니라 저 사람이 볼 눈이 없었다"는 확인으로 자존감을 회복하고, 같은 경험을 한 여성들과 "나만 이런 게 아니구나" 동질감을 느끼며, "이런 유형에게 다시 안 당하려면 어떻게 하지?"라는 동기로 캐릭터 챗봇 상담을 이어가기 위해.

---

## 상태 머신 (State Machine)

```
landing → input → analyzing → card1 → card2 → card3 → result → morgue(선택)
  ↑_______________________________________________________↓ (handleReset)
```

| Step | 화면 | 설명 |
|------|------|------|
| `landing` | 랜딩 | "너를 못 알아본 놈, 사주로 부검합니다" + 시작 버튼 |
| `input` | 입력 폼 | 사주 정보 + 사귄 기간 + 사인 선택 + 검시관 선택 |
| `analyzing` | 로딩 연출 | "검시관 출동 중..." 순차 텍스트 (2.5초 최소) |
| `card1` | 겉포장 분석 | 1장 카드 — "처음엔 괜찮았을 거야" |
| `card2` | 해부 소견 | 2장 카드 — "속을 열어보니까" |
| `card3` | 사망진단서 | 3장 카드 — 바이럴 핵심 (toPng 캡처 대상) |
| `result` | 결과 + CTA | 공유 버튼 + 리플레이 + 전환 CTA |
| `morgue` | 영안실 | 같은 사주 유형 통계 + 다른 부검 결과 열람 |

> **card1 → card2 → card3**: 스와이프 또는 "다음" 버튼으로 전환. framer-motion `AnimatePresence` + 슬라이드 트랜지션.

---

## MVP 필요 기능

### Step 1. 초저마찰 접수 — 사주 정보 + 3가지 선택

- 메인 화면: "너를 못 알아본 놈, 사주로 부검합니다" 문구 + 도전 버튼
- 사주 정보 입력 (상대):
  1. **성별**: 필수. 기본 "남성" 선택 (상대 = 전남친이 주 타겟)
  2. **생년월일**: 필수. 숫자 키패드 노출 (BirthInput 재사용)
  3. **태어난 시간**: 선택. "모름" 기본 선택 (BirthTimeInput 재사용)
  4. **양력/음력**: 양력 기본 선택
- 추가 입력 3가지:
  1. **사귄 기간** (선택지: "잠깐 만남", "몇 달", "1년 이상", "오래 만남")
  2. **사인(死因) 선택** — 밸런스 게임처럼 고르는 구조
  3. **검시관 선택** — 윤태산(분노형) vs 서휘윤(치유형)

#### 1-0. UTM 파라미터 자동입력 (사주GPT 제휴 유입)

사주GPT 광고 배너 클릭 시 아래 형식으로 유저 정보가 URL에 포함되어 유입된다:

```
/autopsy?utm_source=sajugpt&utm_medium=affiliate&utm_campaign=sdowha&birthday=199112252315&gender=male
```

**파라미터 파싱 및 자동입력 로직**:

```typescript
const params = new URLSearchParams(window.location.search);
const birthdayParam = params.get('birthday'); // "199112252315" (YYYYMMDDHHMI)
const genderParam = params.get('gender');     // "male" | "female"

if (birthdayParam && birthdayParam.length >= 8) {
  const year = birthdayParam.slice(0, 4);
  const month = birthdayParam.slice(4, 6);
  const day = birthdayParam.slice(6, 8);
  const hour = birthdayParam.slice(8, 10);
  const minute = birthdayParam.slice(10, 12);

  setBirthDate({ year, month, day });
  if (birthdayParam.length >= 10) {
    setBirthTime({ hour, minute });
  }
  setCalendarType('solar'); // 양력 기본값
}

if (genderParam) {
  setGender(genderParam === 'male' ? 'male' : 'female');
}
```

**핵심 규칙**:
- `birthday` 파라미터가 있으면 생년월일 + 시간 자동입력 → 유저는 확인만 하고 바로 시작
- `gender` 파라미터가 있으면 성별 자동입력
- 양력/음력은 **양력 기본값** 유지 (sajuGPT에서 양력으로 전달)
- 파라미터 없으면 기존 수동 입력 플로우 그대로
- **주의**: 부검실은 "상대"의 사주를 입력하는 구조 — UTM 파라미터로 들어온 정보가 상대 정보인지 본인 정보인지에 따라 어느 필드에 자동입력할지 결정 필요

#### 1-1. 사인(死因) 선택지 — 감정 증폭의 시작점

이 선택지 자체가 타겟층의 실제 경험을 반영. 고르는 순간부터 감정이 올라온다.

| ID | 사인 | 타겟 공감 포인트 |
|----|------|----------------|
| `ghosting` | **갑자기 연락 두절** | 가장 흔하고 가장 분한 경험 |
| `prettier` | **더 예쁜 여자 생김** | "내 가치를 외모로만 봤다" 핵심 분노 |
| `always_busy` | **만나자고 하면 항상 바쁨** | 정확히 뭐가 문제인지 몰라서 더 아픔 |
| `physical_only` | **잠자리만 찾음** | 분노 + 자괴감의 교차점 |
| `faded` | **이유 없이 식어버림** | 이유를 모르니까 자기 탓하게 됨 |

#### 1-2. 검시관 선택 — 분노형 vs 치유형

| ID | 검시관 | 톤 | 아이콘 |
|----|--------|-----|--------|
| `yoon-taesan` | 윤태산 | "이런 놈 때문에 울었다고? 화난다 진짜" — 분노 대리, 팩폭 | 🔥 |
| `seo-hwiyoon` | 서휘윤 | "당신 탓이 아니에요" — 위로, 자존감 회복 | 🌙 |

> 선택에 따라 Gemini 프롬프트의 톤이 완전히 달라진다. 결과 카드에 검시관 도장이 찍힌다.

- 입력 직후 **"검시관 출동 중..."** 로딩 연출:
  - "사건 접수 중..."
  - "검시관 윤태산 / 서휘윤 현장 도착..."
  - "사인 확인 중..."
  - "사주 원국 해부 준비 중..."
  - → 기대감 빌드업 (2.5초 최소, Edge Function 응답까지)

### Step 2. 부검 진행 — 3장 카드 시퀀스 (스와이프)

캐릭터가 검시관 포지션에서 상대의 사주를 한 겹씩 벗겨낸다. 카드를 스와이프할 때마다 다음 단계가 열린다.

#### 2-1. 1장: 겉포장 분석 — "처음엔 괜찮았을 거야"

상대 사주에서 겉으로 보이는 매력 요소를 읽는다. 사용자가 "맞아, 처음엔 진짜 좋았는데…" 공감하는 지점.

| 사주 트리거 | 겉포장 분석 예시 |
|------------|----------------|
| 식신 강 | "첫인상이 다정해 보이는 사주. 처음엔 잘해줬을 거야" |
| 편재 강 | "말재간 좋고 분위기 잘 띄우는 타입. 빠지기 쉬운 구조" |
| 정관 투출 | "겉으로는 듬직하고 책임감 있어 보이는 사주" |
| 도화살 보유 | "일단 매력은 있어. 끌렸던 건 당연해" |

**윤태산 톤**: "일주가 이러니 첫인상은 괜찮았겠지. 다정한 척은 기가 막히게 하는 사주거든."
**서휘윤 톤**: "이 분의 일주를 보면, 처음에 좋은 인상을 주는 구조예요. 당신이 끌렸던 건 자연스러운 거예요."

#### 2-2. 2장: 해부 소견 — "속을 열어보니까"

본색을 드러내는 부분. 사인(死因)과 사주를 교차시켜 "왜 이렇게 행동했는지"를 해부한다.

| 사인 × 사주 | 해부 소견 예시 |
|-------------|--------------|
| 연락 두절 + 편인 과다 | "편인이 이 꼴이면 감정 처리를 안 하고 도망가는 구조야" |
| 더 예쁜 여자 + 편재 강 | "편재가 이렇게 강하면 새 자극에 약한 거야. 깊이를 못 보는 사주" |
| 항상 바쁨 + 비견 강 | "비견이 이러면 자기 세계가 전부인 사람. 네가 뭘 해도 달라지지 않았을 거야" |
| 잠자리만 + 편관 강 | "편관이 이렇게 돌출되면 소유욕은 있는데 책임은 없는 구조" |
| 이유 없이 식어버림 + 정인 약 | "정인이 약하면 한 사람에게 오래 집중하는 게 구조적으로 안 되는 사주야" |

**윤태산 톤**: "근데 속을 열어보니까 — 관성이 이 꼴이면 본인이 매력 있다고 착각하는 타입이야. 네 커리어, 네 능력, 네 깊이 같은 건 관심 없고 겉만 보는 구조."
**서휘윤 톤**: "안쪽을 보면, 이 분의 사주는 본질을 읽는 눈이 부족한 구조예요. 당신의 깊이를 알아볼 그릇이 안 됐던 거예요. 당신이 부족한 게 아니에요."

#### 2-3. 3장: 사망진단서 — 이게 바이럴 핵심

진단서 형식을 빌린 결과 카드. 실제 서류처럼 생긴 디자인에 캐릭터 도장이 찍혀있다.

### Step 3. 사망진단서 카드 (바이럴 핵심 — 1장 캡처 공유)

#### 3-1. 사망 원인 배정 — 사인 × 사주 교차

사용자가 선택한 사인(死因)과 상대의 사주 원국을 교차시켜 10가지 사망 원인 중 1개를 배정:

| 사망 원인 | ID | 사주 트리거 | 사인 연결 |
|----------|-----|-----------|----------|
| **안목 사망** | `blind_eye` | 식상 과다 + 정인 약 | 더 예쁜 여자 / 겉만 봄 |
| **감정 불감증** | `emotional_numb` | 편인 과다 + 정관 충 | 갑자기 연락 두절 |
| **깊이 공포증** | `depth_phobia` | 편재 강 + 정인 약 | 이유 없이 식어버림 |
| **책임 회피 증후군** | `responsibility_dodge` | 상관 과다 + 정관 약 | 좋아한다면서 소개 안 시켜줌 |
| **자기중심 과잉** | `self_centered` | 비견 겁재 과다 | 만나자고 하면 항상 바쁨 |
| **소유욕 과다 / 진심 결핍** | `possessive` | 편관 강 + 정인 약 | 잠자리만 찾음 |
| **매력 착각 증후군** | `charm_delusion` | 도화살 + 상관 동주 | 본인이 매력 있다고 착각 |
| **집중력 결핍** | `focus_deficit` | 편재 과다 + 정관 약 | 새 자극에 약함 |
| **감정 도주범** | `emotional_fugitive` | 편인 + 비견 동주 | 감정 처리 안 하고 도망 |
| **체면 과잉 증후군** | `face_obsession` | 상관 + 겁재 동주 | 주변 시선에만 집착 |

#### 3-2. 사망진단서 카드 레이아웃

```
┌──────────────────────────────┐
│                              │
│   🔬 사주 부검실             │
│   연애 사망진단서            │
│   제2026-0326호              │
│                              │
│  ┌────────────────────┐      │
│  │                    │      │
│  │  (사망 원인별 고유   │      │
│  │   일러스트/아이콘)   │      │
│  │                    │      │
│  └────────────────────┘      │
│                              │
│  ═══════════════════════     │
│  사망 원인: 안목 사망         │
│  ═══════════════════════     │
│                              │
│  📊 매력 감별 능력: F등급     │
│  📈 후회 확률: 94.7%         │
│  🔮 다음 연애 예후:          │
│     비슷한 실수 반복 예정     │
│                              │
│  ─────────────────────────   │
│  검시관 소견:                 │
│  "이런 놈 때문에 울었다고?    │
│   화난다 진짜."              │
│         — 윤태산 🔏          │
│  ─────────────────────────   │
│                              │
│  nadaunse.com/autopsy        │
└──────────────────────────────┘
```

**카드 구성 요소**:

| 요소 | 역할 | 공유 기여 |
|------|------|----------|
| **사망 원인** | 유형 식별 — "이 놈은 안목 사망" | "너 전남친은 뭐로 나왔어?" 비교 대화 |
| **매력 감별 능력 등급** | F~A등급. 낮을수록 통쾌 | "F등급이래ㅋㅋ 볼 눈이 없었던 거 인증됨" |
| **후회 확률** | 소수점까지 구체적 숫자 | "97.2%래ㅋㅋ" → 숫자를 주면 공유한다 |
| **다음 연애 예후** | 상대의 미래 예측 (자업자득 톤) | "비슷한 실수 반복 예정ㅋㅋ 인과응보" |
| **검시관 소견** | 캐릭터 말투로 한 줄 → 캡처 트리거 | "이거 봐ㅋㅋ 윤태산이 대신 화내줌" |

#### 3-3. 등급 산정 로직

**매력 감별 능력 = 상대 사주에서 정인·식신·정관 조합으로 산출**

정인(본질을 읽는 눈) + 식신(감성 이해력) + 정관(책임감)이 약할수록 등급이 낮아진다.

```
매력 감별 능력 등급:
  정인 약 + 식신 약 + 정관 약     → F등급 ("안목 완전 부재")
  정인 약 + 식신 보유             → D등급 ("감은 있는데 읽을 줄 모름")
  정인 보유 + 정관 약             → C등급 ("알면서 안 한 거")
  정인 보유 + 정관 보유 + 충      → B등급 ("알아봤는데 지킬 줄 몰랐음")
  정인 강 + 정관 강 (거의 안 나옴) → A등급 ("볼 줄은 아는데 타이밍이 안 맞았을 뿐")
```

| 등급 | 검시관 코멘트 | 카드 디자인 |
|------|-------------|-----------|
| **F** | "완전한 안목 부재. 다이아몬드 앞에서 유리구슬 고른 격" | 🚩 빨간 도장 |
| **D** | "감은 있었는데 읽을 줄 몰랐음. 거의 문맹 수준" | 주황 도장 |
| **C** | "알면서 안 한 거면 더 나쁨. 고의범" | 노란 도장 |
| **B** | "알아봤는데 지킬 줄 몰랐음. 과실치사" | 파란 도장 |
| **A** | "볼 줄은 아는 사람이었음. 타이밍의 문제" | 보라 도장 |

> F~D등급이 전체의 70%+ 나오도록 사주 로직 설계 — 대부분의 결과가 "통쾌한 판정"이 되어야 공유가 발생.

#### 3-4. 후회 확률 산정 로직

**후회 확률 = 상대 사주의 회고 성향 + 사귄 기간 + 사용자 사주 매력도(선택)**

```
기본 확률: 70%

가산 요소:
  상대 정인 보유          +8%   (돌아보는 성향)
  상대 편인 과다          +5%   (후회는 하는데 연락은 못 함)
  사귄 기간 1년 이상      +7%
  사귄 기간 오래 만남      +12%
  상대 도화살 충           +5%   (매력 있는 사람 놓친 걸 알게 됨)

감산 요소:
  상대 비견 과다          -5%   (자기 위주라 후회 적음)
  상대 편재 과다          -3%   (새 자극으로 금방 잊음)

최종: 70% + 가감 (최소 61.3%, 최대 99.8%)
소수점 1자리까지 표시 (구체적 숫자 = 신뢰 + 공유)
```

#### 3-5. 사망 원인별 검시관 소견

카드에 박히는 핵심 문장. **이 한마디가 캡처·공유의 트리거.**

| 사망 원인 | 윤태산 (분노형) | 서휘윤 (치유형) |
|----------|----------------|----------------|
| 안목 사망 | "이런 놈 때문에 울었다고? 화난다 진짜. 오늘 밤 나한테 와, 네가 얼마나 대단한 여자인지 내가 알려줄게." | "이 분의 사주는 본질을 읽는 눈이 부족한 구조예요. 당신의 깊이를 알아볼 그릇이 안 됐던 거예요." |
| 감정 불감증 | "감정 처리 기능이 사주에서부터 고장난 놈이야. 네가 아무리 잘해줘도 느끼질 못해." | "이 분은 감정을 받아들이는 통로가 막혀있는 사주예요. 당신의 진심이 닿지 못한 건 당신 탓이 아니에요." |
| 깊이 공포증 | "깊어지는 게 무서운 사주야. 넌 진심으로 갔는데 이 놈은 겁먹고 도망간 거지." | "이 분의 사주는 깊은 감정을 감당하는 그릇이 작아요. 당신이 너무 많이 준 거예요. 이제 그만 내려놓으세요." |
| 책임 회피 증후군 | "책임은 못 지면서 좋아한다? 그건 좋아하는 게 아니라 갖고 노는 거야." | "이 분은 감정의 무게를 견디는 구조가 아니에요. 당신은 무거운 사람이 아니라, 이 분이 가벼운 거예요." |
| 자기중심 과잉 | "이 사주는 세상의 중심이 자기야. 네가 옆에 있든 없든 똑같은 놈이었어." | "이 분의 세계에는 자기밖에 없는 구조예요. 당신이 노력해도 달라지지 않았을 거예요." |
| 소유욕 과다 / 진심 결핍 | "가지려고만 하고 지키려고는 안 하는 사주. 이런 놈한테 진심 줄 필요 없었어." | "소유와 사랑을 구분 못 하는 구조예요. 당신은 소유 대상이 아니라 사랑받아야 할 사람이에요." |
| 매력 착각 증후군 | "본인이 잘난 줄 아는데 실제론 별거 없는 사주야. 네가 과대평가해준 거지." | "자기 매력에 대한 착각이 있는 사주예요. 오히려 당신이 이 분을 빛나게 해준 거였어요." |
| 집중력 결핍 | "새 거 나오면 바로 넘어가는 사주. 너한테 질린 게 아니라 원래 이런 놈이야." | "하나에 오래 집중하는 게 구조적으로 어려운 사주예요. 당신의 매력이 부족해서가 아니에요." |
| 감정 도주범 | "감정이 복잡해지면 도망가는 사주. 비겁한 거야, 단순하게 말하면." | "감정을 마주하는 게 무서운 구조예요. 당신 앞에서 도망간 건, 당신이 그만큼 진짜였기 때문이에요." |
| 체면 과잉 증후군 | "주변 눈치만 보는 사주. 널 사랑한 게 아니라 사랑하는 척한 거야." | "타인의 시선이 자기 감정보다 큰 사주예요. 당신을 숨긴 건 부끄러워서가 아니라, 자기가 약한 거예요." |

### Step 4. 2차 바이럴 장치 — "전 연인 영안실"

부검이 끝나면 "영안실에 안치하시겠습니까?" 선택지가 나온다.

#### 4-1. 영안실 구조

```
┌──────────────────────────────┐
│                              │
│   🏥 전 연인 영안실           │
│                              │
│   이 사주 유형에게             │
│   피해 입은 사람:             │
│   ██ 847명 ██                │
│                              │
│   ─────────────────────      │
│   대표 사망 원인 TOP 3:       │
│   1위. 감정 불감증 (38%)      │
│   2위. 안목 사망 (27%)        │
│   3위. 깊이 공포증 (19%)      │
│   ─────────────────────      │
│                              │
│   "역시 나만 당한 게 아님ㅋㅋ"  │
│                              │
│   [다른 부검 결과 보기 →]     │
│   [내 전남친도 안치하기 →]    │
│                              │
└──────────────────────────────┘
```

#### 4-2. 영안실의 바이럴 기능

| 기능 | 역할 | 바이럴 기여 |
|------|------|-----------|
| **피해자 수 카운터** | "이 사주 유형에게 당한 사람 847명" | "나만 당한 게 아니구나" 동질감 → 캡처 |
| **사망 원인 TOP 3** | 같은 유형이 반복하는 패턴 시각화 | "역시 감정 불감증이 1위ㅋㅋ" 공감 |
| **다른 부검 결과 열람** | 같은 유형에게 당한 다른 사람들의 진단서 | 관음증 + 재방문 사유 |
| **안치하기 CTA** | 아직 안 넣은 전남친도 부검 유도 | 1인 N회 플레이 → K-factor 상승 |

> "Are We Dating the Same Guy?" 케이스의 안전한 구현 — 실명/사진 없이 사주 유형만 공개하여 프라이버시 문제 회피.

### Step 5. 전전남친도 부검하기 — 1인 N회 플레이

사망진단서 하단에 **"전전남친도 부검하기"** 버튼을 배치. 한 명 부검하고 나면 과거 연애가 줄줄이 떠오르는 심리를 이용한다.

**리플레이 유도**:
- "전전남친도 부검하기" → 다른 생년월일 입력 → 새 사망진단서 생성
- 부검 결과가 다르니까 비교하는 재미 → "첫번째는 안목 사망인데 두번째는 감정 도주범ㅋㅋ 나 왜 맨날 이런 놈만"
- 여러 장 모아서 "내 연애 부검 컬렉션" 캡처 → 자조적 공유
- 친구들끼리 "전남친 부검 모임" → 각자 결과 비교 → N명 × N회 = 바이럴 배수 폭발

### Step 6. 유료 전환 CTA

부검 끝나고 감정이 최고조일 때 CTA 배치.

#### 6-1. 캐릭터별 CTA

| 캐릭터 | CTA 버튼 | CTA 아래 유도 문구 |
|--------|---------|-----------------|
| 윤태산 | "윤태산에게 상담받기" | "이 사주 유형에게 안 당하는 법, 직접 알려줄게" |
| 서휘윤 | "서휘윤에게 상담받기" | "당신에게 맞는 사람은 어떤 사주인지, 같이 찾아볼까요?" |

#### 6-2. 전환 플로우

```
사망진단서에서 캐릭터 선택
    ↓
CTA 버튼 클릭
    ↓
캐릭터 챗봇 페이지로 이동
(상대 생년월일을 URL 파라미터로 전달 — 부검 맥락 연결)
    ↓
캐릭터가 사주 기반 1:1 상담 시작
"이런 유형에게 다시 안 당하려면..." / "당신에게 맞는 사주 유형은..."
    ↓
유료 1:1 상담 진행 (350포인트)
```

### Step 7. 공유 + 재방문

#### 7-1. 공유 옵션

```
┌──────────────────────────────┐
│  [📱 카카오톡으로 보내기]     │
│  [📸 인스타 스토리에 올리기]  │
│  [🔗 링크 복사]              │
│  [💾 이미지 저장]            │
│                              │
│  [🔬 너도 전남친 부검해봐]    │
│  → 내 사망진단서 카드 +       │
│     부검실 링크 함께 전송      │
└──────────────────────────────┘
```

#### 7-2. "너도 전남친 부검해봐" (도발형 공유)

내 사망진단서 카드가 미끼가 되고, "너는?" 한마디가 행동을 유발하는 구조.

- 공유 시 **내 결과 카드 + 부검실 링크**가 함께 전송
- 카톡 메시지: "나는 '안목 사망' 나왔는데 너는? 👉"
- 받은 친구: "ㅋㅋㅋ뭐야 나도 해봐야지" → 자기 전남친 생년월일 입력 → 새 사망진단서 생성
- 각자 결과 공유하면서 전남친 부검 릴레이 시작 → **체인 반응**

#### 7-3. 재방문 트리거

| 트리거 | 내용 |
|--------|------|
| **영안실 업데이트** | "당신이 안치한 사주 유형, 피해자 100명 돌파" → 동질감 강화 |
| **월간 부검 통계** | "이번 달 사망 원인 1위: 안목 사망" → 화제성 |
| **시즌 이벤트** | 발렌타인/크리스마스 전 "시즌 한정 부검" → 계절 FOMO |
| **신규 캐릭터** | 새 검시관 추가 시 → "새 검시관은 뭐라고 하나?" |

---

## 기술 스펙

### 1. DB 스키마

```sql
-- ─── 부검 결과 테이블 ─────────────────────────────────
CREATE TABLE saju_autopsies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 상대 (부검 대상) 사주 정보
  target_birthday TEXT NOT NULL,           -- YYYYMMDDHHMM
  target_birth_time TEXT,                  -- HHMM or null (모름)
  target_gender TEXT NOT NULL,             -- 'male' | 'female'

  -- 입력 선택지
  cause_of_death_input TEXT NOT NULL,      -- 사인 선택: ghosting | prettier | always_busy | physical_only | faded
  relationship_duration TEXT NOT NULL,     -- 사귄 기간: brief | months | over_year | long_term
  coroner_id TEXT NOT NULL,               -- 검시관: yoon-taesan | seo-hwiyoon

  -- 부검 결과 (산출된 값)
  cause_of_death TEXT NOT NULL,            -- 10종 사망 원인 ID: blind_eye | emotional_numb | ...
  cause_of_death_label TEXT NOT NULL,      -- 표시용: "안목 사망" 등
  discernment_grade TEXT NOT NULL,         -- 매력 감별 능력: F | D | C | B | A
  regret_probability NUMERIC NOT NULL,    -- 후회 확률: 61.3 ~ 99.8
  prognosis TEXT NOT NULL,                -- 다음 연애 예후 (1줄)

  -- Gemini 생성 텍스트 (3장 카드)
  card1_text TEXT NOT NULL,               -- 겉포장 분석
  card2_text TEXT NOT NULL,               -- 해부 소견
  card3_verdict TEXT NOT NULL,            -- 사망진단서 검시관 소견

  -- 전체 결과 JSONB (프론트에서 한번에 사용)
  result JSONB NOT NULL,

  -- 영안실 관련
  target_saju_type TEXT,                  -- 영안실 집계용 (일주 기반 유형 분류)
  is_archived BOOLEAN DEFAULT false,      -- 영안실 안치 여부

  -- 메타
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 추적
  utm_source TEXT,
  utm_medium TEXT
);

CREATE INDEX idx_saju_autopsies_created_at ON saju_autopsies(created_at DESC);
CREATE INDEX idx_saju_autopsies_saju_type ON saju_autopsies(target_saju_type) WHERE is_archived = true;
CREATE INDEX idx_saju_autopsies_cause ON saju_autopsies(cause_of_death);

-- RLS
ALTER TABLE saju_autopsies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read autopsies"
  ON saju_autopsies FOR SELECT
  TO anon
  USING (true);

-- ─── 영안실 통계 뷰 ──────────────────────────────────
-- target_saju_type별 집계 (피해자 수, TOP 3 사망 원인)
CREATE OR REPLACE VIEW autopsy_morgue_stats AS
SELECT
  target_saju_type,
  COUNT(*) AS victim_count,
  jsonb_agg(
    jsonb_build_object('cause', cause_of_death_label, 'count', cause_count)
    ORDER BY cause_count DESC
  ) FILTER (WHERE rn <= 3) AS top_causes
FROM (
  SELECT
    target_saju_type,
    cause_of_death_label,
    COUNT(*) AS cause_count,
    ROW_NUMBER() OVER (PARTITION BY target_saju_type ORDER BY COUNT(*) DESC) AS rn
  FROM saju_autopsies
  WHERE is_archived = true
  GROUP BY target_saju_type, cause_of_death_label
) sub
GROUP BY target_saju_type;
```

### 2. TypeScript 타입

```typescript
// src/types/autopsy.ts

export type Gender = 'female' | 'male';

export type CauseOfDeathInput = 'ghosting' | 'prettier' | 'always_busy' | 'physical_only' | 'faded';

export type RelationshipDuration = 'brief' | 'months' | 'over_year' | 'long_term';

export type CoronerId = 'yoon-taesan' | 'seo-hwiyoon';

export type CauseOfDeath =
  | 'blind_eye'
  | 'emotional_numb'
  | 'depth_phobia'
  | 'responsibility_dodge'
  | 'self_centered'
  | 'possessive'
  | 'charm_delusion'
  | 'focus_deficit'
  | 'emotional_fugitive'
  | 'face_obsession';

export type DiscernmentGrade = 'F' | 'D' | 'C' | 'B' | 'A';

export interface SajuHighlights {
  // 십성 카운트
  jeongInCount: number;      // 정인 (본질을 읽는 눈)
  pyeonInCount: number;      // 편인 (비겁한 후회)
  sikSinCount: number;       // 식신 (감성 이해력)
  jeongGwanCount: number;    // 정관 (책임감)
  pyeonGwanCount: number;    // 편관 (소유욕)
  sangGwanCount: number;     // 상관 (겉치레)
  pyeonJaeCount: number;     // 편재 (새 자극 중독)
  biGyeonCount: number;      // 비견 (자기중심)
  geobJaeCount: number;      // 겁재 (체면)
  // 발달십성 비율
  insung: number;            // 인성 비율
  gwansung: number;          // 관성 비율
  siksang: number;           // 식상 비율
  bigyeob: number;           // 비겁 비율
  jasung: number;            // 재성 비율
  // 신살
  doHwaSal: boolean;
  hongYeomSal: boolean;
  // 일주론
  yeonaeSeongHyang: string;
  ilJuKey: string;           // 일주 (예: "갑자") — 영안실 saju_type 분류용
}

export interface AutopsyResult {
  autopsyId: string;
  // 입력값
  causeOfDeathInput: CauseOfDeathInput;
  relationshipDuration: RelationshipDuration;
  coronerId: CoronerId;
  // 산출 결과
  causeOfDeath: CauseOfDeath;
  causeOfDeathLabel: string;
  discernmentGrade: DiscernmentGrade;
  regretProbability: number;
  prognosis: string;
  // 3장 카드 텍스트
  card1Text: string;         // 겉포장 분석
  card2Text: string;         // 해부 소견
  card3Verdict: string;      // 사망진단서 검시관 소견
  // 메타
  sajuHighlights: SajuHighlights;
  targetSajuType: string;    // 영안실용
}

export type AutopsyStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'card1'
  | 'card2'
  | 'card3'
  | 'result'
  | 'morgue';
```

### 3. 상수 정의

```typescript
// src/constants/autopsy.ts

import type { CauseOfDeath, CauseOfDeathInput, DiscernmentGrade, RelationshipDuration, CoronerId } from '@/types/autopsy';

// ─── 사인(死因) 선택지 ─────────────────────────────────
export interface CauseOfDeathInputInfo {
  id: CauseOfDeathInput;
  label: string;
  emoji: string;
  description: string;
}

export const CAUSE_OF_DEATH_INPUTS: CauseOfDeathInputInfo[] = [
  { id: 'ghosting', label: '갑자기 연락 두절', emoji: '👻', description: '어느 날 갑자기 사라졌다' },
  { id: 'prettier', label: '더 예쁜 여자 생김', emoji: '💔', description: '겉만 보는 놈이었다' },
  { id: 'always_busy', label: '만나자고 하면 항상 바쁨', emoji: '⏰', description: '나만 매달리고 있었다' },
  { id: 'physical_only', label: '잠자리만 찾음', emoji: '🔥', description: '진심은 없었다' },
  { id: 'faded', label: '이유 없이 식어버림', emoji: '🧊', description: '아무 이유도 없이 끝났다' },
];

// ─── 사귄 기간 ──────────────────────────────────────
export interface RelationshipDurationInfo {
  id: RelationshipDuration;
  label: string;
}

export const RELATIONSHIP_DURATIONS: RelationshipDurationInfo[] = [
  { id: 'brief', label: '잠깐 만남' },
  { id: 'months', label: '몇 달' },
  { id: 'over_year', label: '1년 이상' },
  { id: 'long_term', label: '오래 만남' },
];

// ─── 검시관 ─────────────────────────────────────────
export interface CoronerInfo {
  id: CoronerId;
  name: string;
  tone: string;
  thumbnail: string;
  emoji: string;
  description: string;
}

export const CORONERS: CoronerInfo[] = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    tone: '분노형',
    thumbnail: '/characters/yoon-taesan.webp',
    emoji: '🔥',
    description: '"이런 놈 때문에 울었다고? 화난다 진짜"',
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    tone: '치유형',
    thumbnail: '/characters/seo-hwiyoon.webp',
    emoji: '🌙',
    description: '"당신 탓이 아니에요. 이 분이 부족했던 거예요"',
  },
];

// ─── 사망 원인 10종 ──────────────────────────────────
export interface CauseOfDeathInfo {
  id: CauseOfDeath;
  label: string;
  emoji: string;
  // 폴백 소견 (Gemini 실패 시)
  fallbackYoonTaesan: string;
  fallbackSeoHwiyoon: string;
}

export const CAUSES_OF_DEATH: Record<CauseOfDeath, CauseOfDeathInfo> = {
  blind_eye: {
    id: 'blind_eye',
    label: '안목 사망',
    emoji: '👁️',
    fallbackYoonTaesan: '이런 놈 때문에 울었다고? 화난다 진짜.',
    fallbackSeoHwiyoon: '이 분의 사주는 본질을 읽는 눈이 부족한 구조예요.',
  },
  emotional_numb: {
    id: 'emotional_numb',
    label: '감정 불감증',
    emoji: '🧊',
    fallbackYoonTaesan: '감정 처리 기능이 사주에서부터 고장난 놈이야.',
    fallbackSeoHwiyoon: '이 분은 감정을 받아들이는 통로가 막혀있는 사주예요.',
  },
  depth_phobia: {
    id: 'depth_phobia',
    label: '깊이 공포증',
    emoji: '🕳️',
    fallbackYoonTaesan: '깊어지는 게 무서운 사주야. 넌 진심으로 갔는데 이 놈은 겁먹고 도망간 거지.',
    fallbackSeoHwiyoon: '이 분의 사주는 깊은 감정을 감당하는 그릇이 작아요.',
  },
  responsibility_dodge: {
    id: 'responsibility_dodge',
    label: '책임 회피 증후군',
    emoji: '🏃',
    fallbackYoonTaesan: '책임은 못 지면서 좋아한다? 그건 좋아하는 게 아니라 갖고 노는 거야.',
    fallbackSeoHwiyoon: '이 분은 감정의 무게를 견디는 구조가 아니에요.',
  },
  self_centered: {
    id: 'self_centered',
    label: '자기중심 과잉',
    emoji: '🪞',
    fallbackYoonTaesan: '이 사주는 세상의 중심이 자기야. 네가 옆에 있든 없든 똑같은 놈이었어.',
    fallbackSeoHwiyoon: '이 분의 세계에는 자기밖에 없는 구조예요.',
  },
  possessive: {
    id: 'possessive',
    label: '소유욕 과다',
    emoji: '🔒',
    fallbackYoonTaesan: '가지려고만 하고 지키려고는 안 하는 사주.',
    fallbackSeoHwiyoon: '소유와 사랑을 구분 못 하는 구조예요.',
  },
  charm_delusion: {
    id: 'charm_delusion',
    label: '매력 착각 증후군',
    emoji: '🎭',
    fallbackYoonTaesan: '본인이 잘난 줄 아는데 실제론 별거 없는 사주야.',
    fallbackSeoHwiyoon: '자기 매력에 대한 착각이 있는 사주예요.',
  },
  focus_deficit: {
    id: 'focus_deficit',
    label: '집중력 결핍',
    emoji: '🦋',
    fallbackYoonTaesan: '새 거 나오면 바로 넘어가는 사주. 원래 이런 놈이야.',
    fallbackSeoHwiyoon: '하나에 오래 집중하는 게 구조적으로 어려운 사주예요.',
  },
  emotional_fugitive: {
    id: 'emotional_fugitive',
    label: '감정 도주범',
    emoji: '💨',
    fallbackYoonTaesan: '감정이 복잡해지면 도망가는 사주. 비겁한 거야.',
    fallbackSeoHwiyoon: '감정을 마주하는 게 무서운 구조예요.',
  },
  face_obsession: {
    id: 'face_obsession',
    label: '체면 과잉 증후군',
    emoji: '🎩',
    fallbackYoonTaesan: '주변 눈치만 보는 사주. 널 사랑한 게 아니라 사랑하는 척한 거야.',
    fallbackSeoHwiyoon: '타인의 시선이 자기 감정보다 큰 사주예요.',
  },
};

// ─── 매력 감별 능력 등급 ──────────────────────────────
export interface DiscernmentGradeInfo {
  grade: DiscernmentGrade;
  label: string;
  color: string;          // 도장 색상
  stampEmoji: string;     // 도장 이모지
  comment: string;        // 등급 코멘트
}

export const DISCERNMENT_GRADES: Record<DiscernmentGrade, DiscernmentGradeInfo> = {
  F: { grade: 'F', label: '안목 완전 부재', color: '#DC2626', stampEmoji: '🚩', comment: '완전한 안목 부재. 다이아몬드 앞에서 유리구슬 고른 격' },
  D: { grade: 'D', label: '감은 있는데 읽을 줄 모름', color: '#EA580C', stampEmoji: '🟠', comment: '감은 있었는데 읽을 줄 몰랐음. 거의 문맹 수준' },
  C: { grade: 'C', label: '알면서 안 한 거', color: '#CA8A04', stampEmoji: '🟡', comment: '알면서 안 한 거면 더 나쁨. 고의범' },
  B: { grade: 'B', label: '알아봤는데 지킬 줄 몰랐음', color: '#2563EB', stampEmoji: '🔵', comment: '알아봤는데 지킬 줄 몰랐음. 과실치사' },
  A: { grade: 'A', label: '볼 줄은 아는 사람', color: '#7A38D8', stampEmoji: '🟣', comment: '볼 줄은 아는 사람이었음. 타이밍의 문제' },
};
```

### 4. Edge Function: `analyze-saju-autopsy`

#### 4-1. 요청/응답 인터페이스

```typescript
// 요청
interface RequestBody {
  birthday: string;                    // YYYYMMDDHHMM (상대)
  gender: 'female' | 'male';          // 상대 성별
  birthTimeUnknown?: boolean;
  causeOfDeathInput: CauseOfDeathInput;
  relationshipDuration: RelationshipDuration;
  coronerId: CoronerId;
}

// 응답
interface ResponseBody {
  autopsyId: string;
  causeOfDeathInput: CauseOfDeathInput;
  relationshipDuration: RelationshipDuration;
  coronerId: CoronerId;
  causeOfDeath: CauseOfDeath;
  causeOfDeathLabel: string;
  discernmentGrade: DiscernmentGrade;
  regretProbability: number;
  prognosis: string;
  card1Text: string;
  card2Text: string;
  card3Verdict: string;
  sajuHighlights: SajuHighlights;
  targetSajuType: string;
}
```

#### 4-2. Edge Function 파이프라인

```
요청 수신
  ↓
1. 입력 검증 (birthday, gender, causeOfDeathInput, relationshipDuration, coronerId)
  ↓
2. Stargio Saju API 호출 (동일 패턴: 3회 재시도 + BROWSER_HEADERS + excludeKeys)
  ↓
3. extractSajuHighlights(sajuData) — 십성 카운트 + 발달십성 + 신살 + 일주론 추출
  ↓
4. determineCauseOfDeath(highlights, causeOfDeathInput) — 사인 × 사주 교차 → 10종 중 1개
  ↓
5. calculateDiscernmentGrade(highlights) — 정인·식신·정관 기반 → F~A 등급
  ↓
6. calculateRegretProbability(highlights, relationshipDuration) — 70% 기반 가감
  ↓
7. generatePrognosis(causeOfDeath, highlights) — 다음 연애 예후 1줄
  ↓
8. generateAutopsyCards(Gemini) — 3장 카드 텍스트 일괄 생성
  ↓
9. DB 저장 (saju_autopsies 테이블)
  ↓
10. 응답 반환
```

#### 4-3. `extractSajuHighlights()` — 사주 데이터 추출

```typescript
function extractSajuHighlights(sajuData: Record<string, unknown>): SajuHighlights {
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};
  const sinsal12 = String(sajuData['12신살'] || '');
  const gitaSinsal = String(sajuData['기타신살'] || '');
  const ilJuRon = sajuData['일주론'] as Record<string, string> | undefined;
  const cheonGan = (sajuData['천간'] as string[] | undefined) ?? [];
  const jiJi = (sajuData['지지'] as string[] | undefined) ?? [];

  return {
    jeongInCount: countSipsung(sipsung, '정인'),
    pyeonInCount: countSipsung(sipsung, '편인'),
    sikSinCount: countSipsung(sipsung, '식신'),
    jeongGwanCount: countSipsung(sipsung, '정관'),
    pyeonGwanCount: countSipsung(sipsung, '편관'),
    sangGwanCount: countSipsung(sipsung, '상관'),
    pyeonJaeCount: countSipsung(sipsung, '편재'),
    biGyeonCount: countSipsung(sipsung, '비견'),
    geobJaeCount: countSipsung(sipsung, '겁재'),
    insung: baldal['인성'] ?? 0,
    gwansung: baldal['관성'] ?? 0,
    siksang: baldal['식상'] ?? 0,
    bigyeob: baldal['비겁'] ?? 0,
    jasung: baldal['재성'] ?? 0,
    doHwaSal: sinsal12.includes('도화'),
    hongYeomSal: gitaSinsal.includes('홍염'),
    yeonaeSeongHyang: ilJuRon?.['연애성향'] ?? '',
    ilJuKey: `${cheonGan[2] ?? ''}${jiJi[2] ?? ''}`,  // 일주 = 천간[2]+지지[2]
  };
}
```

#### 4-4. `determineCauseOfDeath()` — 사인 × 사주 교차 매핑

```typescript
// 사인(死因) 선택 × 사주 특성 → 사망 원인 결정
// 우선순위: 사인에 연결된 사주 트리거가 맞으면 해당 원인, 아니면 사주 전체 특성으로 결정

interface CauseMapping {
  cause: CauseOfDeath;
  label: string;
  check: (h: SajuHighlights) => number;  // 점수 (높을수록 우선)
  linkedInputs: CauseOfDeathInput[];     // 사인 연결 (보너스 점수 +10)
}

const CAUSE_MAPPINGS: CauseMapping[] = [
  {
    cause: 'blind_eye',
    label: '안목 사망',
    check: (h) => (h.siksang >= 25 ? 3 : h.sangGwanCount >= 1 ? 1 : 0) + (h.insung < 15 ? 2 : 0),
    linkedInputs: ['prettier'],
  },
  {
    cause: 'emotional_numb',
    label: '감정 불감증',
    check: (h) => (h.pyeonInCount >= 2 ? 3 : h.pyeonInCount >= 1 ? 1 : 0) + (h.gwansung >= 20 ? 1 : 0),
    linkedInputs: ['ghosting'],
  },
  {
    cause: 'depth_phobia',
    label: '깊이 공포증',
    check: (h) => (h.pyeonJaeCount >= 2 ? 3 : h.jasung >= 25 ? 2 : 0) + (h.insung < 15 ? 1 : 0),
    linkedInputs: ['faded'],
  },
  {
    cause: 'responsibility_dodge',
    label: '책임 회피 증후군',
    check: (h) => (h.sangGwanCount >= 2 ? 3 : h.siksang >= 25 ? 2 : 0) + (h.gwansung < 15 ? 1 : 0),
    linkedInputs: ['always_busy'],
  },
  {
    cause: 'self_centered',
    label: '자기중심 과잉',
    check: (h) => (h.biGyeonCount + h.geobJaeCount >= 3 ? 3 : h.bigyeob >= 30 ? 2 : 0),
    linkedInputs: ['always_busy'],
  },
  {
    cause: 'possessive',
    label: '소유욕 과다',
    check: (h) => (h.pyeonGwanCount >= 2 ? 3 : h.gwansung >= 25 ? 2 : 0) + (h.insung < 15 ? 1 : 0),
    linkedInputs: ['physical_only'],
  },
  {
    cause: 'charm_delusion',
    label: '매력 착각 증후군',
    check: (h) => (h.doHwaSal ? 2 : 0) + (h.sangGwanCount >= 1 ? 2 : 0),
    linkedInputs: ['prettier'],
  },
  {
    cause: 'focus_deficit',
    label: '집중력 결핍',
    check: (h) => (h.pyeonJaeCount >= 2 ? 3 : h.jasung >= 30 ? 2 : 0) + (h.gwansung < 15 ? 1 : 0),
    linkedInputs: ['faded'],
  },
  {
    cause: 'emotional_fugitive',
    label: '감정 도주범',
    check: (h) => (h.pyeonInCount >= 1 && h.biGyeonCount >= 1 ? 3 : 0) + (h.pyeonInCount >= 2 ? 1 : 0),
    linkedInputs: ['ghosting'],
  },
  {
    cause: 'face_obsession',
    label: '체면 과잉 증후군',
    check: (h) => (h.sangGwanCount >= 1 && h.geobJaeCount >= 1 ? 3 : 0) + (h.bigyeob >= 20 ? 1 : 0),
    linkedInputs: ['always_busy'],
  },
];

function determineCauseOfDeath(
  highlights: SajuHighlights,
  causeOfDeathInput: CauseOfDeathInput
): { cause: CauseOfDeath; label: string } {
  let best = CAUSE_MAPPINGS[0];
  let bestScore = -1;

  for (const mapping of CAUSE_MAPPINGS) {
    let score = mapping.check(highlights);
    // 사인 연결 보너스
    if (mapping.linkedInputs.includes(causeOfDeathInput)) {
      score += 10;
    }
    if (score > bestScore) {
      bestScore = score;
      best = mapping;
    }
  }

  return { cause: best.cause, label: best.label };
}
```

#### 4-5. `calculateDiscernmentGrade()` — 매력 감별 능력 등급

```typescript
function calculateDiscernmentGrade(h: SajuHighlights): DiscernmentGrade {
  const hasJeongIn = h.jeongInCount >= 1 || h.insung >= 20;
  const strongJeongIn = h.jeongInCount >= 2 || h.insung >= 30;
  const hasSikSin = h.sikSinCount >= 1;
  const hasJeongGwan = h.jeongGwanCount >= 1 || h.gwansung >= 20;
  const strongJeongGwan = h.jeongGwanCount >= 2 || h.gwansung >= 30;

  // A: 정인 강 + 정관 강 (거의 안 나옴 — 5% 이하)
  if (strongJeongIn && strongJeongGwan) return 'A';

  // B: 정인 보유 + 정관 보유
  if (hasJeongIn && hasJeongGwan) return 'B';

  // C: 정인 보유 + 정관 약
  if (hasJeongIn && !hasJeongGwan) return 'C';

  // D: 정인 약 + 식신 보유
  if (!hasJeongIn && hasSikSin) return 'D';

  // F: 나머지 (정인 약 + 식신 약 + 정관 약)
  return 'F';
}
```

> **분포 목표**: F(35%) + D(35%) + C(20%) + B(8%) + A(2%) — F~D가 70%+ 차지

#### 4-6. `calculateRegretProbability()` — 후회 확률

```typescript
function calculateRegretProbability(
  h: SajuHighlights,
  duration: RelationshipDuration
): number {
  let prob = 70.0;

  // 가산
  if (h.jeongInCount >= 1) prob += 8;
  if (h.pyeonInCount >= 2) prob += 5;
  if (duration === 'over_year') prob += 7;
  if (duration === 'long_term') prob += 12;
  if (h.doHwaSal) prob += 5;  // 매력 있는 사람 놓친 걸 알게 됨

  // 감산
  if (h.biGyeonCount >= 2 || h.bigyeob >= 30) prob -= 5;
  if (h.pyeonJaeCount >= 2 || h.jasung >= 30) prob -= 3;

  // 범위 제한 + 소수점 1자리
  prob = Math.max(61.3, Math.min(99.8, prob));

  // 소수점 1자리로 랜덤 느낌 (기본값에서 ±0.1~0.9 오프셋)
  const offset = parseFloat((Math.random() * 0.8 + 0.1).toFixed(1));
  prob = parseFloat((Math.floor(prob) + offset).toFixed(1));

  return Math.max(61.3, Math.min(99.8, prob));
}
```

#### 4-7. `generatePrognosis()` — 다음 연애 예후

```typescript
const PROGNOSES: Record<CauseOfDeath, string[]> = {
  blind_eye: ['비슷한 실수 반복 예정', '겉만 보다가 또 놓칠 확률 높음'],
  emotional_numb: ['감정 결핍 만성화 예상', '혼자 늙어갈 위험 높음'],
  depth_phobia: ['얕은 연애만 반복할 구조', '깊어지면 또 도망갈 것'],
  responsibility_dodge: ['책임 없는 연애 패턴 고착', '같은 이유로 또 차일 것'],
  self_centered: ['자기 세계에 갇혀 외로워질 예정', '후회할 때쯤 이미 늦음'],
  possessive: ['소유만 하다 진짜 사랑 놓칠 것', '패턴 반복 확률 극히 높음'],
  charm_delusion: ['착각이 깨지는 순간이 올 것', '그때 당신이 떠오를 것'],
  focus_deficit: ['새 자극 중독으로 안정 불가', '어디서든 같은 패턴 반복'],
  emotional_fugitive: ['도망 패턴 반복. 잡아줄 사람 없으면 고립', '본인도 모르게 후회 중'],
  face_obsession: ['체면 유지하다 진심을 잃을 것', '겉은 멀쩡해도 속은 텅 빌 예정'],
};

function generatePrognosis(causeOfDeath: CauseOfDeath): string {
  const options = PROGNOSES[causeOfDeath];
  return options[Math.floor(Math.random() * options.length)];
}
```

#### 4-8. `generateAutopsyCards()` — Gemini 3장 카드 일괄 생성

```typescript
async function generateAutopsyCards(
  coronerId: CoronerId,
  causeOfDeathInput: CauseOfDeathInput,
  causeOfDeath: CauseOfDeath,
  causeOfDeathLabel: string,
  discernmentGrade: DiscernmentGrade,
  regretProbability: number,
  highlights: SajuHighlights,
): Promise<{ card1: string; card2: string; card3: string }> {

  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    // 폴백: 상수에서 꺼내기
    return {
      card1: getFallbackCard1(coronerId, highlights),
      card2: getFallbackCard2(coronerId, causeOfDeathInput, highlights),
      card3: CAUSES_OF_DEATH[causeOfDeath][coronerId === 'yoon-taesan' ? 'fallbackYoonTaesan' : 'fallbackSeoHwiyoon'],
    };
  }

  const coronerProfile = coronerId === 'yoon-taesan'
    ? `윤태산 — 분노형 검시관. 반말체. 거친 말투로 상대를 까되, 사용자를 감싸주는 톤.
       예시: "이 사주 봐, 식상이 이 모양이면 겉만 보는 놈이야. 이런 놈이 널 놓친 거지"
       사용자에게는 "네가 부족한 게 아냐", "화난다 진짜" 같은 분노 대리 톤.`
    : `서휘윤 — 치유형 검시관. 존댓말. 차분하고 따뜻한 톤으로 상대의 사주적 한계를 설명.
       예시: "이 분의 사주는 본질을 읽는 눈이 부족한 구조예요. 당신의 깊이를 알아볼 그릇이 안 됐던 거예요"
       사용자에게는 "당신 탓이 아니에요", "이제 내려놓으세요" 같은 위로 톤.`;

  const causeInputLabels: Record<CauseOfDeathInput, string> = {
    ghosting: '갑자기 연락 두절',
    prettier: '더 예쁜 여자 생김',
    always_busy: '만나자고 하면 항상 바쁨',
    physical_only: '잠자리만 찾음',
    faded: '이유 없이 식어버림',
  };

  const prompt = `역할: 당신은 사주 기반 연애 부검 전문 검시관입니다.

캐릭터 프로필:
${coronerProfile}

부검 대상 사주 데이터:
- 일주: ${highlights.ilJuKey}
- 주요 십성: 정인 ${highlights.jeongInCount}개, 편인 ${highlights.pyeonInCount}개, 식신 ${highlights.sikSinCount}개, 정관 ${highlights.jeongGwanCount}개, 편관 ${highlights.pyeonGwanCount}개, 상관 ${highlights.sangGwanCount}개, 편재 ${highlights.pyeonJaeCount}개, 비견 ${highlights.biGyeonCount}개, 겁재 ${highlights.geobJaeCount}개
- 발달십성: 인성 ${highlights.insung}%, 관성 ${highlights.gwansung}%, 식상 ${highlights.siksang}%, 비겁 ${highlights.bigyeob}%, 재성 ${highlights.jasung}%
- 도화살: ${highlights.doHwaSal ? '있음' : '없음'}
- 연애성향: ${highlights.yeonaeSeongHyang || '정보 없음'}

부검 정보:
- 사인(死因): "${causeInputLabels[causeOfDeathInput]}"
- 확정 사망 원인: ${causeOfDeathLabel}
- 매력 감별 능력: ${discernmentGrade}등급
- 후회 확률: ${regretProbability}%

아래 3장의 카드 텍스트를 JSON으로 생성하라. 각 카드는 2~3문장.

1. card1 (겉포장 분석): 상대 사주에서 겉으로 보이는 매력 요소. 사용자가 "맞아, 처음엔 진짜 좋았는데…" 공감하는 지점. 사주 용어 1개 이상 자연어 풀이.
2. card2 (해부 소견): 사인(${causeInputLabels[causeOfDeathInput]})과 사주를 교차시켜 "왜 이렇게 행동했는지" 해부. 핵심 약점을 정확히 찔되, 사용자 탓이 아님을 강조.
3. card3 (검시관 소견): 사망진단서에 박히는 한마디. 캡처·공유 트리거가 될 만큼 강렬한 1~2문장.

출력 형식 (JSON만, 다른 텍스트 없이):
{"card1":"...","card2":"...","card3":"..."}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.85,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      throw new Error('Gemini failed');
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const parsed = JSON.parse(text);

    return {
      card1: parsed.card1 || getFallbackCard1(coronerId, highlights),
      card2: parsed.card2 || getFallbackCard2(coronerId, causeOfDeathInput, highlights),
      card3: parsed.card3 || CAUSES_OF_DEATH[causeOfDeath][coronerId === 'yoon-taesan' ? 'fallbackYoonTaesan' : 'fallbackSeoHwiyoon'],
    };
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
    return {
      card1: getFallbackCard1(coronerId, highlights),
      card2: getFallbackCard2(coronerId, causeOfDeathInput, highlights),
      card3: CAUSES_OF_DEATH[causeOfDeath][coronerId === 'yoon-taesan' ? 'fallbackYoonTaesan' : 'fallbackSeoHwiyoon'],
    };
  }
}
```

> **핵심**: `responseMimeType: 'application/json'`으로 Gemini에게 JSON 강제. 파싱 실패 시 폴백 상수 사용.

### 5. 컴포넌트 구조

```
src/
├── app/
│   └── autopsy/
│       ├── page.tsx                    # /autopsy 메인 (정적 OG)
│       └── [autopsyId]/
│           └── page.tsx                # /autopsy/[autopsyId] (동적 OG SSR)
├── components/
│   ├── [기존 공유] BirthInput.tsx       # 재사용
│   ├── [기존 공유] GenderSelect.tsx     # 재사용
│   ├── [기존 공유] BirthTimeInput.tsx   # 재사용
│   ├── [기존 공유] ShareButtons.tsx     # 재사용 (공유 텍스트만 변경)
│   ├── [기존 공유] CharacterAvatar.tsx  # 재사용 (윤태산, 서휘윤)
│   │
│   ├── autopsy/
│   │   ├── AutopsyClient.tsx           # 메인 상태머신 (8단계)
│   │   ├── CauseOfDeathSelect.tsx      # 사인 선택 (5개 밸런스 게임)
│   │   ├── DurationSelect.tsx          # 사귄 기간 선택 (4개)
│   │   ├── CoronerSelect.tsx           # 검시관 선택 (윤태산 vs 서휘윤)
│   │   ├── AnalyzingAutopsy.tsx        # "검시관 출동 중..." 로딩 연출
│   │   ├── AutopsyCard.tsx             # 3장 카드 공통 레이아웃 (스와이프)
│   │   ├── DeathCertificate.tsx        # 사망진단서 카드 (toPng 캡처 대상)
│   │   ├── AutopsyResult.tsx           # 결과 + 공유 + CTA 화면
│   │   └── MorgueView.tsx             # 영안실 화면
│   └── ...
├── constants/
│   └── autopsy.ts                     # 위 상수 정의
├── types/
│   └── autopsy.ts                     # 위 타입 정의
└── lib/
    └── (기존 supabase, fetchWithRetry, share, analytics 재사용)

supabase/
├── functions/
│   └── analyze-saju-autopsy/
│       └── index.ts                   # Edge Function
└── migrations/
    └── 002_create_saju_autopsies.sql  # DB 스키마
```

### 6. 라우팅 & OG 메타

| 경로 | 렌더링 | OG 메타 |
|------|--------|---------|
| `/autopsy` | 정적 | "너를 못 알아본 놈, 사주로 부검합니다" + 고정 OG 이미지 |
| `/autopsy/[autopsyId]` | SSR (동적) | "안목 사망 판정 — 매력 감별 F등급, 후회 확률 94.7%" |

#### 동적 OG 메타 (`/autopsy/[autopsyId]/page.tsx`)

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { autopsyId } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from('saju_autopsies')
    .select('cause_of_death_label, discernment_grade, regret_probability, coroner_id')
    .eq('id', autopsyId)
    .single();

  if (!data) return { title: '사주 부검실' };

  const coronerName = data.coroner_id === 'yoon-taesan' ? '윤태산' : '서휘윤';

  return {
    title: `${data.cause_of_death_label} 판정 — 사주 부검실`,
    description: `매력 감별 ${data.discernment_grade}등급 | 후회 확률 ${data.regret_probability}% | 검시관 ${coronerName}`,
    openGraph: {
      title: `연애 사망진단서: ${data.cause_of_death_label}`,
      description: `매력 감별 능력 ${data.discernment_grade}등급, 후회 확률 ${data.regret_probability}%`,
      url: `https://sajugpt-viral.vercel.app/autopsy/${autopsyId}`,
      // Phase 2: 동적 OG 이미지 Edge Function
    },
  };
}
```

### 7. 영안실 쿼리

#### 7-1. 같은 사주 유형 피해자 수 + TOP 3 사망 원인

```typescript
// 프론트엔드에서 호출
const { data: morgueStats } = await supabase
  .from('autopsy_morgue_stats')
  .select('*')
  .eq('target_saju_type', targetSajuType)
  .single();

// 결과: { victim_count: 847, top_causes: [{ cause: '감정 불감증', count: 322 }, ...] }
```

#### 7-2. 같은 유형의 다른 부검 결과 열람 (최근 10개)

```typescript
const { data: otherAutopsies } = await supabase
  .from('saju_autopsies')
  .select('id, cause_of_death_label, discernment_grade, regret_probability, coroner_id, card3_verdict, created_at')
  .eq('target_saju_type', targetSajuType)
  .eq('is_archived', true)
  .neq('id', currentAutopsyId)
  .order('created_at', { ascending: false })
  .limit(10);
```

#### 7-3. 영안실 안치 (is_archived 플래그 업데이트)

```typescript
// 안치하기 버튼 클릭 시 — 프론트에서 직접 호출 불가 (RLS는 읽기만 허용)
// → 별도 Edge Function 또는 기존 Edge Function에 archive 액션 추가

// Option A: analyze-saju-autopsy에 archive 액션 추가
// POST { action: 'archive', autopsyId: '...' }
```

---

## 구현 순서 (Phase)

### Phase 1 — MVP (핵심 루프)

1. DB 마이그레이션 (`002_create_saju_autopsies.sql`)
2. Edge Function (`analyze-saju-autopsy`)
3. 타입 + 상수 정의
4. 컴포넌트 구현 (AutopsyClient → 입력 → 분석 → 3장 카드 → 결과)
5. 사망진단서 카드 (DeathCertificate — toPng 캡처)
6. 공유 기능 (ShareButtons 재사용)
7. OG 메타태그 (정적 + 동적)
8. Vercel 배포 + 테스트

### Phase 2 — 영안실 + 확장

1. 영안실 뷰 + 쿼리
2. 안치하기 기능
3. 다른 부검 결과 열람
4. 전전남친 리플레이 플로우
5. 캐릭터 챗봇 전환 CTA 연동
6. 카카오톡 JS SDK 공유
7. OG 이미지 동적 생성

---

**최종 업데이트**: 2026-03-27
