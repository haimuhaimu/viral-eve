import type {
  AudienceReaction,
  BrandDeal,
  CardEffects,
  ContentDraft,
  CreatorMetrics,
  DailyBriefing,
  DayResult,
  Ending,
  GameState,
  PlatformTag,
} from "./types";
import { AUDIENCES } from "./data/audiences";
import { COMMENT_TEMPLATES, CREATOR_LINES } from "./data/comments";
import { ENDINGS } from "./data/endings";

// ============================================================================
// 模拟引擎 —— 全部为纯函数，不触碰任何 UI 或全局状态。
// 输入：当前状态 + 玩家的内容策略 + 当天简报 (+ 可选商单)
// 输出：这一天的结算结果 / 新的游戏状态。
// ============================================================================

// —— 确定性随机数（同样的输入永远得到同样的结果）——
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashDraft(draft: ContentDraft): number {
  const s = [
    draft.topic.id,
    draft.stance.id,
    draft.format.id,
    draft.hook.id,
    draft.sacrifice.id,
  ].join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const clamp100 = (v: number) => clamp(v, 0, 100);
const tanh = (x: number) => Math.tanh(x);

const EMPTY_EFFECTS: CardEffects = {
  flow: 0,
  authenticity: 0,
  drift: 0,
  controversy: 0,
  stress: 0,
  money: 0,
};

/** 把五张卡的推力叠加成一份内容"配方"。 */
export function combineEffects(draft: ContentDraft): CardEffects {
  const cards = [draft.topic, draft.stance, draft.format, draft.hook, draft.sacrifice];
  return cards.reduce<CardEffects>(
    (acc, c) => ({
      flow: acc.flow + c.effects.flow,
      authenticity: acc.authenticity + c.effects.authenticity,
      drift: acc.drift + c.effects.drift,
      controversy: acc.controversy + c.effects.controversy,
      stress: acc.stress + c.effects.stress,
      money: acc.money + c.effects.money,
    }),
    { ...EMPTY_EFFECTS },
  );
}

/** 单个群体的情绪：把配方按该群体的偏好加权后压缩到 -1~1。 */
function groupSentiment(effects: CardEffects, weights: Record<string, number>): number {
  let raw = 0;
  for (const key of Object.keys(weights)) {
    const axis = effects[key as keyof CardEffects] ?? 0;
    raw += weights[key] * (axis / 12); // 12 ≈ 单轴较强的量级
  }
  return tanh(raw);
}

function sentimentLabel(sentiment: number, intensity: number): string {
  if (intensity > 0.66) {
    if (sentiment > 0.35) return "炸锅了 · 疯狂点赞";
    if (sentiment < -0.35) return "炸锅了 · 骂声一片";
    return "吵翻了 · 两极分化";
  }
  if (sentiment > 0.35) return "叫好";
  if (sentiment < -0.35) return "反感";
  if (Math.abs(sentiment) < 0.15 && intensity < 0.25) return "沉默";
  return "平淡";
}

function pick<T>(arr: readonly T[], rnd: () => number): T {
  if (arr.length === 0) return undefined as unknown as T;
  return arr[Math.floor(rnd() * arr.length)];
}

/** 计算七个群体的反应（含代表性评论）。 */
export function computeReactions(
  effects: CardEffects,
  seed: number,
): AudienceReaction[] {
  const rnd = mulberry32(seed);
  // 整体"响度"：流量/争议/偏移越高，讨论越热烈。
  const loudness = clamp(
    (effects.flow + effects.controversy * 0.9 + effects.drift * 0.5) / 26,
    0,
    1,
  );

  return AUDIENCES.map((group) => {
    const sentiment = groupSentiment(effects, group.weights as Record<string, number>);
    // 参与热度：黑粉/算法/路人对"响度"更敏感；老粉/硬核更看情绪强度本身。
    let intensity: number;
    if (group.id === "haters" || group.id === "algorithm" || group.id === "casual") {
      intensity = clamp(loudness * 0.7 + Math.abs(sentiment) * 0.5, 0, 1);
    } else if (group.id === "brandPR") {
      intensity = clamp(0.3 + Math.abs(sentiment) * 0.6, 0, 1);
    } else {
      intensity = clamp(0.25 + Math.abs(sentiment) * 0.8, 0, 1);
    }

    const bucket = COMMENT_TEMPLATES[group.id];
    let pool = bucket.mid;
    if (sentiment > 0.22) pool = bucket.pos;
    else if (sentiment < -0.22) pool = bucket.neg;
    const comment = pick(pool.length ? pool : bucket.mid, rnd);

    return {
      id: group.id,
      name: group.name,
      emoji: group.emoji,
      sentiment,
      intensity,
      label: sentimentLabel(sentiment, intensity),
      comment,
    };
  });
}

function reactionOf(reactions: AudienceReaction[], id: string): AudienceReaction {
  return reactions.find((r) => r.id === id)!;
}

/** 根据当天配方与当前状态，重新计算平台标签（反映"平台现在把你看成谁"）。 */
export function deriveTags(
  current: PlatformTag[],
  effects: CardEffects,
  metrics: CreatorMetrics,
  dealAccepted: boolean,
): PlatformTag[] {
  const tags: PlatformTag[] = [];
  const push = (t: PlatformTag) => {
    if (!tags.includes(t)) tags.push(t);
  };

  if (effects.authenticity >= 12 && effects.drift <= 3) push("专业分析");
  if (effects.authenticity >= 9 && effects.drift <= 4) push("硬核老哥");
  if (metrics.expertise >= 78) push("版本先知");
  if (effects.controversy >= 12) push("对线狂魔");
  if (effects.controversy >= 8 && effects.drift >= 8) push("破防现场");
  if (effects.drift >= 10) push("整活顶流");
  if (effects.flow >= 13 && effects.authenticity < 7) push("情绪大师");
  if (dealAccepted || effects.money >= 4) push("恰饭选手");
  if (metrics.personaDrift >= 72) push("整活顶流");

  // 什么都没沾上 —— 平台眼里查无此人。
  if (tags.length === 0) {
    // 保留一个旧标签避免完全空白，否则打上"查无此人"
    push(current[current.length - 1] ?? "查无此人");
  }
  return tags.slice(0, 4);
}

/** 核心：给定一份内容，算出这一天的完整结算结果。 */
export function simulateContent(
  state: GameState,
  draft: ContentDraft,
  briefing: DailyBriefing,
  deal?: BrandDeal | null,
  dealAccepted = false,
): DayResult {
  const effects = combineEffects(draft);
  const seed = hashDraft(draft) ^ (briefing.day * 2654435761);
  const rnd = mulberry32(seed);
  const reactions = computeReactions(effects, seed);

  // —— 热点加成：今天被算法额外放大的轴线 ——
  const trendBonus = Math.max(0, effects[briefing.trendBoost]) * 0.5;

  // —— 触达 / 播放量 ——
  const reachRaw =
    effects.flow * 1.0 + effects.controversy * 0.55 + effects.drift * 0.28 + trendBonus;
  const algoSent = reactionOf(reactions, "algorithm").sentiment;
  const reachMult = clamp(
    0.3 + reachRaw / 26 + algoSent * 0.25,
    0.18,
    3.6,
  );
  const variance = 0.85 + rnd() * 0.3;
  const views = Math.round(state.metrics.followers * reachMult * variance);
  const viralHit = reachMult >= 2.0 || views >= state.metrics.followers * 2.4;

  // —— 涨粉 / 掉粉 ——
  const casualSent = reactionOf(reactions, "casual").sentiment;
  const oldSent = reactionOf(reactions, "oldFans").sentiment;
  const hardSent = reactionOf(reactions, "hardcore").sentiment;
  // 转化率：路人爱看、算法加推、硬核认可都会带来关注。
  const convRate =
    0.03 +
    Math.max(0, casualSent) * 0.03 +
    Math.max(0, algoSent) * 0.02 +
    Math.max(0, hardSent) * 0.015;
  const gain = views * convRate;
  // 掉粉：只有老粉 / 硬核真心失望才会走人，人设崩坏留不住人。
  const churn =
    state.metrics.followers *
    0.016 *
    (Math.max(0, -oldSent) * 1.1 + Math.max(0, -hardSent) * 0.6);
  const followerDelta = Math.round(gain - churn);

  // —— 收入 ——
  const adRev = views * 0.012 + effects.money * 80;
  const dealMoney = dealAccepted && deal ? deal.money : 0;
  const moneyDelta = Math.round(adRev + dealMoney);

  // —— 信任 ——
  const peersSent = reactionOf(reactions, "peers").sentiment;
  let trustDelta =
    oldSent * 3.0 + hardSent * 2.2 + peersSent * 1.3 - effects.controversy * 0.16;
  if (dealAccepted && deal) trustDelta -= deal.trustCost;
  trustDelta = Math.round(trustDelta);

  // —— 专业度 ——
  const expertiseDelta = Math.round(effects.authenticity * 0.32 - effects.drift * 0.28 - 0.8);

  // —— 人设偏移 ——
  let driftDelta = effects.drift * 0.5 + effects.flow * 0.1 - effects.authenticity * 0.16;
  if (dealAccepted && deal) driftDelta += deal.driftCost;
  driftDelta = Math.round(driftDelta);

  // —— 压力 ——
  const stressDelta = Math.round(
    effects.stress * 0.85 + Math.max(0, effects.controversy - 8) * 0.4 - 1.2,
  );

  const metricsForTags: CreatorMetrics = {
    ...state.metrics,
    expertise: clamp100(state.metrics.expertise + expertiseDelta),
    personaDrift: clamp100(state.metrics.personaDrift + driftDelta),
  };
  const newTags = deriveTags(state.tags, effects, metricsForTags, dealAccepted);

  const creatorLine = pickCreatorLine(
    { viralHit, followerDelta, driftDelta, trustDelta, expertiseDelta },
    state.metrics.personaDrift + driftDelta,
    rnd,
  );

  return {
    day: briefing.day,
    draft,
    effects,
    views,
    followerDelta,
    moneyDelta,
    trustDelta,
    expertiseDelta,
    driftDelta,
    stressDelta,
    reactions,
    newTags,
    creatorLine,
    viralHit,
  };
}

function pickCreatorLine(
  r: {
    viralHit: boolean;
    followerDelta: number;
    driftDelta: number;
    trustDelta: number;
    expertiseDelta: number;
  },
  projectedDrift: number,
  rnd: () => number,
): string {
  // 高偏移优先，让玩家感到"火了但走样了"
  if (projectedDrift >= 55 && r.driftDelta >= 4) return pick(CREATOR_LINES.drifting, rnd);
  if (r.viralHit) {
    const good = r.trustDelta >= 0 && r.expertiseDelta >= 0 && r.driftDelta <= 3;
    return pick(good ? CREATOR_LINES.viralGood : CREATOR_LINES.viralBad, rnd);
  }
  if (r.followerDelta >= 0 && r.trustDelta >= 0) return pick(CREATOR_LINES.goodSmall, rnd);
  return pick(CREATOR_LINES.badSmall, rnd);
}

/** 把一天的结算应用到状态上，得到下一天的状态。 */
export function applyDayResult(state: GameState, result: DayResult, dealId?: string): GameState {
  const m = state.metrics;
  const metrics: CreatorMetrics = {
    followers: Math.max(0, m.followers + result.followerDelta),
    money: Math.max(0, m.money + result.moneyDelta),
    trust: clamp100(m.trust + result.trustDelta),
    expertise: clamp100(m.expertise + result.expertiseDelta),
    personaDrift: clamp100(m.personaDrift + result.driftDelta),
    stress: clamp100(m.stress + result.stressDelta),
  };
  const peakViews = Math.max(state.stats.peakViews, result.views);
  return {
    day: state.day + 1,
    metrics,
    stats: {
      totalViews: state.stats.totalViews + result.views,
      peakViews,
      notoriety: state.stats.notoriety + Math.max(0, result.effects.controversy),
    },
    tags: result.newTags,
    history: [...state.history, result],
    acceptedDeals: dealId ? [...state.acceptedDeals, dealId] : state.acceptedDeals,
  };
}

/** 依据最终状态判定结局。 */
export function resolveEnding(state: GameState): Ending {
  return ENDINGS.find((e) => e.match(state)) ?? ENDINGS[ENDINGS.length - 1];
}
