# 바이럴 기능 요구사항 정의서 (PRD)

## 프로젝트 개요

- **기능명**: 사주 데이트 시뮬레이션 — "5턴 안에 데이트 따내기"
- **URL 경로**: `/dating-sim` (메인), `/dating-sim/[resultId]` (결과 공유 + 동적 OG)
- **바이럴 기능 간단 요약**: 사용자의 사주 기반으로 궁합이 좋은 AI 캐릭터 3명을 추천하고, 선택한 캐릭터와 5턴의 대화를 통해 데이트 승낙을 따내는 시뮬레이션. 실패 시 캐릭터가 매긴 연애 점수표 + 전체 유저 중 등수 + 사주 기반 팩폭 분석이 공개되며, 이 결과 카드가 자조적 유머로 공유되어 바이럴을 일으킴. 성공/실패 결과 모두 캐릭터 채팅 페이지로 리다이렉트하여 유료 전환 (사주 기반 일반 상담, 시뮬레이션 맥락 비연속).

---

## 바이럴 루프

### 바이럴을 일으키는 구조

1. **1인 도전**: 생년월일 입력(3초) → 사주 궁합 기반 캐릭터 3명 추천 → 1명 선택 → 5턴 대화 시작
2. **결과 폭탄**: 성공/실패 관계없이 캐릭터가 매긴 점수표 + 전체 유저 중 등수 + 팩폭 분석이 카드로 생성
3. **자조 공유**: "나 12,847명 중 11,203등이래ㅋㅋ" / "대화력 4점 받았다ㅋㅋ" → 카톡/인스타 스토리 공유
4. **경쟁 유입**: 결과 본 친구가 "나는 몇 등이지?" → 링크 타고 유입 → 도전
5. **전환**: 결과 카드 하단 CTA → 캐릭터 채팅 페이지로 리다이렉트 (birthday+gender 파라미터) → 사주 기반 일반 상담 시작 → 유저가 운세 흐름 개선법을 직접 질문

### 유발 감정

| 감정 | 메커니즘 |
|------|---------|
| **자조적 유머 (Vulnerability)** | "대화력 4점에 중독성 2점ㅋㅋ 현실에서도 이래서 2번째 만남이 없었구나" → 아프지만 웃기니까 공유 저항 없음 |
| **분노/재도전 (Wrath)** | "4.8점? 말도 안 돼 다시 해볼게" → 재도전 루프 + "이번엔 7점 나왔다!" 재공유 |
| **시기/비교 (Envy)** | "전체 유저 중 11,203등" → "내 친구는 몇 등이지?" → 경쟁 유입 |
| **오만 (Pride)** | 높은 점수/등수가 나오면 "나 상위 3%래" 자랑 공유 |
| **호기심/불안** | "캐릭터가 나한테 진짜 몇 점을 매길까?" → 안 해볼 수 없음 |

### 논란 설계

- **"AI가 사람의 연애 능력에 점수를 매긴다"** → "이게 맞아?" vs "근데 맞는데ㅋㅋ" 논쟁
- **전체 유저 등수 공개** → "12,847명 중 꼴찌 근처라고?" → 분노 + 자조 + 재도전
- **읽씹 랭킹 보드** → "이번 주 1턴 만에 차인 사람 명예의 전당" → 공개 처형 포맷이 화제성 유발
- **스윗 스팟**: 점수가 "기분 나쁘지만 웃긴" 수준. 진짜 상처를 주는 게 아니라 "아 맞는데 열받아ㅋㅋ" 존

---

## 사용자 스토리

**As** (누가): 현실 연애 시장에서 외모나 스펙으로 저평가받아 연애 콤플렉스가 있지만, 내면의 매력만큼은 인정받고 싶은 2030 여성 유저는

**Want to** (무엇을 원한다): 외모와 직업을 가린 채 오직 사주(내면 에너지)만으로 매력적인 AI 캐릭터의 마음을 사로잡는 데이트 시뮬레이션을 체험하고, 캐릭터가 매긴 점수와 등수를 친구와 비교하기를 원한다.

**So that** (어떤 목적/가치를 위해): 현실에서 못 해본 연애 경험을 안전한 가상 공간에서 시도하며, 결과에서 나온 자조적 점수를 유머로 공유해 웃고, 시뮬레이션에서 드러난 운세 흐름의 약점을 개선하고 싶어 AI 캐릭터에게 직접 상담을 요청하기 위해.

---

## MVP 필요 기능

### Step 1. 초저마찰 랜딩 및 정보 입력

- 메인 화면: "5턴 안에 데이트 따낼 수 있어?" 문구 + 도전 버튼
- 입력 항목 4가지 (**3초 컷** 설계):
  1. **성별**: 필수
  2. **생년월일**: 필수. 숫자 키패드 노출
  3. **태어난 시간**: 선택. "모름" 기본 선택
  4. **양력/음력**: 양력 기본 선택

#### UTM 파라미터 자동입력 (사주GPT 제휴 유입)

사주GPT 광고 배너 클릭 시 아래 형식으로 유저 정보가 URL에 포함되어 유입된다:

