'use client';

import { cn } from '@/lib/utils';
import { getUserNavSections } from '@/lib/user-nav';
import SidebarNavItem from './SidebarNavItem';
import SignOutButton from './SignOutButton';

type Props = {
  isPartner?: boolean;
  /** Fires after a child link is clicked (used to close mobile drawer). */
  onNavigate?: () => void;
};

export default function SidebarContent({
  isPartner = false,
  onNavigate,
}: Props) {
  const sections = getUserNavSections(isPartner);
  return (
    <div className="flex h-full flex-col">
      {/* Scrollable sections */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3 [scrollbar-gutter:stable]">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={cn(idx > 0 && 'mt-5 border-t border-slate-100 pt-4')}
          >
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Sign out footer */}
      <div className="shrink-0 border-t border-slate-200/70 bg-slate-50/40 px-2.5 py-3">
        <SignOutButton onBeforeSignOut={onNavigate} />
      </div>
    </div>
  );
}
