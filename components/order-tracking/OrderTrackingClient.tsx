'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Package,
  PackageCheck,
  Search,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = {
  icon: typeof Package;
  title: string;
  desc: string;
  done: boolean;
  active?: boolean;
};

const DEMO_STEPS: Step[] = [
  {
    icon: PackageCheck,
    title: 'Order Confirmed',
    desc: 'We have received your order.',
    done: true,
  },
  {
    icon: Package,
    title: 'Packed',
    desc: 'Your items are packed and ready.',
    done: true,
  },
  {
    icon: Truck,
    title: 'Out for Delivery',
    desc: 'Your order is on the way.',
    done: false,
    active: true,
  },
  {
    icon: CheckCircle2,
    title: 'Delivered',
    desc: 'Order delivered to your address.',
    done: false,
  },
];

export default function OrderTrackingClient() {
  const [orderId, setOrderId] = useState('');
  const [tracked, setTracked] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setTracked(orderId.trim());
  };

  return (
    <div className="mx-auto min-h-[60vh] max-w-3xl px-3 py-10 sm:px-4 sm:py-14 lg:px-6">
      <div className="text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Truck className="h-7 w-7" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Track Your Order Using Order ID
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your order ID below to see the latest delivery status.
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="mx-auto mt-7 flex max-w-xl items-stretch gap-2.5"
      >
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter order ID"
          className="h-12 flex-1 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-primary"
          aria-label="Order ID"
        />
        <Button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-secondary px-6 font-bold text-slate-900 shadow-sm hover:bg-secondary/90"
        >
          <Search className="h-5 w-5" strokeWidth={2.25} />
          <span className="ml-1.5 hidden sm:inline">Track</span>
        </Button>
      </form>

      {tracked ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Order ID
              </p>
              <p className="text-base font-bold text-slate-900">#{tracked}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Out for Delivery
            </span>
          </div>

          <ol className="mt-5 space-y-0">
            {DEMO_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === DEMO_STEPS.length - 1;
              return (
                <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast ? (
                    <span
                      className={`absolute left-[18px] top-9 h-[calc(100%-1.5rem)] w-0.5 ${
                        step.done ? 'bg-primary' : 'bg-slate-200'
                      }`}
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? 'bg-primary text-white'
                        : step.active
                          ? 'bg-secondary text-slate-900 ring-4 ring-secondary/20'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : step.active ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </span>
                  <div className="pt-1">
                    <p
                      className={`text-sm font-semibold ${
                        step.done || step.active
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
            This is a demo tracking result. Live tracking will be available once
            connected to the order system.
          </p>
        </div>
      ) : (
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-primary"
          >
            ← Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
