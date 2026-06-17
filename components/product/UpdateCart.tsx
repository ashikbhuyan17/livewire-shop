'use client';

import { Minus, Plus } from 'lucide-react';

import type { CartItem } from '@/lib/cart';
import { canIncreaseCartQty } from '@/lib/stock-utils';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

type UpdateCartVariant = 'inline' | 'card';

export default function UpdateCart({
  cart,
  variant = 'inline',
  className,
}: {
  cart: CartItem;
  variant?: UpdateCartVariant;
  className?: string;
}) {
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const handleUpdate = (newQty: number) => {
    updateItemQuantity(cart.id, newQty);
  };
  const handleRemoveItem = () => {
    removeItem(cart.id);
  };
  const quantity = cart.qty;
  const isCard = variant === 'card';
  const canIncrease = canIncreaseCartQty(cart);

  return (
    <div
      className={cn(
        'items-stretch overflow-hidden select-none',
        isCard
          ? 'flex h-9 sm:h-10 w-full max-w-full rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-100 to-amber-50 text-amber-950 shadow-sm ring-1 ring-amber-900/5'
          : 'inline-flex h-8 shrink-0 rounded-md border bg-white',
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (quantity <= 1) {
            handleRemoveItem();
          } else {
            handleUpdate(quantity - 1);
          }
        }}
        className={cn(
          'grid shrink-0 place-items-center transition-colors',
          isCard
            ? 'h-full w-10 sm:w-11 self-stretch text-amber-900 hover:bg-amber-200/65 active:bg-amber-200/90'
            : 'h-8 w-8 text-gray-800 hover:bg-gray-50',
        )}
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden="true" size={isCard ? 18 : 16} strokeWidth={2.25} />
      </button>
      <span
        className={cn(
          'flex min-w-0 items-center justify-center text-center font-semibold tabular-nums',
          isCard
            ? 'min-w-0 flex-1 px-1 text-[11px] sm:text-xs font-semibold leading-tight text-amber-950'
            : 'w-9 shrink-0 text-sm text-gray-900',
        )}
      >
        {isCard ? (
          <span className="inline-flex items-center justify-center gap-x-1 sm:gap-x-1.5">
            <span className="tabular-nums">{quantity}</span>
            <span className="font-medium">in</span>
            <span className="font-medium">Bag</span>
          </span>
        ) : (
          quantity
        )}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!canIncrease) return;
          handleUpdate(quantity + 1);
        }}
        disabled={!canIncrease}
        className={cn(
          'grid shrink-0 place-items-center transition-colors',
          isCard
            ? 'h-full w-10 sm:w-11 self-stretch text-amber-900 hover:bg-amber-200/65 active:bg-amber-200/90 disabled:opacity-40 disabled:pointer-events-none'
            : 'h-8 w-8 border-l text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none',
        )}
        aria-label="Increase quantity"
      >
        <Plus aria-hidden="true" size={isCard ? 18 : 16} strokeWidth={2.25} />
      </button>
    </div>
  );
}
