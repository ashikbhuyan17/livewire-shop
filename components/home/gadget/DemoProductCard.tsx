import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type DemoProduct,
  discountPercent,
  formatBDTNumber,
} from '@/lib/home-demo-data';
import { cn } from '@/lib/utils';

type DemoProductCardProps = {
  product: DemoProduct;
  variant?: 'default' | 'compact';
};

function ProductPrice({
  price,
  originalPrice,
  compact,
}: {
  price: number;
  originalPrice: number;
  compact?: boolean;
}) {
  const hasDiscount = originalPrice > price;

  return (
    <div
      className={cn(
        'mt-2 flex min-h-[1.35rem] flex-nowrap items-baseline gap-x-2 gap-y-0 tabular-nums',
        compact ? 'text-sm' : 'text-base',
      )}
    >
      <span className="flex shrink-0 items-baseline gap-1 font-bold leading-none text-primary">
        <span className="font-extrabold">৳</span>
        {formatBDTNumber(price)}
      </span>
      {hasDiscount && (
        <span className="flex min-w-0 shrink items-baseline gap-1 font-bold leading-none text-slate-400 line-through">
          <span className="font-extrabold">৳</span>
          <span className="truncate">{formatBDTNumber(originalPrice)}</span>
        </span>
      )}
    </div>
  );
}

export default function DemoProductCard({
  product,
  variant = 'default',
}: DemoProductCardProps) {
  const discount = discountPercent(product.price, product.originalPrice);
  const inStock = product.inStock !== false;
  const productHref = `/product/${product.slug}`;

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg',
        variant === 'compact' && 'min-w-[10.5rem] sm:min-w-[12rem]',
      )}
    >
      <div className="relative">
        {discount > 0 && (
          <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-primary px-2 py-1 text-[10px] font-bold text-white sm:text-xs">
            {discount}%
          </span>
        )}

        <Link href={productHref} className="block">
          <div className="relative aspect-square bg-gradient-to-b from-slate-50 to-white p-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={productHref}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <ProductPrice
          price={product.price}
          originalPrice={product.originalPrice}
          compact={variant === 'compact'}
        />

        <div className="mt-auto flex gap-2 pt-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 flex-1 rounded-full border-slate-200 text-xs font-semibold hover:border-primary hover:bg-blue-50 hover:text-primary"
          >
            <Link href={productHref}>
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button
            size="sm"
            disabled={!inStock}
            className="h-9 flex-1 rounded-full bg-primary text-xs font-semibold shadow-sm hover:bg-primary/90"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </article>
  );
}
