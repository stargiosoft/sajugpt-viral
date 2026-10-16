import {
  handleCorsPreflightRequest,
  jsonResponse,
  errorResponse,
} from "../server/cors.ts";

// ─── 타입 정의 ──────────────────────────────────────────

type Gender = "male" | "female";
type CalendarType = "solar" | "lunar";
type UnknownRecord = Record<string, unknown>;

interface RequestBody {
  birthday?: string;
  birthDate?: string;
  gender: Gender;
  birthTime?: string;
  birthTimeUnknown?: boolean;
  unknownTime?: boolean;
  calendarType?: CalendarType;
  calendar?: CalendarType;
  lunar?: boolean;
}

interface DaewoonResult {
  age: number;
  currentPeriod: string;
  nextPeriod: string;
  currentGanji: string;
  nextGanji: string;
  currentSipseong: string;
  nextSipseong: string;
  nextStartYear: number | null;
  afterNextStartYear: number | null;
  beforeFirst: boolean;
}

// ─── 공통 유틸 ─────────────────────────────────────────

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function flattenStrings(value: unknown, depth = 0): string[] {
  if (depth > 8 || value == null) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (typeof value === "number") return [String(value)];
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenStrings(item, depth + 1));
  }
  if (isRecord(value)) {
    return Object.values(value).flatMap((item) => flattenStrings(item, depth + 1));
  }
  return [];
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function pathValue(source: unknown, path: string[]): unknown {
  let current = source;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

// ─── 입력 데이터 정규화 ────────────────────────────────

function normalizeBirthday(value: string): string {
  if (!value) throw new Error("생년월일을 입력해 주세요.");
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) {
    throw new Error("생년월일 8자리를 정확하게 입력해 주세요. (예: 19950815)");
  }
  const dateDigits = digits.slice(0, 8);
  const year = Number(dateDigits.slice(0, 4));
  const month = Number(dateDigits.slice(4, 6));
  const day = Number(dateDigits.slice(6, 8));

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    throw new Error("올바른 생년월일을 입력해 주세요.");
  }
  return dateDigits;
}

function normalizeBirthTime(value?: string): string {
  if (!value) return "";
  const input = value.trim();
  if (!input || input === "모름" || input.toLowerCase() === "unknown") {
    return "";
  }
  const koreanTime = input.match(/^(오전|오후)\s*(\d{1,2}):(\d{2})$/);
  let hour: number;
  let minute: number;

  if (koreanTime) {
    hour = Number(koreanTime[2]);
    minute = Number(koreanTime[3]);
    if (hour < 1 || hour > 12 || minute > 59) {
      throw new Error("태어난 시각을 확인해 주세요.");
    }
    if (koreanTime[1] === "오후" && hour < 12) hour += 12;
    if (koreanTime[1] === "오전" && hour === 12) hour = 0;
  } else {
    const digits = input.replace(/\D/g, "");
    if (digits.length !== 3 && digits.length !== 4) {
      throw new Error("태어난 시각을 확인해 주세요.");
    }
    hour = Number(digits.slice(0, -2));
    minute = Number(digits.slice(-2));
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error("태어난 시각을 확인해 주세요.");
    }
  }
  return String(hour).padStart(2, "0") + String(minute).padStart(2, "0");
}

// ─── 십성 / 오행 문구 ──────────────────────────────────

const SIPSEONG_LIST = [
  "비견", "겁재", "식신", "상관", "편재",
  "정재", "편관", "정관", "편인", "정인",
];

