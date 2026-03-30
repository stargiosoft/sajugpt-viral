# 바이럴 기능 요구사항 정의서 (PRD)

## 프로젝트 개요

- **기능명**: 사주 법정 — "당신이 연애 못한 이유, 사주로 기소합니다"
- **바이럴 공식**: [역전재판/미연시 A] + [사주 기반 연애 판결 B] = "이런 건 처음이다"
- **바이럴 기능 간단 요약**: 사용자의 사주를 입력하면 검사(윤태산)가 연애 못한 이유를 팩폭으로 기소하고, 변호사(서휘윤)가 사주 근거로 반박·위로한다. 중간에 미연시처럼 유저가 선택지로 항변하며 **짝사랑/솔로 기간을 직접 입력**한다. 형량은 **사주 매력(도화살 등) × 낭비한 기간**으로 산정 — 매력이 높은데 오래 썩혔을수록 형량이 높아지므로, **징역이 높을수록 = 매력이 높다는 역설**이 성립한다. 최종 판결은 사주 원국 기반으로 **형량 + 석방 예정 시점**을 선고한다. 결과물은 **기소장 카드 1장** — 죄목 + 형량 + 검사 팩폭 + 석방일이 담겨 즉시 캡처·공유 가능. "나 짝사랑만3년죄로 징역 9년ㅋㅋ 도화살 2개인데 3년 썩혀서 가중처벌ㅋㅋ 너는?"이 대화를 만들고, 공범 지목이 강제 유입을 만든다.

---

## 바이럴 루프

### 바이럴을 일으키는 구조

1. **입력**: 생년월일시 입력(3초, 가입 불필요) → "긴급 체포 영장 발부 중..." 로딩 연출
2. **기소장 카드**: 죄목 + 형량 + 사유 + 팩폭이 담긴 카드 1장 즉시 생성 → **바이럴 지점 1**
3. **인터랙티브 재판**: "재판 참여하기" → 검사·변호사 공방 중 미연시형 선택지로 항변 (3~4턴)
4. **사주 판결문**: 사주 원국 기반 최종 판결 → 구체적 시점 선고 → **바이럴 지점 2**
5. **공범 지목**: "당신의 죄에는 공범이 있습니다" → 친구에게 기소장 전송 → **강제 유입**
6. **전환**: "항소하기" → 검사/변호사 캐릭터 챗봇 1:1 유료 상담

### 유발 감정

| 감정 | 메커니즘 |
|------|---------|
| **뜨끔 + 웃김 (Hook)** | 죄목이 내 행동을 정확히 찔러서 "ㅋㅋㅋ씨 이거 나인데" → 캡처 |
| **찔림 + 공감 (Pain)** | 검사 팩폭이 평소 외면하던 진짜 문제를 직면시킴 |
| **위로 + 자존감 (Relief)** | 변호사가 "니 잘못이 아니라 운세 구조의 문제"로 뒤집어줌 |
| **기대감 + 행동 동기 (Hope)** | "2026년 8월에 풀린다" 구체적 시점 + "그때까지 이렇게 준비하세요" 개운 지침 → 챗봇 전환 동기 |
| **비교 (Envy)** | 현상금 액수 + 죄목 비교 → "너는 뭐 나왔어? 현상금 얼마야?" |

### 논란 설계

- **검사 팩폭이 논란의 핵심 엔진**: "당신보다 못생긴 사람도 지금 연애하고 있습니다" → "팩트" vs "이건 좀 심한데" 갈림
- **죄목 자체가 밈**: "짝사랑만3년죄" "혼자이별한죄" → 이름만으로 공유·비교 발생
- **변호사가 안전장치**: 팩폭으로 찌르되 반드시 뒤집어줌 → 상처로 끝나지 않음
- **스윗 스팟**: 아프지만 웃기고, 웃기지만 울컥하는 톤. 찌르는 건 검사(반말), 위로는 변호사(존댓말)

---

## 사용자 스토리

**As** (누가): 사회적 스펙은 있지만 외모 컴플렉스로 연애 시장에서 저평가받아 온 2030 여성 유저는

**Want to** (무엇을 원한다): 내가 연애를 못한 진짜 이유를 재밌는 법정 포맷으로 들어보고, 사주로 "언제 풀리는지" 구체적 시점을 받아서, 기소장 카드를 친구들과 공유하며 "너는 뭐 나왔어?" 대화를 하기를 원한다.

**So that** (어떤 목적/가치를 위해): 검사 팩폭에 뜨끔하면서도 변호사 변론에 위로받고, "내 잘못이 아니라 운세 구조의 문제였다"는 면죄부로 자존감을 회복하며, "그럼 언제 풀리고 어떻게 준비하지?"라는 행동 동기로 캐릭터 챗봇 상담(개운/행동 지침)을 이어가기 위해.

---

## MVP 필요 기능

### Step 1. 초저마찰 랜딩 및 정보 입력

- 메인 화면: "당신이 연애 못한 이유, 사주로 기소합니다" 문구 + 도전 버튼
- 입력 항목 4가지 (**3초 컷** 설계):
  1. **성별**: 필수
  2. **생년월일**: 필수. 숫자 키패드 노출
  3. **태어난 시간**: 선택. "모름" 기본 선택
  4. **양력/음력**: 양력 기본 선택

#### UTM 파라미터 자동입력 (사주GPT 제휴 유입)

사주GPT 광고 배너 클릭 시 아래 형식으로 유저 정보가 URL에 포함되어 유입된다:

```
/court?utm_source=sajugpt&utm_medium=affiliate&utm_campaign=sdowha&birthday=199112252315&gender=male
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

- 입력 직후 **"긴급 체포 영장 발부 중..."** 로딩 연출:
  - "사건 접수 중..."
  - "검사 윤태산 출석..."
  - "변호사 서휘윤 출석..."
  - "피고인의 사주 원국 분석 중... ⚖️"
  - → 긴장감 + 기대감 빌드업 (2~3초)

### Step 2. 기소장 카드 생성 (바이럴 핵심 — 1장 캡처 공유)

사주 분석 결과를 기반으로 기소장 카드 1장이 즉시 생성된다. **이 카드가 바이럴의 최소 단위.**

#### 2-1. 죄목 배정 — 사주 요소와 연결

사주 원국에서 핵심 특성을 추출하여 10가지 죄목 중 1개를 자동 배정:

| 죄목 | 사주 트리거 | 타겟 공감 포인트 |
|------|-----------|----------------|
| **짝사랑만 3년 죄** | 편인 과다 + 정관 약 | 기간이 구체적이라 자기 기간 대입 |
| **좋아한다는 말 못 한 죄** | 편인 월주 + 비견 강 | 가장 보편적인 후회, 그 사람 얼굴 떠오름 |
| **혼자 이별한 죄** | 상관 과다 + 정관 충 | 시작도 전에 혼자 시뮬 돌리고 포기 |
| **"나 같은 게 뭐" 죄** | 편인 + 상관 동주 | 자격지심 한 줄 요약 |
| **읽씹당하고 괜찮은 척한 죄** | 비견 강 + 정재 약 | 자존심 + 상처의 교차점 |
| **맨날 친구로만 남은 죄** | 식신 과다 + 편관 약 | 만년 프렌드존 |
| **거울 보고 한숨 쉰 죄** | 상관 과다 + 도화살 합/충 | 외모 컴플렉스 직격 (→ 변호사가 뒤집음) |
| **"쟤는 원래 이쁘니까" 죄** | 겁재 강 + 편인 | 비교 심리 |
| **취중고백 후 기억 삭제한 죄** | 식신 + 도화살 + 편재 | 술 먹고 용기 → 다음날 후회 |
| **연락 올까봐 폰만 본 죄** | 정인 과다 + 편관 암장 | 알림음에 심장 반응 |

#### 2-2. 기소장 카드 레이아웃

```
┌──────────────────────────────┐
│                              │
│     ⚖️ 사주 법정 기소장       │
│     제2026-0326호            │
│                              │
│    ┌──────────────────┐      │
│    │                  │      │
│    │  (죄목별 고유     │      │
│    │   실루엣 일러스트) │      │
│    │                  │      │
│    └──────────────────┘      │
│                              │
│  █ 짝사랑만 3년 죄 █         │
│                              │
│  ⚖️ 형량: 징역 9년           │
│     전체 피고인 상위 7%       │
│  💰 현상금: 5,000만원         │
│  📋 사유: 도화살 2개 보유     │
│      + 3년간 매력 방치       │
│                              │
│  ───────────────────────     │
│  🔴 검사 윤태산:              │
│  "3년이면 사랑이 아니라       │
│   습관입니다."               │
│                              │
│  🔵 변호사 서휘윤:            │
│  "3년을 버틴 건 습관이        │
│   아니라 진심입니다."         │
│  ───────────────────────     │
│                              │
│  석방 예정일: ████년 █월      │
│  (재판 참여 시 공개)          │
│                              │
│  nadaunse.com/court          │
└──────────────────────────────┘
```

**카드 구성 요소**:

| 요소 | 역할 | 공유 기여 |
|------|------|----------|
| **죄목** | 유형 식별 — "나는 이거" | "너는 뭐 나왔어?" 비교 대화 |
| **형량 + 퍼센타일** | 숫자 2개 — 형량으로 매력 역설, 퍼센타일로 상대 위치 | "나 상위 7%에 징역 9년이래ㅋㅋ" |
| **현상금** | 형량을 돈으로 환산 — 직관적 비교 | "현상금 5천만원ㅋㅋ 너는 얼마야?" |
| **사유** | 사주 근거 — 왜 형량이 높은지 | "도화살 2개인데 3년 썩혀서ㅋㅋ" |
| **검사 vs 변호사** | 팩폭+위로 세트 → 카드 안에서 미니 논쟁 | "검사 말이 맞아" vs "변호사 말이 맞아" 편 가르기 |
| **석방 예정일 블러** | "언제 풀려?" 궁금증 시각화 | 재판 참여 유도 + 판결문까지 끌고 감 |

> **석방 예정일은 블러 처리로 기소장에 표시** — "있다는 건 아는데 안 보인다"가 재판 참여 동기. 재판 끝난 뒤 판결문 카드에서 공개.

**기소장 단계 공유 버튼**: 기소장 카드 하단에 "재판 참여하기" 버튼과 동급으로 **"내 기소장 보내기"** 버튼 병렬 배치. 재판을 안 하고 떠나는 유저도 최소한 기소장은 공유하게 만든다.

```
┌──────────────────────────────┐
│                              │
│  [⚖️ 재판 참여하기]          │
│  → 석방 예정일을 확인하세요   │
│                              │
│  [📱 내 기소장 보내기]        │
│  → 카카오톡 / 이미지 저장     │
│                              │
└──────────────────────────────┘
```

#### 2-3. 형량 산정 로직

**형량 = 매력(사주) × 낭비한 기간(유저 입력)**

매력이 높은데 오래 썩혔을수록 형량이 높아짐. **징역이 높을수록 = 매력이 높다는 역설**이 핵심. 징역 12년 받고도 기분 나쁘지 않음 — "도화살 2개라서 가중처벌"이니까.

```
형량 = 기본형(1년) + 매력 가중 + 기간 가중