```
/dating-sim?utm_source=sajugpt&utm_medium=affiliate&utm_campaign=sdowha&birthday=199112252315&gender=male
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

- 입력 직후 "사주 분석 중..." 로딩 연출 (기대감 증폭)

### Step 2. 사주 기반 캐릭터 3명 추천 + 선택

- 사주 궁합 알고리즘으로 전체 캐릭터 중 **궁합 상위 3명** 추천
- 각 캐릭터 카드에 표시:
  - 캐릭터 이미지 + 이름
  - 궁합 퍼센티지 (예: "당신과의 궁합 87%")
  - 캐릭터의 한 줄 첫인상 (예: 윤태산: "네 사주에서 도화살 냄새가 나는데?")
  - 난이도 표시 (예: "데이트 성공률 12%" / "전체 유저 평균 성공률")
- 사용자가 **1명 선택** → 대화 시작

#### 궁합 점수 산출 공식 (`calculateCompatibility()`)

사주 API 응답에서 추출한 지표로 캐릭터별 궁합 점수(0~100)를 산출한다.

```typescript
interface SajuIndicators {
  ilgan: string;          // 일간 (甲/乙/丙/丁/戊/己/庚/辛/壬/癸)
  doHwaSal: boolean;      // 도화살 유무
  hongYeomSal: boolean;   // 홍염살 유무
  pyeonGwan: number;      // 편관 개수 (countSipsung)
  sangGwan: number;       // 상관 개수
  sikSin: number;         // 식신 개수
  fireRatio: number;      // 화기 비율 (%)
  gwansung: number;       // 관성 발달도 (%)
  siksang: number;        // 식상 발달도 (%)
  bigyeon: number;        // 비겁 발달도 (%)
  insung: number;         // 인성 발달도 (%)
  jasung: number;         // 재성 발달도 (%)
}
```

**캐릭터별 궁합 알고리즘**:

| 캐릭터 | 선호 지표 | 점수 공식 | 기본 난이도 |
|--------|----------|----------|-----------|
| **윤태산** (야수형) | 도화살 + 높은 식상 = 직진형 어필에 약함 | `base(30) + doHwaSal(+25) + hongYeomSal(+15) + siksang≥25(+15) + fireRatio≥30(+15)` | **하드** (성공률 12%) |
| **도해결** (지적 엘리트) | 인성 + 관성 = 지적 대화에 반응 | `base(35) + insung≥25(+20) + gwansung≥25(+20) + pyeonGwan≥2(+15) + bigyeon≤20(+10)` | **노멀** (성공률 18%) |
| **서휘윤** (치유형 연하남) | 재성 + 식신 = 따뜻한 에너지에 끌림 | `base(40) + jasung≥25(+20) + sikSin≥2(+15) + sangGwan≥1(+15) + fireRatio≤20(+10)` | **이지** (성공률 28%) |
| **기지문** (무뚝뚝 경호원) | 비겁 + 관성 = 강인한 에너지 호감 | `base(35) + bigyeon≥30(+20) + gwansung≥20(+15) + doHwaSal(+15) + insung≤15(+15)` | **노멀** (성공률 20%) |
| **최설계** (도시형 전략가) | 재성 + 인성 = 전략적 사고력에 반응 | `base(30) + jasung≥30(+25) + insung≥20(+15) + sangGwan≥2(+15) + fireRatio≥25(+15)` | **하드** (성공률 15%) |

- **점수 범위**: 0~100 (base + 조건 합산, 100 캡)
- **추천 순서**: 궁합 점수 내림차순 상위 3명
- **동점 시**: 캐릭터 priority 순 (윤태산 > 도해결 > 서휘윤 > 기지문 > 최설계)
- **성공률**: DB에서 실시간 집계 (`completed 중 success=true 비율`) — 초기값은 기본 난이도 사용

#### 캐릭터별 첫인상 대사 (사주 조건부)

```typescript
const FIRST_IMPRESSIONS: Record<CharacterId, { default: string; conditional: Array<{ condition: (s: SajuIndicators) => boolean; line: string }> }> = {
  'yoon-taesan': {
    default: "흥. 재미있는 사주네. 나한테 도전하겠다고?",
    conditional: [
      { condition: s => s.doHwaSal, line: "네 사주에서 도화살 냄새가 나는데? ...조금 기대해볼게." },
      { condition: s => s.hongYeomSal, line: "홍염살이라... 대담한 건 마음에 들어." },
      { condition: s => s.fireRatio >= 30, line: "화기가 센 사주군. 불꽃놀이가 되려나." },
    ]
  },
  'do-haegyeol': {
    default: "데이터를 보면 당신의 성공 확률은... 글쎄요.",
    conditional: [
      { condition: s => s.insung >= 25, line: "인성이 강하군요. 대화가 통할 수도 있겠어요." },
      { condition: s => s.gwansung >= 25, line: "관성이 발달했네요. 제 기준에 부합할지 봅시다." },
    ]
  },
  'seo-hwiyoon': {
    default: "안녕하세요! 사주 보니까 되게 따뜻한 사람일 것 같아요.",
    conditional: [
      { condition: s => s.sikSin >= 2, line: "식신이 강하시네요! 맛집 얘기 좋아하시죠? 저도요!" },
      { condition: s => s.jasung >= 25, line: "재성이 좋으시네요. 뭔가 든든한 느낌이 들어요." },
    ]
  },
  'gi-jimun': {
    default: "...말은 적게 하겠습니다. 행동으로 보여주세요.",
    conditional: [
      { condition: s => s.bigyeon >= 30, line: "비겁이 강하군. 고집이 세겠지만... 싫지 않아." },
      { condition: s => s.doHwaSal, line: "도화살... 위험한 기운이야. 내가 지켜야 하나." },
    ]
  },
  'choi-seolgye': {
    default: "당신의 사주를 분석해봤는데, 꽤 흥미로운 포트폴리오군요.",
    conditional: [
      { condition: s => s.jasung >= 30, line: "재성이 이 정도면... 투자 가치가 있어 보이네요." },
      { condition: s => s.sangGwan >= 2, line: "상관이 강하군요. 예측 불가능한 타입... 제 취향이에요." },
    ]
  }
};
```

### Step 3. 5턴 데이트 대화

- 캐릭터와 **5턴의 대화** 진행
- 매 턴마다 사용자가 **3개 선택지 중 택 1** (텍스트 직접 입력 아닌 선택지 방식 → 개발 간소화 + 결과 일관성)
- 선택지는 사주 성향 기반으로 생성 (예: 화(火) 강한 사주 → 직진형 선택지 포함)
- 캐릭터의 반응이 **선택에 따라 분기** → 호감도 내부 수치 증감
- 5턴 종료 시 호감도 기반 **성공/실패 판정**

#### 대화 생성 아키텍처 — Gemini API 1회 호출

대화 트리 전체를 **Gemini 2.5 Flash 1회 호출**로 생성한다. 턴별 스트리밍 아닌 일괄 생성 방식.

**요청 타이밍**: Step 2에서 캐릭터 선택 직후, "대화 준비 중..." 로딩 동안 Edge Function 호출.

```typescript
// Edge Function: generate-dating-conversation
// 입력
interface GenerateConversationRequest {
  characterId: string;
  sajuIndicators: SajuIndicators;
  ilganDescription: string;  // "을목일간 — 부드럽고 유연하지만 돌려 말하는 경향"
  compatibility: number;     // 궁합 점수 (0~100)
  gender: 'male' | 'female';
}

// 출력
interface ConversationTree {
  turns: DatingTurn[];       // 5턴
  successThreshold: number;  // 이 캐릭터의 성공 기준 호감도 (60~80)
}

interface DatingTurn {
  turnNumber: number;                // 1~5
  situation: string;                 // 상황 설명 (e.g., "카페에서 처음 마주앉았다")
  characterLine: string;             // 캐릭터 대사
  choices: DatingChoice[];           // 3개 선택지
  characterReactions: Record<string, string>;  // choiceId → 캐릭터 반응 대사
}

interface DatingChoice {
  id: string;                        // "t1_c1", "t1_c2", "t1_c3"
  text: string;                      // 선택지 텍스트
  type: 'bold' | 'witty' | 'safe';  // 직진형 | 위트형 | 안전형
  affectionDelta: number;            // 호감도 변화량 (-10 ~ +20)
  scoreImpact: {                     // 4차원 점수 영향
    charm: number;                   // -2 ~ +3
    conversation: number;
    sense: number;
    addiction: number;
  };
}
```

#### Gemini 프롬프트 템플릿

```
당신은 데이트 시뮬레이션의 대화 트리를 설계하는 작가입니다.

## 캐릭터 정보
- 이름: {characterName}
- 아키타입: {archetype}
- 성격: {personalityDescription}
- 말투: {speechPattern}
- 호감 포인트: {likesDescription}
- 비호감 포인트: {dislikesDescription}

## 유저 사주 정보
- 일간: {ilganDescription}
- 주요 특성: {sajuTraits}
- 궁합 점수: {compatibility}점/100점
- 성별: {gender}

## 규칙
1. 5턴의 데이트 대화를 JSON으로 생성하세요.
2. 각 턴은 상황 설명 → 캐릭터 대사 → 유저 선택지 3개 → 선택별 캐릭터 반응으로 구성됩니다.
3. 선택지 3개는 반드시 bold(직진형), witty(위트형), safe(안전형)로 구분하세요.
4. 캐릭터의 성격에 맞는 선택지가 높은 호감도를 얻어야 합니다.
   - {characterName}은(는) {likesDescription}에 높은 호감, {dislikesDescription}에 감점합니다.
5. 유저의 사주 성향({ilganDescription})이 반영된 선택지를 자연스럽게 포함하세요.
   - 예: 화기가 강한 사주 → bold 선택지가 유저의 사주 특성을 반영
