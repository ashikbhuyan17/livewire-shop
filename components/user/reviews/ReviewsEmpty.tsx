import Link from 'next/link';
import { MessageSquareText, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReviewsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center sm:py-24">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <MessageSquareText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        No reviews yet
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        When you rate products after purchase, your reviews will show up here
        with status and seller replies.
      </p>
      <Button asChild className="mt-8 gap-2 rounded-full px-6" size="lg">
        <Link href="/">
          <ShoppingBag className="h-4 w-4" />
          Start shopping
        </Link>
      </Button>
    </div>
  );
}
