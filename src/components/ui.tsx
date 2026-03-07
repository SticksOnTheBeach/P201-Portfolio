import { component$, Slot } from "@builder.io/qwik";

export type AccentColor = "green" | "blue" | "warm";

interface AcBadgeProps {
  code: string;
  color: AccentColor;
}

const badgeColors: Record<AccentColor, string> = {
  green: "bg-green-500/10 text-green-400",
  blue: "bg-blue-500/10 text-blue-400",
  warm: "bg-amber-500/10 text-amber-300",
};

export const AcBadge = component$<AcBadgeProps>(({ code, color }) => (
  <span
    class={`font-mono text-[0.58rem] font-bold px-2 py-0.5 rounded shrink-0 mt-0.5 ${badgeColors[color]}`}
  >
    {code}
  </span>
));

interface AcItemProps {
  code: string;
  color: AccentColor;
  desc: string;
}

export const AcItem = component$<AcItemProps>(({ code, color, desc }) => (
  <div class="flex gap-3 items-start">
    <AcBadge code={code} color={color} />
    <span class="text-[0.8rem] text-white/40 leading-relaxed">{desc}</span>
  </div>
));

interface TagProps {
  color: AccentColor;
}

const tagColors: Record<AccentColor, string> = {
  green: "border-green-500/25 text-green-400/70",
  blue: "border-blue-500/25 text-blue-400/70",
  warm: "border-amber-500/25 text-amber-300/70",
};

export const Tag = component$<TagProps>(({ color }) => (
  <span
    class={`font-mono text-[0.58rem] tracking-wider uppercase px-3 py-0.5 rounded-full border ${tagColors[color]}`}
  >
    <Slot />
  </span>
));

interface SkillChipProps {}
export const SkillChip = component$<SkillChipProps>(() => (
  <span class="text-[0.73rem] px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/45">
    <Slot />
  </span>
));
