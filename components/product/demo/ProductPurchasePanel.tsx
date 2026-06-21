'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Eye,
  GitCompareArrows,
  Heart,
  Share2,
  ShoppingCart,
  Wallet,
  Package,
  Truck,
  CreditCard,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { STATIC_PRODUCT, formatProductPrice, type ProductColorId, type ProductVariantId } from '@/lib/product-demo-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductPurchasePanel() {
  const [colorId, setColorId] = useState<ProductColorId>(STATIC_PRODUCT.colors[0].id);
  const [variantId, setVariantId] = useState<ProductVariantId>(STATIC_PRODUCT.variants[0].id);
  const [priceType, setPriceType] = useState<'offer' | 'regular'>('offer');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const variant = STATIC_PRODUCT.variants.find((v) => v.id === variantId)!;
  const color = STATIC_PRODUCT.colors.find((c) => c.id === colorId)!;

  const basePrice =
    priceType === 'offer' ? variant.price : variant.regularPrice;

  const addonsTotal = useMemo(
    () =>
      STATIC_PRODUCT.addons
        .filter((a) => selectedAddons.includes(a.id))
        .reduce((sum, a) => sum + a.price, 0),
    [selectedAddons],
  );

  const totalPrice = basePrice + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          Brand: {STATIC_PRODUCT.brand}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-md border-slate-200 text-xs font-semibold"
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-md border-slate-200 text-xs font-semibold"
          >
            <Heart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Wishlist</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-md border-slate-200 text-xs font-semibold"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {STATIC_PRODUCT.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          {color.name} | {variant.label}
        </p>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-2xl font-bold text-primary sm:text-3xl">
          {formatProductPrice(basePrice)}
        </span>
        <span className="text-base text-slate-400 line-through sm:text-lg">
          {formatProductPrice(STATIC_PRODUCT.originalPrice)}
        </span>
      </div>

      <p className="flex items-center gap-2 text-sm text-slate-600">
        <Eye className="h-4 w-4 text-primary" />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        {STATIC_PRODUCT.viewers} people viewing this product now
      </p>

      {/* Quick specs */}
      <ul className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
        {STATIC_PRODUCT.quickSpecs.map((spec) => (
          <li key={spec} className="flex gap-2 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {spec}
          </li>
        ))}
      </ul>

      {/* Color selector */}
      <div>
        <p className="mb-2.5 text-sm font-semibold text-slate-800">
          Color: <span className="font-normal text-slate-600">{color.name}</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {STATIC_PRODUCT.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColorId(c.id)}
              className={cn(
                'relative h-14 w-14 overflow-hidden rounded-xl border-2 bg-white p-1 transition sm:h-16 sm:w-16',
                colorId === c.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-slate-200 hover:border-primary/50',
              )}
              title={c.name}
            >
              <Image src={c.image} alt={c.name} fill sizes="64px" className="object-contain p-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Variant selector */}
      <div>
        <p className="mb-2.5 text-sm font-semibold text-slate-800">RAM &amp; Storage</p>
        <div className="flex flex-wrap gap-2">
          {STATIC_PRODUCT.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariantId(v.id)}
              className={cn(
                'rounded-lg border px-3 py-2 text-xs font-semibold transition sm:text-sm',
                variantId === v.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          {
            icon: Wallet,
            label: 'Minimum Booking',
            value: formatProductPrice(STATIC_PRODUCT.minBooking),
          },
          {
            icon: Award,
            label: 'Purchase Points',
            value: `${STATIC_PRODUCT.purchasePoints} Points`,
          },
          {
            icon: CreditCard,
            label: 'EMI Available',
            value: 'Details',
            href: '/pages/emi-policy',
          },
        ].map(({ icon: Icon, label, value, href }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center sm:text-left"
          >
            <Icon className="mx-auto mb-1 h-4 w-4 text-primary sm:mx-0" />
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>
            {href ? (
              <Link href={href} className="text-sm font-semibold text-primary hover:underline">
                {value}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-slate-800">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Price options */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[
          { id: 'offer' as const, label: 'Offer Price', amount: variant.price },
          { id: 'regular' as const, label: 'Regular Price', amount: variant.regularPrice },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setPriceType(opt.id)}
            className={cn(
              'rounded-xl border p-3 text-left transition',
              priceType === opt.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-slate-200 bg-white hover:border-primary/30',
            )}
          >
            <p className="text-xs font-medium text-slate-500">{opt.label}</p>
            <p className="text-lg font-bold text-primary">{formatProductPrice(opt.amount)}</p>
          </button>
        ))}
      </div>

      <p className="flex items-center gap-2 text-sm text-slate-600">
        <Truck className="h-4 w-4 text-primary" />
        Estimated delivery: {STATIC_PRODUCT.deliveryDays}
      </p>

      {/* Add-ons */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">
          Livewire Care Add-ons
        </div>
        <div className="divide-y divide-slate-100 bg-white p-3">
          {STATIC_PRODUCT.addons.map((addon) => (
            <label
              key={addon.id}
              className="flex cursor-pointer items-start gap-3 py-2.5"
            >
              <Checkbox
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={() => toggleAddon(addon.id)}
                className="mt-0.5 border-primary data-[state=checked]:bg-primary"
              />
              <span className="min-w-0 flex-1 text-sm text-slate-700">{addon.label}</span>
              <span className="shrink-0 text-sm font-bold text-primary">
                {formatProductPrice(addon.price)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5">
        <Checkbox
          checked={agreedTerms}
          onCheckedChange={(v) => setAgreedTerms(v === true)}
          className="mt-0.5 border-primary data-[state=checked]:bg-primary"
        />
        <span className="text-sm text-slate-600">
          I agree to Livewire&apos;s{' '}
          <Link href="/pages/terms" className="font-semibold text-primary hover:underline">
            Terms &amp; Conditions
          </Link>
        </span>
      </label>

      <p className="text-center text-2xl font-bold text-primary sm:text-3xl">
        {formatProductPrice(totalPrice)}
      </p>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-lg border-slate-900 bg-slate-900 text-sm font-bold uppercase text-white hover:bg-slate-800"
          disabled={!agreedTerms}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          className="h-11 rounded-lg bg-secondary text-sm font-bold uppercase text-slate-900 hover:bg-secondary/90"
          disabled={!agreedTerms}
        >
          Buy Now
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Button className="h-11 rounded-lg bg-emerald-600 text-sm font-bold uppercase text-white hover:bg-emerald-700">
          <Package className="mr-2 h-4 w-4" />
          In Stock
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-lg border-slate-300 text-sm font-bold uppercase text-slate-700"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {STATIC_PRODUCT.warranty}
        </Button>
      </div>
    </div>
  );
}