// current: 지금 그 대운에 있을 때 / next: 그 대운으로 넘어갈 때
const SIPSEONG_TEXT: Record<string, { current: string; next: string }> = {
  비견: {
    current: "나와 같은 기운이 힘을 실어주는 시기예요. 내 방식에 대한 확신은 커지지만, 혼자 끌고 가려다 지치기 쉬워서 비슷한 처지의 동료와 나눠 지는 쪽이 잘 풀려요.",
    next: "자기 주관이 단단해지고 독립하려는 마음이 커지는 흐름으로 넘어가요.",
  },
  겁재: {
    current: "경쟁과 비교가 많아지는 시기예요. 주변이 앞서가는 것처럼 보여 조급해지기 쉽지만, 이 경쟁심이 오히려 실력을 끌어올리는 연료가 돼요.",
    next: "승부욕과 추진력이 강해지고, 사람 사이의 경쟁도 함께 늘어나는 흐름이에요.",
  },
  식신: {
    current: "내 안에 있는 걸 꺼내 표현하고 만들어내는 힘이 살아나는 시기예요. 결과가 바로 보이지 않아도 꾸준히 쌓은 작업물이 나중에 큰 자산이 돼요.",
    next: "표현력과 재능이 드러나고 먹고 사는 문제가 한결 여유로워지는 흐름이에요.",
  },
  상관: {
    current: "기존 틀이 답답하게 느껴지고 새로운 방식을 시도하고 싶어지는 시기예요. 말과 아이디어가 날카로워지니, 불만을 쏟기보다 대안을 만들어 내밀 때 인정받아요.",
    next: "기존 규칙에 질문을 던지고 나만의 방식을 만들게 되는 흐름이에요.",
  },
  편재: {
    current: "기회와 돈의 움직임이 커지는 시기예요. 활동 반경이 넓어지고 사람을 통한 기회가 늘지만, 벌여놓은 일이 많아지니 우선순위를 정하는 게 중요해요.",
    next: "활동 범위가 크게 넓어지고 큰 기회가 오가는 흐름이에요.",
  },
  정재: {
    current: "성실하게 쌓은 것이 현실적인 결과로 돌아오는 시기예요. 화려하진 않지만 안정적인 수입과 신뢰가 만들어지니, 꾸준함이 가장 큰 무기예요.",
    next: "생활이 안정되고 노력한 만큼 확실하게 돌려받는 흐름이에요.",
  },
  편관: {
    current: "압박과 책임이 크게 느껴지는 시기예요. 지금 막혀 있다는 느낌은 이 압박에서 오는 경우가 많고, 버텨내면 그만큼 단단한 실력과 직책으로 돌아와요.",
    next: "책임과 도전이 커지는 흐름이에요. 힘들지만 한 단계 올라서게 만드는 시기예요.",
  },
  정관: {
    current: "조직과 규칙 안에서 평가받고 자리를 잡아가는 시기예요. 인정받으려면 눈에 띄는 한 방보다 신뢰를 쌓는 방식이 맞고, 안정적인 자리를 얻기 좋아요.",
    next: "역할과 자리가 분명해지고 사회적으로 인정받기 좋은 흐름이에요.",
  },
  편인: {
    current: "생각이 깊어지고 한 가지에 몰입하게 되는 시기예요. 남들이 안 가는 분야를 파고들면 강점이 되지만, 생각만 길어지고 실행이 늦어질 수 있어요.",
    next: "독특한 분야에 관심이 생기고 배움과 연구에 몰입하게 되는 흐름이에요.",
  },
  정인: {
    current: "배우고 도움을 받으면서 내실을 다지는 시기예요. 자격이나 공부, 윗사람의 지원이 힘이 되니, 지금은 쌓는 쪽에 시간을 쓰는 게 맞아요.",
    next: "배움과 귀인의 도움을 받으며 마음이 안정되는 흐름이에요.",
  },
};

const FALLBACK_TEXT = {
  current: "지금 가진 환경 안에서 실마리를 찾아 차분히 역량을 키워가는 시기예요.",
  next: "점진적인 흐름의 전환과 함께 새로운 선택지가 열리는 흐름이에요.",
};

