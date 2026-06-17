'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcher';

interface OrderChatButtonProps {
  invoiceId: string | number;
}

type UserProfileResponse = {
  status?: boolean;
  data?: {
    id?: number | string;
    name?: string;
    email?: string;
    phone?: string;
  };
};

type TicketStoreResponse = {
  status?: boolean | string;
  message?: string;
  ticket?: { ticket_id?: string };
  ticket_id?: string;
  data?: { ticket_id?: string };
};

function resolveTicketId(data: TicketStoreResponse): string | undefined {
  return data?.ticket?.ticket_id ?? data?.ticket_id ?? data?.data?.ticket_id;
}

export default function OrderChatButton({ invoiceId }: OrderChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpenChat = async () => {
    if (loading) return;
    setLoading(true);
    toast.loading('Creating support ticket...');

    try {
      const profileRes = await fetcher<UserProfileResponse>('/user-profile');
      const profile = profileRes?.data;
      const customerId = profile?.id != null ? String(profile.id) : '';

      if (!customerId) {
        toast.dismiss();
        toast.error('Please sign in to contact support.');
        return;
      }

      const name = String(profile?.name ?? '').trim();
      const email = String(profile?.email ?? '').trim();
      const phone = String(profile?.phone ?? '').trim();

      if (!name || !email || !phone) {
        toast.dismiss();
        toast.error(
          'Your profile is missing contact details. Update your account first.',
        );
        return;
      }

      const data = (await fetcher('/ticket-store', {
        method: 'POST',
        body: JSON.stringify({
          customer_id: customerId,
          name,
          email,
          phone,
          message: `Order support for ${String(invoiceId)}`,
        }),
      })) as TicketStoreResponse;
      console.log('🚀 ~ handleOpenChat ~ data:', data);

      toast.dismiss();

      const ok =
        data?.status === true ||
        data?.status === 'success' ||
        (typeof data?.status === 'string' &&
          data.status.toLowerCase() === 'success');
      const ticketId = resolveTicketId(data);

      if (!ok || !ticketId) {
        toast.error(
          data?.message || 'Failed to create support ticket. Please try again.',
        );
        return;
      }

      toast.success(data?.message || 'Ticket created. Redirecting to chat...');
      router.push(`/user/support/replay/${ticketId}`);
    } catch {
      toast.dismiss();
      toast.error('Failed to create support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded border-primary text-primary hover:bg-primary/5"
      onClick={handleOpenChat}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Support
        </>
      ) : (
        <>
          <MessageCircle className="mr-1 h-4 w-4" />
          Support
        </>
      )}
    </Button>
  );
}
