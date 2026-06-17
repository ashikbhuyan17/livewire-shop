'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeGoogleSignIn } from '@/action/google-auth';
import {
  parseGoogleCallbackUser,
  resolveGooglePostAuthRedirect,
} from '@/lib/google-auth';
import GoogleCallbackLoading from '@/components/auth/GoogleCallbackLoading';

/** `/login` rewrites to `/signin` in next.config.mjs */
const LOGIN_PATH = '/login';

export default function GoogleCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    async function finishSignIn() {
      const token = searchParams.get('token');
      const userRaw = searchParams.get('user');

      if (!token?.trim()) {
        router.replace(LOGIN_PATH);
        return;
      }

      if (!userRaw) {
        router.replace(LOGIN_PATH);
        return;
      }

      const user = parseGoogleCallbackUser(userRaw);
      if (!user) {
        router.replace(LOGIN_PATH);
        return;
      }

      try {
        await completeGoogleSignIn(token.trim(), user);
        const destination = resolveGooglePostAuthRedirect(searchParams);
        router.replace(destination);
        router.refresh();
      } catch {
        router.replace(LOGIN_PATH);
      }
    }

    void finishSignIn();
  }, [searchParams, router]);

  return <GoogleCallbackLoading />;
}
