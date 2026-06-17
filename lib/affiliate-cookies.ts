import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export const AFFILIATE_CODE_COOKIE = 'affiliate_code';

const AFFILIATE_COOKIE_BASE = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
};

const AFFILIATE_COOKIE_LIVE = {
  ...AFFILIATE_COOKIE_BASE,
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export function normalizeAffiliateRef(
  value: string | null | undefined,
): string | null {
  const trimmed = String(value ?? '').trim();
  if (!trimmed || !/^[a-zA-Z0-9_-]{1,64}$/.test(trimmed)) return null;
  return trimmed;
}

export function setAffiliateCodeOnResponse(
  response: NextResponse,
  ref: string,
): NextResponse {
  response.cookies.set(AFFILIATE_CODE_COOKIE, ref, AFFILIATE_COOKIE_LIVE);
  return response;
}

export function applyAffiliateRefFromRequest(
  request: { nextUrl: { searchParams: URLSearchParams } },
  response: NextResponse,
): NextResponse {
  const ref = normalizeAffiliateRef(request.nextUrl.searchParams.get('ref'));
  if (ref) {
    setAffiliateCodeOnResponse(response, ref);
  }
  return response;
}

export async function readAffiliateCodeCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return normalizeAffiliateRef(
    cookieStore.get(AFFILIATE_CODE_COOKIE)?.value,
  );
}

export async function clearAffiliateCodeCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(AFFILIATE_CODE_COOKIE, '', {
      ...AFFILIATE_COOKIE_BASE,
      maxAge: 0,
    });
  } catch {
    /* Server Component context — ignore */
  }
}