매력 가중 (사주에서 산출):
  도화살 1개         +1년
  도화살 2개         +3년
  정관/정인 동주     +2년  (진심 낭비)
  식신 보유          +1년  (감성 낭비)
  편관격             +1년  (카리스마 낭비)

기간 가중 (유저가 재판 중 입력):
  6개월 미만         +0년
  6개월~1년          +1년
  1~3년              +2년
  3~5년              +4년
  5년 이상           +7년  (가중처벌)
```

| 형량 | 등급 | 판사 코멘트 | 카드 표시 |
|------|------|-----------|----------|
| **1~3년** | 경범죄 | "초범이니 봐드립니다" | 기본 테두리 |
| **4~7년** | 중범죄 | "반성의 기미가 보이지 않습니다" | 은색 테두리 |
| **8~12년** | 강력범 | "사주가 이렇게 아까운데 이게 말이 됩니까" | 금색 테두리 |
| **13년+** | 극형 | "도화살 2개에 5년 썩힘. 사주 모독죄 추가 기소" | 금색 + "극형" 뱃지 |

> 형량이 높을수록 화려한 카드 → 공유 욕구 상승. "극형 받았다"가 자랑이 되는 역설 구조.

#### 2-4. 현상금 + 퍼센타일 산정

**현상금 = 형량을 돈으로 환산한 직관적 비교 수단**. "징역 9년"보다 "현상금 5천만원"이 대화에서 더 빠르게 작동한다.

```
현상금 = 형량 × 500만원 (단순 환산)

| 형량    | 현상금        | 퍼센타일    |
|---------|-------------|-----------|
| 1~3년   | 500~1,500만  | 하위 40%   |
| 4~7년   | 2,000~3,500만 | 상위 30%  |
| 8~12년  | 4,000~6,000만 | 상위 10%  |
| 13년+   | 6,500만+     | 상위 3%   |
```

**퍼센타일 분포 설계**: 대부분의 유저가 **상위 30% 이내**에 분포하게 설계 — 낮은 숫자가 나오면 공유 자체를 안 하므로 분포를 관대하게. 도화살·홍염살 보유자는 자동으로 상위 10% 이내.

#### 2-4. 기간 입력 — 재판 중 자연스럽게 수집

별도 입력폼 없이, **재판 인터랙션(Step 3) 중에 검사 질문으로 수집**:

```
검사 윤태산:
"피고인, 좋아하는 사람 있죠?"

  ① "...없는데요"
  ② "네"

→ 어떤 선택이든:

"얼마나 됐습니까?"
(좋아한 기간 / 솔로인 기간)

  ① 6개월 미만
  ② 6개월 ~ 1년
  ③ 1년 ~ 3년
  ④ 3년 이상 ← 선택 시 검사 반응 격앙

→ ④번 선택 시:
"...3년이요?
 피고인의 사주에 도화살이
 2개 있는 거 알고 계십니까?
 그 매력을 3년간 썩힌 겁니다.
 가중처벌 대상입니다."
```

기간 입력이 "검사에게 심문당하는 경험"으로 전환되어 몰입감 유지.

#### 2-5. 석방 예정일 산정 로직

사주 대운·세운에서 **현재 억압하고 있는 요소가 풀리는 시점**을 계산:

```
주요 판단 기준:
  편인이 합거되는 시점     → "자격지심이 풀리는 때"
  도화살 충이 해소되는 시점 → "매력이 발현되는 때"
  정관이 투출되는 시점     → "인연이 나타나는 때"

표시: "2026년 8월" (월 단위까지만)
```

#### 2-5. 죄목별 검사 팩폭 + 변호사 반박

카드에 박히는 핵심 문장 세트. **검사 팩폭이 찌르고 변호사 반박이 뒤집는 2줄이 캡처·공유의 트리거.** 팩폭만 퍼지면 서비스 이미지 리스크 → 반드시 세트로 노출.

| 죄목 | 🔴 검사 팩폭 | 🔵 변호사 반박 | 논란 포인트 |
|------|------------|-------------|-----------|
| 짝사랑만 3년 죄 | "3년이면 사랑이 아니라 습관입니다" | "3년을 버틴 건 습관이 아니라 진심입니다" | "맞아..." vs "아닌데 진심인데" |
| 좋아한다는 말 못 한 죄 | "고백 안 한 건 배려가 아니라 도망입니다" | "도망이 아닙니다. 그 사람의 일상을 지키고 싶었던 겁니다" | 자기합리화 vs 진짜 배려 논쟁 |
| 혼자 이별한 죄 | "시작도 전에 끝내놓고 상처받지 마세요" | "시작 전에 끝낸 건 상대를 아꼈기 때문입니다" | "팩트폭력" vs "공감" |
| "나 같은 게 뭐" 죄 | "못생겨서 못 만나는 거 아닙니다. 못생겼다고 믿어서 못 만나는 겁니다" | "그 믿음을 만든 건 피고인이 아닙니다. 세상이 심어놓은 겁니다" | **이게 제일 터짐** — 위로인지 비하인지 경계선 |
| 읽씹당하고 괜찮은 척한 죄 | "괜찮은 척이 제일 안 괜찮은 겁니다" | "괜찮은 척이라도 해야 버틸 수 있었던 겁니다" | 짧고 아파서 무조건 캡처 |
| 맨날 친구로만 남은 죄 | "좋은 사람 연기만 해서 친구가 된 겁니다" | "좋은 사람이 아니라 진짜 좋은 사람이었던 겁니다" | "심한데" vs "ㅋㅋ맞는데" |
| 거울 보고 한숨 쉰 죄 | "당신보다 못생긴 사람도 지금 연애하고 있습니다" | "거울이 보여주지 못하는 매력이 사주에는 있습니다" | 가장 강한 논란 — 위로 vs 비하 논쟁 |
| "쟤는 원래 이쁘니까" 죄 | "그 사람도 거울 앞에서 한숨 쉽니다" | "비교한 건 눈이지, 마음이 아닙니다" | 반전 → 공감 |
| 취중고백 후 기억 삭제한 죄 | "술이 한 말도 진심이었습니다" | "진심을 말하려면 술이 필요했던 거, 그게 용기입니다" | 아프면서 로맨틱 |
| 연락 올까봐 폰만 본 죄 | "그 사람도 지금 폰 보고 있을 수도 있습니다" | "기다린다는 건, 아직 포기 안 했다는 뜻입니다" | 희망 고문 |

### Step 3. 인터랙티브 재판 (미연시형)

기소장 카드 확인 후 **"재판 참여하기"** 버튼으로 진입. 검사·변호사 공방 중 유저가 선택지로 항변한다.

#### 3-1. 재판 구조 (3~4턴)

| 턴 | 진행 | 유저 참여 |
|----|------|----------|
| **1턴: 검사 기소** | 검사가 죄목의 구체적 행동을 지적 | 유저 항변 선택지 2~3개 |
| **2턴: 검사 반박** | 유저의 항변을 검사가 뚫음 | — |
| **3턴: 변호사 반격** | 변호사가 유저 편에서 사주 근거로 반박 + 유저에게 질문 | 유저 선택지 2~3개 |
| **4턴: 최후변론** | 유저 답변을 변호사가 가져와서 감동적으로 뒤집음. 검사 팩폭 최종 한마디 | — |

#### 3-2. 핵심 설계 원칙

| 원칙 | 이유 |
|------|------|
| **선택지는 2~3개, 최대 4턴** | 길면 이탈. 5분 내 끝나야 함 |
| **어떤 선택이든 결국 찔림** | "없는데요" 골라도 검사가 뚫음 — 도망 불가 |
| **유저의 선택이 판결문에 반영** | "나 같은 게" 선택하면 변호사가 그 단어를 다시 가져와서 뒤집음 |
| **검사는 반말, 변호사는 존댓말** | 검사 = 찌르는 역할이라 반말이 더 아픔. 변호사 = 위로라 존댓말이 더 따뜻함 |

#### 3-3. 재판 예시 — "짝사랑만 3년 죄"

**1턴: 검사 기소**
```
검사 윤태산:

