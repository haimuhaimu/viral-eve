import type { AudienceGroup } from "../types";

// ============================================================================
// 七个受众群体。每个群体对内容"六轴配方"有自己的偏好权重。
// 引擎会用这些权重把一份内容翻译成七种截然不同的情绪反应。
// weights 中的正数=喜欢，负数=反感；未列出的轴=不在意。
// ============================================================================

export const AUDIENCES: AudienceGroup[] = [
  {
    id: "oldFans",
    name: "老粉",
    emoji: "🎧",
    desc: "从他还在打青训就关注的人。爱他的认真，怕他变味。",
    weights: {
      authenticity: 1.4,
      drift: -1.6,
      controversy: -0.5,
      flow: -0.2,
    },
  },
  {
    id: "casual",
    name: "路人",
    emoji: "👀",
    desc: "刷到什么看什么。要爽、要炸、要有梗，不在乎你专不专业。",
    weights: {
      flow: 1.2,
      controversy: 0.9,
      drift: 0.6,
      authenticity: -0.3,
    },
  },
  {
    id: "hardcore",
    name: "硬核玩家",
    emoji: "🧠",
    desc: "只认干货和理解深度。最讨厌标题党和不懂装懂。",
    weights: {
      authenticity: 1.6,
      drift: -1.0,
      flow: -0.7,
      controversy: -0.2,
    },
  },
  {
    id: "brandPR",
    name: "品牌方",
    emoji: "💼",
    desc: "盯着数据和调性。要热度，但更怕塌房和黑红。",
    weights: {
      flow: 1.0,
      controversy: -1.3,
      drift: -0.4,
      money: 0.5,
    },
  },
  {
    id: "haters",
    name: "黑粉",
    emoji: "🔥",
    desc: "他越破防、越翻车，他们越兴奋。争议就是他们的养料。",
    weights: {
      controversy: 1.7,
      drift: 1.1,
      authenticity: -0.6,
    },
  },
  {
    id: "algorithm",
    name: "平台算法",
    emoji: "📈",
    desc: "没有感情的分发机器。谁能留住人、点燃互动，就推谁。",
    weights: {
      flow: 1.5,
      controversy: 1.0,
      drift: 0.3,
      authenticity: -0.1,
    },
  },
  {
    id: "peers",
    name: "同行",
    emoji: "🎬",
    desc: "别的主播和创作者。尊重真本事，鄙视蹭热度和内涵同行。",
    weights: {
      authenticity: 1.1,
      controversy: -0.9,
      drift: -0.8,
      flow: 0.2,
    },
  },
];

export const AUDIENCE_MAP: Record<string, AudienceGroup> = Object.fromEntries(
  AUDIENCES.map((a) => [a.id, a]),
);
