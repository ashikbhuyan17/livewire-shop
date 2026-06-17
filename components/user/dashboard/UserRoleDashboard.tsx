import Link from 'next/link';
import {
  Heart,
  Package,
  Clock3,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserDashboardData } from '@/lib/dashboard-utils';
import DashboardStatCard from './DashboardStatCard';

type Props = {
  data: UserDashboardData;
};

export default function UserRoleDashboard({ data }: Props) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DashboardStatCard
            label="Total orders"
            value={data.totalOrders}
            icon={<Package className="h-5 w-5" strokeWidth={2} />}
            accent="default"
            showToday={false}
          />
          <DashboardStatCard
            label="Pending orders"
            value={data.pendingOrders}
            icon={<Clock3 className="h-5 w-5" strokeWidth={2} />}
            accent="amber"
            showToday={false}
          />
          <DashboardStatCard
            label="Wishlist items"
            value={data.wish}
            icon={<Heart className="h-5 w-5" strokeWidth={2} />}
            accent="rose"
            showToday={false}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Today
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DashboardStatCard
            label="Today total orders"
            value={data.todayTotalOrders}
            icon={<CalendarDays className="h-5 w-5" strokeWidth={2} />}
            accent="default"
            showToday={false}
          />
          <DashboardStatCard
            label="Today pending orders"
            value={data.todayPendingOrders}
            icon={<Clock3 className="h-5 w-5" strokeWidth={2} />}
            accent="amber"
            showToday={false}
          />
          <DashboardStatCard
            label="Today wishlist"
            value={data.todayWish}
            icon={<Heart className="h-5 w-5" strokeWidth={2} />}
            accent="rose"
            showToday={false}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-xl bg-headerBg hover:bg-headerBg/90">
          <Link href="/user/orders">
            View orders
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/user/wishlist">Open wishlist</Link>
        </Button>
      </div>
    </div>
  );
}
