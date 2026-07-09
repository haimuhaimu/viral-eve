import { useState } from "react";
import { motion } from "framer-motion";
import { Radar, TrendingUp, AlertTriangle, Lightbulb, Briefcase, Check, X, ArrowRight } from "lucide-react";
import type { BrandDeal, DailyBriefing } from "@/game/types";
import { AXIS_LABEL, formatMoney } from "@/lib/display";
import { Panel, PrimaryButton, GhostButton, SectionLabel } from "@/components/game/ui";

export default function Briefing({
  briefing,
  deal,
  onProceed,
}: {
  briefing: DailyBriefing;
  deal: BrandDeal | null;
  onProceed: (dealAccepted: boolean) => void;
}) {
  const [decision, setDecision] = useState<null | boolean>(deal ? null : false);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <SectionLabel icon={<Radar size={13} />}>今日平台简报 · Day {briefing.day}</SectionLabel>

        {/* 大盘热点 */}
        <Panel glow className="overflow-hidden">
          <div className="border-b border-white/5 bg-gradient-to-r from-rose-500/10 to-transparent px-6 py-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
              <TrendingUp size={12} /> 今日热榜 {briefing.trendTag}
            </span>
          </div>
          <div className="p-6">
            <p className="text-lg font-bold leading-relaxed text-white">{briefing.headline}</p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3">
              <TrendingUp size={16} className="shrink-0 text-sky-300" />
              <p className="text-sm text-zinc-300">
                今天算法额外加权：
                <span className="font-bold text-sky-300"> {AXIS_LABEL[briefing.trendBoost]} </span>
                方向的内容，触达更高。
              </p>
            </div>
          </div>
        </Panel>

        {/* 平台压力 + 提示 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel className="p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-300">
              <AlertTriangle size={13} /> 来自平台的压力
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">{briefing.pressure}</p>
          </Panel>
          <Panel className="p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <Lightbulb size={13} /> 操盘手提示
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">{briefing.tip}</p>
          </Panel>
        </div>

        {/* 品牌合作邀约 */}
        {deal && (
          <Panel className="border-amber-500/20 bg-amber-500/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Briefcase size={13} /> 品牌合作邀约
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-base font-bold text-white">{deal.brand}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{deal.offer}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300">
                    报酬 {formatMoney(deal.money)}
                  </span>
                  {deal.driftCost > 1 && (
                    <span className="rounded-lg bg-rose-500/15 px-2.5 py-1 font-semibold text-rose-300">
                      人设偏移 +{deal.driftCost}
                    </span>
                  )}
                  {deal.trustCost > 0 && (
                    <span className="rounded-lg bg-orange-500/15 px-2.5 py-1 font-semibold text-orange-300">
                      信任 -{deal.trustCost}
                    </span>
                  )}
                  {deal.trustCost < 0 && (
                    <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300">
                      信任 +{-deal.trustCost}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <GhostButton active={decision === true} onClick={() => setDecision(true)}>
                  <Check size={16} className="text-emerald-400" /> 接受
                </GhostButton>
                <GhostButton active={decision === false} onClick={() => setDecision(false)}>
                  <X size={16} className="text-rose-400" /> 拒绝
                </GhostButton>
              </div>
            </div>
            {decision !== null && (
              <p className="mt-3 text-xs text-zinc-400">
                {decision
                  ? "你决定恰这顿饭 —— 钱到账，但代价会体现在今天的内容上。"
                  : "你婉拒了。有些钱，冯野现在还不想赚。"}
              </p>
            )}
          </Panel>
        )}

        <div className="flex justify-end">
          <PrimaryButton
            onClick={() => onProceed(decision === true)}
            disabled={deal !== null && decision === null}
          >
            去创作今天的内容
            <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </motion.div>
    </div>
  );
}
