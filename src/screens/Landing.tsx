import { motion } from "framer-motion";
import { Play, TrendingUp, Flame, Zap } from "lucide-react";
import { CREATOR } from "@/game/data/character";
import { PrimaryButton, Tag } from "@/components/game/ui";
import { FengYeAvatar } from "@/components/game/Avatar";
import { INITIAL_METRICS } from "@/game/data/character";

const HEADLINES = [
  "#新版本打野节奏 冲上热榜",
  "某主播破防拍桌切片 24 小时破千万",
  "平台上线「硬核攻略」专属流量入口",
  "电竞老哥阿凯翻车 全网吃瓜",
  "算法大改：短平快内容权重飙升",
  "观众开始反噬标题党 #反矫情",
];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="ve-grid-bg relative flex min-h-screen flex-col overflow-hidden">
      {/* 顶部滚动热点条 */}
      <div className="relative z-10 overflow-hidden border-b border-white/5 bg-black/30 py-2">
        <div className="ve-ticker flex w-max gap-10 whitespace-nowrap px-6 text-xs text-zinc-400">
          {[...HEADLINES, ...HEADLINES].map((h, i) => (
            <span key={i} className="flex items-center gap-2">
              <Flame size={12} className="text-rose-400" />
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300"
        >
          <TrendingUp size={13} className="text-rose-400" />
          一场关于「红」与「代价」的内容策略模拟
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-4 text-center text-6xl font-black leading-none tracking-tight sm:text-7xl"
        >
          <span className="bg-gradient-to-br from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
            爆款前夜
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-2 font-mono-num text-sm uppercase tracking-[0.5em] text-zinc-500"
        >
          Viral Eve
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 max-w-xl text-center text-lg font-medium leading-relaxed text-zinc-300"
        >
          你是他背后的操盘手。用 7 天，把一个没人看的主播，推上爆款。
          <br />
          <span className="text-rose-300">但每一次爆红，都在改写他是谁。</span>
        </motion.p>

        {/* 主角名片 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:flex-row sm:items-start sm:text-left"
        >
          <FengYeAvatar metrics={INITIAL_METRICS} size={92} live />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:gap-2">
              <h2 className="text-xl font-bold text-white">{CREATOR.name}</h2>
              <span className="font-mono-num text-xs text-zinc-500">{CREATOR.handle}</span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">{CREATOR.role}</p>
            <p className="mt-3 text-sm italic leading-relaxed text-zinc-300">
              「{CREATOR.quote}」
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
              <Tag label="硬核老哥" />
              <Tag label="专业分析" />
            </div>
          </div>
        </motion.div>

        {/* 核心命题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex items-center gap-3 text-center"
        >
          <Zap size={18} className="shrink-0 text-amber-400" />
          <p className="text-lg font-bold text-white sm:text-xl">
            你能让冯野出名，又<span className="text-rose-400">不把他变成一个小丑</span>吗？
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-8"
        >
          <PrimaryButton onClick={onStart} className="px-10 py-4 text-lg">
            <Play size={20} fill="currentColor" />
            进入创作者后台
          </PrimaryButton>
          <p className="mt-3 text-center text-xs text-zinc-500">7 天 · 每天一条内容 · 8 种结局</p>
        </motion.div>
      </div>
    </div>
  );
}
