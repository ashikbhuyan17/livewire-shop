import { redirect } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/auth-profile';
import { isPartnerUser } from '@/lib/partner-utils';

export type PartnerProfile = {
  id: number;
  name: string;
  ref_code: string;
  account_balance: string | number;
  withdrawal_balance: string | number;
};

export async function requirePartnerProfile(): Promise<PartnerProfile> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = await fetcher('/user-profile', { cache: 'no-store' }, false);

  if (!isAuthenticatedProfile(profile)) {
    redirect('/signin?redirect=/user/partner');
  }

  const data = profile?.data as Record<string, unknown> | undefined;
  const refCode = data?.ref_code;
  if (!isPartnerUser(refCode as string | number | null)) {
    redirect('/user');
  }

  return {
    id: Number(data?.id ?? 0) || 0,
    name: String(data?.name ?? ''),
    ref_code: String(refCode).trim(),
    account_balance: (data?.account_balance as string | number) ?? '0',
    withdrawal_balance: (data?.withdrawal_balance as string | number) ?? '0',
  };
}