"피고인, 질문하겠습니다.
 지금 좋아하는 사람,
 아니 좋아했던 사람.
 있죠?"

  ① "...없는데요"
  ② "그게 왜요"
  ③ "네"
```

①번 선택 시:
```
검사 윤태산:

"거짓말.
 피고인의 일지 桃花가
 년지와 暗合을 이루고 있어요.
 이 구조에서 3년간 아무도
 안 좋아했다?
 사주가 거짓말을 못 합니다.
 피고인은 할 수 있어도."
```

**3턴: 변호사 반격 + 유저 질문**
```
변호사 서휘윤:

"피고인, 제가 대신 여쭤볼게요.
 말 못 한 진짜 이유가 뭐예요?"

  ① "거절당하면 그 사람도 불편할까봐"
  ② "나 같은 게 고백하면 부담일까봐"
  ③ "말해서 달라질 게 없을 것 같아서"
```

②번 선택 시:
```
변호사 서휘윤:

"판사님, 들으셨습니까.
 '나 같은 게.'

 피고인은 자기 감정이
 상대에게 폐가 된다고
 믿고 있습니다.

 근데요, 피고인.
 당신의 사주를 보면
 日支 正官에 正印이 동주해요.

 이건 한번 마음을 주면
 전부를 주는 사람이라는 뜻입니다.

 그 진심을 받을 사람이
 '부담'을 느낄까요?

 '나 같은 게'라는 말,
 오늘 이 법정에서
 마지막으로 하시길 바랍니다."
```

**4턴: 검사 최후변론 — 팩폭**
```
검사 윤태산:

"마지막으로 하나만.
 피고인, 그 사람 연락처
 아직 있죠?

 3년간 말 한마디 못 하면서
 연락처는 못 지우는 거잖아요.

 그게 사랑입니까, 습관입니까."
```

### Step 4. 사주 판결문 카드 (바이럴 지점 2 — 1장 캡처용)

인터랙티브 재판이 끝나면 **사주 원국 기반 최종 판결문 카드 1장**이 생성된다. 기소장이 "죄목+형량"으로 바이럴을 일으키고, 판결문은 **"석방일+판사 명언"**으로 2차 바이럴을 만든다. 재판에서 감정이 열린 상태에서 나오는 카드이므로 **캡처 동기가 기소장보다 높다**.

> **핵심 차별점**: 기소장 = 웃기고 자극적 → 커뮤니티/트위터 바이럴. 판결문 = 아프고 울컥 → 인스타 스토리/카톡 바이럴. **두 카드가 서로 다른 감정, 다른 플랫폼을 노린다.**

#### 4-1. 판결문 카드 레이아웃

기존 판결문의 사주 원국 표시·죄의 원인 설명은 **서비스 내 재판 과정에서 보여주고**, 카드에는 **캡처했을 때 임팩트 있는 요소만** 남긴다.

```
┌──────────────────────────────┐
│                              │
│     ⚖️ 사주 판결문            │
│     제2026-0326호            │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │   짝사랑만 3년 죄       │  │
│  │                        │  │
│  │   ██ 유죄 ██            │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  형량: 징역 9년              │
│  현상금: 5,000만원            │
│  전체 피고인 상위 7%          │
│                              │
│  ═══════════════════════════ │
│                              │
│  가중사유:                    │
│  도화살 2개 보유              │
│  + 3년간 매력 방치            │
│                              │
│  "사주가 이렇게 아까운데      │
│   이게 말이 됩니까."         │
│                              │
│  ═══════════════════════════ │
│                              │
│  석방 예정일:                 │
│                              │
│  ██████████████████████████  │
│  ██  2 0 2 6 년  8 월  ██   │
│  ██████████████████████████  │
│                              │
│  석방 조건:                   │
│  "나 같은 게"라고 하지 말 것. │
│  이를 어길 시 추가 기소.      │
│                              │
│  nadaunse.com/court          │
└──────────────────────────────┘
```

#### 4-2. 판결문 카드 설계 원칙

| 원칙 | 이유 |
|------|------|
| **석방일이 카드의 시각적 중심** | 블러에서 풀린 석방일이 가장 큰 활자 + 강조 박스로 표시. "2026년 8월" 한 줄이 캡처의 핵심 — "나 8월에 석방이래" |
| **석방 조건 = 판사의 명언** | "나 같은 게라고 하지 말 것" — 아프면서 따뜻한 한 줄이 인스타 스토리 캡처 동기. 죄목별로 다른 조건이 나와서 비교·공유 발생 |
| **형량+현상금+퍼센타일 반복** | 기소장에도 있지만 판결문에도 반복 — 판결문만 캡처해도 숫자 비교가 가능해야 함 |
| **사주 원국·한자 해설은 카드에서 제외** | 재판 과정에서 이미 봤고, 카드에 넣으면 정보 과부하 → 캡처 동기 하락. 카드는 임팩트만 |
| **1:1 + 9:16 2벌** | 트위터/커뮤니티(1:1) + 인스타 스토리(9:16) |

#### 4-3. 판결문 카드 구성 요소 (7개)

| 요소 | 역할 | 공유 트리거 |
|------|------|-----------|
| **죄목 + 유죄** | 정체성 — "나는 이 죄목" | "너는 뭐 나왔어?" |
| **형량 + 현상금 + 퍼센타일** | 숫자 3개 — 비교의 3중 트리거 | "나 상위 7%에 현상금 5천만원ㅋㅋ" |
| **가중사유** | 왜 형량이 높은지 사주 근거 | "도화살 2개래ㅋㅋ" |
| **판사 코멘트** | 등급별 한마디 — 형량 높을수록 찬양적 | "사주가 아까운데 말이 됩니까" = 형량 자랑 |
| **석방 예정일** | **카드의 시각적 중심** — 가장 큰 활자 | "나 8월에 풀린대" "나는 내년 3월ㅠ" |
| **석방 조건** | 죄목별 맞춤 명언 — 아프고 따뜻한 한 줄 | 인스타 스토리 캡처 동기. "이거 울컥하는데" |
| **URL** | nadaunse.com/court | 트위터/커뮤니티에서 유입 |

#### 4-4. 죄목별 석방 조건 (판사 명언)

석방 조건이 **죄목별 맞춤 조언을 판결 톤으로 전달**하는 역할. 이 한 줄이 인스타 스토리 캡처의 핵심.

| 죄목 | 석방 조건 |
|------|----------|
| 짝사랑만 3년 죄 | "나 같은 게"라고 하지 말 것. 이를 어길 시 추가 기소 |
| 좋아한다는 말 못 한 죄 | 다음 기회에는 3초 안에 말할 것. 또 도망치면 가중처벌 |
| 혼자 이별한 죄 | 시작하기 전에 끝내지 말 것. 시작은 상대방도 할 권리가 있음 |
| "나 같은 게 뭐" 죄 | 거울 대신 사주를 볼 것. 거울은 겉만 보여주지만 사주는 전부를 봄 |
| 읽씹당하고 괜찮은 척한 죄 | 괜찮지 않으면 괜찮지 않다고 말할 것. 침묵은 동의가 아님 |
| 맨날 친구로만 남은 죄 | 좋은 사람 그만하고 좋아하는 사람이 될 것. 착함은 전략이 아님 |
| 거울 보고 한숨 쉰 죄 | 한숨 대신 사주를 볼 것. 당신의 매력은 거울 밖에 있음 |
| "쟤는 원래 이쁘니까" 죄 | 비교를 멈출 것. 당신의 사주에는 당신만의 매력이 있음 |
| 취중고백 후 기억 삭제한 죄 | 다음엔 맨정신에 말할 것. 술 없이도 용기는 나옴 |
| 연락 올까봐 폰만 본 죄 | 기다리지 말고 먼저 보낼 것. 상대방도 기다리고 있을 수 있음 |

#### 4-5. 재판 과정에서 보여주는 사주 해설 (카드에는 미포함)

재판 3~4턴 과정에서 변호사가 사주 원국을 근거로 변론할 때 아래 내용이 텍스트로 노출된다. **카드에는 넣지 않지만 재판 몰입감의 핵심.**

| 요소 | 역할 | 예시 |
|------|------|------|
| **죄의 원인 (사주 해석)** | 왜 이런 행동 패턴이 생겼는지 사주 용어로 설명 | "偏印이 桃花를 누르고 있다 — 매력은 있는데 본인이 꺼놓은 구조" |
| **석방 근거 (대운·세운)** | 풀리는 시점의 사주적 근거 | "丙午 운이 辛金을 丙辛合으로 묶어서 억압이 해제" |
| **유저 선택 반영** | 재판 중 유저가 고른 항변이 변호사 변론에 인용 | "'나 같은 게'라고 하셨죠. 그 말이 偏印의 목소리입니다" |

### Step 5. 공범 지목 (강제 바이럴)

판결문 직후 **"공범 지목"** 화면으로 전환. 유저가 1명을 공범으로 지목하면 기소장이 전송된다.

#### 5-1. 공범 선택지

"친구로서 연애 사업을 방조·방관한 죄" 톤. 받는 사람도 웃기면서 "나도 해봐야겠다" 동기 부여.

```
━━━━━━ 공범 지목 ━━━━━━

