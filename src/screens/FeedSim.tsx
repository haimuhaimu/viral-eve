import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Radio, ArrowRight, Flame } from "lucide-react";
import type { DayResult } from "@/game/types";
import { formatCount } from "@/lib/display";
import { PrimaryButton } from "@/components/game/ui";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration: number, start: boolean) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, start]);
  return val;
}

const sentimentBorder = (s: number) =>
  s > 0.3 ? "border-emerald-500/40" : s < -0.3 ? "border-rose-500/40" : "border-white/10";

export default function FeedSim({
  result,
  onContinue,
}: {
  result: DayResult;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<"posting" | "live" | "done">("posting");
  const views = useCountUp(result.views, 2200, phase !== "posting");

  // 评论按争议 / 热度排序，逐条冒出
  const bubbles = useMemo(
    () => [...result.reactions].sort((a, b) => b.intensity - a.intensity),
    [result],
  );
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("live"), 900);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "live") return;
    if (shown >= bubbles.length) {
      const t = setTimeout(() => setPhase("done"), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 480);
    return () => clearTimeout(t);
  }, [phase, shown, bubbles.length]);

  return (
    <div className="ve-grid-bg relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-5 py-8">
      {/* 顶部状态 */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-semibold">
        {phase === "posting" ? (
          <>
            <Play size={13} className="text-rose-400" /> 正在发布到信息流…
          </>
        ) : (
          <>
            <Radio size={13} className="ve-live-dot text-rose-400" /> 内容已进入推荐池
          </>
        )}
      </div>

      <div className="grid w-full gap-6 md:grid-cols-2">
        {/* 左：模拟手机里的这条内容 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="overflow-hidden rounded-[26px] border border-white/15 bg-zinc-900/80 p-2 shadow-2xl">
            <div className="rounded-[20px] bg-gradient-to-br from-zinc-800 to-zinc-900 p-4">
              {/* 视频占位 */}
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/20 via-zinc-800 to-violet-500/20">
                {result.viralHit && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-black text-white"
                  >
                    <Flame size={12} /> 爆了
                  </motion.div>
                )}
                <Play size={40} className="text-white/70" fill="currentColor" />
              </div>
              <p className="mt-3 text-sm font-bold leading-snug text-white">
                {result.draft.hook.desc}
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">
                @野王没上过王座 · {result.draft.topic.name}
              </p>
              <div className="mt-3 flex items-center gap-4 border-t border-white/5 pt-3 text-xs text-zinc-300">
                <span className="flex items-center gap-1 font-mono-num font-bold text-rose-300">
                  <Eye size={14} /> {formatCount(views)}
                </span>
                <span className="text-zinc-500">次播放</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 右：评论风暴 */}
        <div className="relative min-h-[360px]">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
            信息流反应 · 实时
          </div>
          <div className="ve-scroll flex max-h-[420px] flex-col gap-2.5 overflow-y-auto pr-1">
            <AnimatePresence>
              {bubbles.slice(0, shown).map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 24, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={cn(
                    "rounded-2xl rounded-tl-sm border bg-white/[0.04] px-3.5 py-2.5",
                    sentimentBorder(r.sentiment),
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                    <span className="text-sm">{r.emoji}</span>
                    {r.name}
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500">{r.label}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-zinc-100">{r.comment}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-8 h-14">
        <AnimatePresence>
          {phase === "done" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <PrimaryButton onClick={onContinue}>
                看看这条改变了什么
                <ArrowRight size={18} />
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
