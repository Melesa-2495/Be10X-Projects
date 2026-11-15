import { AlertTriangle, X } from 'lucide-react';
import { ALLERGEN_LABELS } from '@/src/data/platefulData';
import type { AllergenId, Dish } from '@/src/types/plateful';

interface AllergyAlertDialogProps {
  dish: Dish | null;
  directConflicts: AllergenId[];
  traceConflicts: AllergenId[];
  onCancel: () => void;
  onConfirmAdd: (dish: Dish) => void;
}

export function AllergyAlertDialog({
  dish,
  directConflicts,
  traceConflicts,
  onCancel,
  onConfirmAdd,
}: AllergyAlertDialogProps) {
  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#191c1e]/55 backdrop-blur-xs p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="allergy-alert-title"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-xl border border-[#953c00]/35 plateful-shadow-elevated overflow-hidden"
      >
        <div className="bg-[#ffdbcc] px-6 py-4 border-b border-[#953c00]/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#702b00]">
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <h2 id="allergy-alert-title" className="font-display text-base font-bold">
              Allergy Safety Confirmation Required
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="text-[#702b00] hover:bg-[#953c00]/10 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#191c1e] leading-relaxed">
            <strong>{dish.name}</strong> conflicts with your active Plateful Safety Profile:
          </p>

          <div className="space-y-2 text-xs">
            {directConflicts.length > 0 && (
              <div className="p-3 rounded bg-[#ffdad6] text-[#93000a] font-medium">
                Direct Ingredient Match:{' '}
                {directConflicts.map((id) => ALLERGEN_LABELS[id].label).join(', ')}
              </div>
            )}
            {traceConflicts.length > 0 && (
              <div className="p-3 rounded bg-[#fff2eb] border border-[#953c00]/25 text-[#702b00] font-medium">
                Shared Surface / Trace Risk:{' '}
                {traceConflicts.map((id) => ALLERGEN_LABELS[id].label).join(', ')}
              </div>
            )}
          </div>

          <p className="text-xs text-[#434653] leading-relaxed">
            Only proceed if you are ordering for someone else in your household or explicitly accept this cross-contact risk.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-[#c3c6d5] text-sm font-medium text-[#191c1e] hover:bg-[#f2f4f6] cursor-pointer"
            >
              Do Not Add
            </button>
            <button
              type="button"
              onClick={() => onConfirmAdd(dish)}
              className="px-4 py-2 rounded bg-[#953c00] hover:bg-[#702b00] text-sm font-semibold text-white cursor-pointer"
            >
              Confirm & Add Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
