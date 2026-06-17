'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { UserCookie } from '@/action/token';
import SidebarContent from './SidebarContent';
import SidebarProfileHeader from './SidebarProfileHeader';

type Props = {
  user: UserCookie | null;
  isPartner?: boolean;
};

/**
 * User dashboard sidebar.
 *
 * Responsive behaviour:
 * - Desktop / tablet (md+): full-width sticky sidebar (18rem) inside the
 *   dashboard shell. Sibling content flexes into the remaining width.
 * - Mobile (< md): the sidebar is hidden; a hamburger button opens a
 *   slide-in drawer using the existing Radix-powered Sheet component.
 */
export default function UserSidebar({ user, isPartner = false }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleMobileNavigate = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* ────────────────────────────────────────────────
          Mobile topbar: visible < md
         ──────────────────────────────────────────────── */}
      <div className="sticky top-[5.5rem] z-30 -mx-3 mb-3 flex items-center justify-between gap-2 border-b border-slate-200/70 bg-white/90 px-3 py-2 backdrop-blur-md md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open dashboard menu"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-headerBg/40"
            >
              <Menu className="h-4 w-4" aria-hidden />
              <span>Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[88vw] max-w-[20rem] gap-0 border-r border-slate-200 bg-white p-0 sm:max-w-[20rem]"
            aria-label="User dashboard navigation"
          >
            <SheetHeader className="border-b border-slate-100 px-4 py-3 pr-12 text-left">
              <SheetTitle className="sr-only">Your account</SheetTitle>
              <SidebarProfileHeader
                user={user}
                onNavigate={handleMobileNavigate}
              />
            </SheetHeader>
            <div className="h-[calc(100dvh-5rem)]">
              <SidebarContent
                isPartner={isPartner}
                onNavigate={handleMobileNavigate}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">
            {user?.name || 'My account'}
          </span>
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          Desktop / tablet sidebar: hidden < md
         ──────────────────────────────────────────────── */}
      <aside
        aria-label="User dashboard navigation"
        className={
          // Sticky top matches the global header height (5.5rem on md,
          // 7.25rem on lg). The card height fills the remaining viewport.
          'hidden w-72 shrink-0 self-start overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] md:sticky md:top-[5.75rem] md:z-20 md:flex md:h-[calc(100dvh-7rem)] md:flex-col lg:top-[7.5rem] lg:h-[calc(100dvh-9rem)]'
        }
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 px-3 py-3">
          <SidebarProfileHeader user={user} className="min-w-0 flex-1" />
        </div>

        <div className="min-h-0 flex-1">
          <SidebarContent isPartner={isPartner} />
        </div>
      </aside>
    </>
  );
}
