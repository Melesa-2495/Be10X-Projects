import { AlertTriangle, CheckCircle2, FileSpreadsheet, Plus } from 'lucide-react';
import { ConfidenceBadge } from '@/src/components/ConfidenceBadge';
import { SafeImage } from '@/src/components/SafeImage';
import { ALLERGEN_LABELS } from '@/src/data/platefulData';
import type { Dish, SafetyProfile } from '@/src/types/plateful';
import { evaluateDishSafety } from '@/src/utils/allergenCheck';

interface DishCardProps {
  dish: Dish;
  kitchenName: string;
  safetyProfile: SafetyProfile;
  onInspectMatrix: (dish: Dish) => void;
  onAddToBag: (dish: Dish) => void;
}

export function DishCard({
  dish,
  kitchenName,
  safetyProfile,
  onInspectMatrix,
  onAddToBag,
}: DishCardProps) {
  const safety = evaluateDishSafety(dish, safetyProfile);
  const conflictNames = [...safety.directConflicts, ...safety.traceConflicts].map(
    (id) => ALLERGEN_LABELS[id].label
  );

  return (
    <article className="plateful-card rounded-lg overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image & Price header */}
        <div className="relative aspect-[4/3] bg-[#eceef0] overflow-hidden">
          <SafeImage
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3">
            <ConfidenceBadge tier={dish.confidenceTier} />
          </div>
        </div>

        {/* Main body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs text-[#434653]">
              <span className="truncate">{kitchenName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular shrink-0">{dish.servingGrams}g</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-[17px] font-semibold leading-snug text-[#191c1e]">
                {dish.name}
              </h3>
              <span className="font-mono-tabular text-[15px] font-semibold text-[#191c1e] shrink-0">
                ${dish.price.toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-[#434653] leading-relaxed line-clamp-2">
              {dish.subtitle}
            </p>
          </div>

          {/* Numeric-Hero Calorie & Macro Clinical Strip */}
          <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-bold tracking-tight text-[#003c90] tabular-nums leading-none">
                {dish.calories}
              </span>
              <span className="text-xs font-medium text-[#434653]">kcal</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div>
                <div className="font-mono-tabular font-semibold text-[#191c1e]">{dish.proteinG}g</div>
                <div className="text-[11px] text-[#434653]">Protein</div>
              </div>
              <div className="w-px h-6 bg-[#c3c6d5]" aria-hidden="true" />
              <div>
                <div className="font-mono-tabular font-semibold text-[#191c1e]">{dish.carbsG}g</div>
                <div className="text-[11px] text-[#434653]">Carbs</div>
              </div>
              <div className="w-px h-6 bg-[#c3c6d5]" aria-hidden="true" />
              <div>
                <div className="font-mono-tabular font-semibold text-[#191c1e]">{dish.fatG}g</div>
                <div className="text-[11px] text-[#434653]">Fat</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onInspectMatrix(dish)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded border border-[#0f52ba] text-[#0f52ba] hover:bg-[#eef3ff] text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f52ba]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Lab Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => onAddToBag(dish)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f52ba] ${
                safety.isCleared
                  ? 'bg-[#0f52ba] hover:bg-[#003c90] text-white'
                  : 'bg-[#953c00] hover:bg-[#702b00] text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{safety.isCleared ? 'Add to Bag' : 'Review Alert'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unmissable Allergen Disclosure Strip at Card Base */}
      <div
        className={`px-5 py-2.5 border-t text-xs font-medium flex items-center gap-2 ${
          safety.isCleared
            ? 'bg-[#e6f6ec]/70 border-[#006d3d]/15 text-[#00522d]'
            : 'bg-[#ffdbcc]/70 border-[#953c00]/20 text-[#702b00]'
        }`}
      >
        {safety.isCleared ? (
          <CheckCircle2 className="w-4 h-4 text-[#006d3d] shrink-0" aria-hidden="true" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-[#953c00] shrink-0" aria-hidden="true" />
        )}
        <span className="leading-snug">
          {safety.isCleared
            ? dish.allergenDisclosure
            : `Profile Conflict: ${conflictNames.join(', ')}`}
        </span>
      </div>
    </article>
  );
}
