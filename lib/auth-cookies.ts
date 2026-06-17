import type { NextResponse } from 'next/server';

/** Auth cookie names — unique to BestFood to avoid clashes with other localhost apps. */
export const AUTH_TOKEN_COOKIE = 'bestfoodtoken';
export const AUTH_USER_COOKIE = 'bestfooduser';

/** Legacy names cleared on sign-in / sign-out so old sessions do not linger. */
export const LEGACY_AUTH_TOKEN_COOKIE = 'token';
export const LEGACY_AUTH_USER_COOKIE = 'user';

const AUTH_COOKIE_EXPIRE = {
  path: '/',
  maxAge: 0,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

/** Clear auth cookies on a middleware/route response. */
export function clearAuthCookiesOnResponse(response: NextResponse): NextResponse {
  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    ...AUTH_COOKIE_EXPIRE,
    httpOnly: true,
  });
  response.cookies.set(AUTH_USER_COOKIE, '', {
    ...AUTH_COOKIE_EXPIRE,
    httpOnly: false,
  });
  response.cookies.set(LEGACY_AUTH_TOKEN_COOKIE, '', {
    ...AUTH_COOKIE_EXPIRE,
    httpOnly: true,
  });
  response.cookies.set(LEGACY_AUTH_USER_COOKIE, '', {
    ...AUTH_COOKIE_EXPIRE,
    httpOnly: false,
  });
  return response;
}
