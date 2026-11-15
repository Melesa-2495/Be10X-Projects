import { useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { ALLERGEN_LABELS } from '@/src/data/platefulData';
import type { CartItem, SafetyProfile } from '@/src/types/plateful';
import { evaluateDishSafety } from '@/src/utils/allergenCheck';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  safetyProfile: SafetyProfile;
  onClose: () => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export function CartCheckoutDrawer({
  isOpen,
  items,
  safetyProfile,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartCheckoutDrawerProps) {
  const [address, setAddress] = useState('450 Mission Bay Blvd S, Suite 310');
  const [safetyNote, setSafetyNote] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmedOrderCode, setConfirmedOrderCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const coldChainFee = items.length > 0 ? 3.5 : 0;
  const total = subtotal + coldChainFee;
  const totalCalories = items.reduce((sum, item) => sum + item.dish.calories * item.quantity, 0);
  const totalProtein = items.reduce((sum, item) => sum + item.dish.proteinG * item.quantity, 0);

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setValidationError('Delivery street address is required for cold-chain courier dispatch.');
      return;
    }
    if (safetyProfile.excludedAllergens.length > 0 && !safetyNote.trim()) {
      setValidationError(
        'Safety Protocol: Please enter kitchen prep or drop-off verification instructions for your active allergen exclusions.'
      );
      return;
    }
    setValidationError(null);
    setConfirmedOrderCode('PF-4821');
    onClearCart();
  };

  const handleResetAfterOrder = () => {
    setConfirmedOrderCode(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#191c1e]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-white plateful-shadow-elevated flex flex-col border-l border-[#0f52ba]/12"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6e8ea] bg-[#f8f9fb] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#0f52ba]" aria-hidden="true" />
            <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-[#191c1e]">
              {confirmedOrderCode ? 'Order Confirmed' : 'Order Bag & Clinical Checkout'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order bag"
            className="p-2 rounded hover:bg-[#e6e8ea] text-[#434653] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt View */}
        {confirmedOrderCode ? (
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="p-5 rounded-lg bg-[#e6f6ec] border border-[#006d3d]/20 space-y-2">
                <div className="flex items-center gap-2 text-[#006d3d] font-display font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Order #{confirmedOrderCode} Confirmed</span>
                </div>
                <p className="text-sm text-[#00522d] leading-relaxed">
                  Dispatched to dedicated allergen-controlled prep line. Tamper-evident clinical seal and batch LOT card attached.
                </p>
              </div>

              <div className="plateful-card rounded-lg p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#434653]">Delivery Destination</span>
                  <span className="font-medium text-[#191c1e] text-right max-w-[60%]">
                    {address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#434653]">Safety Instructions</span>
                  <span className="font-medium text-[#191c1e] text-right max-w-[60%]">
                    {safetyNote || 'Standard sterile seal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#434653]">Estimated Cold-Chain Arrival</span>
                  <span className="font-mono-tabular font-semibold text-[#003c90]">24–30 min</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAfterOrder}
              className="w-full py-3 rounded bg-[#0f52ba] hover:bg-[#003c90] text-white text-sm font-semibold cursor-pointer"
            >
              Return to Marketplace
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#737784]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#191c1e]">
              Your clinical order bag is empty
            </h3>
            <p className="text-sm text-[#434653] max-w-xs">
              Select dishes from verified kitchens to track combined macros and allergen clearance before checkout.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-4 py-2 rounded border border-[#0f52ba] text-[#0f52ba] text-xs font-semibold hover:bg-[#eef3ff] cursor-pointer"
            >
              Browse Verified Dishes
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Combined Macro Summary */}
              <div className="bg-[#f8f9fb] border border-[#e6e8ea] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#434653]">Bag Nutritional Load</div>
                  <div className="font-mono-tabular text-xl font-bold text-[#003c90]">
                    {totalCalories} kcal
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#434653]">Total Protein</div>
                  <div className="font-mono-tabular text-xl font-bold text-[#006d3d]">
                    {totalProtein}g
                  </div>
                </div>
              </div>

              {/* Itemized list */}
              <ul className="space-y-3">
                {items.map(({ dish, quantity }) => {
                  const safety = evaluateDishSafety(dish, safetyProfile);
                  return (
                    <li
                      key={dish.id}
                      className="plateful-card rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-display text-sm font-semibold text-[#191c1e]">
                            {dish.name}
                          </h4>
                          <div className="text-xs text-[#434653] font-mono-tabular mt-0.5">
                            {dish.calories} kcal · {dish.proteinG}g protein · ${dish.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(dish.id)}
                          aria-label={`Remove ${dish.name}`}
                          className="text-[#737784] hover:text-[#ba1a1a] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        {safety.isCleared ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#006d3d]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Allergen Cleared</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#953c00]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Override Confirmed</span>
                          </span>
                        )}

                        <div className="inline-flex items-center border border-[#c3c6d5] rounded bg-[#f8f9fb]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(dish.id, -1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-[#434653] hover:text-[#191c1e] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono-tabular text-xs font-semibold px-2.5">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(dish.id, 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 text-[#434653] hover:text-[#191c1e] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Clinical Input Fields */}
              <div className="space-y-4 pt-2 border-t border-[#e6e8ea]">
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-[#434653] mb-1.5"
                  >
                    Delivery Street Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d5] rounded px-3.5 py-2 text-sm text-[#191c1e] focus:outline-none focus:border-[#0f52ba] focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="checkout-safety-note"
                      className="block text-xs font-semibold text-[#434653]"
                    >
                      Allergen Prep & Sealed Drop-Off Note
                    </label>
                    {safetyProfile.excludedAllergens.length > 0 && (
                      <span className="text-[11px] font-medium text-[#0f52ba]">
                        Required ({safetyProfile.excludedAllergens.map((a) => ALLERGEN_LABELS[a].filterLabel).join(', ')})
                      </span>
                    )}
                  </div>
                  <input
                    id="checkout-safety-note"
                    type="text"
                    value={safetyNote}
                    onChange={(e) => {
                      setSafetyNote(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g., Celiac-safe seal required, leave on clinical bench"
                    className={`w-full rounded px-3.5 py-2 text-sm text-[#191c1e] focus:outline-none transition-colors ${
                      validationError
                        ? 'bg-[#fff2eb] border-2 border-[#953c00]'
                        : 'bg-[#f8f9fb] border border-[#c3c6d5] focus:border-[#0f52ba] focus:bg-white'
                    }`}
                  />
                  {validationError && (
                    <p className="mt-1.5 text-xs font-medium text-[#953c00] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{validationError}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Totals & Submit */}
            <div className="p-6 border-t border-[#e6e8ea] bg-[#f8f9fb] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#434653]">
                  <span>Subtotal</span>
                  <span className="font-mono-tabular">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#434653]">
                  <span>Insulated Cold-Chain Delivery</span>
                  <span className="font-mono-tabular">${coldChainFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-base text-[#191c1e] pt-2 border-t border-[#e6e8ea]">
                  <span>Total</span>
                  <span className="font-mono-tabular">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded bg-[#0f52ba] hover:bg-[#003c90] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Place Allergen-Verified Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
