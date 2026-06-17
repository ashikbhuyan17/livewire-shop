'use client';

import { useMemo, useState } from 'react';
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowUpDown,
  Loader2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UpdateCart from '@/components/product/UpdateCart';
import { removeFromWishlist } from '@/lib/wishlist';
import {
  isWishlistApiSuccess,
  type UserWishlistRow,
} from '@/lib/wishlist-utils';
import { CURRENCY_SYMBOL } from '@/lib/currency';
import { formatBDT } from '@/lib/order-utils';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

type Props = {
  initialItems: UserWishlistRow[];
};

function WishlistItemCard({
  item,
  isRemoving,
  onRemove,
}: {
  item: UserWishlistRow;
  isRemoving: boolean;
  onRemove: (item: UserWishlistRow) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);
  const lineInCart = cart.items.find((c) => c.id === item.productId);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-secondary">
        <Image
          width={1200}
          height={1200}
          src={item.image || '/product_image.webp'}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(item)}
          disabled={isRemoving}
          className="absolute left-3 top-3 rounded-full bg-white/90 p-2 transition-all hover:bg-white disabled:opacity-60"
          aria-label="Remove from wishlist"
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
          ) : (
            <Trash2 className="h-4 w-4 text-destructive" />
          )}
        </button>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        {item.category ? (
          <Badge variant="outline" className="mb-2 w-fit text-xs">
            {item.category}
          </Badge>
        ) : null}
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">
          {item.name}
        </h3>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
            {formatBDT(item.price)}
          </span>
          {item.originalPrice != null && (
            <span className="text-sm text-muted-foreground line-through">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatBDT(item.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto">
          {lineInCart ? (
            <UpdateCart cart={lineInCart} variant="card" />
          ) : (
            <Button
              type="button"
              className={cn(
                'h-9 w-full gap-1.5 rounded-full border-0 text-xs font-semibold text-white shadow-sm sm:h-10 sm:text-sm',
                item.inStock
                  ? 'bg-primary transition-colors duration-200 ease-in-out hover:bg-[#267322]'
                  : 'cursor-not-allowed bg-primary/50 text-primary-foreground/90 hover:bg-primary/50 disabled:opacity-100',
              )}
              onClick={handleAddToBag}
              disabled={!item.inStock}
            >
              <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              {item.inStock ? 'Add to Bag' : 'Out of Stock'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WishlistPage({ initialItems }: Props) {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] =
    useState<UserWishlistRow[]>(initialItems);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const removeProduct = useWishlistStore((s) => s.removeProduct);

  const handleRemoveItem = async (item: UserWishlistRow) => {
    setRemovingId(item.id);
    try {
      const res = await removeFromWishlist(item.productId);
      if (isWishlistApiSuccess(res?.status) || res.ok) {
        setWishlistItems((prev) => prev.filter((row) => row.id !== item.id));
        removeProduct(item.productId);
        toast.success('Removed from wishlist');
        router.refresh();
      } else {
        toast.error(
          typeof res?.message === 'string'
            ? res.message
            : 'Failed to remove from wishlist',
        );
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setRemovingId(null);
    }
  };

  const sortedItems = useMemo(() => {
    const sorted = [...wishlistItems];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [wishlistItems, sortBy]);

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="mt-2 text-muted-foreground">
              Save your favorite items for later
            </p>
          </div>

          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 rounded-full bg-secondary p-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-muted-foreground">
                Start adding items to your wishlist to save them for later
              </p>
              <Link href="/" className="mt-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="mt-2 text-muted-foreground">
              You have{' '}
              <span className="font-semibold text-foreground">
                {wishlistItems.length} items
              </span>{' '}
              in your wishlist
            </p>
          </div>

          <div className="w-full md:w-48">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="bg-card">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedItems.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              isRemoving={removingId === item.id}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">Want to add more items?</p>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