6. 호감도 변화량(affectionDelta) 범위: -10 ~ +20
   - 캐릭터가 좋아하는 유형의 선택: +12 ~ +20
   - 무난한 선택: +3 ~ +8
   - 캐릭터가 싫어하는 유형의 선택: -10 ~ -3
7. 턴별 상황 전개:
   - 1턴: 첫 만남/첫인상 (카페 도착)
   - 2턴: 가벼운 대화 (취미/관심사)
   - 3턴: 분위기 전환 (깊어지는 대화 or 돌발 상황)
   - 4턴: 핵심 질문 (가치관/연애관 탐색)
   - 5턴: 결정적 순간 (고백/데이트 제안)
8. 대사는 반말+존댓말 혼용, 20대~30대 한국어 구어체로 작성하세요.
9. 캐릭터 반응은 {speechPattern}을 정확히 따르세요.
10. 점수 영향(scoreImpact)은 각 -2 ~ +3 범위, 선택 유형에 따라:
    - bold 선택이 캐릭터 취향과 맞으면: charm+2, addiction+2
    - witty 선택이 맞으면: sense+3, conversation+1
    - safe 선택이 맞으면: conversation+1 (나머지 0)
    - 어긋나는 선택: 해당 항목 -1 ~ -2
11. 성공 임계값(successThreshold)은 궁합 점수 기반:
    - 궁합 80+: threshold 50
    - 궁합 60~79: threshold 60
    - 궁합 40~59: threshold 70
    - 궁합 39 이하: threshold 80

## 출력 형식
아래 JSON 구조를 정확히 따르세요. 마크다운 없이 순수 JSON만 출력하세요.

{출력 JSON 스키마 예시}
```

#### 캐릭터별 데이팅 프로필

| 캐릭터 | 말투 | 호감 포인트 | 비호감 포인트 | 성공 임계 호감도 (기본) |
|--------|------|-----------|-------------|---------------------|
| **윤태산** | 반말, 도발적, 짧은 문장 ("...흥", "재밌네") | 대담한 직진, 당당함, 눈 마주침 | 눈치 보기, 빈말, 과도한 칭찬 | 70 |
| **도해결** | 존댓말 베이스, 논리적, 분석적 ("데이터상으로는...", "흥미롭군요") | 논리적 대화, 독립적 태도, 지적 유머 | 감정적 호소, 의존적 태도, 무지 | 65 |
| **서휘윤** | 존댓말, 따뜻함, 이모티콘 뉘앙스 ("~요!", "진짜요?!") | 솔직함, 배려, 일상적 관심 | 건방짐, 무관심, 냉소 | 55 |
| **기지문** | 최소한의 단어, 무뚝뚝 ("...그래", "됐어") | 행동으로 보여주는 성의, 묵묵한 태도, 진정성 | 말만 많은 태도, 가식, 과장 | 65 |
| **최설계** | 비즈니스 톤, 은유적 ("투자 대비 수익률이...", "포트폴리오를 보면") | 전략적 사고, 야망, 위트 있는 말장난 | 무계획, 수동적 태도, 진부함 | 70 |

#### 호감도 시스템 상세

```typescript
// 초기 호감도 = 궁합 점수 / 5 (0~20 범위로 시작)
const initialAffection = Math.round(compatibility / 5);

// 턴별 호감도 누적
let affection = initialAffection;
for (const turn of selectedChoices) {
  affection += turn.choice.affectionDelta;
  affection = Math.max(0, Math.min(100, affection)); // 0~100 클램핑
}

// 판정
const success = affection >= conversationTree.successThreshold;
```

**호감도 변화 가이드라인** (Gemini가 이 범위 내에서 생성):

| 선택 유형 | 캐릭터와 궁합 좋을 때 | 캐릭터와 궁합 나쁠 때 |
|----------|---------------------|---------------------|
| bold (직진) | +15 ~ +20 | -5 ~ +5 |
| witty (위트) | +10 ~ +15 | +0 ~ +8 |
| safe (안전) | +3 ~ +8 | +0 ~ +5 |
| 역효과 선택 | -3 ~ -5 | -5 ~ -10 |

### Step 4. 결과 카드 — 점수표 + 등수 + 팩폭 분석

#### 4-1. 캐릭터가 매긴 점수표 (성공/실패 공통)

```
┌─────────────────────────────────┐
│  윤태산의 채점표                  │
│                                 │
│  매력도:  ██████░░░░  6/10      │
│  대화력:  ████░░░░░░  4/10  ← 최하│
│  센스:    ███████░░░  7/10      │
│  중독성:  ██░░░░░░░░  2/10      │
│                                 │
│  총점: 4.8 / 10                 │
│                                 │
│  "10점 만점에 4.8...             │
│   현실에서도 이 점수면            │
│   2번째 만남은 없어."            │
│                                 │
│  saju-gpt.com                   │
└─────────────────────────────────┘
```

- 4개 항목: 매력도, 대화력, 센스, 중독성
- 각 항목 1~10점 + 프로그레스 바 시각화
- 총점 + 캐릭터의 한 줄 팩폭 코멘트
- **최하점 항목에 화살표(←)** 표시 → "대화력이 제일 낮다니ㅋㅋ" 밈 포인트

#### 4차원 점수 산출 공식 (`calculateScoreTable()`)

```typescript
interface ScoreTable {
  charm: number;         // 매력도 1~10
  conversation: number;  // 대화력 1~10
  sense: number;         // 센스 1~10
  addiction: number;     // 중독성 1~10
  total: number;         // 가중 평균 (소수점 1자리)
  lowestKey: string;     // 최하점 항목 키
}

