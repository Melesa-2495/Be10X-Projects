export type ConfidenceTier = 'verified' | 'declared' | 'estimated';

export type AllergenId =
  | 'gluten'
  | 'nuts'
  | 'dairy'
  | 'soy'
  | 'shellfish'
  | 'sesame';

export type CrossContactRisk = 'None (Dedicated Line)' | 'Low (Sealed Prep)' | 'Monitor (Shared Kitchen)';

export interface IngredientTrace {
  ingredient: string;
  origin: string;
  lotCode: string;
  allergensPresent: AllergenId[];
  crossContactRisk: CrossContactRisk;
  assayMethod: string;
}

export interface Dish {
  id: string;
  kitchenId: string;
  name: string;
  subtitle: string;
  category: 'Bowls' | 'Plates' | 'Plant-Forward';
  price: number;
  servingGrams: number;
  image: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  confidenceTier: ConfidenceTier;
  freeFrom: AllergenId[];
  contains: AllergenId[];
  traceRisk: AllergenId[];
  allergenDisclosure: string;
  prepProtocol: string;
  lastAssayDate: string;
  ingredients: IngredientTrace[];
}

export interface Kitchen {
  id: string;
  name: string;
  neighborhood: string;
  cuisineFocus: string;
  image: string;
  safetyScore: number;
  deliveryMinutes: string;
  auditDate: string;
  swabPassRate: string;
  dedicatedZones: string[];
  protocolSummary: string;
  confidenceTier: ConfidenceTier;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  specialNote?: string;
}

export interface SafetyProfile {
  excludedAllergens: AllergenId[];
  strictTraceMode: boolean;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
}

export type ActiveScreen = 'discover' | 'kitchen' | 'verification' | 'profile';
