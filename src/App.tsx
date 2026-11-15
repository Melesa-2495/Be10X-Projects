import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AllergenFilterBar } from '@/src/components/AllergenFilterBar';
import { AllergenMatrixDrawer } from '@/src/components/AllergenMatrixDrawer';
import { AllergyAlertDialog } from '@/src/components/AllergyAlertDialog';
import { CartCheckoutDrawer } from '@/src/components/CartCheckoutDrawer';
import { DishCard } from '@/src/components/DishCard';
import { KitchenCard } from '@/src/components/KitchenCard';
import { KitchenMenuView } from '@/src/components/KitchenMenuView';
import { LabVerificationView } from '@/src/components/LabVerificationView';
import { SafeImage } from '@/src/components/SafeImage';
import { SafetyProfileView } from '@/src/components/SafetyProfileView';
import { TopNav } from '@/src/components/TopNav';
import {
  ALLERGEN_LABELS,
  DEFAULT_SAFETY_PROFILE,
  DISHES,
  HERO_DISH_IMAGE,
  KITCHENS,
} from '@/src/data/platefulData';
import type {
  ActiveScreen,
  AllergenId,
  CartItem,
  ConfidenceTier,
  Dish,
  SafetyProfile,
} from '@/src/types/plateful';
import { evaluateDishSafety, matchesActiveFilters } from '@/src/utils/allergenCheck';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('discover');
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>(KITCHENS[0].id);
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile>(DEFAULT_SAFETY_PROFILE);

  // Filter states on Marketplace
  const [selectedTier, setSelectedTier] = useState<ConfidenceTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFlaggedToo, setShowFlaggedToo] = useState(true);

  // Drawers & Modals
  const [inspectedDish, setInspectedDish] = useState<Dish | null>(null);
  const [alertPendingDish, setAlertPendingDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Order Bag
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { dish: DISHES[0], quantity: 1 },
  ]);

  const toggleAllergen = (id: AllergenId) => {
    setSafetyProfile((prev) => {
      const exists = prev.excludedAllergens.includes(id);
      return {
        ...prev,
        excludedAllergens: exists
          ? prev.excludedAllergens.filter((a) => a !== id)
          : [...prev.excludedAllergens, id],
      };
    });
  };

  const clearAllergens = () => {
    setSafetyProfile((prev) => ({ ...prev, excludedAllergens: [] }));
  };

  const toggleStrictTrace = () => {
    setSafetyProfile((prev) => ({ ...prev, strictTraceMode: !prev.strictTraceMode }));
  };

  const updateMacroTargets = (dailyCalorieTarget: number, dailyProteinTarget: number) => {
    setSafetyProfile((prev) => ({
      ...prev,
      dailyCalorieTarget,
      dailyProteinTarget,
    }));
  };

  const addItemConfirmed = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
    setAlertPendingDish(null);
    setInspectedDish(null);
    setIsCartOpen(true);
  };

  const handleRequestAddDish = (dish: Dish) => {
    const safety = evaluateDishSafety(dish, safetyProfile);
    if (!safety.isCleared) {
      setAlertPendingDish(dish);
      return;
    }
    addItemConfirmed(dish);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.dish.id === dishId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const handleOpenKitchen = (kitchenId: string) => {
    setSelectedKitchenId(kitchenId);
    setActiveScreen('kitchen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DISHES.filter((dish) => {
      const kitchen = KITCHENS.find((k) => k.id === dish.kitchenId);
      if (selectedTier !== 'all' && dish.confidenceTier !== selectedTier) {
        return false;
      }
      if (!showFlaggedToo && !matchesActiveFilters(dish, safetyProfile.excludedAllergens, safetyProfile.strictTraceMode)) {
        return false;
      }
      if (q) {
        const haystack = `${dish.name} ${dish.subtitle} ${kitchen?.name ?? ''} ${dish.allergenDisclosure}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedTier, showFlaggedToo, safetyProfile]);

  const activeKitchen =
    KITCHENS.find((k) => k.id === selectedKitchenId) ?? KITCHENS[0];

  const alertSafety = alertPendingDish
    ? evaluateDishSafety(alertPendingDish, safetyProfile)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb] text-[#191c1e]">
      <TopNav
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalBagCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 lg:px-10 py-8 lg:py-10">
        {activeScreen === 'discover' && (
          <div className="space-y-10">
            {/* Storefront Hero: Balanced 2-column split + full-width clinical KPI strip below */}
            <section className="space-y-5">
              <div className="plateful-card rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-6 p-7 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006d3d]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Allergen-Verified · Lab-Assayed Nutrition</span>
                    </div>

                    <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-[#191c1e] text-balance leading-[1.16]">
                      Clinical precision on every plate delivered.
                    </h1>

                    <p className="text-base text-[#434653] leading-relaxed max-w-xl">
                      Order from audited kitchens with batch-logged ingredient traceability, ELISA surface testing, and transparent 3-tier macro confidence.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('safe-dishes-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 bg-[#0f52ba] hover:bg-[#003c90] text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors cursor-pointer"
                    >
                      <span>Explore Verified Dishes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveScreen('profile')}
                      className="inline-flex items-center gap-2 border border-[#0f52ba] text-[#0f52ba] hover:bg-[#eef3ff] text-sm font-semibold px-5 py-2.5 rounded transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        Safety Profile ({safetyProfile.excludedAllergens.length} active)
                      </span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-[360px] bg-[#eceef0]">
                  <SafeImage
                    src={HERO_DISH_IMAGE}
                    alt="Wild King Salmon & Tri-Color Quinoa Bowl"
                    className="w-full h-full lg:absolute lg:inset-0 object-cover"
                  />
                </div>
              </div>

              {/* 4-Column Clinical Proof Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="plateful-card rounded-lg p-4">
                  <div className="text-xs text-[#434653]">ELISA Gluten Threshold</div>
                  <div className="font-mono-tabular text-2xl font-bold text-[#003c90] mt-1">
                    &lt;5 ppm
                  </div>
                </div>
                <div className="plateful-card rounded-lg p-4">
                  <div className="text-xs text-[#434653]">Active Profile Exclusions</div>
                  <div className="font-mono-tabular text-2xl font-bold text-[#191c1e] mt-1">
                    {safetyProfile.excludedAllergens.length === 0
                      ? 'None'
                      : safetyProfile.excludedAllergens
                          .map((id) => ALLERGEN_LABELS[id].filterLabel.replace('-Free', ''))
                          .join(' · ')}
                  </div>
                </div>
                <div className="plateful-card rounded-lg p-4">
                  <div className="text-xs text-[#434653]">Surface Swab Cadence</div>
                  <div className="font-mono-tabular text-2xl font-bold text-[#006d3d] mt-1">
                    Every 4h
                  </div>
                </div>
                <div className="plateful-card rounded-lg p-4">
                  <div className="text-xs text-[#434653]">Daily Protein Target</div>
                  <div className="font-mono-tabular text-2xl font-bold text-[#191c1e] mt-1">
                    {safetyProfile.dailyProteinTarget}g / day
                  </div>
                </div>
              </div>
            </section>

            {/* Allergen & Confidence Filter Bar */}
            <AllergenFilterBar
              selectedAllergens={safetyProfile.excludedAllergens}
              onToggleAllergen={toggleAllergen}
              onClearAllergens={clearAllergens}
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              strictTraceMode={safetyProfile.strictTraceMode}
              onToggleStrictTrace={toggleStrictTrace}
            />

            {/* Featured Verified Kitchens */}
            <section className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#191c1e]">
                    Audited Clinical Kitchens
                  </h2>
                  <p className="text-sm text-[#434653] mt-1">
                    Select a kitchen to inspect dedicated prep lines, swab pass rates, and full menu items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveScreen('verification')}
                  className="text-xs font-semibold text-[#0f52ba] hover:text-[#003c90] underline underline-offset-4 cursor-pointer"
                >
                  How Safety Scores are audited
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {KITCHENS.map((kitchen) => {
                  const safeDishCount = DISHES.filter(
                    (d) =>
                      d.kitchenId === kitchen.id &&
                      evaluateDishSafety(d, safetyProfile).isCleared
                  ).length;

                  return (
                    <KitchenCard
                      key={kitchen.id}
                      kitchen={kitchen}
                      dishCount={safeDishCount}
                      onSelectKitchen={handleOpenKitchen}
                    />
                  );
                })}
              </div>
            </section>

            {/* Safe Dishes Grid */}
            <section id="safe-dishes-section" className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#191c1e]">
                    Clinical Dish Catalog
                  </h2>
                  <p className="text-sm text-[#434653] mt-1">
                    Showing <span className="font-mono-tabular font-semibold">{filteredDishes.length}</span> dishes · Conflict alerts highlight in Warm Amber
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFlaggedToo((v) => !v)}
                  className="px-3.5 py-2 rounded border border-[#c3c6d5] bg-white hover:bg-[#f2f4f6] text-xs font-medium text-[#191c1e] transition-colors cursor-pointer"
                >
                  {showFlaggedToo ? 'Hide Profile Conflicts' : 'Show All Including Conflicts'}
                </button>
              </div>

              {filteredDishes.length === 0 ? (
                <div className="plateful-card rounded-lg p-10 text-center space-y-3">
                  <p className="font-display text-base font-semibold text-[#191c1e]">
                    No dishes match your current filters
                  </p>
                  <p className="text-sm text-[#434653]">
                    Try clearing the search query or switching verification tiers to view additional dishes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTier('all');
                      setShowFlaggedToo(true);
                    }}
                    className="px-4 py-2 rounded bg-[#0f52ba] text-white text-xs font-semibold cursor-pointer"
                  >
                    Reset View Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDishes.map((dish) => {
                    const kitchen = KITCHENS.find((k) => k.id === dish.kitchenId);
                    return (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        kitchenName={kitchen?.name ?? 'Verified Kitchen'}
                        safetyProfile={safetyProfile}
                        onInspectMatrix={(d) => setInspectedDish(d)}
                        onAddToBag={handleRequestAddDish}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {activeScreen === 'kitchen' && (
          <KitchenMenuView
            kitchens={KITCHENS}
            selectedKitchen={activeKitchen}
            onSelectKitchen={(id) => setSelectedKitchenId(id)}
            dishes={DISHES}
            safetyProfile={safetyProfile}
            onBackToMarketplace={() => setActiveScreen('discover')}
            onInspectMatrix={(d) => setInspectedDish(d)}
            onAddToBag={handleRequestAddDish}
          />
        )}

        {activeScreen === 'verification' && (
          <LabVerificationView
            kitchens={KITCHENS}
            onSelectKitchen={handleOpenKitchen}
          />
        )}

        {activeScreen === 'profile' && (
          <SafetyProfileView
            profile={safetyProfile}
            dishes={DISHES}
            onToggleAllergen={toggleAllergen}
            onToggleStrictTrace={toggleStrictTrace}
            onUpdateTargets={updateMacroTargets}
            onBrowseSafeDishes={() => {
              setShowFlaggedToo(false);
              setActiveScreen('discover');
            }}
          />
        )}
      </main>

      {/* Quiet Clinical Footer */}
      <footer className="border-t border-[#e6e8ea] bg-white mt-12">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#434653]">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-[#003c90]">Plateful</span>
            <span aria-hidden="true">·</span>
            <span>Allergen-Verified Clinical Food Delivery</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveScreen('verification')}
              className="hover:text-[#003c90] cursor-pointer"
            >
              Assay Methodology
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('profile')}
              className="hover:text-[#003c90] cursor-pointer"
            >
              Safety Profile
            </button>
          </div>
        </div>
      </footer>

      {/* Allergen Matrix & Traceability Drawer */}
      <AllergenMatrixDrawer
        dish={inspectedDish}
        kitchen={KITCHENS.find((k) => k.id === inspectedDish?.kitchenId)}
        safetyProfile={safetyProfile}
        onClose={() => setInspectedDish(null)}
        onAddToBag={handleRequestAddDish}
      />

      {/* Warm Amber Allergy Safety Confirmation Dialog */}
      <AllergyAlertDialog
        dish={alertPendingDish}
        directConflicts={alertSafety?.directConflicts ?? []}
        traceConflicts={alertSafety?.traceConflicts ?? []}
        onCancel={() => setAlertPendingDish(null)}
        onConfirmAdd={addItemConfirmed}
      />

      {/* Slide-Over Order Bag & Clinical Checkout */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        items={cartItems}
        safetyProfile={safetyProfile}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