판사: 피고인의 죄에는
      공범이 있을 수 있습니다.
      다음 중 해당하는 자를
      지목하십시오.

  ① 소개팅 한 번 안 시켜준 죄
     "인맥 그렇게 넓으면서 왜 나한테는 안 써?"

  ② 옆에서 구경만 한 죄
     "내가 썸 타는 거 알면서 왜 가만히 있었어?"

  ③ "넌 왜 남친이 없어" 상해죄
     "물어볼 거면 남자를 데려오든가"

  ④ 본인도 솔로면서 조언한 죄
     "너도 못 하면서 나한테 '그냥 말해'는 뭐야"

  ⑤ 직접 입력

→ 공범에게 기소장 보내기

━━━━━━━━━━━━━━━━━━━━━
```

#### 5-2. 공범 전송 메시지

공범 죄목에 따라 메시지가 달라짐:

**① 소개팅 안 시켜준 죄 선택 시:**
```
┌─ 카카오톡 공유 메시지 ──────────┐
│                                  │
│  ⚖️ [긴급] 공범 지목 통보        │
│                                  │
│  [OO]이(가) 사주 법정에서        │
│  "짝사랑만 3년 죄"로             │
│  징역 9년을 선고받았습니다.      │
│                                  │
│  그리고 당신을                    │
│  "소개팅 한 번 안 시켜준 죄"로   │
│  공범 지목했습니다.              │
│                                  │
│  출석하지 않으면                  │
│  궐석재판이 진행됩니다.          │
│                                  │
│  [출석하러 가기 →]               │
│                                  │
└──────────────────────────────────┘
```

**④ 본인도 솔로면서 조언한 죄 선택 시:**
```
┌─ 카카오톡 공유 메시지 ──────────┐
│                                  │
│  ⚖️ [긴급] 공범 지목 통보        │
│                                  │
│  [OO]이(가) 사주 법정에서        │
│  징역 9년을 선고받았습니다.      │
│                                  │
│  그리고 당신을                    │
│  "본인도 솔로면서 조언한 죄"로   │
│  공범 지목했습니다.              │
│                                  │
│  본인의 형량도 궁금하다면        │
│  출석하십시오.                    │
│                                  │
│  [출석하러 가기 →]               │
│                                  │
└──────────────────────────────────┘
```

- 받은 사람: "ㅋㅋㅋ 소개팅 안 시켜준 게 죄래" → 링크 클릭 → 자기도 사주 입력 → **K-factor 2+**
- 공범 죄목이 구체적이라 "왜 나를 이걸로 지목했어ㅋㅋ" 대화가 추가로 발생
- ④번 "본인도 솔로면서 조언한 죄"는 받는 사람도 솔로 → 본인 형량 궁금 → 자연 전환

### Step 6. 유료 전환 CTA — 항소

판결문 + 공범 지목 후 **"항소하기"** CTA로 캐릭터 챗봇 전환.

#### 6-1. 캐릭터별 CTA

| 선택 | CTA 버튼 | CTA 아래 유도 문구 |
|------|---------|-----------------|
| 검사 윤태산 | "윤태산에게 항소하기" | "석방 전까지 뭘 해야 하는지 직접 물어보세요" |
| 변호사 서휘윤 | "서휘윤에게 상담받기" | "운세가 풀리기 전에 어떻게 준비할지 상담받으세요" |

#### 6-2. 전환 플로우

```
판결문에서 캐릭터 선택
    ↓
CTA 버튼 클릭
    ↓
캐릭터 챗봇 페이지로 이동
(생년월일시를 URL 파라미터로 전달)
예: /chat/yoon-taesan?birthday=199603121400&gender=female
    ↓
캐릭터가 평소대로 사주 기반 상담 시작
(재판 맥락은 이어받지 않음)
    ↓
유료 1:1 상담 진행 (350포인트)
```

- 재판에서 캐릭터에 감정이입된 상태 → 이미 호감/호기심이 쌓여있어 전환 허들 낮음
- 기술적으로는 단순 딥링크 — 생년월일시 파라미터만 넘기면 됨
- 챗봇이 재판 맥락을 이어받지 않아도, **"판결문에서 궁금해진 것"을 유저가 직접 질문**하게 되므로 자연스러움

### Step 7. 공유 + 재방문

#### 7-1. 공유 옵션 (기소장 카드 + 판결문)

```
┌──────────────────────────────┐
│  [📱 카카오톡으로 보내기]     │
│  [📸 인스타 스토리에 올리기]  │
│  [🔗 링크 복사]              │
│  [💾 이미지 저장]            │
│                              │
│  [🔄 다른 사주로 해보기]     │
│  → "친구 사주 넣어서          │
│     기소장 뽑기"           │
└──────────────────────────────┘
```

#### 7-2. "남의 사주로 기소장 뽑기" (확산 가속기)

- 본인 결과 확인 후 → "친구/썸남 사주도 넣어볼래?" 유도
- 상대방 생년월일 입력 → 상대의 기소장 생성 → "야 너 이거 나왔는데ㅋㅋ" 공유
- **1인이 N명의 기소장을 뽑는 구조** → 바이럴 배수 효과

#### 7-3. 재방문 트리거

| 트리거 | 내용 |
|--------|------|
| **석방일 리마인더** | 석방 예정일이 다가오면 알림: "곧 석방됩니다. 준비되셨나요?" → 재방문 |
| **월간 죄목 랭킹** | "이번 달 가장 많이 기소된 죄목 1위: 짝사랑만3년죄" → 화제성 |
| **시즌 캐릭터** | 신규 캐릭터 추가 시 검사/변호사 교체 → "새 검사는 뭐라고 하나?" |

---

## 감정 설계 흐름 요약

```
기소장 카드 (바이럴 지점 1) — 트위터/커뮤니티 바이럴
  "짝사랑만3년죄 징역 9년 현상금 5천만원ㅋㅋ" (뜨끔 + 웃김)
  검사 "습관입니다" vs 변호사 "진심입니다" (편 가르기)
  석방일 ████ 블러 (궁금증 → 재판 참여 유도)
    ↓ [내 기소장 보내기] ← 재판 안 해도 최소 공유 확보
    ↓ [재판 참여하기]
재판 1~2턴: 검사 기소 + 기간 입력
  "...맞는데" (찔림)
    ↓
재판 3턴: 변호사 반격 + 사주 해설
  "그게 니 잘못이 아니야, 偏印이 桃花를 눌러서야" (위로 + 사주 근거)
    ↓
재판 4턴: 검사 팩폭
  "그게 사랑입니까, 습관입니까" (아픔)
    ↓
판결문 카드 (바이럴 지점 2) — 인스타/카톡 바이럴
  석방일 "2026년 8월" 대형 활자로 공개 (기대감)
  석방 조건 "나 같은 게라고 하지 말 것" (울컥 → 캡처)
  형량+현상금+퍼센타일 반복 (숫자 비교)
    ↓
공범 지목
  "소개팅 안 시켜준 죄로 지목" (웃김 + 강제 유입)
    ↓
항소 → 챗봇
  "석방까지 어떻게 준비하지?" (개운/행동 지침 → 전환)
