'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/cart';
import { canIncreaseCartQty } from '@/lib/stock-utils';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';

type CartQuantityStepperProps = {
  item: CartItem;
  showDelete?: boolean;
  className?: string;
};

export default function CartQuantityStepper({
  item,
  showDelete = true,
  className,
}: CartQuantityStepperProps) {
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const canIncrease = canIncreaseCartQty(item);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="inline-flex h-9 items-stretch overflow-hidden rounded-md border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() =>
            item.qty <= 1
              ? removeItem(item.id)
              : updateItemQuantity(item.id, item.qty - 1)
          }
          className="grid w-9 place-items-center text-slate-600 transition hover:bg-slate-50"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex min-w-[2.25rem] items-center justify-center border-x border-slate-200 px-2 text-sm font-semibold tabular-nums text-slate-900">
          {item.qty}
        </span>
        <button
          type="button"
          onClick={() => updateItemQuantity(item.id, item.qty + 1)}
          disabled={!canIncrease}
          className="grid w-9 place-items-center text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {showDelete ? (
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="grid h-9 w-9 place-items-center rounded-md text-red-500 transition hover:bg-red-50"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
