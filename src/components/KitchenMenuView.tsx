import { ArrowLeft, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { ConfidenceBadge } from '@/src/components/ConfidenceBadge';
import { DishCard } from '@/src/components/DishCard';
import { SafeImage } from '@/src/components/SafeImage';
import type { Dish, Kitchen, SafetyProfile } from '@/src/types/plateful';

interface KitchenMenuViewProps {
  kitchens: Kitchen[];
  selectedKitchen: Kitchen;
  onSelectKitchen: (kitchenId: string) => void;
  dishes: Dish[];
  safetyProfile: SafetyProfile;
  onBackToMarketplace: () => void;
  onInspectMatrix: (dish: Dish) => void;
  onAddToBag: (dish: Dish) => void;
}

export function KitchenMenuView({
  kitchens,
  selectedKitchen,
  onSelectKitchen,
  dishes,
  safetyProfile,
  onBackToMarketplace,
  onInspectMatrix,
  onAddToBag,
}: KitchenMenuViewProps) {
  const kitchenDishes = dishes.filter((d) => d.kitchenId === selectedKitchen.id);

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb + Kitchen Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToMarketplace}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0f52ba] hover:text-[#003c90] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Verified Kitchens</span>
        </button>

        <div className="flex items-center gap-1.5 bg-[#eceef0] p-1 rounded-lg overflow-x-auto">
          {kitchens.map((k) => {
            const active = k.id === selectedKitchen.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => onSelectKitchen(k.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-[#003c90] font-semibold shadow-xs'
                    : 'text-[#434653] hover:text-[#191c1e]'
                }`}
              >
                {k.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kitchen Clinical Header Card */}
      <section className="plateful-card rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto bg-[#eceef0]">
          <SafeImage
            src={selectedKitchen.image}
            alt={selectedKitchen.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#434653]">
                {selectedKitchen.neighborhood} · {selectedKitchen.cuisineFocus}
              </span>
              <ConfidenceBadge tier={selectedKitchen.confidenceTier} />
            </div>

            <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#191c1e]">
              {selectedKitchen.name}
            </h1>

            <p className="text-sm text-[#434653] leading-relaxed max-w-2xl">
              {selectedKitchen.protocolSummary}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#e6e8ea]">
            <div>
              <div className="text-xs text-[#434653]">Safety Score</div>
              <div className="font-mono-tabular text-2xl font-bold text-[#003c90]">
                {selectedKitchen.safetyScore.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#434653]">ELISA Swab Rate</div>
              <div className="font-mono-tabular text-sm font-semibold text-[#006d3d] mt-1">
                {selectedKitchen.swabPassRate}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#434653]">Last Audit</div>
              <div className="font-mono-tabular text-sm font-semibold text-[#191c1e] mt-1">
                {selectedKitchen.auditDate}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#434653]">Cold-Chain ETA</div>
              <div className="inline-flex items-center gap-1 font-mono-tabular text-sm font-semibold text-[#191c1e] mt-1">
                <Clock className="w-3.5 h-3.5 text-[#0f52ba]" />
                <span>{selectedKitchen.deliveryMinutes}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#00522d] font-medium">
            {selectedKitchen.dedicatedZones.map((zone) => (
              <span key={zone} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006d3d]" aria-hidden="true" />
                <span>{zone}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen Dishes Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#191c1e]">
            Prepared Dishes ({kitchenDishes.length})
          </h2>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#434653]">
            <ShieldCheck className="w-4 h-4 text-[#0f52ba]" />
            <span>Every dish includes batch LOT traceability</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              kitchenName={selectedKitchen.name}
              safetyProfile={safetyProfile}
              onInspectMatrix={onInspectMatrix}
              onAddToBag={onAddToBag}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
