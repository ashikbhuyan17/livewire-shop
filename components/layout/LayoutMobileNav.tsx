import MobileBottomNav from '@/components/common/MobileBottomNav';
import buildCategoryMenu from '@/fetch/buildCategoryMenu';
import { getLayoutSessionUser } from '@/lib/auth-session';

export async function LayoutMobileNav() {
  const [categories, user] = await Promise.all([
    buildCategoryMenu(),
    getLayoutSessionUser(),
  ]);

  return <MobileBottomNav categories={categories} user={user} />;
}
