import TicketInfoBar from '@/components/support/TicketInfoBar';
import TicketDetailsCard from '@/components/support/TicketDetailsCard';
import LiveChat, { type TicketChatMessage } from '@/components/support/LiveChat';
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';

function getStatusLabel(status: string) {
  return status === '1' ? 'Open' : status === '0' ? 'Closed' : status || 'N/A';
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: ticketId } = await params;
  if (!ticketId) notFound();

  const [listRes, replayRes] = await Promise.all([
    fetcher<{ status?: boolean; data?: Record<string, unknown>[] }>(
      '/ticket-list',
    ),
    fetcher<{ status?: boolean; data?: Record<string, unknown>[] }>(
      `/ticket-replay-list/${ticketId}`,
    ),
  ]);

  const ticketFromList = (listRes?.data || []).find(
    (t: Record<string, unknown>) => String(t?.ticket_id) === ticketId,
  ) as Record<string, unknown> | undefined;

  const chatData = replayRes?.data || [];

  const category = ticketFromList?.type
    ? String(ticketFromList.type)
    : 'General';
  const status = getStatusLabel(
    String(ticketFromList?.status ?? ticketFromList?.status ?? '1'),
  );
  const managerName = String(ticketFromList?.name ?? 'Support');

  const chatMessages: TicketChatMessage[] = chatData.map(
    (item: Record<string, unknown>) => ({
      id: item?.id as string | number | undefined,
      type:
        item?.replay != null && String(item.replay).trim() !== ''
          ? 'admin'
          : item?.replay_image != null &&
              String(item.replay_image).trim() !== ''
            ? 'admin'
            : 'user',
      message: String(item?.message ?? ''),
      replay: item?.replay != null ? String(item.replay) : undefined,
      image: item?.image != null ? String(item.image) : undefined,
      replay_image:
        item?.replay_image != null ? String(item.replay_image) : undefined,
      created_at:
        item?.created_at != null ? String(item.created_at) : undefined,
    }),
  );

  return (
    <div className="">
      <TicketInfoBar ticketId={ticketId} />

      <div className="py-3 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <TicketDetailsCard
              ticketId={ticketId}
              category={category}
              status={status}
              manager={managerName}
            />
          </div>

          <div className="space-y-6">
            <LiveChat
              ticketId={ticketId}
              ticket={chatMessages}
              managerName={managerName}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
