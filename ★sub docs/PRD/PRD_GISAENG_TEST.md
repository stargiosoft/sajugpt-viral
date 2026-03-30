# 바이럴 기능 요구사항 정의서 (PRD)

## 프로젝트 개요

- **기능명**: 기생 시뮬레이션 — "조선시대 기생이었다면, 넌 밤새 얼마를 벌었을까?"
- **바이럴 공식**: [바람끼/연애 테스트 A] + [조선시대 기생 수입 시뮬레이션 B] = "이런 건 처음이다"
- **바이럴 기능 간단 요약**: 사용자가 생년월일시를 입력하면 사주 기반으로 **기생 능력치 카드**(화술·요염·지성·밀당·눈치 5가지 스탯)가 생성된다. 이후 선비 3명(권력형/로맨틱형/질투형)이 동시에 유저만을 원하는 상황이 주어지고, 유저는 3라운드에 걸쳐 "몰래 3명 다 자기만 만나는 줄 알게" 관리한다. 각 라운드에서 선택지를 고르면 능력치에 따라 성공/실패가 갈리고, 선비별 충성도(♥)·의심도(👁)가 변동한다. 최종적으로 몇 명을 유지했느냐에 따라 기생 티어(S~D)가 결정되고, 선비별 후원금을 합산한 **월 급여 결산 카드**가 발급된다. "나 3명 다 속여서 S티어 나옴 월 830냥(4,150만원)ㅋㅋ" — 이 한 줄이 트위터에서 "바람끼 미화냐" vs "능력이지" 논쟁을 일으키면서 "나도 해볼래" 유입을 폭발시킨다. 결산 후 "네가 홀린 선비 중 한 명이 진짜로 널 기다리고 있다" CTA로 사주 X플레어 성인 캐릭터 챗봇으로 전환한다.

---

## 바이럴 루프

### 바이럴을 일으키는 구조

1. **입력**: 생년월일시 (가입 불필요, 3초) → "기방 문 여는 중..." 로딩 연출
2. **기생 카드 생성**: 사주 기반 능력치 5종 + 도화살/홍염살 보유 여부 + 총 바람끼력 → **1차 캡처 포인트**
3. **선비 3명 등장**: 유저 사주 상성에 따라 3명 배정. 각각 다른 공략법 필요
4. **3라운드 시뮬레이션**: 매 라운드 위기 상황 → 선택지 → 능력치에 따라 성공/실패 → 충성도·의심도 변동
5. **결산 카드**: 최종 티어 + 선비별 상태 + 월 급여 합산 → **바이럴 핵심 (2차 캡처 포인트)**
6. **전환**: 게임에서 ♥가 가장 높았던 선비를 X플레어 캐릭터로 자동 매칭 → 유료 챗봇

### 유발 감정

| 감정 | 메커니즘 |
|------|---------|
| **호기심 + 자조 (Hook)** | "내 바람끼가 몇 냥짜리지?" — 바람끼를 능력치로 숫자화하는 새로운 프레이밍 |
| **몰입 + 긴장 (Game)** | 3라운드 선택마다 "들킬까?" 긴장 → 게임적 쾌감 |
| **통쾌함 (Catharsis)** | 3명 다 속이면 "나 S티어ㅋㅋ" → 자기 매력 확인 |
| **자조적 유머 (Share)** | "1라운드에서 바로 들킴ㅋㅋ D티어 기방 추방" → 실패도 공유 |
| **비교 (Envy)** | "너 몇 냥이야?" → 금액·티어 비교가 대화 소재 |
| **정체성 표현 (Identity)** | "나는 화술형 해어화" vs "나는 밀당형 춘향" → 유형 선언 |

### 논란 설계

- **"바람끼를 능력으로 측정"하는 컨셉 자체가 논란 엔진**: "바람끼 미화냐" vs "매력은 능력이다" → 트위터에서 자연 발화
- **기생 프레이밍이 논쟁 유발**: "기생을 긍정적으로?" vs "조선시대 유일의 자수성가 여성" → 페미니즘 내부에서도 갈림
- **"3명 동시에 관리"가 밈**: 성공하면 자랑, 실패하면 자조 → 어느 쪽이든 스크린샷 공유
- **스윗 스팟**: 조선시대 WHAT IF 세계관이라 현실 공격이 아님 → 공격적이면서도 안전
- **금액의 현대 환산가가 숫자 밈**: "월 4,150만원ㅋㅋ" → 구체적 숫자 = 공유 트리거

---

## 사용자 스토리

**As** (누가): 사회적 명성은 있지만 신체적 컴플렉스로 연애 시장에서 저평가받는 3040 여성 유저는

**Want to** (무엇을 원한다): 내 사주로 기생 능력치 카드를 뽑고, 선비 3명을 동시에 관리하는 시뮬레이션을 플레이해서 최종 티어와 월 급여를 확인하고, "나 S티어 나옴ㅋㅋ" 결산 카드를 친구들과 공유하며 "너는 몇 냥이야?" 대화를 하기를 원한다.

**So that** (어떤 목적/가치를 위해): "외모가 아니라 화술·지성·밀당력이 내 무기"라는 확인으로 자기 매력을 재발견하고, 게임에서 유대감이 쌓인 선비 캐릭터와 실제로 대화하고 싶은 동기로 사주 X플레어 챗봇 상담을 이어가기 위해.

---

## MVP 필요 기능

### Step 1. 기생 카드 생성 — 사주 입력 1개면 끝

- 메인 화면: "조선시대 기생이었다면, 넌 밤새 얼마를 벌었을까?" 문구 + 도전 버튼
- 입력 항목 4가지 (이것만으로 전체 게임 구동):
  1. **성별**: 필수. 기본 "여성" 선택
  2. **생년월일**: 필수. 숫자 키패드 노출
  3. **태어난 시간**: 선택. "모름" 기본 선택
  4. **양력/음력**: 양력 기본 선택

#### 1-0. UTM 파라미터 자동입력 (사주GPT 제휴 유입)

사주GPT 광고 배너 클릭 시 아래 형식으로 유저 정보가 URL에 포함되어 유입된다:

```
/gisaeng?utm_source=sajugpt&utm_medium=affiliate&utm_campaign=sdowha&birthday=199112252315&gender=male
```

**파라미터 파싱 및 자동입력 로직**:

