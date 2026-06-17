export type CouponDiscountType = 'flat' | 'percentage';

export type AppliedCoupon = {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
};

export type ApplyCouponApiData = {
  code?: string;
  discount_type?: string;
  discount_value?: string | number;
  type?: string;
  discount?: string | number;
};

export function normalizeCouponDiscountType(
  value: string | undefined,
): CouponDiscountType {
  const type = String(value ?? '').toLowerCase();
  if (type === 'percentage' || type === 'percent' || type === '%') {
    return 'percentage';
  }
  return 'flat';
}

/** Flat uses API discount as-is; percentage is calculated from subtotal. */
export function calculateCouponDiscount(
  subtotal: number,
  discountType: CouponDiscountType,
  discountValue: number,
): number {
  const base = Math.max(0, subtotal);
  const value = Number(discountValue);
  if (!Number.isFinite(value) || value <= 0) return 0;

  if (discountType === 'percentage') {
    return (base * value) / 100;
  }

  return value;
}

export function parseAppliedCouponFromApi(
  data: ApplyCouponApiData | undefined,
  fallbackCode: string,
): AppliedCoupon | null {
  if (!data) return null;

  const code =
    (typeof data.code === 'string' && data.code.trim()) || fallbackCode.trim();
  const discountValue = Number(data.discount_value ?? data.discount);
  if (!code || !Number.isFinite(discountValue) || discountValue <= 0) {
    return null;
  }

  return {
    code,
    discountType: normalizeCouponDiscountType(
      data.discount_type ?? data.type,
    ),
    discountValue,
  };
}

export function formatCouponSavingsLabel(
  coupon: AppliedCoupon,
  discountAmount: number,
  currencySymbol: string,
  formatAmount: (n: number) => string,
): string {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}% off (−${currencySymbol}${formatAmount(discountAmount)})`;
  }
  return `−${currencySymbol}${formatAmount(discountAmount)} off`;
}

export function formatCouponBillLabel(coupon: AppliedCoupon): string {
  if (coupon.discountType === 'percentage') {
    return `Promo (${coupon.code} — ${coupon.discountValue}%)`;
  }
  return `Promo (${coupon.code})`;
}