const OHAENG_ACTION: Record<string, string> = {
  목: "새로운 걸 배우고 시작하는 쪽에 힘이 실려요. 관심 가는 분야의 작은 프로젝트 하나를 지금 시작해 보세요.",
  화: "사람들 앞에 나서고 표현할수록 운이 열려요. 내 작업이나 생각을 공개적으로 한 번 내보여 보세요.",
  토: "한 곳에 뿌리를 내리고 꾸준히 쌓을수록 유리해요. 매일 하는 작은 루틴 하나를 정하고 이어가 보세요.",
  금: "정리하고 결단할수록 흐름이 풀려요. 미뤄둔 결정이나 정리해야 할 관계, 일부터 하나 끝내 보세요.",
  수: "정보와 사람 사이를 오가며 유연하게 움직일 때 기회가 와요. 평소 만나지 않던 사람 한 명에게 먼저 연락해 보세요.",
};

// 대운순서십성은 [천간십성, 지지십성] 쌍 → 천간(첫 번째 값) 기준으로 읽는다
function findSipseong(value: unknown): string {
  for (const item of flattenStrings(value)) {
    const hit = SIPSEONG_LIST.find((name) => item.includes(name));
    if (hit) return hit;
  }
  return "";
}

function findOhaeng(value: unknown): string {
  const text = flattenStrings(value)[0] ?? "";
  const map: Array<[string, string[]]> = [
    ["목", ["목", "木"]],
    ["화", ["화", "火"]],
    ["토", ["토", "土"]],
    ["금", ["금", "金"]],
    ["수", ["수", "水"]],
  ];
  for (const [name, keys] of map) {
    if (keys.some((k) => text.includes(k))) return name;
  }
  return "";
}

function strengthSentence(strength: string): string {
  if (!strength) return "";
  if (strength.includes("극신강")) {
    return " 타고난 기운이 아주 센 사주라서, 밀어붙이는 힘은 충분하니 주변 의견을 듣는 여유가 오히려 운을 키워줘요.";
  }
  if (strength.includes("신강")) {
    return " 원래 자기 기운이 센 사주라서, 힘을 쓸 곳만 제대로 정하면 추진력이 크게 살아나요.";
  }
  if (strength.includes("극신약")) {
    return " 타고난 기운이 많이 여린 사주라서, 혼자 버티기보다 믿을 만한 사람과 안정된 환경에 기대는 게 훨씬 중요해요.";
  }
  if (strength.includes("신약")) {
    return " 원래 주변 영향을 많이 받는 사주라서, 환경과 함께하는 사람을 고르는 게 특히 중요해요.";
  }
  if (strength.includes("중화")) {
    return " 기운이 한쪽으로 쏠리지 않은 균형 잡힌 사주라서, 상황에 맞춰 유연하게 움직이기 좋아요.";
  }
  return "";
}

// ─── 대운 분석 (현재 나이 기준) ─────────────────────────