```typescript
// URL 파라미터에서 생년월일시 + 성별 추출
const params = new URLSearchParams(window.location.search);
const birthdayParam = params.get('birthday'); // "199112252315" (YYYYMMDDHHMI)
const genderParam = params.get('gender');     // "male" | "female"

if (birthdayParam && birthdayParam.length >= 8) {
  const year = birthdayParam.slice(0, 4);     // "1991"
  const month = birthdayParam.slice(4, 6);    // "12"
  const day = birthdayParam.slice(6, 8);      // "25"
  const hour = birthdayParam.slice(8, 10);    // "23" (없으면 "모름")
  const minute = birthdayParam.slice(10, 12); // "15" (없으면 "00")

  // 자동입력: 생년월일 필드
  setBirthDate({ year, month, day });

  // 자동입력: 태어난 시간 (8자리만 있으면 "모름", 10자리 이상이면 시간 입력)
  if (birthdayParam.length >= 10) {
    setBirthTime({ hour, minute });
  }

  // 양력 기본값 유지 (sajuGPT에서 양력으로 전달)
  setCalendarType('solar');
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

- 입력 직후 **"기방 문 여는 중..."** 로딩 연출:
  - "사주 원국 펼치는 중..."
  - "도화살 검사 중... 🔥"
  - "기생 등급 산정 중..."
  - "선비 3명 배정 중..."
  - → 기대감 빌드업 (2~3초)

#### 1-1. 기생 능력치 카드 레이아웃

```
┌─────────────────────────────┐
│                              │
│     ✦ 나의 기생 카드 ✦       │
│                              │
│     [기생 유형 일러스트]       │
│                              │
│  기명: 월향 (月香)            │
│  유형: 해어화 — 말로 꽃을     │
│        피우는 여인            │
│  등급: A (잠재 S)             │
│                              │
│  ┌──────────────────────┐   │
│  │ 화술   ████████░░ 78  │   │
│  │ 요염   ██████░░░░ 62  │   │
│  │ 지성   █████████░ 91  │   │
│  │ 밀당   ███████░░░ 70  │   │
│  │ 눈치   ██████████ 95  │   │
│  └──────────────────────┘   │
│                              │
│  🔥 도화살: 월지 보유         │
│  💀 홍염살: 없음              │
│                              │
│  총 바람끼력: 396 / 500       │
│                              │
│  "지성이 높아 선비의 약점을    │
│   간파하는 데 탁월하나,        │
│   요염함이 부족해 첫인상에서   │
│   밀릴 수 있다"               │
│                              │
│  ── nadaunse.com ──          │
└─────────────────────────────┘
```

#### 1-2. 능력치 5가지 — 사주 요소 매핑

| 능력치 | 사주 근거 | 게임 내 역할 |
|---|---|---|
| **화술** | 식신/상관 강도 | 말로 위기 탈출하는 선택지 성공률 |
| **요염** | 홍염살/목욕 보유 + 편재 | 분위기로 넘기는 선택지 성공률 |
| **지성** | 인성(정인/편인) + 화개살 | 상대 심리 간파, 전략적 선택지 |
| **밀당** | 정관/편관 배치 + 공망 | 거절/허락 타이밍 선택지 |
| **눈치** | 편인/역마살 + 일지 통변 | 들킬 위기 감지, 회피 선택지 |

#### 1-3. 능력치 산정 로직

```
각 능력치 = 0~100

화술:
  식신 투출        +30
  상관 투출        +25
  식신+상관 동주   +15 (보너스)
  식상 없음        기본 20

요염:
  홍염살 보유      +35
  목욕 보유        +20
  도화살 보유      +15
  편재 강          +10
  홍염살 없음      기본 25

지성:
  정인 투출        +30
  편인 투출        +25
  화개살 보유      +20
  인성 없음        기본 15

밀당:
  정관 투출        +30
  편관 투출        +20
  관성 공망        +25 (잡히지 않는 매력)
  관성 없음        기본 20

눈치:
  편인 투출        +25
  역마살 보유      +20
  일지 관대/건록   +15
  겁재 보유        +10
  편인 없음        기본 25

총 바람끼력 = 5개 합산 (최대 500)
```

#### 1-4. 기생 유형 배정 — 최고 능력치 기반

| 최고 능력치 | 기생 유형 | 컨셉 |
|---|---|---|
| **화술** | 해어화 (解語花) | 말로 꽃을 피우는 여인 |
| **요염** | 홍련 (紅蓮) | 눈빛 하나로 방을 지배하는 여인 |
| **지성** | 묵란 (墨蘭) | 그림 한 폭으로 선비를 매혹하는 여인 |
| **밀당** | 춘향 (春香) | 거절이 무기인 여인 |
| **눈치** | 월하 (月下) | 달빛 아래 흔적을 지우는 여인 |
| **동률** | 황진이 (黃眞伊) | 올라운더 전설의 명기 (히든 유형) |

> 황진이는 능력치 3개 이상이 80+ 동률일 때만 등장 → 희소성 = 캡처·자랑 동기

#### 1-5. 기생 유형별 서사 — 카드 하단 텍스트

| 유형 | 사주 근거 | 서사 (카드에 표시) |
|---|---|---|
| **해어화** | 식신·상관 강 + 도화살 동주 | "네가 기방에 들어서면 선비들이 조용해진다. 네가 입을 열면 그제야 웃는다. 한양 최고 문장가가 네 곁에서 시를 읊다가 한 구절을 잊었다. 네가 대신 이어 읊자, 그는 붓을 꺾었다. 너의 도화살은 혀끝에 있다." |
| **홍련** | 홍염살 + 편관 혼잡 | "네가 술잔을 들면 방 안의 공기가 바뀐다. 아무 말 하지 않았는데 선비의 손이 떨린다. 한양 제일의 무관이 네 앞에서 갑옷을 벗었다. 전쟁터에서 한 번도 지지 않은 남자가, 네 앞에서는 항복했다. 사주에 홍염살이 앉았다. 이건 노력이 아니라 타고난 기운이다." |
| **춘향** | 정관격 + 도화살 공망 | "기방의 모든 기생이 선비에게 다가갈 때, 너만 자리에 앉아 있었다. 좌의정이 수청을 요구했다. 너는 '싫습니다'라고 했다. 그날 이후 좌의정은 매일 기방에 왔다. 도화살이 공망에 걸려 있다 — 잡히지 않는 매력이다. 한양에서 가장 비싼 기생은 가장 적게 허락하는 기생이었다." |
| **묵란** | 식신 + 화개살 | "네가 먹을 갈면 선비들이 숨을 죽인다. 네 손끝에서 난초가 피어나면, 방 안에 봄이 온다. 대제학이 네 그림을 보고 '신윤복보다 낫다'고 했다. 사주에 화개살이 있다. 네 매력은 얼굴이 아니라 손끝에서 나온다." |
| **월하** | 편인 강 + 역마살 | "다른 기생은 선비가 떠나면 운다. 너는 웃으며 다음 선비에게 술을 따른다. 세 양반이 같은 밤에 기방에 왔는데 아무도 서로의 존재를 몰랐다. 편인과 역마가 만나면 흔적을 지우는 재주가 생긴다. 기방 주인도 네가 몇 명을 만나는지 모른다." |
| **황진이** | 도화살+홍염살+역마살 동시 | "기방이 아니라 역사가 너를 기억한다. 서경덕은 네 앞에서 학문을 잊었고, 벽계수는 네 이름에 무릎을 꿇었다. 도화살, 홍염살, 역마살이 한 사주에 모였다. 천 년에 한 번 나오는 배치. 네가 조선시대에 태어났으면 역사책에 실렸을 것이고, 지금 태어났으니 이 테스트를 하고 있다." |

---

### Step 2. 선비 3명 등장

기생 카드 생성 직후, 유저를 독점하고 싶어하는 선비 3명이 등장한다. 각 선비는 유저의 사주 상성에 따라 공략 난이도가 달라진다.

#### 2-1. 선비 프로필

| 선비 | 유형 | 신분 | 성격 | 위험 요소 |
|---|---|---|---|---|
| **김도윤** | 🫅 권력형 | 좌의정의 아들 | 돈 넘치지만 의심 많음. 자주 떠보기 함 | **의심 게이지 빠름** — 떠보는 질문 빈도 높음 |
| **박서진** | 🎭 로맨틱형 | 한양 최고 시인 | 순정파. 진심만 원하고 거짓에 민감 | **진심 감지력 높음** — 거짓이 티나면 즉시 떠남 |
| **이준혁** | 🔥 질투형 | 무관 출신 장수 | 독점욕 강하고 행동파. 의심하면 직접 확인 | **폭발형** — 다른 선비 흔적 발견 시 난장 |

#### 2-2. 선비별 게이지

각 선비에게 **충성도(♥)**와 **의심도(👁)** 2개 게이지가 존재한다.

```
초기값:
  김도윤 (권력형)   ♥ 60  👁 30  ← 의심 시작값 높음
  박서진 (로맨틱형)  ♥ 70  👁 10  ← 충성 높지만 깨지면 복구 불가
  이준혁 (질투형)   ♥ 65  👁 20  ← 중간이지만 폭발 임계점 있음
