'use client';

import { useLayoutEffect, useRef } from 'react';
import { useCompareStore } from '@/stores/compare-store';

export default function CompareStoreInit({
  productIds,
}: {
  productIds: number[];
}) {
  const didInit = useRef(false);

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    useCompareStore.getState().init(productIds);
  }, [productIds]);

  return null;
}
