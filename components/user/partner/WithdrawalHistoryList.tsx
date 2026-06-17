import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import { formatOrderDate } from '@/lib/order-utils';
import { withdrawalStatusLabel } from '@/lib/partner-utils';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
};

export default function WithdrawalHistoryList({ items }: Props) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 shadow-none">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No withdrawal requests yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const status = withdrawalStatusLabel(item.status);
        return (
          <li key={item.id}>
            <Card className="border-slate-200/80 shadow-none transition-colors hover:bg-slate-50/50">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="font-mono text-sm font-semibold text-slate-900">
                    {item.invoiceID ?? `WD-${item.id}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatOrderDate(item.created_at)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {item.payment_method} · {item.account_number}
                  </p>
                  {item.payment_details ? (
                    <p className="text-xs text-muted-foreground">
                      {item.payment_details}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <p className="text-lg font-bold tabular-nums text-slate-900">
                    <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                    {formatAmount(item.amount)}
                  </p>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
