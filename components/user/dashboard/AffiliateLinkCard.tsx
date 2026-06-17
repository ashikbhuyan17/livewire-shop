'use client';

import { useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Props = {
  url: string;
  affiliateName?: string;
  refCode?: string | null;
};

export default function AffiliateLinkCard({
  url,
  affiliateName,
  refCode,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) {
      toast.error('Affiliate link is not available yet');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Affiliate link copied');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-headerBg/20 bg-gradient-to-br from-headerBg/[0.12] via-white to-emerald-50/40 shadow-sm ring-1 ring-headerBg/10">
      <div className="border-b border-headerBg/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-headerBg/15 text-headerBg">
            <Link2 className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your affiliate link
            </p>
            <p className="text-xs text-slate-500">
              {affiliateName
                ? `Share and earn — ${affiliateName}`
                : 'Share this link to earn commissions'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {refCode ? (
          <p className="text-xs text-slate-500">
            Referral code:{' '}
            <span className="font-mono font-semibold text-slate-800">
              {refCode}
            </span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleCopy()}
          disabled={!url}
          className={cn(
            'group flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300/90 bg-white/90 px-3 py-3 text-left transition-colors',
            'hover:border-headerBg/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-headerBg/40',
            !url && 'cursor-not-allowed opacity-60',
          )}
        >
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700 sm:text-sm">
            {url || 'Affiliate URL not configured'}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-headerBg px-2.5 py-1.5 text-[11px] font-semibold text-white">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Copy
              </>
            )}
          </span>
        </button>

        <Button
          type="button"
          onClick={() => void handleCopy()}
          disabled={!url}
          className="h-10 w-full rounded-xl bg-headerBg font-semibold text-white hover:bg-headerBg/90"
        >
          {copied ? 'Link copied!' : 'Copy affiliate link'}
        </Button>
      </div>
    </div>
  );
}
