import CartHydrator from '@/components/common/CartHydrator';
import CartSidebar from '@/components/common/CartSidebar';
import Header from '@/components/common/Header';
import WishlistStoreInit from '@/components/common/WishlistStoreInit';
import CompareStoreInit from '@/components/common/CompareStoreInit';
import buildCategoryMenu, {
  fetchHeaderCategories,
} from '@/fetch/buildCategoryMenu';
import { getLayoutSessionUser } from '@/lib/auth-session';
import { getCompareSummary } from '@/lib/compare';
import { getWishlistSummary } from '@/lib/wishlist';
import { getCart } from '@/lib/cart';

export async function LayoutHeader() {
  const [categories, headerCategories, user, initialCart] = await Promise.all([
    buildCategoryMenu(),
    fetchHeaderCategories(),
    getLayoutSessionUser(),
    getCart(),
  ]);

  const [wishlistSummary, compareSummary] = user
    ? await Promise.all([getWishlistSummary(), getCompareSummary()])
    : [
        { count: 0, productIds: [] as number[] },
        { count: 0, productIds: [] as number[] },
      ];

  return (
    <>
      <CartHydrator cart={initialCart} />
      <WishlistStoreInit productIds={wishlistSummary.productIds} />
      <CompareStoreInit productIds={compareSummary.productIds} />
      <Header
        categories={categories}
        headerCategories={headerCategories}
        user={user}
      />
      <CartSidebar initialCart={initialCart} />
    </>
  );
}
