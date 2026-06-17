import type { Metadata } from 'next';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Create account',
  description:
    'Create your BestFood City account to shop groceries, track orders, and unlock daily deals.',
  pathname: '/register',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="It only takes a minute — start shopping right away."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-semibold text-headerBg hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
