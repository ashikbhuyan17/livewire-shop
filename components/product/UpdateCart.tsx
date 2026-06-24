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
          ? 'flex h-9 w-full max-w-full rounded-full border border-primary/25 bg-gradient-to-b from-primary/5 to-white text-primary shadow-sm ring-1 ring-primary/10 sm:h-10'
          : 'inline-flex h-8 shrink-0 rounded-full border border-primary/25 bg-white',
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
            ? 'h-full w-9 self-stretch text-primary hover:bg-primary/10 active:bg-primary/15 sm:w-10'
            : 'h-8 w-8 text-primary hover:bg-primary/5',
        )}
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden="true" size={isCard ? 16 : 14} strokeWidth={2.25} />
      </button>
      <span
        className={cn(
          'flex min-w-0 items-center justify-center text-center font-semibold tabular-nums',
          isCard
            ? 'min-w-0 flex-1 px-1 text-[11px] font-semibold leading-tight text-primary sm:text-xs'
            : 'w-8 shrink-0 text-sm text-primary',
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
            ? 'h-full w-9 self-stretch text-primary hover:bg-primary/10 active:bg-primary/15 disabled:pointer-events-none disabled:opacity-40 sm:w-10'
            : 'h-8 w-8 border-l border-primary/15 text-primary hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-40',
        )}
        aria-label="Increase quantity"
      >
        <Plus aria-hidden="true" size={isCard ? 16 : 14} strokeWidth={2.25} />
      </button>
    </div>
  );
}