function calculateScoreTable(
  choices: SelectedChoice[],         // 5턴 선택 결과
  sajuIndicators: SajuIndicators,    // 사주 지표
  affection: number,                 // 최종 호감도
  characterId: string                // 캐릭터 ID
): ScoreTable {
  // 1. 선택지 scoreImpact 누적 (5턴 × 4항목)
  let rawCharm = 0, rawConversation = 0, rawSense = 0, rawAddiction = 0;
  for (const c of choices) {
    rawCharm += c.choice.scoreImpact.charm;
    rawConversation += c.choice.scoreImpact.conversation;
    rawSense += c.choice.scoreImpact.sense;
    rawAddiction += c.choice.scoreImpact.addiction;
  }
  // 범위: 각 -10 ~ +15

  // 2. 사주 보너스 가산
  const sajuBonus = {
    charm: (sajuIndicators.doHwaSal ? 2 : 0) + (sajuIndicators.hongYeomSal ? 1 : 0),
    conversation: (sajuIndicators.insung >= 25 ? 2 : sajuIndicators.insung >= 15 ? 1 : 0),
    sense: (sajuIndicators.siksang >= 25 ? 2 : sajuIndicators.siksang >= 15 ? 1 : 0),
    addiction: (sajuIndicators.fireRatio >= 30 ? 2 : sajuIndicators.fireRatio >= 20 ? 1 : 0),
  };
  // 범위: 각 0 ~ 3

  // 3. 정규화 → 1~10 스케일
  // raw(-10~15) + sajuBonus(0~3) = -10 ~ 18
  // 정규화: (value + 10) / 28 * 9 + 1 → 1 ~ 10
  const normalize = (raw: number, bonus: number) => {
    const combined = raw + bonus;
    const score = Math.round(((combined + 10) / 28 * 9 + 1) * 10) / 10;
    return Math.max(1, Math.min(10, score));
  };

  const charm = normalize(rawCharm, sajuBonus.charm);
  const conversation = normalize(rawConversation, sajuBonus.conversation);
  const sense = normalize(rawSense, sajuBonus.sense);
  const addiction = normalize(rawAddiction, sajuBonus.addiction);

  // 4. 가중 평균 (캐릭터마다 중시하는 항목 다름)
  const weights = CHARACTER_SCORE_WEIGHTS[characterId];
  const total = Math.round(
    (charm * weights.charm +
     conversation * weights.conversation +
     sense * weights.sense +
     addiction * weights.addiction) * 10
  ) / 10;

  // 5. 최하점 항목 식별
  const scores = { charm, conversation, sense, addiction };
  const lowestKey = Object.entries(scores)
    .sort(([,a], [,b]) => a - b)[0][0];

  return { charm, conversation, sense, addiction, total, lowestKey };
}
```

**캐릭터별 가중치** (`CHARACTER_SCORE_WEIGHTS`):

| 캐릭터 | 매력도 | 대화력 | 센스 | 중독성 | 합계 |
|--------|--------|--------|------|--------|------|
| 윤태산 | 0.35 | 0.15 | 0.20 | 0.30 | 1.0 |
| 도해결 | 0.15 | 0.35 | 0.30 | 0.20 | 1.0 |
| 서휘윤 | 0.25 | 0.30 | 0.25 | 0.20 | 1.0 |
| 기지문 | 0.30 | 0.20 | 0.15 | 0.35 | 1.0 |
| 최설계 | 0.20 | 0.25 | 0.35 | 0.20 | 1.0 |

#### 팩폭 코멘트 생성 (Gemini)

결과 판정 후 Gemini에 1회 추가 호출하여 팩폭 코멘트 + 사주 분석을 생성한다.

```typescript
// Edge Function: generate-dating-verdict
interface VerdictRequest {
  characterId: string;
  scoreTable: ScoreTable;
  success: boolean;
  affection: number;
  sajuIndicators: SajuIndicators;
  ilganDescription: string;
  choiceHistory: Array<{ turnNumber: number; choiceType: string }>;
  // 예: [{ turnNumber: 1, choiceType: 'bold' }, ...]
}

interface VerdictResponse {
  // 캐릭터 팩폭 한 줄 (결과 카드 삽입)
  oneLineVerdict: string;
  // 예: "10점 만점에 4.8... 현실에서도 이 점수면 2번째 만남은 없어."

  // 사주 기반 연애 약점 분석 (3~4문장)
  sajuAnalysis: string;
  // 예: "을목일간 특유의 돌려 말하기가 오히려 역효과. ..."

  // 유저가 반복하는 패턴 2가지
  patterns: string[];
  // 예: ["3턴째에 조급해지는 경향", "상대 반응 안 보고 자기 말만"]

  // 등수별 추가 멘트
  rankComment: string;
  // 예: "비슷한 사주를 가진 사람 중에서도 당신이 제일 못했어요."
}
```

**Gemini 팩폭 프롬프트 핵심**:

```
당신은 {characterName}입니다. 방금 데이트 시뮬레이션에서 상대를 평가합니다.

## 평가 결과
- 총점: {total}/10 ({success ? '데이트 승낙' : '데이트 거절'})
- 최하 항목: {lowestKeyKorean} ({lowestScore}점)
- 선택 패턴: {choicePattern}

## 유저 사주
- 일간: {ilganDescription}

## 규칙
1. oneLineVerdict: {characterName}의 말투로, 총점을 언급하면서 현실 연애와 연결하는 팩폭 한 줄 (30자 이내)
2. sajuAnalysis: 일간 성격 → 시뮬레이션에서 드러난 약점 연결 (사주 용어 최소화, 쉬운 말로)
3. patterns: 선택 히스토리에서 유추한 연애 습관 2가지 (구체적 턴 번호 언급)
4. rankComment: 하위권이면 자조적 팩폭, 상위권이면 인정하되 아쉬운 점 하나
5. 톤: 아프지만 웃기게. 진짜 상처가 아니라 "아 맞는데ㅋㅋ" 수준.
```

#### 4-2. 전체 유저 중 등수

```
┌─────────────────────────────────┐
│  전체 도전자 중 당신의 등수       │
│                                 │
│  오늘까지 도전자: 12,847명       │
│  당신의 등수: 11,203등           │
│                                 │
│  상위 87% (하위권)               │
│                                 │
│  "비슷한 사주를 가진 사람 중에서도│
│   당신이 제일 못했어요."         │
│                                 │
│  [재도전] [다른 캐릭터에게 도전]  │
│                                 │
│  saju-gpt.com                   │
└─────────────────────────────────┘
```

- **실시간 누적 도전자 수** 표시 (숫자가 클수록 신뢰감 + "이렇게 많이 했어?" 효과)
- 등수 + 상위 N% 퍼센타일
- 등수가 낮으면 캐릭터의 추가 팩폭 멘트
- 등수가 높으면(상위 10% 이내) "희귀한 재능" 같은 자랑용 뱃지

**등수 계산 SQL** (Edge Function에서 호출):

```sql
-- 1. 현재 유저의 등수 조회 (같은 캐릭터 기준)
SELECT
  rank() OVER (ORDER BY total_score DESC) as user_rank,
  count(*) OVER () as total_count
FROM dating_results
WHERE character_id = $1 AND status = 'completed'
  AND id = $2;

-- 2. 같은 일간 유저 평균 점수
SELECT
  avg(total_score) as same_ilgan_avg,
  count(*) as same_ilgan_count
FROM dating_results
WHERE character_id = $1 AND ilgan = $2 AND status = 'completed';
```

**퍼센타일 뱃지 시스템**:

| 퍼센타일 | 뱃지 | 색상 |
|---------|------|------|
| 상위 1% | "전설의 작업남/녀" | `#FFD700` (금) |
| 상위 5% | "타고난 연애 천재" | `#FF4444` (적) |
| 상위 10% | "희귀한 재능" | `#7A38D8` (보라) |
| 상위 30% | "평균 이상" | `#4488FF` (파랑) |
| 상위 50% | "노력형" | `#44BB44` (초록) |
| 하위 50% | "수련이 필요합니다" | `#888888` (회색) |
| 하위 10% | "읽씹 전문가" | `#FF4444` (적, 자조) |

#### 4-3. 사주 기반 팩폭 분석

```
┌─────────────────────────────────┐
│  사주가 말하는 당신의 연애 약점   │
│                                 │
│  "을목일간 특유의 돌려 말하기가   │
│   오히려 역효과.                 │
│   이 캐릭터는 직진을 좋아합니다.  │
│                                 │
│   당신이 연애에서 무의식적으로    │
│   반복하는 패턴:                 │
│   → 3턴째에 조급해지는 경향      │
│   → 상대 반응 안 보고 자기 말만  │
│                                 │
│   같은 사주 유저의 평균 점수: 5.2 │
│   당신의 점수: 4.8 (평균 이하)   │
│                                 │
│  [이 약점 고치러 가기 →]         │
│  saju-gpt.com                   │
└─────────────────────────────────┘
```

- 사주 일간(日干) 기반 성격 분석 → 대화에서 드러난 패턴과 연결
- 같은 사주 유저 평균 점수와 비교 → 추가 비교 트리거
- CTA: "이 약점 고치러 가기" → 캐릭터 채팅 페이지로 리다이렉트 (`/chat/{characterId}?birthday=...&gender=...`)
- 챗봇은 시뮬레이션 맥락을 이어받지 않음 — 캐릭터의 사주 기반 일반 상담으로 시작
- 유저가 팩폭 분석에서 느낀 궁금증("이 운세 흐름의 약점을 어떻게 바꿔?")을 직접 질문하는 구조

