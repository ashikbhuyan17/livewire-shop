'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  address: string;
  email: string;
  phone: string;
};

function ContactInfo({ address, email, phone }: Props) {
  const items = [
    {
      icon: MapPin,
      label: 'Visit us',
      value: address,
      href: address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined,
      external: true,
    },
    {
      icon: Phone,
      label: 'Call us',
      value: phone,
      href: phone ? `tel:${phone.replace(/\s/g, '')}` : undefined,
    },
    {
      icon: Mail,
      label: 'Email us',
      value: email,
      href: email ? `mailto:${email}` : undefined,
    },
  ].filter((item) => item.value?.trim());

  const hours = [
    { day: 'Mon – Sat', time: '10:00 AM – 9:00 PM' },
    { day: 'Sunday', time: '11:00 AM – 8:00 PM' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col border-primary/20 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-5">
          <CardTitle className="font-sans text-xl text-primary sm:text-2xl">
            Contact Information
          </CardTitle>
          <CardDescription className="max-w-sm font-sans text-sm leading-relaxed">
            Reach our support team for orders, product questions, or store visits.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col space-y-6 p-6 sm:p-8">
          <ul className="space-y-3">
            {items.map((item) => {
              const Icon = item.icon;
              const inner = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-primary/70">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm font-medium leading-relaxed text-slate-800">
                      {item.value}
                    </span>
                  </span>
                  {item.href ? (
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-primary" />
                  ) : null}
                </>
              );

              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-primary/25 hover:bg-white hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-primary/10">
                <Clock className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-sans text-sm font-bold text-slate-900">
                  Business Hours
                </p>
                <p className="font-sans text-xs text-slate-500">
                  We&apos;re here when you need us
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/80 px-3 py-2.5 text-sm ring-1 ring-white"
                >
                  <span className="font-medium text-slate-700">{row.day}</span>
                  <span
                    className={cn(
                      'text-right font-semibold',
                      row.day === 'Sunday' ? 'text-primary' : 'text-slate-900',
                    )}
                  >
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-auto rounded-xl bg-primary/5 px-4 py-3 text-center text-xs leading-relaxed text-slate-600 ring-1 ring-primary/10">
            Typical response time is within{' '}
            <span className="font-semibold text-primary">24 hours</span> on
            business days.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ContactInfo;
