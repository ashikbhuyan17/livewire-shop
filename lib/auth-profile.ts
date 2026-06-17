/**
 * Profile-based auth (API /user-profile). Safe for Edge middleware and server layouts.
 */

export function isAuthenticatedProfile(profile: unknown): boolean {
  if (!profile || typeof profile !== 'object') return false;
  const p = profile as Record<string, unknown>;
  const data = p.data;
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  const hasId =
    d.id !== undefined && d.id !== null && `${d.id}` !== '';
  return Boolean(hasId || d.email || d.phone);
}

export async function isAuthenticatedWithToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token?.trim()) return false;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return false;

  try {
    const res = await fetch(`${apiUrl}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const profile: unknown = await res.json();
    return isAuthenticatedProfile(profile);
  } catch (error) {
    console.error('Auth profile check failed:', error);
    return false;
  }
}
