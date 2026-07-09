import { motion } from "framer-motion";
import type { CreatorMetrics } from "@/game/types";
import { METRIC_META, formatCount, formatMoney, signed } from "@/lib/display";
import { MetricIcon } from "./ui";
import { cn } from "@/lib/utils";

function metricValueText(key: string, v: number): string {
  if (key === "followers") return formatCount(v);
  if (key === "money") return formatMoney(v);
  return String(Math.round(v));
}

/** 单个指标卡片：进度型显示条，数值型显示数字。 */
export function MetricCard({
  metricKey,
  value,
  delta,
  compact,
}: {
  metricKey: keyof CreatorMetrics;
  value: number;
  delta?: number;
  compact?: boolean;
}) {
  const meta = METRIC_META.find((m) => m.key === metricKey)!;
  const showDelta = typeof delta === "number" && delta !== 0;
  const deltaGood = meta.goodHigh ? (delta ?? 0) > 0 : (delta ?? 0) < 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3",
        compact && "px-3 py-2.5",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MetricIcon name={meta.icon} size={compact ? 13 : 15} className={meta.color} />
          <span className="text-xs font-medium text-zinc-400">{meta.label}</span>
        </div>
        {showDelta && (
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "font-mono-num text-xs font-bold",
              deltaGood ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {metricKey === "followers"
              ? signed(delta!)
              : metricKey === "money"
                ? (delta! >= 0 ? "+" : "") + formatMoney(delta!).replace("¥", "¥")
                : signed(delta!)}
          </motion.span>
        )}
      </div>

      <div className={cn("mt-1.5 font-mono-num font-bold text-white", compact ? "text-lg" : "text-xl")}>
        {metricValueText(metricKey, value)}
      </div>

      {meta.bar && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", meta.bg)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      )}
      {!compact && <div className="mt-1.5 text-[11px] text-zinc-500">{meta.hint}</div>}
    </div>
  );
}

/** 六项指标一览。deltas 可选，用于结果页高亮变化。 */
export function MetricsHUD({
  metrics,
  deltas,
  compact,
}: {
  metrics: CreatorMetrics;
  deltas?: Partial<Record<keyof CreatorMetrics, number>>;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-2.5",
        compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      )}
    >
      {METRIC_META.map((m) => (
        <MetricCard
          key={m.key}
          metricKey={m.key}
          value={metrics[m.key]}
          delta={deltas?.[m.key]}
          compact={compact}
        />
      ))}
    </div>
  );
}
