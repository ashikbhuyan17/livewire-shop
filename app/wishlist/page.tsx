/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from '@/lib/fetcher';
import { mapWishlistItemToCard } from '@/lib/wishlist-utils';
import WishlistInfoBar from '@/components/wishlist/WishlistInfoBar';
import WishlistEmptyState from '@/components/wishlist/WishlistEmptyState';
import WishlistProductCard from '@/components/wishlist/WishlistProductCard';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const wishlist: any = await fetcher(
    '/wishlist',
    { cache: 'no-store' },
    false,
  );
  const items = Array.isArray(wishlist?.data) ? wishlist.data : [];
  const hasItems = items.length > 0;

  return (
    <main className="min-h-screen max-md:pb-24">
      <div className="mx-auto w-full max-w-[95rem] space-y-5 px-4 py-4">
        <WishlistInfoBar />

        {!hasItems ? (
          <WishlistEmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item: any, index: number) => {
              const card = mapWishlistItemToCard(item);
              return (
                <WishlistProductCard
                  key={card.id || index}
                  id={card.id}
                  productId={card.productId}
                  slug={card.slug}
                  image={card.image}
                  title={card.title}
                  newPrice={card.newPrice}
                  oldPrice={card.oldPrice}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
