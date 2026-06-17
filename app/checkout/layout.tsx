import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/auth-profile';

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = await fetcher('/user-profile', { cache: 'no-store' }, false);
  if (!isAuthenticatedProfile(profile)) {
    const path = (await headers()).get('x-pathname') ?? '/checkout';
    redirect(`/signin?redirect=${encodeURIComponent(path)}`);
  }

  return <>{children}</>;
}
