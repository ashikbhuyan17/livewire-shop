import { CURRENCY_SYMBOL, formatBDT } from '@/lib/order-utils';
import { cn } from '@/lib/utils';

type Props = {
  amount: string | number;
  className?: string;
};

export default function OrderMoney({ amount, className }: Props) {
  return (
    <span className={cn('tabular-nums', className)}>
      <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
      {formatBDT(amount)}
    </span>
  );
}
