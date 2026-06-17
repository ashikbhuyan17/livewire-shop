import { Suspense } from 'react';
import GoogleCallbackClient from './GoogleCallbackClient';
import GoogleCallbackLoading from '@/components/auth/GoogleCallbackLoading';

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<GoogleCallbackLoading />}>
      <GoogleCallbackClient />
    </Suspense>
  );
}
