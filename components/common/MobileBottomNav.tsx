'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Heart,
  Home,
  LayoutGrid,
  Menu,
  ShoppingBag,
  User,
  MapPin,
  ChevronRight,
  Package,
  Info,
  Mail,
  FileQuestion,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CategorySidebar from '@/components/common/CategorySidebar';
import LoginModal from '@/components/common/LoginModal';
import { useCartStore } from '@/stores/cart-store';
import { clearAuth } from '@/action/token';
import type { UserCookie } from '@/action/token';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DialogTrigger } from '@/components/ui/dialog';

const navItemClass = cn(
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition-colors active:scale-[0.98]',
);

const labelClass = 'max-w-full truncate text-[10px] font-medium leading-tight sm:text-[11px]';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  user: UserCookie | null;
};

export default function MobileBottomNav({ categories, user: initialUser }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const setCartSheetOpen = useCartStore((s) => s.setCartSheetOpen);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserCookie | null>(initialUser);

  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  const displayUser = currentUser ?? initialUser;

  const handleLogout = async () => {
    await clearAuth();
    setCurrentUser(null);
    setMoreOpen(false);
    router.replace('/signin');
    router.refresh();
  };

  const cartCount = cart.items.length;
  const isHome = pathname === '/';
  const isWishlist = pathname.startsWith('/user/wishlist');
  const isAccount = pathname.startsWith('/user/account');

  const moreLinks = [
    { href: '/user/orders', label: 'My orders', icon: Package },
    { href: '/our-outlets', label: 'Our outlets', icon: MapPin },
    { href: '/faq', label: 'FAQ', icon: FileQuestion },
    { href: '/about', label: 'About us', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden pointer-events-none"
      aria-label="Mobile primary navigation"
    >
      <div
        className="pointer-events-auto mx-3 mb-3 rounded-2xl border border-gray-200/90 bg-white/95 px-1 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="grid grid-cols-6 gap-0.5">
          <Link
            prefetch
            href="/"
            className={cn(
              navItemClass,
              isHome
                ? 'text-headerBg'
                : 'text-gray-500 hover:text-gray-800',
            )}
          >
            <Home
              className={cn('h-6 w-6 shrink-0', isHome && 'stroke-[2.25px]')}
              strokeWidth={isHome ? 2.25 : 1.75}
            />
            <span className={cn(labelClass, isHome && 'font-semibold text-headerBg')}>
              Home
            </span>
          </Link>

          <Sheet open={categoryOpen} onOpenChange={setCategoryOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  navItemClass,
                  categoryOpen ? 'text-headerBg' : 'text-gray-500 hover:text-gray-800',
                )}
              >
                <Menu className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                <span
                  className={cn(
                    labelClass,
                    categoryOpen && 'font-semibold text-headerBg',
                  )}
                >
                  Category
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[85vh] rounded-t-2xl p-0"
            >
              <SheetHeader className="border-b border-gray-100 px-4 py-3 text-left">
                <SheetTitle className="text-lg font-semibold">
                  Shop by category
                </SheetTitle>
              </SheetHeader>
              <div className="max-h-[calc(85vh-4rem)] w-full overflow-y-auto px-3 py-2">
                <CategorySidebar isCollapsible embedded categories={categories} />
              </div>
            </SheetContent>
          </Sheet>

          <button
            type="button"
            onClick={() => setCartSheetOpen(true)}
            className={cn(
              navItemClass,
              'text-gray-500 hover:text-gray-800',
            )}
          >
            <span className="relative">
              <ShoppingBag className="h-6 w-6 shrink-0" strokeWidth={1.75} />
              {cartCount > 0 ? (
                <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </span>
            <span className={labelClass}>Cart</span>
          </button>

          <Link
            prefetch
            href="/user/wishlist"
            className={cn(
              navItemClass,
              isWishlist
                ? 'text-headerBg'
                : 'text-gray-500 hover:text-gray-800',
            )}
          >
            <Heart
              className="h-6 w-6 shrink-0"
              strokeWidth={isWishlist ? 2.25 : 1.75}
            />
            <span
              className={cn(
                labelClass,
                isWishlist && 'font-semibold text-headerBg',
              )}
            >
              Wishlist
            </span>
          </Link>

          <Link
            prefetch
            href="/user/account"
            className={cn(
              navItemClass,
              isAccount
                ? 'text-headerBg'
                : 'text-gray-500 hover:text-gray-800',
            )}
          >
            <User
              className="h-6 w-6 shrink-0"
              strokeWidth={isAccount ? 2.25 : 1.75}
            />
            <span
              className={cn(
                labelClass,
                isAccount && 'font-semibold text-headerBg',
              )}
            >
              Account
            </span>
          </Link>

          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  navItemClass,
                  moreOpen ? 'text-headerBg' : 'text-gray-500 hover:text-gray-800',
                )}
              >
                <LayoutGrid className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                <span
                  className={cn(
                    labelClass,
                    moreOpen && 'font-semibold text-headerBg',
                  )}
                >
                  More
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[88vh] overflow-y-auto rounded-t-2xl pb-[env(safe-area-inset-bottom)]"
            >
              <SheetHeader className="border-b border-gray-100 pb-3 text-left">
                <SheetTitle className="text-lg font-semibold">More</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                {/* Account — header এ mobile এ লুকানো, এখানে */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Account
                  </p>
                  {displayUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-semibold text-primary ring-1 ring-gray-200">
                          {displayUser.profile_image ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${displayUser.profile_image}`}
                              alt=""
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (displayUser.name || displayUser.email || '?')
                              .charAt(0)
                              .toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-900">
                            {displayUser.name}
                          </p>
                          <p className="truncate text-xs text-gray-600">
                            {displayUser.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        prefetch
                        href="/user/account"
                        onClick={() => setMoreOpen(false)}
                        className="block w-full rounded-lg bg-headerBg py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#267322]"
                      >
                        Manage account
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2 border-gray-300 text-gray-800"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <LoginModal onLoginSuccess={setCurrentUser}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="w-full gap-2 bg-headerBg font-semibold text-white hover:bg-[#267322]"
                        >
                          <User className="h-4 w-4" />
                          Sign in / Sign up
                        </Button>
                      </DialogTrigger>
                    </LoginModal>
                  )}
                </div>

                <Separator />

                <ul className="grid gap-1">
                  {moreLinks.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        prefetch
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-headerBg" aria-hidden />
                        {label}
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
