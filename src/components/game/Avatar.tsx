import type { CreatorMetrics } from "@/game/types";
import { cn } from "@/lib/utils";

export type Mood = "neutral" | "content" | "down" | "manic" | "burnt";

/** 依据当前指标推断冯野此刻的状态。 */
export function moodOf(m: CreatorMetrics): Mood {
  if (m.stress >= 78) return "burnt";
  if (m.personaDrift >= 58) return "manic";
  if (m.trust <= 34 || m.money <= 500) return "down";
  if (m.expertise >= 68 && m.trust >= 58) return "content";
  return "neutral";
}

const MOOD_RING: Record<Mood, string> = {
  neutral: "from-sky-500/40 to-violet-500/40",
  content: "from-emerald-500/50 to-teal-400/40",
  down: "from-zinc-600/40 to-slate-600/40",
  manic: "from-fuchsia-500/60 to-rose-500/50",
  burnt: "from-orange-600/50 to-red-600/40",
};

const MOOD_LABEL: Record<Mood, string> = {
  neutral: "还在琢磨",
  content: "眼里有光",
  down: "有点丧",
  manic: "有点上头",
  burnt: "快撑不住了",
};

/** 表情：不同心情画不同的嘴和眉。 */
function Face({ mood, size }: { mood: Mood; size: number }) {
  const s = size;
  // 眼睛 y、嘴巴路径随心情变化
  const eyeY = s * 0.42;
  const mouth: Record<Mood, string> = {
    neutral: `M ${s * 0.36} ${s * 0.62} Q ${s * 0.5} ${s * 0.66} ${s * 0.64} ${s * 0.62}`,
    content: `M ${s * 0.35} ${s * 0.6} Q ${s * 0.5} ${s * 0.72} ${s * 0.65} ${s * 0.6}`,
    down: `M ${s * 0.36} ${s * 0.66} Q ${s * 0.5} ${s * 0.58} ${s * 0.64} ${s * 0.66}`,
    manic: `M ${s * 0.32} ${s * 0.58} Q ${s * 0.5} ${s * 0.8} ${s * 0.68} ${s * 0.58}`,
    burnt: `M ${s * 0.37} ${s * 0.66} L ${s * 0.63} ${s * 0.66}`,
  };
  const isManic = mood === "manic";
  const isBurnt = mood === "burnt";

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="relative z-10">
      {/* 头 */}
      <rect
        x={s * 0.18}
        y={s * 0.2}
        width={s * 0.64}
        height={s * 0.64}
        rx={s * 0.22}
        className="fill-zinc-100"
      />
      {/* 头发 */}
      <path
        d={`M ${s * 0.18} ${s * 0.44} Q ${s * 0.2} ${s * 0.16} ${s * 0.5} ${s * 0.16} Q ${s * 0.8} ${s * 0.16} ${s * 0.82} ${s * 0.44} L ${s * 0.82} ${s * 0.36} Q ${s * 0.5} ${s * 0.26} ${s * 0.18} ${s * 0.36} Z`}
        className="fill-zinc-800"
      />
      {/* 眼睛 */}
      {isBurnt ? (
        <>
          <line x1={s * 0.32} y1={eyeY} x2={s * 0.42} y2={eyeY} className="stroke-zinc-700" strokeWidth={s * 0.03} strokeLinecap="round" />
          <line x1={s * 0.58} y1={eyeY} x2={s * 0.68} y2={eyeY} className="stroke-zinc-700" strokeWidth={s * 0.03} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={s * 0.37} cy={eyeY} r={isManic ? s * 0.055 : s * 0.04} className="fill-zinc-900" />
          <circle cx={s * 0.63} cy={eyeY} r={isManic ? s * 0.055 : s * 0.04} className="fill-zinc-900" />
        </>
      )}
      {/* 嘴 */}
      <path d={mouth[mood]} className="fill-none stroke-zinc-800" strokeWidth={s * 0.035} strokeLinecap="round" />
      {/* 耳机头梁 */}
      <path
        d={`M ${s * 0.16} ${s * 0.46} Q ${s * 0.5} ${s * 0.06} ${s * 0.84} ${s * 0.46}`}
        className="fill-none stroke-rose-500"
        strokeWidth={s * 0.05}
        strokeLinecap="round"
      />
      {/* 耳罩 */}
      <rect x={s * 0.1} y={s * 0.42} width={s * 0.1} height={s * 0.16} rx={s * 0.04} className="fill-rose-500" />
      <rect x={s * 0.8} y={s * 0.42} width={s * 0.1} height={s * 0.16} rx={s * 0.04} className="fill-rose-500" />
    </svg>
  );
}

export function FengYeAvatar({
  metrics,
  size = 96,
  showStatus = false,
  live = false,
}: {
  metrics: CreatorMetrics;
  size?: number;
  showStatus?: boolean;
  live?: boolean;
}) {
  const mood = moodOf(metrics);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className={cn(
            "absolute inset-0 rounded-2xl bg-gradient-to-br blur-md",
            MOOD_RING[mood],
          )}
        />
        <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-white/15 bg-zinc-900/80">
          <Face mood={mood} size={size * 0.86} />
        </div>
        {live && (
          <div className="absolute -right-1 -top-1 flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
            <span className="ve-live-dot h-1.5 w-1.5 rounded-full bg-white" />
            LIVE
          </div>
        )}
      </div>
      {showStatus && (
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
          冯野现在 · {MOOD_LABEL[mood]}
        </span>
      )}
    </div>
  );
}
