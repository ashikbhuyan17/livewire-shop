/** Site-wide currency symbol — change here to update every price display. */
export const CURRENCY_SYMBOL = '€';

/** Formatted amount without the symbol (no `.00` on whole numbers). */
export function formatAmount(amount: string | number): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Display API tax/VAT rate as returned (e.g. `27.00`). */
export function formatRatePercent(rate: string | number | null | undefined): string {
  const raw = String(rate ?? '').trim();
  return raw || '0';
}

/** Percentage of base — keeps decimals (no rounding). */
export function calculateRateAmount(
  base: number,
  rate: string | number | null | undefined,
): number {
  const percentage = Number(rate);
  if (!Number.isFinite(percentage)) return 0;
  return (base * percentage) / 100;
}

/** Amount prefixed with {@link CURRENCY_SYMBOL}. */
export function formatMoney(amount: string | number): string {
  return `${CURRENCY_SYMBOL}${formatAmount(amount)}`;
}
