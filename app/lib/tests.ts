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

export type Level = "low" | "mid" | "high";

export type ResultLine = {
  label: string;
  value: number;
  max: number;
  /** 점수 분류: 낮음/중간/높음 */
  level: Level;
  /** 분류의 한국어 라벨 (예: "높은 편", "보통", "낮은 편") */
  levelLabel: string;
  /** 한 줄 요약 */
  desc: string;
  /** 더 자세한 설명 (선택) */
  detail?: string;
};

export type ResultInsight = {
  title: string;
  body: string;
};

export type InterpretResult = {
  /** 결과의 핵심을 표현하는 헤드라인 */
  headline: string;
  /** 헤드라인 아래 짧은 부제 */
  subHeadline?: string;
  /** 본격적인 종합 해석 (두세 문장) */
  summary: string;
  /** 각 차원별 상세 결과 */
  lines: ResultLine[];
  /** 관계·강점·살펴볼 점 등의 인사이트 카드 */
  insights?: ResultInsight[];
  /** 마지막 한 줄 */
  closing?: string;
};

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
  interpret: (scores: Record<string, number>) => InterpretResult;
};

// 일반화된 3단계 분류 헬퍼
function classify3(value: number, max: number, lowCut = 0.4, highCut = 0.66): Level {
  const r = value / max;
  if (r >= highCut) return "high";
  if (r <= lowCut) return "low";
  return "mid";
}

