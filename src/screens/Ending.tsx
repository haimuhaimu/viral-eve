import { motion } from "framer-motion";
import { RotateCcw, Eye, TrendingUp, Award } from "lucide-react";
import type { Ending, GameState } from "@/game/types";
import { formatCount } from "@/lib/display";
import { FengYeAvatar } from "@/components/game/Avatar";
import { MetricsHUD } from "@/components/game/MetricsHUD";
import { PrimaryButton, Panel, Tag } from "@/components/game/ui";
import { cn } from "@/lib/utils";

const TONE: Record<
  Ending["tone"],
  { ring: string; title: string; badge: string; label: string }
> = {
  good: {
    ring: "from-emerald-500/40 to-teal-500/30",
    title: "from-emerald-200 to-teal-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    label: "圆满结局",
  },
  bad: {
    ring: "from-rose-600/40 to-red-600/30",
    title: "from-rose-200 to-red-400",
    badge: "bg-rose-500/20 text-rose-300",
    label: "崩坏结局",
  },
  gray: {
    ring: "from-zinc-500/30 to-slate-500/20",
    title: "from-zinc-200 to-zinc-400",
    badge: "bg-zinc-500/20 text-zinc-300",
    label: "灰色结局",
  },
  tragic: {
    ring: "from-fuchsia-600/40 to-orange-600/30",
    title: "from-fuchsia-200 to-orange-300",
    badge: "bg-fuchsia-500/20 text-fuchsia-300",
    label: "悲剧结局",
  },
};

export default function EndingScreen({
  state,
  ending,
  onRestart,
}: {
  state: GameState;
  ending: Ending;
  onRestart: () => void;
}) {
  const tone = TONE[ending.tone];
  const clownFree = state.metrics.personaDrift < 45;
  const famous = state.metrics.followers >= 22000;

  return (
    <div className="ve-grid-bg relative min-h-screen w-full overflow-hidden">
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <span className={cn("mb-5 rounded-full px-3 py-1 text-xs font-bold tracking-widest", tone.badge)}>
            {tone.label}
          </span>

          <FengYeAvatar metrics={state.metrics} size={110} showStatus />

          <h1
            className={cn(
              "mt-6 bg-gradient-to-br bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl",
              tone.title,
            )}
          >
            {ending.title}
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-zinc-400">{ending.tagline}</p>
        </motion.div>

        {/* 叙事正文 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 space-y-3"
        >
          {ending.body.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.35 }}
              className="text-center text-base leading-relaxed text-zinc-200"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* 对核心问题的回答 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + ending.body.length * 0.35 + 0.2 }}
          className="mt-10"
        >
          <Panel className="p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-500">这一局，你的答卷</p>
            <p className="mt-2 text-lg font-bold leading-relaxed text-white">
              {famous && clownFree
                ? "你让他红了，也让他还是他自己。"
                : famous && !clownFree
                  ? "你让他红了 —— 代价是，他不再是原来那个冯野。"
                  : !famous && clownFree
                    ? "你守住了他，只是这一次，世界还没看见他。"
                    : "热度没来，人也走了样。这条路，你们都走得辛苦。"}
            </p>
          </Panel>
        </motion.div>

        {/* 数据总结 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + ending.body.length * 0.35 + 0.4 }}
          className="mt-8 space-y-4"
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <SummaryStat icon={<TrendingUp size={15} />} label="最终粉丝" value={formatCount(state.metrics.followers)} />
            <SummaryStat icon={<Eye size={15} />} label="累计播放" value={formatCount(state.stats.totalViews)} />
            <SummaryStat icon={<Eye size={15} />} label="单条最高" value={formatCount(state.stats.peakViews)} />
            <SummaryStat icon={<Award size={15} />} label="爆款次数" value={String(state.history.filter((h) => h.viralHit).length)} />
          </div>

          <MetricsHUD metrics={state.metrics} />

          {state.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-xs text-zinc-500">最终标签：</span>
              {state.tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          )}
        </motion.div>

        <div className="mt-10 flex justify-center pb-6">
          <PrimaryButton onClick={onRestart}>
            <RotateCcw size={18} />
            再操盘一次
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="mb-1 flex items-center justify-center gap-1 text-[11px] text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="font-mono-num text-lg font-bold text-white">{value}</div>
    </div>
  );
}