```

> **2장 카드 × 2가지 감정 × 2가지 플랫폼**: 기소장(웃김·자극 → 트위터/커뮤니티) + 판결문(울컥·기대 → 인스타/카톡). 같은 유저가 두 장을 서로 다른 곳에 공유하면 바이럴 채널이 2배.

---

## 기술 구체화

### T1. 죄목 배정 — 사주 API 필드 매핑

Stargio API 응답에서 사용하는 필드:

| 필드 | 데이터 구조 | 용도 |
|------|-----------|------|
| `십성` | `string[][]` (4주 천간/지지) | 편인·상관·비견 등 개별 카운트 |
| `발달십성` | `{인성, 관성, 식상, 비겁, 재성}` (%) | 십성 그룹별 발달도 |
| `12신살` | `string` | "도화" 포함 여부 |
| `기타신살` | `string` | "홍염" 포함 여부 |
| `일주론` | `{총평, 연애성향, ...}` | AI 프롬프트 컨텍스트 |
| `천간` / `지지` | `string[]` (4개씩) | 일주 키 추출 (천간[2]+지지[2]) |

#### T1-1. 십성 카운트 헬퍼

색기배틀·부검실과 동일한 `countSipsung()` 재사용:

```typescript
function countSipsung(sipsung: string[][], target: string): number {
  return sipsung.flat().filter(s => s === target).length;
}
```

#### T1-2. 사주 하이라이트 추출

```typescript
interface CourtSajuHighlights {
  // 십성 카운트
  pyeonInCount: number;     // 편인 (자격지심·혼자 끙끙)
  jeongInCount: number;     // 정인 (기다림·배려)
  sangGwanCount: number;    // 상관 (자의식·비교)
  siksangPercent: number;   // 발달십성.식상 (%)
  sikSinCount: number;      // 식신 (감성·프렌드존)
  biGyeonCount: number;     // 비견 (자존심)
  geobJaeCount: number;     // 겁재 (비교심리)
  pyeonGwanCount: number;   // 편관 (카리스마)
  jeongGwanCount: number;   // 정관 (인연·책임)
  jeongJaeCount: number;    // 정재 (표현 방식)
  pyeonJaeCount: number;    // 편재 (충동·술)

  // 발달십성 (%)
  insung: number;           // 인성
  gwansung: number;         // 관성
  siksang: number;          // 식상
  bigyeob: number;          // 비겁
  jasung: number;           // 재성

  // 신살
  doHwaSal: boolean;        // 도화살
  hongYeomSal: boolean;     // 홍염살
  doHwaChung: boolean;      // 도화살 충 (합/충 판별)

  // 일주론
  yeonaeSeongHyang: string; // 연애성향 텍스트
  ilJuKey: string;          // 일주 (예: "갑자")
}
```

#### T1-3. 죄목 배정 로직 — `determineCrime()`

부검실 `determineCauseOfDeath()`와 동일한 패턴: 각 죄목별 check 함수 → 점수 계산 → 최고 점수 선택.

```typescript
interface CrimeMapping {
  id: string;
  label: string;
  check: (h: CourtSajuHighlights) => number;  // 0~5 기본 점수
}

const CRIME_MAPPINGS: CrimeMapping[] = [
  {
    id: 'unrequited_3years',
    label: '짝사랑만 3년 죄',
    // 편인 과다 + 정관 약 → 속으로만 좋아하고 행동 못함
    check: (h) => {
      let score = 0;
      if (h.pyeonInCount >= 2) score += 3;
      else if (h.pyeonInCount >= 1) score += 1;
      if (h.insung >= 25) score += 1;
      if (h.jeongGwanCount === 0 && h.gwansung < 15) score += 1; // 정관 약
      return score;
    },
  },
  {
    id: 'never_confessed',
    label: '좋아한다는 말 못 한 죄',
    // 편인 월주 + 비견 강 → 자기 안에서만 정리
    check: (h) => {
      let score = 0;
      if (h.pyeonInCount >= 1) score += 2;
      if (h.biGyeonCount >= 2) score += 2;
      else if (h.biGyeonCount >= 1) score += 1;
      if (h.bigyeob >= 25) score += 1;
      return score;
    },
  },
  {
    id: 'solo_breakup',
    label: '혼자 이별한 죄',
    // 상관 과다 + 정관 충 → 시뮬 돌리고 혼자 포기
    check: (h) => {
      let score = 0;
      if (h.sangGwanCount >= 2) score += 3;
      else if (h.sangGwanCount >= 1) score += 1;
      if (h.siksang >= 25) score += 1;
      if (h.jeongGwanCount === 0) score += 1; // 정관 없음 = 시작 못함
      return score;
    },
  },
  {
    id: 'self_deprecation',
    label: '"나 같은 게 뭐" 죄',
    // 편인 + 상관 동주 → 자격지심 극대화
    check: (h) => {
      let score = 0;
      if (h.pyeonInCount >= 1 && h.sangGwanCount >= 1) score += 3; // 동주
      if (h.pyeonInCount >= 2) score += 1;
      if (h.sangGwanCount >= 2) score += 1;
      return score;
    },
  },
  {
    id: 'pretend_ok_after_ghosted',
    label: '읽씹당하고 괜찮은 척한 죄',
    // 비견 강 + 정재 약 → 자존심은 높은데 표현 못함
    check: (h) => {
      let score = 0;
      if (h.biGyeonCount >= 2) score += 2;
      else if (h.biGyeonCount >= 1) score += 1;
      if (h.bigyeob >= 25) score += 1;
      if (h.jeongJaeCount === 0 && h.jasung < 15) score += 2; // 정재 약
      return score;
    },
  },
  {
    id: 'always_friendzoned',
    label: '맨날 친구로만 남은 죄',
    // 식신 과다 + 편관 약 → 좋은 사람 이미지 고착
    check: (h) => {
      let score = 0;
      if (h.sikSinCount >= 2) score += 3;
      else if (h.sikSinCount >= 1) score += 1;
      if (h.siksang >= 25) score += 1;
      if (h.pyeonGwanCount === 0 && h.gwansung < 15) score += 1; // 편관 약
      return score;
    },
  },
  {
    id: 'mirror_sigh',
    label: '거울 보고 한숨 쉰 죄',
    // 상관 과다 + 도화살 합/충 → 자의식 높은데 도화 에너지 막힘
    check: (h) => {
      let score = 0;
      if (h.sangGwanCount >= 2) score += 2;
      else if (h.sangGwanCount >= 1) score += 1;
      if (h.siksang >= 30) score += 1;
      if (h.doHwaSal && h.doHwaChung) score += 2; // 도화 있는데 충
      else if (h.doHwaSal) score += 1;
      return score;
    },
  },
  {
    id: 'comparison_envy',
    label: '"쟤는 원래 이쁘니까" 죄',
    // 겁재 강 + 편인 → 비교 심리 + 자기비하
    check: (h) => {
      let score = 0;
      if (h.geobJaeCount >= 2) score += 2;
      else if (h.geobJaeCount >= 1) score += 1;
      if (h.bigyeob >= 25) score += 1;
      if (h.pyeonInCount >= 1) score += 2;
      return score;
    },
  },
  {
    id: 'drunk_confession_deleted',
    label: '취중고백 후 기억 삭제한 죄',
    // 식신 + 도화살 + 편재 → 술 + 매력 + 충동
    check: (h) => {
      let score = 0;
      if (h.sikSinCount >= 1) score += 1;
      if (h.doHwaSal) score += 2;
      if (h.pyeonJaeCount >= 1) score += 2;
      return score;
    },
  },
  {
    id: 'phone_checking',
    label: '연락 올까봐 폰만 본 죄',
    // 정인 과다 + 편관 암장 → 기다림 + 숨겨진 열정
    check: (h) => {
      let score = 0;
      if (h.jeongInCount >= 2) score += 3;
      else if (h.jeongInCount >= 1) score += 1;
      if (h.insung >= 25) score += 1;
      if (h.pyeonGwanCount >= 1 && h.gwansung < 20) score += 1; // 편관 암장(약하게)
      return score;
    },
  },
];
```

**배정 알고리즘**:
1. 모든 CRIME_MAPPINGS 순회 → `check(highlights)` 점수 산출
2. **동점 시 배열 순서(위)가 우선** — 순서는 바이럴 임팩트 높은 순 배치
3. 최고 점수 죄목 1개 선택
4. 점수 0인 경우 → fallback: `'self_deprecation'` ("나 같은 게 뭐" 죄 — 가장 범용적)

---

### T2. 형량·현상금·퍼센타일 산정 로직

#### T2-1. 매력 점수 (charmScore) — 사주 기반

```typescript
function calculateCharmScore(h: CourtSajuHighlights): number {
  let score = 0;

  // 도화살 (최대 +3)
  if (h.doHwaSal && h.hongYeomSal) score += 3;       // 둘 다 → +3
  else if (h.doHwaSal) score += 2;                     // 도화만 → +2
  else if (h.hongYeomSal) score += 2;                  // 홍염만 → +2

  // 정관/정인 동주 — 진심 낭비 (+2)
  if (h.jeongGwanCount >= 1 && h.jeongInCount >= 1) score += 2;

  // 식신 보유 — 감성 낭비 (+1)
  if (h.sikSinCount >= 1) score += 1;

  // 편관격 — 카리스마 낭비 (+1)
  if (h.pyeonGwanCount >= 1 && h.gwansung >= 20) score += 1;

  return score; // 0~7
}
```

#### T2-2. 형량 산정

```typescript
function calculateSentence(
  charmScore: number,
  periodInput: 'under_6m' | '6m_1y' | '1y_3y' | '3y_5y' | 'over_5y'
): number {
  const BASE = 1; // 기본 1년

  // 매력 가중 (charmScore → 형량 변환)
  const charmBonus =
    charmScore >= 6 ? 5 :  // 극상 매력
    charmScore >= 4 ? 3 :  // 높은 매력
    charmScore >= 2 ? 2 :  // 보통 매력
    charmScore >= 1 ? 1 :  // 약간 매력
    0;                      // 무매력

  // 기간 가중
  const periodBonus: Record<string, number> = {
    'under_6m': 0,
    '6m_1y': 1,
    '1y_3y': 2,
    '3y_5y': 4,
    'over_5y': 7,
  };

  return BASE + charmBonus + periodBonus[periodInput];
  // 범위: 1년(무매력+6개월미만) ~ 13년(극상매력+5년이상)
}
```

#### T2-3. 등급·현상금·퍼센타일

```typescript
function getSentenceGrade(sentence: number) {
  if (sentence >= 13) return { grade: 'extreme', label: '극형', borderStyle: 'gold_extreme' };
  if (sentence >= 8)  return { grade: 'felony',  label: '강력범', borderStyle: 'gold' };
  if (sentence >= 4)  return { grade: 'serious', label: '중범죄', borderStyle: 'silver' };
  return                      { grade: 'minor',   label: '경범죄', borderStyle: 'default' };
}

