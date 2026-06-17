import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OrderMoney from '@/components/user/orders/OrderMoney';
import OrderChatButton from '@/components/support/OrderChatButton';
import {
  formatOrderDate,
  getOrderStatusBadgeVariant,
  orderImageUrl,
} from '@/lib/order-utils';

type OrderDetail = Record<string, unknown>;
type OrderProduct = Record<string, unknown>;

function orderField(order: OrderDetail, key: string): string {
  const v = order[key];
  return v != null ? String(v) : '';
}

export default function OrderDetailsView({ order }: { order: OrderDetail }) {
  const status = order.order_status as Record<string, unknown> | undefined;
  const statusName = orderField(status ?? {}, 'status_name') || 'Unknown';
  const products = Array.isArray(order.order_products)
    ? (order.order_products as OrderProduct[])
    : [];

  const summaryRows = [
    { label: 'Subtotal', value: order?.subtotal },
    order?.vat != null && {
      label: `VAT (${order?.vat_percentage ?? 0}%)`,
      value: order?.vat,
    },
    order?.tax != null && {
      label: `Tax (${order?.tax_percentage ?? 0}%)`,
      value: order?.tax,
    },
    order?.delivery_charge != null && {
      label: 'Delivery',
      value: order?.delivery_charge,
    },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
          <Link href="/user/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to orders
          </Link>
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {orderField(order, 'invoiceID')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {formatOrderDate(orderField(order, 'order_date'))}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={getOrderStatusBadgeVariant(statusName)}
              className="w-fit text-sm"
            >
              {statusName}
            </Badge>
            <OrderChatButton
              invoiceId={
                orderField(order, 'invoiceID') || orderField(order, 'id')
              }
            />
          </div>
        </div>
      </header>

      {orderField(order, 'customer_note') ? (
        <Card className="mb-6 border-amber-200/80 bg-amber-50/50">
          <CardContent className="py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-800/80">
              Delivery note
            </p>
            <p className="mt-1 text-sm text-foreground">
              {orderField(order, 'customer_note')}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-muted-foreground" />
                Items ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {products.map((item) => {
                const lineTotal =
                  Number(item.product_price) * Number(item.quantity);
                return (
                  <article
                    key={orderField(item, 'id')}
                    className="flex gap-3 rounded-lg border border-border p-3 sm:gap-4"
                  >
                    <figure className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted sm:h-20 sm:w-20">
                      <Image
                        src={orderImageUrl(orderField(item, 'thumbnail_img'))}
                        alt={orderField(item, 'product_name') || 'Product'}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </figure>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${orderField(item, 'slug')}`}
                        className="line-clamp-2 font-medium text-foreground hover:text-primary"
                      >
                        {orderField(item, 'product_name')}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {orderField(item, 'product_SKU')}
                        {orderField(item, 'color')
                          ? ` · ${orderField(item, 'color')}`
                          : ''}
                        {orderField(item, 'variant') &&
                        orderField(item, 'variant') !== 'No Variant'
                          ? ` · ${orderField(item, 'variant')}`
                          : ''}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        <OrderMoney
                          amount={orderField(item, 'product_price')}
                        />{' '}
                        × {orderField(item, 'quantity')}
                      </p>
                    </div>
                    <aside className="shrink-0 text-right">
                      <OrderMoney
                        amount={lineTotal}
                        className="font-semibold text-foreground"
                      />
                    </aside>
                  </article>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="text-lg">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summaryRows.map((row) => (
              <p key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <OrderMoney amount={row.value} className="font-medium" />
              </p>
            ))}
            <Separator />
            <p className="flex justify-between">
              <span className="font-semibold">Total</span>
              <OrderMoney
                amount={orderField(order, 'total') || 0}
                className="text-lg font-bold text-primary"
              />
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
