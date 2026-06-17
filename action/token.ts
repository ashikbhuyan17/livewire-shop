'use server';

import { cookies } from 'next/headers';
import {
  AUTH_TOKEN_COOKIE,
  AUTH_USER_COOKIE,
  LEGACY_AUTH_TOKEN_COOKIE,
  LEGACY_AUTH_USER_COOKIE,
} from '@/lib/auth-cookies';

const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

function clearLegacyAuthCookies(
  cookiesStore: Awaited<ReturnType<typeof cookies>>,
  expire: { path: string; secure: boolean; sameSite: 'lax'; maxAge: number },
) {
  cookiesStore.set(LEGACY_AUTH_TOKEN_COOKIE, '', { ...expire, httpOnly: true });
  cookiesStore.set(LEGACY_AUTH_USER_COOKIE, '', { ...expire, httpOnly: false });
}

export const setToken = async (token: string) => {
  try {
    const cookiesStore = await cookies();
    cookiesStore.set(AUTH_TOKEN_COOKIE, token, {
      ...COOKIE_OPTIONS,
      httpOnly: true,
    });
    clearLegacyAuthCookies(cookiesStore, { ...COOKIE_OPTIONS, maxAge: 0 });
  } catch (error) {
    console.log('Token Error:', error);
  }
};

export type UserCookie = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  profile_image?: string | null;
  reward_point?: string | number | null;
  ref_code?: string | number | null;
  isPartner?: boolean;
};

export const setUser = async (user: UserCookie) => {
  try {
    const cookiesStore = await cookies();
    const value = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      profile_image: user.profile_image ?? null,
    });
    cookiesStore.set(AUTH_USER_COOKIE, value, {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    });
    clearLegacyAuthCookies(cookiesStore, { ...COOKIE_OPTIONS, maxAge: 0 });
  } catch (error) {
    console.log('User cookie Error:', error);
  }
};

export const clearAuth = async () => {
  try {
    const cookiesStore = await cookies();
    const expire = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
    };
    cookiesStore.set(AUTH_TOKEN_COOKIE, '', { ...expire, httpOnly: true });
    cookiesStore.set(AUTH_USER_COOKIE, '', { ...expire, httpOnly: false });
    clearLegacyAuthCookies(cookiesStore, expire);
  } catch (error) {
    console.log('Clear auth Error:', error);
  }
};
