import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  CardCategory,
  ContentCard,
  ContentDraft,
  DayResult,
  GameState,
  Screen,
} from "@/game/types";
import { TOTAL_DAYS } from "@/game/types";
import { createInitialState } from "@/game/state";
import { simulateContent, applyDayResult, resolveEnding } from "@/game/engine";
import { BRIEFING_MAP } from "@/game/data/trends";
import { BRAND_DEALS } from "@/game/data/brandDeals";

import Landing from "@/screens/Landing";
import CreatorRoom from "@/screens/CreatorRoom";
import Briefing from "@/screens/Briefing";
import Crafting from "@/screens/Crafting";
import FeedSim from "@/screens/FeedSim";
import Result from "@/screens/Result";
import EndingScreen from "@/screens/Ending";

type Selection = Partial<Record<CardCategory, ContentCard>>;

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [screen, setScreen] = useState<Screen>("landing");
  const [selection, setSelection] = useState<Selection>({});
  const [dealAccepted, setDealAccepted] = useState(false);
  const [pending, setPending] = useState<DayResult | null>(null);

  const day = state.day;
  const briefing = BRIEFING_MAP[Math.min(day, TOTAL_DAYS)];
  const deal = BRAND_DEALS[day] ?? null;
  const ending = useMemo(() => (screen === "ending" ? resolveEnding(state) : null), [screen, state]);

  // —— 流程控制 ——
  const start = () => {
    setState(createInitialState());
    setSelection({});
    setDealAccepted(false);
    setPending(null);
    setScreen("room");
  };

  const toBriefing = () => setScreen("briefing");

  const toCrafting = (accepted: boolean) => {
    setDealAccepted(accepted);
    setScreen("crafting");
  };

  const selectCard = (cat: CardCategory, card: ContentCard) =>
    setSelection((s) => ({ ...s, [cat]: card }));

  const release = (draft: ContentDraft) => {
    const result = simulateContent(state, draft, briefing, deal, dealAccepted);
    setPending(result);
    setScreen("feed");
  };

  // FeedSim 结束 -> 结算并进入结果页
  const applyAndShowResult = () => {
    if (!pending) return;
    const next = applyDayResult(state, pending, dealAccepted && deal ? deal.id : undefined);
    setState(next);
    setScreen("result");
  };

  // 结果页 -> 下一天 或 结局
  const advance = () => {
    if (!pending) return;
    if (pending.day >= TOTAL_DAYS) {
      setScreen("ending");
    } else {
      setSelection({});
      setDealAccepted(false);
      setPending(null);
      setScreen("room");
    }
  };

  const showHeader = screen === "room" || screen === "briefing" || screen === "crafting" || screen === "result";

  return (
    <div className="min-h-screen bg-[#08080b] text-zinc-100">
      {showHeader && <TopBar day={day} onRestart={start} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen + "-" + day}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {screen === "landing" && <Landing onStart={start} />}
          {screen === "room" && <CreatorRoom state={state} onNext={toBriefing} />}
          {screen === "briefing" && (
            <Briefing briefing={briefing} deal={deal} onProceed={toCrafting} />
          )}
          {screen === "crafting" && (
            <Crafting
              selection={selection}
              onSelect={selectCard}
              onRelease={release}
              briefing={briefing}
            />
          )}
          {screen === "feed" && pending && (
            <FeedSim result={pending} onContinue={applyAndShowResult} />
          )}
          {screen === "result" && pending && (
            <Result result={pending} metrics={state.metrics} onContinue={advance} />
          )}
          {screen === "ending" && ending && (
            <EndingScreen state={state} ending={ending} onRestart={start} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// —— 顶部进度条 ——
function TopBar({ day, onRestart }: { day: number; onRestart: () => void }) {
  return (
    <div className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-black tracking-tight">
            <span className="text-rose-400">爆款</span>前夜
          </span>
          <span className="font-mono-num text-[10px] uppercase tracking-widest text-zinc-600">
            Viral Eve
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
            const d = i + 1;
            const done = d < day;
            const cur = d === day;
            return (
              <div
                key={d}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (cur
                    ? "w-6 bg-rose-500"
                    : done
                      ? "w-1.5 bg-rose-500/50"
                      : "w-1.5 bg-white/15")
                }
                title={`Day ${d}`}
              />
            );
          })}
          <span className="ml-2 font-mono-num text-xs font-bold text-zinc-400">
            {Math.min(day, TOTAL_DAYS)}/{TOTAL_DAYS}
          </span>
        </div>

        <button
          onClick={onRestart}
          className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
        >
          重开
        </button>
      </div>
    </div>
  );
}
