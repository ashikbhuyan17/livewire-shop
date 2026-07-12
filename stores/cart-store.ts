import { create } from 'zustand';
import type { Cart, CartItem } from '@/lib/cart';
import {
  addToCartAction,
  removeFromCartAction,
  updateQuantityAction,
  clearCartAction,
} from '@/lib/cart';
import {
  clampQtyToAvailableStock,
  getCartItemMaxQty,
} from '@/lib/stock-utils';

let inFlight = 0;
const qtySyncRef = new Map<
  number,
  { timer: ReturnType<typeof setTimeout> | null; version: number }
>();

function normalizeCartItem(item: CartItem): CartItem | null {
  const max = item.available_stock ?? 0;
  if (max <= 0 && item.available_stock != null) return null;
  if (item.available_stock == null) return item;
  const qty = clampQtyToAvailableStock(item.qty, max);
  if (qty <= 0) return null;
  return { ...item, qty, available_stock: max };
}

function optimisticAdd(prev: Cart, item: CartItem): Cart {
  const max = item.available_stock ?? 0;
  if (max <= 0) return prev;

  const normalized = normalizeCartItem(item);
  if (!normalized) return prev;

  const existing = prev.items.find((i) => i.id === item.id);
  if (existing) {
    const mergedQty = existing.qty + normalized.qty;
    const next = normalizeCartItem({
      ...existing,
      available_stock: max,
      qty: mergedQty,
    });
    if (!next) {
      return { items: prev.items.filter((i) => i.id !== item.id) };
    }
    return {
      items: prev.items.map((i) => (i.id === item.id ? next : i)),
    };
  }
  return { items: [...prev.items, normalized] };
}

function normalizeCart(cart: Cart): Cart {
  return {
    items: cart.items
      .map((i) => normalizeCartItem(i))
      .filter((i): i is CartItem => i != null),
  };
}

export type CartStore = {
  cart: Cart;
  isPending: boolean;
  cartSheetOpen: boolean;
  hydrated: boolean;
  setCartSheetOpen: (open: boolean) => void;
  initFromServerCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateItemQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
};

export function ensureCartHydrated(cart: Cart) {
  if (!useCartStore.getState().hydrated) {
    useCartStore.getState().initFromServerCart(cart);
  }
}

export const useCartStore = create<CartStore>((set, get) => {
  const bump = (delta: number) => {
    inFlight += delta;
    set({ isPending: inFlight > 0 });
  };

  return {
    cart: { items: [] },
    isPending: false,
    cartSheetOpen: false,
    hydrated: false,

    setCartSheetOpen: (open) => set({ cartSheetOpen: open }),

    initFromServerCart: (cart) => {
      if (get().hydrated) return;
      set({ cart: normalizeCart(cart), hydrated: true });
    },

    addItem: (item) => {
      const max = item.available_stock ?? 0;
      if (max <= 0) return;

      const normalized = normalizeCartItem(item);
      if (!normalized) return;

      set((s) => ({ cart: optimisticAdd(s.cart, normalized) }));
      bump(1);
      addToCartAction(normalized)
        .then((cart) => set({ cart: normalizeCart(cart) }))
        .catch(() => {})
        .finally(() => bump(-1));
    },

    removeItem: (id) => {
      set((s) => ({
        cart: { items: s.cart.items.filter((i) => i.id !== id) },
      }));
      bump(1);
      removeFromCartAction(id)
        .then((cart) => set({ cart: normalizeCart(cart) }))
        .catch(() => {})
        .finally(() => bump(-1));
    },

    updateItemQuantity: (id, qty) => {
      set((s) => {
        const item = s.cart.items.find((i) => i.id === id);
        if (!item) return s;
        const max = getCartItemMaxQty(item);
        const clamped =
          Number.isFinite(max) && max > 0
            ? clampQtyToAvailableStock(qty, max)
            : qty > 0
              ? qty
              : 0;
        return {
          cart: {
            items: s.cart.items
              .map((i) => (i.id === id ? { ...i, qty: clamped } : i))
              .filter((i) => i.qty > 0),
          },
        };
      });

      const existing = qtySyncRef.get(id);
      const nextVersion = (existing?.version ?? 0) + 1;
      if (existing?.timer) clearTimeout(existing.timer);

      const timer = setTimeout(() => {
        bump(1);
        updateQuantityAction(id, qty)
          .then((serverCart) => {
            const current = qtySyncRef.get(id);
            if (current?.version === nextVersion) {
              set({ cart: normalizeCart(serverCart) });
            }
          })
          .catch(() => {})
          .finally(() => bump(-1));
      }, 200);

      qtySyncRef.set(id, { timer, version: nextVersion });
    },

    clearCart: () => {
      set({ cart: { items: [] } });
      bump(1);
      clearCartAction()
        .then((cart) => set({ cart }))
        .catch(() => {})
        .finally(() => bump(-1));
    },
  };
});
