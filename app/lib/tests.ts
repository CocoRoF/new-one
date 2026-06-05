// 모든 문항은 실제 학술 심리 검사에 근거함.
//
// - TIPI: Gosling, S. D., Rentfrow, P. J., & Swann, W. B. (2003).
//   A very brief measure of the Big-Five personality domains.
//   Journal of Research in Personality, 37(6), 504–528.
// - ECR-S: Wei, M., Russell, D. W., Mallinckrodt, B., & Vogel, D. L. (2007).
//   The Experiences in Close Relationship Scale (ECR)-Short Form.
//   Journal of Personality Assessment, 88(2), 187–204.
// - HSQ: Martin, R. A., Puhlik-Doris, P., Larsen, G., Gray, J., & Weir, K. (2003).
//   Individual differences in uses of humor and their relation to psychological well-being:
//   Development of the Humor Styles Questionnaire. Journal of Research in Personality, 37, 48–75.
// - Love Languages: Chapman, G. (1992). The Five Love Languages.

export type LikertItem = {
  kind: "likert";
  text: string;
  scale: 5 | 7;
  /** trait/factor 키 — 결과 계산 시 사용 */
  trait: string;
  /** 역채점 여부 */
  reverse?: boolean;
};

export type ChoiceItem = {
  kind: "choice";
  text: string;
  options: { label: string; trait: string }[];
};

export type Item = LikertItem | ChoiceItem;

export type TestDef = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  intro: string;
  duration: string;
  source: string;
  items: Item[];
  traits: Record<string, { name: string; description: string }>;
  /** 결과 텍스트 생성 함수 */
  interpret: (
    scores: Record<string, number>
  ) => { headline: string; lines: { label: string; value: number; max: number; desc: string }[]; closing?: string };
};

// ---------- 7점 척도 라벨 ----------
export const likert7 = [
  "전혀 아니다",
  "아니다",
  "약간 아니다",
  "보통이다",
  "약간 그렇다",
  "그렇다",
  "매우 그렇다",
];

export const likert5 = [
  "전혀 아니다",
  "아니다",
  "보통이다",
  "그렇다",
  "매우 그렇다",
];

