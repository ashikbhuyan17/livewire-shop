import { create } from 'zustand';

type WishlistStore = {
  count: number;
  productIds: number[];
  hydrated: boolean;
  init: (productIds: number[]) => void;
  addProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  count: 0,
  productIds: [],
  hydrated: false,

  init: (productIds) => {
    const ids = [...new Set(productIds)];
    set({ productIds: ids, count: ids.length, hydrated: true });
  },

  addProduct: (productId) => {
    const ids = get().productIds;
    if (ids.includes(productId)) return;
    const next = [...ids, productId];
    set({ productIds: next, count: next.length });
  },

  removeProduct: (productId) => {
    const next = get().productIds.filter((id) => id !== productId);
    set({ productIds: next, count: next.length });
  },
}));

export function isInWishlist(productId: number) {
  return useWishlistStore.getState().productIds.includes(productId);
}
