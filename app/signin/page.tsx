import type { Metadata } from 'next';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Sign in',
  description: 'Sign in to your BestFood City account.',
  pathname: '/signin',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default function SignInPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Enter your credentials to continue shopping."
      footer={
        <p>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-headerBg hover:underline"
          >
            Create one
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
