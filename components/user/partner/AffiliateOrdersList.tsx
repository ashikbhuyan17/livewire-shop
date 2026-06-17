import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import OrderMoney from '@/components/user/orders/OrderMoney';
import {
  formatOrderDate,
  getOrderStatusBadgeVariant,
  orderImageUrl,
} from '@/lib/order-utils';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[];
};

export default function AffiliateOrdersList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 shadow-none">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No referral orders yet. Share your partner link to start earning.
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => {
        const statusName = order?.order_status?.status_name ?? 'Unknown';
        const products = Array.isArray(order.order_products)
          ? order.order_products
          : [];

        return (
          <li key={order.id}>
            <Card className="overflow-hidden border-slate-200/80 shadow-sm">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-slate-900">
                      {order.invoiceID}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatOrderDate(order.order_date ?? order.created_at)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Badge variant={getOrderStatusBadgeVariant(statusName)}>
                        {statusName}
                      </Badge>
                      {order.payment ? (
                        <Badge variant="outline">{order.payment}</Badge>
                      ) : null}
                      {order.payment_method ? (
                        <Badge variant="outline">{order.payment_method}</Badge>
                      ) : null}
                    </div>
                  </div>
                  <OrderMoney
                    amount={order.total}
                    className="text-xl font-bold text-slate-900"
                  />
                </div>

                {products.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {products.map((product: Record<string, unknown>) => (
                      <li
                        key={String(product.id)}
                        className="flex items-center gap-3 p-4"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                          <Image
                            src={orderImageUrl(
                              typeof product.thumbnail_img === 'string'
                                ? product.thumbnail_img
                                : null,
                            )}
                            alt={String(product.product_name ?? 'Product')}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {String(product.product_name ?? 'Product')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[product.color, product.variant]
                              .filter(Boolean)
                              .join(' · ')}{' '}
                            × {String(product.quantity ?? '1')}
                          </p>
                        </div>
                        <OrderMoney
                          amount={String(product.product_price ?? '0')}
                          className="shrink-0 text-sm font-semibold"
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}

                {(order.coupon_name || order.points_used) && (
                  <div className="border-t border-slate-100 bg-white px-4 py-3 text-xs text-muted-foreground">
                    {order.coupon_name ? (
                      <span>
                        Coupon: {order.coupon_name} (−
                        {order.coupon_discount})
                      </span>
                    ) : null}
                    {order.points_used &&
                    Number(order.points_used) > 0 ? (
                      <span className={order.coupon_name ? ' · ' : ''}>
                        Points used: {order.points_used}
                      </span>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
