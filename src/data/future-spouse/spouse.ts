export interface SpouseBranchInfo {
  element: '木' | '火' | '土' | '金' | '水';
  summary: string;
  personality: string;
  appearance: string;
}

export const ELEMENT_EMOJI: Record<string, string> = {
  木: '🌳',
  火: '🔥',
  土: '⛰️',
  金: '⚔️',
  水: '🌊',
};

// 12지지(日支) 기반 배우자 기본 성향
export const SPOUSE_BRANCH_DATA: Record<string, SpouseBranchInfo> = {
  子: {
    element: '水',
    summary: '조용하지만 생각이 깊고 지혜로운 사람',
    personality: '말보다는 행동과 깊은 배려로 신뢰를 쌓는 타입이에요. 감수성이 풍부하고 상대방의 마음을 잘 읽어냅니다.',
    appearance: '차분하고 정돈된 스타일, 유연하고 개방적인 태도',
  },
  丑: {
    element: '土',
    summary: '든든하고 묵묵하게 자기 자리를 지키는 사람',
    personality: '책임감이 강하고 우직하여 곁에 있는 것만으로도 큰 안정감을 줍니다. 신중하고 실속을 챙기는 타입이에요.',
    appearance: '단정하고 신뢰감을 주는 안정적인 스타일',
  },
  寅: {
    element: '木',
    summary: '차분하지만 자기 분야에서는 확실한 사람',
    personality: '생동감 넘치고 주관이 뚜렷하며, 새로운 일에 도전하는 것을 두려워하지 않는 매력적인 타입이에요.',
    appearance: '생기 있고 리더십 있는 분위기, 밝은 인상',
  },
  卯: {
    element: '木',
    summary: '상냥하고 감각이 뛰어난 따뜻한 사람',
    personality: '대화가 잘 통하며 세심한 배려심을 갖추고 있습니다. 예술적 감각이나 유연한 사고방식을 지녔습니다.',
    appearance: '부드럽고 친근한 매력, 세련되고 감각적인 코디',
  },
  辰: {
    element: '土',
    summary: '포용력이 넓고 스케일이 큰 포근한 사람',
    personality: '마음이 깊고 상황을 넓게 바라보는 여유가 있습니다. 묵묵히 든든한 조력자 역할을 해주는 타입이에요.',
    appearance: '여유 있고 호탕한 인상, 편안한 느낌',
  },
  巳: {
    element: '火',
    summary: '열정적이고 열린 마음을 가진 예의 바른 사람',
    personality: '자기표현에 솔직하고 명확하며, 주변 사람들에게 긍정적이고 밝은 에너지를 전달해 주는 타입이에요.',
    appearance: '화려하고 세련된 분위기, 눈에 띄는 매력',
  },
  午: {
    element: '火',
    summary: '밝고 적극적이며 활력이 넘치는 사람',
    personality: '솔직하고 뒤끝이 없으며, 함께 있으면 시간 가는 줄 모를 정도로 유쾌하고 에너지 넘치는 관계를 이끕니다.',
    appearance: '당당하고 뚜렷한 이목구비, 활기찬 스타일',
  },
  未: {
    element: '土',
    summary: '부드럽고 꼼꼼하며 속정이 깊은 사람',
    personality: '온화하고 친절하지만 내면에는 자신만의 기준과 고집이 있어 믿음직스러운 모습을 보여줍니다.',
    appearance: '따뜻하고 차분한 인상, 포근한 이미지',
  },
  申: {
    element: '金',
    summary: '재치 있고 순발력이 뛰어난 스마트한 사람',
    personality: '두뇌 회전이 빠르고 현실적인 문제 해결 능력이 뛰어납니다. 위트와 센스가 넘치는 타입이에요.',
    appearance: '깔끔하고 도시적인 지적 매력',
  },
  酉: {
    element: '金',
    summary: '깔끔하고 자기 기준이 확실한 섬세한 사람',
    personality: '완벽주의적인 성향이 있어 자기 관리에 철저하며, 약속과 신의를 매우 중요하게 생각합니다.',
    appearance: '선이 고운 단정한 미형, 깔끔하고 정돈된 인상',
  },
  戌: {
    element: '土',
    summary: '의리가 있고 끝까지 곁을 지켜주는 성실한 사람',
    personality: '한번 인연을 맺으면 변함없이 진실한 태도를 유지합니다. 계산 없이 진심을 다해주는 타입이에요.',
    appearance: '믿음직스럽고 진중한 분위기, 안정감 있는 외모',
  },
  亥: {
    element: '水',
    summary: '유연하고 유머러스하며 마음이 깊은 사람',
    personality: '사람을 편안하게 해주는 매력이 있으며, 포용력이 넓고 대화할수록 깊은 매력이 드러납니다.',
    appearance: '선해 보이는 인상, 편안하고 온화한 인상',
  },
};