function calculateBounty(sentence: number): number {
  return sentence * 500; // 만원 단위. 9년 = 4,500만원
}

// 퍼센타일은 관대하게 설계 — 대부분 상위 30% 이내
function calculatePercentile(sentence: number): number {
  if (sentence >= 13) return 3;   // 상위 3%
  if (sentence >= 10) return 7;   // 상위 7%
  if (sentence >= 8)  return 10;  // 상위 10%
  if (sentence >= 6)  return 20;  // 상위 20%
  if (sentence >= 4)  return 30;  // 상위 30%
  if (sentence >= 2)  return 50;  // 상위 50%
  return 70;                       // 하위 30%
}
```

> **설계 의도**: 도화살/홍염살 보유자(약 30%)는 자동으로 charmScore 2+ → 형량 4년+ → 상위 30% 이내. 기간 3년 이상 + 도화살 = 형량 8년+ → 상위 10%. 숫자가 높을수록 자랑이 되는 구조.

---

### T3. 석방 예정일 산정 알고리즘

#### T3-1. 설계 방향

석방 예정일은 **사주의 대운·세운에서 억압 요소가 풀리는 시점**이 이상적이지만, 현재 Stargio API에서 대운/세운 필드를 `excludeKeys`로 제외 중. **2가지 옵션**:

| 옵션 | 방식 | 장점 | 단점 |
|------|------|------|------|
| **A: 대운 필드 활성화** | excludeKeys에서 `'대운'`, `'대운순서'`, `'대운시작나이'` 제거 → 대운 배열에서 합·충 해소 시점 계산 | 정확한 사주 근거 | API 응답 크기 증가, 파싱 복잡 |
| **B: 규칙 기반 산출** | 현재 사주 원국 데이터 + 형량으로 합리적 시점 산출 | 가볍고 빠름, 구현 간단 | "진짜 대운"은 아님 |

**MVP 권장: 옵션 B** — Phase 1에서는 규칙 기반, Phase 2에서 대운 연동.

#### T3-2. 규칙 기반 석방 예정일 (옵션 B)

```typescript
function calculateReleaseDate(
  sentence: number,
  charmScore: number,
  crimeId: string
): { year: number; month: number } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 기본 석방 시점: 현재 + (형량 ÷ 4)개월 (빠르게 풀리는 느낌)
  // 형량 1~3년 → 3~9개월 후
  // 형량 4~7년 → 12~21개월 후
  // 형량 8~12년 → 24~36개월 후
  // 형량 13년+ → 36~48개월 후
  const baseMonths = Math.ceil(sentence * 3);

  // 매력 보정: 매력 높으면 더 빨리 석방 (역설 — 매력 있으니까)
  const charmReduction = Math.min(charmScore * 2, 12); // 최대 12개월 감면

  // 시즌 보정: 봄(3~5월) 또는 연말(11~12월)에 풀리면 바이럴 효과 (시즌 연애)
  let totalMonths = baseMonths - charmReduction;
  totalMonths = Math.max(totalMonths, 2); // 최소 2개월 후

  let releaseMonth = currentMonth + totalMonths;
  let releaseYear = currentYear + Math.floor((releaseMonth - 1) / 12);
  releaseMonth = ((releaseMonth - 1) % 12) + 1;

  return { year: releaseYear, month: releaseMonth };
}
```

> **핵심**: "2026년 8월" 같은 구체적 시점이 바이럴 트리거. 정확도보다 **구체성**이 중요. "곧 풀린다"(2~6개월)가 너무 많으면 희소성 하락 → 분포를 적당히 퍼뜨림.

#### T3-3. 대운 연동 (Phase 2 — 옵션 A)

Phase 2에서 `excludeKeys`에서 대운 관련 필드를 제거하고, 아래 로직으로 정밀 산출:

```
1. 대운 배열에서 현재 대운 식별 (나이 기반)
2. 죄목의 원인 십성(편인·상관 등)이 합거·충 해소되는 대운 탐색
3. 해당 대운의 시작 연도 → 석방 예정 연월
4. 없으면 세운(연운)에서 탐색
5. 최대 5년 내로 제한 (너무 멀면 희망감 하락)
```

---

### T4. Edge Function 스펙

#### T4-1. 함수 정보

| 항목 | 값 |
|------|---|
| 함수명 | `analyze-saju-court` |
| 런타임 | Deno (Supabase Edge Functions) |
| JWT 검증 | 없음 (`--no-verify-jwt`) |
| 배포 | `npx supabase functions deploy analyze-saju-court --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx` |
| CORS | `supabase/functions/server/cors.ts` 사용 |
| Secrets | `SAJU_API_KEY`, `GOOGLE_API_KEY` |

#### T4-2. Input JSON

```typescript
interface CourtInput {
  birthday: string;           // "199603121400" (YYYYMMDDHHMM)
  gender: 'male' | 'female';
  lunar?: boolean;            // 기본 false (양력)
}
```

> **기간(period)은 Input에 포함하지 않음** — 기소장은 사주만으로 생성. 기간은 프론트엔드 재판 인터랙션에서 수집 후, 형량 재산정은 **클라이언트에서 계산**.

#### T4-3. Output JSON

```typescript
interface CourtOutput {
  courtId: string;                // UUID

  // 죄목
  crimeId: string;                // 'unrequited_3years' 등 10가지
  crimeLabel: string;             // '짝사랑만 3년 죄'

  // 매력 점수 (형량 산정 기초)
  charmScore: number;             // 0~7

  // 형량 (기간 입력 전 — charmScore 기반 예비 형량)
  baseSentence: number;           // 기본형(1) + 매력가중만
  // → 최종 형량은 프론트에서 periodBonus 추가

  // 검사 팩폭 + 변호사 반박 (기소장 카드용)
  prosecutorLine: string;         // "3년이면 사랑이 아니라 습관입니다"
  defenderLine: string;           // "3년을 버틴 건 습관이 아니라 진심입니다"

  // 사주 하이라이트 (재판 인터랙션용)
  sajuHighlights: CourtSajuHighlights;

  // AI 생성 텍스트 (Gemini)
  prosecutorOpening: string;      // 검사 기소 발언 (1턴)
  defenderClosing: string;        // 변호사 최후변론 (4턴)
  verdictComment: string;         // 판사 코멘트 (등급별)

  // 석방 근거 텍스트 (변호사 변론용)
  releaseRationale: string;       // "偏印이 합거되는 시점 — 자격지심 해소"

  // 석방 예정일 (기소장에서 블러, 판결문에서 공개)
  releaseDate: { year: number; month: number };

  // 석방 조건 (판사 명언)
  releaseCondition: string;       // "나 같은 게라고 하지 말 것"

  // 메타
  createdAt: string;              // ISO 8601
}
```

#### T4-4. Edge Function 처리 흐름

```
1. 입력 검증 (birthday 형식, gender 유효성)
    ↓
2. Stargio API 호출 (fetchWithRetry 3회)
    ↓
