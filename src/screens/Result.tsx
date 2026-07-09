import { motion } from "framer-motion";
import { BarChart3, Eye, Flame, MessageSquare, Tag as TagIcon, ArrowRight, Trophy } from "lucide-react";
import type { CreatorMetrics, DayResult, AudienceReaction } from "@/game/types";
import { TOTAL_DAYS } from "@/game/types";
import { formatCount, sentimentColor } from "@/lib/display";
import { MetricsHUD } from "@/components/game/MetricsHUD";
import { FengYeAvatar } from "@/components/game/Avatar";
import { Panel, PrimaryButton, Tag, SectionLabel } from "@/components/game/ui";
import { cn } from "@/lib/utils";

function ReactionRow({ r }: { r: AudienceReaction }) {
  const pct = Math.round(Math.abs(r.sentiment) * 50);
  const pos = r.sentiment >= 0;
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-200">
          <span>{r.emoji}</span>
          {r.name}
        </div>
        <span className={cn("text-xs font-bold", sentimentColor(r.sentiment))}>{r.label}</span>
      </div>
      {/* 双向情绪条 */}
      <div className="relative mt-2 h-1.5 w-full rounded-full bg-white/10">
        <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-white/25" />
        <motion.div
          className={cn("absolute top-0 h-full rounded-full", pos ? "bg-emerald-500" : "bg-rose-500")}
          style={pos ? { left: "50%" } : { right: "50%" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-zinc-400">
        <MessageSquare size={12} className="mt-0.5 shrink-0 text-zinc-600" />
        {r.comment}
      </p>
    </div>
  );
}

export default function Result({
  result,
  metrics,
  onContinue,
}: {
  result: DayResult;
  metrics: CreatorMetrics;
  onContinue: () => void;
}) {
  const deltas = {
    followers: result.followerDelta,
    money: result.moneyDelta,
    trust: result.trustDelta,
    expertise: result.expertiseDelta,
    personaDrift: result.driftDelta,
    stress: result.stressDelta,
  };
  const isLast = result.day >= TOTAL_DAYS;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-6">
      <SectionLabel icon={<BarChart3 size={13} />}>数据结算 · Day {result.day}</SectionLabel>

      <div className="space-y-5">
        {/* 播放量头图 */}
        <Panel glow className="overflow-hidden">
          <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  result.viralHit ? "bg-rose-500/20" : "bg-white/5",
                )}
              >
                {result.viralHit ? (
                  <Flame size={30} className="text-rose-400" />
                ) : (
                  <Eye size={28} className="text-zinc-400" />
                )}
              </div>
              <div>
                <div className="font-mono-num text-3xl font-black text-white">
                  {formatCount(result.views)}
                </div>
                <div className="text-xs text-zinc-400">
                  次播放 {result.viralHit && <span className="font-bold text-rose-300">· 爆款！</span>}
                </div>
              </div>
            </div>
            {result.newTags.length > 0 && (
              <div className="text-center sm:text-right">
                <div className="mb-1.5 flex items-center justify-center gap-1 text-[11px] uppercase tracking-widest text-zinc-500 sm:justify-end">
                  <TagIcon size={11} /> 平台现在把他看成
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 sm:justify-end">
                  {result.newTags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* 指标变化 */}
        <div>
          <SectionLabel>指标变化</SectionLabel>
          <MetricsHUD metrics={metrics} deltas={deltas} />
        </div>

        {/* 冯野的反应 */}
        <Panel className="border-rose-500/15 bg-gradient-to-r from-rose-500/[0.06] to-transparent p-5">
          <div className="flex items-center gap-4">
            <FengYeAvatar metrics={metrics} size={64} />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-rose-300">
                冯野看到数据后
              </div>
              <p className="mt-1 text-base font-medium italic leading-relaxed text-zinc-100">
                「{result.creatorLine}」
              </p>
            </div>
          </div>
        </Panel>

        {/* 七大受众反应 */}
        <div>
          <SectionLabel icon={<MessageSquare size={13} />}>七个圈层怎么看</SectionLabel>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {result.reactions.map((r) => (
              <ReactionRow key={r.id} r={r} />
            ))}
          </div>
        </div>

        <div className="flex justify-end pb-2">
          <PrimaryButton onClick={onContinue}>
            {isLast ? (
              <>
                <Trophy size={18} /> 见证冯野的结局
              </>
            ) : (
              <>
                进入第 {result.day + 1} 天
                <ArrowRight size={18} />
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
