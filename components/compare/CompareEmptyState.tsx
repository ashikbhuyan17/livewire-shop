import Link from 'next/link';
import { GitCompareArrows, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MAX_COMPARE_PRODUCTS } from '@/lib/compare-utils';

export default function CompareEmptyState() {
  return (
    <Card className="border-2 border-dashed bg-white">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full bg-secondary/60 p-5">
          <GitCompareArrows className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Nothing to compare yet
        </h2>
        <p className="mt-3 max-w-md text-muted-foreground">
          Tap <strong>Compare</strong> on any product page or use the compare
          icon on product cards. You can add up to {MAX_COMPARE_PRODUCTS}{' '}
          products and review them here.
        </p>
        <Link href="/" className="mt-8">
          <Button
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse products
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
