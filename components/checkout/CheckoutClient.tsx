'use client';

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, Phone, Package, Mail, Loader2, User, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { placeOrder, type CheckoutOrderPayload } from '@/lib/fetcher';
import type { Cart } from '@/lib/cart';
import { resolveCartImageSrc } from '@/lib/cart-image';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cart-store';
import UpdateCart from '@/components/product/UpdateCart';
import CheckoutCoupon, {
  type AppliedCoupon,
} from '@/components/checkout/CheckoutCoupon';
import CheckoutRewardPoints from '@/components/checkout/CheckoutRewardPoints';
import {
  calculateCouponDiscount,
  formatCouponBillLabel,
} from '@/lib/coupon-utils';
import {
  calculateRewardPointRedemption,
  parseRewardPointProfile,
} from '@/lib/reward-point-utils';
import { cn } from '@/lib/utils';
import { PENDING_CART_CLEAR_KEY } from '@/lib/pending-cart-clear';
import { TkAmount } from '@/components/common/TkAmount';
import {
  calculateRateAmount,
  formatRatePercent,
} from '@/lib/currency';

function FieldGroup({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <Label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </Label>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function CheckoutPageClient({
  initialCart,
  shippingAreas,
  vat,
  tax,
  userProfile,
}: {
  initialCart: Cart;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAreas: any;
  vat: string | number;
  tax: string | number;
  userProfile?: unknown;
}) {
  const router = useRouter();
  const didInitCart = useRef(false);
  const cart = useCartStore((s) => s.cart);
  const cartProducts = cart.items;
  const itemCount = cartProducts.length;

  useLayoutEffect(() => {
    if (didInitCart.current) return;
    didInitCart.current = true;
    useCartStore.getState().initFromServerCart(initialCart);
  }, [initialCart]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    customer_note: '',
    deliveryAreaId: shippingAreas?.data?.[0]?.id ?? null,
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    delivery: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );
  const [useRewardPoints, setUseRewardPoints] = useState(false);

  const rewardPointProfile = useMemo(
    () => parseRewardPointProfile(userProfile),
    [userProfile],
  );

  const selectedDeliveryArea = useMemo(() => {
    const list = shippingAreas?.data;
    if (!Array.isArray(list) || list.length === 0) return null;
    const match = list.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any) => Number(a.id) === Number(formData.deliveryAreaId),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (match ?? list[0]) as any;
  }, [shippingAreas, formData.deliveryAreaId]);

  const deliveryCharge = Number(selectedDeliveryArea?.delivery_charge ?? 0);

  const validate = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      address: '',
      delivery: '',
    };

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2)
      newErrors.name = 'Please enter your full name';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else {
      const digits = formData.phone.replace(/\D/g, '');
      if (!/^[0-9]{10,14}$/.test(digits))
        newErrors.phone = 'Use 10–14 digits only';
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    )
      newErrors.email = 'Enter a valid email address';

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    else if (formData.address.trim().length < 8)
      newErrors.address = 'Add a bit more detail (area, road, flat)';

    if (formData.deliveryAreaId == null || formData.deliveryAreaId === '') {
      newErrors.delivery = 'Please select a delivery area';
    }

    setErrors(newErrors);
    return (
      !newErrors.name &&
      !newErrors.phone &&
      !newErrors.email &&
      !newErrors.address &&
      !newErrors.delivery
    );
  };

  const subtotal = useMemo(
    () => cartProducts.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartProducts],
  );

  const vatAmount = calculateRateAmount(subtotal, vat);
  const taxAmount = calculateRateAmount(subtotal, tax);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return calculateCouponDiscount(
      subtotal,
      appliedCoupon.discountType,
      appliedCoupon.discountValue,
    );
  }, [appliedCoupon, subtotal]);

  const grandTotal = Math.max(
    0,
    subtotal - couponDiscount + vatAmount + taxAmount + deliveryCharge,
  );

  const rewardRedemption = useMemo(() => {
    if (!rewardPointProfile || !useRewardPoints) {
      return null;
    }
    return calculateRewardPointRedemption(
      grandTotal,
      rewardPointProfile.rewardPoints,
      rewardPointProfile.perPointPrice,
    );
  }, [rewardPointProfile, useRewardPoints, grandTotal]);

  const dueAmount = rewardRedemption?.dueAmount ?? grandTotal;
  const pointDiscount = rewardRedemption?.pointDiscount ?? 0;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const shipping_charge_id = Number(selectedDeliveryArea?.id);
    if (!Number.isFinite(shipping_charge_id)) {
      setErrors((prev) => ({
        ...prev,
        delivery: 'Please select a delivery area',
      }));
      return;
    }

    const pointsRedeem: 0 | 1 =
      useRewardPoints && rewardPointProfile ? 1 : 0;

    const payload: CheckoutOrderPayload = {
      name: formData.name.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      email: formData.email.trim(),
      address: formData.address.trim(),
      customer_note: formData.customer_note.trim(),
      shipping_charge_id,
      products: cart.items.map((item) => ({
        id: String(item.id),
        qty: String(item.qty),
        product_color_id: String(item.product_color_id),
        product_variant_id: String(item.product_variant_id),
      })),
      ...(appliedCoupon?.code ? { coupon_code: appliedCoupon.code } : {}),
      points_redeem: pointsRedeem,
      payment_method: 'cod',
    };

    setIsSubmitting(true);
    try {
      const raw = await placeOrder(payload);
      toast.success(
        (raw as { message: string })?.message ?? 'Order placed successfully',
        {
          duration: 2000,
        },
      );
      try {
        sessionStorage.setItem(PENDING_CART_CLEAR_KEY, '1');
      } catch {
        /* private mode */
      }
      router.replace('/user/orders');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Try again.';
      toast.error('Order placement failed', { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <main className="min-h-[60vh] bg-gradient-to-b from-muted/40 to-background px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-md">
          <Empty className="rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.03]">
            <EmptyHeader>
              <EmptyMedia>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShoppingBag className="h-7 w-7" strokeWidth={1.75} />
                </div>
              </EmptyMedia>
              <EmptyTitle className="text-xl font-semibold tracking-tight">
                Your bag is empty
              </EmptyTitle>
              <EmptyDescription className="text-muted-foreground">
                Add a few items and come back here to finish checkout.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="rounded-full bg-primary px-6 font-semibold text-white shadow-md hover:bg-primary/90"
              >
                <Link href="/">Browse products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary px-6 font-semibold text-primary hover:bg-primary/5"
              >
                <Link href="/cart">View cart</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/80 to-background pb-28 lg:pb-10">
      <div className="mx-auto max-w-[95rem] px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-w-0">
            <form
              id="checkout-form"
              onSubmit={handleOrder}
              noValidate
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="space-y-6 p-4 sm:p-6">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-primary/[0.06] via-white to-secondary/[0.08]">
                  <div className="border-b border-slate-200/80 bg-white/90 px-4 py-4 sm:px-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                        <User className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                          Your details
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          We&apos;ll use this to contact you about delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">
                  <div className="flex flex-row flex-wrap gap-4">
                    <div className="min-w-[12rem] flex-1 basis-[14rem]">
                      <FieldGroup
                        label="Full name"
                        htmlFor="checkout-name"
                        error={errors.name}
                      >
                        <Input
                          id="checkout-name"
                          name="name"
                          autoComplete="name"
                          placeholder="e.g. Rahman Ahmed"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          aria-invalid={Boolean(errors.name)}
                          className="h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-primary"
                        />
                      </FieldGroup>
                    </div>
                    <div className="min-w-[12rem] flex-1 basis-[14rem]">
                      <FieldGroup
                        label="Mobile number"
                        htmlFor="checkout-phone"
                        hint="Digits only"
                        error={errors.phone}
                      >
                        <div className="relative">
                          <Phone
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                          />
                          <Input
                            id="checkout-phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="01XXXXXXXXX"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            aria-invalid={Boolean(errors.phone)}
                            className="h-11 rounded-xl border-slate-200 bg-white pl-10 focus-visible:ring-primary"
                          />
                        </div>
                      </FieldGroup>
                    </div>
                  </div>

                  <div className="mt-4">
                    <FieldGroup
                      label="Email (optional)"
                      htmlFor="checkout-email"
                      error={errors.email}
                    >
                      <div className="relative">
                        <Mail
                          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden
                        />
                        <Input
                          id="checkout-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          aria-invalid={Boolean(errors.email)}
                          className="h-11 rounded-xl border-slate-200 bg-white pl-10 focus-visible:ring-primary"
                        />
                      </div>
                    </FieldGroup>
                  </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                  <FieldGroup
                    label="Full address"
                    htmlFor="checkout-address"
                    error={errors.address}
                  >
                    <Textarea
                      id="checkout-address"
                      name="address"
                      autoComplete="street-address"
                      placeholder="House / flat, road, area, nearest landmark…"
                      rows={4}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      aria-invalid={Boolean(errors.address)}
                      className="min-h-[100px] resize-y rounded-xl border-slate-200 bg-white text-base focus-visible:ring-primary sm:text-sm"
                    />
                  </FieldGroup>
                </div>

                <div>
                  <FieldGroup
                    label="Note for delivery (optional)"
                    htmlFor="checkout-note"
                  >
                    <Textarea
                      id="checkout-note"
                      name="customer_note"
                      placeholder="Any special instructions for the courier…"
                      rows={3}
                      value={formData.customer_note}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_note: e.target.value,
                        })
                      }
                      className="min-h-[80px] resize-y rounded-xl border-slate-200 bg-white text-base focus-visible:ring-primary sm:text-sm"
                    />
                  </FieldGroup>
                </div>

                <Separator className="bg-border/70" />

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-slate-900">
                        Delivery area
                      </h2>
                      <p className="mt-0.5 text-sm text-slate-500">
                        Choose your zone to see the delivery fee.
                      </p>
                    </div>
                  </div>
                  {errors.delivery ? (
                    <p className="px-4 pt-3 text-sm text-destructive sm:px-5" role="alert">
                      {errors.delivery}
                    </p>
                  ) : null}

                  <div className="space-y-3 p-4 sm:p-5">
                    <p id="checkout-delivery-area-label" className="sr-only">
                      Select delivery zone. Delivery zone and fee.
                    </p>
                    <div
                      role="group"
                      aria-labelledby="checkout-delivery-area-label"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4"
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {shippingAreas?.data?.map((area: any) => {
                        const isSelected =
                          Number(formData.deliveryAreaId) === Number(area.id);
                        return (
                          <label
                            key={area.id}
                            htmlFor={`checkout-area-${area.id}`}
                            className={cn(
                              'flex flex-1 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all sm:p-4',
                              isSelected
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                                : 'border-slate-200 bg-slate-50/80 hover:border-primary/30 hover:bg-white',
                            )}
                          >
                            <Checkbox
                              id={`checkout-area-${area.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked === true) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    deliveryAreaId: area.id,
                                  }));
                                  return;
                                }
                                const list = shippingAreas?.data;
                                if (!Array.isArray(list) || list.length === 0)
                                  return;
                                const fallback =
                                  list.find(
                                    (a: { id: unknown }) =>
                                      Number(a.id) !== Number(area.id),
                                  ) ?? list[0];
                                setFormData((prev) => ({
                                  ...prev,
                                  deliveryAreaId: fallback.id,
                                }));
                              }}
                              className="mt-1 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="font-semibold text-slate-900">
                                {area.area_name}
                              </span>
                              <span className="mt-1 block text-sm text-slate-500">
                                Delivery fee:{' '}
                                <span className="font-semibold text-primary">
                                  <TkAmount amount={Number(area.delivery_charge)} />
                                </span>
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h2 className="text-base font-bold text-slate-900">Payment</h2>
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="font-semibold text-slate-900">
                      Cash on delivery
                      <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-900">
                        Popular
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {useRewardPoints && dueAmount > 0 ? (
                        <>
                          Pay{' '}
                          <span className="font-semibold text-primary">
                            <TkAmount amount={dueAmount} />
                          </span>{' '}
                          on delivery — the rest is covered by reward points.
                        </>
                      ) : useRewardPoints && dueAmount === 0 ? (
                        'This order is fully paid with your reward points.'
                      ) : (
                        'Pay when your order arrives at your doorstep.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <aside className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-primary/5">
                <div className="relative border-b border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-secondary"
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-primary/15">
                        <Package
                          className="h-5 w-5"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                          Review &amp; confirm
                        </p>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl">
                          Order summary
                        </h2>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 flex-col items-center justify-center rounded-xl bg-white px-2.5 py-1.5 text-center shadow-sm ring-1 ring-primary/15">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Items
                      </span>
                      <span className="text-base font-bold leading-none text-primary">
                        {itemCount}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="max-h-[min(48vh,24rem)] overflow-y-auto overscroll-contain [-ms-overflow-style:auto] [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
                  <ul className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
                    {cartProducts.map((item) => (
                      <li key={item.id}>
                        <div className="rounded-xl border border-border/50 bg-gradient-to-b from-white to-slate-50/90 p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02] sm:p-3 dark:from-card dark:to-card">
                          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-[5fr_3fr_2fr] sm:items-start sm:gap-3">
                            {/* product info — 50% on sm+; row 1 col 1 on mobile */}
                            <div className="col-start-1 row-start-1 flex min-w-0 w-full flex-row items-start justify-start gap-2 sm:col-start-auto sm:row-start-auto sm:gap-3">
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white bg-white shadow-sm ring-1 ring-border/40 sm:h-12 sm:w-12">
                                <Image
                                  alt={item.name}
                                  src={resolveCartImageSrc(item.image)}
                                  width={112}
                                  height={112}
                                  className="h-full w-full object-contain p-1"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                                  {item.name}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500 sm:text-[13px]">
                                  <TkAmount amount={item.price} />
                                  <span className="text-slate-400">
                                    {' '}
                                    × {item.qty}
                                  </span>
                                </p>
                              </div>
                            </div>
                            {/* update cart — 30% on sm+; full-width row below on mobile */}
                            <div className="col-span-2 col-start-1 row-start-2 flex min-w-0 w-full justify-start border-t border-border/50 pt-3 sm:col-span-1 sm:col-start-auto sm:row-start-auto sm:border-t-0 sm:pt-0">
                              <UpdateCart cart={item} variant="card" />
                            </div>
                            {/* total price — 20% on sm+; row 1 col 2 on mobile (same row as product) */}
                            <div className="col-start-2 row-start-1 flex min-w-0 w-full items-center justify-end sm:col-start-auto sm:row-start-auto">
                              <span className="inline-block text-sm font-bold text-primary">
                                <TkAmount amount={item.price * item.qty} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/60 bg-slate-50/80 px-4 py-4 sm:px-5 dark:bg-muted/20">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-border/80" aria-hidden />
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Bill details
                    </span>
                    <span className="h-px flex-1 bg-border/80" aria-hidden />
                  </div>
                  <dl className="space-y-0 rounded-xl border border-border/50 bg-white/80 px-3 py-1 shadow-sm dark:bg-card/60">
                    {(
                      [
                        ['Subtotal', subtotal],
                        [`VAT (${formatRatePercent(vat)}%)`, vatAmount],
                        [`Tax (${formatRatePercent(tax)}%)`, taxAmount],
                        ['Delivery', deliveryCharge],
                      ] as const
                    ).map(([label, amount], i) => (
                      <div
                        key={label}
                        className={cn(
                          'flex items-center justify-between gap-3 py-2.5 text-sm',
                          i > 0 && 'border-t border-dashed border-border/60',
                        )}
                      >
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="font-semibold text-slate-900">
                          <TkAmount amount={amount} />
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-3 rounded-xl border border-border/50 bg-white/80 px-3 py-1 shadow-sm dark:bg-card/60">
                    <CheckoutCoupon
                      subtotal={subtotal}
                      appliedCoupon={appliedCoupon}
                      onApply={setAppliedCoupon}
                      onRemove={() => setAppliedCoupon(null)}
                      disabled={isSubmitting}
                      variant="compact"
                    />

                    {rewardPointProfile ? (
                      <CheckoutRewardPoints
                        profile={rewardPointProfile}
                        orderTotal={grandTotal}
                        usePoints={useRewardPoints}
                        onUsePointsChange={setUseRewardPoints}
                        disabled={isSubmitting}
                        variant="compact"
                      />
                    ) : null}

                    {appliedCoupon && couponDiscount > 0 ? (
                      <div className="flex items-center justify-between gap-3 border-t border-dashed border-border/60 py-2.5 text-sm">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">
                          {formatCouponBillLabel(appliedCoupon)}
                        </span>
                        <span className="font-semibold text-emerald-700">
                          −<TkAmount amount={couponDiscount} />
                        </span>
                      </div>
                    ) : null}

                    {useRewardPoints && pointDiscount > 0 ? (
                      <div className="flex items-center justify-between gap-3 border-t border-dashed border-border/60 py-2.5 text-sm">
                        <span className="font-medium text-amber-800 dark:text-amber-300">
                          Reward points
                        </span>
                        <span className="font-semibold text-amber-800">
                          −<TkAmount amount={pointDiscount} />
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-3 border-t-2 border-border/80 py-3 text-base font-semibold">
                      <span className="text-foreground">
                        {useRewardPoints && pointDiscount > 0
                          ? dueAmount > 0
                            ? 'Due payment'
                            : 'Total due'
                          : 'Total'}
                      </span>
                      <span className="font-bold text-primary">
                        <TkAmount amount={dueAmount} />
                      </span>
                    </div>
                    {useRewardPoints && pointDiscount > 0 && dueAmount > 0 ? (
                      <p className="-mt-1 pb-1 text-center text-[11px] text-muted-foreground">
                        Order total{' '}
                        <span className="font-semibold">
                          <TkAmount amount={grandTotal} />
                        </span>
                        {' · '}
                        points cover{' '}
                        <span className="font-semibold text-amber-800">
                          <TkAmount amount={pointDiscount} />
                        </span>
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    form="checkout-form"
                    size="lg"
                    disabled={isSubmitting}
                    className="mt-4 h-11 w-full rounded-lg bg-slate-900 text-sm font-bold uppercase text-secondary hover:bg-slate-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="mr-2 h-4 w-4 shrink-0 animate-spin"
                          aria-hidden
                        />
                        Placing order…
                      </>
                    ) : dueAmount > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        Place order · <TkAmount amount={dueAmount} /> due
                      </span>
                    ) : (
                      'Place order'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