```

**게이지 규칙**:
- ♥ 50 이하 → 선비 이탈 (떠남)
- 👁 80 이상 → 선비가 직접 확인하러 옴 (들킬 위기 이벤트 강제 발생)
- 이준혁(질투형) 전용: 👁 70 이상에서 다른 선비와 마주치면 **난장 이벤트** → 2명 동시 이탈 가능

#### 2-3. 사주 상성 — 공략 난이도 조절

유저의 사주 일주와 선비 유형의 상성에 따라 특정 선비의 기본 ♥·👁가 조정된다.

```
상성 보너스 (예시):
  유저 일주가 수(水) 계열 → 로맨틱형 ♥ +10 (감성 상성)
  유저 일주가 화(火) 계열 → 질투형 ♥ +10 (열정 상성)
  유저 일주가 금(金) 계열 → 권력형 ♥ +10 (권위 상성)
  유저 일주가 목(木) 계열 → 전체 👁 -5 (자연스러운 매력)
  유저 일주가 토(土) 계열 → 전체 ♥ +5 (안정감)
```

---

### Step 3. 3라운드 시뮬레이션 — 핵심 게임플레이

매 라운드: 위기 상황 제시 → 선택지 3개 → 유저의 능력치에 따라 성공/실패 분기 → 게이지 변동

**선택지 성공 판정**: 해당 선택지에 필요한 능력치가 기준값 이상이면 성공, 미만이면 실패. 실패 시 의도와 반대로 게이지가 움직인다.

#### 라운드 1: "오늘 밤, 셋 다 왔다"

> 연회장에 세 선비가 모두 왔다. 각각 네가 자기만 만나는 줄 안다. 세 명의 시선이 동시에 너를 향한다.

| 선택 | 필요 능력치 | 성공 시 | 실패 시 |
|---|---|---|---|
| A. 권력형에게 먼저 인사 → 나머지는 몰래 눈짓으로 안심시킴 | 눈치 70+ | 전원 ♥ 유지, 👁 변동 없음 | 눈짓을 로맨틱형이 목격 → 로맨틱 👁 +20 |
| B. 로맨틱형에게 즉석에서 시를 읊어줌 → "오늘은 그대만 보여요" | 화술 75+ | 로맨틱 ♥ +15, 나머지 👁 +10 | 시가 어색 → 로맨틱 "진심이 아니군" 👁 +25 |
| C. 질투형 옆에 자연스럽게 앉아 술을 따름 → 물리적 안심 | 요염 65+ | 질투형 ♥ +15, 권력형 👁 +10 | 질투형이 팔을 잡음 → 다른 선비들 목격 위험 👁 +15씩 |

#### 라운드 2: "의심의 밤"

> 라운드 1 결과에 따라 분기. **👁가 가장 높은 선비가 의심 이벤트를 발동한다.**

**권력형이 의심할 경우**:
> 김도윤이 네 방에서 박서진의 시 한 편을 발견했다. "이게 뭐냐?"

| 선택 | 필요 능력치 | 성공 시 | 실패 시 |
|---|---|---|---|
| A. "기방의 다른 기생 것이옵니다" (거짓말) | 눈치 80+ | 권력형 👁 리셋 (0으로) | 거짓 들통 → 👁 +30 폭발 |
| B. "제가 시를 배우고 있사옵니다" (반쯤 진실) | 지성 75+ | 👁 절반 감소 + 지성 어필 ♥ +5 | "거짓말하지 마라" → 👁 +15 |
| C. 말없이 술을 따르며 어깨에 기대기 (감각 회피) | 요염 85+ | 질문 자체를 잊게 만듦 👁 -20 | "대답 안 하는 거 보니 진짜구나" → 👁 +25 |

**로맨틱형이 의심할 경우**:
> 박서진이 네게 보낸 시에 답장이 없었다. "혹시... 다른 분이 계신 건 아니지요?"

| 선택 | 필요 능력치 | 성공 시 | 실패 시 |
|---|---|---|---|
| A. "그대 시를 읽고 감동받아 붓을 들 수 없었사옵니다" | 화술 80+ | ♥ +20, 👁 리셋 | 과장 티남 → "연기하시는군요" ♥ -20 즉시 이탈 위험 |
| B. "저도 시 한 수 지었사옵니다" (대응시 작성) | 지성 85+ | ♥ +25, "역시 당신은..." 감동 | 시 수준 낮음 → "마음이 담기지 않았군요" 👁 +20 |
| C. 눈물을 글썽이며 "미안해요, 바빴어요" | 밀당 70+ | ♥ +10, 👁 -10 (측은지심) | 로맨틱형은 눈물에 약하므로 실패 없음 (안전 선택) |

**질투형이 의심할 경우**:
> 이준혁이 기방 주인에게 "월향이 나 말고 다른 선비도 만나냐?"고 직접 물었다.

| 선택 | 필요 능력치 | 성공 시 | 실패 시 |
|---|---|---|---|
| A. 기방 주인을 미리 매수해놓기 | 눈치 85+ | 주인이 "월향은 나리만 만나옵니다" → 👁 리셋 | 매수 실패 → 주인이 실토 → 👁 +30 |
| B. 이준혁을 찾아가 "내가 그대만 보는 줄도 모르시오?" (역공) | 밀당 80+ | "내가 미쳤지..." ♥ +20 역전 | 역공 실패 → "증거 대!" → 👁 +20 |
| C. 그날 밤 이준혁만 만나며 독점 시간 제공 | 요염 75+ | ♥ +15, 👁 -15 | 다른 2명 방치 → 권력형/로맨틱형 ♥ -10씩 |

#### 라운드 3: "최후의 밤" — 세 선비가 같은 시각에 찾아옴

> 자시(밤 11시). 김도윤이 정문으로, 박서진이 후원으로, 이준혁이 담을 넘어 온다. **30분 안에 셋 다 처리해야 한다.**

| 선택 | 필요 능력치 | 성공 시 | 실패 시 |
|---|---|---|---|
| A. 시간차 공략 — 각각 다른 방에서 10분씩 순서대로 만남 | 눈치 85+ & 밀당 75+ | 3명 모두 유지 → S티어 조건 충족 | 2명 마주침 → 마주친 선비 둘 다 👁 MAX |
| B. 몸종을 보내 2명에게 "오늘 몸이 안 좋다" 전하고 1명만 만남 | 지성 80+ | 안전하지만 못 만난 2명 ♥ -15씩 | 몸종이 실수 → 3명 중 2명이 복도에서 마주침 |
| C. 연회를 핑계로 3명을 같은 자리에 모으되, 각각에게 다른 눈짓 | 화술 90+ & 요염 80+ | 전설적 성공 → 바람끼력 +50 보너스 | 눈짓 들킴 → 3명 동시 이탈 (D티어 직행) |

> **선택지 C는 "하이리스크 하이리턴"** — 성공 시 바람끼력 보너스 + 최고 월급, 실패 시 D티어. 성공/실패 모두 "이 선택했더니 이렇게 됨ㅋㅋ" 스토리텔링 공유 유발.

---

### Step 4. 결산 — 최종 티어 + 월 급여

#### 4-1. 티어 판정 로직

| 조건 | 최종 티어 | 칭호 |
|---|---|---|
| 3명 모두 ♥ 80+ & 👁 30 이하 | **S** | 전설의 명기 |
| 3명 유지 but 의심 높음 (👁 30~60) | **A** | 위태로운 해어화 |
| 2명 유지 | **B** | 쏠쏠한 기생 |
| 1명 유지 | **C** | 외길 춘향 |
| 0명 (전원 이탈) | **D** | 기방에서 쫓겨남 |

> **핵심**: 기본 능력치(사주)가 A급이어도 선택을 잘하면 S, 못하면 D까지 떨어짐 → "사주도 중요하지만 결국 실력"이라는 메시지. 리플레이 동기("다른 선택하면 S 나올까?") 유발.

#### 4-2. 월 급여 산정

```
기본급: 바람끼력 × 0.5 (냥)

