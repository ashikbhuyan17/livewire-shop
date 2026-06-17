'use client';

import { useState } from 'react';
import { UserCircle, ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ProfileUpdateForm from './ProfileUpdateForm';
import PasswordUpdateForm from './PasswordUpdateForm';

type TabKey = 'profile' | 'security';

const TABS: Array<{
  value: TabKey;
  label: string;
  description: string;
  icon: typeof UserCircle;
}> = [
  {
    value: 'profile',
    label: 'Profile',
    description: 'Update your profile information.',
    icon: UserCircle,
  },
  {
    value: 'security',
    label: 'Security',
    description: 'Change your password and manage account access.',
    icon: ShieldCheck,
  },
];

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
};

export default function AccountTabs({ user }: Props) {
  const [active, setActive] = useState<TabKey>('profile');
  const current = TABS.find((t) => t.value === active) ?? TABS[0];

  return (
    <Tabs
      value={active}
      onValueChange={(v) => setActive(v as TabKey)}
      className="w-full"
    >
      <TabsList
        aria-label="Account settings sections"
        className="flex h-auto w-full justify-start gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-auto"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.value === active;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors sm:flex-none sm:px-4',
                'hover:text-slate-900',
                'data-[state=active]:bg-white data-[state=active]:text-headerBg data-[state=active]:shadow-sm',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-headerBg' : 'text-slate-400',
                )}
                aria-hidden
              />
              <span>{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <p className="mt-3 text-sm text-slate-500">{current.description}</p>

      <TabsContent value="profile" className="mt-6">
        <ProfileUpdateForm user={user} />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <PasswordUpdateForm />
      </TabsContent>
    </Tabs>
  );
}
