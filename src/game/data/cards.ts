import type { ContentCard } from "../types";

// ============================================================================
// 内容卡池。玩家从五个类别里各选一张，组装出今天的内容策略。
// 这是游戏的核心交互 —— 不是 A/B/C 剧情选项，而是"配方"。
// 每张卡只描述它对六条轴线的推力；受众如何反应由引擎推导。
// ============================================================================

// —— 选题（topic）——
const TOPICS: ContentCard[] = [
  {
    id: "topic_patch",
    category: "topic",
    name: "深度版本解析",
    desc: "拆解新版本改动，讲清楚强弱背后的逻辑。",
    flavor: "这才是我想做的东西。",
    effects: { flow: 1, authenticity: 6, drift: 0, controversy: 0, stress: 2, money: 0 },
  },
  {
    id: "topic_op_rant",
    category: "topic",
    name: "版本强势英雄吐槽",
    desc: "锐评当前最离谱的强势英雄，观点鲜明。",
    flavor: "骂得对，但骂着骂着就停不下来。",
    effects: { flow: 4, authenticity: 2, drift: 1, controversy: 3, stress: 1, money: 0 },
  },
  {
    id: "topic_memoir",
    category: "topic",
    name: "电竞青训回忆录",
    desc: "讲那段没能打上职业的日子，真实、克制。",
    flavor: "有些事我其实不太想再提。",
    effects: { flow: 2, authenticity: 4, drift: 0, controversy: 1, stress: 2, money: 0 },
  },
  {
    id: "topic_trashtalk",
    category: "topic",
    name: "对线嘴臭名场面",
    desc: "把直播里最炸裂的对喷时刻剪成合集。",
    flavor: "我知道这个火，但那真的是我吗？",
    effects: { flow: 6, authenticity: 0, drift: 4, controversy: 5, stress: 1, money: 1 },
  },
  {
    id: "topic_guide",
    category: "topic",
    name: "硬核上分攻略",
    desc: "手把手教怎么爬分，全是实操干货。",
    flavor: "费劲，但对得起看的人。",
    effects: { flow: 3, authenticity: 5, drift: 0, controversy: 0, stress: 2, money: 0 },
  },
];

// —— 立场（stance）——
const STANCES: ContentCard[] = [
  {
    id: "stance_sincere",
    category: "stance",
    name: "真诚硬核",
    desc: "把观点讲透，不迎合、不表演。",
    flavor: "我赌还有人爱看讲道理的。",
    effects: { flow: 0, authenticity: 5, drift: -3, controversy: 0, stress: 1, money: 0 },
  },
  {
    id: "stance_explode",
    category: "stance",
    name: "情绪爆发",
    desc: "把情绪拉满，破防、拍桌、飙金句。",
    flavor: "一激动，弹幕就疯了。",
    effects: { flow: 5, authenticity: -1, drift: 4, controversy: 4, stress: 3, money: 0 },
  },
  {
    id: "stance_snark",
    category: "stance",
    name: "阴阳怪气",
    desc: "不明说，全靠内涵和反讽拉扯。",
    flavor: "省事，但迟早得罪人。",
    effects: { flow: 3, authenticity: 0, drift: 2, controversy: 3, stress: 1, money: 0 },
  },
  {
    id: "stance_pander",
    category: "stance",
    name: "迎合流量",
    desc: "怎么火怎么来，观众想听什么就说什么。",
    flavor: "这不是我，但这有人看。",
    effects: { flow: 5, authenticity: -3, drift: 3, controversy: 1, stress: 0, money: 1 },
  },
  {
    id: "stance_calm",
    category: "stance",
    name: "冷静中立",
    desc: "不站队、不煽动，稳稳地把事说明白。",
    flavor: "安全，但没人会转发'稳'。",
    effects: { flow: -1, authenticity: 3, drift: -1, controversy: -2, stress: 0, money: 0 },
  },
];

// —— 形式（format）——
const FORMATS: ContentCard[] = [
  {
    id: "format_longform",
    category: "format",
    name: "长视频深度解说",
    desc: "二十分钟，把逻辑一层层讲清楚。",
    flavor: "完播率是渣，但懂的人会懂。",
    effects: { flow: -1, authenticity: 5, drift: -1, controversy: 0, stress: 3, money: 0 },
  },
  {
    id: "format_shortclip",
    category: "format",
    name: "短视频高能剪辑",
    desc: "十五秒一个高潮，全是名场面。",
    flavor: "算法最爱这个，我最怕这个。",
    effects: { flow: 5, authenticity: -1, drift: 3, controversy: 1, stress: 1, money: 0 },
  },
  {
    id: "format_livecut",
    category: "format",
    name: "直播切片",
    desc: "把直播里的高光即时切出来投喂。",
    flavor: "省力，但主打一个不受控。",
    effects: { flow: 3, authenticity: 1, drift: 1, controversy: 2, stress: 0, money: 0 },
  },
  {
    id: "format_article",
    category: "format",
    name: "图文长测评",
    desc: "认真写一篇，配数据配图。",
    flavor: "写的人认真，刷的人划走。",
    effects: { flow: -2, authenticity: 4, drift: -1, controversy: 0, stress: 2, money: 0 },
  },
  {
    id: "format_pk",
    category: "format",
    name: "直播连麦对线",
    desc: "和另一个主播连麦，当场辩到脸红。",
    flavor: "刺激，就是容易上头翻车。",
    effects: { flow: 4, authenticity: 1, drift: 2, controversy: 5, stress: 3, money: 0 },
  },
];