### Step 5. 읽씹 랭킹 보드 (명예의 전당)

```
┌─────────────────────────────────┐
│  이번 주 읽씹 명예의 전당        │
│                                 │
│  최단 탈락                      │
│  1위: 95년생 여 — 1턴 만에 차임  │
│  2위: 98년생 남 — 2턴에서 퇴장   │
│  3위: 00년생 여 — "역대 최악의   │
│       오프닝" 칭호 획득          │
│                                 │
│  레전드 성공                    │
│  1위: 92년생 여 — 3캐릭터 전원   │
│       데이트 성공 (역대 2번째)   │
│  2위: 88년생 남 — 윤태산 데이트  │
│       성공 (성공률 8% 돌파)      │
│                                 │
│  캐릭터별 성공률                 │
│  윤태산: 8%  서휘윤: 23%        │
│  기지문: 15%  도해결: 18%       │
│  최설계: 10%                    │
│                                 │
│  [나도 도전하기]                 │
│  saju-gpt.com                   │
└─────────────────────────────────┘
```

- **최단 탈락 / 레전드 성공** 양극단 모두 전시 → 어느 쪽이든 화제
- 표시 정보: 출생 연도 + 성별만 (개인정보 없음)
- **캐릭터별 성공률** 표시 → "최설계 10%? 도전해볼까" 경쟁심 자극
- 주간/월간 리셋 → 반복 방문 유도

**"최단 탈락" 판정 로직**: 호감도가 특정 턴에서 임계값 이하로 떨어지면 **조기 종료** 가능.

```typescript
// 매 턴 종료 후 체크
const EARLY_EXIT_THRESHOLD = 10; // 호감도 10 이하면 조기 종료

if (affection <= EARLY_EXIT_THRESHOLD && turnNumber < 5) {
  // 캐릭터가 "이쯤에서 그만하죠" 대사 → 즉시 결과로
  earlyExitTurn = turnNumber;
}
```

**랭킹 조회 SQL**:

```sql
-- 주간 최단 탈락 TOP 3
SELECT
  extract(year from birthday)::text as birth_year,
  gender,
  early_exit_turn,
  character_id,
  created_at
FROM dating_results
WHERE status = 'completed'
  AND early_exit_turn IS NOT NULL
  AND created_at >= date_trunc('week', now())
ORDER BY early_exit_turn ASC, total_score ASC
LIMIT 3;

-- 주간 레전드 성공 TOP 3
SELECT
  extract(year from birthday)::text as birth_year,
  gender,
  total_score,
  character_id,
  (SELECT count(DISTINCT dr2.character_id)
   FROM dating_results dr2
   WHERE dr2.birthday = dr.birthday
     AND dr2.gender = dr.gender
     AND dr2.success = true) as success_count,
  created_at
FROM dating_results dr
WHERE status = 'completed'
  AND success = true
  AND created_at >= date_trunc('week', now())
ORDER BY success_count DESC, total_score DESC
LIMIT 3;

-- 캐릭터별 성공률
SELECT
  character_id,
  round(avg(CASE WHEN success THEN 1 ELSE 0 END) * 100) as success_rate
FROM dating_results
WHERE status = 'completed'
GROUP BY character_id;
```

### Step 6. 친구 공유 + 재도전 시스템

#### 6-1. 친구에게 도전장 보내기

결과 카드 모든 화면(성공/실패 공통)에 **친구 공유 CTA 고정**:

```
┌─────────────────────────────────┐
│  당신의 총점: 4.8 / 10          │
│  전체 12,847명 중 11,203등      │
│                                 │
│  [친구한테 도전장 보내기]        │
│  [재도전하기]                   │
│  [캐릭터와 대화 시작하기]        │
│                                 │
└─────────────────────────────────┘
```

**"친구한테 도전장 보내기"** 클릭 시:

```
┌─ 카카오톡 공유 메시지 ──────────┐
│                                 │
│  [OO]이 데이트 시뮬레이션에서    │
│  윤태산한테 4.8점 받았대ㅋㅋ     │
│  12,847명 중 11,203등이래       │
│                                 │
│  너는 몇 점 받을 수 있어?       │
│                                 │
│  [나도 도전하기 →]              │
│                                 │
└─────────────────────────────────┘
```

- 공유 메시지에 **점수 + 등수**가 자동 포함 → 받는 사람 호기심 + 경쟁심
- 도발 톤: "너는 몇 점?" → 안 해볼 수 없음
- 카카오톡 공유 API + 클립보드 복사 + 인스타 스토리 공유 3가지 제공
- 닉네임(선택 입력) 또는 "익명"으로 표시 가능

**공유 링크 구조**:

```
https://sajugpt-viral.vercel.app/dating-sim/{resultId}
```

- `resultId`로 접근 시 → 공유자의 점수/등수가 OG 메타에 포함 (SSR)
- 방문자는 공유자의 결과를 잠깐 보고 → "나도 도전하기" 클릭 → 입력 폼으로

**동적 OG 메타태그** (`/dating-sim/[resultId]/page.tsx`):

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await supabase
    .from('dating_results')
    .select('character_id, total_score, user_rank, total_count')
    .eq('id', params.resultId)
    .single();

  const charName = CHARACTER_MAP[result.character_id].name;

  return {
    title: `${charName}한테 ${result.total_score}점 받음ㅋㅋ | 데이트 시뮬레이션`,
    description: `${result.total_count}명 중 ${result.user_rank}등. 너는 몇 점 받을 수 있어?`,
    openGraph: {
      title: `${charName}한테 ${result.total_score}점 받았대ㅋㅋ`,
      description: `${result.total_count}명 중 ${result.user_rank}등 | 너는 몇 점?`,
      images: [`/api/og/dating-sim/${params.resultId}`], // OG 이미지 동적 생성
    },
  };
}
```

#### 6-2. 재도전 시스템

```
[재도전하기] 클릭 시 선택지:

① 같은 캐릭터에게 재도전
   → "이번엔 다른 선택지로 해볼래"
   → 대화 트리 새로 생성 (Gemini 재호출)

② 다른 캐릭터에게 도전
   → 추천 3명 중 아직 안 해본 캐릭터
   → "윤태산한테 4.8점 받은 당신,
      서휘윤한테는 몇 점일까?"

③ 난이도 올리기 (향후 확장)
   → "최설계 성공률 10% — 도전?"