function getDaewoon(raw: UnknownRecord, birthYear: number): DaewoonResult {
  const items = Array.isArray(raw["대운순서"]) ? (raw["대운순서"] as unknown[]) : [];
  const sips = Array.isArray(raw["대운순서십성"]) ? (raw["대운순서십성"] as unknown[]) : [];

  // 나이: Stargio가 주는 값 우선, 없으면 한국 나이로 계산
  const apiAge = Number(getString(raw["나이"]));
  const age =
    Number.isFinite(apiAge) && apiAge > 0
      ? apiAge
      : new Date().getFullYear() - birthYear + 1;

  // 대운시작나이: 숫자 하나(첫 대운 시작 나이) 또는 배열 둘 다 대응
  const rawStart = raw["대운시작나이"];
  const startList = Array.isArray(rawStart) ? rawStart.map(Number) : [];
  const firstStart = Array.isArray(rawStart)
    ? Number(rawStart[0])
    : Number(getString(rawStart));

  const startAgeOf = (i: number): number | null => {
    if (startList.length > 1 && Number.isFinite(startList[i])) return startList[i];
    if (Number.isFinite(firstStart)) return firstStart + 10 * i;
    return null;
  };

  if (items.length === 0 || startAgeOf(0) === null) {
    return {
      age,
      currentPeriod: "",
      nextPeriod: "",
      currentGanji: "운의 흐름",
      nextGanji: "변화의 흐름",
      currentSipseong: "",
      nextSipseong: "",
      nextStartYear: null,
      afterNextStartYear: null,
      beforeFirst: false,
    };
  }

  // 현재 나이가 속한 대운 인덱스 (첫 대운 시작 전이면 -1)
  let idx = -1;
  for (let i = 0; i < items.length; i++) {
    const s = startAgeOf(i);
    if (s !== null && s <= age) idx = i;
  }

  const beforeFirst = idx === -1;
  const nextIdx = Math.min(idx + 1, items.length - 1);
  const afterIdx = idx + 2 < items.length ? idx + 2 : -1;

  const nextStart = startAgeOf(nextIdx);
  const afterStart = afterIdx >= 0 ? startAgeOf(afterIdx) : null;

  // 한국 나이 기준: 시작 연도 = 출생연도 + 나이 - 1
  const toYear = (a: number | null) => (a === null ? null : birthYear + a - 1);

  const currentStart = beforeFirst ? null : startAgeOf(idx);

  console.log(
    `[Daewoon] age=${age}, firstStart=${firstStart}, idx=${idx}, current=${beforeFirst ? "(대운 전)" : getString(items[idx])}, next=${getString(items[nextIdx])}`,
  );

  return {
    age,
    currentPeriod:
      currentStart !== null ? `${currentStart}세~${currentStart + 9}세` : "첫 대운 시작 전",
    nextPeriod: nextStart !== null ? `${nextStart}세~${nextStart + 9}세` : "",
    currentGanji: beforeFirst ? "대운 시작 전" : getString(items[idx]),
    nextGanji: getString(items[nextIdx]),
    currentSipseong: beforeFirst ? "" : findSipseong(sips[idx]),
    nextSipseong: findSipseong(sips[nextIdx]),
    nextStartYear: toYear(nextStart),
    afterNextStartYear: toYear(afterStart),
    beforeFirst,
  };
}

// ─── 귀인 및 세운 분석 ───────────────────────────────────

function findHelperEvidence(raw: UnknownRecord): string[] {
  const helperText = raw["천을귀인"] || pathValue(raw, ["본사주", "천을귀인"]);
  const otherShinsal = raw["기타신살"] || raw["12신살"];

  return unique([
    ...flattenStrings(helperText),
    ...flattenStrings(otherShinsal).filter(
      (item) => typeof item === "string" && (item.includes("귀인") || item.includes("천을")),
    ),
  ]).slice(0, 5);
}

function extractUsefulYears(raw: UnknownRecord): number[] {
  const years = new Set<number>();
  const currentYear = new Date().getFullYear();

  function walk(node: unknown, depth = 0): void {
    if (depth > 6 || node == null) return;
    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, depth + 1));
      return;
    }
    if (!isRecord(node)) return;

    for (const [key, child] of Object.entries(node)) {
      const keyMatches = key.match(/(?:19|20|21)\d{2}/g);
      for (const m of keyMatches ?? []) {
        const y = Number(m);
        if (y >= currentYear && y <= currentYear + 15) years.add(y);
      }
      if (typeof child === "string") {
        const childMatches = child.match(/(?:19|20|21)\d{2}/g);
        for (const m of childMatches ?? []) {
          const y = Number(m);
          if (y >= currentYear && y <= currentYear + 15) years.add(y);
        }
      }
      walk(child, depth + 1);
    }
  }

  walk(raw["세운"]);

  if (years.size === 0) {
    years.add(currentYear + 1);
    years.add(currentYear + 3);
  }

  return [...years].sort((a, b) => a - b).slice(0, 3);
}

// ─── Stargio API 호출 ──────────────────────────────────

const BROWSER_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8",
  "Cache-Control": "no-cache",
  Origin: "https://nadaunse.com",
  Referer: "https://nadaunse.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
};

