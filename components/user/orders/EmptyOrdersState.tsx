import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyOrdersState() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage all your grocery orders
          </p>
        </div>

        {/* Empty State Card */}
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            {/* Icon */}
            <div className="mb-4 rounded-full bg-muted p-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Text */}
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              You haven&apos;t placed any orders yet
            </h2>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Start shopping now and discover fresh groceries delivered to your
              doorstep.
            </p>

            {/* CTA Button */}
            <Link href="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
