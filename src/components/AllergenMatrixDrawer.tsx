import { AlertTriangle, CheckCircle2, Plus, ShieldCheck, X } from 'lucide-react';
import { ConfidenceBadge } from '@/src/components/ConfidenceBadge';
import { SafeImage } from '@/src/components/SafeImage';
import { ALLERGEN_LABELS } from '@/src/data/platefulData';
import type { Dish, Kitchen, SafetyProfile } from '@/src/types/plateful';
import { evaluateDishSafety } from '@/src/utils/allergenCheck';

interface AllergenMatrixDrawerProps {
  dish: Dish | null;
  kitchen: Kitchen | undefined;
  safetyProfile: SafetyProfile;
  onClose: () => void;
  onAddToBag: (dish: Dish) => void;
}

export function AllergenMatrixDrawer({
  dish,
  kitchen,
  safetyProfile,
  onClose,
  onAddToBag,
}: AllergenMatrixDrawerProps) {
  if (!dish) return null;

  const safety = evaluateDishSafety(dish, safetyProfile);
  const conflictLabels = [...safety.directConflicts, ...safety.traceConflicts].map(
    (id) => ALLERGEN_LABELS[id].label
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#191c1e]/45 backdrop-blur-xs p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matrix-drawer-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-t-xl md:rounded-xl plateful-shadow-elevated flex flex-col overflow-hidden border border-[#0f52ba]/15"
      >
        {/* Top Clinical Header */}
        <div className="px-6 py-4 border-b border-[#e6e8ea] flex items-center justify-between gap-4 bg-[#f8f9fb]">
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#434653] truncate">
              {kitchen?.name ?? 'Verified Kitchen'} · Assayed {dish.lastAssayDate}
            </div>
            <h2
              id="matrix-drawer-title"
              className="font-display text-lg md:text-xl font-bold text-[#191c1e] truncate"
            >
              {dish.name} — Allergen & Traceability Matrix
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close allergen matrix"
            className="p-2 rounded hover:bg-[#e6e8ea] text-[#434653] hover:text-[#191c1e] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Contiguous Summary Module */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-5 aspect-[4/3] md:aspect-auto rounded-lg overflow-hidden bg-[#eceef0]">
              <SafeImage
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <ConfidenceBadge tier={dish.confidenceTier} />
                  <span className="text-xs text-[#434653] font-mono-tabular">
                    {dish.servingGrams}g serving · ${dish.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-[#434653] leading-relaxed">{dish.subtitle}</p>

                {/* Clinical Status Banner */}
                <div
                  className={`p-3.5 rounded border text-xs leading-relaxed flex items-start gap-2.5 ${
                    safety.isCleared
                      ? 'bg-[#e6f6ec] border-[#006d3d]/20 text-[#00522d]'
                      : 'bg-[#ffdbcc] border-[#953c00]/25 text-[#702b00]'
                  }`}
                >
                  {safety.isCleared ? (
                    <CheckCircle2 className="w-4 h-4 text-[#006d3d] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#953c00] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {safety.isCleared
                        ? 'Cleared for Your Active Safety Profile'
                        : `Safety Alert: Conflicts with ${conflictLabels.join(', ')}`}
                    </div>
                    <div className="mt-0.5">{dish.prepProtocol}</div>
                  </div>
                </div>
              </div>

              {/* Nutritional Lab Breakdown */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-2.5">
                  <div className="text-[11px] text-[#434653]">Energy</div>
                  <div className="font-mono-tabular text-lg font-bold text-[#003c90]">
                    {dish.calories}
                  </div>
                  <div className="text-[10px] text-[#737784]">kcal</div>
                </div>
                <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-2.5">
                  <div className="text-[11px] text-[#434653]">Protein</div>
                  <div className="font-mono-tabular text-lg font-bold text-[#191c1e]">
                    {dish.proteinG}g
                  </div>
                  <div className="text-[10px] text-[#737784]">assayed</div>
                </div>
                <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-2.5">
                  <div className="text-[11px] text-[#434653]">Carbs</div>
                  <div className="font-mono-tabular text-lg font-bold text-[#191c1e]">
                    {dish.carbsG}g
                  </div>
                  <div className="text-[10px] text-[#737784]">net</div>
                </div>
                <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-2.5">
                  <div className="text-[11px] text-[#434653]">Fat</div>
                  <div className="font-mono-tabular text-lg font-bold text-[#191c1e]">
                    {dish.fatG}g
                  </div>
                  <div className="text-[10px] text-[#737784]">lipids</div>
                </div>
                <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-2.5">
                  <div className="text-[11px] text-[#434653]">Fiber</div>
                  <div className="font-mono-tabular text-lg font-bold text-[#191c1e]">
                    {dish.fiberG}g
                  </div>
                  <div className="text-[10px] text-[#737784]">dietary</div>
                </div>
                <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded p-2.5">
                  <div className="text-[11px] text-[#434653]">Sodium</div>
                  <div className="font-mono-tabular text-lg font-bold text-[#191c1e]">
                    {dish.sodiumMg}
                  </div>
                  <div className="text-[10px] text-[#737784]">mg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient Source Traceability Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-[#191c1e]">
                Ingredient Source Traceability & Cross-Contamination Matrix
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#006d3d] font-medium">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Batch LOT Logged</span>
              </span>
            </div>

            <div className="border border-[#c3c6d5] rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#f2f4f6] border-b border-[#c3c6d5] text-xs font-semibold text-[#434653]">
                    <th className="py-3 px-4">Ingredient</th>
                    <th className="py-3 px-4">Origin & Lot Code</th>
                    <th className="py-3 px-4">Allergen Status</th>
                    <th className="py-3 px-4">Cross-Contact Protocol</th>
                    <th className="py-3 px-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e8ea] text-sm">
                  {dish.ingredients.map((item) => {
                    const hasAllergen = item.allergensPresent.length > 0;
                    const isMonitor = item.crossContactRisk === 'Monitor (Shared Kitchen)';
                    return (
                      <tr key={item.lotCode} className="bg-white hover:bg-[#f8f9fb]">
                        <td className="py-3 px-4 font-medium text-[#191c1e]">
                          {item.ingredient}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#434653]">
                          <div>{item.origin}</div>
                          <div className="font-mono-tabular text-[11px] text-[#737784] mt-0.5">
                            {item.lotCode}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          {hasAllergen ? (
                            <span className="font-semibold text-[#953c00]">
                              Contains{' '}
                              {item.allergensPresent
                                .map((a) => ALLERGEN_LABELS[a].label)
                                .join(', ')}
                            </span>
                          ) : (
                            <span className="font-medium text-[#006d3d]">Allergen-Free</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <span
                            className={`font-medium ${
                              isMonitor ? 'text-[#953c00]' : 'text-[#003c90]'
                            }`}
                          >
                            {item.crossContactRisk}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#434653]">
                          {item.assayMethod}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sticky Footer CTA */}
        <div className="px-6 py-4 border-t border-[#e6e8ea] bg-[#f8f9fb] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#434653]">
            <span>Tamper-evident clinical seal · Cold-chain monitored</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#c3c6d5] bg-white text-sm font-medium text-[#434653] hover:text-[#191c1e] cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onAddToBag(dish)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold text-white transition-colors cursor-pointer ${
                safety.isCleared
                  ? 'bg-[#0f52ba] hover:bg-[#003c90]'
                  : 'bg-[#953c00] hover:bg-[#702b00]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>
                {safety.isCleared
                  ? `Add to Bag · $${dish.price.toFixed(2)}`
                  : `Review Conflict & Add · $${dish.price.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