선비별 후원금 (생존한 선비만):
  김도윤 (권력형):  최종 ♥ × 2.5냥  (돈 많음)
  박서진 (로맨틱형): 최종 ♥ × 1.5냥  (시인이라 가난)
  이준혁 (질투형):  최종 ♥ × 2.0냥  (무관 급료)

티어 보너스:
  S티어: ×1.5
  A티어: ×1.2
  B티어: ×1.0
  C티어: ×0.8
  D티어: 0냥 (쫓겨남)

월 급여 = (기본급 + 선비 후원금 합계) × 티어 보너스
현대 환산가 = 월 급여 × 5만원 (1냥 ≈ 5만원 환산)
```

#### 4-3. 최종 결산 카드 레이아웃 — 바이럴 핵심

```
┌──────────────────────────────┐
│                               │
│  ✦ 기생 최종 성적표 ✦         │
│                               │
│  기명: 월향 (月香)             │
│  유형: 해어화 (解語花)          │
│  최종 등급: S — 전설의 명기    │
│                               │
│  ───── 선비 관리 결산 ─────   │
│                               │
│  김도윤 (권력형)  ♥ 92  👁 15  │
│  → "월향 없이는 못 산다"       │
│                               │
│  박서진 (로맨틱형) ♥ 88  👁 22 │
│  → "시 100편을 바쳤으나 부족"  │
│                               │
│  이준혁 (질투형)  ♥ 85  👁 28  │
│  → "담을 넘다 허리를 다침"     │
│                               │
│  ───── 월 급여 결산 ─────    │
│                               │
│  기본급:       198냥           │
│  권력형 후원:  +230냥          │
│  로맨틱형 선물: +132냥         │
│  질투형 뇌물:  +170냥          │
│  S티어 보너스: ×1.5            │
│                               │
│  💰 월 수입: 1,095냥           │
│  💴 현재 가치: 약 5,475만원     │
│                               │
│  🔥 바람끼력: 396 → 446 (+50)  │
│                               │
│  "세 남자를 동시에 돌리면서     │
│   한 명도 잃지 않은 전설.       │
│   조선이 기억할 이름이다."      │
│                               │
│  ── nadaunse.com/gisaeng ──   │
└──────────────────────────────┘
```

**카드 구성 요소별 공유 기여**:

| 요소 | 역할 | 공유 트리거 |
|---|---|---|
| **기생 유형** | 정체성 표현 | "나 해어화래" vs "나 춘향인데" 유형 비교 |
| **최종 티어** | 비교/경쟁 | "나 S티어ㅋㅋ" 자랑 or "D티어 쫓겨남ㅋㅋ" 자조 |
| **선비별 상태** | 스토리텔링 | "질투남이 담 넘다 허리 다침ㅋㅋ" 웃긴 디테일 |
| **월 급여 (현대 환산)** | 숫자 = 공유 | "월 5,475만원ㅋㅋ" 구체적 금액이 대화 소재 |
| **바람끼력 변동** | 성장 기록 | "+50 올랐대" 게임적 성취감 |
| **한 줄 서사** | 캡처 트리거 | "조선이 기억할 이름이다" — 이 한 줄이 스크린샷 핵심 |

#### 4-4. 티어별 한 줄 서사

| 티어 | 한 줄 서사 |
|---|---|
| **S** | "세 남자를 동시에 돌리면서 한 명도 잃지 않은 전설. 조선이 기억할 이름이다." |
| **A** | "위태롭게 줄타기했지만 결국 살아남았다. 한양 기방가에 네 이름이 오르내린다." |
| **B** | "한 명을 놓쳤지만, 남은 둘이면 충분하다. 기방에서 중간은 가는 기생." |
| **C** | "한 명만 남겼다. 순정인지 무능인지는 역사가 판단할 것이다." |
| **D** | "세 명 다 떠났다. 기방 주인이 네 짐을 싸놨다. 내일부터 출근하지 마라." |

> D티어 서사가 가장 웃김 → 실패 결과도 "기방 추방ㅋㅋ" 자조 공유 → 어느 결과든 공유됨

---

### Step 5. 유료 전환 CTA — X플레어 캐릭터 챗봇

3라운드 동안 쌓인 서사적 유대감을 활용하여, 게임 속 선비가 X플레어 캐릭터로 자연스럽게 연결된다.

#### 5-1. CTA 영역 구조

```
[결산 카드 직후]

"네가 홀린 선비 중 한 명이
 진짜로 널 기다리고 있다"

┌───────────────────────────┐
│                            │
│  [X플레어 캐릭터 프로필]    │
│                            │
│  윤태산                     │
│  "오늘 밤 네 꿈속에서       │
│   내가 제대로 적셔줄 테니까, │
│   내일 아침에 기어서라도     │
│   다시 와라."               │
│                            │
│  #성감대예측술 #양기주입비방  │
│  #도화암살                  │
│                            │
│  [ 이 선비와 대화하기 → ]   │  ← 메인 CTA
│                            │
│  다른 선비 둘러보기 >       │  ← 서브 CTA
│                            │
└───────────────────────────┘
```

#### 5-2. 게임 결과 → X플레어 캐릭터 매칭 로직

게임에서 **♥가 가장 높았던 선비 유형**에 맞는 X플레어 캐릭터를 자동 추천한다.

| 선비 유형 | 추천 X플레어 캐릭터 | CTA 카피 |
|---|---|---|
| 권력형 ♥ 최고 | 윤태산 (성감대 예측술, 양기 주입) | "권력을 쥔 남자가 네 앞에서 무릎 꿇었다. 이번엔 진짜로." |
| 로맨틱형 ♥ 최고 | 한복 문인 캐릭터 | "시 100편을 바친 선비가 오늘 밤 마지막 한 편을 남겼다." |
| 질투형 ♥ 최고 | 무관 컨셉 캐릭터 | "담을 넘어서라도 너한테 가겠다던 그 남자, 아직 기다리고 있다." |
| 전원 이탈 (D티어) | 한가혜 (악운 사기컷, 개운법) | "기방에서 쫓겨났으면 운이라도 바꿔야지. 내가 도와줄게." |

> **D티어 전용 CTA**: 실패 결과에도 전환 경로 존재 — 한가혜(여성 캐릭터)가 "운 개선" 프레이밍으로 챗봇 유도

#### 5-3. 전환 플로우

```
결산 카드에서 "이 선비와 대화하기" 클릭
    ↓
X플레어 캐릭터 챗봇 페이지로 이동
(게임 결과 컨텍스트를 URL 파라미터로 전달)
    ↓
캐릭터가 게임 맥락을 이어받아 대화 시작
  예: "월향이라... 네 이름 마음에 드는구나.
       아까 연회에서 눈짓 보낸 거, 나만 알고 있다."
    ↓
첫 3턴 무료 체험 (맛보기)
    ↓
