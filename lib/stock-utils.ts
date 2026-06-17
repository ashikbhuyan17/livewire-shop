/** Parse API `available_stock` (string or number). */
export function parseAvailableStock(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export function isInStock(availableStock: number) {
  return availableStock > 0;
}

export function getVariantAvailableStock(
  variant: { available_stock?: unknown } | null | undefined,
): number {
  return parseAvailableStock(variant?.available_stock);
}

/** Clamp qty to [0, availableStock]. Returns 0 when out of stock. */
export function clampQtyToAvailableStock(
  qty: number,
  availableStock: number,
): number {
  if (availableStock <= 0) return 0;
  const n = Math.floor(qty);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(n, availableStock);
}

/** Max qty for cart line; legacy items without stock field stay uncapped. */
export function getCartItemMaxQty(item: {
  available_stock?: number;
}): number {
  if (item.available_stock == null) return Number.POSITIVE_INFINITY;
  return item.available_stock;
}

export function canIncreaseCartQty(item: {
  qty: number;
  available_stock?: number;
}): boolean {
  const max = getCartItemMaxQty(item);
  if (!Number.isFinite(max)) return true;
  return item.qty < max;
}
