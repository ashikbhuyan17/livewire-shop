import { cookies } from 'next/headers';
import type { UserCookie } from '@/action/token';
import { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE } from '@/lib/auth-cookies';
import { isAuthenticatedProfile, isAuthenticatedWithToken } from '@/lib/auth-profile';

function userFromProfile(data: Record<string, unknown>): UserCookie {
  return {
    id: Number(data.id ?? 0) || 0,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    phone: typeof data.phone === 'string' ? data.phone : null,
    profile_image:
      typeof data.profile_image === 'string' ? data.profile_image : null,
  };
}

/**
 * Resolves the header/nav session user. Requires a valid auth token — the user
 * display cookie alone is not enough (prevents "logged in" UI without a session).
 * Cookie clearing is handled in middleware (layouts cannot mutate cookies).
 */
export async function getLayoutSessionUser(): Promise<UserCookie | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value?.trim();
  const userCookieRaw = cookieStore.get(AUTH_USER_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const authenticated = await isAuthenticatedWithToken(token);
  if (!authenticated) {
    return null;
  }

  if (userCookieRaw) {
    try {
      const parsed = JSON.parse(userCookieRaw) as UserCookie;
      if (parsed?.id || parsed?.email || parsed?.name) {
        return parsed;
      }
    } catch {
      /* fall through — rebuild from profile if needed */
    }
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return null;

    const res = await fetch(`${apiUrl}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const profile: unknown = await res.json();
    if (!isAuthenticatedProfile(profile)) return null;

    const data = (profile as Record<string, unknown>).data as
      | Record<string, unknown>
      | undefined;
    if (!data) return null;

    return userFromProfile(data);
  } catch {
    return null;
  }
}