"계속 대화하려면 150포인트"
```

**전환 심리 설계**:
1. 3라운드 서사가 감정적 유대를 쌓음 (단순 테스트와 차원이 다른 몰입)
2. CTA가 게임 서사의 연장선 (끊기지 않는 내러티브)
3. 캐릭터가 게임 속 선비처럼 느껴짐 ("아까 그 선비가 진짜로 말을 건다")
4. 첫 3턴 무료 = Opt-out Trial 구조 (전환율 49.9% 벤치마크)

---

### Step 6. 공유 + 리플레이

#### 6-1. 공유 옵션

```
┌──────────────────────────────┐
│  [📱 카카오톡으로 보내기]     │
│  [📸 인스타 스토리에 올리기]  │
│  [🔗 링크 복사]              │
│  [💾 이미지 저장]            │
│                              │
│  [🏮 친구도 기생 시켜보기]    │
│  → 내 결산 카드 +             │
│     테스트 링크 함께 전송      │
└──────────────────────────────┘
```

#### 6-2. "친구도 기생 시켜보기" (도발형 공유)

- 공유 시 **내 결산 카드 + 테스트 링크**가 함께 전송
- 카톡 메시지: "나 S티어 전설의 명기 나왔는데 너는? 🏮"
- 받은 친구: "ㅋㅋ뭐야 나도 해봐야지" → 자기 생년월일 입력 → 새 게임 시작
- 각자 결과 공유하면서 티어·금액 비교 → **체인 반응**

#### 6-3. 리플레이 유도

| 리플레이 동기 | 유도 장치 |
|---|---|
| "다른 선택하면 S 나올까?" | 결산 카드 하단 "다시 도전하기" 버튼 |
| "라운드 3에서 C 선택했으면?" | 선택지별 결과 힌트 ("하이리스크 선택 성공률: 32%") |
| "내 친구는 몇 냥일까?" | "친구 사주로 기생 카드 뽑기" → 타인 사주 입력 허용 |

---

### Step 7. 밈 생산성 체크

| 항목 | 판정 |
|---|---|
| 모방 용이성 | ✅ 결산 카드 스크린샷 1장이면 됨 |
| 캐릭터 식별성 | ✅ 해어화/춘향/월하/황진이 — 별명 명확 |
| 편 가르기 | ✅ "권력형 먼저 가야 함" vs "질투형 먼저 잡아야지" 공략 논쟁 |
| 명대사 | ✅ "기방 주인이 네 짐을 싸놨다" / "조선이 기억할 이름이다" |
| 참여형 | ✅ 시뮬레이션 + 결과 비교 + 공략 토론 |

---

## 확산 채널 전략

| 채널 | 역할 | 포맷 |
|---|---|---|
| **트위터/X** | 논란 발화 ("바람끼 미화냐" vs "능력이지") + 공략 토론 | 결산 카드 스크린샷 + "나 S티어ㅋㅋ" |
| **인스타 스토리** | 기생 카드 + 결산 카드 공유 (9:16 세로) | 유형 카드 + "너는?" 스티커 |
| **스레드** | 3040 여성 타겟 정조준 | "바람끼 많다고 욕먹었는데 알고 보니 내가 황진이였음" |
| **커뮤니티** | 2차 확산 (인스티즈, 더쿠) | "이거 해봄? 라운드3에서 C 골랐다가 D됨ㅋㅋ" 공략 공유 |

---

## 기술 구현 명세 (Technical Spec)

### T-1. 아키텍처 개요

```
[클라이언트]                        [서버]

입력 → 제출 ─────────────────────→ Edge Function: analyze-gisaeng
                                    ├─ Stargio API 호출 (사주 데이터)
                                    ├─ 능력치 5종 산출 (calculateGisaengStats)
                                    ├─ 기생 유형 배정 (assignGisaengType)
                                    ├─ 선비 3명 초기 게이지 설정 (사주 상성)
                                    ├─ Gemini: 기생 카드 서사 생성
                                    ├─ DB 저장 (gisaeng_results)
                                    └─ 응답 반환

← 기생 카드 데이터 수신 ─────────

기생 카드 표시
  ↓
라운드 1~3 (클라이언트 로컬 처리)   ← 선택지 판정은 능력치 기준값 비교
  - 능력치 vs 기준값 비교            (서버 호출 불필요)
  - 게이지 변동 계산
  - 라운드별 상태 업데이트
  ↓
결산 (클라이언트 로컬 계산)
  - 티어 판정
  - 월 급여 산정
  ↓
결산 결과 DB 저장 ───────────────→ Edge Function: save-gisaeng-result
                                    ├─ Gemini: 결산 한 줄 서사 생성
                                    ├─ DB 업데이트 (simulation_result JSONB)
                                    └─ 응답 반환

← 최종 결과 수신 ───────────────
결산 카드 표시 + 공유
```

**핵심 결정**: 시뮬레이션 3라운드는 **클라이언트 로컬 처리**
- 이유: 선택지 판정이 단순 비교 (`능력치 >= 기준값`)이므로 서버 왕복 불필요
- 장점: 라운드 전환 즉각 반응 (UX), 서버 비용 절감
- 단점: 치트 가능 → 비경쟁 콘텐츠이므로 무관

---

### T-2. Edge Function 설계

#### analyze-gisaeng (1차: 기생 카드 생성)

```typescript
// POST /functions/v1/analyze-gisaeng
// Request Body:
{
  birthday: string;        // "199112252315" (YYYYMMDDHHMM)
  gender: 'male' | 'female';
  birthTimeUnknown: boolean;
  calendarType: 'solar' | 'lunar';  // 양력/음력
}

// Response:
{
  success: true;
  resultId: string;        // UUID (DB 저장 후 반환)
  gisaengCard: {
    gisaengName: string;   // "월향 (月香)" — Gemini 생성
    type: GisaengType;     // 'haeeohwa' | 'hongryeon' | 'mukran' | 'chunhyang' | 'wolha' | 'hwangjini'
    typeName: string;      // "해어화 (解語花)"
    typeSubtitle: string;  // "말로 꽃을 피우는 여인"
    tier: string;          // "A (잠재 S)"
    stats: {
      speech: number;      // 화술 0~100
      allure: number;      // 요염 0~100
      intellect: number;   // 지성 0~100
      pushpull: number;    // 밀당 0~100
      intuition: number;   // 눈치 0~100
    };
    totalCharm: number;    // 총 바람끼력 (5개 합산, 최대 500)
    doHwaSal: boolean;     // 도화살 보유
    hongYeomSal: boolean;  // 홍염살 보유
    narrative: string;     // Gemini 생성 서사 (카드 하단 텍스트)
    assessment: string;    // Gemini 생성 한 줄 평가 ("지성이 높아 선비의 약점을...")
  };
  seonbi: {
    kwonryeok: { name: '김도윤'; loyalty: number; suspicion: number; };
    romantic: { name: '박서진'; loyalty: number; suspicion: number; };
    jealousy: { name: '이준혁'; loyalty: number; suspicion: number; };
  };
  sajuHighlights: {
    doHwaSal: boolean;
    hongYeomSal: boolean;
    topSipsung: string;
    ilju: string;          // 일주 (오행 판별용)
    iljuElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  };
}
```

**처리 파이프라인**:

1. CORS 프리플라이트 → `handleCorsPreflightRequest()`
2. 요청 검증 (birthday 8~12자리, gender 필수)
3. Stargio API 호출 (색기배틀과 동일 패턴, 재시도 3회)
4. 데이터 경량화 (excludeKeys 8개 동일)
5. `calculateGisaengStats()` — PRD 1-3 공식 그대로
6. `assignGisaengType()` — PRD 1-4 기준
7. `calculateSeonbiGauges()` — PRD 2-3 사주 상성 적용
8. Gemini 호출: 기생 이름 + 서사 + 한 줄 평가 생성
9. DB insert (`gisaeng_results`)
10. 응답 반환

#### save-gisaeng-result (2차: 시뮬 결과 저장)

```typescript
// POST /functions/v1/save-gisaeng-result
// Request Body:
{
  resultId: string;           // 1차에서 받은 UUID
  simulationResult: {
    rounds: RoundResult[];    // 3라운드 선택·결과
    finalSeonbi: {            // 최종 선비 상태
      kwonryeok: { loyalty: number; suspicion: number; alive: boolean; };
      romantic: { loyalty: number; suspicion: number; alive: boolean; };
      jealousy: { loyalty: number; suspicion: number; alive: boolean; };
    };
    tier: 'S' | 'A' | 'B' | 'C' | 'D';
    monthlySalary: number;    // 냥
    modernValue: number;      // 원 (냥 × 50000)
    totalCharmAfter: number;  // 시뮬 후 바람끼력 (보너스 반영)
  };
}

