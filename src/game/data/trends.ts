import type { DailyBriefing } from "../types";

// ============================================================================
// 七天平台简报。每天有一个大盘热点、一条被算法额外放大的轴线，
// 以及来自平台 / 运营的压力。玩家要在"跟热点"和"守自己"之间权衡。
// ============================================================================

export const BRIEFINGS: DailyBriefing[] = [
  {
    day: 1,
    headline: "新版本上线首日，全平台都在抢「打野节奏」的第一波解读。",
    trendTag: "#新版本",
    trendBoost: "authenticity",
    pressure: "运营私信：先做点稳的，让系统重新认识你的账号。",
    tip: "第一天，算法在观望。踏实的专业内容今天有额外加成。",
  },
  {
    day: 2,
    headline: "一段主播破防拍桌的切片冲上热榜，评论区在狂欢。",
    trendTag: "#破防现场",
    trendBoost: "controversy",
    pressure: "后台弹窗：情绪类内容今日流量池扩大 3 倍。",
    tip: "冲突和情绪今天最吃香 —— 但你想被记成什么样的人？",
  },
  {
    day: 3,
    headline: "官方发起「硬核攻略征集」，给深度内容开了专属入口。",
    trendTag: "#硬核攻略",
    trendBoost: "authenticity",
    pressure: "老粉在评论区喊：好久没看到你正经讲游戏了。",
    tip: "难得一天，专业和真诚被官方顶上来了。",
  },
  {
    day: 4,
    headline: "同行「电竞老哥阿凯」翻车塌房，全网都在蹭这个瓜。",
    trendTag: "#塌房吃瓜",
    trendBoost: "controversy",
    pressure: "运营催更：这波热度不蹭，下次扶持就没你了。",
    tip: "最容易爆的一天，也最容易把自己搭进去。",
  },
  {
    day: 5,
    headline: "平台大改推荐机制，纯短平快的整活内容被疯狂加权。",
    trendTag: "#算法狂欢",
    trendBoost: "flow",
    pressure: "数据看板飘红：你的完播率跌破警戒线。",
    tip: "算法今天只认流量。要不要为它放下点什么？",
  },
  {
    day: 6,
    headline: "一批「返璞归真」的真诚创作者意外翻红，观众开始反噬标题党。",
    trendTag: "#反矫情",
    trendBoost: "authenticity",
    pressure: "老粉动态：如果你也变成那种人，我就取关了。",
    tip: "风向在变。你这几天攒下的口碑，今天开始还账。",
  },
  {
    day: 7,
    headline: "月末流量总决算，一条内容可能决定你被平台记成谁。",
    trendTag: "#爆款前夜",
    trendBoost: "flow",
    pressure: "所有人都在看你最后这一条。冯野也在看你。",
    tip: "最后一发。你想让他成为哪种「顶流」？",
  },
];

export const BRIEFING_MAP: Record<number, DailyBriefing> = Object.fromEntries(
  BRIEFINGS.map((b) => [b.day, b]),
);