// =========================================
// 1. TIPI — Big Five 10문항
// =========================================
const tipi: TestDef = {
  id: "tipi",
  title: "성격의 다섯 빛깔",
  subtitle: "Big Five 성격 검사 · TIPI 10문항",
  emoji: "✦",
  intro:
    "심리학에서 가장 널리 쓰이는 '5요인 성격모형(Big Five)'을 10문항으로 빠르게 살펴봅니다. 정답은 없습니다. 평소 자신의 모습에 가까운 정도를 골라주세요.",
  duration: "약 2분",
  source: "Gosling, Rentfrow & Swann (2003), TIPI",
  traits: {
    E: { name: "외향성 (Extraversion)", description: "사람과 자극을 향해 에너지를 내보내는 정도" },
    A: { name: "친화성 (Agreeableness)", description: "타인을 신뢰하고 협력하려는 성향" },
    C: { name: "성실성 (Conscientiousness)", description: "체계적이고 끈기 있게 목표를 추구하는 성향" },
    N: { name: "정서 안정성 (Emotional Stability)", description: "스트레스 상황에서 평온함을 유지하는 정도" },
    O: { name: "경험 개방성 (Openness)", description: "새로움·예술·아이디어에 끌리는 정도" },
  },
  items: [
    { kind: "likert", scale: 7, trait: "E", text: "나는 외향적이고 열정적이다." },
    { kind: "likert", scale: 7, trait: "A", reverse: true, text: "나는 비판적이고 다투기를 좋아하는 편이다." },
    { kind: "likert", scale: 7, trait: "C", text: "나는 믿음직하고 자기 절제가 잘 되는 편이다." },
    { kind: "likert", scale: 7, trait: "N", reverse: true, text: "나는 불안해하거나 쉽게 화를 내는 편이다." },
    { kind: "likert", scale: 7, trait: "O", text: "나는 새로운 경험에 열려 있고 다양한 관심을 가진다." },
    { kind: "likert", scale: 7, trait: "E", reverse: true, text: "나는 조용하고 내성적인 편이다." },
    { kind: "likert", scale: 7, trait: "A", text: "나는 따뜻하고 다정한 편이다." },
    { kind: "likert", scale: 7, trait: "C", reverse: true, text: "나는 정돈되지 않고 부주의한 편이다." },
    { kind: "likert", scale: 7, trait: "N", text: "나는 평온하고 정서적으로 안정된 편이다." },
    { kind: "likert", scale: 7, trait: "O", reverse: true, text: "나는 관습적이고 창의적이지 않은 편이다." },
  ],
  interpret: (s) => {
    const order: Array<keyof typeof tipi.traits> = ["E", "A", "C", "N", "O"];
    const labels: Record<string, string> = {
      E: "외향성", A: "친화성", C: "성실성", N: "정서 안정성", O: "경험 개방성",
    };
    const descMap: Record<string, (v: number) => string> = {
      E: (v) => v >= 10 ? "사람들 사이에서 빛이 나는 사교적 에너지." : v >= 7 ? "필요할 때엔 다가가고, 평소엔 균형감 있게." : "혼자만의 시간을 통해 회복하는 깊은 내면.",
      A: (v) => v >= 10 ? "타인을 신뢰하며 따뜻함이 자연스럽다." : v >= 7 ? "다정하지만 자신의 경계도 또렷한 편." : "솔직하고 비판적인 시선을 두려워하지 않는다.",
      C: (v) => v >= 10 ? "계획과 끈기로 일을 완성해가는 사람." : v >= 7 ? "필요할 땐 정돈하고, 때론 자유롭게." : "직관과 흐름을 따라 움직이는 자유로움.",
      N: (v) => v >= 10 ? "흔들림 속에서도 중심을 잘 잡는 평온함." : v >= 7 ? "감정의 기복을 인식하며 조절해가는 중." : "감정의 진폭이 큰, 섬세한 감수성.",
      O: (v) => v >= 10 ? "새로움과 예술, 낯선 생각에 끌리는 탐험가." : v >= 7 ? "익숙함과 새로움 사이에서 유연하게." : "검증된 것의 안정감을 사랑하는 사람.",
    };
    return {
      headline: "당신의 다섯 빛깔",
      lines: order.map((k) => ({
        label: labels[k],
        value: s[k] ?? 0,
        max: 14,
        desc: descMap[k](s[k] ?? 0),
      })),
      closing:
        "TIPI는 짧은 만큼 거친 스케치에 가깝습니다. 첫 만남의 대화 소재로 가볍게 즐겨주세요.",
    };
  },
};