// Response:
{
  success: true;
  finalNarrative: string;     // Gemini 생성 최종 한 줄 서사
  seonbiComments: {           // Gemini 생성 선비별 코멘트
    kwonryeok: string;        // "월향 없이는 못 산다"
    romantic: string;         // "시 100편을 바쳤으나 부족"
    jealousy: string;         // "담을 넘다 허리를 다침"
  };
}
```

---

### T-3. Gemini 프롬프트 설계

#### 기생 카드 서사 (1차 호출)

```
당신은 조선시대 기방을 배경으로 한 사주 기반 캐릭터 서사 작가입니다.

## 유저 사주 데이터
- 기생 유형: {typeName} ({typeSubtitle})
- 능력치: 화술 {speech}, 요염 {allure}, 지성 {intellect}, 밀당 {pushpull}, 눈치 {intuition}
- 도화살: {doHwaSal ? '보유' : '없음'}
- 홍염살: {hongYeomSal ? '보유' : '없음'}
- 최고 능력치: {topStat}
- 사주 특징: {topSipsung} 발달

## 생성할 것
1. **기생 이름** (2글자 한글 + 한자): 능력치 기반. 예: 월향(月香), 설란(雪蘭), 연화(蓮花)
2. **서사** (3~4문장): 아래 참고 서사의 톤을 참고하되 절대 베끼지 마라
3. **한 줄 평가** (1문장): 능력치 강점+약점 조합

## 참고 서사 (톤 참고용, 베끼지 마라)
{NARRATIVE_EXAMPLES[type]}

## 규칙
- 반말 금지. 존댓말도 금지. "~다" 체 사용 (서술체)
- 사주 용어(도화살, 홍염살, 편관 등) 최소 1회 포함
- 조선시대 기방 세계관 유지
- 현대어/이모지/마크다운 사용 금지
- 서사는 반드시 유저를 "너"로 지칭
- 마지막 문장은 사주 근거로 마무리 ("사주에 ~이 있다", "~살이 앉았다" 등)
```

#### 결산 서사 (2차 호출)

```
당신은 조선시대 기방 역사서 저자입니다.

## 시뮬레이션 결과
- 기생 이름: {gisaengName}
- 기생 유형: {typeName}
- 최종 티어: {tier}
- 생존 선비: {aliveSeonbiCount}명
- 선비별 상태: {seonbiStates}
- 월 급여: {salary}냥 (현대 {modernValue}원)

## 생성할 것
1. **선비별 코멘트** (각 1문장): 최종 충성도·의심도 기반. 생존 선비는 숭배/집착 톤, 이탈 선비는 미련/원망 톤
2. **최종 한 줄 서사** (1문장): 티어에 맞는 역사서 톤

## 티어별 톤 가이드
- S: 전설 → "조선이 기억할 이름이다" 급
- A: 위태로운 성공 → "줄타기했지만 살아남았다"
- B: 평범한 성공 → "기방에서 중간은 가는 기생"
- C: 아쉬운 실패 → "순정인지 무능인지는 역사가 판단할 것"
- D: 완전 실패 → 자조적 유머 ("기방 주인이 짐을 싸놨다")

## 규칙
- "~다" 체 사용 (서술체)
- 선비 이름(김도윤/박서진/이준혁)을 직접 사용
- 마크다운/이모지 금지
- D티어 코멘트는 웃겨야 함 (자조적 유머 = 공유 동기)
```

#### 폴백 텍스트

Gemini 실패 시 하드코딩된 `FALLBACK_NARRATIVES`와 `FALLBACK_COMMENTS` 사용:

```typescript
const FALLBACK_NARRATIVES: Record<GisaengType, string> = {
  haeeohwa: "네가 기방에 들어서면 선비들이 조용해진다...",
  hongryeon: "네가 술잔을 들면 방 안의 공기가 바뀐다...",
  // ... PRD 1-5의 서사 그대로
};

const FALLBACK_TIER_NARRATIVES: Record<Tier, string> = {
  S: "세 남자를 동시에 돌리면서 한 명도 잃지 않은 전설. 조선이 기억할 이름이다.",
  A: "위태롭게 줄타기했지만 결국 살아남았다. 한양 기방가에 네 이름이 오르내린다.",
  // ... PRD 4-4 그대로
};
```

---

### T-4. DB 스키마

```sql
-- 기생 시뮬레이션 결과 테이블
CREATE TABLE gisaeng_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 입력 데이터
  birthday TEXT NOT NULL,              -- YYYYMMDDHHMM
  birth_time TEXT,                     -- HHMM or NULL (모름)
  gender TEXT NOT NULL,                -- 'male' | 'female'
  calendar_type TEXT DEFAULT 'solar',  -- 'solar' | 'lunar'

  -- 기생 카드 (1차 Edge Function 결과)
  gisaeng_name TEXT NOT NULL,          -- "월향 (月香)"
  gisaeng_type TEXT NOT NULL,          -- 'haeeohwa' | 'hongryeon' | ...
  tier_initial TEXT,                   -- 기생 카드 시점 예상 티어 "A (잠재 S)"
  stats JSONB NOT NULL,                -- { speech, allure, intellect, pushpull, intuition }
  total_charm INT NOT NULL,            -- 총 바람끼력 (0~500)
  do_hwa_sal BOOLEAN DEFAULT FALSE,
  hong_yeom_sal BOOLEAN DEFAULT FALSE,
  gisaeng_card_result JSONB NOT NULL,  -- 전체 기생 카드 데이터 (narrative, assessment 포함)

  -- 시뮬레이션 결과 (2차 Edge Function에서 업데이트)
  simulation_result JSONB,             -- { rounds, finalSeonbi, tier, salary, modernValue, ... }
  final_tier TEXT,                     -- 'S' | 'A' | 'B' | 'C' | 'D'
  monthly_salary INT,                  -- 냥
  modern_value INT,                    -- 원
  final_narrative TEXT,                -- Gemini 최종 한 줄 서사
  seonbi_comments JSONB,              -- { kwonryeok, romantic, jealousy }

  -- 사주 원본 (디버깅/분석용)
  saju_highlights JSONB,               -- { doHwaSal, hongYeomSal, topSipsung, ilju, iljuElement }

  -- 메타
  status TEXT DEFAULT 'card_generated', -- 'card_generated' | 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- 추적
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  CONSTRAINT check_gisaeng_type CHECK (
    gisaeng_type IN ('haeeohwa', 'hongryeon', 'mukran', 'chunhyang', 'wolha', 'hwangjini')
  ),
  CONSTRAINT check_final_tier CHECK (
    final_tier IS NULL OR final_tier IN ('S', 'A', 'B', 'C', 'D')
  ),
  CONSTRAINT check_status CHECK (
    status IN ('card_generated', 'completed')
  )
);

CREATE INDEX idx_gisaeng_results_created_at ON gisaeng_results(created_at DESC);
CREATE INDEX idx_gisaeng_results_type ON gisaeng_results(gisaeng_type);
CREATE INDEX idx_gisaeng_results_tier ON gisaeng_results(final_tier);

-- RLS: 공유 링크용 읽기 허용
ALTER TABLE gisaeng_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gisaeng results"
  ON gisaeng_results FOR SELECT TO anon USING (true);
