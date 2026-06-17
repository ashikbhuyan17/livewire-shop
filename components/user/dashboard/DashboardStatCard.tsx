import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  todayLabel?: string;
  todayValue?: ReactNode;
  showToday?: boolean;
  accent?: 'default' | 'emerald' | 'amber' | 'sky' | 'rose' | 'violet';
  className?: string;
};

const accentStyles = {
  default: 'bg-headerBg/10 text-headerBg',
  emerald: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  amber: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  sky: 'bg-sky-500/12 text-sky-700 dark:text-sky-400',
  rose: 'bg-rose-500/12 text-rose-700 dark:text-rose-400',
  violet: 'bg-violet-500/12 text-violet-700 dark:text-violet-400',
};

export default function DashboardStatCard({
  label,
  value,
  icon,
  todayLabel = 'Today',
  todayValue,
  showToday = true,
  accent = 'default',
  className,
}: Props) {
  const showTodayLine =
    showToday && todayValue !== undefined && todayValue !== null;

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.02] sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          {showTodayLine ? (
            <p className="mt-1.5 text-xs text-slate-500">
              <span className="font-semibold tabular-nums text-slate-700">
                {todayValue}
              </span>{' '}
              {todayLabel}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            accentStyles[accent],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
