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
import { resolveCartImageSrc } from '@/lib/cart-image';
import { formatBDTNumber } from '@/lib/home-demo-data';
import { useCartStore } from '@/stores/cart-store';
import UpdateCart from '@/components/product/UpdateCart';
import { TkAmount } from '@/components/common/TkAmount';

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

  const itemCount = cart.items.reduce((n, i) => n + i.qty, 0);
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
          aria-label={`Open cart, ${itemCount} items, ৳${formatBDTNumber(totalPrice)}`}
          className="fixed right-0 top-1/2 z-30 hidden w-[88px] min-w-[80px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-l-2xl border border-primary/20 bg-gradient-to-b from-primary to-primary/90 px-2 py-2.5 text-white shadow-lg shadow-primary/25 ring-1 ring-primary/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:flex"
        >
          <div className="relative flex shrink-0 items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-white" strokeWidth={2} />
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-0.5 text-[9px] font-bold leading-none text-slate-900 shadow-sm">
              {itemCount}
            </span>
          </div>
          <span className="text-center text-xs font-bold leading-tight text-white/95">
            {itemCount} items
          </span>
          <span className="mt-0.5 flex w-full max-w-[calc(100%-4px)] justify-center rounded-md bg-secondary px-1.5 py-1 shadow-sm">
            <span className="text-sm font-bold leading-tight text-slate-900">
              <TkAmount amount={totalPrice} />
            </span>
          </span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-l border-slate-200 p-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col bg-slate-50">
          <SheetHeader className="border-b border-slate-200 bg-primary px-5 pb-4 pt-5 text-white">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <ShoppingBag className="h-5 w-5 text-secondary" />
              My Cart
              {itemCount > 0 ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-slate-900">
                  {itemCount}
                </span>
              ) : null}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-4 py-4">
            {cart.items.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
                Your cart is currently empty.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {cart.items.map((item, idx) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-2 p-4 sm:gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-50">
                        <Image
                          alt={item.name}
                          src={resolveCartImageSrc(item.image)}
                          width={96}
                          height={96}
                          className="h-10 w-10 object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-primary">
                          <TkAmount amount={item.price * item.qty} />
                        </p>
                      </div>

                      <div className="shrink-0 self-center">
                        <UpdateCart
                          cart={item}
                          variant="card"
                          className="w-auto min-w-[9rem] max-w-[12rem]"
                        />
                      </div>
                    </div>
                    {idx !== cart.items.length - 1 ? (
                      <div className="px-4">
                        <Separator className="bg-slate-100" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3">
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 text-sm font-bold text-slate-900">
                Bill details
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Items total</span>
                  <span className="font-bold text-slate-900">
                    <TkAmount amount={itemsTotal} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery charge</span>
                  <span className="font-bold text-slate-900">
                    <TkAmount amount={deliveryCharge} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>VAT</span>
                  <span className="font-bold text-slate-900">
                    <TkAmount amount={vat} />
                  </span>
                </div>
                <Separator className="my-2 bg-slate-200" />
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>Grand total</span>
                  <span className="text-base font-bold text-primary">
                    <TkAmount amount={grandTotal} />
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="h-11 w-full rounded-lg bg-slate-900 text-sm font-bold uppercase text-secondary hover:bg-slate-800 disabled:opacity-80"
              size="default"
              disabled={checkoutLoading || cart.items.length === 0}
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