```

---

### T-5. URL 라우팅 & 동적 OG

#### 라우팅 구조

```
src/app/
├── gisaeng/
│   ├── page.tsx              # 메인 (정적 OG + GisaengClient 렌더)
│   └── [resultId]/
│       └── page.tsx          # 공유 페이지 (동적 OG + GisaengClient 렌더)
```

#### 정적 OG (`/gisaeng/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: '기생 시뮬레이션 — 조선시대 기생이었다면?',
  description: '사주로 기생 능력치 카드를 뽑고, 선비 3명을 동시에 관리해보세요',
  openGraph: {
    title: '기생 시뮬레이션 — 넌 밤새 얼마를 벌었을까? 🏮',
    description: '사주 기반 기생 능력치 + 선비 3명 관리 시뮬레이션',
    // OG 이미지: 기생 시뮬 대표 이미지 (별도 제작)
  },
};
```

#### 동적 OG (`/gisaeng/[resultId]/page.tsx`)

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const supabase = createClient(/* ... */);
    const { data } = await supabase
      .from('gisaeng_results')
      .select('gisaeng_name, gisaeng_type, final_tier, monthly_salary, modern_value, status')
      .eq('id', resultId)
      .single();

    if (data?.status === 'completed') {
      // 시뮬 완료: 결산 카드 기반 OG
      const tierLabel = TIER_LABELS[data.final_tier]; // "전설의 명기", "기방에서 쫓겨남" 등
      const salary = data.monthly_salary?.toLocaleString();
      const modern = data.modern_value ? `약 ${(data.modern_value / 10000).toLocaleString()}만원` : '';

      return {
        title: `기생 시뮬 — ${data.final_tier}티어 ${tierLabel} 🏮`,
        description: `${data.gisaeng_name} | 월 ${salary}냥 (${modern}) | 넌 몇 냥이야?`,
        openGraph: {
          title: `기생 시뮬 — ${data.final_tier}티어 월 ${salary}냥 🏮`,
          description: `${data.gisaeng_name} ${tierLabel} | 넌 몇 냥이야? ㅋㅋ`,
        },
      };
    } else if (data) {
      // 기생 카드만 생성 (시뮬 미완료): 카드 기반 OG
      const typeName = GISAENG_TYPE_NAMES[data.gisaeng_type];
      return {
        title: `기생 시뮬 — 나의 기생 유형: ${typeName} 🏮`,
        description: `${data.gisaeng_name} | 선비 3명이 기다리고 있다`,
      };
    }
  } catch { /* 폴백 */ }

  return {
    title: '기생 시뮬레이션 — 사주GPT',
    description: '조선시대 기생이었다면, 넌 밤새 얼마를 벌었을까?',
  };
}
```

**OG 공유 시 바이럴 포인트**:
- 카카오톡 프리뷰: "기생 시뮬 — S티어 월 1,095냥 🏮" + "월향 (月香) 전설의 명기 | 넌 몇 냥이야? ㅋㅋ"
- 숫자(냥 + 만원)가 프리뷰에 노출 → 비교 욕구 자극 → 링크 클릭

---

### T-6. 상태 머신 (State Machine)

```typescript
type GisaengStep =
  | 'landing'        // 랜딩 (헤드카피 + 시작 버튼)
  | 'input'          // 입력 (성별, 생년월일, 시간, 양음력)
  | 'analyzing'      // 기생 카드 생성 중 ("기방 문 여는 중...")
  | 'gisaeng-card'   // 기생 능력치 카드 표시 (1차 캡처 포인트)
  | 'round1'         // 라운드 1: "오늘 밤, 셋 다 왔다"
  | 'round2'         // 라운드 2: "의심의 밤"
  | 'round3'         // 라운드 3: "최후의 밤"
  | 'calculating'    // 결산 계산 + DB 저장 중 ("성적표 작성 중...")
  | 'result';        // 최종 결산 카드 (2차 캡처 포인트)
```

#### 전이 다이어그램

```
landing
  ↓ [시작 클릭]
  ↓ [캐시/UTM 있으면 스킵 가능]
input
  ↓ [유효성 통과 & 제출]
analyzing ← Edge Function: analyze-gisaeng 호출
  ↓       (최소 3초 딜레이 — "기방 문 여는 중..." 연출)
gisaeng-card ← 1차 캡처 포인트 (공유 버튼 노출)
  ↓ [선비 만나기 클릭]
round1 ← 선택지 A/B/C → 판정 → 게이지 변동 → 결과 텍스트
  ↓ [다음 라운드]
round2 ← 👁 최고 선비 기준 동적 분기 → 선택지 → 판정
  ↓ [다음 라운드]
round3 ← 최후의 밤 → 선택지 → 판정
  ↓ [자동 전환]
calculating ← Edge Function: save-gisaeng-result 호출
  ↓          (최소 2초 딜레이 — "성적표 작성 중..." 연출)
result ← 2차 캡처 포인트 (공유 + CTA)
  ↓ [다시 도전] → landing으로 리셋
  ↓ [이 선비와 대화하기] → 외부 챗봇 URL
```

#### 이탈/뒤로가기 처리

| 상황 | 처리 |
|------|------|
| analyzing 중 뒤로가기 | input으로 복귀 (입력값 캐시 유지) |
| round1~3 중 뒤로가기 | **막지 않음** — 뒤로가면 이전 라운드로 (선택 초기화) |
| round1~3 중 브라우저 이탈 | 시뮬 데이터 소실 (기생 카드는 DB에 저장되어 있으므로 resultId로 재시작 가능하나 MVP에서는 미구현) |
| result에서 뒤로가기 | result 유지 (히스토리 푸시 안 함) |

#### 세션 캐싱

```typescript
const CACHE_KEY = 'gisaeng_input';
// 색기배틀과 동일 패턴: sessionStorage에 입력값 저장
// 캐시 존재 시 landing 스킵 → input 직행
```

---

### T-7. 캐릭터 에셋

#### 필요 이미지 목록

| 카테고리 | 파일명 | 사양 | 용도 |
|----------|--------|------|------|
| 기생 유형 | `haeeohwa.webp` | 400×400, 투명 배경 | 기생 카드 일러스트 |
| 기생 유형 | `hongryeon.webp` | 〃 | 〃 |
| 기생 유형 | `mukran.webp` | 〃 | 〃 |
| 기생 유형 | `chunhyang.webp` | 〃 | 〃 |
| 기생 유형 | `wolha.webp` | 〃 | 〃 |
| 기생 유형 | `hwangjini.webp` | 〃 | 〃 (히든 유형) |
| 선비 | `kim-doyun.webp` | 120×120, 원형 크롭 가능 | 라운드 아바타 |
| 선비 | `park-seojin.webp` | 〃 | 〃 |
| 선비 | `lee-junhyuk.webp` | 〃 | 〃 |

**총 9장** — `public/characters/gisaeng/` 디렉토리

#### 에셋 없을 때 (MVP 초기)

이미지 미완성 시 **이모지 + 그라디언트 원형**으로 대체:

```
기생 유형: 배경 그라디언트 원 + 유형 한자 (解語花, 紅蓮 등)
선비: 배경색 원 + 이모지 (🫅 👨‍🎨 ⚔️)
```

→ 에셋 완성 시 이미지로 교체 (컴포넌트 prop으로 분리)

---

### T-8. 타입 정의

