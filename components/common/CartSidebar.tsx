'use client';

import { Loader2, ShoppingBag } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import type { Cart } from '@/lib/cart';
import { useCartStore } from '@/stores/cart-store';
import UpdateCart from '@/components/product/UpdateCart';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';

function CartSidebar({ initialCart }: { initialCart: Cart }) {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCartStore((s) => s.cart);
  const cartSheetOpen = useCartStore((s) => s.cartSheetOpen);
  const setCartSheetOpen = useCartStore((s) => s.setCartSheetOpen);
  const didInit = useRef(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (pathname === '/checkout' && cartSheetOpen) {
      setCartSheetOpen(false);
      setCheckoutLoading(false);
      return;
    }
    if (checkoutLoading && pathname.startsWith('/signin')) {
      setCheckoutLoading(false);
      setCartSheetOpen(false);
    }
  }, [pathname, cartSheetOpen, setCartSheetOpen, checkoutLoading]);

  useEffect(() => {
    if (!checkoutLoading) return;
    const t = setTimeout(() => setCheckoutLoading(false), 25_000);
    return () => clearTimeout(t);
  }, [checkoutLoading]);

  useEffect(() => {
    if (cartSheetOpen) router.prefetch('/checkout');
  }, [cartSheetOpen, router]);

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    useCartStore.getState().initFromServerCart(initialCart);
  }, [initialCart]);

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const itemsTotal = totalPrice;
  const deliveryCharge = 0;
  const vat = 0;
  const grandTotal = itemsTotal + deliveryCharge + vat;

  return (
    <Sheet
      open={cartSheetOpen}
      onOpenChange={(open) => {
        setCartSheetOpen(open);
        if (!open) setCheckoutLoading(false);
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={`Open cart, ${cart.items.length} lines, ${CURRENCY_SYMBOL}${formatAmount(totalPrice)}`}
          className="fixed right-0 top-1/2 z-30 hidden w-[88px] min-w-[80px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-l-2xl border border-amber-400/55 bg-gradient-to-b from-amber-100 to-amber-50 px-2 py-2.5 text-amber-950 shadow-lg shadow-amber-900/10 ring-1 ring-amber-900/5 transition-all duration-300 hover:scale-[1.02] hover:from-amber-200/80 hover:to-amber-100 hover:shadow-xl sm:flex"
        >
          <div className="relative flex shrink-0 items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-amber-900" strokeWidth={2} />
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F7941D] px-0.5 text-[9px] font-bold leading-none text-white shadow-sm">
              {cart.items.length}
            </span>
          </div>
          <span className="text-center text-xs font-bold leading-tight text-amber-900">
            {cart.items.length} items
          </span>
          <span className="mt-0.5 flex w-full max-w-[calc(100%-4px)] justify-center rounded-md bg-[#2D7A27] px-1.5 py-1 shadow-sm">
            <span className="text-sm font-bold tabular-nums leading-tight text-white">
              <span className="font-extrabold text-sm">{CURRENCY_SYMBOL}</span>
              {formatAmount(totalPrice)}
            </span>
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-3">
            <SheetTitle className="font-bold text-lg">My Cart</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-4 pb-4">
            {cart.items.length === 0 ? (
              <div className="rounded-xl border bg-white p-6 text-center text-sm text-muted-foreground">
                Your cart is currently empty.
              </div>
            ) : (
              <div className="rounded-xl border bg-[#F6F7F8] overflow-hidden">
                {cart.items.map((item, idx) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-2 sm:gap-3 p-4">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-white grid place-items-center overflow-hidden">
                        <Image
                          alt={item.name}
                          src={`${process.env.NEXT_PUBLIC_IMG_URL}/${item.image}`}
                          width={96}
                          height={96}
                          className="h-10 w-10 object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-900 mt-0.5 font-semibold tabular-nums">
                          <span className="font-extrabold text-sm">{CURRENCY_SYMBOL}</span>
                          {formatAmount(item.price * item.qty)}
                        </p>
                      </div>

                      <div className="shrink-0 self-center">
                        <UpdateCart
                          cart={item}
                          variant="card"
                          className="w-auto min-w-[9.75rem] max-w-[12.75rem]"
                        />
                      </div>
                    </div>
                    {idx !== cart.items.length - 1 ? (
                      <div className="px-4">
                        <Separator className="bg-black/10" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 pb-5 pt-3 border-t bg-white">
            {/* Bill details */}
            <div className="mb-3 rounded-xl border bg-[#F6F7F8] p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">
                Bill details
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Items total</span>
                  <span className="font-bold text-gray-900">
                    <span className="font-extrabold text-sm">{CURRENCY_SYMBOL}</span>
                    {formatAmount(itemsTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery charge</span>
                  <span className="font-bold text-gray-900">
                    <span className="font-extrabold text-sm">{CURRENCY_SYMBOL}</span>{' '}
                    {deliveryCharge}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vat</span>
                  <span className="font-bold text-gray-900">
                    {' '}
                    <span className="font-extrabold text-sm">{CURRENCY_SYMBOL}</span>
                    {formatAmount(vat)}
                  </span>
                </div>
                <Separator className="my-2 bg-black/10" />
                <div className="flex items-center justify-between font-semibold text-gray-900">
                  <span>Grand total</span>
                  <span className="font-bold text-gray-900">
                    {' '}
                    <span className="font-extrabold text-sm">{CURRENCY_SYMBOL}</span>
                    {formatAmount(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-10 text-sm font-semibold bg-[#F7941D] hover:bg-[#E88610] text-white disabled:opacity-80"
              size="default"
              disabled={checkoutLoading}
              onClick={() => {
                if (pathname === '/checkout') {
                  setCartSheetOpen(false);
                  setCheckoutLoading(false);
                  return;
                }
                setCheckoutLoading(true);
                router.push('/checkout');
              }}
            >
              {checkoutLoading ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 shrink-0 animate-spin"
                    aria-hidden
                  />
                  Going to checkout…
                </>
              ) : (
                'Checkout'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CartSidebar;
