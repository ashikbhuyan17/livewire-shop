import Link from 'next/link';
import { LifeBuoy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TicketsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center sm:py-24">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <LifeBuoy className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        No support tickets yet
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        When you contact us about an order or issue, your tickets will appear
        here so you can track replies.
      </p>
      <Button asChild className="mt-8 gap-2 rounded-full px-6" size="lg">
        <Link href="/user/support/create">
          <Plus className="h-4 w-4" />
          Create ticket
        </Link>
      </Button>
    </div>
  );
}
