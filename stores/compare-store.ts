import { create } from 'zustand';
import { MAX_COMPARE_PRODUCTS } from '@/lib/compare-utils';

type CompareStore = {
  count: number;
  productIds: number[];
  hydrated: boolean;
  init: (productIds: number[]) => void;
  addProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  canAdd: () => boolean;
};

export const useCompareStore = create<CompareStore>((set, get) => ({
  count: 0,
  productIds: [],
  hydrated: false,

  init: (productIds) => {
    const ids = [...new Set(productIds)].slice(0, MAX_COMPARE_PRODUCTS);
    set({ productIds: ids, count: ids.length, hydrated: true });
  },

  addProduct: (productId) => {
    const ids = get().productIds;
    if (ids.includes(productId) || ids.length >= MAX_COMPARE_PRODUCTS) return;
    const next = [...ids, productId];
    set({ productIds: next, count: next.length });
  },

  removeProduct: (productId) => {
    const next = get().productIds.filter((id) => id !== productId);
    set({ productIds: next, count: next.length });
  },

  canAdd: () => get().productIds.length < MAX_COMPARE_PRODUCTS,
}));

export function isInCompare(productId: number) {
  return useCompareStore.getState().productIds.includes(productId);
}
