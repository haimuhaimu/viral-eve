// ============================================================================
// 类型定义 —— 游戏数据与模拟逻辑的公共契约
// 所有 UI 组件都依赖这里，但这里绝不依赖任何 UI。
// ============================================================================

/** 创作者的七项核心指标 —— 一个人，而不是一堆数字。 */
export interface CreatorMetrics {
  followers: number; // 粉丝数
  money: number; // 账户余额（元）
  trust: number; // 长期信任 0-100
  expertise: number; // 专业度 0-100
  personaDrift: number; // 人设偏移 0-100（越高越像小丑）
  stress: number; // 压力 0-100
}

/** 内容释放后累积产生的观测数据（不属于长期状态，仅记录）。 */
export interface CreatorStats {
  totalViews: number; // 累计播放
  peakViews: number; // 单条最高播放
  notoriety: number; // 累计争议度（用于判定"黑红/塌房"）
}

/** 平台给创作者贴的标签，会随内容风格漂移。 */
export type PlatformTag =
  | "硬核老哥"
  | "专业分析"
  | "情绪大师"
  | "整活顶流"
  | "对线狂魔"
  | "恰饭选手"
  | "版本先知"
  | "破防现场"
  | "查无此人";

/** 内容卡的五个维度类别。 */
export type CardCategory =
  | "topic" // 选题
  | "stance" // 立场
  | "format" // 形式
  | "hook" // 标题钩子
  | "sacrifice"; // 牺牲 / 代价

/**
 * 一张内容卡对内容"配方"六条内在轴线的加权。
 * 这些轴线是纯数值，模拟引擎据此推导所有受众反应，
 * 使数据与逻辑彻底分离。
 */
export interface CardEffects {
  flow: number; // 流量势能（吃算法、涨播放）
  authenticity: number; // 真诚 / 专业含量
  drift: number; // 人设偏移推力
  controversy: number; // 争议 / 冲突强度
  stress: number; // 制作与心理消耗
  money: number; // 直接变现潜力
}

export interface ContentCard {
  id: string;
  category: CardCategory;
  name: string;
  desc: string; // 玩家看到的短描述
  flavor: string; // 冯野视角的一句吐槽
  effects: CardEffects;
}

/** 玩家最终组装出的一份内容策略。 */
export interface ContentDraft {
  topic: ContentCard;
  stance: ContentCard;
  format: ContentCard;
  hook: ContentCard;
  sacrifice: ContentCard;
}

/** 七个受众群体。 */
export type AudienceId =
  | "oldFans" // 老粉
  | "casual" // 路人
  | "hardcore" // 硬核玩家
  | "brandPR" // 品牌方
  | "haters" // 黑粉
  | "algorithm" // 平台算法
  | "peers"; // 同行

export interface AudienceGroup {
  id: AudienceId;
  name: string;
  emoji: string;
  desc: string;
  /** 对六条轴线的偏好权重，用于计算情绪。 */
  weights: Partial<Record<keyof CardEffects, number>>;
}

/** 单个受众群体对一条内容的反应结果。 */
export interface AudienceReaction {
  id: AudienceId;
  name: string;
  emoji: string;
  sentiment: number; // -1 ~ 1
  intensity: number; // 0 ~ 1 参与热度
  label: string; // "炸锅了" / "沉默" 等
  comment: string; // 一条代表性评论
}

/** 每天的平台简报。 */
export interface DailyBriefing {
  day: number;
  headline: string; // 今日大盘热点
  trendTag: string; // 热点标签
  /** 对应轴线在今天会被算法额外放大。 */
  trendBoost: keyof CardEffects;
  pressure: string; // 来自平台 / 运营的压力话术
  tip: string; // 给玩家的一句提示
}

/** 品牌合作邀约。 */
export interface BrandDeal {
  id: string;
  brand: string;
  offer: string; // 邀约内容描述
  money: number; // 报酬
  driftCost: number; // 接受后的人设偏移代价
  trustCost: number; // 接受后的信任代价
  requireTag?: PlatformTag; // 需要某标签才会出现
}

/** 一天结算后的完整快照，供结果页与历史回看使用。 */
export interface DayResult {
  day: number;
  draft: ContentDraft;
  effects: CardEffects; // 合成后的配方
  views: number;
  followerDelta: number;
  moneyDelta: number;
  trustDelta: number;
  expertiseDelta: number;
  driftDelta: number;
  stressDelta: number;
  reactions: AudienceReaction[];
  newTags: PlatformTag[];
  creatorLine: string; // 冯野看到数据后的一句反应
  viralHit: boolean; // 是否爆了
}

/** 整局游戏状态。 */
export interface GameState {
  day: number; // 当前第几天（1-based）
  metrics: CreatorMetrics;
  stats: CreatorStats;
  tags: PlatformTag[];
  history: DayResult[];
  acceptedDeals: string[]; // 已接受的邀约 id
}

export type Screen =
  | "landing"
  | "room"
  | "briefing"
  | "crafting"
  | "feed"
  | "result"
  | "ending";

/** 结局定义。 */
export interface Ending {
  id: string;
  title: string;
  tagline: string;
  body: string[];
  tone: "good" | "bad" | "gray" | "tragic";
  /** 判定函数：满足即命中，先命中者优先。 */
  match: (s: GameState) => boolean;
}

export const TOTAL_DAYS = 7;
