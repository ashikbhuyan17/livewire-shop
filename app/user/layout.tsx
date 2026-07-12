import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/auth-profile';
import type { UserCookie } from '@/action/token';
import { AUTH_USER_COOKIE } from '@/lib/auth-cookies';
import { isPartnerUser } from '@/lib/partner-utils';
import UserDashboardShell from '@/components/user/sidebar/UserDashboardShell';

/** Auth routes read cookies — must not be statically generated at build time. */
export const dynamic = 'force-dynamic';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = await fetcher('/user-profile', { cache: 'no-store' }, false);
  if (!isAuthenticatedProfile(profile)) {
    const path = (await headers()).get('x-pathname') ?? '/account';
    redirect(`/signin?redirect=${encodeURIComponent(path)}`);
  }

  // Resolve the display user. We prefer the freshly-fetched API profile
  // (so name/phone/avatar updates show up immediately), with a graceful
  // fallback to the cookie set at sign-in.
  let user: UserCookie | null = null;
  try {
    const apiData = profile?.data as Record<string, unknown> | undefined;
    if (apiData) {
      const refCode =
        apiData.ref_code != null
          ? (apiData.ref_code as string | number)
          : null;
      user = {
        id: Number(apiData.id ?? 0) || 0,
        name: String(apiData.name ?? ''),
        email: String(apiData.email ?? ''),
        phone:
          typeof apiData.phone === 'string' ? (apiData.phone as string) : null,
        profile_image:
          typeof apiData.profile_image === 'string'
            ? (apiData.profile_image as string)
            : null,
        reward_point:
          apiData.reward_point != null
            ? (apiData.reward_point as string | number)
            : null,
        ref_code: refCode,
        isPartner: isPartnerUser(refCode),
      };
    }
  } catch {
    user = null;
  }

  if (!user) {
    try {
      const cookieStore = await cookies();
      const raw = cookieStore.get(AUTH_USER_COOKIE)?.value;
      if (raw) user = JSON.parse(raw) as UserCookie;
    } catch {
      user = null;
    }
  }

  return (
    <UserDashboardShell user={user} isPartner={user?.isPartner ?? false}>
      {children}
    </UserDashboardShell>
  );
}
