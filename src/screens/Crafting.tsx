import { motion } from "framer-motion";
import { Wand2, Send, ChevronRight, Sparkles } from "lucide-react";
import type { CardCategory, ContentCard, ContentDraft, DailyBriefing, CardEffects } from "@/game/types";
import { CARD_POOL, CATEGORY_META } from "@/game/data/cards";
import { AXIS_META, AXIS_LABEL } from "@/lib/display";
import { Panel, PrimaryButton, SectionLabel } from "@/components/game/ui";
import { cn } from "@/lib/utils";

type Selection = Partial<Record<CardCategory, ContentCard>>;

function sumEffects(sel: Selection): CardEffects {
  const base: CardEffects = { flow: 0, authenticity: 0, drift: 0, controversy: 0, stress: 0, money: 0 };
  for (const cat of Object.keys(sel) as CardCategory[]) {
    const c = sel[cat];
    if (!c) continue;
    base.flow += c.effects.flow;
    base.authenticity += c.effects.authenticity;
    base.drift += c.effects.drift;
    base.controversy += c.effects.controversy;
    base.stress += c.effects.stress;
    base.money += c.effects.money;
  }
  return base;
}

/** 卡面上的效果标记：展示最强的两个方向。 */
function CardEffectHints({ effects }: { effects: CardEffects }) {
  const entries = (["flow", "authenticity", "drift", "controversy", "stress"] as const)
    .map((k) => ({ k, v: effects[k] }))
    .filter((e) => Math.abs(e.v) >= 3)
    .sort((a, b) => Math.abs(b.v) - Math.abs(a.v))
    .slice(0, 3);
  if (entries.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {entries.map((e) => {
        const meta = AXIS_META.find((m) => m.key === e.k)!;
        const pos = e.v > 0;
        return (
          <span
            key={e.k}
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
              pos ? "bg-white/10 " + meta.color : "bg-black/30 text-zinc-500",
            )}
          >
            {meta.label}
            {pos ? " +" : " "}
            {e.v}
          </span>
        );
      })}
    </div>
  );
}

function Card({
  card,
  selected,
  onClick,
}: {
  card: ContentCard;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-52 shrink-0 rounded-xl border p-3.5 text-left transition-all",
        selected
          ? "border-rose-500/60 bg-rose-500/[0.08] shadow-[0_0_24px_-8px_rgba(244,63,94,0.6)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">{card.name}</h4>
        {selected && <Sparkles size={14} className="text-rose-400" />}
      </div>
      <p className="mt-1 text-xs leading-snug text-zinc-400">{card.desc}</p>
      <p className="mt-1.5 text-[11px] italic leading-snug text-zinc-500">「{card.flavor}」</p>
      <CardEffectHints effects={card.effects} />
    </button>
  );
}

export default function Crafting({
  selection,
  onSelect,
  onRelease,
  briefing,
}: {
  selection: Selection;
  onSelect: (cat: CardCategory, card: ContentCard) => void;
  onRelease: (draft: ContentDraft) => void;
  briefing: DailyBriefing;
}) {
  const preview = sumEffects(selection);
  const complete = CATEGORY_META.every((c) => selection[c.key as CardCategory]);
  const chosenCount = CATEGORY_META.filter((c) => selection[c.key as CardCategory]).length;

  const release = () => {
    if (!complete) return;
    onRelease({
      topic: selection.topic!,
      stance: selection.stance!,
      format: selection.format!,
      hook: selection.hook!,
      sacrifice: selection.sacrifice!,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6">
      <SectionLabel icon={<Wand2 size={13} />}>内容工坊 · 组装今天这一条</SectionLabel>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* 卡池 */}
        <div className="space-y-5">
          {CATEGORY_META.map((cat) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-base">{cat.icon}</span>
                <span className="text-sm font-bold text-white">{cat.label}</span>
                <span className="text-xs text-zinc-500">{cat.question}</span>
              </div>
              <div className="ve-scroll flex gap-3 overflow-x-auto pb-2">
                {CARD_POOL[cat.key].map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    selected={selection[cat.key as CardCategory]?.id === card.id}
                    onClick={() => onSelect(cat.key as CardCategory, card)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 预览 / 发布（sticky） */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <Panel glow className="p-5">
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
              内容预览
            </div>
            <div className="mb-4 rounded-xl border border-white/5 bg-black/30 p-3">
              <p className="text-sm font-semibold leading-snug text-white">
                {selection.hook ? selection.hook.desc : "先选好标题钩子……"}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {selection.topic?.name ?? "选题?"} · {selection.format?.name ?? "形式?"} ·{" "}
                {selection.stance?.name ?? "立场?"}
              </p>
            </div>

            <div className="space-y-2.5">
              {AXIS_META.map((axis) => {
                const val = preview[axis.key];
                const pct = Math.max(0, Math.min(100, (val / 24) * 100));
                const boosted = briefing.trendBoost === axis.key;
                return (
                  <div key={axis.key}>
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className={cn("font-medium", axis.color)}>
                        {axis.label}
                        {boosted && (
                          <span className="ml-1 rounded bg-sky-500/20 px-1 text-[9px] text-sky-300">
                            今日加权
                          </span>
                        )}
                      </span>
                      <span className="font-mono-num text-zinc-400">{val}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className={cn("h-full rounded-full bg-gradient-to-r", axis.bar)}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <PrimaryButton onClick={release} disabled={!complete} className="w-full">
                <Send size={17} />
                {complete ? "发布到信息流" : `还差 ${5 - chosenCount} 项`}
              </PrimaryButton>
              {!complete && (
                <p className="mt-2 flex items-center gap-1 text-center text-[11px] text-zinc-500">
                  <ChevronRight size={11} /> 每个类别各选一张卡
                </p>
              )}
              {complete && briefing && (
                <p className="mt-2 text-center text-[11px] text-zinc-500">
                  今天 {AXIS_LABEL[briefing.trendBoost]} 会被算法多推一把
                </p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