// =========================================
// 2. ECR-S — 애착 유형 (단축형 12문항)
// =========================================
const ecrs: TestDef = {
  id: "ecrs",
  title: "가까움 앞에서 나는",
  subtitle: "성인 애착 유형 검사 · ECR-S 12문항",
  emoji: "❀",
  intro:
    "가까운 관계에서 내가 어떤 패턴을 보이는지 살펴봅니다. 연인, 친한 친구 등 '가까운 사람'을 떠올리며 답해 주세요.",
  duration: "약 3분",
  source: "Wei, Russell, Mallinckrodt & Vogel (2007), ECR-S",
  traits: {
    ANX: { name: "불안 (Anxiety)", description: "버려질까 두려워하거나 더 가까워지길 갈망하는 정도" },
    AVO: { name: "회피 (Avoidance)", description: "친밀함이 부담스럽거나 거리를 두려는 정도" },
  },
  items: [
    { kind: "likert", scale: 7, trait: "AVO", text: "가까운 사람에게 의지하는 일은 어렵게 느껴진다." },
    { kind: "likert", scale: 7, trait: "AVO", text: "가까운 사람에게 마음을 여는 것이 어렵다." },
    { kind: "likert", scale: 7, trait: "AVO", text: "가까운 사람에게 도움을 청하기가 꺼려진다." },
    { kind: "likert", scale: 7, trait: "AVO", reverse: true, text: "나는 가까운 사람과 가까이 있는 것이 편하다." },
    { kind: "likert", scale: 7, trait: "AVO", reverse: true, text: "나는 가까운 사람에게 거의 모든 것을 이야기한다." },
    { kind: "likert", scale: 7, trait: "AVO", reverse: true, text: "나는 가까운 사람과 많은 것을 의논한다." },
    { kind: "likert", scale: 7, trait: "ANX", text: "상대가 나만큼 나를 좋아하지 않을까 봐 걱정된다." },
    { kind: "likert", scale: 7, trait: "ANX", text: "내 마음을 솔직히 보이면 상대가 떠날까 봐 두렵다." },
    { kind: "likert", scale: 7, trait: "ANX", text: "혼자 남겨질까 봐 자주 걱정한다." },
    { kind: "likert", scale: 7, trait: "ANX", text: "가까운 사람이 내가 원하는 만큼 가까이 있어주지 않으면 속상하다." },
    { kind: "likert", scale: 7, trait: "ANX", text: "상대가 나를 진심으로 아끼지 않을까 봐 걱정될 때가 있다." },
    { kind: "likert", scale: 7, trait: "ANX", text: "가까운 사람에게 내 모습을 다 보이고 싶지만 두렵다." },
  ],
  interpret: (s) => {
    const anx = s.ANX ?? 0; // 0~42
    const avo = s.AVO ?? 0; // 0~42
    const anxHigh = anx >= 21;
    const avoHigh = avo >= 21;
    let headline = "";
    let closing = "";
    if (!anxHigh && !avoHigh) {
      headline = "안정형 · 곁에 머무는 것이 편안한 사람";
      closing = "가까움도, 자기 자신으로 있는 것도 두렵지 않은 균형 잡힌 자리에 서 있어요.";
    } else if (anxHigh && !avoHigh) {
      headline = "몰입형 · 더 가까워지길 갈망하는 사람";
      closing = "관계에 깊이 들어가는 만큼, 상대의 작은 신호에도 마음이 흔들릴 수 있어요.";
    } else if (!anxHigh && avoHigh) {
      headline = "회피형 · 자기만의 거리를 지키는 사람";
      closing = "독립과 자율이 중요한 만큼, 가까움이 부담으로 느껴질 수 있어요.";
    } else {
      headline = "혼란형 · 가까움을 원하면서도 두려운 사람";
      closing = "가까움에 대한 갈망과 두려움이 함께 있어, 관계 속 감정의 진폭이 큰 편이에요.";
    }
    return {
      headline,
      lines: [
        {
          label: "불안 (Anxiety)",
          value: anx,
          max: 42,
          desc: anxHigh
            ? "관계 속에서 버려질까, 충분히 사랑받지 못할까 자주 신경 쓰는 편."
            : "관계에 대한 불안이 낮아, 상대의 반응에 비교적 흔들리지 않는 편.",
        },
        {
          label: "회피 (Avoidance)",
          value: avo,
          max: 42,
          desc: avoHigh
            ? "감정을 드러내거나 깊이 의지하는 것을 어려워하는 편."
            : "가까움과 의존을 자연스럽게 받아들이는 편.",
        },
      ],
      closing,
    };
  },
};

