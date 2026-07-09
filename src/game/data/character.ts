import type { CreatorMetrics, CreatorStats, PlatformTag } from "../types";

// ============================================================================
// MVP 主角：冯野 / Feng Ye
// 曾经的电竞青训，没能打上职业，如今是个二线游戏主播。
// 他想证明自己是真的懂游戏，但平台只奖励他破防炸毛的切片。
// ============================================================================

export const CREATOR = {
  name: "冯野",
  handle: "@野王没上过王座",
  age: 24,
  role: "二线游戏主播 · 前电竞青训",
  avatarSeed: "冯野",
  bio: "打不上职业的天赋，配上没人看的深度解说。",
  quote: "我是真的懂这游戏……只是没人想看懂游戏的我。",
  // 他真正在意的东西，玩家很容易忘掉：
  wants: "证明自己是高手，而不是一个表情包。",
  fears: "变成那种靠嗓门和破防活着的小丑主播。",
  // 开局背景：三十天倒计时里的第一周（本 MVP 只演七天）
  situation:
    "直播间日均在线不到两百人，房租下周到期，平台后台弹窗提示：你的账号已连续 14 天低于流量扶持线。",
} as const;

export const INITIAL_METRICS: CreatorMetrics = {
  followers: 12400,
  money: 2300,
  trust: 62,
  expertise: 71,
  personaDrift: 8,
  stress: 24,
};

export const INITIAL_STATS: CreatorStats = {
  totalViews: 0,
  peakViews: 0,
  notoriety: 0,
};

export const INITIAL_TAGS: PlatformTag[] = ["硬核老哥", "专业分析"];
