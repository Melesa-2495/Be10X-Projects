import type { AllergenId, Dish, SafetyProfile } from '@/src/types/plateful';

export interface DishSafetyStatus {
  isCleared: boolean;
  directConflicts: AllergenId[];
  traceConflicts: AllergenId[];
}

export function evaluateDishSafety(dish: Dish, profile: SafetyProfile): DishSafetyStatus {
  const directConflicts = dish.contains.filter((allergen) =>
    profile.excludedAllergens.includes(allergen)
  );
  const traceConflicts = profile.strictTraceMode
    ? dish.traceRisk.filter((allergen) => profile.excludedAllergens.includes(allergen))
    : [];

  return {
    isCleared: directConflicts.length === 0 && traceConflicts.length === 0,
    directConflicts,
    traceConflicts,
  };
}

export function matchesActiveFilters(
  dish: Dish,
  selectedExclusions: AllergenId[],
  strictTrace: boolean
): boolean {
  for (const allergen of selectedExclusions) {
    if (dish.contains.includes(allergen)) return false;
    if (strictTrace && dish.traceRisk.includes(allergen)) return false;
  }
  return true;
}