```

- **재도전 시 이전 점수와 비교** 표시 → "지난번 4.8 → 이번 6.2 ↑1.4" 성장감
- 재도전 횟수 누적 표시 → "3번째 도전" → 집착을 유머로 전환
- 매 도전마다 **대화 트리 새로 생성** → 같은 캐릭터여도 다른 경험

#### 6-3. 친구 결과 비교 카드 (향후 확장)

친구가 도전장 링크로 들어와서 완료하면 **2인 비교 카드 자동 생성**:

```
┌─────────────────────────────────┐
│  데이트 시뮬 배틀 결과           │
│                                 │
│  나         vs        친구      │
│  4.8점                6.2점     │
│  11,203등             4,891등   │
│                                 │
│         완패                    │
│                                 │
│  윤태산: "솔직히 친구가 낫더라.  │
│   네가 부족한 건 센스야."       │
│                                 │
│  [설욕전 신청하기]              │
│  [다른 친구한테 도전장 보내기]   │
│                                 │
│  saju-gpt.com                   │
└─────────────────────────────────┘
```

- 패배 시 캐릭터가 **친구 편을 들어주는 팩폭** → 분노 + 재도전 + 공유 동시 유발
- "설욕전 신청하기" → 같은 캐릭터로 재도전 → **승패가 뒤집힐 때까지 반복**
- 비교 카드 자체도 공유 가능 → "야 나 친구한테 졌다ㅋㅋ" 3차 바이럴

### Step 7. 캐릭터 챗봇 전환 CTA

#### 전환 기술 플로우

CTA 버튼 클릭 시, 캐릭터 채팅 랜딩 페이지로 **생년월일시 + 성별 URL 파라미터**와 함께 리다이렉트한다.

```
CTA 클릭
→ /chat/{characterId}?birthday=199603121400&gender=female
→ 캐릭터가 사주 기반 일반 상담을 시작 (데이트 시뮬레이션 맥락 없음)
→ 유저가 시뮬레이션에서 생긴 호기심을 바탕으로 직접 질문
→ 유저 입력 1회당 350포인트 차감
```

**핵심**: 챗봇은 데이트 시뮬레이션의 대화 맥락을 이어받지 않는다. 캐릭터의 평소 사주 상담 모드로 시작되며, 유저가 시뮬레이션 결과에서 느낀 궁금증("내 운세 흐름의 문제가 뭐야?", "연애운 어떻게 바꿀 수 있어?")을 직접 질문하는 구조다.

**전환 심리**: 시뮬레이션 결과가 보여주는 것은 "운세 흐름의 문제" — 사주(타고난 팔자)는 바꿀 수 없지만, 운세(흘러가는 운의 흐름)는 개운/행동 지침으로 바꿀 수 있다는 인식이 챗봇 전환 동기가 된다.

#### 데이트 성공 시

```
데이트 승낙!

윤태산: "인정할게. 네 사주에서 느껴지는
이 에너지는 진짜야. 오늘 밤 어디서 볼까?"

→ [윤태산과 1:1 대화 시작하기]  ← /chat/yoon?birthday=...&gender=...
→ [친구한테 자랑하기]
→ [다른 캐릭터도 도전하기]
```

- 승리의 흥분 상태에서 **자랑 공유 + 전환** 동시 제공
- **감정 최고조 직후 CTA** 원칙 적용
- 클릭 시 캐릭터 채팅 페이지로 이동, 캐릭터가 사주 기반 일반 상담 시작

#### 데이트 실패 시

```
데이트 거절...

윤태산: "아쉽다. 근데 네 운세 흐름 자체는
나쁘지 않아. 방향만 잡으면 달라질 수 있어."

→ [윤태산에게 직접 물어보기]     ← /chat/yoon?birthday=...&gender=...
→ [다정한 서휘윤에게 상담받기]   ← /chat/seo?birthday=...&gender=...
→ [재도전하기]
→ [친구한테 도전장 보내기]
```

- 실패의 아쉬움 → "운세 흐름의 문제라면 바꿀 수 있지 않을까?" → 챗봇에서 개운법/행동 지침을 물어보는 동기 형성
- **PAS 공식**: 실패(Problem) → 점수표 팩폭으로 운세 흐름의 약점 인식(Agitation) → 캐릭터에게 개운법 질문(Solution)
- 챗봇은 시뮬레이션 맥락 없이 사주 기반 일반 상담으로 시작 — 유저가 궁금한 점을 직접 질문
- 대안 캐릭터도 제시 → 선택지 확장
- **모든 결과 화면에 공유 + 재도전이 항상 노출**

---

## 논란 극대화 요소 정리

| 요소 | 논란 포인트 | 예상 반응 |
|------|-----------|----------|
| **캐릭터가 매긴 점수** | "AI가 사람 연애력에 점수 매겨도 돼?" | "기분 나쁜데 맞아서 더 열받아ㅋㅋ" |
| **전체 유저 등수** | "12,847명 중 11,203등이라고?" | "말도 안 돼 다시 해볼게" → 재도전 |
| **읽씹 랭킹 보드** | "1턴 만에 차인 사람 공개 처형?" | "이게 뭐야ㅋㅋ" + "나도 올라갈까봐 무서워" |
| **캐릭터별 성공률** | "최설계 10%? 거의 불가능이잖아" | "나는 할 수 있다" 도전 욕구 |
| **같은 사주 평균 비교** | "같은 사주인데 나만 못했다고?" | 분노 + 비교 + 재도전 |

---

## 공유 카드 사양

### 결과 카드 (1인용)

- **비율**: 9:16 (인스타 스토리 최적화)
- **내용**: 점수표 4항목 + 총점 + 등수 + 캐릭터 팩폭 한 줄
- **워터마크**: 서비스 URL 하단 고정
- **공유 버튼**: 카카오톡 공유 + 인스타 스토리 + 이미지 저장 + 링크 복사
- **캡처 방식**: `html-to-image` (toPng) — 색기 배틀 동일 패턴

### 결과 카드 React 컴포넌트 구조

```
┌───────────────────────── 9:16 ──┐
│  [캐릭터 아바타]  [캐릭터 이름]  │  ← CharacterAvatar + 이름
│                                 │
│  ──── 채점표 ────              │
│  매력도  ████████░░  8/10      │  ← ScoreBar × 4
│  대화력  ████░░░░░░  4/10 ←최하│
│  센스    ██████░░░░  6/10      │
│  중독성  ███░░░░░░░  3/10      │
│                                 │
│  ──── 총점 ────               │
│      5.3 / 10                  │  ← 큰 폰트
│  "데이트 거절"                  │
│                                 │
│  ──── 등수 ────               │
│  12,847명 중 11,203등           │
│  상위 87%                      │
│  [뱃지: 수련이 필요합니다]       │  ← PercentileBadge
│                                 │
│  ──── 팩폭 ────               │
│  "현실에서도 이 점수면           │
│   2번째 만남은 없어."           │
│                                 │
│  sajugpt-viral.vercel.app      │  ← 워터마크
└─────────────────────────────────┘
```

### 배틀 결과 카드 (2인용, 향후 확장)

- **구조**: 좌우 분할 — 나 vs 친구 점수 비교
- **하단 CTA**: "너도 도전해봐" + 서비스 링크

---

## 기술 요구사항 상세

### Edge Function 아키텍처

**2개의 Edge Function**으로 분리 (기생 시뮬레이션 패턴 따름):

| Edge Function | 호출 시점 | 역할 | 예상 응답시간 |
|---------------|----------|------|-------------|
| `analyze-dating-sim` | Step 1→2 (입력 제출 시) | 사주 API 호출 + 궁합 계산 + 캐릭터 3명 추천 | 3~5초 |
| `generate-dating-conversation` | Step 2→3 (캐릭터 선택 시) | Gemini로 대화 트리 생성 + 결과 판정 + 팩폭 생성 + DB 저장 | 5~8초 |

> **대안 검토**: 대화 트리를 1턴씩 스트리밍 생성하면 응답성은 좋으나, Gemini 5회 호출 비용 + 일관성 문제. MVP는 일괄 생성으로 시작하고, 응답 시간이 문제되면 턴별 생성으로 전환.

#### Edge Function 1: `analyze-dating-sim`

```typescript
// Request
interface AnalyzeDatingSimRequest {
  birthday: string;       // "YYYY-MM-DD"
  birthTime: string;      // "오전 HH:MM" | "오후 HH:MM" | "모름"
  gender: 'male' | 'female';
  calendarType: 'solar' | 'lunar';
  utmSource?: string;
  utmMedium?: string;
}

