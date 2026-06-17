import {
  Bell,
  GitCompareArrows,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  Package,
  RotateCcw,
  Share2,
  Star,
  User,
  type LucideIcon,
} from 'lucide-react';

export type UserNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
  /** Additional routes that should highlight this item (e.g. ticket chat pages). */
  activePrefixes?: string[];
};

export type UserNavSection = {
  id: string;
  title: string;
  items: UserNavItem[];
};

export const USER_NAV_SECTIONS: UserNavSection[] = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/user',
        icon: LayoutDashboard,
        exact: true,
      },
      {
        id: 'account',
        label: 'Account',
        href: '/user/account',
        icon: User,
        exact: true,
      },
      {
        id: 'orders',
        label: 'My Orders',
        href: '/user/orders',
        icon: Package,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/user/notification',
        icon: Bell,
      },
      {
        id: 'tickets',
        label: 'Support Tickets',
        href: '/user/ticket-list',
        icon: LifeBuoy,
        activePrefixes: ['/user/support'],
      },
      {
        id: 'wishlist',
        label: 'Wishlist',
        href: '/user/wishlist',
        icon: Heart,
      },
      {
        id: 'compare',
        label: 'Compare',
        href: '/compare',
        icon: GitCompareArrows,
      },
      {
        id: 'reviews',
        label: 'My Reviews',
        href: '/user/reviews',
        icon: Star,
      },
      {
        id: 'returns',
        label: 'Returns & Cancellations',
        href: '/user/returns-cancellations',
        icon: RotateCcw,
      },
    ],
  },
];

const PARTNER_NAV_SECTION: UserNavSection = {
  id: 'partner',
  title: 'Refer & Earn',
  items: [
    {
      id: 'partner-hub',
      label: 'Refer & Earn',
      href: '/user/partner',
      icon: Share2,
      activePrefixes: ['/user/partner'],
    },
  ],
};

export function getUserNavSections(isPartner = false): UserNavSection[] {
  if (!isPartner) return USER_NAV_SECTIONS;
  return [USER_NAV_SECTIONS[0], PARTNER_NAV_SECTION];
}

export function isNavItemActive(
  item: Pick<UserNavItem, 'href' | 'exact' | 'activePrefixes'>,
  pathname: string | null | undefined,
): boolean {
  if (!pathname) return false;
  const path = pathname.replace(/\/+$/, '') || '/';
  const href = item.href.replace(/\/+$/, '') || '/';

  if (item.activePrefixes?.some((prefix) => {
    const p = prefix.replace(/\/+$/, '') || '/';
    return path === p || path.startsWith(`${p}/`);
  })) {
    return true;
  }

  if (item.exact) return path === href;
  return path === href || path.startsWith(`${href}/`);
}
