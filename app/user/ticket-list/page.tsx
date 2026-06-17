import type { Metadata } from 'next';
import Link from 'next/link';
import { LifeBuoy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TicketsEmpty from '@/components/user/tickets/TicketsEmpty';
import TicketsList from '@/components/user/tickets/TicketsList';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import { fetchTicketList, type TicketItem } from '@/lib/tickets';

export const metadata: Metadata = buildPageMeta({
  title: 'Support tickets',
  description: 'View and manage your BestFood City support tickets.',
  pathname: '/user/ticket-list',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function TicketListPage() {
  const res = await fetchTicketList();
  const ok = res?.status === true;
  const tickets: TicketItem[] = ok && Array.isArray(res.data) ? res.data : [];

  return (
    <section className="mx-auto w-full max-w-[90rem] px-4 py-5 sm:px-6 sm:py-6">
      <header className="mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Support tickets
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                {tickets.length > 0
                  ? `${tickets.length} ticket${tickets.length === 1 ? '' : 's'} — track replies and order issues`
                  : 'Manage and track your support requests'}
              </p>
            </div>
          </div>

          {/* <Button
            asChild
            className="shrink-0 gap-2 rounded-full bg-headerBg hover:bg-headerBg/90"
          >
            <Link href="/user/support/create">
              <Plus className="h-4 w-4" />
              Create ticket
            </Link>
          </Button> */}
        </div>
      </header>

      {!ok ? (
        <div
          className="rounded-2xl border border-destructive/25 bg-destructive/5 px-5 py-4 text-sm text-destructive"
          role="alert"
        >
          {res?.message?.trim() ||
            'Could not load your tickets. Please try again later.'}
        </div>
      ) : tickets.length === 0 ? (
        <TicketsEmpty />
      ) : (
        <TicketsList tickets={tickets} />
      )}
    </section>
  );
}
