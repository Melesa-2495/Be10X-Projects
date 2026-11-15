import { CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import type { ConfidenceTier } from '@/src/types/plateful';

interface ConfidenceBadgeProps {
  tier: ConfidenceTier;
  compact?: boolean;
}

const TIER_CONFIG: Record<
  ConfidenceTier,
  {
    label: string;
    shortLabel: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    Icon: typeof CheckCircle2;
  }
> = {
  verified: {
    label: 'Lab Verified',
    shortLabel: 'Verified',
    bgClass: 'bg-[#e6f6ec]',
    textClass: 'text-[#006d3d]',
    borderClass: 'border-[#006d3d]/20',
    Icon: CheckCircle2,
  },
  declared: {
    label: 'Restaurant-Declared',
    shortLabel: 'Declared',
    bgClass: 'bg-[#eef3ff]',
    textClass: 'text-[#0f52ba]',
    borderClass: 'border-[#0f52ba]/20',
    Icon: ShieldCheck,
  },
  estimated: {
    label: 'Estimated Values',
    shortLabel: 'Estimated',
    bgClass: 'bg-[#fff2eb]',
    textClass: 'text-[#953c00]',
    borderClass: 'border-[#953c00]/25',
    Icon: Info,
  },
};

export function ConfidenceBadge({ tier, compact = false }: ConfidenceBadgeProps) {
  const { label, shortLabel, bgClass, textClass, borderClass, Icon } = TIER_CONFIG[tier];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 ${bgClass} ${textClass} ${borderClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
      <span>{compact ? shortLabel : label}</span>
    </span>
  );
}
