'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import { setToken, setUser } from '@/action/token';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(
      /^(\+880|880|0)?1[3-9]\d{8}$/,
      'Please enter a valid Bangladeshi phone number',
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  affiliator: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type Props = {
  /** Closes the parent dialog when used inside LoginModal. */
  setOpen?: (open: boolean) => void;
  /**
   * Where to send the user after successful sign-up on the standalone page.
   * Defaults to `/` (home).
   */
  redirectTo?: string;
};

function readErrorMessage(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      const msg = readErrorMessage(v);
      if (msg) return msg;
    }
  }
  return undefined;
}

export default function RegisterForm({ setOpen, redirectTo = '/' }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      affiliator: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const regUserData: any = await fetcher('/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.fullName,
          phone: data.phone,
          email: data.email,
          password: data.password,
          affiliator: data.affiliator,
        }),
      });

      if (regUserData?.status) {
        if (regUserData.token) await setToken(regUserData.token);
        if (regUserData.user) {
          await setUser({
            id: regUserData.user.id,
            name: regUserData.user.name,
            email: regUserData.user.email,
            phone: regUserData.user.phone ?? null,
            profile_image: regUserData.user.profile_image ?? null,
          });
        }
        toast.success(
          regUserData?.message?.toString?.() ||
            'Your account has been created successfully.',
        );

        if (setOpen) {
          setOpen(false);
          router.refresh();
        } else if (regUserData.token) {
          router.replace(redirectTo);
          router.refresh();
        } else {
          router.replace(`/signin?email=${encodeURIComponent(data.email)}`);
        }
      } else {
        toast.error(
          readErrorMessage(regUserData?.message) ||
            readErrorMessage(regUserData?.errors) ||
            'Failed to create account',
        );
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Full Name
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    className="pl-10"
                    autoComplete="name"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="you@company.com"
                      className="pl-10"
                      autoComplete="email"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="01XXXXXXXXX"
                      className="pl-10"
                      autoComplete="tel"
                      inputMode="tel"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
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

        <FormField
          control={form.control}
          name="affiliator"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 px-3 py-3">
                <FormControl>
                  <Checkbox
                    id="register-affiliator"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    className="mt-0.5 border-headerBg data-[state=checked]:border-headerBg data-[state=checked]:bg-headerBg"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="register-affiliator"
                    className="cursor-pointer text-sm font-medium text-foreground"
                  >
                    Sign up as an affiliator
                  </FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <a href="/help" className="font-medium text-headerBg hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="/help" className="font-medium text-headerBg hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
