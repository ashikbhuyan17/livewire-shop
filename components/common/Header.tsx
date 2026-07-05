'use client';

import { useEffect, useState, type ComponentType } from 'react';
import {
  User,
  Menu,
  X,
  LogOut,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  PackageCheck,
  Gift,
  ShoppingCart,
  Sparkles,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CategoryMegaMenu from './CategoryMegaMenu';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import { DialogTrigger } from '../ui/dialog';
import { clearAuth } from '@/action/token';
import type { UserCookie } from '@/action/token';
import BrandLogoLink from './BrandLogoLink';
import HeaderProductSearch from '@/components/search/HeaderProductSearch';
import type {
  CategoryMenuItem,
  HeaderCategoryItem,
} from '@/fetch/buildCategoryMenu';
import { useCartStore } from '@/stores/cart-store';
import { useCategoryDrawerStore } from '@/stores/category-drawer-store';
import { cn } from '@/lib/utils';

const TOP_LINKS = [
  { label: 'Order Tracking', href: '/order-tracking', icon: PackageCheck },
  { label: 'Blogs', href: '/blogs', icon: FileText },
  { label: 'EMI Policy', href: '/pages/emi-policy', icon: CreditCard },
  { label: 'Store Location', href: '/our-outlets', icon: MapPin },
] as const;

function resolveCategoryImage(icon?: string): string {
  const rel = (icon || '').trim().replace(/^\/+/, '');
  if (!rel) return '';
  if (rel.startsWith('http://') || rel.startsWith('https://')) return rel;
  const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
  return base ? `${base}/${rel}` : `/${rel}`;
}

function UserProfilePill({
  user,
  onLogout,
}: {
  user: UserCookie;
  onLogout?: () => void;
}) {
  const router = useRouter();
  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();

  const handleLogout = async () => {
    await clearAuth();
    onLogout?.();
    router.replace('/signin');
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        prefetch
        href="/user/account"
        className="flex items-center gap-1.5 rounded-md border border-secondary/80 bg-secondary/15 px-2 py-1 text-white transition hover:bg-secondary/25"
        aria-label="My account"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-primary">
          {user.profile_image ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${user.profile_image}`}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <span className="hidden max-w-[6rem] truncate text-xs font-semibold xl:inline">
          {user.name?.split(' ')[0] ?? 'Account'}
        </span>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-white/80 hover:bg-white/10 hover:text-white"
        onClick={handleLogout}
        title="Log out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function ActionPill({
  href,
  onClick,
  icon: Icon,
  label,
  badge,
  className,
}: {
  href?: string;
  onClick?: () => void;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  className?: string;
}) {
  const inner = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="hidden whitespace-nowrap text-[11px] font-bold uppercase leading-none tracking-wide lg:inline">
        {label}
      </span>
      {badge != null && badge > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-slate-900">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </>
  );

  const pillClass = cn(
    'relative inline-flex h-9 shrink-0 flex-nowrap items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-secondary/70 bg-primary px-2.5 text-white transition hover:border-secondary hover:bg-primary/90 sm:h-10 sm:px-3',
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={pillClass}
        aria-label={label}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link prefetch href={href ?? '#'} className={pillClass} aria-label={label}>
      {inner}
    </Link>
  );
}

export default function Header({
  categories,
  headerCategories,
  user,
}: {
  categories: CategoryMenuItem[];
  headerCategories: HeaderCategoryItem[];
  user: UserCookie | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserCookie | null>(user);
  const cart = useCartStore((s) => s.cart);
  const cartCount = cart.items.length;
  const categoryDrawerOpen = useCategoryDrawerStore((s) => s.open);
  const setCategoryDrawerOpen = useCategoryDrawerStore((s) => s.setOpen);
  const toggleCategoryDrawer = useCategoryDrawerStore((s) => s.toggle);

  const isCategoryPanelOpen = categoryMenuOpen || categoryDrawerOpen;

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const displayUser = currentUser ?? user;
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryMenuOpen(false);
    setCategoryDrawerOpen(false);
  }, [pathname, setCategoryDrawerOpen]);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 shadow-md">
      {/* Top utility bar — desktop only */}
      <div className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex h-9 max-w-[95rem] items-center justify-between px-4 text-xs text-slate-600 lg:px-6">
          <Link
            href="tel:09638001122"
            className="inline-flex items-center gap-1.5 font-semibold text-primary transition hover:text-primary/80"
          >
            <Phone className="h-3.5 w-3.5" />
            09638001122
          </Link>
          <nav
            className="flex items-center gap-4 lg:gap-5"
            aria-label="Quick links"
          >
            {TOP_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1 font-medium uppercase tracking-wide transition hover:text-primary"
              >
                <Icon className="h-3 w-3 opacity-70" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-primary text-white">
        <div className="mx-auto w-full max-w-[95rem] px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6">
          {/* Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <BrandLogoLink logoSrc="/livewire.png" className="shrink-0" />

            <div className="min-w-0 flex-1">
              <HeaderProductSearch />
            </div>

            <ActionPill
              href="/cart"
              icon={ShoppingCart}
              label="Cart"
              badge={cartCount}
            />
          </div>

          {/* Desktop: logo left · search center · actions right */}
          <div className="hidden items-center gap-4 lg:grid lg:grid-cols-[auto_1fr_auto]">
            <BrandLogoLink logoSrc="/livewire.png" className="shrink-0" />

            <div className="flex min-w-0 justify-center px-2 xl:px-4">
              <div className="w-full max-w-xl">
                <HeaderProductSearch />
              </div>
            </div>

            <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2">
              <ActionPill href="/offer/flash-sale" icon={Gift} label="Offer" />
              <ActionPill href="/pre-order" icon={Package} label="Pre Order" />
              <ActionPill
                href="/cart"
                icon={ShoppingCart}
                label="Cart"
                badge={cartCount}
              />
              {displayUser ? (
                <UserProfilePill
                  user={displayUser}
                  onLogout={() => setCurrentUser(null)}
                />
              ) : (
                <LoginModal onLoginSuccess={setCurrentUser}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 shrink-0 flex-nowrap items-center gap-1.5 whitespace-nowrap rounded-lg border border-secondary/70 bg-primary px-3 text-white transition hover:border-secondary hover:bg-primary/90"
                    >
                      <User className="h-4 w-4 shrink-0" strokeWidth={2} />
                      <span className="text-[11px] font-bold uppercase leading-none tracking-wide">
                        Login
                      </span>
                    </button>
                  </DialogTrigger>
                </LoginModal>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category navigation — desktop only; mobile uses bottom nav */}
      <div className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex h-11 max-w-[95rem] items-center gap-2 px-3 sm:h-12 sm:px-4 lg:px-6">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'size-9 shrink-0 rounded-md border-slate-300 bg-white text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary',
              isCategoryPanelOpen && 'border-primary bg-primary/5 text-primary',
            )}
            onClick={() => {
              const isDesktop = window.matchMedia(
                '(min-width: 1024px)',
              ).matches;
              if (isDesktop) {
                setCategoryMenuOpen((open) => !open);
                setCategoryDrawerOpen(false);
              } else {
                toggleCategoryDrawer();
                setCategoryMenuOpen(false);
              }
              setMobileMenuOpen(false);
            }}
            aria-label="Browse categories"
            aria-expanded={isCategoryPanelOpen}
          >
            {isCategoryPanelOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>

          <nav
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]"
            aria-label="Product categories"
          >
            {headerCategories.map((cat) => {
              const imageSrc = resolveCategoryImage(cat.icon);
              return (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  className="group flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1 transition hover:bg-primary/5 sm:flex-row sm:gap-2 sm:px-3"
                >
                  {imageSrc ? (
                    <div className="relative h-7 w-7 overflow-hidden rounded-md bg-slate-100 sm:h-8 sm:w-8">
                      <Image
                        src={imageSrc}
                        alt=""
                        width={32}
                        height={32}
                        className="h-full w-full object-contain p-0.5"
                      />
                    </div>
                  ) : null}
                  <span className="max-w-[4.5rem] truncate text-[9px] font-bold uppercase tracking-wide text-slate-700 group-hover:text-primary sm:max-w-none sm:text-[11px]">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/offer/best-deals"
            className="hidden shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-secondary transition hover:bg-primary/90 sm:inline-flex sm:text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Online Exclusive
          </Link>
        </div>
      </div>

      {/* Category mega menu — desktop dropdown only */}
      {categoryMenuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[55] hidden bg-slate-900/5 lg:block"
            aria-label="Close category menu"
            onClick={() => setCategoryMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-[60] hidden px-3 sm:px-4 lg:block lg:px-6">
            <div className="mx-auto max-w-[95rem]">
              <div className="w-full lg:max-w-[50rem]">
                <CategoryMegaMenu categories={categories} />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Mobile menu */}
      {mobileMenuOpen ? (
        <div className="absolute inset-x-0 top-full z-[60] px-3 sm:px-4 lg:hidden">
          <div className="mx-auto max-w-[95rem] py-3">
            {!displayUser ? (
              <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                <LoginModal onLoginSuccess={setCurrentUser}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary font-semibold hover:bg-primary/90">
                      <User className="mr-2 h-4 w-4" />
                      Sign In / Sign up
                    </Button>
                  </DialogTrigger>
                </LoginModal>
              </div>
            ) : null}
            <CategoryMegaMenu categories={categories} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