```typescript
// src/types/gisaeng.ts

export type GisaengType = 'haeeohwa' | 'hongryeon' | 'mukran' | 'chunhyang' | 'wolha' | 'hwangjini';
export type GisaengTier = 'S' | 'A' | 'B' | 'C' | 'D';
export type SeonbiType = 'kwonryeok' | 'romantic' | 'jealousy';
export type GisaengStep = 'landing' | 'input' | 'analyzing' | 'gisaeng-card' | 'round1' | 'round2' | 'round3' | 'calculating' | 'result';

export interface GisaengStats {
  speech: number;      // 화술 0~100
  allure: number;      // 요염 0~100
  intellect: number;   // 지성 0~100
  pushpull: number;    // 밀당 0~100
  intuition: number;   // 눈치 0~100
}

export interface GisaengCard {
  gisaengName: string;
  type: GisaengType;
  typeName: string;
  typeSubtitle: string;
  tier: string;
  stats: GisaengStats;
  totalCharm: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  narrative: string;
  assessment: string;
}

export interface SeonbiState {
  name: string;
  type: SeonbiType;
  loyalty: number;     // ♥ 충성도 0~100
  suspicion: number;   // 👁 의심도 0~100
  alive: boolean;      // 이탈 여부
}

export interface RoundChoice {
  id: 'A' | 'B' | 'C';
  label: string;
  requiredStat: keyof GisaengStats;
  threshold: number;
  successEffect: GaugeEffect;
  failEffect: GaugeEffect;
}

export interface GaugeEffect {
  target: SeonbiType | 'all';
  loyaltyDelta: number;
  suspicionDelta: number;
}

export interface RoundResult {
  round: 1 | 2 | 3;
  choiceId: 'A' | 'B' | 'C';
  success: boolean;
  seonbiAfter: Record<SeonbiType, { loyalty: number; suspicion: number; alive: boolean }>;
}

export interface SimulationResult {
  rounds: RoundResult[];
  finalSeonbi: Record<SeonbiType, SeonbiState>;
  tier: GisaengTier;
  tierLabel: string;
  monthlySalary: number;
  modernValue: number;
  totalCharmAfter: number;
  finalNarrative: string;
  seonbiComments: Record<SeonbiType, string>;
}

export interface GisaengResult {
  resultId: string;
  gisaengCard: GisaengCard;
  seonbi: Record<SeonbiType, SeonbiState>;
  sajuHighlights: {
    doHwaSal: boolean;
    hongYeomSal: boolean;
    topSipsung: string;
    ilju: string;
    iljuElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  };
  simulation?: SimulationResult;  // 시뮬 완료 후 추가
}
```

---

### T-9. 컴포넌트 구조

```
src/components/gisaeng/
├── GisaengClient.tsx          # 메인 상태머신 (색기배틀의 SexyBattleClient 대응)
├── GisaengLanding.tsx         # 랜딩 화면 ("조선시대 기생이었다면...")
├── GisaengAnalyzing.tsx       # 분석 중 ("기방 문 여는 중...")
├── GisaengCard.tsx            # 기생 능력치 카드 (1차 캡처 포인트)
├── StatBar.tsx                # 능력치 바 (████░░ 78)
├── RoundScreen.tsx            # 라운드 공통 프레임 (상황 + 선택지 3개 + 게이지)
├── SeonbiGauge.tsx            # 선비별 ♥·👁 게이지 표시
├── SeonbiAvatar.tsx           # 선비 아바타 + 이름 + 유형 태그
├── ChoiceButton.tsx           # 선택지 버튼 (선택 후 성공/실패 애니메이션)
├── RoundResultPopup.tsx       # 선택 결과 팝업 (성공/실패 + 게이지 변동 표시)
├── GisaengCalculating.tsx     # 결산 중 ("성적표 작성 중...")
├── GisaengResultCard.tsx      # 최종 결산 카드 (2차 캡처 포인트, toPng 대상)
├── GisaengCTA.tsx             # 유료 전환 CTA ("이 선비와 대화하기")
└── GisaengShareButtons.tsx    # 공유 버튼 (색기배틀 ShareButtons 패턴 동일)
```

#### 기존 컴포넌트 재사용

| 기존 | 재사용 방식 |
|------|------------|
| `BirthInput.tsx` | 그대로 import (YYYY-MM-DD 자동포맷) |
| `GenderSelect.tsx` | 그대로 import |
| `BirthTimeInput.tsx` | 그대로 import |
| `ShareButtons.tsx` | 로직 재사용, 카피만 변경 ("친구도 기생 시켜보기") |

→ 입력 폼 컴포넌트 3개는 **공용화** (새로 만들지 않음)

---

### T-10. 라운드 2 동적 분기 상세

PRD Step 3에서 "👁가 가장 높은 선비가 의심 이벤트 발동"이라고 명시되어 있으나, 구현 시 엣지 케이스 정리:

```typescript
function getRound2Scenario(seonbi: Record<SeonbiType, SeonbiState>): SeonbiType {
  // 살아있는 선비 중 👁 최고값 선택
  const alive = Object.entries(seonbi)
    .filter(([_, s]) => s.alive)
    .sort(([_, a], [__, b]) => b.suspicion - a.suspicion);

  if (alive.length === 0) {
    // 라운드 1에서 전원 이탈 → 라운드 2 스킵 → 바로 결산
    return 'skip';
  }

  const [topType] = alive[0];

  // 동률 시 우선순위: 질투형 > 권력형 > 로맨틱형
  // (질투형이 가장 극적인 시나리오 제공)
  if (alive.length >= 2) {
    const [first, second] = alive;
    if (first[1].suspicion === second[1].suspicion) {
      const priority: SeonbiType[] = ['jealousy', 'kwonryeok', 'romantic'];
      return priority.find(t => alive.some(([type]) => type === t)) ?? topType;
    }
  }

  return topType as SeonbiType;
}
```

#### 라운드 중간 이탈 처리

| 이벤트 | 조건 | 처리 |
|--------|------|------|
| 선비 이탈 | ♥ ≤ 50 | 해당 선비 `alive = false`, 퇴장 연출 텍스트 |
| 의심 폭발 | 👁 ≥ 80 | 강제 의심 이벤트 (해당 선비가 직접 확인하러 옴) |
| 난장 이벤트 | 이준혁 👁 ≥ 70 & 다른 선비 마주침 | 2명 동시 이탈 가능 |
| 전원 이탈 | 3명 모두 alive=false | 남은 라운드 스킵 → 바로 결산 (D티어) |

---

### T-11. 분석 화면 메시지 시퀀스

```typescript
const ANALYZING_MESSAGES = [
  { text: '사주 원국 펼치는 중...', delay: 0 },
  { text: '도화살 검사 중... 🔥', delay: 800 },
  { text: '기생 등급 산정 중...', delay: 1600 },
  { text: '선비 3명 배정 중...', delay: 2400 },
];

const CALCULATING_MESSAGES = [
  { text: '선비별 충성도 집계 중...', delay: 0 },
  { text: '월 급여 결산 중... 💰', delay: 800 },
  { text: '현대 환산가 계산 중...', delay: 1600 },
];
```

---

### T-12. 에러 처리

| 실패 지점 | 처리 |
|-----------|------|
| Stargio API 3회 실패 | "사주 데이터를 불러올 수 없어요. 잠시 후 다시 시도해주세요." → input 복귀 |
| Gemini 실패 | 폴백 텍스트 사용 (FALLBACK_NARRATIVES) → 정상 진행 |
| DB insert 실패 | 결과는 클라이언트에 있으므로 표시는 정상 → 공유 링크만 비활성 ("공유 링크를 생성할 수 없어요") |
| save-gisaeng-result 실패 | 클라이언트에서 계산한 결산 데이터로 카드 표시 → 폴백 서사 사용 → 공유 링크 비활성 |
| 네트워크 단절 (라운드 중) | 라운드는 로컬이므로 영향 없음. 결산 저장 시점에만 재시도 |

---

### T-13. 배포 명령어

```bash
# Edge Function 배포
npx supabase functions deploy analyze-gisaeng --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx
npx supabase functions deploy save-gisaeng-result --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx

# Secrets (기존과 동일 — 이미 설정됨)
# SAJU_API_KEY, GOOGLE_API_KEY

# DB 마이그레이션
npx supabase db push --project-ref tdrmvbsmxcewwaeuoqdx

# 프론트 빌드 & 배포
npx next build  # Vercel 자동 배포 (main 브랜치 push 시)
```

---

**최종 업데이트**: 2026-03-30