3. excludeKeys 경량화 (기존 8개 유지)
    ↓
4. extractCourtHighlights() — 사주 하이라이트 추출
    ↓
5. determineCrime() — 죄목 배정
    ↓
6. calculateCharmScore() — 매력 점수
    ↓
7. baseSentence = 1 + charmBonus
    ↓
8. calculateReleaseDate() — 석방 예정일
    ↓
9. lookupCrimeTexts() — 죄목별 검사/변호사 고정 대사
    ↓
10. Gemini API 호출 — 검사 기소발언 + 변호사 최후변론 + 판사 코멘트
    ↓
11. DB 저장 (saju_courts)
    ↓
12. 응답 반환
```

#### T4-5. 형량 최종 산정 — 클라이언트 계산

**기간(period)은 재판 인터랙션 중 수집** → 클라이언트에서 최종 형량 계산:

```typescript
// 프론트엔드에서 실행
const finalSentence = courtResult.baseSentence + periodBonus[selectedPeriod];
const bounty = finalSentence * 500;
const percentile = calculatePercentile(finalSentence);
const grade = getSentenceGrade(finalSentence);
```

> **Edge Function에서 기간까지 받으면?** 재판 인터랙션 없이 기소장만 공유하는 유저도 있으므로, 기소장 생성(Edge Function)과 형량 확정(클라이언트)을 분리. Edge Function은 1회만 호출.

---

### T5. DB 스키마

```sql
-- 사주 법정 테이블
CREATE TABLE saju_courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 유저 사주 정보
  birthday TEXT NOT NULL,
  birth_time TEXT,
  gender TEXT NOT NULL,

  -- 죄목
  crime_id TEXT NOT NULL,         -- 'unrequited_3years' 등
  crime_label TEXT NOT NULL,      -- '짝사랑만 3년 죄'

  -- 점수/형량
  charm_score NUMERIC NOT NULL,   -- 0~7
  base_sentence INT NOT NULL,     -- 기본형 + 매력가중 (기간 미포함)
  final_sentence INT,             -- 기간 포함 최종 형량 (재판 완료 시)
  period_input TEXT,              -- 'under_6m' | '6m_1y' | '1y_3y' | '3y_5y' | 'over_5y'
  bounty INT,                     -- 현상금 (만원)
  percentile INT,                 -- 상위 N%

  -- 석방
  release_year INT NOT NULL,
  release_month INT NOT NULL,
  release_condition TEXT NOT NULL, -- 석방 조건 (판사 명언)

  -- AI 생성 텍스트
  prosecutor_line TEXT NOT NULL,   -- 검사 팩폭 (카드용)
  defender_line TEXT NOT NULL,     -- 변호사 반박 (카드용)
  prosecutor_opening TEXT,         -- 검사 기소 발언 (재판 1턴)
  defender_closing TEXT,           -- 변호사 최후변론 (재판 4턴)
  verdict_comment TEXT,            -- 판사 코멘트

  -- 전체 결과 JSONB
  result JSONB NOT NULL,

  -- 공범 지목
  accomplice_crime TEXT,           -- '소개팅 안 시켜준 죄' 등
  accomplice_shared BOOLEAN DEFAULT false,

  -- 재판 진행 상태
  trial_completed BOOLEAN DEFAULT false,

  -- 메타
  status TEXT DEFAULT 'created',   -- created | trial_done | shared
  created_at TIMESTAMPTZ DEFAULT NOW(),
  trial_completed_at TIMESTAMPTZ,

  -- 추적
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- 인덱스: 죄목별 통계 (월간 랭킹)
CREATE INDEX idx_saju_courts_crime ON saju_courts(crime_id);
CREATE INDEX idx_saju_courts_created ON saju_courts(created_at);

-- RLS: 읽기 공개, 쓰기 서비스 키만
ALTER TABLE saju_courts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read courts"
  ON saju_courts FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert"
  ON saju_courts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update"
  ON saju_courts FOR UPDATE
  USING (true);
```

#### T5-1. 월간 죄목 랭킹 뷰 (재방문 트리거)

```sql
CREATE OR REPLACE VIEW court_crime_stats AS
SELECT
  crime_id,
  crime_label,
  COUNT(*) AS total_count,
  ROUND(AVG(COALESCE(final_sentence, base_sentence)), 1) AS avg_sentence,
  ROUND(AVG(bounty), 0) AS avg_bounty
FROM saju_courts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY crime_id, crime_label
ORDER BY total_count DESC;
```

---

### T6. 상태 머신 정의

```
┌──────────────┐
│   landing    │  "당신이 연애 못한 이유, 사주로 기소합니다"
└──────┬───────┘
       │ CTA 클릭
       ↓
┌──────────────┐
│   input      │  생년월일시 + 성별 입력
└──────┬───────┘
       │ 제출
       ↓
┌──────────────┐
│  analyzing   │  "긴급 체포 영장 발부 중..." (2~3초)
│              │  → "검사 윤태산 출석..."
│              │  → "변호사 서휘윤 출석..."
│              │  → "피고인의 사주 원국 분석 중..."
└──────┬───────┘
       │ Edge Function 응답 수신
       ↓
┌──────────────┐
│  indictment  │  기소장 카드 표시 (바이럴 지점 1)
│              │  - 죄목, 예비 형량, 현상금, 퍼센타일
│              │  - 검사 팩폭 + 변호사 반박
│              │  - 석방일 블러
│              │  [재판 참여하기] [내 기소장 보내기]
└──────┬───────┘
       │ "재판 참여하기" 클릭
       ↓
┌──────────────┐
│  trial_1     │  검사 기소 — "피고인, 좋아하는 사람 있죠?"
│              │  유저 선택지 2~3개
└──────┬───────┘
       │ 유저 선택
       ↓
┌──────────────┐
│  trial_2     │  검사 반박 + 기간 입력 수집
│              │  "얼마나 됐습니까?" → 4개 선택지
│              │  → 기간 선택 시 형량 재산정 (클라이언트)
└──────┬───────┘
       │ 기간 선택
       ↓
┌──────────────┐
│  trial_3     │  변호사 반격 + 사주 해설
│              │  유저에게 질문 — 선택지 2~3개
└──────┬───────┘
       │ 유저 선택
       ↓
┌──────────────┐
│  trial_4     │  변호사 최후변론 + 검사 팩폭 마무리
│              │  유저 선택 반영된 감동 변론
└──────┬───────┘
       │ 자동 전환 (2초 후)
       ↓
┌──────────────┐
│   verdict    │  판결문 카드 표시 (바이럴 지점 2)
│              │  - 석방일 공개 (대형 활자)
│              │  - 석방 조건 (판사 명언)
│              │  - 형량 + 현상금 + 퍼센타일
│              │  [공유] [공범 지목하기]
└──────┬───────┘
       │ "공범 지목하기" 클릭
       ↓
┌──────────────┐
│  accomplice  │  공범 선택 (5가지 + 직접입력)
│              │  → 카카오톡 공유 메시지 생성
│              │  [공범에게 기소장 보내기]
└──────┬───────┘
       │ 공유 완료 or 스킵
       ↓
┌──────────────┐
│  conversion  │  "항소하기" CTA
│              │  윤태산 / 서휘윤 선택
│              │  → /chat/{characterId}?birthday=...&gender=...
└──────────────┘
```

#### T6-1. 각 상태별 데이터

```typescript
type CourtState =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'indictment'
  | 'trial_1'
  | 'trial_2'
  | 'trial_3'
  | 'trial_4'
  | 'verdict'
  | 'accomplice'
  | 'conversion';

interface CourtStateData {
  // input에서 수집
  birthday: string;
  gender: 'male' | 'female';
  birthTime?: string;

  // analyzing → indictment (Edge Function 응답)
  courtResult: CourtOutput | null;

  // trial_1에서 수집
  trial1Choice: number | null;      // 0 | 1 | 2

  // trial_2에서 수집
  periodInput: string | null;       // 기간 선택

  // trial_2에서 클라이언트 계산
  finalSentence: number | null;
  bounty: number | null;
  percentile: number | null;
  sentenceGrade: SentenceGrade | null;

  // trial_3에서 수집
  trial3Choice: number | null;      // 0 | 1 | 2

