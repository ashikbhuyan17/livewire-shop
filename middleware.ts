import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticatedWithToken } from '@/lib/auth-profile';
import {
  AUTH_TOKEN_COOKIE,
  AUTH_USER_COOKIE,
  clearAuthCookiesOnResponse,
} from '@/lib/auth-cookies';
import { applyAffiliateRefFromRequest } from '@/lib/affiliate-cookies';

function finish(request: NextRequest, response: NextResponse): NextResponse {
  return applyAffiliateRefFromRequest(request, response);
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/account') ||
    pathname.startsWith('/user') ||
    pathname === '/wishlist' ||
    pathname === '/compare'
    // pathname === '/cart' ||
    // pathname === '/checkout'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value?.trim();
  const userCookie = request.cookies.get(AUTH_USER_COOKIE)?.value;
  const hasToken = Boolean(token);
  const hasUserCookie = Boolean(userCookie);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  try {
    let authenticated = false;

    if (hasToken) {
      authenticated = await isAuthenticatedWithToken(token);
    }

    const staleSession =
      (hasToken && !authenticated) || (!hasToken && hasUserCookie);

    if (staleSession) {
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      clearAuthCookiesOnResponse(response);
      authenticated = false;

      if (isProtectedPath(pathname)) {
        const signinUrl = new URL('/signin', request.url);
        signinUrl.searchParams.set('redirect', pathname);
        const redirect = NextResponse.redirect(signinUrl);
        return finish(request, clearAuthCookiesOnResponse(redirect));
      }

      return finish(request, response);
    }

    if (authenticated && pathname === '/signin') {
      const redirect = request.nextUrl.searchParams.get('redirect');
      const returnUrl =
        redirect && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : '/account';
      return finish(request, NextResponse.redirect(new URL(returnUrl, request.url)));
    }

    if (!authenticated && isProtectedPath(pathname)) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return finish(request, NextResponse.redirect(signinUrl));
    }

    return finish(
      request,
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
    );
  } catch (error) {
    console.error('Middleware error:', error);
    if (isProtectedPath(pathname)) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return finish(request, NextResponse.redirect(signinUrl));
    }
    return finish(
      request,
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
