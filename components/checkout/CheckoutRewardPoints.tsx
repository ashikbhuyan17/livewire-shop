'use client';

import { Coins, CheckCircle2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import {
  calculateRewardPointRedemption,
  formatPointsCount,
  type RewardPointProfile,
} from '@/lib/reward-point-utils';

type Props = {
  profile: RewardPointProfile;
  orderTotal: number;
  usePoints: boolean;
  onUsePointsChange: (use: boolean) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
};

export default function CheckoutRewardPoints({
  profile,
  orderTotal,
  usePoints,
  onUsePointsChange,
  disabled = false,
  variant = 'default',
}: Props) {
  const isCompact = variant === 'compact';
  const redemption = calculateRewardPointRedemption(
    orderTotal,
    profile.rewardPoints,
    profile.perPointPrice,
  );

  const canRedeem = redemption.availableBalance > 0 && orderTotal > 0;

  if (!canRedeem) return null;

  const activeRedemption = usePoints ? redemption : null;

  return (
    <div
      className={cn(
        isCompact ? 'border-t border-dashed border-border/60 py-3' : 'py-4',
      )}
    >
      {!isCompact ? (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Coins className="h-4 w-4" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Reward points</p>
            <p className="text-xs text-muted-foreground">
              Pay with your loyalty points — we apply the maximum automatically.
            </p>
          </div>
        </div>
      ) : (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Reward points
        </p>
      )}

      <label
        htmlFor="checkout-use-reward-points"
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors sm:p-4',
          usePoints
            ? 'border-amber-500/50 bg-gradient-to-r from-amber-50/90 to-orange-50/40 dark:border-amber-700/40 dark:from-amber-950/25 dark:to-orange-950/15'
            : 'border-border/80 bg-muted/10 hover:border-border',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <Checkbox
          id="checkout-use-reward-points"
          checked={usePoints}
          onCheckedChange={(checked) => onUsePointsChange(checked === true)}
          disabled={disabled}
          className="mt-0.5 border-amber-600 data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
            Use reward points
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              {formatPointsCount(profile.rewardPoints)} pts available
            </span>
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            1 point ={' '}
            <span className="font-semibold tabular-nums text-foreground">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatAmount(profile.perPointPrice)}
            </span>
            {' · '}
            Balance worth{' '}
            <span className="font-semibold tabular-nums text-foreground">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatAmount(redemption.availableBalance)}
            </span>
          </span>

          {activeRedemption ? (
            <span
              className="mt-2 flex flex-col gap-1 rounded-lg border border-amber-200/80 bg-white/70 px-3 py-2 text-xs dark:border-amber-900/40 dark:bg-card/50"
              role="status"
            >
              <span className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-200">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Applying{' '}
                <span className="tabular-nums font-bold">
                  {formatPointsCount(activeRedemption.pointsUsed)} pts
                </span>{' '}
                (−
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(activeRedemption.pointDiscount)})
              </span>
              <span className="text-muted-foreground">
                Remaining after order:{' '}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatPointsCount(activeRedemption.remainingPoints)} pts
                </span>
                {activeRedemption.dueAmount > 0 ? (
                  <>
                    {' · '}
                    Due at payment:{' '}
                    <span className="font-semibold tabular-nums text-foreground">
                      <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                      {formatAmount(activeRedemption.dueAmount)}
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    {' · '}
                    Fully covered by points
                  </span>
                )}
              </span>
            </span>
          ) : (
            <span className="mt-1.5 block text-xs text-muted-foreground">
              Select to auto-apply points toward this order.
            </span>
          )}
        </span>
      </label>
    </div>
  );
}
