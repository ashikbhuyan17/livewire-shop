import WishlistPage from '@/components/user/wishlist/WishlistPage';
import { fetchWishlist } from '@/lib/wishlist';
import {
  mapWishlistItemToUserRow,
  type UserWishlistRow,
} from '@/lib/wishlist-utils';
import type { Metadata } from 'next';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Wishlist',
  description: 'Your saved grocery products at BestFood City.',
  pathname: '/user/wishlist',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function UserWishlistPage() {
  const wishlist = await fetchWishlist();
  const items: UserWishlistRow[] = Array.isArray(wishlist?.data)
    ? wishlist.data.map((row) =>
        mapWishlistItemToUserRow(row as Record<string, unknown>),
      )
    : [];

  return <WishlistPage initialItems={items} />;
}
