import type { BrandDeal } from "../types";

// ============================================================================
// 品牌合作邀约。按天可能出现，玩家在当日简报里选择接受或拒绝。
// 接受 = 现金，但通常伴随人设偏移或信任代价 —— 恰饭是有价格的。
// key 为出现的天数。
// ============================================================================

export const BRAND_DEALS: Record<number, BrandDeal> = {
  2: {
    id: "deal_energy",
    brand: "「暴躁」能量饮料",
    offer: "让你在破防瞬间举罐豪饮，主打一个「越气越上头」。",
    money: 4000,
    driftCost: 8,
    trustCost: 4,
  },
  4: {
    id: "deal_gacha",
    brand: "某抽卡手游",
    offer: "口播推广，要求你说「这才是真正的电竞体验」。",
    money: 6500,
    driftCost: 10,
    trustCost: 9,
  },
  6: {
    id: "deal_gear",
    brand: "硬核外设品牌 KŌDA",
    offer: "赞助你做一期认真的设备测评，尊重你的专业调性。",
    money: 3500,
    driftCost: 1,
    trustCost: -3, // 反而加信任：粉丝觉得他终于接到了配得上的商单
  },
};
