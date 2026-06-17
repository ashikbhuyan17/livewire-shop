'use server';

import { setToken, setUser, type UserCookie } from '@/action/token';
import type { GoogleAuthUser } from '@/lib/google-auth';

export async function completeGoogleSignIn(
  token: string,
  user: GoogleAuthUser,
): Promise<void> {
  const cookieUser: UserCookie = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    profile_image: user.profile_image ?? null,
  };
  await setToken(token);
  await setUser(cookieUser);
}
