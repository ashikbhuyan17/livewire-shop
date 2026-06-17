'use client';

import { useState } from 'react';
import { Loader2, Tag, CheckCircle2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { applyCoupon } from '@/lib/fetcher';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import {
  type AppliedCoupon,
  calculateCouponDiscount,
  formatCouponSavingsLabel,
  parseAppliedCouponFromApi,
} from '@/lib/coupon-utils';

export type { AppliedCoupon };

function isCouponSuccess(status: unknown) {
  if (status === true) return true;
  return String(status ?? '').toLowerCase() === 'success';
}

type Props = {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
};

export default function CheckoutCoupon({
  subtotal,
  appliedCoupon,
  onApply,
  onRemove,
  disabled = false,
  variant = 'default',
}: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const isCompact = variant === 'compact';

  const appliedDiscount = appliedCoupon
    ? calculateCouponDiscount(
        subtotal,
        appliedCoupon.discountType,
        appliedCoupon.discountValue,
      )
    : 0;

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Enter a promo code');
      return;
    }

    setError('');
    setIsApplying(true);
    try {
      const res = await applyCoupon({ coupon_code: trimmed });
      if (!res.ok || !isCouponSuccess(res.status)) {
        const message =
          (typeof res.message === 'string' && res.message) ||
          'This promo code is not valid';
        setError(message);
        toast.error('Could not apply promo code', { description: message });
        return;
      }

      const parsed = parseAppliedCouponFromApi(res.data, trimmed);
      if (!parsed) {
        const message = 'Invalid coupon response from server';
        setError(message);
        toast.error(message);
        return;
      }

      const discount = calculateCouponDiscount(
        subtotal,
        parsed.discountType,
        parsed.discountValue,
      );

      onApply(parsed);
      setCode('');
      toast.success(
        res.message ||
          (discount > 0
            ? `You saved ${CURRENCY_SYMBOL}${formatAmount(discount)}`
            : 'Promo code applied'),
      );
    } catch {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    setError('');
    onRemove();
    toast.message('Promo code removed');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleApply();
    }
  };

  return (
    <div
      className={cn(
        isCompact
          ? 'py-3'
          : 'border-t border-border/60 bg-white/60 px-4 py-4 sm:px-5 dark:bg-card/40',
      )}
    >
      {!isCompact ? (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-headerBg/10 text-headerBg">
            <Tag className="h-4 w-4" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Promo code</p>
            <p className="text-xs text-muted-foreground">
              Have a coupon? Apply it before you place your order.
            </p>
          </div>
        </div>
      ) : (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Promo code
        </p>
      )}

      {appliedCoupon ? (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 to-teal-50/50 px-3 py-3 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-teal-950/20"
          role="status"
        >
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-3 w-3" aria-hidden />
                {appliedCoupon.code}
              </span>
              {appliedDiscount > 0 ? (
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {formatCouponSavingsLabel(
                    appliedCoupon,
                    appliedDiscount,
                    CURRENCY_SYMBOL,
                    formatAmount,
                  )}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-400/80">
              {appliedCoupon.discountType === 'percentage'
                ? `${appliedCoupon.discountValue}% off subtotal`
                : `${CURRENCY_SYMBOL}${formatAmount(appliedCoupon.discountValue)} flat off subtotal`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled || isApplying}
            className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-emerald-100/80 hover:text-foreground dark:hover:bg-emerald-950/50"
            aria-label="Remove promo code"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={cn(
              'flex flex-col gap-2 rounded-xl border border-dashed bg-muted/20 p-2 sm:flex-row sm:items-stretch',
              error
                ? 'border-destructive/50 bg-destructive/[0.03]'
                : 'border-border/80',
            )}
          >
            <Input
              id="checkout-coupon"
              name="coupon_code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. SAVE10"
              disabled={disabled || isApplying}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'checkout-coupon-error' : undefined}
              className="h-11 flex-1 rounded-lg border-border/70 bg-background uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal"
            />
            <Button
              type="button"
              onClick={() => void handleApply()}
              disabled={disabled || isApplying || !code.trim()}
              className="h-11 shrink-0 rounded-lg bg-headerBg px-5 font-semibold text-white hover:bg-headerBg/90 sm:min-w-[6.5rem]"
            >
              {isApplying ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden
                  />
                  Applying…
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
          {error ? (
            <p
              id="checkout-coupon-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
