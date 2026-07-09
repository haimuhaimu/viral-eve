import * as React from "react";
import {
  Users,
  Wallet,
  HeartHandshake,
  Brain,
  VenetianMask,
  Activity,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tagStyle } from "@/lib/display";

// —— 指标图标映射 ——
const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Users,
  Wallet,
  HeartHandshake,
  Brain,
  VenetianMask,
  Activity,
};

export function MetricIcon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name] ?? Activity;
  return <Cmp {...props} />;
}

// —— 玻璃拟态面板 ——
export function Panel({
  className,
  children,
  glow,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl",
        glow && "shadow-[0_0_40px_-12px_rgba(255,45,85,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// —— 主行动按钮 ——
export function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-bold tracking-wide transition-all",
        "bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white",
        "shadow-[0_10px_30px_-10px_rgba(244,63,94,0.7)] hover:shadow-[0_14px_40px_-8px_rgba(244,63,94,0.85)]",
        "hover:-translate-y-0.5 active:translate-y-0",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none",
        className,
      )}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all",
        active
          ? "border-white/30 bg-white/10 text-white"
          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

// —— 平台标签 ——
export function Tag({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tagStyle(label),
        className,
      )}
    >
      #{label}
    </span>
  );
}

// —— 段落分区标题 ——
export function SectionLabel({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
      {icon}
      {children}
    </div>
  );
}
