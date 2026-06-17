import { fetcher } from '@/lib/fetcher';

export type TicketDetail = {
  id: number;
  tkt_id: string;
  ticket_id: string;
  message: string;
  replay: string | null;
  image: string | null;
  replay_image: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type TicketItem = {
  id: number;
  customer_id: string;
  ticket_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_id?: string | null;
  type?: string | null;
  ticketdetails: TicketDetail[];
};

export type TicketListApiResponse = {
  status?: boolean;
  message?: string;
  data?: TicketItem[];
};

export async function fetchTicketList(): Promise<TicketListApiResponse> {
  return fetcher<TicketListApiResponse>(
    '/ticket-list',
    { cache: 'no-store' },
    false,
  );
}

export function getTicketStatusLabel(status: string | null | undefined): string {
  const s = String(status ?? '').trim();
  if (s === '1') return 'Open';
  if (s === '0') return 'Closed';
  return s || 'Unknown';
}

export function ticketStatusStyles(status: string | null | undefined) {
  const label = getTicketStatusLabel(status);
  if (label === 'Open') {
    return {
      label,
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300',
    };
  }
  if (label === 'Closed') {
    return {
      label,
      className:
        'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300',
    };
  }
  return {
    label,
    className: 'border-border bg-muted/60 text-muted-foreground',
  };
}

/** First message preview from ticket thread. */
export function getTicketSubject(ticket: TicketItem): string {
  const first = ticket.ticketdetails?.[0]?.message?.trim();
  return first || 'Support request';
}

/** Resolve linked order from API field or message text (e.g. "Order support for OR-00050"). */
export function getTicketOrderRef(ticket: TicketItem): string | null {
  const raw = ticket.order_id;
  if (raw != null && String(raw).trim() !== '') {
    return String(raw).trim();
  }
  const message = ticket.ticketdetails?.[0]?.message ?? '';
  const match = message.match(/\bOR-[\w-]+\b/i);
  return match?.[0] ?? null;
}

export function ticketHasAdminReply(ticket: TicketItem): boolean {
  return (ticket.ticketdetails ?? []).some(
    (d) =>
      (d.replay != null && String(d.replay).trim() !== '') ||
      (d.replay_image != null && String(d.replay_image).trim() !== ''),
  );
}

export function formatTicketDateTime(dateString: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!dateString) return { date: '—', time: '' };
  try {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  } catch {
    return { date: String(dateString), time: '' };
  }
}