// Response
interface AnalyzeDatingSimResponse {
  resultId: string;               // UUID (DB 레코드 ID)
  sajuIndicators: SajuIndicators;
  ilgan: string;                  // "을목" 등
  ilganDescription: string;       // "을목일간 — 부드럽고 유연하지만..."
  recommendations: Array<{
    characterId: string;
    characterName: string;
    archetype: string;
    compatibility: number;        // 0~100
    firstImpression: string;      // 사주 조건부 첫인상 대사
    successRate: number;          // 실시간 성공률 (%)
    imagePath: string;
  }>;
}
```

**처리 플로우**:
1. Stargio 사주 API 호출 (재시도 3회, excludeKeys 8개)
2. 사주 응답 → `extractSajuIndicators()` (색기 배틀 동일 로직)
3. 일간(日干) 추출 → `getIlganDescription()`
4. 5캐릭터 궁합 점수 계산 → `calculateCompatibility()` × 5
5. 상위 3명 추천 + 실시간 성공률 조회
6. DB 레코드 생성 (status: 'analyzing')
7. 응답 반환

#### Edge Function 2: `generate-dating-conversation`

```typescript
// Request
interface GenerateConversationRequest {
  resultId: string;
  characterId: string;
  sajuIndicators: SajuIndicators;
  ilganDescription: string;
  compatibility: number;
  gender: 'male' | 'female';
}

// Response (프론트엔드에 전달)
interface GenerateConversationResponse {
  conversationTree: ConversationTree;
  // 프론트엔드가 대화 진행 후 선택 결과를 취합하여
  // finalize-dating-result 엔드포인트로 전송
}
```

**결과 확정은 프론트엔드에서 계산** (서버 재호출 최소화):
- 대화 트리에 각 선택지의 `affectionDelta`와 `scoreImpact`가 이미 포함
- 프론트엔드가 5턴 선택 완료 후 로컬에서 점수 계산
- 계산 결과를 `finalize-dating-result` API로 전송 (DB 업데이트 + 등수 조회 + 팩폭 생성)

#### Edge Function 3: `finalize-dating-result` (결과 확정)

```typescript
// Request
interface FinalizeDatingResultRequest {
  resultId: string;
  characterId: string;
  selectedChoices: Array<{
    turnNumber: number;
    choiceId: string;
    choiceType: 'bold' | 'witty' | 'safe';
  }>;
  finalAffection: number;
  scoreTable: ScoreTable;
  success: boolean;
  earlyExitTurn?: number;   // 조기 종료 시 턴 번호
}

// Response
interface FinalizeDatingResultResponse {
  // 등수
  userRank: number;
  totalCount: number;
  percentile: number;         // 상위 N%
  badgeType: string;          // 퍼센타일 뱃지

  // 같은 일간 비교
  sameIlganAvg: number;
  sameIlganCount: number;

  // Gemini 생성 팩폭
  verdict: VerdictResponse;

  // 공유 URL
  shareUrl: string;           // /dating-sim/{resultId}
}
```

**처리 플로우**:
1. DB 업데이트 (선택 히스토리, 점수, 성공 여부)
2. 등수 계산 (SQL 윈도우 함수)
3. 같은 일간 평균 조회
4. Gemini 팩폭 생성 (1회 호출)
5. DB 최종 업데이트 (status: 'completed')
6. 응답 반환

### DB 스키마

```sql
-- 005_create_dating_results.sql

CREATE TABLE dating_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 유저 입력
  birthday TEXT NOT NULL,              -- "YYYY-MM-DD"
  birth_time TEXT DEFAULT '모름',       -- "오전 HH:MM" | "오후 HH:MM" | "모름"
  gender TEXT NOT NULL,                -- "male" | "female"
  calendar_type TEXT DEFAULT 'solar',  -- "solar" | "lunar"

  -- 사주 분석 결과
  ilgan TEXT,                          -- "을목", "갑목" 등
  saju_indicators JSONB,              -- SajuIndicators 전체
  recommendations JSONB,              -- 추천 3명 [{characterId, compatibility, ...}]

  -- 시뮬레이션 결과
  character_id TEXT,                   -- 선택한 캐릭터 ID
  conversation_tree JSONB,            -- 전체 대화 트리 (Gemini 생성)
  selected_choices JSONB,             -- 유저 선택 히스토리 [{turnNumber, choiceId, choiceType}]
  final_affection INT,                -- 최종 호감도 (0~100)
  success BOOLEAN,                    -- 데이트 성공 여부
  early_exit_turn INT,                -- 조기 종료 턴 (NULL이면 5턴 완주)

  -- 점수
  score_charm NUMERIC,                -- 매력도 (1~10)
  score_conversation NUMERIC,         -- 대화력 (1~10)
  score_sense NUMERIC,                -- 센스 (1~10)
  score_addiction NUMERIC,            -- 중독성 (1~10)
  total_score NUMERIC,                -- 총점 (가중 평균)

  -- 등수 (확정 시 스냅샷)
  user_rank INT,
  total_count INT,
  percentile NUMERIC,                 -- 상위 N%
  same_ilgan_avg NUMERIC,
  same_ilgan_count INT,

  -- Gemini 생성 콘텐츠
  verdict JSONB,                      -- VerdictResponse

  -- 메타
  status TEXT DEFAULT 'analyzing',    -- 'analyzing' | 'conversation' | 'completed'
  attempt_number INT DEFAULT 1,       -- 재도전 횟수
  previous_result_id UUID,            -- 이전 도전 결과 (재도전 시)
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,

  -- 추적
  utm_source TEXT,
  utm_medium TEXT
);

-- 등수 조회 성능 인덱스
CREATE INDEX idx_dating_results_character_score
  ON dating_results(character_id, total_score DESC)
  WHERE status = 'completed';

CREATE INDEX idx_dating_results_ilgan
  ON dating_results(ilgan, character_id)
  WHERE status = 'completed';

CREATE INDEX idx_dating_results_weekly
  ON dating_results(created_at DESC)
  WHERE status = 'completed';

-- RLS 정책: 비회원이므로 anon 키로 INSERT/SELECT 허용
ALTER TABLE dating_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert"
  ON dating_results FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select"
  ON dating_results FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anonymous update own record"
  ON dating_results FOR UPDATE
  TO anon USING (true) WITH CHECK (true);
```

### 컴포넌트 아키텍처

```
src/
├── app/
│   └── dating-sim/
│       ├── page.tsx                    # 메인 (정적 OG)
│       └── [resultId]/
│           └── page.tsx                # 결과 공유 (동적 OG, SSR)
├── components/dating-sim/
│   ├── DatingSimClient.tsx             # 메인 상태머신 (★핵심)
│   ├── DatingLanding.tsx               # 랜딩 화면 ("5턴 안에 데이트 따내기")
│   ├── DatingInput.tsx                 # 입력 폼 (BirthInput 재사용)
│   ├── DatingAnalyzing.tsx             # "사주 분석 중..." 로딩
│   ├── CharacterRecommendation.tsx     # 3명 추천 카드 + 선택
│   ├── CharacterCard.tsx               # 개별 캐릭터 카드 (궁합%, 첫인상, 성공률)
│   ├── DatingConversation.tsx          # 5턴 대화 진행 (★핵심)
│   ├── ConversationTurn.tsx            # 개별 턴 (상황+캐릭터대사+선택지)
│   ├── ChoiceButton.tsx                # 선택지 버튼 (bold/witty/safe 스타일 분리)
│   ├── AffectionGauge.tsx              # 호감도 게이지 (시각적 힌트, 정확한 수치는 비공개)
│   ├── DatingResultCard.tsx            # 결과 카드 (toPng 캡처 대상) (★핵심)
│   ├── ScoreBar.tsx                    # 개별 점수 바 (프로그레스 바 + 점수)
│   ├── PercentileBadge.tsx             # 퍼센타일 뱃지
│   ├── SajuAnalysisCard.tsx            # 사주 팩폭 분석 섹션
│   ├── LeaderboardSection.tsx          # 읽씹 랭킹 보드
│   └── DatingShareButtons.tsx          # 공유 버튼 (카카오/인스타/이미지/링크)
├── constants/
│   └── dating-characters.ts            # 캐릭터 데이팅 프로필 + 가중치 + 첫인상
└── types/
    └── dating.ts                       # 전체 타입 정의
