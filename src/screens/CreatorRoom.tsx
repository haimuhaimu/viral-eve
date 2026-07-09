import { motion } from "framer-motion";
import { ArrowRight, Home, Quote } from "lucide-react";
import type { GameState } from "@/game/types";
import { TOTAL_DAYS } from "@/game/types";
import { CREATOR } from "@/game/data/character";
import { FengYeAvatar, moodOf } from "@/components/game/Avatar";
import { MetricsHUD } from "@/components/game/MetricsHUD";
import { PrimaryButton, Tag, Panel, SectionLabel } from "@/components/game/ui";

const MOOD_THOUGHT: Record<string, string> = {
  neutral: "「今天该做点什么？我还没想好。」",
  content: "「有人是真的在看我讲游戏。这感觉，久违了。」",
  down: "「再这样下去，房租、粉丝、我自己，都要没了。」",
  manic: "「弹幕越吵我越兴奋……可停下来的时候，心里空空的。」",
  burnt: "「我好累。这还是我想做的事吗？」",
};

export default function CreatorRoom({
  state,
  onNext,
}: {
  state: GameState;
  onNext: () => void;
}) {
  const first = state.day === 1;
  const mood = moodOf(state.metrics);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <SectionLabel icon={<Home size={13} />}>创作者后台 · 冯野的直播间</SectionLabel>

        <Panel className="overflow-hidden">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <FengYeAvatar metrics={state.metrics} size={104} showStatus live />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-2xl font-black text-white">{CREATOR.name}</h2>
                <span className="font-mono-num text-xs text-zinc-500">{CREATOR.handle}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">{CREATOR.role}</p>

              <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/5 bg-black/20 p-3">
                <Quote size={15} className="mt-0.5 shrink-0 text-rose-400" />
                <p className="text-sm italic leading-relaxed text-zinc-300">
                  {first
                    ? `「${CREATOR.quote}」`
                    : MOOD_THOUGHT[mood]}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {state.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {first && (
          <Panel className="border-rose-500/20 bg-rose-500/[0.04] p-5">
            <p className="text-sm leading-relaxed text-zinc-300">
              <span className="font-bold text-rose-300">开局：</span>
              {CREATOR.situation}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              他想要的很简单 —— <span className="text-white">{CREATOR.wants}</span>
              他最怕的也很清楚 —— <span className="text-white">{CREATOR.fears}</span>
            </p>
          </Panel>
        )}

        <div>
          <SectionLabel>当前状态</SectionLabel>
          <MetricsHUD metrics={state.metrics} />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div>
            <div className="font-mono-num text-xs uppercase tracking-widest text-zinc-500">
              Day {state.day} / {TOTAL_DAYS}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-white">
              {first ? "第一天，从这里开始。" : "新的一天，平台又变了。"}
            </div>
          </div>
          <PrimaryButton onClick={onNext}>
            查看今日平台简报
            <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </motion.div>
    </div>
  );
}
