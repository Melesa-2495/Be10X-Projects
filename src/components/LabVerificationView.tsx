import { ArrowRight, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { ConfidenceBadge } from '@/src/components/ConfidenceBadge';
import type { Kitchen } from '@/src/types/plateful';

interface LabVerificationViewProps {
  kitchens: Kitchen[];
  onSelectKitchen: (kitchenId: string) => void;
}

export function LabVerificationView({ kitchens, onSelectKitchen }: LabVerificationViewProps) {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-[#0f52ba]">
          Clinical Transparency & Assay Standards
        </span>
        <h1 className="font-display text-3xl font-bold text-[#191c1e] text-balance">
          Three-Tier Data Confidence & Kitchen Audit Protocol
        </h1>
        <p className="text-base text-[#434653] leading-relaxed">
          Every nutritional figure and allergen claim on Plateful is categorized by its empirical verification method so diners with celiac disease, severe food allergies, or clinical macro targets never have to guess.
        </p>
      </section>

      {/* Three Confidence Tier Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="plateful-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <ConfidenceBadge tier="verified" />
            <CheckCircle2 className="w-5 h-5 text-[#006d3d]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-semibold text-[#191c1e]">
            Tier 1 · Lab Verified
          </h2>
          <p className="text-sm text-[#434653] leading-relaxed">
            Randomly sampled finished plates undergo independent ELISA allergen surface & batch assays (&lt;5 ppm gluten, &lt;2.5 ppm peanut) and bomb calorimetry macronutrient testing.
          </p>
          <div className="pt-3 border-t border-[#e6e8ea] text-xs font-mono-tabular text-[#006d3d] font-medium">
            Tolerance: ±2.5% kcal · Swabbed every 4h
          </div>
        </article>

        <article className="plateful-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <ConfidenceBadge tier="declared" />
            <ShieldCheck className="w-5 h-5 text-[#0f52ba]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-semibold text-[#191c1e]">
            Tier 2 · Restaurant-Declared
          </h2>
          <p className="text-sm text-[#434653] leading-relaxed">
            Calculated directly from supplier Certificates of Analysis (COA), digital gram-scale recipes, and audited kitchen SOP logs maintained by culinary compliance leads.
          </p>
          <div className="pt-3 border-t border-[#e6e8ea] text-xs font-mono-tabular text-[#003c90] font-medium">
            Tolerance: ±5.0% kcal · Daily LOT log
          </div>
        </article>

        <article className="plateful-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <ConfidenceBadge tier="estimated" />
            <Info className="w-5 h-5 text-[#953c00]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-semibold text-[#191c1e]">
            Tier 3 · Estimated Values
          </h2>
          <p className="text-sm text-[#434653] leading-relaxed">
            Flagged explicitly in Warm Amber when seasonal produce, hand-ladled sauces, or shared roasting ovens introduce natural portion variance or trace cross-contact considerations.
          </p>
          <div className="pt-3 border-t border-[#e6e8ea] text-xs font-mono-tabular text-[#953c00] font-medium">
            Tolerance: ±8.0% kcal · Trace disclosed
          </div>
        </article>
      </section>

      {/* Kitchen Audit Ledger Table */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-[#191c1e]">
            Active Partner Kitchen Audit Ledger
          </h2>
          <span className="text-xs text-[#434653]">
            Updated November 2026 · Independent Food Safety Inspectorate
          </span>
        </div>

        <div className="plateful-card rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#f2f4f6] border-b border-[#c3c6d5] text-xs font-semibold text-[#434653]">
                <th className="py-3.5 px-5">Kitchen Facility</th>
                <th className="py-3.5 px-5">Safety Score</th>
                <th className="py-3.5 px-5">ELISA Swab Rate</th>
                <th className="py-3.5 px-5">Last Audit</th>
                <th className="py-3.5 px-5">Confidence Tier</th>
                <th className="py-3.5 px-5 text-right">Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8ea] text-sm">
              {kitchens.map((kitchen) => (
                <tr key={kitchen.id} className="hover:bg-[#f8f9fb]">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-[#191c1e]">{kitchen.name}</div>
                    <div className="text-xs text-[#434653] mt-0.5">
                      {kitchen.neighborhood} · {kitchen.dedicatedZones.join(' · ')}
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono-tabular font-bold text-[#003c90]">
                    {kitchen.safetyScore.toFixed(1)} / 100
                  </td>
                  <td className="py-4 px-5 font-mono-tabular text-[#006d3d] font-medium">
                    {kitchen.swabPassRate}
                  </td>
                  <td className="py-4 px-5 font-mono-tabular text-xs text-[#434653]">
                    {kitchen.auditDate}
                  </td>
                  <td className="py-4 px-5">
                    <ConfidenceBadge tier={kitchen.confidenceTier} compact />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectKitchen(kitchen.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f52ba] hover:text-[#003c90] cursor-pointer whitespace-nowrap"
                    >
                      <span>Inspect Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