```

#### 상태머신 (`DatingSimClient.tsx`)

```typescript
type DatingStep =
  | 'landing'            // 랜딩 화면
  | 'input'              // 정보 입력
  | 'analyzing'          // 사주 분석 중 (Edge Function 1 호출)
  | 'recommendation'     // 캐릭터 3명 추천
  | 'preparing'          // 대화 준비 중 (Edge Function 2 호출)
  | 'conversation'       // 5턴 대화 진행
  | 'calculating'        // 결과 계산 중 (Edge Function 3 호출)
  | 'result';            // 결과 카드 + 등수 + 팩폭

// 플로우: landing → input → analyzing → recommendation → preparing → conversation → calculating → result
// 재도전: result → recommendation (같은 사주 데이터 재사용) → preparing → ...
```

### 사주 API 연동

색기 배틀과 **동일한 사주 API 호출 로직** 재사용:

```typescript
// 공통 모듈: supabase/functions/server/saju-api.ts
export async function fetchSajuData(
  birthday: string,
  birthTime: string,
  gender: string,
  calendarType: string
): Promise<SajuApiResponse> {
  // Stargio API 호출 (SAJU_API_KEY + 브라우저 헤더)
  // 재시도 3회 (1초, 2초 간격)
  // excludeKeys 8개로 경량화
}

export function extractSajuIndicators(sajuData: SajuApiResponse): SajuIndicators {
  // 도화살, 홍염살, 편관, 상관, 식신, 화기 등 추출
  // 색기 배틀의 기존 로직 그대로
}
```

### 일간(日干) 성격 매핑

```typescript
const ILGAN_PROFILES: Record<string, { name: string; description: string; datingStyle: string }> = {
  '갑목': {
    name: '갑목일간',
    description: '곧고 강한 나무처럼 리더십이 강하고 자존심이 높음',
    datingStyle: '직진형. 관심 있으면 드러내지만, 자존심 때문에 먼저 고백은 어려움'
  },
  '을목': {
    name: '을목일간',
    description: '덩굴처럼 유연하고 적응력이 뛰어나지만 돌려 말하는 경향',
    datingStyle: '은근 어필형. 돌려 말해서 상대가 모를 수 있음. 눈치 게임 선호'
  },
  '병화': {
    name: '병화일간',
    description: '태양처럼 밝고 열정적이며 사교적',
    datingStyle: '불꽃 직진형. 관심 있으면 모두가 알 정도로 티가 남. 식을 때도 빠름'
  },
  '정화': {
    name: '정화일간',
    description: '촛불처럼 따뜻하지만 섬세하고 내면이 깊음',
    datingStyle: '은밀한 로맨티스트. 겉으론 담담하지만 속으론 불타오르는 타입'
  },
  '무토': {
    name: '무토일간',
    description: '산처럼 듬직하고 포용력이 넓지만 느린 편',
    datingStyle: '슬로우 스타터. 친해지는 데 시간이 걸리지만 한번 빠지면 깊음'
  },
  '기토': {
    name: '기토일간',
    description: '정원처럼 섬세하고 잘 가꾸지만 걱정이 많음',
    datingStyle: '완벽 준비형. 고백 전 시뮬레이션 100번 돌려보는 타입'
  },
  '경금': {
    name: '경금일간',
    description: '바위처럼 단단하고 결단력이 있지만 융통성이 부족',
    datingStyle: '원칙주의자. "좋으면 좋고 싫으면 싫다" 확실한 편'
  },
  '신금': {
    name: '신금일간',
    description: '보석처럼 예민하고 완벽주의적이며 날카로운 감각',
    datingStyle: '감각파. 분위기, 패션, 말투 하나하나 채점하며 높은 기준을 가짐'
  },
  '임수': {
    name: '임수일간',
    description: '바다처럼 깊고 넓으며 자유로운 영혼',
    datingStyle: '자유연애파. 깊은 대화를 좋아하지만 구속은 질색'
  },
  '계수': {
    name: '계수일간',
    description: '비처럼 조용하고 직관적이며 감성이 풍부',
    datingStyle: '감성 폭발형. 분위기에 취하면 올인, 현실감각은 나중'
  },
};
```

### 결과 카드 생성

색기 배틀의 `ResultCard.tsx` 패턴 따름:

```typescript
// html-to-image (toPng) 사용
import { toPng } from 'html-to-image';

const captureResultCard = async (ref: HTMLDivElement): Promise<string> => {
  const dataUrl = await toPng(ref, {
    width: 1080,    // 9:16 = 1080×1920
    height: 1920,
    pixelRatio: 2,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  });
  return dataUrl;
};
```

### Edge Function 배포 명령어

```bash
# 분석 함수
npx supabase functions deploy analyze-dating-sim --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx

# 대화 생성 함수
npx supabase functions deploy generate-dating-conversation --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx

# 결과 확정 함수
npx supabase functions deploy finalize-dating-result --no-verify-jwt --project-ref tdrmvbsmxcewwaeuoqdx
```

### Edge Function Secrets (Supabase 대시보드)

기존과 동일:
- `SAJU_API_KEY`: Stargio 사주 API
- `GOOGLE_API_KEY`: Gemini 2.5 Flash

---

## KPI

| 단계 | 지표 | 목표 |
|------|------|------|
| **유입** | 랜딩 페이지 방문 수 | 일 1,000+ |
| **완료** | 5턴 대화 완료율 | 80%+ |
| **공유** | 결과 카드 공유 수 / 완료 수 | 30%+ |
| **재도전** | 재도전율 (같은 유저) | 40%+ |
| **전환** | CTA 클릭 → 챗봇 페이지 이동 | 15%+ |
| **과금** | 챗봇 페이지 이동 → 유료 대화 시작 | 5%+ |

---

## 향후 확장

| 확장 기능 | 설명 |
|----------|------|
| **1:1 배틀** | 친구 초대 → 두 사람 점수 비교 결과 카드 → 강제 2인 루프 |
| **캐릭터 뒷담** | 5턴 후 추천된 3캐릭터가 유저에 대해 대화하는 장면 공개 |
| **난이도 모드** | 이지(서휘윤 28%) → 하드(최설계 10%) → 지옥(숨겨진 캐릭터 0.5%) |
| **시즌제** | 월간 새 캐릭터 추가 + 랭킹 리셋 → 반복 방문 |
| **성공자 전용 콘텐츠** | 데이트 성공 시 캐릭터의 특별 메시지/이미지 언락 → 희소성 |
| **턴별 스트리밍** | Gemini 턴별 호출로 전환 → 대화 자연스러움 개선 (비용 증가 트레이드오프) |

---

**최종 업데이트**: 2026-03-30
