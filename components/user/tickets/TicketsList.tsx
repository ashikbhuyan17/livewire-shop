import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  formatTicketDateTime,
  getTicketOrderRef,
  getTicketStatusLabel,
  getTicketSubject,
  ticketHasAdminReply,
  ticketStatusStyles,
  type TicketItem,
} from '@/lib/tickets';
import { cn } from '@/lib/utils';

type Props = {
  tickets: TicketItem[];
};

function TicketAction({ ticket }: { ticket: TicketItem }) {
  const ticketId = ticket.ticket_id;
  const isOpen = getTicketStatusLabel(ticket.status) === 'Open';
  const label = isOpen ? 'Chat' : 'View';

  return (
    <Button
      asChild
      size="sm"
      className="rounded-full bg-headerBg hover:bg-headerBg/90"
    >
      <Link href={`/user/support/replay/${encodeURIComponent(ticketId)}`}>
        {label}
        <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}

function TicketRow({ ticket }: { ticket: TicketItem }) {
  const { date, time } = formatTicketDateTime(ticket.created_at);
  const status = ticketStatusStyles(ticket.status);
  const subject = getTicketSubject(ticket);
  const orderRef = getTicketOrderRef(ticket);
  const hasReply = ticketHasAdminReply(ticket);

  return (
    <tr className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30">
      <td className="px-4 py-3.5 align-top sm:px-5">
        <span className="block text-sm font-medium text-foreground">{date}</span>
        {time ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {time}
          </span>
        ) : null}
      </td>
      <td className="hidden px-4 py-3.5 align-top sm:table-cell sm:px-5">
        <span className="font-mono text-xs text-muted-foreground">
          {ticket.ticket_id}
        </span>
      </td>
      <td className="px-4 py-3.5 align-top sm:px-5">
        <p className="line-clamp-2 text-sm font-medium text-foreground">
          {subject}
        </p>
        {hasReply ? (
          <p className="mt-1 text-xs text-emerald-600">New reply</p>
        ) : null}
      </td>
      <td className="hidden px-4 py-3.5 align-top md:table-cell md:px-5">
        {orderRef ? (
          <Link
            href={`/user/orders/${encodeURIComponent(orderRef)}`}
            className="text-sm font-medium text-headerBg hover:underline"
          >
            {orderRef}
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3.5 text-center align-top sm:px-5">
        <span
          className={cn(
            'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
            status.className,
          )}
        >
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right align-top sm:px-5">
        <TicketAction ticket={ticket} />
      </td>
    </tr>
  );
}

function TicketCard({ ticket }: { ticket: TicketItem }) {
  const { date, time } = formatTicketDateTime(ticket.created_at);
  const status = ticketStatusStyles(ticket.status);
  const subject = getTicketSubject(ticket);
  const orderRef = getTicketOrderRef(ticket);
  const hasReply = ticketHasAdminReply(ticket);

  return (
    <Card className="overflow-hidden rounded-xl border border-border/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">
            {subject}
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {ticket.ticket_id}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium',
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>
          {date}
          {time ? ` · ${time}` : ''}
        </span>
        {orderRef ? (
          <Link
            href={`/user/orders/${encodeURIComponent(orderRef)}`}
            className="font-medium text-headerBg hover:underline"
          >
            {orderRef}
          </Link>
        ) : null}
        {hasReply ? (
          <span className="font-medium text-emerald-600">New reply</span>
        ) : null}
      </div>

      <div className="mt-4 flex justify-end">
        <TicketAction ticket={ticket} />
      </div>
    </Card>
  );
}

export default function TicketsList({ tickets }: Props) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                  Date
                </th>
                <th className="hidden px-4 py-3 font-semibold text-foreground sm:table-cell sm:px-5">
                  Ticket ID
                </th>
                <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                  Subject
                </th>
                <th className="hidden px-4 py-3 font-semibold text-foreground md:table-cell md:px-5">
                  Order
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground sm:px-5">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-foreground sm:px-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </>
  );
}
