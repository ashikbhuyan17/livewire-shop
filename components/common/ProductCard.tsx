'use client';

import Image from 'next/image';
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import CompareButton from '@/components/product/CompareButton';
import Link from 'next/link';
import UpdateCart from '@/components/product/UpdateCart';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import { getProductVariants } from '@/lib/product-utils';
import { getVariantAvailableStock, isInStock } from '@/lib/stock-utils';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);
  const variants = getProductVariants(product);
  const variant = variants[0];
  const availableStock = getVariantAvailableStock(variant);
  const inStock = isInStock(availableStock);
  const lineInCart = cart.items.find((item) => item.id === product?.id);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const colorId = product?.productcolors?.[0]?.id ?? 0;
    if (!variant?.id || !product?.id || !inStock) return;
    const priceNum = Number(variant.sale_price ?? variant.regular_price ?? 0);
    addItem({
      id: product.id,
      name: product.name ?? '',
      qty: 1,
      image: product.thumbnail_img ?? '',
      product_color_id: colorId,
      product_variant_id: Number(variant.id),
      price: priceNum,
      available_stock: availableStock,
    });
  };
  return (
    <Card className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 max-w-[18rem]">
      <div className="relative">
        {/* Discount Badge */}
        {product?.discount && (
          <div className="absolute top-0 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-b text-xs font-bold z-10 shadow-sm">
            <div className="leading-none">
              {CURRENCY_SYMBOL}
              {formatAmount(product?.discount ?? 0)}
            </div>
            <div className="leading-none text-[9px] mt-0.5">OFF</div>
          </div>
        )}

        <div className="absolute right-2 top-2 z-10">
          <CompareButton
            productId={Number(product?.id)}
            variant="icon"
          />
        </div>

        {/* Product Image */}
        <Link prefetch={false} href={`/product/${product?.slug}`}>
          <div className="aspect-square bg-muted/30 flex items-center justify-center p-3 md:p-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.thumbnail_img}`}
              alt={product?.name}
              width={1200}
              height={1200}
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
      </div>
      <div className="p-2 md:p-3">
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
          {product?.deliveryTime}
        </p>
        <Link
          prefetch={false}
          href={`/product/${product?.slug}`}
          className="mb-2 block min-w-0"
        >
          <h3 className="truncate text-xs font-medium text-card-foreground sm:text-sm">
            {product?.name}
          </h3>
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 mb-2 md:mb-3">
          {variant?.sale_price ? (
            <>
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(variant.regular_price ?? 0)}
              </span>
              <span className="text-base font-bold text-primary">
                <span className="font-extrabold text-sm">
                  {CURRENCY_SYMBOL}
                </span>
                {formatAmount(variant.sale_price ?? 0)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                Per Piece
              </span>
            </>
          ) : (
            <>
              <span className="text-base sm:text-lg font-bold text-primary">
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(variant?.regular_price ?? 0)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                Per Piece
              </span>
            </>
          )}
        </div>
        {lineInCart ? (
          <UpdateCart cart={lineInCart} variant="card" />
        ) : (
          <Button
            type="button"
            className={cn(
              'w-full h-9 sm:h-10 rounded-full text-xs sm:text-sm font-semibold gap-1.5 border-0 shadow-sm text-white',
              inStock
                ? 'bg-primary transition-colors duration-200 ease-in-out hover:bg-[#267322]'
                : 'cursor-not-allowed bg-primary/50 text-primary-foreground/90 hover:bg-primary/50 disabled:opacity-100',
            )}
            onClick={handleAddToBag}
            disabled={!inStock}
          >
            <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {inStock ? 'Add to Bag' : 'Out of Stock'}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;