async function fetchStargio(
  birthday: string,
  gender: Gender,
  birthTime: string,
  birthTimeUnknown: boolean,
  calendarType: CalendarType,
): Promise<UnknownRecord> {
  const apiKey = Deno.env.get("SAJU_API_KEY")?.trim();
  if (!apiKey) throw new Error("서버에 SAJU_API_KEY가 설정되어 있지 않습니다.");

  const time = birthTimeUnknown ? "" : normalizeBirthTime(birthTime);
  const apiBirthday = birthday + (time || "1200");

  const url = new URL("https://service.stargio.co.kr:8400/StargioSaju");
  url.searchParams.set("birthday", apiBirthday);
  url.searchParams.set("lunar", String(calendarType === "lunar"));
  url.searchParams.set("gender", gender);
  url.searchParams.set("apiKey", apiKey);

  console.log(`[Stargio request] birthday=${apiBirthday}, lunar=${calendarType === "lunar"}, gender=${gender}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(20000),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Stargio HTTP ${response.status}: ${responseText.slice(0, 300)}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Stargio 응답이 올바른 JSON 형식이 아닙니다.");
  }

  if (!isRecord(parsed)) {
    throw new Error("Stargio 응답 데이터 형식이 올바르지 않습니다.");
  }

  return parsed;
}

// ─── 분석 결과 조합 ────────────────────────────────────

function analyze(raw: UnknownRecord, birthYear: number) {
  const sajuStrength = getString(raw["사주강약"] || raw["격구분"]);
  const daewoon = getDaewoon(raw, birthYear);
  const helperEvidence = findHelperEvidence(raw);
  const currentYear = new Date().getFullYear();

  const currentText = SIPSEONG_TEXT[daewoon.currentSipseong] ?? FALLBACK_TEXT;
  const nextText = SIPSEONG_TEXT[daewoon.nextSipseong] ?? FALLBACK_TEXT;

  // ── 01 현재 흐름
  let currentTitle: string;
  let currentDescription: string;
  if (daewoon.beforeFirst) {
    currentTitle = "본격적인 대운이 시작되기 전, 준비의 시기";
    currentDescription =
      `아직 첫 대운이 열리기 전이라 타고난 원국의 힘으로 움직이는 때예요. 다음 대운(${daewoon.nextPeriod})이 시작되기 전까지 기초 체력을 쌓아두는 게 유리해요.`;
  } else {
    currentTitle = daewoon.currentSipseong
      ? `${daewoon.currentGanji} 대운 · ${daewoon.currentSipseong}의 시기`
      : `${daewoon.currentGanji} 흐름의 시기`;
    currentDescription = currentText.current + strengthSentence(sajuStrength);
  }

  // ── 02 귀인
  let helperTitle = "주변의 새로운 인연과 협업의 기회";
  let helperDescription = "서로의 관점을 넓혀주고 성장을 이끌어주는 인연이 다가올 수 있어요.";
  if (helperEvidence.length > 0) {
    helperTitle = "귀인 및 협력의 기운이 감지돼요.";
    helperDescription = `사주 원국에 ${helperEvidence[0]} 같은 요소가 있어서 어려운 순간에 도움을 받을 가능성이 있어요.`;
  }

  // ── 03 전환점: 다음 대운이 시작되는 해
  const fallbackYears = extractUsefulYears(raw);
  const turningYears = [daewoon.nextStartYear, daewoon.afterNextStartYear]
    .filter((y): y is number => typeof y === "number" && y >= currentYear)
    .slice(0, 2);
  const years = turningYears.length > 0 ? turningYears : fallbackYears;

  const turningPointTitle = `${years[0]}년 전후의 변화 지점`;
  const turningPointDescription =
    daewoon.nextGanji && daewoon.nextPeriod
      ? `${daewoon.nextPeriod}에 ${daewoon.nextGanji} 대운으로 넘어가요. ${nextText.next}`
      : nextText.next;

  // ── 행동 제안: 용신 오행 기반
  // 용신오행은 { 용신: [..], 희신: [..], 기신: [..] } 객체
  const yongshinRaw = raw["용신오행"];
  const yongshinValue = isRecord(yongshinRaw) ? yongshinRaw["용신"] : (yongshinRaw ?? raw["용신"]);
  const yongshinOhaeng = findOhaeng(yongshinValue);
  const gisinList = isRecord(yongshinRaw)
    ? unique(flattenStrings(yongshinRaw["기신"]).map((v) => findOhaeng(v)))
    : [];

  const baseAction =
    OHAENG_ACTION[yongshinOhaeng] ??
    "지금 떠오르는 아이디어나 작은 목표를 기록하고, 가볍게 시도해 보세요. 작은 실행이 큰 변화의 시작점이 돼요.";
  const action =
    gisinList.length > 0
      ? `${baseAction} 반대로 ${gisinList.join("·")} 기운이 과하게 몰리는 환경은 힘이 빠질 수 있으니 거리를 두세요.`
      : baseAction;

  return {
    title: "내 인생의 반전은 언제 시작될까?",
    summary: daewoon.beforeFirst
      ? "대운이 열리기 전, 준비하는 만큼 달라지는 시기예요."
      : `${daewoon.currentGanji} 대운 속에서 ${years[0]}년 전후의 전환점을 준비해 보세요.`,
    current: {
      title: currentTitle,
      description: currentDescription,
      period: daewoon.currentPeriod,
      sajuStrength,
    },
    helper: {
      title: helperTitle,
      description: helperDescription,
      evidence: helperEvidence,
    },
    turningPoint: {
      title: turningPointTitle,
      description: turningPointDescription,
      years,
      nextPeriod: daewoon.nextPeriod,
      nextGanji: daewoon.nextGanji,
    },
    action,
  };
}

// ─── Edge Function 진입점 ──────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCorsPreflightRequest(req);
  if (req.method !== "POST") return errorResponse(req, "POST 요청만 허용됩니다.", 405);

  try {
    const body = (await req.json()) as RequestBody;
    const gender = body.gender;
    const birthdayInput = body.birthDate || body.birthday || "";
    const birthTimeUnknown = body.birthTimeUnknown ?? body.unknownTime ?? false;
    const calendarType: CalendarType =
      body.calendarType ?? body.calendar ?? (body.lunar === true ? "lunar" : "solar");

    if (!birthdayInput || !gender) {
      return errorResponse(req, "생년월일과 성별은 필수 입력 사항입니다.", 400);
    }

    const birthday = normalizeBirthday(birthdayInput);
    const birthTime = birthTimeUnknown ? "" : normalizeBirthTime(body.birthTime);

    console.log(
      `[Target Birth] normalized birthday: ${birthday}, gender: ${gender}, calendar: ${calendarType}`,
    );

    const raw = await fetchStargio(birthday, gender, birthTime, birthTimeUnknown, calendarType);

    // 구조 확인용 로그
    console.log("[대운순서]", JSON.stringify(raw["대운순서"]));
    console.log("[대운시작나이]", JSON.stringify(raw["대운시작나이"]));
    console.log("[대운순서십성]", JSON.stringify(raw["대운순서십성"]));
    console.log("[나이/만나이]", JSON.stringify([raw["나이"], raw["만나이"]]));
    console.log("[사주강약]", JSON.stringify(raw["사주강약"]));
    console.log("[용신오행]", JSON.stringify(raw["용신오행"]));

    const result = analyze(raw, Number(birthday.slice(0, 4)));

    return jsonResponse(req, {
      success: true,
      resultId: crypto.randomUUID(),
      result,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "분석 중 오류가 발생했습니다.";
    console.error("[analyze-life-turningpoint] 처리 실패:", message);
    return errorResponse(req, message, 500);
  }
});