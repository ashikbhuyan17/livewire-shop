'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GitCompareArrows,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UpdateCart from '@/components/product/UpdateCart';
import { removeFromCompare } from '@/lib/compare';
import {
  isCompareApiSuccess,
  MAX_COMPARE_PRODUCTS,
  type CompareProductRow,
} from '@/lib/compare-utils';
import { CURRENCY_SYMBOL } from '@/lib/currency';
import { formatBDT } from '@/lib/order-utils';
import { useCartStore } from '@/stores/cart-store';
import { useCompareStore } from '@/stores/compare-store';
import { cn } from '@/lib/utils';

type Props = {
  initialItems: CompareProductRow[];
};

type CompareRowDef = {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (item: CompareProductRow) => any;
  highlight?: boolean;
};

function CompareProductColumn({
  item,
  isRemoving,
  onRemove,
}: {
  item: CompareProductRow;
  isRemoving: boolean;
  onRemove: (item: CompareProductRow) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);
  const lineInCart = cart.items.find((c) => c.id === item.productId);

  const handleAddToBag = () => {
    if (!item.productVariantId || !item.productId || !item.inStock) return;
    addItem({
      id: item.productId,
      name: item.name,
      qty: 1,
      image: item.thumbnailImg,
      product_color_id: item.productColorId,
      product_variant_id: item.productVariantId,
      price: item.price,
      available_stock: item.availableStock,
    });
    toast.success('Added to bag');
  };

  const savings =
    item.originalPrice != null ? item.originalPrice - item.price : 0;

  return (
    <div className="flex min-w-[200px] max-w-[240px] flex-col rounded-xl border border-border/80 bg-white shadow-sm sm:min-w-[220px]">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted/30">
        <Link href={`/product/${item.slug}`} className="block h-full w-full">
          <Image
            src={item.imageUrl || '/product_image.webp'}
            alt={item.name}
            fill
            sizes="240px"
            className="object-contain p-4"
          />
        </Link>
        <button
          type="button"
          onClick={() => onRemove(item)}
          disabled={isRemoving}
          className="absolute right-2 top-2 rounded-full bg-white/95 p-2 shadow-md transition hover:bg-white disabled:opacity-60"
          aria-label={`Remove ${item.name} from compare`}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
          ) : (
            <Trash2 className="h-4 w-4 text-destructive" />
          )}
        </button>
        {!item.inStock && (
          <div className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-center text-xs font-semibold text-white">
            Out of stock
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/product/${item.slug}`} className="block min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground hover:text-primary">
            {item.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            <span className="text-sm font-extrabold">{CURRENCY_SYMBOL}</span>
            {formatBDT(item.price)}
          </span>
          {item.originalPrice != null && (
            <span className="text-sm text-muted-foreground line-through">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatBDT(item.originalPrice)}
            </span>
          )}
          {savings > 0 && (
            <Badge variant="secondary" className="w-fit text-xs">
              Save {CURRENCY_SYMBOL}
              {formatBDT(savings)}
            </Badge>
          )}
        </div>

        <div className="mt-auto space-y-2">
          {lineInCart ? (
            <UpdateCart cart={lineInCart} variant="card" />
          ) : (
            <Button
              type="button"
              className={cn(
                'h-10 w-full gap-1.5 rounded-full text-sm font-semibold',
                item.inStock
                  ? 'bg-primary hover:bg-[#267322]'
                  : 'cursor-not-allowed bg-primary/50',
              )}
              onClick={handleAddToBag}
              disabled={!item.inStock}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {item.inStock ? 'Add to bag' : 'Out of stock'}
            </Button>
          )}
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/product/${item.slug}`}>
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              View details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CompareTable({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const removeProduct = useCompareStore((s) => s.removeProduct);

  const handleRemove = async (item: CompareProductRow) => {
    setRemovingId(item.compareId);
    try {
      const res = await removeFromCompare(item.productId);
      if (isCompareApiSuccess(res?.status) || res.ok) {
        setItems((prev) =>
          prev.filter((row) => row.compareId !== item.compareId),
        );
        removeProduct(item.productId);
        toast.success('Removed from compare');
        router.refresh();
      } else {
        toast.error(
          typeof res?.message === 'string'
            ? res.message
            : 'Failed to remove from compare',
        );
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setRemovingId(null);
    }
  };

  const rows: CompareRowDef[] = useMemo(
    () => [
      {
        id: 'variant',
        label: 'Variant',
        render: (item) => (
          <span className="text-sm text-foreground">{item.variantName}</span>
        ),
      },
      {
        id: 'price',
        label: 'Price',
        highlight: true,
        render: (item) => (
          <span className="text-sm font-semibold text-primary">
            <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
            {formatBDT(item.price)}
          </span>
        ),
      },
      {
        id: 'was',
        label: 'Was',
        render: (item) =>
          item.originalPrice != null ? (
            <span className="text-sm text-muted-foreground line-through">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatBDT(item.originalPrice)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        id: 'stock',
        label: 'Availability',
        render: (item) =>
          item.inStock ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" />
              In stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive">
              <X className="h-4 w-4" />
              Out of stock
            </span>
          ),
      },
    ],
    [],
  );

  const lowestPrice = useMemo(
    () => Math.min(...items.map((i) => i.price)),
    [items],
  );

  const slotsLeft = MAX_COMPARE_PRODUCTS - items.length;

  return (
    <div className="space-y-6">
      {/* Desktop comparison matrix */}
      <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="sticky left-0 z-10 w-40 min-w-[10rem] bg-muted/30 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <GitCompareArrows className="h-4 w-4 text-primary" />
                    Attribute
                  </span>
                </th>
                {items.map((item) => (
                  <th
                    key={item.compareId}
                    className="min-w-[200px] px-4 py-4 align-top"
                  >
                    <CompareProductColumn
                      item={item}
                      isRemoving={removingId === item.compareId}
                      onRemove={handleRemove}
                    />
                  </th>
                ))}
                {slotsLeft > 0 &&
                  Array.from({ length: slotsLeft }).map((_, i) => (
                    <th
                      key={`slot-${i}`}
                      className="min-w-[180px] px-4 py-8 align-middle"
                    >
                      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 px-4 text-center">
                        <GitCompareArrows className="mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          Add a product to compare
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-2"
                          asChild
                        >
                          <Link href="/">Shop now</Link>
                        </Button>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b last:border-0',
                    idx % 2 === 0 ? 'bg-white' : 'bg-muted/10',
                    row.highlight && 'bg-primary/5',
                  )}
                >
                  <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm font-medium text-foreground">
                    {row.label}
                  </td>
                  {items.map((item) => (
                    <td
                      key={`${row.id}-${item.compareId}`}
                      className="px-4 py-3"
                    >
                      {row.id === 'price' && item.price === lowestPrice ? (
                        <div className="space-y-1">
                          <Badge className="bg-primary text-xs">
                            Best price
                          </Badge>
                          <div>{row.render(item)}</div>
                        </div>
                      ) : (
                        row.render(item)
                      )}
                    </td>
                  ))}
                  {slotsLeft > 0 &&
                    Array.from({ length: slotsLeft }).map((_, i) => (
                      <td key={`empty-${row.id}-${i}`} className="px-4 py-3">
                        <span className="text-muted-foreground">—</span>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: horizontal product strip + attribute cards */}
      <div className="space-y-4 lg:hidden">
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
          {items.map((item) => (
            <div key={item.compareId} className="snap-center shrink-0">
              <CompareProductColumn
                item={item}
                isRemoving={removingId === item.compareId}
                onRemove={handleRemove}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {row.label}
              </h3>
              <div className="grid gap-3">
                {items.map((item) => (
                  <div
                    key={`${row.id}-m-${item.compareId}`}
                    className="flex items-center justify-between gap-3 border-b border-dashed pb-3 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <div className="shrink-0">{row.render(item)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-secondary/20 px-4 py-3 text-sm">
        <p className="text-muted-foreground">
          {items.length < MAX_COMPARE_PRODUCTS
            ? `You can add ${slotsLeft} more product${slotsLeft === 1 ? '' : 's'} to compare.`
            : 'Compare list is full. Remove an item to add another.'}
        </p>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
