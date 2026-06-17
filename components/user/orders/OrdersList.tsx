import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import OrderMoney from '@/components/user/orders/OrderMoney';
import OrderChatButton from '@/components/support/OrderChatButton';
import { formatOrderDate, getOrderStatusBadgeVariant } from '@/lib/order-utils';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[];
  total: number;
};

export default function OrdersList({ orders, total }: Props) {
  if (orders.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <CardContent className="py-12 text-center text-muted-foreground">
          No orders match your search or filter.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">
        {total} order{total !== 1 ? 's' : ''} found
      </p>
      <ul className="space-y-3">
        {orders.map((order) => {
          const statusName = order?.order_status?.status_name ?? 'Unknown';
          return (
            <li key={order.id}>
              <Card className="border-border shadow-none transition-colors hover:bg-muted/30">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-foreground">
                      {order.invoiceID}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatOrderDate(order.order_date)}
                    </p>
                    <Badge
                      variant={getOrderStatusBadgeVariant(statusName)}
                      className="mt-1"
                    >
                      {statusName}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row sm:items-center sm:gap-4">
                    <OrderMoney
                      amount={order.total}
                      className="text-lg font-bold text-foreground"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/user/orders/${encodeURIComponent(order.invoiceID)}`}
                        >
                          View details
                        </Link>
                      </Button>
                      <OrderChatButton invoiceId={order.invoiceID} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