function levelKo(level: Level): string {
  return level === "high" ? "높은 편" : level === "low" ? "낮은 편" : "보통";
}

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
    const order = ["E", "A", "C", "N", "O"] as const;
    const labels: Record<string, string> = {
      E: "외향성", A: "친화성", C: "성실성", N: "정서 안정성", O: "경험 개방성",
    };
    // TIPI: 7점 × 2문항 = 2~14. 일반적 절단: 낮음 ≤6, 중간 7~9, 높음 ≥10
    const tipiLevel = (v: number): Level => (v >= 10 ? "high" : v <= 6 ? "low" : "mid");

    const descMap: Record<string, Record<Level, string>> = {
      E: {
        high: "사람들 사이에서 에너지를 얻는, 사교적이고 적극적인 편이에요.",
        mid: "필요할 때엔 잘 다가가지만, 혼자만의 시간도 소중히 여기는 편이에요.",
        low: "조용한 환경에서 더 편안함을 느끼며, 깊이 있는 1:1 관계를 선호하는 편이에요.",
      },
      A: {
        high: "타인을 신뢰하고 협력하는 태도가 자연스러운, 따뜻한 사람이에요.",
        mid: "다정하면서도 자기 의견과 경계는 또렷이 지키는 균형형이에요.",
        low: "솔직하고 비판적인 시선을 두려워하지 않는, 단단한 자기 색이 있어요.",
      },
      C: {
        high: "계획과 끈기로 일을 완성해 나가는, 책임감 있는 사람이에요.",
        mid: "필요할 땐 정돈하고, 때론 자유롭게 움직이는 유연한 편이에요.",
        low: "직관과 흐름을 따라 움직이는, 자유롭고 즉흥적인 결이 있어요.",
      },
      N: {
        high: "흔들림 속에서도 중심을 잘 잡는, 정서적으로 안정된 편이에요.",
        mid: "감정의 기복을 인식하며 스스로 조율해가는 중간 지점에 있어요.",
        low: "감정의 진폭이 큰 편 — 섬세하고 풍부한 감수성이 강점일 수 있어요.",
      },
      O: {
        high: "새로움·예술·낯선 생각에 끌리는, 호기심이 많은 탐험가형이에요.",
        mid: "익숙함과 새로움 사이를 유연하게 오가는 편이에요.",
        low: "검증된 것의 안정감을 사랑하는, 현실적이고 실용적인 결이에요.",
      },
    };

    const detailMap: Record<string, Record<Level, string>> = {
      E: {
        high: "여러 사람과의 자리에서 분위기를 띄우고, 자극을 추구하는 활동에서 활력을 얻습니다.",
        mid: "사회적 자극과 혼자만의 회복 시간 둘 다 필요로 합니다.",
        low: "내면을 들여다보고, 사색하거나 가까운 소수와 깊이 교류할 때 충전됩니다.",
      },
      A: {
        high: "갈등 상황에서 상대 입장을 먼저 헤아리려 하고, 양보가 자연스러워요.",
        mid: "공감과 자기주장 사이에서 상황에 맞게 조율합니다.",
        low: "필요한 말은 분명히 하는 편이며, 사람의 동기를 회의적으로 살피는 시선이 있습니다.",
      },
      C: {
        high: "마감과 약속을 잘 지키고, 정리된 환경에서 안정감을 얻습니다.",
        mid: "중요한 일은 챙기지만 사소한 일에선 풀어집니다.",
        low: "엄격한 구조보다 즉흥성과 영감을 더 신뢰합니다.",
      },
      N: {
        high: "스트레스 상황에서도 평정을 유지하고, 회복도 빠른 편입니다.",
        mid: "감정의 흔들림을 자각하고 다스리는 데 익숙합니다.",
        low: "주변 자극에 민감하게 반응하며, 감정의 깊이가 깊은 편입니다.",
      },
      O: {
        high: "예술·여행·새로운 아이디어와 토론을 즐기며, 변화에 잘 적응합니다.",
        mid: "안전하다 느낄 때 새로운 시도에 마음을 엽니다.",
        low: "이미 좋다고 검증된 것을 반복해서 즐기는 데서 만족감을 느낍니다.",
      },
    };

    const lines: ResultLine[] = order.map((k) => {
      const v = s[k] ?? 0;
      const level = tipiLevel(v);
      return {
        label: labels[k],
        value: v,
        max: 14,
        level,
        levelLabel: levelKo(level),
        desc: descMap[k][level],
        detail: detailMap[k][level],
      };
    });

    // 종합 해석 — 가장 두드러진 1·2위 + 두드러지게 낮은 차원으로 인물 묘사
    const sorted = [...lines].sort((a, b) => b.value - a.value);
    const top1 = sorted[0];
    const top2 = sorted[1];
    const bottom = sorted[sorted.length - 1];

    const headline = `${top1.label}이(가) 두드러지는 사람`;
    const subHeadline = `핵심 색: ${top1.label} · ${top2.label}`;

    const summary =
      `다섯 차원 중 ${top1.label}이(가) 가장 두드러지며, ${top2.label}이(가) 그다음으로 강한 빛을 띱니다. ` +
      `반면 ${bottom.label}은(는) 상대적으로 옅게 나타나요. ` +
      `즉, ${top1.desc} 동시에 ${top2.desc} 이 두 결이 평소 모습의 큰 뼈대를 이룹니다.`;

    // 두드러진 차원 조합으로 관계·강점·살펴볼 점 인사이트 구성
    const insights: ResultInsight[] = [
      {
        title: "사람들이 보는 첫인상",
        body: top1.level === "high" && top1.label === "외향성"
          ? "활기차고 다가가기 쉬운 사람이라는 인상을 자주 받습니다."
          : top1.label === "친화성"
          ? "따뜻하고 편안한 사람이라는 첫인상을 자주 줍니다."
          : top1.label === "성실성"
          ? "단단하고 신뢰할 만한 사람이라는 인상을 줍니다."
          : top1.label === "정서 안정성"
          ? "차분하고 안정감을 주는 분위기를 자아냅니다."
          : "지적이고 호기심 많은, 흥미로운 사람이라는 인상을 줍니다.",
      },
      {
        title: "강점",
        body:
          top1.level === "high"
            ? `${top1.label} 차원이 높아, ${top1.detail}`
            : `높지도 낮지도 않은 균형이 강점이에요 — 상황마다 다른 모습을 자연스럽게 꺼낼 수 있습니다.`,
      },
      {
        title: "살펴볼 점",
        body:
          bottom.level === "low"
            ? `${bottom.label} 영역이 옅은 편이라, 때로는 의식적으로 ${bottom.label}의 결을 보완해 보는 것도 좋아요.`
            : "특별히 두드러지게 낮은 영역은 없는 편이에요 — 전반적으로 고른 프로파일이에요.",
      },
    ];

    return {
      headline,
      subHeadline,
      summary,
      lines,
      insights,
      closing:
        "TIPI는 10문항 단축형이라 빠르게 그려본 스케치예요. 깊은 자기이해보다는 첫 만남의 대화 소재로 즐겨주세요.",
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
    const anx = s.ANX ?? 0; // 6~42
    const avo = s.AVO ?? 0; // 6~42
    const anxLevel: Level = anx >= 30 ? "high" : anx >= 18 ? "mid" : "low";
    const avoLevel: Level = avo >= 30 ? "high" : avo >= 18 ? "mid" : "low";
    const anxHigh = anx >= 24;
    const avoHigh = avo >= 24;

    type Type = "secure" | "preoccupied" | "dismissing" | "fearful";
    const type: Type =
      !anxHigh && !avoHigh ? "secure"
      : anxHigh && !avoHigh ? "preoccupied"
      : !anxHigh && avoHigh ? "dismissing"
      : "fearful";

    const headlineMap: Record<Type, string> = {
      secure: "안정형 · 곁에 머무는 것이 편안한 사람",
      preoccupied: "몰입형 · 더 가까워지길 갈망하는 사람",
      dismissing: "회피형 · 자기만의 거리를 지키는 사람",
      fearful: "혼란형 · 가까움을 원하면서도 두려운 사람",
    };

    const summaryMap: Record<Type, string> = {
      secure:
        "가까운 사람에게 자연스럽게 의지하고, 동시에 혼자만의 시간도 두렵지 않은 균형 잡힌 자리에 서 있어요. 상대의 작은 행동에 휘둘리지 않으면서도, 마음을 표현하는 데 망설임이 적은 편입니다.",
      preoccupied:
        "관계가 시작되면 깊이 몰입하고 사랑을 갈망하지만, 그만큼 상대의 작은 신호에도 마음이 크게 흔들립니다. \"나만큼 나를 좋아할까\"라는 생각이 자주 떠오르고, 확인받고 싶은 마음이 큰 편이에요.",
      dismissing:
        "혼자서도 충분히 잘 지내고, 독립과 자율이 무엇보다 중요해요. 가까워질 기회 앞에서 한 발 물러서는 자신을 발견할 때가 있고, 깊은 감정을 드러내거나 의지하는 일은 어렵게 느껴집니다.",
      fearful:
        "가까워지고 싶은 갈망과, 가까워지는 게 두려운 마음이 동시에 존재합니다. 관계 속에서 다가갔다 멀어졌다를 반복하기 쉽고, 감정의 진폭이 큰 편이에요.",
    };

    const insightsMap: Record<Type, ResultInsight[]> = {
      secure: [
        { title: "관계에서 보이는 모습", body: "갈등 상황에서도 비교적 차분하게 대화를 이어가고, 상대에게 안정감을 주는 사람이라는 평가를 자주 듣습니다." },
        { title: "강점", body: "의존과 독립의 균형이 좋아, 가까운 관계든 거리감 있는 관계든 적응이 자연스러워요." },
        { title: "살펴볼 점", body: "안정적이라는 이유로 상대의 불안이나 회피 신호를 너무 가볍게 넘기지 않도록 살펴보세요." },
      ],
      preoccupied: [
        { title: "관계에서 보이는 모습", body: "사랑을 깊고 빠르게 표현하지만, 답이 늦거나 거리감이 느껴질 때 불안이 빠르게 차오릅니다." },
        { title: "강점", body: "상대의 감정에 민감하고 관계에 진심을 다하는 깊이가 있어요." },
        { title: "살펴볼 점", body: "상대의 사소한 신호를 부정적으로 해석하는 경향을 알아차리고, 불안의 신호 → 행동으로 바로 가지 않는 연습이 도움이 됩니다." },
      ],
      dismissing: [
        { title: "관계에서 보이는 모습", body: "감정을 말로 풀어내기보다 혼자 정리하는 편이고, 상대가 가까워지려 할 때 자기도 모르게 거리를 둡니다." },
        { title: "강점", body: "자율적이고 독립적이며, 관계에 휘둘리지 않는 단단함이 있어요." },
        { title: "살펴볼 점", body: "\"나는 괜찮아\"라는 말 뒤에 숨겨둔 감정이 있는지 가끔은 천천히 들여다보세요." },
      ],
      fearful: [
        { title: "관계에서 보이는 모습", body: "가까워지면 두려워지고, 멀어지면 다시 외로워지는 패턴이 반복될 수 있어요." },
        { title: "강점", body: "양가감정을 모두 느낀다는 건, 그만큼 관계의 양면을 깊이 이해할 수 있다는 뜻이기도 해요." },
        { title: "살펴볼 점", body: "감정의 진폭이 클 때엔, 결정을 미루고 한 박자 쉬는 것이 도움이 됩니다." },
      ],
    };

    const anxDescMap: Record<Level, string> = {
      high: "관계 속에서 버려질까, 충분히 사랑받지 못할까 자주 신경 쓰는 편이에요.",
      mid: "관계에 대한 적당한 긴장이 있어, 상대의 마음을 살피되 과하게 흔들리지는 않아요.",
      low: "관계에 대한 불안이 낮아, 상대의 반응에 비교적 흔들리지 않는 편이에요.",
    };
    const avoDescMap: Record<Level, string> = {
      high: "감정을 드러내거나 깊이 의지하는 것을 어려워하는 편이에요.",
      mid: "가까움이 편할 때도 있고, 거리가 필요할 때도 있는 균형 지점에 있어요.",
      low: "가까움과 의존을 자연스럽게 받아들이는 편이에요.",
    };

    return {
      headline: headlineMap[type],
      subHeadline: `불안 ${anx} · 회피 ${avo} (각 6~42)`,
      summary: summaryMap[type],
      lines: [
        {
          label: "불안 (Anxiety)",
          value: anx,
          max: 42,
          level: anxLevel,
          levelLabel: levelKo(anxLevel),
          desc: anxDescMap[anxLevel],
          detail: "버려질지 모른다는 두려움, 더 가까워지길 바라는 갈망의 정도를 측정합니다.",
        },
        {
          label: "회피 (Avoidance)",
          value: avo,
          max: 42,
          level: avoLevel,
          levelLabel: levelKo(avoLevel),
          desc: avoDescMap[avoLevel],
          detail: "친밀함과 의존을 불편해하는 정도, 감정적 거리를 유지하려는 경향을 측정합니다.",
        },
      ],
      insights: insightsMap[type],
      closing: "애착 유형은 평생 고정되어 있지 않습니다. 안전한 관계 경험이 쌓이면 유형도 천천히 변해갈 수 있어요.",
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
    // HSQ: 4문항 × 5점 = 4~20 per scale
    const labels: Record<string, string> = {
      AF: "친화적 유머", SE: "자기고양 유머", AG: "공격적 유머", SD: "자기파괴적 유머",
    };
    const hsqLevel = (v: number): Level => (v >= 15 ? "high" : v <= 9 ? "low" : "mid");

    const descMap: Record<string, Record<Level, string>> = {
      AF: {
        high: "사람들 사이의 공기를 부드럽게 데우는 사람이에요.",
        mid: "분위기에 따라 자연스럽게 농담을 건네는 편이에요.",
        low: "조용히 듣고 미소로 화답하는 편 — 농담보다는 들어주는 자리에 머물러요.",
      },
      SE: {
        high: "삶의 어두운 구석에서도 빛의 각도를 찾아내는 사람이에요.",
        mid: "필요할 때 스스로를 다독이는 유머를 가진 편이에요.",
        low: "유머보다는 다른 방식으로 자신을 위로하는 편이에요.",
      },
      AG: {
        high: "날카로운 농담을 즐기는 편 — 가끔은 의도치 않게 상대를 베일 수 있어요.",
        mid: "가끔 풍자나 비꼼이 등장하지만, 선은 지키는 편이에요.",
        low: "남을 깎는 농담은 거의 쓰지 않는, 안전한 유머의 사람이에요.",
      },
      SD: {
        high: "자신을 우스개 삼아 분위기를 책임지는 편 — 때로는 스스로도 아껴주세요.",
        mid: "때때로 스스로를 낮추는 농담을 사용해요.",
        low: "자신을 깎는 농담은 거의 쓰지 않으며, 자기존중감이 농담에 묻어나요.",
      },
    };

    const detailMap: Record<string, Record<Level, string>> = {
      AF: {
        high: "여러 사람이 모인 자리에서 분위기를 띄우는 역할을 자주 맡습니다.",
        mid: "친한 사이에선 농담이 자연스럽게 흘러나오는 편이에요.",
        low: "유머가 강점은 아니어도, 듣고 공감해 주는 다른 강점이 있어요.",
      },
      SE: {
        high: "스트레스 상황에서도 일정한 거리를 두고 웃을 줄 알아요 — 회복탄력성과 관련 깊은 스타일이에요.",
        mid: "힘들 때 가끔 유머의 힘을 빌릴 수 있는 정도예요.",
        low: "힘든 순간에는 유머보다 침묵·휴식이 더 자연스러운 위로일 수 있어요.",
      },
      AG: {
        high: "재치는 강점이지만, 상대가 약점이라 느낄 만한 부분에는 한 번 더 멈춰 보는 것이 좋아요.",
        mid: "장난과 상처의 경계를 의식하는 균형 지점에 있어요.",
        low: "타인에게 안전감을 주는 농담의 사람이라는 평가를 받기 쉬워요.",
      },
      SD: {
        high: "사람들에게 호감을 사지만, 반복되면 자기존중감이 깎일 수 있어요. 가끔은 다른 방식으로 분위기를 띄워보세요.",
        mid: "가끔 자조적 농담을 쓰지만, 스스로를 너무 깎지는 않는 편이에요.",
        low: "자신을 우스개로 만들지 않고도 사람들 사이에서 충분히 자리 잡는 사람이에요.",
      },
    };

    const lines: ResultLine[] = (["AF", "SE", "AG", "SD"] as const).map((k) => {
      const v = s[k] ?? 0;
      const level = hsqLevel(v);
      return {
        label: labels[k],
        value: v,
        max: 20,
        level,
        levelLabel: levelKo(level),
        desc: descMap[k][level],
        detail: detailMap[k][level],
      };
    });

    // 가장 두드러진 스타일로 헤드라인 / 요약 구성
    const sorted = [...lines].sort((a, b) => b.value - a.value);
    const top = sorted[0];

    const headlineMap: Record<string, string> = {
      "친화적 유머": "함께 웃기를 좋아하는 사람",
      "자기고양 유머": "혼자서도 자신을 웃길 줄 아는 사람",
      "공격적 유머": "날카로운 재치가 무기인 사람",
      "자기파괴적 유머": "분위기를 책임지는 자조의 사람",
    };

    const af = s.AF ?? 0, se = s.SE ?? 0, ag = s.AG ?? 0, sd = s.SD ?? 0;
    const adaptive = af + se;     // 적응적
    const maladaptive = ag + sd;  // 부적응적

    let summary = "";
    if (adaptive - maladaptive >= 8) {
      summary =
        `당신의 유머는 적응적인 결이 두드러져요. 사람들과의 관계를 따뜻하게 잇고, ` +
        `자신의 어려움도 한 발짝 떨어져서 가벼이 만들 줄 압니다. ` +
        `이런 유머 스타일은 안녕감·관계 만족도와 정적 상관을 보인다고 보고됩니다 (Martin et al., 2003).`;
    } else if (maladaptive - adaptive >= 8) {
      summary =
        `당신의 유머에는 날 선 결이 좀 더 자주 등장하는 편이에요. ` +
        `재치 있고 빠르지만, 타인이나 자기 자신을 깎아내리는 방향으로 흐를 때 ` +
        `관계와 자기존중감 모두에 미세한 균열을 남길 수 있다고 보고됩니다.`;
    } else {
      summary =
        `당신의 유머는 한쪽으로 치우치지 않고 다양한 결이 섞여 있어요. ` +
        `상황과 관계에 따라 다른 톤의 유머를 꺼낼 수 있는 폭이 강점이에요. ` +
        `다만, 가장 두드러진 ${top.label}이(가) 어떤 자리에서 자주 나오는지 의식하면 더 좋아져요.`;
    }

    const insights: ResultInsight[] = [
      {
        title: "안녕감과의 연관",
        body:
          adaptive >= maladaptive
            ? "친화적·자기고양 유머가 우세한 패턴이에요. 정서적 안녕감, 회복탄력성과 정적 상관을 보입니다."
            : "공격적·자기파괴적 유머가 상대적으로 우세해요. 단기적 효과는 있지만 장기적으로는 스트레스·우울과 정적 상관을 보이는 패턴입니다.",
      },
      {
        title: "관계에 미치는 영향",
        body:
          ag >= 15
            ? "공격적 유머가 높은 편이에요. 친밀한 사이에서 의도와 다르게 상처를 남길 수 있어요 — 표정 변화가 보이면 한 박자 멈춰 보세요."
            : af >= 15
            ? "친화적 유머가 강점이에요. 처음 만난 사이에서도 자연스러운 분위기를 만들 수 있는 사람이에요."
            : "유머로 관계를 적극적으로 끌고 가기보다, 다른 방식(경청·공감)으로 친밀함을 만드는 편이에요.",
      },
      {
        title: "살펴볼 점",
        body:
          sd >= 15
            ? "자기파괴적 유머가 높아요. 사람들에게 사랑받지만, 자신을 너무 자주 깎으면 점점 자존감이 옅어질 수 있어요."
            : se <= 9
            ? "자기고양 유머가 낮은 편이에요. 힘들 때 스스로를 위한 농담을 시도해 보는 것이 작은 회복의 도구가 될 수 있어요."
            : "전반적으로 건강한 유머 사용 패턴이에요.",
      },
    ];

    return {
      headline: headlineMap[top.label] ?? "당신의 유머 색깔",
      subHeadline: `가장 두드러진 결: ${top.label}`,
      summary,
      lines,
      insights,
      closing:
        "친화적·자기고양 유머는 안녕감과, 공격적·자기파괴적 유머는 스트레스 지표와 관련이 있다는 보고가 있습니다 (Martin et al., 2003).",
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
    // 강제선택 15문항 → 각 trait 0~? (한 trait 최대 약 6)
    const labels: Record<string, string> = {
      W: "인정의 말", T: "함께하는 시간", G: "선물", S: "봉사·도움", P: "신체 접촉",
    };
    const entries = (["W", "T", "G", "S", "P"] as const).map((k) => ({
      key: k,
      value: s[k] ?? 0,
    }));
    const sorted = [...entries].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const second = sorted[1];
    const close = second && top.value - second.value <= 1;

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
    const detailMap: Record<string, string> = {
      W: "반대로, 비난이나 차가운 말 한마디에도 가장 깊게 베이는 사람일 수 있어요.",
      T: "함께 있어도 휴대폰만 보는 시간은 '함께 있지 않은 시간'으로 느껴질 수 있습니다.",
      G: "기념일을 잊거나 선물에 무심한 행동이 의외로 크게 다가올 수 있어요.",
      S: "약속한 일을 미루거나 도움을 거절당했을 때 깊게 서운함을 느끼기 쉬워요.",
      P: "스킨십이 적은 시기에는 마음의 거리도 함께 멀어진 듯 느낄 수 있어요.",
    };
    const summary = close
      ? `당신은 '${top.key === "W" ? "인정의 말" : labels[top.key]}'을(를) 중심으로, '${labels[second.key]}'이(가) 함께 흐르는 사람이에요. ` +
        `이 두 언어가 함께 채워질 때, 사랑이 가장 진하게 느껴집니다.`
      : `당신이 사랑을 가장 또렷이 느끼는 통로는 '${labels[top.key]}'이에요. ` +
        `다른 표현도 좋지만, 이 결이 닿지 않으면 마음 한 켠에 허전함이 남기 쉬워요.`;

    const lines: ResultLine[] = entries.map((e) => {
      // 0~6 범위 추정. 4이상 high, 1이하 low
      const level: Level = e.value >= 4 ? "high" : e.value <= 1 ? "low" : "mid";
      return {
        label: labels[e.key],
        value: e.value,
        max: 6,
        level,
        levelLabel: level === "high" ? "주된 언어" : level === "low" ? "약한 편" : "보통",
        desc: descMap[e.key],
        detail: detailMap[e.key],
      };
    });

    const insights: ResultInsight[] = [
      {
        title: "사랑받는다고 느끼는 순간",
        body:
          `'${labels[top.key]}'이(가) 닿을 때 가장 또렷이 사랑받는다고 느낍니다. ` +
          `처음 만난 사람에게 알려준다면 가장 큰 도움이 될 한 문장이에요.`,
      },
      {
        title: "관계에서 살펴볼 점",
        body:
          `사람들은 자신이 받고 싶은 방식으로 사랑을 표현하는 경향이 있어요. ` +
          `상대의 사랑 언어가 다르다면, 둘 다 '주는데 닿지 않는' 답답함을 겪기 쉽습니다 — 서로의 언어를 알려주는 대화가 도움이 됩니다.`,
      },
      {
        title: "한 가지 팁",
        body:
          `가까운 사람에게 \"나는 ${labels[top.key]}을(를) 받을 때 사랑받는다 느껴\"라고 짧게 말해 보세요. 이 한 문장이 관계의 결을 크게 바꿉니다.`,
      },
    ];

    return {
      headline: headlineMap[top.key],
      subHeadline: close
        ? `주된 언어: ${labels[top.key]} · ${labels[second.key]}`
        : `주된 언어: ${labels[top.key]}`,
      summary,
      lines,
      insights,
      closing:
        "사랑의 언어는 한 가지로만 단정되지 않아요. 1·2위가 가깝다면, 두 언어가 함께 흐르는 사람일 수 있어요.",
    };
  },
};

export const TESTS: TestDef[] = [tipi, ecrs, hsq, love];

export function getTest(id: string): TestDef | undefined {
  return TESTS.find((t) => t.id === id);
}