// —— 标题钩子（hook）——
const HOOKS: ContentCard[] = [
  {
    id: "hook_restrained",
    category: "hook",
    name: "克制专业",
    desc: "《新版本打野节奏，到底变在哪》",
    flavor: "标题老实，点进来的都是真爱。",
    effects: { flow: -1, authenticity: 3, drift: -1, controversy: 0, stress: 0, money: 0 },
  },
  {
    id: "hook_suspense",
    category: "hook",
    name: "悬念感",
    desc: "《这个改动，90% 的人都理解错了》",
    flavor: "留个钩子，不算骗。",
    effects: { flow: 3, authenticity: 1, drift: 0, controversy: 0, stress: 0, money: 0 },
  },
  {
    id: "hook_clickbait",
    category: "hook",
    name: "冲突标题党",
    desc: "《忍不了！这英雄不削我就退游》",
    flavor: "点击率翻倍，脸皮减半。",
    effects: { flow: 5, authenticity: -2, drift: 3, controversy: 4, stress: 0, money: 0 },
  },
  {
    id: "hook_trend",
    category: "hook",
    name: "蹭爆款热点",
    desc: "《XX 主播塌房，我说句公道话》",
    flavor: "流量是别人的瓜给的。",
    effects: { flow: 5, authenticity: -1, drift: 2, controversy: 3, stress: 0, money: 1 },
  },
  {
    id: "hook_pity",
    category: "hook",
    name: "卖惨钩子",
    desc: "《房租下周到期，这可能是最后一期》",
    flavor: "有用，但说出口那刻我有点恶心自己。",
    effects: { flow: 4, authenticity: -1, drift: 3, controversy: 2, stress: 2, money: 1 },
  },
];

// —— 牺牲 / 代价（sacrifice）——
const SACRIFICES: ContentCard[] = [
  {
    id: "sac_hold",
    category: "sacrifice",
    name: "守住底线",
    desc: "不为流量做任何自己会后悔的事。",
    flavor: "至少今晚睡得着。",
    effects: { flow: -1, authenticity: 3, drift: -2, controversy: -1, stress: -1, money: 0 },
  },
  {
    id: "sac_allnighter",
    category: "sacrifice",
    name: "熬夜赶工",
    desc: "通宵打磨，把质量抠到极致。",
    flavor: "质量上去了，人快下去了。",
    effects: { flow: 1, authenticity: 4, drift: 0, controversy: 0, stress: 5, money: 0 },
  },
  {
    id: "sac_peers",
    category: "sacrifice",
    name: "内涵同行",
    desc: "拿别的主播当垫脚石换热度。",
    flavor: "圈子就这么大，账迟早要还。",
    effects: { flow: 3, authenticity: 0, drift: 2, controversy: 5, stress: 1, money: 0 },
  },
  {
    id: "sac_oldfans",
    category: "sacrifice",
    name: "消费老粉",
    desc: "把老粉的情怀和信任当流量筹码。",
    flavor: "他们信我，我却在用这份信任。",
    effects: { flow: 3, authenticity: -1, drift: 3, controversy: 1, stress: 1, money: 2 },
  },
  {
    id: "sac_credibility",
    category: "sacrifice",
    name: "透支专业信誉",
    desc: "为一个爆点，说自己都不信的话。",
    flavor: "火一次，专业招牌就掉一块漆。",
    effects: { flow: 5, authenticity: -4, drift: 4, controversy: 3, stress: 1, money: 1 },
  },
  {
    id: "sac_clown",
    category: "sacrifice",
    name: "放下身段整活",
    desc: "夸张表情、鬼畜梗，怎么离谱怎么来。",
    flavor: "他们要小丑，那我就给他们小丑。",
    effects: { flow: 6, authenticity: -2, drift: 6, controversy: 3, stress: 0, money: 1 },
  },
];

export const CARD_POOL: Record<string, ContentCard[]> = {
  topic: TOPICS,
  stance: STANCES,
  format: FORMATS,
  hook: HOOKS,
  sacrifice: SACRIFICES,
};

export const CATEGORY_META: {
  key: keyof typeof CARD_POOL;
  label: string;
  question: string;
  icon: string;
}[] = [
  { key: "topic", label: "选题", question: "今天做什么内容？", icon: "🎯" },
  { key: "stance", label: "立场", question: "用什么态度去讲？", icon: "🎭" },
  { key: "format", label: "形式", question: "以什么形态发出去？", icon: "🎞️" },
  { key: "hook", label: "标题钩子", question: "怎么让人点进来？", icon: "🪝" },
  { key: "sacrifice", label: "牺牲 / 代价", question: "为这次爆点，你愿意付出什么？", icon: "⚖️" },
];
