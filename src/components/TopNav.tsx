import { ShoppingBag } from 'lucide-react';
import type { ActiveScreen } from '@/src/types/plateful';

interface TopNavProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: { id: ActiveScreen; label: string }[] = [
  { id: 'discover', label: 'Marketplace' },
  { id: 'kitchen', label: 'Kitchen Menus' },
  { id: 'verification', label: 'Lab Standards' },
  { id: 'profile', label: 'Safety Profile' },
];

export function TopNav({ activeScreen, onNavigate, cartCount, onOpenCart }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#0f52ba]/12">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('discover')}
          className="font-display text-xl font-bold tracking-tight text-[#003c90] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f52ba] rounded"
        >
          Plateful
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f52ba] rounded ${
                  isActive
                    ? 'text-[#003c90] font-semibold'
                    : 'text-[#434653] hover:text-[#191c1e]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-[#0f52ba]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 bg-[#0f52ba] hover:bg-[#003c90] text-white text-sm font-medium px-4 py-2 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f52ba]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span>Order Bag</span>
            <span className="font-mono-tabular text-xs bg-white/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile compact navigation strip (keeps total sticky height concise) */}
      <nav
        aria-label="Mobile navigation"
        className="flex md:hidden items-center justify-between gap-2 px-6 py-2 border-t border-[#e6e8ea] bg-[#f8f9fb] overflow-x-auto"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`text-xs font-medium py-1 px-2 rounded whitespace-nowrap shrink-0 cursor-pointer ${
                isActive ? 'text-[#003c90] font-semibold bg-[#d9e2ff]/50' : 'text-[#434653]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
