/** Carries `?redirect=` through the Google OAuth round-trip (same check as middleware). */
const GOOGLE_REDIRECT_STORAGE_KEY = 'bestfood_auth_redirect';

function safeRedirectPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.startsWith('/') && !trimmed.startsWith('//') ? trimmed : null;
}

/** Call before leaving for Google OAuth when sign-in URL has `?redirect=`. */
export function storeGoogleOAuthRedirect(search: string): void {
  if (typeof window === 'undefined') return;
  const path = safeRedirectPath(new URLSearchParams(search).get('redirect'));
  try {
    if (path) {
      sessionStorage.setItem(GOOGLE_REDIRECT_STORAGE_KEY, path);
    } else {
      sessionStorage.removeItem(GOOGLE_REDIRECT_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

/** After callback: stored redirect, then `?redirect=` on callback URL, else home. */
export function resolveGooglePostAuthRedirect(
  searchParams: URLSearchParams,
): string {
  let stored: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      stored = safeRedirectPath(
        sessionStorage.getItem(GOOGLE_REDIRECT_STORAGE_KEY),
      );
      sessionStorage.removeItem(GOOGLE_REDIRECT_STORAGE_KEY);
    } catch {
      stored = null;
    }
  }
  return stored ?? safeRedirectPath(searchParams.get('redirect')) ?? '/';
}

/** Google OAuth redirect — built from public API base (no hardcoded hosts). */
export function getGoogleOAuthRedirectUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }
  return `${base}/google/redirect`;
}

export type GoogleAuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  slug?: string;
  status?: string;
  profile_image?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Safely decode and parse the `user` query param from the Google callback. */
export function parseGoogleCallbackUser(raw: string): GoogleAuthUser | null {
  if (!raw.trim()) return null;

  try {
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      decoded = raw;
    }

    const data: unknown = JSON.parse(decoded);
    if (!isRecord(data)) return null;

    const id = Number(data.id);
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';

    if (!Number.isFinite(id) || id <= 0 || !name || !email) {
      return null;
    }

    return {
      id,
      name,
      email,
      phone:
        data.phone === null || data.phone === undefined
          ? null
          : String(data.phone),
      slug: typeof data.slug === 'string' ? data.slug : undefined,
      status: typeof data.status === 'string' ? data.status : undefined,
      profile_image:
        typeof data.profile_image === 'string' ? data.profile_image : null,
    };
  } catch {
    return null;
  }
}
