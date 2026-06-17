"use client";

import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { CartItem } from "@/lib/cart";
import { canIncreaseCartQty } from "@/lib/stock-utils";
import { CURRENCY_SYMBOL, formatAmount } from "@/lib/currency";
import { useCartStore } from "@/stores/cart-store";

function CartUpdate({
  cart,
  total,
  setTotal,
}: {
  cart: CartItem;
  total?: number;
  setTotal?: (total: number) => void;
}) {
  const [count, setCount] = React.useState(cart.qty);
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  React.useEffect(() => {
    setCount(cart.qty);
  }, [cart.qty]);

  const handleUpdate = (newQty: number) => {
    updateItemQuantity(cart.id, newQty);
  };

  return (
    <div className="flex w-full items-center justify-between mt-2">
      <div className="flex gap-2 items-center">
        <p className="text-xs text-muted-foreground">Qty: {count}</p>
        <p className="text-sm font-bold text-primary">
          {CURRENCY_SYMBOL}
          {formatAmount(cart.price * count)}
        </p>
      </div>
      <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
        <Button
          onClick={() => {
            setCount((prev) => prev - 1);
            handleUpdate(count - 1);
            if (total && setTotal) {
              setTotal(total - cart.price);
            }
          }}
          className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          variant="outline"
          size="icon"
          disabled={count === 1}
          aria-label="Downvote"
        >
          <Minus size={16} aria-hidden="true" />
        </Button>
        <span className="flex items-center border border-input px-3 text-sm font-medium">
          {count}
        </span>
        <Button
          onClick={() => {
            if (!canIncreaseCartQty({ ...cart, qty: count })) return;
            setCount((prev) => prev + 1);
            handleUpdate(count + 1);
            if (total && setTotal) {
              setTotal(total + cart.price);
            }
          }}
          className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          variant="outline"
          size="icon"
          disabled={!canIncreaseCartQty({ ...cart, qty: count })}
          aria-label="Upvote"
        >
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default CartUpdate;
