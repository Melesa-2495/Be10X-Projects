import { AlertTriangle, Check, CheckCircle2, Shield } from 'lucide-react';
import { ALL_ALLERGENS, ALLERGEN_LABELS } from '@/src/data/platefulData';
import type { AllergenId, Dish, SafetyProfile } from '@/src/types/plateful';
import { evaluateDishSafety } from '@/src/utils/allergenCheck';

interface SafetyProfileViewProps {
  profile: SafetyProfile;
  dishes: Dish[];
  onToggleAllergen: (id: AllergenId) => void;
  onToggleStrictTrace: () => void;
  onUpdateTargets: (calories: number, protein: number) => void;
  onBrowseSafeDishes: () => void;
}

export function SafetyProfileView({
  profile,
  dishes,
  onToggleAllergen,
  onToggleStrictTrace,
  onUpdateTargets,
  onBrowseSafeDishes,
}: SafetyProfileViewProps) {
  const clearedCount = dishes.filter((d) => evaluateDishSafety(d, profile).isCleared).length;
  const flaggedCount = dishes.length - clearedCount;

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2.5">
        <span className="text-xs font-semibold text-[#0f52ba]">
          Personal Dietary Guardrail Configuration
        </span>
        <h1 className="font-display text-3xl font-bold text-[#191c1e] text-balance">
          Safety Profile & Macro Targets
        </h1>
        <p className="text-base text-[#434653] leading-relaxed">
          Your safety profile synchronizes live across every kitchen menu, dish card, and checkout verification check. Adding any conflicting item automatically triggers a confirmation safeguard.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Allergen Guard Settings */}
        <section className="lg:col-span-7 plateful-card rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#e6e8ea]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#0f52ba]" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold text-[#191c1e]">
                Excluded Allergens
              </h2>
            </div>
            <span className="font-mono-tabular text-xs font-semibold text-[#003c90]">
              {profile.excludedAllergens.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_ALLERGENS.map((id) => {
              const checked = profile.excludedAllergens.includes(id);
              const { label, filterLabel } = ALLERGEN_LABELS[id];
              return (
                <button
                  key={id}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => onToggleAllergen(id)}
                  className={`p-3.5 rounded border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    checked
                      ? 'bg-[#eef3ff] border-[#0f52ba] text-[#003c90]'
                      : 'bg-[#f8f9fb] border-[#c3c6d5] text-[#434653] hover:bg-white'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                      checked
                        ? 'bg-[#0f52ba] border-[#0f52ba] text-white'
                        : 'bg-white border-[#737784]'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" strokeWidth={2.75} />}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[#191c1e]">{filterLabel}</div>
                    <div className="text-xs text-[#434653] mt-0.5">Excludes {label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cross-contamination sensitivity */}
          <div className="pt-4 border-t border-[#e6e8ea] space-y-3">
            <h3 className="font-display text-sm font-semibold text-[#191c1e]">
              Cross-Contamination Sensitivity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!profile.strictTraceMode) onToggleStrictTrace();
                }}
                className={`p-4 rounded border text-left space-y-1 transition-colors cursor-pointer ${
                  profile.strictTraceMode
                    ? 'bg-[#eef3ff] border-[#0f52ba]'
                    : 'bg-[#f8f9fb] border-[#c3c6d5]'
                }`}
              >
                <div className="text-sm font-semibold text-[#003c90]">
                  Strict Clinical Guard
                </div>
                <p className="text-xs text-[#434653] leading-relaxed">
                  Flag and block both direct ingredients and shared-oven trace risks (recommended for celiac & anaphylaxis).
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (profile.strictTraceMode) onToggleStrictTrace();
                }}
                className={`p-4 rounded border text-left space-y-1 transition-colors cursor-pointer ${
                  !profile.strictTraceMode
                    ? 'bg-[#eef3ff] border-[#0f52ba]'
                    : 'bg-[#f8f9fb] border-[#c3c6d5]'
                }`}
              >
                <div className="text-sm font-semibold text-[#191c1e]">
                  Direct Ingredient Only
                </div>
                <p className="text-xs text-[#434653] leading-relaxed">
                  Allow dishes prepared in shared ovens when allergen is not an added recipe ingredient.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Right: Daily Macro Targets & Live Catalog Clearance Summary */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="plateful-card rounded-lg p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-[#191c1e]">
              Daily Macro Benchmarks
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-[#434653] mb-1.5">
                  <label htmlFor="target-calories">Daily Energy Target</label>
                  <span className="font-mono-tabular font-semibold text-[#003c90]">
                    {profile.dailyCalorieTarget} kcal
                  </span>
                </div>
                <input
                  id="target-calories"
                  type="range"
                  min={1400}
                  max={3200}
                  step={50}
                  value={profile.dailyCalorieTarget}
                  onChange={(e) =>
                    onUpdateTargets(Number(e.target.value), profile.dailyProteinTarget)
                  }
                  className="w-full accent-[#0f52ba] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-[#434653] mb-1.5">
                  <label htmlFor="target-protein">Daily Protein Goal</label>
                  <span className="font-mono-tabular font-semibold text-[#006d3d]">
                    {profile.dailyProteinTarget} g
                  </span>
                </div>
                <input
                  id="target-protein"
                  type="range"
                  min={60}
                  max={220}
                  step={5}
                  value={profile.dailyProteinTarget}
                  onChange={(e) =>
                    onUpdateTargets(profile.dailyCalorieTarget, Number(e.target.value))
                  }
                  className="w-full accent-[#006d3d] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="plateful-card rounded-lg p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#191c1e]">
              Live Menu Clearance Impact
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded bg-[#e6f6ec] border border-[#006d3d]/20">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#00522d]">
                  <CheckCircle2 className="w-4 h-4 text-[#006d3d]" />
                  <span>Cleared Dishes</span>
                </div>
                <div className="font-mono-tabular text-3xl font-bold text-[#006d3d] mt-1">
                  {clearedCount}
                </div>
              </div>

              <div className="p-4 rounded bg-[#fff2eb] border border-[#953c00]/20">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#702b00]">
                  <AlertTriangle className="w-4 h-4 text-[#953c00]" />
                  <span>Flagged Alerts</span>
                </div>
                <div className="font-mono-tabular text-3xl font-bold text-[#953c00] mt-1">
                  {flaggedCount}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onBrowseSafeDishes}
              className="w-full py-2.5 rounded bg-[#0f52ba] hover:bg-[#003c90] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Browse {clearedCount} Cleared Dishes
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
