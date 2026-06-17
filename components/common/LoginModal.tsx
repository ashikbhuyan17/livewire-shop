'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import { SITE_BRAND_SHORT } from '@/lib/site';

type AuthTab = 'login' | 'register';

function LoginModal({
  children,
  onLoginSuccess,
}: {
  children: React.ReactNode;
  onLoginSuccess?: (user: { id: number; name: string; email: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>('login');

  const isLogin = tab === 'login';
  const heading = isLogin ? 'Welcome back!' : `Join ${SITE_BRAND_SHORT}`;
  const subheading = isLogin
    ? 'Sign in to continue where you left off.'
    : 'Create an account in seconds and start shopping.';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-w-md sm:rounded-2xl">
        <DialogTitle className="sr-only">
          Sign in or create an account
        </DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to your existing account or create a new one to continue.
        </DialogDescription>

        {/* Branded header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-headerBg via-[#1f5c1c] to-[#16401a] px-6 py-5 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-secondary/20 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg font-bold ring-1 ring-white/25 backdrop-blur-sm">
              B
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                {SITE_BRAND_SHORT}
              </p>
              <h2 className="truncate text-lg font-semibold leading-tight">
                {heading}
              </h2>
              <p className="mt-0.5 truncate text-xs text-white/80">
                {subheading}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs + active form */}
        <div className="px-5 pb-6 pt-5 sm:px-6">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as AuthTab)}
            className="w-full"
          >
            <TabsList className="grid h-10 w-full grid-cols-2 rounded-lg bg-slate-100 p-1">
              <TabsTrigger
                value="login"
                className="rounded-md text-sm font-medium text-slate-600 transition-colors data-[state=active]:bg-white data-[state=active]:text-headerBg data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md text-sm font-medium text-slate-600 transition-colors data-[state=active]:bg-white data-[state=active]:text-headerBg data-[state=active]:shadow-sm"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5">
              <LoginForm setOpen={setOpen} onLoginSuccess={onLoginSuccess} />
            </TabsContent>

            <TabsContent value="register" className="mt-5">
              <RegisterForm setOpen={setOpen} />
            </TabsContent>
          </Tabs>

          <p className="mt-5 text-center text-xs text-slate-500">
            {isLogin ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="font-semibold text-headerBg hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-semibold text-headerBg hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