// =========================================
// 3. HSQ-16 — 유머 스타일 (단축형 16문항)
// =========================================
const hsq: TestDef = {
  id: "hsq",
  title: "당신의 웃음은 어디서 오는가",
  subtitle: "유머 스타일 검사 · HSQ 단축형 16문항",
  emoji: "✺",
  intro:
    "사람은 저마다 다른 결의 유머를 사용합니다. 어떤 웃음은 관계를 잇고, 어떤 웃음은 자기 자신을 지킵니다. 어떤 유머가 당신과 가까운지 살펴봐요.",
  duration: "약 3분",
  source: "Martin et al. (2003), HSQ",
  traits: {
    AF: { name: "친화적 유머 (Affiliative)", description: "사람들과의 관계를 부드럽게 만드는 유머" },
    SE: { name: "자기고양 유머 (Self-enhancing)", description: "어려운 순간에도 자신을 가볍게 만드는 유머" },
    AG: { name: "공격적 유머 (Aggressive)", description: "비꼼·놀림 등 타인을 향한 날 선 유머" },
    SD: { name: "자기파괴적 유머 (Self-defeating)", description: "자신을 깎아내려 웃음을 만드는 유머" },
  },
  items: [
    { kind: "likert", scale: 5, trait: "AF", text: "사람들과 함께 있을 때 자연스럽게 농담을 잘 던지는 편이다." },
    { kind: "likert", scale: 5, trait: "AF", text: "친구를 웃기는 일이 나에게는 어렵지 않다." },
    { kind: "likert", scale: 5, trait: "AF", text: "사람들과 함께 웃는 분위기를 만드는 것을 좋아한다." },
    { kind: "likert", scale: 5, trait: "AF", reverse: true, text: "나는 사람들 앞에서 농담을 잘 하지 못한다." },

    { kind: "likert", scale: 5, trait: "SE", text: "혼자 있을 때도 인생의 우스운 면을 보며 즐거워하곤 한다." },
    { kind: "likert", scale: 5, trait: "SE", text: "기분이 가라앉을 때 유머로 스스로 기운을 차리려 한다." },
    { kind: "likert", scale: 5, trait: "SE", text: "삶을 유머러스한 관점에서 보면 마음이 한결 가벼워진다." },
    { kind: "likert", scale: 5, trait: "SE", reverse: true, text: "힘든 상황에서 웃음으로 견디는 것은 잘 못한다." },

    { kind: "likert", scale: 5, trait: "AG", text: "마음에 들지 않는 사람을 놀리거나 비꼬는 농담을 자주 한다." },
    { kind: "likert", scale: 5, trait: "AG", text: "상대가 불편해해도 농담을 멈추지 못할 때가 있다." },
    { kind: "likert", scale: 5, trait: "AG", text: "농담으로 상대의 약점을 콕 짚는 편이다." },
    { kind: "likert", scale: 5, trait: "AG", reverse: true, text: "내 농담이 누군가에게 상처가 되지 않도록 늘 조심한다." },

    { kind: "likert", scale: 5, trait: "SD", text: "사람들을 웃기기 위해 스스로를 자주 깎아내린다." },
    { kind: "likert", scale: 5, trait: "SD", text: "내 단점을 우스개 삼아 분위기를 띄우곤 한다." },
    { kind: "likert", scale: 5, trait: "SD", text: "사람들의 호감을 사기 위해 나를 망가뜨리는 농담을 한다." },
    { kind: "likert", scale: 5, trait: "SD", reverse: true, text: "사람들을 웃기려고 나 자신을 낮추진 않는다." },
  ],
  interpret: (s) => {
    const labels: Record<string, string> = {
      AF: "친화적 유머", SE: "자기고양 유머", AG: "공격적 유머", SD: "자기파괴적 유머",
    };
    const descMap: Record<string, (v: number) => string> = {
      AF: (v) => v >= 14 ? "사람들 사이의 공기를 부드럽게 데우는 사람." : v >= 9 ? "분위기에 따라 자연스럽게 농담을 건네는 사람." : "조용히 듣고 미소로 화답하는 편.",
      SE: (v) => v >= 14 ? "삶의 어두운 구석에서도 빛의 각도를 찾아내는 사람." : v >= 9 ? "필요할 때 스스로를 다독이는 유머를 가진 사람." : "유머보다는 다른 방식으로 자신을 위로하는 사람.",
      AG: (v) => v >= 14 ? "날카로운 농담을 즐기는 편 — 의도치 않게 베일 수 있어요." : v >= 9 ? "가끔 풍자나 비꼼이 등장하는 편." : "남을 깎는 농담은 잘 쓰지 않는 사람.",
      SD: (v) => v >= 14 ? "자신을 우스개 삼아 분위기를 책임지는 편 — 가끔은 스스로도 아껴주세요." : v >= 9 ? "때로 스스로를 낮추는 농담을 사용." : "자신을 깎는 농담은 거의 쓰지 않는 사람.",
    };
    return {
      headline: "당신의 유머 색깔",
      lines: (["AF", "SE", "AG", "SD"] as const).map((k) => ({
        label: labels[k],
        value: s[k] ?? 0,
        max: 20,
        desc: descMap[k](s[k] ?? 0),
      })),
      closing:
        "친화적·자기고양 유머는 안녕감과, 공격적·자기파괴적 유머는 스트레스 지표와 관련이 있다는 보고가 있습니다.",
    };
  },
};

