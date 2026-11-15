import { Check, Search, X } from 'lucide-react';
import { ALL_ALLERGENS, ALLERGEN_LABELS } from '@/src/data/platefulData';
import type { AllergenId, ConfidenceTier } from '@/src/types/plateful';

interface AllergenFilterBarProps {
  selectedAllergens: AllergenId[];
  onToggleAllergen: (id: AllergenId) => void;
  onClearAllergens: () => void;
  selectedTier: ConfidenceTier | 'all';
  onSelectTier: (tier: ConfidenceTier | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  strictTraceMode: boolean;
  onToggleStrictTrace: () => void;
}

const TIER_TABS: { id: ConfidenceTier | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tiers' },
  { id: 'verified', label: 'Lab Verified' },
  { id: 'declared', label: 'Declared' },
];

export function AllergenFilterBar({
  selectedAllergens,
  onToggleAllergen,
  onClearAllergens,
  selectedTier,
  onSelectTier,
  searchQuery,
  onSearchChange,
  strictTraceMode,
  onToggleStrictTrace,
}: AllergenFilterBarProps) {
  return (
    <section
      aria-label="Dietary and allergen filters"
      className="plateful-card rounded-lg p-5 space-y-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Clinical search input */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="plateful-search" className="sr-only">
            Search dishes, kitchens, or ingredients
          </label>
          <Search
            className="w-4 h-4 text-[#737784] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="plateful-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dishes, ingredients, or verified kitchens..."
            className="w-full bg-[#f8f9fb] border border-[#c3c6d5] rounded pl-10 pr-9 py-2 text-sm text-[#191c1e] placeholder:text-[#737784] focus:outline-none focus:border-[#0f52ba] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737784] hover:text-[#191c1e] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Interactive segmented filter for Data Confidence Tier */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Filter by verification tier"
            className="inline-flex items-center p-1 bg-[#eceef0] rounded-lg"
          >
            {TIER_TABS.map((tab) => {
              const active = selectedTier === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTier(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#003c90] shadow-xs font-semibold'
                      : 'text-[#434653] hover:text-[#191c1e]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleStrictTrace}
            aria-pressed={strictTraceMode}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              strictTraceMode
                ? 'bg-[#eef3ff] border-[#0f52ba]/35 text-[#003c90]'
                : 'bg-white border-[#c3c6d5] text-[#434653] hover:border-[#737784]'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                strictTraceMode
                  ? 'bg-[#0f52ba] border-[#0f52ba] text-white'
                  : 'bg-white border-[#737784]'
              }`}
            >
              {strictTraceMode && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
            </span>
            <span>Exclude Trace Risk</span>
          </button>
        </div>
      </div>

      {/* Multi-select square checkboxes for allergen exclusions */}
      <div className="pt-3 border-t border-[#e6e8ea] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-medium text-[#434653] mr-1">
            Active Allergen Exclusions:
          </span>
          {ALL_ALLERGENS.map((allergenId) => {
            const checked = selectedAllergens.includes(allergenId);
            const { filterLabel } = ALLERGEN_LABELS[allergenId];
            return (
              <button
                key={allergenId}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onToggleAllergen(allergenId)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f52ba] ${
                  checked
                    ? 'bg-[#eef3ff] border-[#0f52ba] text-[#003c90] font-semibold'
                    : 'bg-[#f8f9fb] border-[#c3c6d5] text-[#434653] hover:border-[#0f52ba]/50 hover:bg-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    checked
                      ? 'bg-[#0f52ba] border-[#0f52ba] text-white'
                      : 'bg-white border-[#737784]'
                  }`}
                >
                  {checked && <Check className="w-3 h-3" strokeWidth={2.75} />}
                </span>
                <span>{filterLabel}</span>
              </button>
            );
          })}
        </div>

        {selectedAllergens.length > 0 && (
          <button
            type="button"
            onClick={onClearAllergens}
            className="text-xs font-medium text-[#0f52ba] hover:text-[#003c90] underline underline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Reset exclusions ({selectedAllergens.length})
          </button>
        )}
      </div>
    </section>
  );
}
