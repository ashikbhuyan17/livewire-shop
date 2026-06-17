'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { GitCompareArrows, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { addToCompare, removeFromCompare } from '@/lib/compare';
import {
  isCompareApiSuccess,
  MAX_COMPARE_PRODUCTS,
} from '@/lib/compare-utils';
import { useCompareStore } from '@/stores/compare-store';
import { cn } from '@/lib/utils';

type Props = {
  productId: number;
  className?: string;
  variant?: 'default' | 'icon';
};

export default function CompareButton({
  productId,
  className,
  variant = 'default',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const hydrated = useCompareStore((s) => s.hydrated);
  const inCompare = useCompareStore((s) => s.productIds.includes(productId));
  const addProduct = useCompareStore((s) => s.addProduct);
  const removeProduct = useCompareStore((s) => s.removeProduct);
  const canAdd = useCompareStore((s) => s.canAdd);
  const count = useCompareStore((s) => s.count);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId || loading) return;

    setLoading(true);
    try {
      const profile: { data?: { id?: number } } = await fetcher('/user-profile');
      if (!profile?.data?.id) {
        const redirect = encodeURIComponent(pathname || '/product');
        router.push(`/signin?redirect=${redirect}`);
        return;
      }

      if (inCompare) {
        const res = await removeFromCompare(productId);
        if (isCompareApiSuccess(res?.status) || res?.ok) {
          removeProduct(productId);
          toast.success('Removed from compare');
          router.refresh();
        } else {
          toast.error(
            typeof res?.message === 'string'
              ? res.message
              : 'Failed to remove from compare',
          );
        }
      } else {
        if (!canAdd()) {
          toast.error(
            `You can compare up to ${MAX_COMPARE_PRODUCTS} products. Remove one to add another.`,
          );
          return;
        }
        const res = await addToCompare(productId);
        if (isCompareApiSuccess(res?.status) || res?.ok) {
          addProduct(productId);
          toast.success('Added to compare', {
            action: {
              label: 'View',
              onClick: () => router.push('/compare'),
            },
          });
          router.refresh();
        } else {
          toast.error(
            typeof res?.message === 'string'
              ? res.message
              : 'Failed to add to compare',
          );
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        type="button"
        variant="secondary"
        size="icon"
        disabled={loading || !hydrated}
        onClick={handleClick}
        title={
          inCompare
            ? 'Remove from compare'
            : count >= MAX_COMPARE_PRODUCTS
              ? `Compare list full (${MAX_COMPARE_PRODUCTS})`
              : 'Add to compare'
        }
        aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
        className={cn(
          'h-8 w-8 rounded-full shadow-sm',
          inCompare && 'bg-primary text-primary-foreground hover:bg-primary/90',
          className,
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GitCompareArrows className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading || !hydrated}
      onClick={handleClick}
      className={
        className ??
        'flex-1 border-border/70 hover:bg-secondary/10'
      }
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
      ) : (
        <GitCompareArrows
          className={cn(
            'mr-2 h-4 w-4 text-primary',
            inCompare && 'text-primary',
          )}
        />
      )}
      {inCompare ? 'In Compare' : 'Compare'}
    </Button>
  );
}
