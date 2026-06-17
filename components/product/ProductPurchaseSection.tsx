'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductImage } from '@/components/product/ProductImage';
import UpdateCart from '@/components/product/UpdateCart';
import {
  getProductColors,
  getVariantPricing,
  getVariantsForColor,
  isPreOrderProduct,
  parseColorGalleryImages,
  type ProductColorShape,
  type ProductVariantShape,
} from '@/lib/product-utils';
import { getVariantAvailableStock, isInStock } from '@/lib/stock-utils';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';

function pickDefaultVariant(
  variants: ProductVariantShape[],
): ProductVariantShape | null {
  if (!variants.length) return null;
  const inStock = variants.find((variant) =>
    isInStock(getVariantAvailableStock(variant)),
  );
  return inStock ?? variants[0];
}

function pickDefaultColor(colors: ProductColorShape[]): ProductColorShape | null {
  if (!colors.length) return null;

  for (const color of colors) {
    const variants = getVariantsForColor(color);
    if (variants.some((variant) => isInStock(getVariantAvailableStock(variant)))) {
      return color;
    }
  }

  return colors[0];
}

type Props = {
  productId: number;
  productName: string;
  productSku?: string;
  thumbnailImg?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productData: any;
};

export default function ProductPurchaseSection({
  productId,
  productName,
  productSku,
  thumbnailImg,
  productData,
}: Props) {
  const colors = useMemo(
    () => getProductColors(productData),
    [productData],
  );

  const [selectedColor, setSelectedColor] = useState<ProductColorShape | null>(
    () => pickDefaultColor(colors),
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantShape | null>(
    () => pickDefaultVariant(getVariantsForColor(pickDefaultColor(colors))),
  );
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const variants = useMemo(
    () => getVariantsForColor(selectedColor),
    [selectedColor],
  );

  const galleryImages = useMemo(
    () => parseColorGalleryImages(selectedColor, thumbnailImg),
    [selectedColor, thumbnailImg],
  );

  const displayImage = activeImage ?? galleryImages[0] ?? thumbnailImg ?? '';
  const pricing = getVariantPricing(selectedVariant);
  const availableStock = getVariantAvailableStock(selectedVariant);
  const variantInStock = isInStock(availableStock);

  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);

  const imgBase = process.env.NEXT_PUBLIC_IMG_URL ?? '';
  const isPreOrder = isPreOrderProduct(productData);

  const handleColorChange = (color: ProductColorShape) => {
    setSelectedColor(color);
    const nextVariants = getVariantsForColor(color);
    const nextVariant = pickDefaultVariant(nextVariants);
    setSelectedVariant(nextVariant);
    const images = parseColorGalleryImages(color, thumbnailImg);
    setActiveImage(images[0] ?? null);
  };

  const handleVariantChange = (variant: ProductVariantShape) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!variantInStock || !selectedVariant?.id || !selectedColor?.id) return;

    addItem({
      id: productId,
      name: productName,
      qty: 1,
      image: displayImage || thumbnailImg || '',
      product_color_id: Number(selectedColor.id),
      product_variant_id: Number(selectedVariant.id),
      price: pricing.effective,
      available_stock: availableStock,
    });
  };

  const cartLine = cart.items.find(
    (item) =>
      item.id === productId &&
      Number(item.product_variant_id) === Number(selectedVariant?.id) &&
      Number(item.product_color_id) === Number(selectedColor?.id),
  );

  return (
    <>
      <div className="lg:col-span-5">
        <Card className="overflow-hidden rounded-lg border bg-white p-0">
          {displayImage ? (
            <ProductImage src={`${imgBase}/${displayImage}`} />
          ) : (
            <div className="aspect-square bg-muted" />
          )}
        </Card>

        {galleryImages.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-auto">
            {galleryImages.map((path) => {
              const isActive = path === displayImage;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => setActiveImage(path)}
                  className={cn(
                    'shrink-0 rounded-md border bg-white p-1 transition',
                    isActive
                      ? 'border-headerBg ring-2 ring-headerBg/30'
                      : 'hover:bg-muted/40',
                  )}
                >
                  <Image
                    src={`${imgBase}/${path}`}
                    alt=""
                    width={120}
                    height={120}
                    className="h-16 w-16 rounded object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="lg:col-span-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight lg:text-xl">
                {productName}
              </h1>
              {isPreOrder ? (
                <Badge className="rounded-full border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900 hover:bg-amber-100">
                  Pre Order
                </Badge>
              ) : null}
            </div>
            {productSku ? (
              <p className="text-sm text-muted-foreground">
                SKU:{' '}
                <span className="font-medium text-foreground">{productSku}</span>
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-end gap-2">
              <div className="text-xl font-bold text-red-600">
                <span className="text-lg font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(pricing.effective)}
              </div>
              {pricing.hasDeal ? (
                <div className="pb-0.5 text-sm font-medium text-muted-foreground line-through">
                  <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                  {formatAmount(pricing.regular)}
                </div>
              ) : null}
              <p className="pb-0.5 text-xs font-semibold text-gray-500">
                Per piece
              </p>
            </div>
          </div>

          {colors.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected = Number(color.id) === Number(selectedColor?.id);
                  return (
                    <Button
                      key={String(color.id)}
                      type="button"
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      className="h-9 rounded-full px-4 text-sm font-semibold"
                      onClick={() => handleColorChange(color)}
                    >
                      {color.color_name || `Color ${color.id}`}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {variants.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Variant</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const isSelected =
                    Number(variant.id) === Number(selectedVariant?.id);
                  const stock = getVariantAvailableStock(variant);
                  const inStock = isInStock(stock);
                  const variantPricing = getVariantPricing(variant);

                  return (
                    <Button
                      key={String(variant.id)}
                      type="button"
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      disabled={!inStock}
                      className={cn(
                        'h-9 min-w-[3.25rem] rounded-full px-4 text-sm font-semibold whitespace-nowrap',
                        !inStock && 'opacity-50',
                      )}
                      onClick={() => handleVariantChange(variant)}
                    >
                      <span className="max-w-[7.5rem] truncate">
                        {variant.variant_name}
                      </span>
                      <span className="ml-1 text-[11px] opacity-80">
                        ({CURRENCY_SYMBOL}
                        {formatAmount(variantPricing.effective)})
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {cartLine ? (
            <div className="my-2">
              <UpdateCart cart={cartLine} />
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={!variantInStock || !selectedVariant}
              className={cn(
                'my-2 w-full border-0 font-semibold text-white shadow-sm sm:w-auto',
                variantInStock
                  ? 'bg-primary transition-colors duration-200 ease-in-out hover:bg-[#267322]'
                  : 'cursor-not-allowed bg-primary/50 text-primary-foreground/90 hover:bg-primary/50 disabled:opacity-100',
              )}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {variantInStock ? 'Add to Bag' : 'Out of Stock'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
