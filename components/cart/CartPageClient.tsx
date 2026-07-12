'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gift, Loader2, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import type { Cart } from '@/lib/cart';
import { resolveCartImageSrc } from '@/lib/cart-image';
import { ensureCartHydrated, useCartStore } from '@/stores/cart-store';
import CartQuantityStepper from './CartQuantityStepper';
import { TkAmount } from '@/components/common/TkAmount';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CartPageClient({ initialCart }: { initialCart: Cart }) {
  ensureCartHydrated(initialCart);

  const hydrated = useCartStore((s) => s.hydrated);
  const storeCart = useCartStore((s) => s.cart);
  const cart = hydrated ? storeCart : initialCart;
  const isPending = useCartStore((s) => s.isPending);
  const [promoCode, setPromoCode] = useState('');
  const [giftVoucher, setGiftVoucher] = useState('');

  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Enter a promo code');
      return;
    }
    toast.info('Promo codes are not available in demo mode yet.');
  };

  const handleApplyVoucher = () => {
    if (!giftVoucher.trim()) {
      toast.error('Enter a gift voucher code');
      return;
    }
    toast.info('Gift vouchers are not available in demo mode yet.');
  };

  return (
    <div className="mx-auto min-h-[700px] max-w-[95rem] px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
      <div className="mb-6 flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-primary" strokeWidth={2} />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Shopping Cart
        </h1>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        ) : null}
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-800">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Browse products and add items to your cart.
          </p>
          <Button
            asChild
            className="mt-6 rounded-lg bg-primary px-8 font-bold uppercase hover:bg-primary/90"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="grid grid-cols-[5.5rem_1fr_11rem_8rem_8rem_3rem] items-center gap-3 bg-slate-100 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              <span>Product</span>
              <span>Product Name</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Unit Price</span>
              <span className="text-right">Total</span>
              <span className="sr-only">Remove</span>
            </div>

            {cart.items.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-[5.5rem_1fr_11rem_8rem_8rem_3rem] items-center gap-3 px-4 py-4 ${
                  index < cart.items.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-50">
                  <Image
                    src={resolveCartImageSrc(item.image)}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>

                <p className="text-sm font-medium leading-snug text-slate-800">
                  {item.name}
                </p>

                <div className="flex justify-center">
                  <CartQuantityStepper item={item} showDelete={false} />
                </div>

                <p className="text-right text-sm font-semibold text-slate-800">
                  <TkAmount amount={item.price} />
                </p>

                <p className="text-right text-sm font-bold text-slate-900">
                  <TkAmount amount={item.price * item.qty} />
                </p>

                <button
                  type="button"
                  onClick={() => useCartStore.getState().removeItem(item.id)}
                  className="grid h-9 w-9 place-items-center justify-self-end rounded-md text-red-500 transition hover:bg-red-50"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {cart.items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                    <Image
                      src={resolveCartImageSrc(item.image)}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Unit: <TkAmount amount={item.price} />
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-primary">
                      <TkAmount amount={item.price * item.qty} />
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <CartQuantityStepper item={item} />
                </div>
              </article>
            ))}
          </div>

          {/* Bottom section */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/[0.03]">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Promo & voucher */}
              <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/[0.03] p-5 sm:p-6 lg:col-span-3 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Tag className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Save more</h3>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      Apply a promo code or gift voucher
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 lg:flex-row">
                  <div className="lg:flex-1">
                    <label
                      htmlFor="cart-promo-code"
                      className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500"
                    >
                      Promo code
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                      <Input
                        id="cart-promo-code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="h-12 flex-1 rounded-none border-0 bg-transparent px-4 shadow-none focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyPromo}
                        className="h-12 shrink-0 rounded-none bg-primary px-5 text-xs font-bold uppercase text-white hover:bg-primary/90 sm:px-6"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="lg:flex-1">
                    <label
                      htmlFor="cart-gift-voucher"
                      className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500"
                    >
                      <Gift className="h-3.5 w-3.5 text-secondary" aria-hidden />
                      Gift voucher
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/30">
                      <Input
                        id="cart-gift-voucher"
                        value={giftVoucher}
                        onChange={(e) => setGiftVoucher(e.target.value)}
                        placeholder="Enter gift voucher"
                        className="h-12 flex-1 rounded-none border-0 bg-transparent px-4 shadow-none focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="h-12 shrink-0 rounded-none bg-secondary px-5 text-xs font-bold uppercase text-slate-900 hover:bg-secondary/90 sm:px-6"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total & actions */}
              <div className="flex flex-col justify-between bg-gradient-to-br from-primary/[0.07] via-white to-secondary/10 p-5 sm:p-6 lg:col-span-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Order total
                  </p>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <p className="text-3xl font-bold text-primary sm:text-4xl">
                      <TkAmount amount={total} />
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                      {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-xl border-primary/25 bg-white text-sm font-bold uppercase text-primary hover:border-primary hover:bg-primary/5 lg:flex-1"
                  >
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                  <Button
                    asChild
                    disabled={cart.items.length === 0}
                    className="group h-12 w-full rounded-xl bg-slate-900 text-sm font-bold uppercase text-secondary shadow-md transition hover:bg-slate-800 lg:flex-1"
                  >
                    <Link href="/checkout" prefetch>
                      Check Out
                      <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