// =========================================
// 4. Love Languages — 5가지 사랑의 언어 (강제선택 15문항)
// =========================================
const love: TestDef = {
  id: "love",
  title: "당신이 사랑받는 방식",
  subtitle: "다섯 가지 사랑의 언어 · 강제선택 15문항",
  emoji: "♡",
  intro:
    "사람마다 '사랑받는다'고 느끼는 순간은 다릅니다. 두 보기 중, 당신에게 조금이라도 더 마음이 닿는 쪽을 골라주세요.",
  duration: "약 3분",
  source: "Chapman (1992), The Five Love Languages",
  traits: {
    W: { name: "인정의 말", description: "다정한 말 한마디가 마음에 오래 남는 사람" },
    T: { name: "함께하는 시간", description: "온전히 함께한 시간이 사랑의 증거인 사람" },
    G: { name: "선물", description: "고른 사람의 마음이 담긴 물건에 감응하는 사람" },
    S: { name: "봉사·도움", description: "말없이 챙겨주는 행동에서 사랑을 느끼는 사람" },
    P: { name: "신체 접촉", description: "손을 잡거나 포옹할 때 안정감이 차오르는 사람" },
  },
  items: [
    { kind: "choice", text: "조금 지친 하루 끝, 당신을 더 풀어지게 하는 쪽은?", options: [
      { label: "\"오늘 정말 고생했어\" 라는 한마디", trait: "W" },
      { label: "조용히 옆에 앉아 함께 있어주는 시간", trait: "T" },
    ]},
    { kind: "choice", text: "내 생일에 더 마음에 남는 쪽은?", options: [
      { label: "나를 떠올리며 직접 고른 작은 선물", trait: "G" },
      { label: "내가 하기 싫었던 일을 대신 해주는 손길", trait: "S" },
    ]},
    { kind: "choice", text: "기분이 가라앉은 날 더 위로가 되는 쪽은?", options: [
      { label: "말없이 안아주는 포옹", trait: "P" },
      { label: "\"넌 정말 멋진 사람이야\" 같은 진심 어린 말", trait: "W" },
    ]},
    { kind: "choice", text: "더 사랑받는다고 느끼는 순간은?", options: [
      { label: "둘만의 산책을 천천히 함께 걷는 때", trait: "T" },
      { label: "지나가다 떠올랐다며 무언가를 건네받을 때", trait: "G" },
    ]},
    { kind: "choice", text: "친밀한 사이에서 더 좋은 쪽은?", options: [
      { label: "내가 미처 못 한 집안일을 슬쩍 해두는 모습", trait: "S" },
      { label: "옆에서 가만히 손을 잡아주는 모습", trait: "P" },
    ]},
    { kind: "choice", text: "기억에 더 오래 남는 쪽은?", options: [
      { label: "나를 칭찬해 준 따뜻한 문장", trait: "W" },
      { label: "내 취향을 기억해 골라준 작은 물건", trait: "G" },
    ]},
    { kind: "choice", text: "더 사랑받는다고 느끼는 쪽은?", options: [
      { label: "휴대폰을 내려놓고 나에게 집중해 주는 대화", trait: "T" },
      { label: "내가 부담스러워하던 일을 대신 처리해 주는 손길", trait: "S" },
    ]},
    { kind: "choice", text: "더 마음이 흔들리는 쪽은?", options: [
      { label: "지나치다 어깨를 가볍게 스치는 손길", trait: "P" },
      { label: "\"네가 있어서 다행이야\" 라는 말", trait: "W" },
    ]},
    { kind: "choice", text: "특별한 날에 더 좋은 쪽은?", options: [
      { label: "정성스레 골라 포장한 선물", trait: "G" },
      { label: "그날 하루를 온전히 함께 보내는 시간", trait: "T" },
    ]},
    { kind: "choice", text: "더 사랑받는다 느껴지는 순간은?", options: [
      { label: "내가 아플 때 약을 챙기고 죽을 끓여주는 일", trait: "S" },
      { label: "잠들기 전 손을 꼭 잡아주는 일", trait: "P" },
    ]},
    { kind: "choice", text: "더 든든하게 느껴지는 쪽은?", options: [
      { label: "내 노력을 알아봐 주는 말", trait: "W" },
      { label: "말없이 곁을 지켜주는 시간", trait: "T" },
    ]},
    { kind: "choice", text: "더 끌리는 쪽은?", options: [
      { label: "사소한 것에 담긴 마음의 선물", trait: "G" },
      { label: "내 일을 자기 일처럼 도와주는 마음", trait: "S" },
    ]},
    { kind: "choice", text: "더 위로가 되는 쪽은?", options: [
      { label: "꼭 안기는 포옹", trait: "P" },
      { label: "함께 멀리 산책 나가는 시간", trait: "T" },
    ]},
    { kind: "choice", text: "더 기쁜 쪽은?", options: [
      { label: "내 이름을 부르며 건네는 다정한 말", trait: "W" },
      { label: "내가 잊고 있던 일을 챙겨주는 손길", trait: "S" },
    ]},
    { kind: "choice", text: "더 마음이 가는 쪽은?", options: [
      { label: "내가 좋아할 것 같다며 건네는 선물", trait: "G" },
      { label: "지나가다 등을 가볍게 토닥여 주는 손길", trait: "P" },
    ]},
  ],
  interpret: (s) => {
    const labels: Record<string, string> = {
      W: "인정의 말", T: "함께하는 시간", G: "선물", S: "봉사·도움", P: "신체 접촉",
    };
    const entries = (["W", "T", "G", "S", "P"] as const).map((k) => ({
      key: k,
      value: s[k] ?? 0,
    }));
    const top = [...entries].sort((a, b) => b.value - a.value)[0];
    const headlineMap: Record<string, string> = {
      W: "말의 온도가 마음을 움직이는 사람",
      T: "함께한 시간이 사랑이 되는 사람",
      G: "작은 물건에 담긴 마음을 읽는 사람",
      S: "행동으로 표현된 사랑을 알아보는 사람",
      P: "닿는 것으로 안심하는 사람",
    };
    const descMap: Record<string, string> = {
      W: "다정한 한마디, 진심 어린 칭찬이 마음에 오래 머무는 편이에요.",
      T: "함께 보내는 시간의 밀도가 곧 사랑의 크기로 느껴져요.",
      G: "선물의 가격보다, 골라준 사람의 마음이 더 크게 다가와요.",
      S: "말보다 행동으로 챙겨주는 모습에서 사랑을 확인해요.",
      P: "손길과 체온이 닿을 때 가장 안심이 되는 사람이에요.",
    };
    return {
      headline: headlineMap[top.key],
      lines: entries.map((e) => ({
        label: labels[e.key],
        value: e.value,
        max: 15,
        desc: descMap[e.key],
      })),
      closing:
        "사랑의 언어는 한 가지로만 단정되지 않아요. 1·2위가 가깝다면, 두 언어가 함께 흐르는 사람일 수 있어요.",
    };
  },
};

export const TESTS: TestDef[] = [tipi, ecrs, hsq, love];

export function getTest(id: string): TestDef | undefined {
  return TESTS.find((t) => t.id === id);
}
