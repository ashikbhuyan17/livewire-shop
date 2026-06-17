'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuth } from '@/action/token';

type Props = {
  /** Optional click hook (e.g. close mobile drawer before navigating). */
  onBeforeSignOut?: () => void;
  className?: string;
};

export default function SignOutButton({ onBeforeSignOut, className }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    onBeforeSignOut?.();
    try {
      await clearAuth();
    } catch {
      // ignore — we still want to redirect the user away.
    }
    startTransition(() => {
      router.replace('/signin');
      router.refresh();
    });
  };

  const busy = signingOut || isPending;

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={busy}
      aria-label="Sign out of your account"
      className={cn(
        'group/signout relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors',
        'hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors',
          'group-hover/signout:bg-red-100',
        )}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <LogOut className="h-4 w-4" aria-hidden />
        )}
      </span>
      <span className="truncate">{busy ? 'Signing out…' : 'Sign Out'}</span>
    </button>
  );
}