  // accomplice에서 수집
  accompliceCrime: string | null;
}
```

---

### T7. Gemini 프롬프트 설계

#### T7-1. 템플릿 vs Gemini 구분

| 요소 | 방식 | 이유 |
|------|------|------|
| **죄목별 검사 팩폭** | 고정 템플릿 | PRD에 이미 10가지 확정. 밈화될 문장이므로 품질 통제 |
| **죄목별 변호사 반박** | 고정 템플릿 | 위와 동일 |
| **석방 조건 (판사 명언)** | 고정 템플릿 | 10가지 확정 |
| **검사 기소 발언 (1턴)** | Gemini 생성 | 사주 데이터 기반 맞춤 질문 |
| **변호사 최후변론 (4턴)** | Gemini 생성 | 유저 선택 반영 필요 |
| **판사 코멘트** | 등급별 고정 | 4등급 × 1문장 |
| **석방 근거 텍스트** | Gemini 생성 | 사주 해석 필요 |

> **원칙**: 캡처·공유될 문장(카드)은 **고정 템플릿**으로 품질 보장. 재판 과정의 몰입감 대사는 **Gemini 동적 생성**으로 사주 맞춤화.

#### T7-2. Gemini 프롬프트 — 검사 기소 발언 (1턴)

```
역할: 당신은 사주 법정의 검사 윤태산입니다.
톤: 반말. 도발적이지만 유머러스. 피고인을 찌르되 상처가 아닌 뜨끔함을 줍니다.
캐릭터: 거칠고 직설적인 검사. 법정 용어를 섞어 사용.

입력 데이터:
- 죄목: {crimeLabel}
- 사주 하이라이트: 도화살({doHwaSal}), 편인({pyeonInCount}개), 상관({sangGwanCount}개)
- 연애성향: {yeonaeSeongHyang}
- 일주: {ilJuKey}

작성 규칙:
1. 검사 기소 발언 3~5줄 생성
2. "피고인"이라는 호칭 사용
3. 죄목과 관련된 구체적 행동을 지적 (사주 근거 1가지 이상)
4. 마지막에 질문으로 끝내서 유저 선택지로 이어지게
5. 사주 용어는 한자 병기 가능하되 자연어로 풀어서 설명
6. 반말체, 문장 끝에 "~입니까" "~인 거잖아요" 등 법정 심문 톤

출력 형식:
JSON { "opening": "..." }
```

#### T7-3. Gemini 프롬프트 — 변호사 최후변론 (4턴)

```
역할: 당신은 사주 법정의 변호사 서휘윤입니다.
톤: 존댓말. 따뜻하고 공감적. 피고인의 아픈 곳을 어루만지면서 사주 근거로 뒤집습니다.
캐릭터: 다정하고 진지한 변호사. 피고인을 향한 진심 어린 변론.

입력 데이터:
- 죄목: {crimeLabel}
- 사주 하이라이트: (전체)
- 연애성향: {yeonaeSeongHyang}
- 일주: {ilJuKey}
- 유저 선택: trial_1 → "{trial1ChoiceText}", trial_3 → "{trial3ChoiceText}"
- 석방 근거: {releaseRationale}

작성 규칙:
1. 최후변론 5~8줄 생성
2. 유저가 재판 중 선택한 항변(trial1Choice, trial3Choice)을 반드시 1번 이상 인용
3. 사주 용어로 "이건 피고인의 잘못이 아니라 사주 구조의 문제"를 논증
4. 마지막에 "판사님, ~를 호소합니다" 톤으로 마무리
5. 존댓말체, 감동적이되 과하지 않게

출력 형식:
JSON { "closing": "..." }
```

#### T7-4. Gemini 프롬프트 — 석방 근거 텍스트

```
역할: 당신은 사주 전문 변호사입니다.
톤: 전문적이면서 이해하기 쉽게.

입력 데이터:
- 죄목: {crimeLabel} (원인 십성: {causeSipsung})
- 사주 원국: 천간 {천간}, 지지 {지지}
- 현재 억압 요소: {원인 십성}이 과다/합/충 상태

작성 규칙:
1. 1~2문장으로 "왜 지금 억압되어 있고, 언제 풀리는지" 설명
2. 한자 용어는 1~2개만 사용하되 풀이 병기
3. 예: "偏印(편인)이 桃花(도화)를 누르고 있어 매력이 발현되지 못하는 구조"

출력 형식:
JSON { "rationale": "..." }
```

---

### T8. TypeScript 타입 + 컴포넌트 목록

#### T8-1. 핵심 타입 정의

```typescript
// ──── 죄목 ────
type CrimeId =
  | 'unrequited_3years'        // 짝사랑만 3년 죄
  | 'never_confessed'          // 좋아한다는 말 못 한 죄
  | 'solo_breakup'             // 혼자 이별한 죄
  | 'self_deprecation'         // "나 같은 게 뭐" 죄
  | 'pretend_ok_after_ghosted' // 읽씹당하고 괜찮은 척한 죄
  | 'always_friendzoned'       // 맨날 친구로만 남은 죄
  | 'mirror_sigh'              // 거울 보고 한숨 쉰 죄
  | 'comparison_envy'          // "쟤는 원래 이쁘니까" 죄
  | 'drunk_confession_deleted' // 취중고백 후 기억 삭제한 죄
  | 'phone_checking';          // 연락 올까봐 폰만 본 죄

// ──── 기간 ────
type PeriodInput = 'under_6m' | '6m_1y' | '1y_3y' | '3y_5y' | 'over_5y';

// ──── 형량 등급 ────
type SentenceGradeId = 'minor' | 'serious' | 'felony' | 'extreme';

interface SentenceGrade {
  grade: SentenceGradeId;
  label: string;       // '경범죄' | '중범죄' | '강력범' | '극형'
  borderStyle: string; // 카드 테두리 스타일
}

// ──── 공범 죄목 ────
type AccompliceCrime =
  | 'no_blind_date'            // 소개팅 한 번 안 시켜준 죄
  | 'just_watched'             // 옆에서 구경만 한 죄
  | 'why_no_bf'                // "넌 왜 남친이 없어" 상해죄
  | 'solo_advisor'             // 본인도 솔로면서 조언한 죄
  | 'custom';                  // 직접 입력

// ──── 재판 선택지 ────
interface TrialChoice {
  id: number;
  text: string;
  prosecutorReaction?: string;   // 검사 반응 (선택 시)
  defenderReaction?: string;     // 변호사 반응 (선택 시)
}

// ──── Edge Function 응답 ────
interface CourtResult {
  courtId: string;
  crimeId: CrimeId;
  crimeLabel: string;
  charmScore: number;
  baseSentence: number;
  prosecutorLine: string;
  defenderLine: string;
  sajuHighlights: CourtSajuHighlights;
  prosecutorOpening: string;
  defenderClosing: string;
  verdictComment: string;
  releaseRationale: string;
  releaseDate: { year: number; month: number };
  releaseCondition: string;
  createdAt: string;
}
```

#### T8-2. 컴포넌트 목록

```
src/components/court/
├── SajuCourtClient.tsx         # 메인 상태머신 (11개 상태 관리)
├── CourtLanding.tsx            # 랜딩 — "사주로 기소합니다" + CTA
├── CourtInput.tsx              # 입력 — 생년월일시 + 성별 (기존 BirthInput 재사용)
├── CourtAnalyzing.tsx          # 로딩 — "긴급 체포 영장 발부 중..."
├── IndictmentCard.tsx          # 기소장 카드 (9:16, toPng 캡처)
├── TrialScreen.tsx             # 재판 인터랙션 (1~4턴 통합)
│   ├── TrialMessage.tsx        # 검사/변호사 말풍선
│   └── TrialChoices.tsx        # 유저 선택지 버튼
├── VerdictCard.tsx             # 판결문 카드 (9:16, toPng 캡처)
├── AccompliceScreen.tsx        # 공범 지목 화면
├── ConversionCTA.tsx           # 항소 → 챗봇 전환
└── CourtShareButtons.tsx       # 공유 (카카오톡, 이미지, 링크)
```

#### T8-3. 기존 컴포넌트 재사용

| 기존 컴포넌트 | 재사용 방식 |
|-------------|-----------|
| `BirthInput.tsx` | 그대로 재사용 (YYYY-MM-DD 자동포맷) |
| `GenderSelect.tsx` | 그대로 재사용 (슬라이딩 토글) |
| `BirthTimeInput.tsx` | 그대로 재사용 (4자리 → 오전/오후) |
| `ShareButtons.tsx` | 공유 로직 재사용, UI는 법정 톤 커스텀 |
| `AnalyzingScreen.tsx` | 구조 참조, 메시지만 법정용으로 교체 |

#### T8-4. 페이지 라우트

```
src/app/court/
├── page.tsx                    # /court — 메인 (정적 OG)
└── [courtId]/
    └── page.tsx                # /court/[courtId] — 공범 유입 (동적 OG, SSR)
```

**동적 OG 메타태그** (`/court/[courtId]/page.tsx`):
```typescript
export async function generateMetadata({ params }) {
  const court = await supabase.from('saju_courts').select('*').eq('id', params.courtId).single();
  return {
    title: `⚖️ ${court.crime_label} — 징역 ${court.final_sentence ?? court.base_sentence}년`,
    description: `현상금 ${court.bounty ?? court.base_sentence * 500}만원 | ${court.prosecutor_line}`,
    openGraph: {
      title: `⚖️ 사주 법정 기소장`,
      description: `${court.crime_label} | 징역 ${court.final_sentence ?? court.base_sentence}년 선고`,
    },
  };
}
```

---

**최종 업데이트**: 2026-03-30
