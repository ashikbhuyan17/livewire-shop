/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Contact, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { fetcher } from '@/lib/fetcher';
import { setToken, setUser } from '@/action/token';
import { toast } from 'sonner';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

const BD_PHONE_REGEX = /^(\+880|880|0)?1[3-9]\d{8}$/;

function isValidLoginIdentifier(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes('@')) {
    return z.string().email().safeParse(trimmed).success;
  }
  return BD_PHONE_REGEX.test(trimmed.replace(/\s/g, ''));
}

const loginSchema = z.object({
  login: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      isValidLoginIdentifier,
      'Please enter a valid email or Bangladeshi phone number',
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({
  setOpen,
  onLoginSuccess,
  initialLogin = '',
}: {
  setOpen?: (open: boolean) => void;
  /** Prefill from `/signin?login=` or legacy `/signin?email=` */
  initialLogin?: string;
  onLoginSuccess?: (user: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    profile_image?: string | null;
  }) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: initialLogin,
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logUser: any = await fetcher('/login', {
      method: 'POST',
      body: JSON.stringify({
        login: data.login.trim(),
        password: data.password,
      }),
    });
    if (logUser?.status) {
      await setToken(logUser?.token);
      if (logUser?.user) {
        await setUser({
          id: logUser.user.id,
          name: logUser.user.name,
          email: logUser.user.email,
          phone: logUser.user.phone ?? null,
          profile_image: logUser.user.profile_image ?? null,
        });
        onLoginSuccess?.({
          id: logUser.user.id,
          name: logUser.user.name,
          email: logUser.user.email,
          phone: logUser.user.phone ?? null,
          profile_image: logUser.user.profile_image ?? null,
        });
      }
      toast.success('Hey there! You’ve logged in successfully.');
      setOpen?.(false);
      const raw = new URLSearchParams(window.location.search).get('redirect');
      const safeRedirect =
        raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : null;
      if (safeRedirect) {
        router.replace(safeRedirect);
      } else if (!setOpen) {
        router.replace('/');
      }
      router.refresh();
    } else {
      toast.error(logUser?.message);
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Email or phone number
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Contact className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="you@email.com or 01XXXXXXXXX"
                    className="pl-10"
                    autoComplete="username"
                    inputMode="email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-foreground">
                  Password
                </FormLabel>
                {/* <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot Password?
                </button> */}
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-headerBg/40"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <GoogleSignInButton />
      </form>
    </Form>
  );
}
