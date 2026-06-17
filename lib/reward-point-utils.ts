import { formatAmount } from '@/lib/currency';

export type RewardPointProfile = {
  rewardPoints: number;
  perPointPrice: number;
};

export type RewardPointRedemption = {
  /** Points applied toward this order. */
  pointsUsed: number;
  /** Monetary value covered by points. */
  pointDiscount: number;
  /** Points left after redemption. */
  remainingPoints: number;
  /** Cash / COD amount still due. */
  dueAmount: number;
  /** Total monetary value of all available points. */
  availableBalance: number;
};

export function parseRewardPointProfile(
  profile: unknown,
): RewardPointProfile | null {
  if (!profile || typeof profile !== 'object') return null;

  const root = profile as Record<string, unknown>;
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : root;

  const rewardPoints = Number(data.reward_point ?? 0);
  const perPointPrice = Number(data.per_reward_point_price ?? 0);

  if (!Number.isFinite(rewardPoints) || rewardPoints <= 0) return null;
  if (!Number.isFinite(perPointPrice) || perPointPrice <= 0) return null;

  return { rewardPoints, perPointPrice };
}

/** Auto-redeem up to the order total using available reward points. */
export function calculateRewardPointRedemption(
  orderTotal: number,
  rewardPoints: number,
  perPointPrice: number,
): RewardPointRedemption {
  const total = Math.max(0, orderTotal);
  const points = Math.max(0, rewardPoints);
  const price = Math.max(0, perPointPrice);

  const availableBalance = points * price;
  const pointDiscount = Math.min(availableBalance, total);
  const pointsUsed = price > 0 ? pointDiscount / price : 0;
  const remainingPoints = Math.max(0, points - pointsUsed);
  const dueAmount = Math.max(0, total - pointDiscount);

  return {
    pointsUsed,
    pointDiscount,
    remainingPoints,
    dueAmount,
    availableBalance,
  };
}

export function formatPointsCount(points: number): string {
  return formatAmount(points);
}
