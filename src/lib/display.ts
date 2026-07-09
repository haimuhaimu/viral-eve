// ============================================================================
// 展示层辅助 —— 纯格式化与视觉配置，不含游戏逻辑。
// ============================================================================
import type { CreatorMetrics } from "@/game/types";

/** 把大数字格式化成中文习惯（1.2万）。 */
export function formatCount(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(2) + "亿";
  if (n >= 10000) return (n / 10000).toFixed(n >= 100000 ? 0 : 1) + "万";
  return n.toLocaleString("zh-CN");
}

export function formatMoney(n: number): string {
  return "¥" + Math.round(n).toLocaleString("zh-CN");
}

export function signed(n: number): string {
  return (n >= 0 ? "+" : "") + n.toLocaleString("zh-CN");
}

export type MetricKey = keyof CreatorMetrics;

export interface MetricMeta {
  key: MetricKey;
  label: string;
  icon: string; // lucide icon name (mapped in component)
  hint: string;
  /** 是否 0-100 的进度型指标。 */
  bar: boolean;
  /** 高好还是低好 —— 决定颜色语义。 */
  goodHigh: boolean;
  color: string; // tailwind text/accent color
  bg: string; // bar fill gradient classes
}

export const METRIC_META: MetricMeta[] = [
  {
    key: "followers",
    label: "粉丝",
    icon: "Users",
    hint: "看着他的人有多少",
    bar: false,
    goodHigh: true,
    color: "text-sky-300",
    bg: "from-sky-500 to-cyan-400",
  },
  {
    key: "money",
    label: "余额",
    icon: "Wallet",
    hint: "房租还差多少",
    bar: false,
    goodHigh: true,
    color: "text-amber-300",
    bg: "from-amber-500 to-yellow-400",
  },
  {
    key: "trust",
    label: "信任",
    icon: "HeartHandshake",
    hint: "观众还信不信他",
    bar: true,
    goodHigh: true,
    color: "text-emerald-300",
    bg: "from-emerald-500 to-teal-400",
  },
  {
    key: "expertise",
    label: "专业度",
    icon: "Brain",
    hint: "他到底懂不懂游戏",
    bar: true,
    goodHigh: true,
    color: "text-violet-300",
    bg: "from-violet-500 to-fuchsia-400",
  },
  {
    key: "personaDrift",
    label: "人设偏移",
    icon: "VenetianMask",
    hint: "离小丑还有多远",
    bar: true,
    goodHigh: false,
    color: "text-rose-300",
    bg: "from-rose-500 to-pink-500",
  },
  {
    key: "stress",
    label: "压力",
    icon: "Activity",
    hint: "他快撑不住了吗",
    bar: true,
    goodHigh: false,
    color: "text-orange-300",
    bg: "from-orange-500 to-red-500",
  },
];

/** 内容六轴的展示配置。 */
export const AXIS_META: {
  key: "flow" | "authenticity" | "drift" | "controversy" | "stress";
  label: string;
  desc: string;
  color: string;
  bar: string;
}[] = [
  { key: "flow", label: "流量势能", desc: "吃不吃算法", color: "text-sky-300", bar: "from-sky-500 to-cyan-400" },
  { key: "authenticity", label: "真诚专业", desc: "干不干货", color: "text-violet-300", bar: "from-violet-500 to-fuchsia-400" },
  { key: "drift", label: "人设偏移", desc: "离小丑多近", color: "text-rose-300", bar: "from-rose-500 to-pink-500" },
  { key: "controversy", label: "争议冲突", desc: "会不会炸", color: "text-orange-300", bar: "from-orange-500 to-red-500" },
  { key: "stress", label: "消耗代价", desc: "累不累", color: "text-amber-300", bar: "from-amber-500 to-yellow-400" },
];

export const AXIS_LABEL: Record<string, string> = {
  flow: "流量势能",
  authenticity: "真诚专业",
  drift: "人设偏移",
  controversy: "争议冲突",
  stress: "消耗代价",
  money: "变现",
};

/** 情绪值 -> 颜色。 */
export function sentimentColor(s: number): string {
  if (s > 0.35) return "text-emerald-400";
  if (s < -0.35) return "text-rose-400";
  if (s < -0.12) return "text-orange-300";
  return "text-zinc-400";
}

export function sentimentBar(s: number): string {
  if (s > 0.35) return "bg-emerald-500";
  if (s < -0.35) return "bg-rose-500";
  if (s < -0.12) return "bg-orange-400";
  return "bg-zinc-600";
}

/** 标签配色。 */
export function tagStyle(tag: string): string {
  const map: Record<string, string> = {
    专业分析: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    硬核老哥: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    版本先知: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    对线狂魔: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    破防现场: "bg-red-500/15 text-red-300 border-red-500/30",
    整活顶流: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    情绪大师: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    恰饭选手: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    查无此人: "bg-zinc-600/20 text-zinc-400 border-zinc-600/40",
  };
  return map[tag] ?? "bg-zinc-600/20 text-zinc-300 border-zinc-600/40";
}
