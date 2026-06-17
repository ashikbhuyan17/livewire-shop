'use client';

import { useEffect, useState } from 'react';
import {
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CategorySidebar from './CategorySidebar';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import { DialogTrigger } from '../ui/dialog';
import { clearAuth } from '@/action/token';
import type { UserCookie } from '@/action/token';
import WishlistHeaderLink from './WishlistHeaderLink';
import NotificationHeaderLink from './NotificationHeaderLink';
import CompareHeaderLink from './CompareHeaderLink';
import BrandLogoLink from './BrandLogoLink';
import HeaderProductSearch from '@/components/search/HeaderProductSearch';

function UserProfilePill({
  user,
  showLogout = false,
  onLogout,
}: {
  user: UserCookie;
  showLogout?: boolean;
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
    <div className="flex items-center gap-1.5">
      <Link
        prefetch
        href="/user/account"
        className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-black transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
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
        <div className="min-w-0 hidden md:block">
          <p className="truncate text-xs font-semibold text-black">{user.name}</p>
          <p className="truncate text-[11px] text-black/80">{user.email}</p>
        </div>
      </Link>
      {showLogout && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-white hover:bg-white/10 hover:text-white shrink-0"
          onClick={handleLogout}
          title="Log out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

function HeaderActions({
  compareCount,
  wishlistCount,
  notificationCount,
  displayUser,
  onLogout,
  onLoginSuccess,
}: {
  compareCount: number;
  wishlistCount: number;
  notificationCount: number;
  displayUser: UserCookie | null;
  onLogout: () => void;
  onLoginSuccess: (user: UserCookie) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1 sm:gap-1.5 md:gap-2">
      <CompareHeaderLink initialCount={compareCount} />
      <WishlistHeaderLink initialCount={wishlistCount} />
      {displayUser ? (
        <NotificationHeaderLink initialCount={notificationCount} />
      ) : null}

      <div className="hidden items-center gap-1.5 lg:flex">
        {displayUser ? (
          <UserProfilePill
            user={displayUser}
            showLogout
            onLogout={onLogout}
          />
        ) : (
          <LoginModal onLoginSuccess={onLoginSuccess}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-white hover:bg-white/10 hover:text-white lg:h-9"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Sign In / Sign up</span>
              </Button>
            </DialogTrigger>
          </LoginModal>
        )}
      </div>
    </div>
  );
}

export default function Header({
  categories,
  user,
  wishlistCount = 0,
  compareCount = 0,
  notificationCount = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any;
  user: UserCookie | null;
  wishlistCount?: number;
  compareCount?: number;
  notificationCount?: number;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserCookie | null>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const displayUser = currentUser ?? user;

  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <header className="bg-headerBg py-1 text-white shadow-lg backdrop-blur-md">
        <div className="mx-auto w-full max-w-[95rem] px-3 sm:px-4">
          {/* Mobile layout */}
          <div className="flex h-11 items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-[1.125rem] w-[1.125rem]" />
              ) : (
                <Menu className="h-[1.125rem] w-[1.125rem]" />
              )}
            </Button>

            <BrandLogoLink logoSrc="/livewire.png" className="shrink-0" />

            <div className="min-w-0 flex-1">
              <HeaderProductSearch />
            </div>

            <HeaderActions
              compareCount={compareCount}
              wishlistCount={wishlistCount}
              notificationCount={notificationCount}
              displayUser={displayUser}
              onLogout={() => setCurrentUser(null)}
              onLoginSuccess={setCurrentUser}
            />
          </div>

          {/* Desktop layout: logo left · search center · actions right */}
          <div className="hidden h-14 grid-cols-[minmax(0,1fr)_minmax(0,42rem)_minmax(0,1fr)] items-center gap-4 lg:grid">
            <div className="flex items-center justify-start">
              <BrandLogoLink logoSrc="/livewire.png" />
            </div>

            <div className="mx-auto w-full max-w-2xl justify-self-center px-2">
              <HeaderProductSearch />
            </div>

            <HeaderActions
              compareCount={compareCount}
              wishlistCount={wishlistCount}
              notificationCount={notificationCount}
              displayUser={displayUser}
              onLogout={() => setCurrentUser(null)}
              onLoginSuccess={setCurrentUser}
            />
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full z-[60] max-h-[min(70vh,28rem)] overflow-y-auto border-t border-gray-100 bg-white px-3 py-3 shadow-lg lg:hidden">
          <CategorySidebar isCollapsible embedded categories={categories} />
        </div>
      )}
    </div>
  );
}
