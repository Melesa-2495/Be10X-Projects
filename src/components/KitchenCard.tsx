import { ArrowRight, Clock } from 'lucide-react';
import { ConfidenceBadge } from '@/src/components/ConfidenceBadge';
import { SafeImage } from '@/src/components/SafeImage';
import type { Kitchen } from '@/src/types/plateful';

interface KitchenCardProps {
  kitchen: Kitchen;
  dishCount: number;
  onSelectKitchen: (kitchenId: string) => void;
}

export function KitchenCard({ kitchen, dishCount, onSelectKitchen }: KitchenCardProps) {
  return (
    <article
      onClick={() => onSelectKitchen(kitchen.id)}
      className="plateful-card rounded-lg overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group"
    >
      <div className="relative aspect-[4/3] bg-[#eceef0] overflow-hidden">
        <SafeImage
          src={kitchen.image}
          alt={kitchen.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-[#0f52ba]/15 rounded px-2.5 py-1 flex items-baseline gap-1 shadow-xs">
          <span className="font-mono-tabular text-sm font-bold text-[#003c90]">
            {kitchen.safetyScore.toFixed(1)}
          </span>
          <span className="text-[11px] font-medium text-[#434653]">Safety Score</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#434653]">
              {kitchen.neighborhood} · {kitchen.swabPassRate}
            </span>
            <ConfidenceBadge tier={kitchen.confidenceTier} compact />
          </div>

          <h3 className="font-display text-lg font-semibold text-[#191c1e] group-hover:text-[#003c90] transition-colors">
            {kitchen.name}
          </h3>

          <p className="text-sm text-[#434653] leading-relaxed line-clamp-2">
            {kitchen.protocolSummary}
          </p>
        </div>

        <div className="pt-3 border-t border-[#eceef0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-[#434653]">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-[#0f52ba]" aria-hidden="true" />
              <span className="tabular-nums">{kitchen.deliveryMinutes}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{dishCount} safe dishes</span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f52ba] whitespace-nowrap shrink-0">
            <span>View Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
